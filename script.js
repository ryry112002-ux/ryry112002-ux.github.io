const root = document.documentElement;

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle (light default, optional dark mode)
const themeBtn = document.getElementById("themeBtn");
const savedTheme = localStorage.getItem("theme"); // "dark" or null
if (savedTheme === "dark") root.classList.add("dark");
updateThemeIcon();

themeBtn.addEventListener("click", () => {
  root.classList.toggle("dark");
  localStorage.setItem("theme", root.classList.contains("dark") ? "dark" : "");
  updateThemeIcon();
});

function updateThemeIcon() {
  const isDark = root.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀" : "☾";
}

// Copy email button
const email = "yourfamily@email.com"; // <-- change this
const copyBtn = document.getElementById("copyBtn");
const copyStatus = document.getElementById("copyStatus");

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = "Copied ✅";
    setTimeout(() => (copyStatus.textContent = ""), 1500);
  } catch {
    copyStatus.textContent = "Copy blocked by browser.";
    setTimeout(() => (copyStatus.textContent = ""), 2000);
  }
});

// Gallery search/filter
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
