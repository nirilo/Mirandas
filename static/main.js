(function () {
const galleryItems = [
  {
    before: "assets/images/denim_before.webp",
    after: "assets/images/denim_after.webp",
    title: { en: "Denim repair", el: "Επιδιόρθωση τζιν" },
    note: {
      en: "Invisible patch & color-match stitching.",
      el: "Μπάλωμα με ραφές που δεν ενοχλούν το δέρμα."
    },
    aria: { en: "Show denim repair", el: "Προβολή επιδιόρθωσης τζιν" }
  },
  {
    before: "assets/images/dress_before.webp",
    after: "assets/images/dress_after.webp",
    title: { en: "Evening dress hem", el: "Στρίφωμα βραδινού φορέματος" },
    note: {
      en: "Hand-finished hem; original drape preserved.",
      el: "Καλά εδώ υπερβάλλαμε λιγάκι, αλλά εντάξει. Κάτι τέτοιο."
    },
    aria: { en: "Show evening dress hem", el: "Προβολή στριφώματος φορέματος" }
  },
  {
    before: "assets/images/curtain_before.webp",
    after: "assets/images/curtain_after.webp",
    title: { en: "Curtain resizing", el: "Κόντεμα κουρτινών" },
    note: {
      en: "Custom length + new header tape.",
      el: "Προσαρμοσμένο μήκος και τοποθέτηση νέας τρέσας."
    },
    aria: { en: "Show curtain resizing", el: "Προβολή κοψίματος κουρτινών" }
  }
];

const specTranslations = {
  en: {
    brandSubtitle: "atelier",
    nav: {
      home: "Home",
      about: "About",
      work: "Work",
      contact: "Contact",
      condition: "Condition Rater",
      toggle: "GR"
    },
    heroTag: "Made-to-measure care",
    heroLead:
      '<strong>Clothing repairs & alterations in Sepolia, Athens</strong>, from jeans to bridal wear and home textiles.',
    heroBtnPrimary: "Book a fitting",
    heroBtnSecondary: "See work",
    hoursLabel: "Hours",
    hoursValue: "Mon-Fri, 09:00-15:00, 17:00-21:00",
    locationLabel: "Location",
    locationValue: "Athens, Sepolia, GR",
    heroQuote: '"We keep the original look - minimal on the outside, maximum care inside."',
    heroList: [
      "Invisible mending for denim",
      "Hand-finished hems & bridal adjustments",
      "Home textiles resized with care"
    ],
    aboutTitle: "About the atelier",
    aboutLead: "I'm Miranda, a tailor who keeps your favorites in rotation with light, respectful alterations.",
    pills: ["Tailored fits", "Mindful mending", "Home textiles"],
    specialtiesTitle: "Specialties",
    specialtiesList: [
      "Bridal and evening wear adjustments",
      "Denim darning, color-matched threads",
      "Curtain and upholstery tailoring"
    ],
    workHeading: "Before & After",
    workSubtitle: "Small miracles, stitched by hand.",
    beforeLabel: "Before",
    afterLabel: "After",
    cards: [
      { title: "Custom fits", body: "Waist, bust, and hem adjustments that honor the garment's lines." },
      { title: "Repair & revive", body: "Mending, darning, and reinforcing high-wear areas with color-matched thread." },
      { title: "Home textiles", body: "Curtains resized, cushions refreshed, linens finished with neat seams." }
    ],
    contactHeading: "Contact",
    contactEmail: "<strong>Email:</strong>",
    contactPhoneLabel: "Phone:",
    contactEmailLabel: "Email:",
    revealPhone: "Phone number",
    phoneLoading: "Loading phone number…",
    phoneError: "The number is unavailable. Please try again or use the contact form.",
    phoneReady: "Ready to call.",
    revealEmail: "Email us",
    contactAddress: "<strong>Address:</strong> 88 Avlonos, Sepolia, Athens, Greece",
    backTop: "Back to top",
    formTitle: "Book a fitting ❤",
    labelName: "Name",
    labelEmail: "Email",
    labelDetails: "What do you need?",
    detailsPlaceholder: "Hem, repair, bridal fitting... an idea maybe?",
    labelPhotos: "Reference photos (up to 5; 4 MB each, 10 MB total)",
    formSubmit: "Send request",
    formNote: "Send your request and we'll get back to you soon.",
    formSending: "Sending...",
    formConfirm: "Request sent. We'll reply soon.",
    formError: "Could not send. Please try again.",
    fileSelectedPrefix: "Selected",
    footerNote: "&copy; <span id=\"year\"></span> Miranda's - Creative repairs & alterations",
    footerAbout: "About",
    footerContact: "Contact"
  },
  el: {
    brandSubtitle: "ατελιέ",
    nav: {
      home: "Αρχική",
      about: "Σχετικά",
      work: "Δουλειές",
      contact: "Επικοινωνία",
      condition: "Αξιολόγηση υφάσματος",
      toggle: "EN"
    },
    heroTag: "Μοδίστρα",
    heroLead:
      '<strong>Επιδιορθώσεις και μεταποιήσεις ρούχων στα Σεπόλια, Αθήνα.</strong> Φροντίδα για το αγαπημένο σας τζιν, το νυφικό και τα υφάσματα του σπιτιού.',
    heroBtnPrimary: "Κλείστε ραντεβού",
    heroBtnSecondary: "Δείτε δουλειές",
    hoursLabel: "Ωράριο",
    hoursValue: "Δευ-Παρ, 09:00-15:00, 17:00-21:00",
    locationLabel: "Περιοχή",
    locationValue: "Αθήνα, Σεπόλια",
    heroQuote: "Κρατάμε το αρχικό ύφος με τις απαραίτητες παρεμβάσεις, και τη μέγιστη φροντίδα και προσοχή.",
    heroList: [
      "Αόρατες επιδιορθώσεις σε denim",
      "Στριφώματα στο χέρι και προσαρμογές σε βραδινά φορέματα.",
      "Μεταποίηση κουρτινών με επίσκεψη κατ'οίκον για μέτρηση."
    ],
    aboutTitle: "Σχετικά με το εργαστήρι",
    aboutLead:
      "Είμαι η Miranda, η μοδίστρα που χρειάζεστε για να κρατήσετε τα αγαπημένα σας ρούχα σε χρήση ακριβώς όπως τα έχετε φανταστεί! (ή και καλύτερα! 😉)",
    pills: ["Δημιουργικότητα", "Φαντασία", "Αισθητική"],
    specialtiesTitle: "Μερικές Ιδέες...",
    specialtiesList: [
      "Στένεμα μέσης ή φάρδεμα σε τουαλέτες, τοποθέτηση caps, επιδιόρθωση ντεκολτέ",
      "Ανανέωση των τζιν με ραφές στο ίδιο χρώμα, προεκτάσεις, μπάλωμα καβάλου, στρίφωμα με ορίτζιναλ, κρόσια / διασκοσμητικά σκισίματα",
      "Τοποθέτηση μανικιών, Ανέβασμα ώμων, Στένεμα, Κόντεμα, Προσθήκη / Αλλαγή φόδρας"
    ],
    workHeading: "Πριν & Μετά",
    workSubtitle: "Μικρά θαύματα, ραμμένα με αγάπη και φροντίδα ⠂˖❥࿐",
    beforeLabel: "Πριν",
    afterLabel: "Μετά",
    cards: [
      {
        title: "Εφαρμογές στα μέτρα σας...",
        body: "Μετατροπές σε μέση, στήθος και μήκος που σέβονται το στύλ του ρούχου, ή ακόμα και του δίνουν νέο αέρα!"
      },
      {
        title: "Επιδιόρθωση & ανανέωση ρούχων!",
        body: "Τι καλύτερο από το να βλέπετε το ρούχο σας να ξαναζωντανεύει!"
      },
      {
        title: "Υφάσματα σπιτιού",
        body: "Κουρτίνες ραμμένες στο σωστό μήκος, μαξιλαροθήκες και μαξιλάρες καναπέ, λευκά είδη..."
      }
    ],
    contactHeading: "Επικοινωνία",
    contactEmail: "<strong>Email:</strong>",
    contactPhoneLabel: "Τηλέφωνο:",
    contactEmailLabel: "Email:",
    revealPhone: "Τηλεφώνο",
    phoneLoading: "Φόρτωση τηλεφώνου…",
    phoneError: "Το τηλέφωνο δεν είναι διαθέσιμο. Δοκιμάστε ξανά ή χρησιμοποιήστε τη φόρμα επικοινωνίας.",
    phoneReady: "Έτοιμοι για κλήση.",
    revealEmail: "\u03a3\u03c4\u03b5\u03af\u03bb\u03c4\u03b5 email",
    contactAddress: "<strong>Διεύθυνση:</strong> Αυλώνος 88, Σεπόλια, Αθήνα, Ελλάδα",
    backTop: "Επιστροφή στην αρχή",
    formTitle: "Κλείστε ραντεβού, αμέ! ❤",
    labelName: "Όνομα, Επώνυμο",
    labelEmail: "Email",
    labelDetails: "Τι χρειάζεστε;",
    detailsPlaceholder: "Στρίφωμα, μπάλωμα, πρόβα νυφικού, σακάκια, μια ιδέα...",
    labelPhotos: "Φωτογραφίες (έως 5, έως 4 MB η καθεμία και 10 MB συνολικά)",
    formSubmit: "Αποστολή",
    formNote: "Στείλτε το αίτημά σας και θα απαντήσουμε σύντομα.",
    formSending: "Αποστολή...",
    formConfirm: "Το αίτημα εστάλη. Θα επικοινωνήσουμε σύντομα.",
    formError: "Δεν στάλθηκε. Προσπαθήστε ξανά.",
    fileSelectedPrefix: "Επιλέχθηκαν",
    footerNote: "&copy; <span id=\"year\"></span> Miranda's - Δημιουργικές μεταποιήσεις & επιδιορθώσεις",
    footerAbout: "Σχετικά",
    footerContact: "Επικοινωνία"
  }
};

const translations = specTranslations;


const LANG_STORAGE_KEY = "miranda-lang";

let currentLang = "el";
let thumbButtons = [];
let beforeImg, afterImg, titleEl, noteEl, beforeLabelEl, afterLabelEl, galleryStage, progressBar;
let activeIndex = 0;
let galleryStarted = false;
let fileNoteEl;
let fileInputEl;

function getPageType() {
  const body = document.body;
  if (!body) return "home";
  return body.dataset.page || "home";
}

function setText(id, text, asHtml = false) {
  const el = document.getElementById(id);
  if (!el) return;
  if (asHtml) {
    el.innerHTML = text;
  } else {
    el.textContent = text;
  }
}

function renderLists(lang) {
  const t = translations[lang];
  const heroList = document.getElementById("hero-note-list");
  if (heroList) {
    heroList.innerHTML = t.heroList.map(item => `<li>${item}</li>`).join("");
  }
  const specialtiesList = document.getElementById("specialties-list");
  if (specialtiesList) {
    specialtiesList.innerHTML = t.specialtiesList.map(item => `<li>${item}</li>`).join("");
  }
}

function renderPills(lang) {
  const t = translations[lang];
  ["pill-1", "pill-2", "pill-3"].forEach((id, idx) => setText(id, t.pills[idx] || ""));
}

function renderCards(lang) {
  const t = translations[lang];
  t.cards.forEach((card, idx) => {
    setText(`card-${idx + 1}-title`, card.title);
    setText(`card-${idx + 1}-body`, card.body);
  });
}

const imageCache = new Map();

function preloadImage(src) {
  if (!src) return Promise.resolve();
  if (imageCache.has(src)) return imageCache.get(src);
  const promise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.decode) {
        img.decode().then(resolve).catch(resolve);
      } else {
        resolve();
      }
    };
    img.onerror = resolve;
    img.src = src;
  });
  imageCache.set(src, promise);
  return promise;
}

