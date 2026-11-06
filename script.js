/* ATELIER — lightweight interactions, no libraries. */
(() => {
  "use strict";

  // Mobile navigation
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      menuButton.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !open);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        navigation.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navigation.classList.contains("is-open")) {
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");
        navigation.classList.remove("is-open");
        menuButton.focus();
      }
    });
  }

  // Header scroll effect — slightly reduce opacity on scroll
  const header = document.querySelector(".site-header");
  if (header) {
    let lastScroll = 0;
    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      if (scrollY > 120) {
        header.style.boxShadow = "0 1px 12px rgba(0,0,0,.06)";
      } else {
        header.style.boxShadow = "none";
      }
      lastScroll = scrollY;
    }, { passive: true });
  }

  // Framing preview: frame finish and mat width are independent selections.
  const frame = document.querySelector("#artwork-frame");
  const matBoard = document.querySelector("#mat-board");
  const frameButtons = document.querySelectorAll("[data-frame]");
  const matButtons = document.querySelectorAll("[data-mat]");
  const frameNames = { oak: "Natural Oak", gold: "Gilded Gold", black: "Matte Black", white: "Minimalist White" };
  const matNames = { none: "No Mat", slim: "Slim Mat", wide: "Wide Mat" };
  let selectedFrame = "oak";
  let selectedMat = "none";

  function updateFrameSummary() {
    const summary = document.querySelector("#selection-summary");
    if (summary) summary.textContent = `${frameNames[selectedFrame]} · ${matNames[selectedMat]}`;
  }

  frameButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedFrame = button.dataset.frame;
      frame.classList.remove("frame-oak", "frame-gold", "frame-black", "frame-white");
      frame.classList.add(`frame-${selectedFrame}`);
      frameButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      updateFrameSummary();
    });
  });

  matButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedMat = button.dataset.mat;
      matBoard.classList.remove("mat-none", "mat-slim", "mat-wide");
      matBoard.classList.add(`mat-${selectedMat}`);
      matButtons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      updateFrameSummary();
    });
  });

  // Seller profile preview. Data stays in this browser page; nothing is uploaded.
  const sellerForm = document.querySelector("#seller-form");
  if (sellerForm) {
    sellerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!sellerForm.reportValidity()) return;

      const name = sellerForm.elements.sellerName.value.trim();
      const medium = sellerForm.elements.sellerMedium.value;
      document.querySelector("#profile-name").textContent = name;
      document.querySelector("#profile-medium").textContent = medium;
      document.querySelector("#profile-avatar").textContent = name.charAt(0).toUpperCase();
      document.querySelector("#seller-feedback").textContent =
        "Profile preview updated. Your details have not been uploaded or saved.";
    });
  }

  // Contact form demo. Native HTML5 validation runs before confirmation.
  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      const name = contactForm.elements.name.value.trim();
      document.querySelector("#contact-feedback").textContent =
        `Thank you, ${name}! Your enquiry has been received. We'll get back to you soon at your email address.`;
      contactForm.reset();
    });
  }

  // Dynamic year in footer
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Scroll-triggered fade-in animation using Intersection Observer
  const fadeElements = document.querySelectorAll(
    ".intro, .gallery-section, .craft-section, .framing-section, .artist-section, .about-section, .contact-section, .stats-ribbon, .section-heading, .craft-card, .founder-card, .stat-item"
  );

  if (fadeElements.length > 0 && "IntersectionObserver" in window) {
    fadeElements.forEach((el) => el.classList.add("fade-in"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    fadeElements.forEach((el) => observer.observe(el));
  }

  // Active nav link highlighting based on scroll position
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".primary-nav a[href^='#']");

  function highlightActiveNav() {
    const scrollPos = window.scrollY + 150;
    let currentSection = "";

    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === `#${currentSection}`) {
        link.style.color = "#92763c";
      } else {
        link.style.color = "";
      }
    });
  }

  window.addEventListener("scroll", highlightActiveNav, { passive: true });
  highlightActiveNav();

  // Smooth reveal for staggered founder cards
  const founderCards = document.querySelectorAll(".founder-card");
  founderCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.12}s`;
  });

  // Smooth reveal for craft cards
  const craftCards = document.querySelectorAll(".craft-card");
  craftCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
  });

  // Smooth reveal for stat items
  const statItems = document.querySelectorAll(".stat-item");
  statItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
  });
})();
