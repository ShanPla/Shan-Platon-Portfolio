import { profile } from "../data/content.js";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl text-pretty px-6 py-6 font-mono text-[11px] text-inkmuted">
        &copy; {new Date().getFullYear()} {profile.name}. Built with React &amp; Tailwind.
      </div>
    </footer>
  );
}
