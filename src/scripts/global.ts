import "./polyfills";
import "./themeRuntime";

// meow
console.log(
  "%c read if cute!!!",
  "font-size: 50px; color:" +
    getComputedStyle(document.body).getPropertyValue("--accent")
);
