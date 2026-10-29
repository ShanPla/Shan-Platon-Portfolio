import Reveal from "./Reveal.jsx";

export default function About() {
  return (
    <section id="about" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-signaldeep">
            01 — About
          </p>

          <h2 className="mt-1.5 max-w-2xl font-display text-xl font-semibold leading-tight tracking-tight text-ink sm:text-2xl">
            A frontend-focused developer building web and mobile systems.
          </h2>

          <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-inkmuted">
            I'm a Computer Science student at De La Salle Lipa, currently
            in my final year. I build with React, React Native, Expo, and
            Supabase, with a growing focus on backend development.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
