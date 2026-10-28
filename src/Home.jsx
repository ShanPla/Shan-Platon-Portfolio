import { useEffect } from "react";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Projects from "./components/Projects.jsx";
import Contact from "./components/Contact.jsx";

// Same as the <title> in index.html; project pages set their own.
const HOME_TITLE = "Shan Christian Platon — Software & Web Developer";

export default function Home() {
  useEffect(() => {
    document.title = HOME_TITLE;
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}
