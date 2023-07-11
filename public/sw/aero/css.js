function rewriteCss(css, meta) {
  return css.replace(/url\(["'`]?(.*?)["'`]?\);?/gmi, (str, p1) => str.replace(p1, __aero$encodeURL(p1, meta)))
}