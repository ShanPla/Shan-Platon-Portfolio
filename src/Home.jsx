import { useEffect } from "react";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Skills from "./components/Skills.jsx";
import Statement from "./components/Statement.jsx";
import Projects from "./components/Projects.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import BackToTop from "./components/BackToTop.jsx";
import SkipLink from "./components/SkipLink.jsx";

// Same as the <title> in index.html; project pages set their own.
const HOME_TITLE = "Shan Christian Platon — Software & Web Developer";

export default function Home() {
  useEffect(() => {
    document.title = HOME_TITLE;
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <SkipLink />
      <Nav />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <About />
        <Skills />
        <Statement />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
