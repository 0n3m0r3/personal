import Hero from "@/components/Hero/Hero";
import Intro from "@/components/Intro/Intro";
import About from "@/components/About/About";
import Experience from "@/components/Experience/Experience";
import Skills from "@/components/Skills/Skills";
import Collaboration from "@/components/Collaboration/Collaboration";
import Technologies from "@/components/Technologies/Technologies";
import Projects from "@/components/Projects/Projects";
import ProjectCta from "@/components/ProjectCta/ProjectCta";

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <Intro />
      <About />
      <Experience />
      <Skills />
      <Collaboration />
      <Technologies />
      <Projects />
      <ProjectCta />
    </main>
  );
}
