// Small helpers shared by several components.

/** Two digits, so the first item is 01. */
export const pad = (n) => String(n).padStart(2, "0");

/** Whether the reader asked their system for less motion. */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
