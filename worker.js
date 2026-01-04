export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/evaluate") {
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: corsHeaders() });
    }
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders() });
    }

    const rateStatus = rateLimit(request);
    if (!rateStatus.ok) {
      return new Response(JSON.stringify({ error: "Too many requests. Please slow down." }), { status: 429, headers: corsHeaders() });
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return new Response(JSON.stringify({ error: "Content-Type must be multipart/form-data" }), { status: 400, headers: corsHeaders() });
    }

    const contentLength = Number(request.headers.get("content-length") || 0);
    const MAX_BYTES = 15 * 1024 * 1024; // 15MB cap
    if (contentLength && contentLength > MAX_BYTES) {
      return new Response(JSON.stringify({ error: "Payload too large" }), { status: 413, headers: corsHeaders() });
    }

    let form;
    try {
      form = await request.formData();
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid form data" }), { status: 400, headers: corsHeaders() });
    }

    const photos = ["photo1", "photo2", "photo3"].map((key) => form.get(key));
    const itemType = (form.get("itemType") || "").toString().trim().toLowerCase();

    if (!itemType || !["clothing", "curtain", "other fabric"].includes(itemType)) {
      return new Response(JSON.stringify({
        stage: null,
        label: "Unsupported item",
        confidence: 0,
        confidence_label: "low",
        issues_detected: [],
        repair_needed: false,
        notes: "Only fabric items are supported. Choose clothing, curtain, or other fabric."
      }), { status: 400, headers: corsHeaders() });
    }

    if (photos.some((p) => !isImageFile(p))) {
      return new Response(JSON.stringify({ error: "All three images are required and must be images." }), { status: 400, headers: corsHeaders() });
    }

    const MAX_FILE = 6 * 1024 * 1024; // 6MB per image (post compression expected)
    const totalBytes = photos.reduce((sum, file) => sum + (file.size || 0), 0);
    if (!totalBytes) {
      return new Response(JSON.stringify({ error: "Images missing or empty." }), { status: 400, headers: corsHeaders() });
    }
    if (totalBytes > MAX_BYTES) {
      return new Response(JSON.stringify({ error: "Images too large after compression." }), { status: 413, headers: corsHeaders() });
    }
    if (photos.some((p) => (p.size || 0) > MAX_FILE)) {
      return new Response(JSON.stringify({ error: "A single image exceeds the allowed size." }), { status: 413, headers: corsHeaders() });
    }

    // Basic non-fabric guard by filename cue (lightweight heuristic)
    const nameStr = photos.map((p) => (p.name || "").toLowerCase()).join(" ");
    const banned = ["shoe", "boot", "sneaker", "watch", "ring", "necklace", "phone", "laptop", "tablet", "camera", "electronics"];
    if (banned.some((word) => nameStr.includes(word))) {
      return new Response(JSON.stringify({
        stage: null,
        label: "Non-fabric item",
        confidence: 0,
        confidence_label: "low",
        issues_detected: [],
        repair_needed: false,
        notes: "Only fabric items are supported (clothing, curtains, textiles)."
      }), { status: 400, headers: corsHeaders() });
    }

    try {
      const payload = await runEvaluation(photos, itemType, env);
      return new Response(JSON.stringify(payload), { status: 200, headers: corsHeaders() });
    } catch (err) {
      const mock = mockResponse("Service unavailable, returning mock.");
      mock.mock = true;
      return new Response(JSON.stringify(mock), { status: 200, headers: corsHeaders() });
    }
  }
};

function corsHeaders() {
  return {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "Content-Type, Accept"
  };
}

async function runEvaluation(files, itemType, env) {
  if (!env.AI_API_KEY) {
    return mockResponse("No AI_API_KEY set. Returning mock response.");
  }

  const imagesBase64 = [];
  for (const file of files) {
    try {
      imagesBase64.push(await toBase64(file));
    } catch (err) {
      return mockResponse("Could not process images. Returning mock response.");
    }
  }
  const rubric = `
You are a fabric condition rater. Score 1-5 using:
1 Unwearable: major tears/holes, heavy staining, severe degradation
2 Needs fixing: missing buttons, seam rip, small hole, zipper issue
3 Home use: noticeable wear/stains/fading/pilling; ok mainly for home
4 Used but wearable: minor signs; no major defects
5 Like new: no visible defects
Refuse non-fabric items. Output JSON with keys: stage (1-5 or null), label, confidence (0-1), confidence_label (low|medium|high), issues_detected (array), repair_needed (bool), notes (string).
  `.trim();

  const userText = `Item type: ${itemType}. Rate the fabric condition from the three photos.`;
  const visionPayload = {
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: rubric },
      {
        role: "user",
        content: [
          { type: "text", text: userText },
          ...imagesBase64.map((b64) => ({
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${b64}` }
          }))
        ]
      }
    ]
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${env.AI_API_KEY}`
    },
    body: JSON.stringify(visionPayload)
  });

  if (!res.ok) {
    throw new Error(`AI HTTP ${res.status}`);
  }
  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content || "";
  return safeParseResponse(text);
}

async function toBase64(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  const chunks = [];
  for (let i = 0; i < bytes.length; i += chunkSize) {
    chunks.push(String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize)));
  }
  return btoa(chunks.join(""));
}

function safeParseResponse(text) {
  try {
    const parsed = JSON.parse(text);
    return normalizePayload(parsed);
  } catch (err) {
    return mockResponse("AI response could not be parsed. Returning mock.");
  }
}

function normalizePayload(data) {
  const stage = data.stage ?? null;
  const conf = Number(data.confidence ?? 0);
  return {
    stage: stage === null ? null : clamp(stage, 1, 5),
    label: data.label || stageLabels()[clamp(stage, 1, 5) - 1] || "Rated",
    confidence: isFinite(conf) ? conf : 0,
    confidence_label: data.confidence_label || confidenceLabel(conf),
    issues_detected: Array.isArray(data.issues_detected) ? data.issues_detected : [],
    repair_needed: Boolean(data.repair_needed),
    notes: data.notes || "No notes provided."
  };
}

function confidenceLabel(value) {
  if (value >= 0.75) return "high";
  if (value >= 0.45) return "medium";
  return "low";
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function stageLabels() {
  return ["Threadbare Tales", "Needs TLC", "Home Comfort", "Street Ready", "Like New"];
}

function mockResponse(notes) {
  const stage = 4;
  return {
    stage,
    label: stageLabels()[stage - 1],
    confidence: 0.52,
    confidence_label: "medium",
    issues_detected: ["light fading", "minor pilling"],
    repair_needed: false,
    notes
  };
}

// --- utilities ---
function isImageFile(p) {
  return p && typeof p === "object" && typeof p.type === "string" && p.type.startsWith("image/") && typeof p.size === "number";
}

const rateMap = new Map(); // in-memory, per-worker instance
function rateLimit(request) {
  const now = Date.now();
  const WINDOW = 60_000; // 60s
  const LIMIT = 20; // 20 requests per window per client
  const key = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "anon";
  const bucket = rateMap.get(key) || [];
  const recent = bucket.filter((ts) => now - ts < WINDOW);
  if (recent.length >= LIMIT) {
    rateMap.set(key, recent);
    return { ok: false };
  }
  recent.push(now);
  rateMap.set(key, recent);
  return { ok: true };
}
