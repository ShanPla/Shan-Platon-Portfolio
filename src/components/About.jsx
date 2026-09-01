import Reveal from "./Reveal.jsx";

export default function About() {
  return (
    <section id="about" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:py-14">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-signal">
            01 — About
          </p>

          <h2 className="mt-2 max-w-2xl font-display text-xl font-semibold leading-tight text-ink sm:text-2xl">
            A frontend-first developer learning to build the full stack.
          </h2>
        </Reveal>

        <Reveal
          delay={120}
          className="mt-5 max-w-3xl space-y-3 text-sm leading-6 text-inkmuted"
        >
          <p>
            I'm a Computer Science student at De La Salle Lipa, currently in
            my final year. Most of my hands-on work has been on the frontend —
            React for the web, React Native and Expo for mobile — wiring up
            interfaces to Supabase and Firebase backends.
          </p>

          <p>
            My projects lean toward systems people actually rely on: an
            incident reporting platform for my city, a home security
            dashboard, and a booking app. I'm looking to keep building on the
            frontend while gaining deeper experience with backend development,
            APIs, and databases.
          </p>
        </Reveal>
      </div>
    </section>
  );
}