export function getCurrentTheme() {
  let currentTheme = localStorage.getItem("theme");
  if (!currentTheme) {
    currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    localStorage.setItem("theme", currentTheme);
  }

  return currentTheme;
}
