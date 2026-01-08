const galleryItems = [
  {
    before: "assets/images/denim_before.webp",
    after: "assets/images/denim_after.webp",
    title: { en: "Denim repair", el: "Επιδιόρθωση τζιν" },
    note: {
      en: "Invisible patch & color-match stitching.",
      el: "Αόρατο μπάλωμα και ραφή με ταιριαστά νήματα."
    },
    aria: { en: "Show denim repair", el: "Δείτε επιδιόρθωση τζιν" }
  },
  {
    before: "assets/images/dress_before.webp",
    after: "assets/images/dress_after.webp",
    title: { en: "Evening dress hem", el: "Στρίφωμα βραδινού φορέματος" },
    note: {
      en: "Hand-finished hem; original drape preserved.",
      el: "Χειροποίητο στρίφωμα, με διατήρηση της αρχικής φόρμας."
    },
    aria: { en: "Show evening dress hem", el: "Δείτε στρίφωμα φορέματος" }
  },
  {
    before: "assets/images/curtain_before.webp",
    after: "assets/images/curtain_after.webp",
    title: { en: "Curtain resizing", el: "Κόντεμα κουρτίνας" },
    note: {
      en: "Custom length + new header tape.",
      el: "Προσαρμογή μήκους και νέα τρέσα στη κορυφή."
    },
    aria: { en: "Show curtain resizing", el: "Δείτε κόντεμα κουρτίνας" }
  }
];

