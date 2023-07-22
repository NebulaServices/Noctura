if (!import.meta.env.SSR) {
  // @ts-expect-error how is this still not a standard
  window.setImmediate ??= (cb: Function) => setTimeout(cb, 0);
}