function warmNextImagePair(index) {
  if (!galleryItems.length) return;
  const nextIndex = (index + 1) % galleryItems.length;
  const nextItem = galleryItems[nextIndex];
  if (!nextItem) return;
  [nextItem.before, nextItem.after].forEach(preloadImage);
}

function updateProgressBar(index) {
  if (!progressBar || !galleryItems.length) return;
  const percentage = ((index + 1) / galleryItems.length) * 100;
  progressBar.style.setProperty("--progress", `${percentage}%`);
  progressBar.style.width = `${percentage}%`;
}

function setStageLoading(isLoading) {
  if (!galleryStage) return;
  galleryStage.classList.toggle("is-loading", isLoading);
  galleryStage.setAttribute("aria-busy", String(isLoading));
}

function attachSwipeNavigation(element, onSwipe) {
  if (!element || typeof onSwipe !== "function") return;
  let startX = 0;
  let startY = 0;
  let tracking = false;

  element.addEventListener(
    "pointerdown",
    (evt) => {
      // Only handle touch interactions for swipe
      if (evt.pointerType && evt.pointerType !== "touch") return;
      tracking = true;
      startX = evt.clientX;
      startY = evt.clientY;
    },
    { passive: true }
  );

  element.addEventListener(
    "pointermove",
    (evt) => {
      if (!tracking) return;
      const dx = evt.clientX - startX;
      const dy = evt.clientY - startY;
      // Ignore mostly vertical scrolls
      if (Math.abs(dy) > Math.abs(dx)) return;
      if (Math.abs(dx) > 40) {
        onSwipe(dx > 0 ? -1 : 1);
        tracking = false;
      }
    },
    { passive: true }
  );

  ["pointerup", "pointercancel", "pointerleave"].forEach((type) => {
    element.addEventListener(
      type,
      () => {
        tracking = false;
      },
      { passive: true }
    );
  });
}

