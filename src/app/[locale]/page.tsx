import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Presentation from "@/components/Presentation/Presentation";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <Hero />
      <Presentation />
    </div>
  );
}