const translations = {
  en: {
    brandSubtitle: "atelier",
    nav: { home: "Home", about: "About", work: "Work", contact: "Contact", condition: "Condition Rater", toggle: "GR" },
    heroTag: "Made-to-measure care",
    heroLead: 'Careful, high-quality <strong>repairs & alterations</strong> from denim to bridal wear and home textiles.',
    heroBtnPrimary: "Book a fitting",
    heroBtnSecondary: "See work",
    hoursLabel: "Hours",
    hoursValue: "Mon–Fri, 09:00–15:00, 17:00–21:00",
    locationLabel: "Location",
    locationValue: "Athens, Sepolia, GR",
    heroQuote: "“We keep the original look—minimal on the outside, maximum care inside.”",
    heroList: [
      "Invisible mending for denim",
      "Hand-finished hems & bridal adjustments",
      "Home textiles resized with care"
    ],
    aboutTitle: "About the atelier",
    aboutLead: "I’m Miranda, a tailor who keeps your favorites in rotation with light, respectful alterations.",
    pills: ["Tailored fits", "Mindful mending", "Home textiles"],
    specialtiesTitle: "Specialties",
    specialtiesList: [
      "Bridal and evening wear adjustments",
      "Denim darning, color-matched threads",
      "Curtain and upholstery tailoring"
    ],
    aboutNote: "Coming soon: AI-assisted fit notes for quicker quotes.",
    workHeading: "Before & After",
    workSubtitle: "Small miracles, stitched by hand.",
    beforeLabel: "Before",
    afterLabel: "After",
    cards: [
      { title: "Custom fits", body: "Waist, bust, and hem adjustments that honor the garment’s lines." },
      { title: "Repair & revive", body: "Mending, darning, and reinforcing high-wear areas with color-matched thread." },
      { title: "Home textiles", body: "Curtains resized, cushions refreshed, linens finished with neat seams." }
    ],
    contactHeading: "Contact",
    contactPhone: "<strong>Phone:</strong> +30 210 0000 000",
    contactEmail: "<strong>Email:</strong> contact@miranda.gr",
    contactAddress: "<strong>Address:</strong> Avlonos, Athens",
    backTop: "Back to top",
    formTitle: "Book a fitting",
    labelName: "Name",
    labelEmail: "Email",
    labelDetails: "What do you need?",
    detailsPlaceholder: "Hem, repair, bridal fitting…",
    labelPhotos: "Upload reference photos",
    formSubmit: "Send request",
    formNote: "Send your request and we’ll get back to you soon.",
    formSending: "Sending…",
    formConfirm: "Request sent. We’ll reply soon.",
    formError: "Could not send. Please try again.",
    fileSelectedPrefix: "Selected",
    footerNote: "© <span id=\"year\"></span> Miranda — Creative repairs & alterations",
    footerAbout: "About",
    footerContact: "Contact"
  },
  el: {
    brandSubtitle: "ατελιέ",
    nav: { home: "Αρχική", about: "Σχετικά", work: "Δουλειές", contact: "Επικοινωνία", condition: "Εκτίμηση Υφάσματος", toggle: "EN" },
    heroTag: "Φροντίδα στα μέτρα σας",
    heroLead: 'Ποιοτικές <strong>επιδιορθώσεις & μεταποιήσεις</strong> από denim έως νυφικά και υφάσματα σπιτιού.',
    heroBtnPrimary: "Κλείστε ραντεβού",
    heroBtnSecondary: "Δείτε δουλειές",
    hoursLabel: "Ώρες",
    hoursValue: "Δευ–Παρ, 09:00–15:00, 17:00–21:00",
    locationLabel: "Τοποθεσία",
    locationValue: "Αθήνα, Σεπόλια",
    heroQuote: "«Κρατάμε την αρχική αισθητική με ελάχιστες αλλαγές και τη μέγιστη φροντίδα.»",
    heroList: [
      "Αόρατα μπαλώματα σε denim",
      "Χειροποίητα στριφώματα & bridal ρυθμίσεις",
      "Προσαρμογές σε κουρτίνες και υφάσματα σπιτιού"
    ],
    aboutTitle: "Σχετικά με το ατελιέ",
    aboutLead: "Είμαι η Miranda, μοδίστρα που κρατά τα αγαπημένα σας ρούχα σε χρήση με διακριτικές ραφές.",
    pills: ["Εφαρμογές", "Προσεκτικές επιδιορθώσεις", "Υφάσματα σπιτιού"],
    specialtiesTitle: "Εξειδικεύσεις",
    specialtiesList: [
      "Νυφικές και βραδινές προσαρμογές",
      "Μπάλωμα σε denim με ύφασμα ταιριαστού χρώματος",
      "Ραφές σε κουρτίνες και καλύμματα επίπλων"
    ],
    aboutNote: "Έρχεται: AI σημειώσεις εφαρμογής για πιο γρήγορες εκτιμήσεις.",
    workHeading: "Πριν & Μετά",
    workSubtitle: "Μικρά θαύματα, ραμμένα στο χέρι.",
    beforeLabel: "Πριν",
    afterLabel: "Μετά",
    cards: [
      { title: "Ειδικές εφαρμογές", body: "Διορθώσεις σε μέση, στήθος, στρίφωμα με σεβασμό στο πατρόν." },
      { title: "Επιδιόρθωση & ανανέωση", body: "Μπαλώματα, μανταρίσματα σε σημεία φθοράς." },
      { title: "Υφάσματα σπιτιού", body: "Προσαρμογές σε κουρτίνες, μαξιλάρια και λευκά είδη με καθαρές ραφές." }
    ],
    contactHeading: "Επικοινωνία",
    contactPhone: "<strong>Τηλ.:</strong> +30 210 0000 000",
    contactEmail: "<strong>Email:</strong> contact@miranda.gr",
    contactAddress: "<strong>Διεύθυνση:</strong> Αυλώνος, Αθήνα",
    backTop: "Επιστροφή στην αρχή",
    formTitle: "Κλείστε ραντεβού",
    labelName: "Όνομα",
    labelEmail: "Email",
    labelDetails: "Τι χρειάζεστε;",
    detailsPlaceholder: "Στρίφωμα, επιδιόρθωση, νυφικό κτλ.",
    labelPhotos: "Ανέβασμα φωτογραφιών",
    formSubmit: "Αποστολή",
    formSending: "Στέλνεται…",
    formNote: "Στείλτε το αίτημά σας, την πρόταση ή την ιδέα σας και θα επικοινωνήσουμε σύντομα μαζί σας!",
    formConfirm: "Το μήνυμά σας εστάλη. Θα απαντήσουμε το συντομότερο. Ευχαριστούμε!",
    formError: "Δεν ήταν δυνατή η αποστολή. Παρακαλώ δοκιμάστε ξανά.",
    fileSelectedPrefix: "Επιλέχθηκαν",
    footerNote: "© <span id=\"year\"></span> Miranda — Δημιουργικές επιδιορθώσεις & μεταποιήσεις",
    footerAbout: "Σχετικά",
    footerContact: "Επικοινωνία"
  }
};

const LANG_STORAGE_KEY = "miranda-lang";

let currentLang = "el";
let thumbButtons = [];
let beforeImg, afterImg, titleEl, noteEl, beforeLabelEl, afterLabelEl;
let fileNoteEl;
let fileInputEl;

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

