// The first Tab stop: jumps past the header to the page's <main id="main">.
// Hidden until it has focus.
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only font-mono text-xs uppercase tracking-wider focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
    >
      Skip to content
    </a>
  );
}
