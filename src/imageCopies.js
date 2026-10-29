// Smaller copies of the project screenshots, for small screens.
// `npm run images` (scripts/make-image-copies.js) writes them next to each
// original in public/projects/ as <name>-<width>w.webp, and the components
// list them in srcset with srcSet(), so the browser downloads the smallest
// one that is still sharp. Both take the widths from copyWidths().

const LANDSCAPE_WIDTHS = [640, 1024, 1280];
// Portrait shots are phone screenshots, shown at most about 235px wide.
const PORTRAIT_WIDTHS = [360, 480];

/** Copy widths for an image of this pixel size: only those under its width. */
export function copyWidths({ width, height }) {
  const widths = height > width ? PORTRAIT_WIDTHS : LANDSCAPE_WIDTHS;
  return widths.filter((w) => w < width);
}

/** Path of the copy of `src` at `width`: shot.webp -> shot-640w.webp. */
export function copyPath(src, width) {
  return src.replace(/\.[^./\\]+$/, `-${width}w.webp`);
}

/** Whether a file name or path is a copy, so a copy is never copied again. */
export function isCopy(path) {
  return /-\d+w\.webp$/.test(path);
}

/**
 * srcset for the image at `src` whose pixel size is `size` ({ width, height },
 * as in content.js): its copies, then the original at its real width.
 * Undefined without a size, so the img falls back to src alone.
 */
export function srcSet(src, size) {
  if (!src || !size?.width || !size?.height) return undefined;

  return [
    ...copyWidths(size).map((w) => `${copyPath(src, w)} ${w}w`),
    `${src} ${size.width}w`,
  ].join(", ");
}
