import { Component } from "react";
import { profile } from "../data/content.js";

// If a page throws while rendering, this shows a short message with a
// reload button and my email, instead of a blank page.
export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-signaldeep">Error</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-sm leading-6 text-inkmuted">
          This page couldn't load. Try again, or email me at{" "}
          <a
            href={`mailto:${profile.email}`}
            className="text-ink underline decoration-signal underline-offset-4 hover:text-signaldeep"
          >
            {profile.email}
          </a>
          .
        </p>
        <button type="button" onClick={() => window.location.reload()} className="btn btn-primary mt-8">
          Reload the page
        </button>
      </main>
    );
  }
}
