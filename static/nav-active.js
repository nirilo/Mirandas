(function () {
  const body = document.body;
  if (!body || body.dataset.page !== "home") return;

  const sectionIds = ["hero", "about", "work", "contact"];

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const navLinks = Array.from(
    document.querySelectorAll(".links a, #mobile-menu a")
  ).filter((link) => {
    const hash = new URL(link.href, window.location.href).hash;
    return sectionIds.includes(hash.replace("#", ""));
  });

  if (!navLinks.length) return;

  const clearCurrent = () => {
    navLinks.forEach((link) => link.removeAttribute("aria-current"));
  };

  const setCurrentHash = (hash) => {
    clearCurrent();

    navLinks.forEach((link) => {
      const linkHash = new URL(link.href, window.location.href).hash;

      if (linkHash === hash) {
        link.setAttribute("aria-current", "page");
      }
    });
  };

  const getNavOffset = () => {
    const nav = document.querySelector(".nav");
    return nav ? nav.offsetHeight + 16 : 16;
  };

  const computeActive = () => {
    const offset = getNavOffset();
    const scrollPosition = window.scrollY + offset + 24;

    let activeId = sections[0].id;

    for (const section of sections) {
      if (section.offsetTop <= scrollPosition) {
        activeId = section.id;
      }
    }

    setCurrentHash(`#${activeId}`);
  };

  let ticking = false;

  const requestUpdate = () => {
    if (ticking) return;

    ticking = true;

    window.requestAnimationFrame(() => {
      computeActive();
      ticking = false;
    });
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);

  window.addEventListener("hashchange", () => {
    window.requestAnimationFrame(computeActive);
  });

  computeActive();
})();