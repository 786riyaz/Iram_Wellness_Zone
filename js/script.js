/* ==========================================================================
   IRAM WELLNESS ZONE — script.js
   Vanilla JavaScript only. No frameworks or libraries.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 1. Page loader ---------- */
  const loader = document.getElementById("page-loader");
  window.addEventListener("load", () => {
    setTimeout(() => loader && loader.classList.add("loaded"), 250);
  });
  // Fallback in case 'load' already fired or is slow to register
  setTimeout(() => loader && loader.classList.add("loaded"), 2500);

  /* ---------- 2. Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 3. Sticky header + active link on scroll ---------- */
  const header = document.getElementById("siteHeader");
  const fabTop = document.getElementById("fabTop");
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function onScroll() {
    if (window.scrollY > 12) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Highlight the nav link for the section currently in view
    let currentId = sections[0] && sections[0].id;
    const scrollPos = window.scrollY + 140;
    sections.forEach((sec) => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
    });

    // Floating "scroll to top" button visibility
    if (fabTop) fabTop.classList.toggle("show", window.scrollY > 480);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 4. Mobile hamburger menu ---------- */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileNav = document.getElementById("mobileNav");

  function closeMobileNav() {
    mobileNav.classList.remove("open");
    hamburgerBtn.classList.remove("active");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  function toggleMobileNav() {
    const isOpen = mobileNav.classList.toggle("open");
    hamburgerBtn.classList.toggle("active", isOpen);
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  }
  hamburgerBtn.addEventListener("click", toggleMobileNav);
  mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobileNav));

  /* ---------- 5. Scroll-reveal animations (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- 6. Before/After drag-to-reveal sliders ---------- */
  const sliders = document.querySelectorAll(".reveal-slider");

  sliders.forEach((slider) => {
    const wrap = slider.querySelector(".rb-wrap");
    const img = slider.querySelector(".rb-img");
    let dragging = false;
    let moved = false;
    let startX = 0;

    function setPosition(clientX) {
      const rect = slider.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      wrap.style.width = pct + "%";
      slider.querySelector(".reveal-handle").style.left = pct + "%";
    }

    function pointerDown(e) {
      dragging = true;
      moved = false;
      startX = e.touches ? e.touches[0].clientX : e.clientX;
    }
    function pointerMove(e) {
      if (!dragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      if (Math.abs(clientX - startX) > 3) moved = true;
      setPosition(clientX);
    }
    function pointerUp() {
      dragging = false;
    }

    slider.addEventListener("mousedown", pointerDown);
    slider.addEventListener("touchstart", pointerDown, { passive: true });
    window.addEventListener("mousemove", pointerMove);
    window.addEventListener("touchmove", pointerMove, { passive: true });
    window.addEventListener("mouseup", pointerUp);
    window.addEventListener("touchend", pointerUp);

    // Keyboard support: left/right arrows nudge the slider
    slider.addEventListener("keydown", (e) => {
      const rect = slider.getBoundingClientRect();
      const currentPct = parseFloat(wrap.style.width) || 50;
      if (e.key === "ArrowLeft") {
        setPosition(rect.left + (rect.width * Math.max(0, currentPct - 5)) / 100);
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        setPosition(rect.left + (rect.width * Math.min(100, currentPct + 5)) / 100);
        e.preventDefault();
      }
    });

    // Click (not drag) opens the lightbox with full details
    slider.addEventListener("click", () => {
      if (!moved) openLightbox(slider);
    });
    slider.addEventListener("keyup", (e) => {
      if (e.key === "Enter" || e.key === " ") openLightbox(slider);
    });
  });

  /* ---------- 7. Lightbox modal ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxBefore = document.getElementById("lightboxBefore");
  const lightboxAfter = document.getElementById("lightboxAfter");
  const lightboxLost = document.getElementById("lightboxLost");
  const lightboxDuration = document.getElementById("lightboxDuration");
  const lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(slider) {
    lightboxBefore.src = slider.dataset.before;
    lightboxAfter.src = slider.dataset.after;
    lightboxLost.textContent = `Lost ${slider.dataset.lost}`;
    lightboxDuration.textContent = `In ${slider.dataset.duration} — ${slider.dataset.name}`;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- 8. FAQ accordion (only one open at a time) ---------- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Close all
      faqItems.forEach((other) => {
        other.classList.remove("active");
        other.querySelector(".faq-answer").style.maxHeight = null;
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      // Open the clicked one, unless it was already open (toggle closed)
      if (!isOpen) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- 9. Contact form validation (no page reload) ---------- */
  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  const validators = {
    fullName: (v) => v.trim().length >= 2 || "Please enter your full name.",
    mobile: (v) => /^[0-9+\-\s]{7,15}$/.test(v.trim()) || "Please enter a valid mobile number.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Please enter a valid email address.",
    message: (v) => v.trim().length >= 10 || "Please enter at least 10 characters.",
  };

  function validateField(name) {
    const field = form.elements[name];
    const errorEl = document.getElementById(`err-${name}`);
    const group = field.closest(".form-group");
    const result = validators[name](field.value);

    if (result === true) {
      group.classList.remove("invalid");
      errorEl.textContent = "";
      return true;
    } else {
      group.classList.add("invalid");
      errorEl.textContent = result;
      return false;
    }
  }

  ["fullName", "mobile", "email", "message"].forEach((name) => {
    form.elements[name].addEventListener("blur", () => validateField(name));
    form.elements[name].addEventListener("input", () => {
      if (form.elements[name].closest(".form-group").classList.contains("invalid")) {
        validateField(name);
      }
    });
  });

  function showStatus(type, message) {
    formStatus.textContent = message;
    formStatus.className = `form-status show ${type}`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fieldNames = ["fullName", "mobile", "email", "message"];
    const results = fieldNames.map(validateField);
    const allValid = results.every(Boolean);

    if (!allValid) {
      showStatus("error", "Please fix the highlighted fields and try again.");
      return;
    }

    // No backend on GitHub Pages — simulate a successful submission.
    // To wire this up for real, replace this block with a fetch() call to
    // your form backend (e.g. Formspree, EmailJS, or your own API).
    showStatus("success", "Thank you! Your message has been received — we will get back to you soon.");
    form.reset();
    fieldNames.forEach((name) => {
      form.elements[name].closest(".form-group").classList.remove("invalid");
      document.getElementById(`err-${name}`).textContent = "";
    });
  });

  /* ---------- 10. Floating "scroll to top" button ---------- */
  fabTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