async function setGalleryActive(index) {
  const safeIndex = ((index % galleryItems.length) + galleryItems.length) % galleryItems.length;
  const item = galleryItems[safeIndex] || galleryItems[0];
  const t = translations[currentLang];
  activeIndex = safeIndex;

  setStageLoading(true);
  [beforeImg, afterImg].forEach((img) => img?.classList.remove("is-loaded"));

  const beforeAlt = `${item.title[currentLang]} - ${t.beforeLabel.toLowerCase()}`;
  const afterAlt = `${item.title[currentLang]} - ${t.afterLabel.toLowerCase()}`;

  try {
    await Promise.all([preloadImage(item.before), preloadImage(item.after)]);

    if (beforeImg) {
      beforeImg.src = item.before;
      beforeImg.alt = beforeAlt;
      requestAnimationFrame(() => beforeImg.classList.add("is-loaded"));
    }
    if (afterImg) {
      afterImg.src = item.after;
      afterImg.alt = afterAlt;
      requestAnimationFrame(() => afterImg.classList.add("is-loaded"));
    }
  } finally {
    setStageLoading(false);
  }

  if (titleEl) titleEl.textContent = item.title[currentLang];
  if (noteEl) noteEl.textContent = item.note[currentLang];
  if (beforeLabelEl) beforeLabelEl.textContent = t.beforeLabel;
  if (afterLabelEl) afterLabelEl.textContent = t.afterLabel;

  thumbButtons.forEach((btn, i) => {
    const isActive = i === safeIndex;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
    const thumbItem = galleryItems[i];
    if (thumbItem?.aria?.[currentLang]) {
      btn.setAttribute("aria-label", thumbItem.aria[currentLang]);
    }
  });

  updateProgressBar(safeIndex);
  warmNextImagePair(safeIndex);
}



