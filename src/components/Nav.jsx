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
        <ul className="hidden gap-8 font-mono text-xs uppercase tracking-wider text-inkmuted sm:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="transition-colors hover:text-signal">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="rounded-full border border-ink px-4 py-1.5 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-signal hover:text-signal"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}