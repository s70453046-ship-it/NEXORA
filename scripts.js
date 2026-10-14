(() => {
  "use strict";

  // ========================================
  // MOBILE NAVIGATION
  // ========================================

  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector("#primary-nav");
  const navLinks = document.querySelectorAll("#primary-nav a");

  function closeMenu() {
    if (!menuToggle || !mainNav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");

    mainNav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation" : "Close navigation"
      );

      mainNav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });
  }

  // ========================================
  // AUTOMATIC COPYRIGHT YEAR
  // ========================================

  const year = document.querySelector("#current-year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // ========================================
  // SCROLL REVEAL ANIMATIONS
  // ========================================

  const revealTargets = document.querySelectorAll(
    ".intro-heading, .intro-copy, .principle, " +
    ".section-heading, .service-card, .approach-visual, " +
    ".approach-step, .global-copy, .global-visual, " +
    ".contact-copy, .contact-form"
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    revealTargets.forEach(element => {
      element.classList.add("js-reveal");
    });

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealTargets.forEach(element => {
      observer.observe(element);
    });
  }

  // ========================================
  // HERO COLLAGE
  // ========================================

  const collageSlides = [
    ...document.querySelectorAll(
      ".hero-collage .collage-image"
    )
  ];

  let currentSlide = 0;

  if (collageSlides.length > 1 && !reduceMotion) {
    window.setInterval(() => {
      currentSlide =
        (currentSlide + 1) % collageSlides.length;

      collageSlides.forEach((slide, index) => {
        slide.classList.toggle(
          "is-current",
          index === currentSlide
        );

        slide.classList.toggle(
          "is-dimmed",
          index !== currentSlide
        );
      });
    }, 6500);
  }

  // ========================================
  // CONTACT FORM
  // ========================================
  // This is a demonstration form.
  // It validates the information and opens
  // an email draft. It does not send emails
  // automatically or store form submissions.

  const form = document.querySelector("#contact-form");
  const feedback = document.querySelector("#form-feedback");

  if (form && feedback) {

    // Clear validation messages when editing.
    form.addEventListener("input", event => {
      const field = event.target;

      if (field instanceof HTMLElement) {
        field.removeAttribute("aria-invalid");
        feedback.textContent = "";
      }
    });

    // Validate and prepare the email.
    form.addEventListener("submit", event => {
      event.preventDefault();

      feedback.textContent = "";

      const requiredFields = [
        ...form.querySelectorAll("[required]")
      ];

      const firstInvalid = requiredFields.find(field => {
        return (
          !field.checkValidity() ||
          !field.value.trim()
        );
      });

      requiredFields.forEach(field => {
        const invalid =
          !field.checkValidity() ||
          !field.value.trim();

        field.setAttribute(
          "aria-invalid",
          String(invalid)
        );
      });

      if (firstInvalid) {
        feedback.textContent =
          "Please complete the required fields with valid information.";

        firstInvalid.focus();
        return;
      }

      const data = new FormData(form);

      const lines = [
        "NEXORA — PROJECT ENQUIRY",
        "",
        `Name: ${data.get("name")}`,
        `Company: ${data.get("company") || "Not provided"}`,
        `Email: ${data.get("email")}`,
        `Service: ${data.get("service")}`,
        "",
        "Goals:",
        data.get("goals")
      ];

      const subject = encodeURIComponent(
        `NEXORA project enquiry — ${data.get("service")}`
      );

      const body = encodeURIComponent(
        lines.join("\n")
      );

      feedback.textContent =
        "An email draft will open if an email app is configured. " +
        "Review the details and choose the recipient; " +
        "this website does not send anything automatically.";

      window.location.href =
        `mailto:?subject=${subject}&body=${body}`;
    });
  }

})();