function initGallery() {
  beforeImg = document.getElementById("before-img");
  afterImg = document.getElementById("after-img");
  titleEl = document.getElementById("work-title");
  noteEl = document.getElementById("work-note");
  beforeLabelEl = document.getElementById("before-label");
  afterLabelEl = document.getElementById("after-label");
  galleryStage = document.querySelector(".ba");
  progressBar = document.querySelector(".ba-progress-bar");
  const prevBtn = document.getElementById("ba-prev");
  const nextBtn = document.getElementById("ba-next");
  thumbButtons = Array.from(document.querySelectorAll(".thumb"));

  const goTo = (delta) => setGalleryActive(activeIndex + delta);

  thumbButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setGalleryActive(Number(btn.dataset.index) || 0);
    });
  });

  if (prevBtn) prevBtn.addEventListener("click", () => goTo(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(1));

  if (galleryStage) {
    attachSwipeNavigation(galleryStage, goTo);
    galleryStage.addEventListener("keydown", (evt) => {
      if (evt.key === "ArrowRight") {
        evt.preventDefault();
        goTo(1);
      } else if (evt.key === "ArrowLeft") {
        evt.preventDefault();
        goTo(-1);
      }
    });
  }

  const startGallery = () => {
    galleryStarted = true;
    setGalleryActive(0);
  };
  if (galleryStage && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        startGallery();
      }
    }, { rootMargin: "200px" });
    observer.observe(galleryStage);
  } else {
    startGallery();
  }
}

