import { Link } from "react-router-dom";
import useScrolledPast from "../useScrolledPast.js";
import ThemeToggle from "./ThemeToggle.jsx";

// Header for the pages other than home. Same height and style as the home
// header (Nav.jsx), so the logo stays in place when switching pages; its
// rule shows once the page moves, as there. The background is 95% opaque
// there too, so Back to Projects stays readable over the dark Next
// project band.
export default function PageHeader() {
  const [scrolled, settled] = useScrolledPast(8);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-paper/95 backdrop-blur ${
        settled ? "transition-[border-color,box-shadow] duration-300" : ""
      } ${scrolled ? "border-line shadow-md shadow-ink/5" : "border-transparent"}`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-[17px]">
        <Link
          to="/"
          className="font-display text-lg font-semibold tracking-tight text-ink"
        >
          Shan Platon
        </Link>

        {/* restore: lands where you left the home page (ScrollToTop.jsx).
            Same underline as the home header's links. Below 360px it reads
            Projects on screen, so it fits beside the theme button; screen
            readers still hear Back to Projects. */}
        <div className="flex items-center gap-5">
          <ThemeToggle />
          <Link
            to="/#projects"
            state={{ restore: true }}
            className="relative inline-block font-mono text-xs uppercase tracking-wider text-inkmuted transition-colors before:absolute before:inset-x-0 before:bottom-0 before:h-0.5 before:origin-right before:scale-x-0 before:bg-signal before:transition-transform before:duration-[350ms] before:ease-out after:absolute after:inset-x-0 after:-inset-y-3.5 hover:text-signaldeep hover:before:origin-left hover:before:scale-x-100 focus-visible:before:origin-left focus-visible:before:scale-x-100"
          >
            <span aria-hidden="true">←</span>{" "}
            <span className="max-[359px]:sr-only">Back to </span>Projects
          </Link>
        </div>
      </nav>
    </header>
  );
}
