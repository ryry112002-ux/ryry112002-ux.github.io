// ===== Base =====
const root = document.documentElement;

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Theme toggle =====
const themeBtn = document.getElementById("themeBtn");
if (themeBtn) {
  const savedTheme = localStorage.getItem("theme"); // "dark" or ""
  if (savedTheme === "dark") root.classList.add("dark");
  updateThemeIcon();

  themeBtn.addEventListener("click", () => {
    root.classList.toggle("dark");
    localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "");
    updateThemeIcon();
  });

  function updateThemeIcon() {
    themeBtn.textContent = root.classList.contains("dark") ? "☀" : "☾";
  }
}

// ===== Copy helpers (Email + Phone) =====
function copyText(text, statusEl) {
  if (!statusEl) return;

  if (!text) {
    statusEl.textContent = "Nothing to copy.";
    setTimeout(() => (statusEl.textContent = ""), 1500);
    return;
  }

  // Clipboard works on HTTPS (GitHub Pages is HTTPS)
  navigator.clipboard.writeText(text).then(() => {
    statusEl.textContent = "Copied ✅";
    setTimeout(() => (statusEl.textContent = ""), 1500);
  }).catch(() => {
    statusEl.textContent = "Copy blocked by browser.";
    setTimeout(() => (statusEl.textContent = ""), 2000);
  });
}

const emailText = document.getElementById("emailText");
const phoneText = document.getElementById("phoneText");
const copyEmailBtn = document.getElementById("copyEmailBtn");
const copyPhoneBtn = document.getElementById("copyPhoneBtn");
const copyEmailStatus = document.getElementById("copyEmailStatus");
const copyPhoneStatus = document.getElementById("copyPhoneStatus");

if (copyEmailBtn && emailText) {
  copyEmailBtn.addEventListener("click", () => {
    copyText(emailText.textContent.trim(), copyEmailStatus);
  });
}

if (copyPhoneBtn && phoneText) {
  copyPhoneBtn.addEventListener("click", () => {
    copyText(phoneText.textContent.trim(), copyPhoneStatus);
  });
}

// ===== Gallery search/filter =====
const search = document.getElementById("search");
const tiles = Array.from(document.querySelectorAll(".tile"));

if (search) {
  search.addEventListener("input", () => {
    const q = search.value.trim().toLowerCase();
    tiles.forEach((tile) => {
      const tags = (tile.getAttribute("data-tags") || "").toLowerCase();
      const caption = (tile.textContent || "").toLowerCase();
      const match = !q || tags.includes(q) || caption.includes(q);
      tile.style.display = match ? "" : "none";
    });
  });
}

// ===== Active navigation on scroll =====
(function () {
  const navLinks = document.querySelectorAll(".nav a");
  const ids = ["home", "about", "videos", "gallery", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActiveNav() {
    let current = "home";
    const y = window.scrollY;

    ids.forEach((el) => {
      const top = el.offsetTop - 160; // sticky header + breathing room
      if (y >= top) current = el.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
    });
  }

  window.addEventListener("scroll", setActiveNav);
  window.addEventListener("load", setActiveNav);
})();

// ===== Mini gallery sliders (autoplay + buttons + swipe) =====
// ===== Mini gallery sliders (autoplay + buttons + swipe) — BULLETPROOF =====
(function () {
  const sliders = document.querySelectorAll(".mini-slider");

  sliders.forEach((slider) => {
    const track = slider.querySelector(".mini-track");
    if (!track) return;

    const slides = Array.from(track.querySelectorAll("img"));
    if (slides.length <= 1) return;

    const prevBtn = slider.querySelector("button.prev");
    const nextBtn = slider.querySelector("button.next");

    let index = 0;
    let timer = null;

    const autoplay = slider.dataset.autoplay === "true";
    const interval = Math.max(1500, parseInt(slider.dataset.interval || "2500", 10));

    function update() {
      track.style.transform = `translateX(${-index * 100}%)`;
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function stopAutoplay() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    function startAutoplay() {
      if (!autoplay) return;
      stopAutoplay();
      timer = setInterval(next, interval);
    }

    // ✅ CLICK HANDLERS
    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        stopAutoplay();
        next();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        stopAutoplay();
        prev();
        startAutoplay();
      });
    }

    // ✅ SWIPE
    let startX = 0;
    let dragging = false;

    slider.addEventListener("pointerdown", (e) => {
      dragging = true;
      startX = e.clientX;
      stopAutoplay();
      slider.setPointerCapture?.(e.pointerId);
    });

    slider.addEventListener("pointerup", (e) => {
      if (!dragging) return;
      dragging = false;

      const dx = e.clientX - startX;
      if (Math.abs(dx) > 35) {
        dx < 0 ? next() : prev();
      }

      startAutoplay();
      slider.releasePointerCapture?.(e.pointerId);
    });

    slider.addEventListener("pointercancel", () => {
      dragging = false;
      startAutoplay();
    });

    // ✅ Pause on hover
    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);

    // Init
    goTo(0);
    startAutoplay();
  });
})();

