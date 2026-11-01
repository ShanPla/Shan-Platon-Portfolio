import useScrolledPast from "../useScrolledPast.js";
import ThemeToggle from "./ThemeToggle.jsx";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
];

// The section links. Nav shows them in one of two places by screen width;
// the other copy is display: none, so keyboards and screen readers only ever
// meet one, in the order it appears on screen.
function SectionLinks({ className }) {
  return (
    <ul className={`font-mono text-xs uppercase tracking-wider text-inkmuted ${className}`}>
      {LINKS.map((link) => (
        <li key={link.href}>
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
  );
}

export default function Nav() {
  // At the top the header sits flat on the hero; once the page moves it
  // gets its rule and a faint shadow. The border is only made transparent,
  // never removed, so the header keeps its height: 63px, or 104px on phones
  // with the second row (--header-height in index.css). The background is
  // 95% opaque: over the dark band and tile, 85% let the grey links fall
  // below 4.5:1 contrast. The rule only fades once the hook has settled,
  // so a page that opens scrolled shows it at once.
  const [scrolled, settled] = useScrolledPast(8);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-paper/95 backdrop-blur ${
        settled ? "transition-[border-color,box-shadow] duration-300" : ""
      } ${scrolled ? "border-line shadow-md shadow-ink/5" : "border-transparent"}`}
    >
      <nav className="mx-auto max-w-5xl px-6">
        <div className="flex items-center justify-between py-4">
          <a href="#top" className="font-display text-lg font-semibold tracking-tight text-ink">
            Shan Platon
          </a>
          <SectionLinks className="hidden gap-8 sm:flex" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#contact"
              className="btn btn-secondary px-4 py-1.5 text-xs"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Phones: the section links get a row of their own under the name,
            the theme switch and Contact, each centred in a third. */}
        <SectionLinks className="grid grid-cols-3 border-t border-line py-3 text-center sm:hidden" />
      </nav>
    </header>
  );
}