function setGalleryActive(index) {
  const item = galleryItems[index] || galleryItems[0];
  const t = translations[currentLang];

  if (beforeImg) {
    beforeImg.src = item.before;
    beforeImg.alt = `${item.title[currentLang]} — ${t.beforeLabel.toLowerCase()}`;
  }
  if (afterImg) {
    afterImg.src = item.after;
    afterImg.alt = `${item.title[currentLang]} — ${t.afterLabel.toLowerCase()}`;
  }
  if (titleEl) titleEl.textContent = item.title[currentLang];
  if (noteEl) noteEl.textContent = item.note[currentLang];
  if (beforeLabelEl) beforeLabelEl.textContent = t.beforeLabel;
  if (afterLabelEl) afterLabelEl.textContent = t.afterLabel;

  thumbButtons.forEach((btn, i) => {
    const isActive = i === index;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
    btn.setAttribute("aria-label", item.aria[currentLang]);
  });
}

function initGallery() {
  beforeImg = document.getElementById("before-img");
  afterImg = document.getElementById("after-img");
  titleEl = document.getElementById("work-title");
  noteEl = document.getElementById("work-note");
  beforeLabelEl = document.getElementById("before-label");
  afterLabelEl = document.getElementById("after-label");
  thumbButtons = Array.from(document.querySelectorAll(".thumb"));

  thumbButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setGalleryActive(Number(btn.dataset.index) || 0);
    });
  });
  setGalleryActive(0);
}

function initContactForm() {
  const form = document.querySelector(".form");
  if (!form) return;

  fileInputEl = form.querySelector('input[type="file"]');
  fileNoteEl = document.createElement("div");
  fileNoteEl.className = "micro muted";
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
       if (window.turnstile) turnstile.reset();
       fileNoteEl.textContent = translations[currentLang].formConfirm;
     } catch (err) {
       fileNoteEl.textContent =
         translations[currentLang].formError ||
         "Could not send. Please try again.";
     } finally {
       if (submitBtn) submitBtn.disabled = false;
     }
   });
}

function applyTranslations(lang) {
  currentLang = lang === "en" ? "en" : "el";
  const t = translations[currentLang];
  document.documentElement.lang = currentLang === "en" ? "en" : "el";

  setText("brand-subtitle", t.brandSubtitle);
  setText("nav-home", t.nav.home);
  setText("nav-about", t.nav.about);
  setText("nav-work", t.nav.work);
  setText("nav-contact", t.nav.contact);
  setText("nav-condition", t.nav.condition);

  const toggleBtn = document.getElementById("lang-toggle");
  if (toggleBtn) toggleBtn.textContent = t.nav.toggle;

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
  setText("about-note", t.aboutNote);

  renderCards(currentLang);

  setText("work-heading", t.workHeading);
  setText("work-subtitle", t.workSubtitle);

  setText("contact-heading", t.contactHeading);
  setText("contact-phone", t.contactPhone, true);
  setText("contact-email", t.contactEmail, true);
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
  setGalleryActive(thumbButtons.findIndex((b) => b.classList.contains("active")) || 0);

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

function localeLooksGreek(locale = "") {
  const value = String(locale || "").toLowerCase();
  return value.startsWith("el") || value.endsWith("-gr") || value.endsWith("_gr");
}

function detectPreferredLanguage() {
  try {
    const cached = localStorage.getItem(LANG_STORAGE_KEY);
    if (cached === "en" || cached === "el") return cached;

    const locales = [];
    if (Array.isArray(navigator.languages) && navigator.languages.length) {
      locales.push(...navigator.languages);
    }
    if (navigator.language) locales.push(navigator.language);
    const resolved = Intl?.DateTimeFormat?.().resolvedOptions?.().locale;
    if (resolved) locales.push(resolved);

    const lang = locales.some(localeLooksGreek) ? "el" : "en";
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    return lang;
  } catch (_) {
    return "el";
  }
}

function setLanguage(lang) {
  state.lang = lang === "en" ? "en" : "el";
  try {
    localStorage.setItem(LANG_STORAGE_KEY, state.lang);
  } catch (_) {}
}

function setYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function initLangToggle() {
  const toggleBtn = document.getElementById("lang-toggle");
  if (!toggleBtn) return;
  toggleBtn.addEventListener("click", () => {
    setLanguage(currentLang === "en" ? "el" : "en");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initGallery();
  initContactForm();
  setYear();
  const initialLang = detectPreferredLanguage();
  setLanguage(initialLang || "el");
  initLangToggle();
});
