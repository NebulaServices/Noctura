import "./polyfills";

export function toggleTheme(dark = !document.body.classList.contains("dark")) {
  const newTheme = dark ? "dark" : "light";
  localStorage.setItem("theme", newTheme);

  // temporarily disable transitions to avoid color transitions
  document.body.classList.add("disable-transitions");

  document.body.classList.toggle("dark", dark);

  setImmediate(() => document.body.classList.remove("disable-transitions"));

  document.dispatchEvent(new Event("themechange"));

  console.log("Switched theme to", newTheme);
  return dark;
}
