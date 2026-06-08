const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const year = document.querySelector("#year");
const backToTop = document.querySelector("#back-to-top");

year.textContent = new Date().getFullYear();

backToTop.addEventListener("click", (event) => {
  event.preventDefault();
  history.replaceState(null, "", window.location.pathname + window.location.search);
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  window.setTimeout(() => window.scrollTo({ top: 0, left: 0 }), 350);
});

const updateHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 8);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav") && navLinks.classList.contains("open")) {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

const publicationTabs = [...document.querySelectorAll("[data-publication-target]")];
const publicationPanels = [...document.querySelectorAll(".publication-panel")];

const selectPublicationView = (selectedTab) => {
  publicationTabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.classList.toggle("active", isSelected);
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  publicationPanels.forEach((panel) => {
    panel.hidden = panel.id !== selectedTab.dataset.publicationTarget;
  });
};

publicationTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectPublicationView(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + publicationTabs.length) % publicationTabs.length;
    selectPublicationView(publicationTabs[nextIndex]);
    publicationTabs[nextIndex].focus();
  });
});

const revealElements = [...document.querySelectorAll(".reveal")];
revealElements.forEach((element, index) => {
  const groupIndex = index % 4;
  element.style.setProperty("--reveal-delay", `${groupIndex * 45}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    rootMargin: "0px 0px -7% 0px",
    threshold: 0.08,
  }
);

revealElements.forEach((element) => revealObserver.observe(element));
