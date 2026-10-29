import { useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "./components/PageHeader.jsx";

export default function NotFound({ title = "Page not found" }) {
  useEffect(() => {
    document.title = `${title} — Shan Platon`;
  }, [title]);

  return (
    <div className="min-h-screen bg-paper">
      <PageHeader />

      <main className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center sm:py-32">
        <p className="font-mono text-xs uppercase tracking-widest text-signaldeep">
          404
        </p>

        <h1
          tabIndex={-1}
          className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink focus:outline-none sm:text-5xl"
        >
          {title}
        </h1>

        <p className="mt-4 text-sm text-inkmuted">
          That link doesn't match anything here.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-paper transition-colors hover:bg-signaldeep"
          >
            Home
          </Link>

          <Link
            to="/#projects"
            state={{ restore: true }}
            className="rounded-full border border-line bg-surface px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-ink transition-colors hover:border-signal hover:text-signaldeep"
          >
            <span aria-hidden="true">←</span> Back to Projects
          </Link>
        </div>
      </main>
    </div>
  );
}