function initContactForm() {
  const form = document.querySelector(".form");
  if (!form) return;

  fileInputEl = form.querySelector('input[type="file"]');
  fileNoteEl = document.createElement("div");
  fileNoteEl.className = "micro muted";
  fileNoteEl.setAttribute("role", "status");
  fileNoteEl.setAttribute("aria-live", "polite");
  form.insertBefore(fileNoteEl, form.lastElementChild);

  fileInputEl.addEventListener("change", () => {
    if (fileInputEl.files.length === 0) {
      fileNoteEl.textContent = "";
      return;
    }
    const names = Array.from(fileInputEl.files).map((f) => f.name).join(", ");
    fileNoteEl.textContent = `${translations[currentLang].fileSelectedPrefix}: ${names}`;
  });

   const submitBtn = form.querySelector("button[type='submit']");

   form.addEventListener("submit", async (e) => {
     e.preventDefault();
     form
       .querySelectorAll("input, textarea, button")
       .forEach((el) => el.blur());

     const fd = new FormData(form);
     fd.set("lang", currentLang);

     if (submitBtn) submitBtn.disabled = true;
     fileNoteEl.textContent =
       translations[currentLang].formSending || "Sending…";

     try {
       const res = await fetch("/api/contact", { method: "POST", body: fd });
       let payload = null;
       try {
         payload = await res.json();
       } catch (_) {}

       if (!res.ok || !payload?.ok) {
         fileNoteEl.textContent =
           translations[currentLang].formError ||
           "Could not send. Please try again.";
         return;
       }

       form.reset();
       fileNoteEl.textContent = translations[currentLang].formConfirm;
     } catch (err) {
       fileNoteEl.textContent =
         translations[currentLang].formError ||
         "Could not send. Please try again.";
     } finally {
       try { window.turnstile?.reset(); } catch (_) {}
       if (submitBtn) submitBtn.disabled = false;
     }
   });
}

function initContactReveal() {
  const emailBtn = document.getElementById("reveal-email");
  if (!emailBtn) return;

  const emailParts = ["contact", "mirandas", "gr"];
  const email = `${emailParts[0]}@${emailParts[1]}.${emailParts[2]}`;

  const reveal = (btn, href, text) => {
    if (!btn) return;
    btn.addEventListener("click", () => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = text;
      link.className = "contact-link";
      btn.replaceWith(link);
    });
  };

  reveal(emailBtn, `mailto:${email}`, email);
}

