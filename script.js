const root = document.documentElement;

document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle (saved)
const themeBtn = document.getElementById("themeBtn");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") root.classList.add("light");
updateThemeIcon();

themeBtn.addEventListener("click", () => {
  root.classList.toggle("light");
  localStorage.setItem("theme", root.classList.contains("light") ? "light" : "dark");
  updateThemeIcon();
});

function updateThemeIcon() {
  const isLight = root.classList.contains("light");
  themeBtn.textContent = isLight ? "☀️" : "🌙";
}

// Copy email button (edit this)
const email = "yourname@email.com";
const copyBtn = document.getElementById("copyBtn");
const copyStatus = document.getElementById("copyStatus");

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = "Copied ✅";
    setTimeout(() => (copyStatus.textContent = ""), 1500);
  } catch {
    copyStatus.textContent = "Copy failed (browser blocked).";
    setTimeout(() => (copyStatus.textContent = ""), 2000);
  }
});
