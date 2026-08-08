import Reveal from "./Reveal.jsx";

export default function About() {
  return (
    <section id="about" className="border-b border-line">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-signal">01 — About</p>
          <h2 className="mt-3 max-w-2xl font-display text-2xl font-semibold text-ink sm:text-3xl">
            A frontend-first developer learning to build the full stack.
          </h2>
        </Reveal>
        <Reveal delay={120} className="mt-6 max-w-2xl space-y-4 text-inkmuted leading-relaxed">
          <p>
            I'm a Computer Science student at De La Salle Lipa, currently in my final year. Most
            of my hands-on work has been on the frontend — React for the web, React Native and
            Expo for mobile — wiring up interfaces to Supabase and Firebase backends.
          </p>
          <p>
            My projects lean toward systems people actually rely on: an incident reporting
            platform for my city, a home security dashboard, a booking app. I'm looking for an
            OJT placement where I can keep building on the frontend while getting real exposure
            to backend development — APIs, databases, and how the two sides actually talk to
            each other.
          </p>
        </Reveal>
      </div>
    </section>
  );
}