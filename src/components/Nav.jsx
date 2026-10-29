const LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-lg font-semibold tracking-tight text-ink">
          Shan Platon
        </a>
        <ul className="flex gap-4 font-mono text-xs uppercase tracking-wider text-inkmuted sm:gap-8">
          {LINKS.map((link) => (
            // Phones keep only Projects, the section visitors look for first.
            <li key={link.href} className={link.href === "#projects" ? "" : "hidden sm:block"}>
              {/* The ::after layer makes the tap area taller than the text,
                  while the focus ring stays around the text. */}
              <a
                href={link.href}
                className="relative inline-block transition-colors after:absolute after:inset-x-0 after:-inset-y-3 hover:text-signaldeep"
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