function refreshPhoneLabels() {
  const t = translations[currentLang];
  document.querySelectorAll('.phone-reveal').forEach(container => {
    const button = container.querySelector('[data-phone-reveal]');
    const status = container.querySelector('.phone-status');
    if (button) button.textContent = t.revealPhone;
    const state = container.dataset.state;
    status.textContent = state === 'loading' ? t.phoneLoading
      : state === 'error' ? t.phoneError : state === 'ready' ? t.phoneReady : '';
  });
}

function initPhoneReveal() {
  document.querySelectorAll('[data-phone-reveal]').forEach(button => {
    const container = button.closest('.phone-reveal');
    container.hidden = false;
    button.addEventListener('click', async () => {
      if (container.dataset.state === 'loading' || container.dataset.state === 'ready') return;
      container.dataset.state = 'loading';
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      refreshPhoneLabels();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch('/api/phone', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Phone unavailable');
        const payload = await response.json();
        const phone = typeof payload.phone === 'string' ? payload.phone.trim() : '';
        const dial = phone.replace(/[\s().-]/g, '');
        if (!payload.ok || !/^[+\d\s().-]+$/.test(phone) || !/^\+[1-9]\d{7,14}$/.test(dial)) {
          throw new Error('Invalid phone response');
        }
        const link = document.createElement('a');
        link.className = 'contact-link content-link';
        link.href = `tel:${dial}`;
        link.textContent = phone;
        const shouldFocus = document.activeElement === button || document.activeElement === document.body;
        button.replaceWith(link);
        container.dataset.state = 'ready';
        if (shouldFocus) link.focus({ preventScroll: true });
      } catch (_) {
        container.dataset.state = 'error';
        button.disabled = false;
      } finally {
        clearTimeout(timeout);
        button.removeAttribute('aria-busy');
        refreshPhoneLabels();
      }
    });
  });
}

function initContactMap() {
  const button = document.getElementById('map-toggle');
  const container = document.getElementById('contact-map');
  if (!button || !container) return;
  button.hidden = false;
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    if (expanded && !container.firstElementChild) {
      const frame = document.createElement('iframe');
      frame.title = currentLang === 'en' ? 'Map: Miranda’s, 88 Avlonos, Sepolia, Athens'
        : 'Χάρτης: Miranda’s, Αυλώνος 88, Σεπόλια, Αθήνα';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      // No Google request until this explicit interaction; no API key or guessed coordinates.
      frame.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Αυλώνος 88, Σεπόλια, Αθήνα, Ελλάδα') + '&output=embed';
      container.append(frame);
    }
    container.hidden = !expanded;
    button.setAttribute('aria-expanded', String(expanded));
    button.querySelector('[data-lang="el"]').textContent = expanded ? 'Κλείσιμο χάρτη · Αυλώνος 88' : 'Προβολή χάρτη · Αυλώνος 88';
    button.querySelector('[data-lang="en"]').textContent = expanded ? 'Hide map · 88 Avlonos' : 'Show map · 88 Avlonos';
  });
}

