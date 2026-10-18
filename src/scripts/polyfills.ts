if (!import.meta.env.SSR) {
  // @ts-expect-error how is this still not a standard
  window.setImmediate ??= (cb: () => void) => setTimeout(cb, 0);
}
