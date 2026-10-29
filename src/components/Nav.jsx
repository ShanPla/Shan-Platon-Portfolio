import useScrolledPast from "../useScrolledPast.js";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
];

export default function Nav() {
  // At the top the header sits flat on the hero; once the page moves it
  // gets its rule and a faint shadow. The border is only made transparent,
  // never removed, so the header stays 63px tall. The background is 95%
  // opaque: over the dark band and tile, 85% let the grey links fall
  // below 4.5:1 contrast.
  const scrolled = useScrolledPast(8);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-paper/95 backdrop-blur transition-[border-color,box-shadow] duration-300 ${
        scrolled ? "border-line shadow-md shadow-ink/5" : "border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight text-ink">
          Shan Platon
        </a>
        <ul className="flex gap-4 font-mono text-xs uppercase tracking-wider text-inkmuted sm:gap-8">
          {LINKS.map((link) => (
            // Phones keep only Projects, the section visitors look for first.
            <li key={link.href} className={link.href === "#projects" ? "" : "hidden sm:block"}>
              {/* The ::after layer makes the tap area taller than the text,
                  while the focus ring stays around the text. The ::before
                  layer is the underline: it grows from the left on hover
                  or keyboard focus and leaves to the right. */}
              <a
                href={link.href}
                className="relative inline-block transition-colors before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:origin-right before:scale-x-0 before:bg-signal before:transition-transform before:duration-[350ms] before:ease-out after:absolute after:inset-x-0 after:-inset-y-3 hover:text-signaldeep hover:before:origin-left hover:before:scale-x-100 focus-visible:before:origin-left focus-visible:before:scale-x-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="btn btn-secondary px-4 py-1.5 text-xs"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
