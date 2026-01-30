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

  navigator.clipboard.writeText(text).then(() => {
    statusEl.textContent = "Copied ✅";
    setTimeout(() => (statusEl.textContent = ""), 1500);
  }).catch(() => {
    statusEl.textContent = "Copy blocked by browser.";
    setTimeout(() => (statusEl.textContent = ""), 2000);
  });
}

// If you're using the NEW contact layout:
const emailText = document.getElementById("emailText");          // <a id="emailText">...</a>
const phoneText = document.getElementById("phoneText");          // <a id="phoneText">...</a>
const copyEmailBtn = document.getElementById("copyEmailBtn");    // <button id="copyEmailBtn">
const copyPhoneBtn = document.getElementById("copyPhoneBtn");    // <button id="copyPhoneBtn">
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

// Backward compatibility (if your HTML still has old IDs: copyBtn/copyStatus)
const legacyCopyBtn = document.getElementById("copyBtn");
const legacyCopyStatus = document.getElementById("copyStatus");
if (legacyCopyBtn && legacyCopyStatus) {
  const legacyEmail = (emailText?.textContent || "").trim() || "ryry112002@gmail.com";
  legacyCopyBtn.addEventListener("click", () => copyText(legacyEmail, legacyCopyStatus));
}

// ===== Gallery search/filter =====
// Works even if you have multiple gallery sections; it filters all .tile elements
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
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a");

function setActiveNav() {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 140; // offset for sticky header
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", setActiveNav);
window.addEventListener("load", setActiveNav);

