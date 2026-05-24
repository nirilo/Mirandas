(function () {
  const body = document.body;
  if (!body || body.dataset.page !== "home") return;

  const sectionIds = ["hero", "about", "work", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (!sections.length) return;

  const navLinks = Array.from(
    document.querySelectorAll('.links a[href^="#"], #mobile-menu a[href^="#"]')
  );

  const linkByHash = new Map(
    navLinks.map((link) => [link.getAttribute("href"), link])
  );

  const clearCurrent = () => {
    navLinks.forEach((link) => link.removeAttribute("aria-current"));
  };

  const setCurrentHash = (hash) => {
    const link = linkByHash.get(hash);
    if (!link) return;
    clearCurrent();
    link.setAttribute("aria-current", "location");
  };

  const getNavOffset = () => {
    const nav = document.querySelector(".nav");
    const rect = nav?.getBoundingClientRect();
    return Math.max(0, (rect?.height || 0) + 12);
  };

  const computeActive = () => {
    const offset = getNavOffset();
    let activeId = sections[0].id;
    for (const section of sections) {
      const top = section.getBoundingClientRect().top;
      if (top - offset <= 0) activeId = section.id;
    }
    setCurrentHash(`#${activeId}`);
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      computeActive();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // Initialize immediately and also after hash navigation.
  computeActive();
  window.addEventListener("hashchange", computeActive);
})();

