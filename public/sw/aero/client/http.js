fetch = new Proxy(fetch, {
  apply(t, g, a) {
    if (a[0] instanceof Request) return Reflect.apply(t, g, a);

    if (a[0]) a[0] = __aero$encodeURL(a[0], __aero$meta);
      
    return Reflect.apply(t, g, a);
  }
})

function apply(t, g, a) {
  if (a[2]) a[2] = __aero$encodeURL(a[2], __aero$meta);

  return Reflect.apply(t, g, a);
}

history.pushState = new Proxy(history.pushState, {apply});
history.replaceState = new Proxy(history.replaceState, {apply});