function applyTranslations(lang) {
  currentLang = lang === "en" ? "en" : "el";
  const t = translations[currentLang];
  document.documentElement.lang = currentLang === "en" ? "en" : "el";
  document.querySelectorAll('[data-alt-el]').forEach(el => { el.alt = el.dataset[currentLang === 'en' ? 'altEn' : 'altEl']; });
  document.querySelectorAll('[data-aria-el]').forEach(el => { el.setAttribute('aria-label', el.dataset[currentLang === 'en' ? 'ariaEn' : 'ariaEl']); });
  const map = document.querySelector('#contact-map iframe');
  if (map) map.title = currentLang === 'en' ? 'Map: Miranda’s, 88 Avlonos, Sepolia, Athens'
    : 'Χάρτης: Miranda’s, Αυλώνος 88, Σεπόλια, Αθήνα';
  refreshPhoneLabels();
  setText("hero-heading-detail", currentLang === "en"
    ? " — Clothing repairs and tailoring in Sepolia, Athens"
    : " — Επιδιορθώσεις ρούχων στα Σεπόλια");

  setText("brand-subtitle", t.brandSubtitle);
  setText("nav-home", t.nav.home);
  setText("nav-about", t.nav.about);
  setText("nav-work", t.nav.work);
  setText("nav-contact", t.nav.contact);
  setText("nav-condition", t.nav.condition);
   setText("mobile-nav-home", t.nav.home);
   setText("mobile-nav-about", t.nav.about);
   setText("mobile-nav-work", t.nav.work);
   setText("mobile-nav-contact", t.nav.contact);
   setText("mobile-nav-condition", t.nav.condition);

  const toggleBtn = document.getElementById("lang-toggle");
  if (toggleBtn) toggleBtn.textContent = t.nav.toggle;
  const mobileToggleBtn = document.getElementById("mobile-lang-toggle");
  if (mobileToggleBtn) mobileToggleBtn.textContent = t.nav.toggle;
  [toggleBtn, mobileToggleBtn].forEach((button) => button?.setAttribute("aria-label",
    currentLang === "en" ? "Switch to Greek" : "Αλλαγή σε αγγλικά"));
  document.getElementById("menu-toggle")?.setAttribute("aria-label",
    currentLang === "en" ? "Open menu" : "Άνοιγμα μενού");
  document.querySelector(".form")?.setAttribute("aria-label",
    currentLang === "en" ? "Contact form" : "Φόρμα επικοινωνίας");

  setText("hero-tag", t.heroTag);
  setText("hero-lead", t.heroLead, true);
  setText("hero-btn-primary", t.heroBtnPrimary);
  setText("hero-btn-secondary", t.heroBtnSecondary);
  setText("hours-label", t.hoursLabel);
  setText("hours-value", t.hoursValue);
  setText("location-label", t.locationLabel);
  setText("location-value", t.locationValue);
  setText("hero-quote", t.heroQuote);

  renderLists(currentLang);
  renderPills(currentLang);

  setText("about-title", t.aboutTitle);
  setText("about-lead", t.aboutLead);
  setText("specialties-title", t.specialtiesTitle);

  renderCards(currentLang);

  setText("work-heading", t.workHeading);
  setText("work-subtitle", t.workSubtitle);

  setText("contact-heading", t.contactHeading);
  setText("contact-phone-label", t.contactPhoneLabel || "Phone:");
  setText("contact-email-label", t.contactEmailLabel || "Email:");
  setText("reveal-email", t.revealEmail || "Email us");
  setText("contact-address", t.contactAddress, true);
  // setText("contact-note", t.contactNote);
  setText("back-top", t.backTop);

  setText("form-title", t.formTitle);
  setText("label-name", t.labelName);
  setText("label-email", t.labelEmail);
  setText("label-details", t.labelDetails);
  const detailsField = document.querySelector("textarea[name='details']");
  if (detailsField) detailsField.placeholder = t.detailsPlaceholder;
  setText("label-photos", t.labelPhotos);
  setText("form-submit", t.formSubmit);
  setText("form-note", t.formNote);

  setText("footer-note", t.footerNote, true);
  setText("footer-about", t.footerAbout);
  setText("footer-contact", t.footerContact);

  // Refresh gallery labels/text per language
  if (galleryStarted) {
    setGalleryActive(thumbButtons.findIndex((b) => b.classList.contains("active")) || 0);
  }

  // Reset file note text to match new language
  if (fileNoteEl && fileNoteEl.textContent) {
    if (fileInputEl && fileInputEl.files.length > 0) {
      const names = Array.from(fileInputEl.files).map((f) => f.name).join(", ");
      fileNoteEl.textContent = `${t.fileSelectedPrefix}: ${names}`;
    } else {
      fileNoteEl.textContent = t.formNote;
    }
  }
}

function detectPreferredLanguage() {
  try {
    const cached = localStorage.getItem(LANG_STORAGE_KEY);
    if (cached === "en" || cached === "el") return cached;
  } catch (_) {}
  return "el";
}

function setLanguage(lang) {
  currentLang = lang === "en" ? "en" : "el";
  try {
    localStorage.setItem(LANG_STORAGE_KEY, currentLang);
  } catch (_) {}
  document.documentElement.lang = currentLang;
  applyTranslations(currentLang);
  setYear();
}

function initConditionEnquiry() {
  // An explicit CTA carries a draft in this tab only; never auto-submit it.
  if (new URLSearchParams(window.location.search).get("enquiry") !== "condition") return;
  const field = document.querySelector("textarea[name='details']");
  try {
    const draft = JSON.parse(sessionStorage.getItem("miranda-condition-enquiry") || "null");
    if (field && !field.value && draft && typeof draft.summary === "string" &&
        Number.isFinite(draft.createdAt) && Date.now() - draft.createdAt >= 0 &&
        Date.now() - draft.createdAt < 30 * 60 * 1000) {
      field.value = draft.summary.slice(0, 2000);
    }
    sessionStorage.removeItem("miranda-condition-enquiry");
  } catch (_) {}
  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete("enquiry");
  window.history.replaceState(null, "", cleanUrl.pathname + cleanUrl.search + cleanUrl.hash);
}

function setYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function initLangToggle() {
  const toggles = Array.from(document.querySelectorAll("#lang-toggle, #mobile-lang-toggle"));
  if (!toggles.length) return;
  toggles.forEach(btn => {
    btn.addEventListener("click", () => {
      // Keep the current reading block in place when translated paragraphs reflow.
      const readingLine = (document.querySelector('.nav')?.offsetHeight || 0) + 16;
      const anchor = Array.from(document.querySelectorAll('main h1, main h2, main h3, main p, main li, main figure'))
        .find(el => { const box = el.getBoundingClientRect(); return box.height && box.bottom > readingLine && box.top < innerHeight; });
      const anchorTop = anchor?.getBoundingClientRect().top;
      setLanguage(currentLang === "en" ? "el" : "en");
      if (anchor) window.scrollBy({ top: anchor.getBoundingClientRect().top - anchorTop, behavior: 'instant' });
    });
  });
}

function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const overlay = document.getElementById("menu-overlay");
  const menu = document.getElementById("mobile-menu");
  if (!menuToggle || !overlay || !menu) return;

  const focusableSelector = "a, button";
  const getFocusable = () =>
    Array.from(menu.querySelectorAll(focusableSelector)).filter((el) => !el.disabled);

  const setState = (isOpen, returnFocus = true) => {
    document.body.classList.toggle("menu-open", isOpen);
    overlay.hidden = !isOpen;
    menu.hidden = !isOpen;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      const first = getFocusable()[0];
      if (first) first.focus();
    } else if (returnFocus) {
      menuToggle.focus();
    }
  };

  const trapFocus = (evt) => {
    if (!document.body.classList.contains("menu-open") || evt.key !== "Tab") return;
    const focusable = getFocusable();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (evt.shiftKey && document.activeElement === first) {
      evt.preventDefault();
      last.focus();
    } else if (!evt.shiftKey && document.activeElement === last) {
      evt.preventDefault();
      first.focus();
    }
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.contains("menu-open");
    setState(!isOpen);
  });

  overlay.addEventListener("click", () => setState(false));

  menu.addEventListener("click", (evt) => {
    const link = evt.target.closest("a, button");
    if (link) {
      setState(false, link.tagName === "BUTTON");
    }
  });

  document.addEventListener("keydown", (evt) => {
    if (evt.key === "Escape" && document.body.classList.contains("menu-open")) {
      setState(false);
    }
    trapFocus(evt);
  });

  window.matchMedia("(min-width: 768px)").addEventListener("change", (e) => {
    if (e.matches) setState(false, false);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const pageType = getPageType();
  if (pageType === "condition") {
    initMobileMenu();
    return;
  }
  initPhoneReveal();
  if (pageType === "home") {
    initGallery();
    initContactForm();
    initContactReveal();
    initContactMap();
    initConditionEnquiry();
  }
  setYear();
  setLanguage(detectPreferredLanguage());
  initLangToggle();
  initMobileMenu();
});

})();









