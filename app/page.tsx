import Hero from "./components/Hero";
import Credibility from "./components/Credibility";
import Science from "./components/Science";
import InsideLab from "./components/InsideLab";
import Founder from "./components/Founder";
import Process from "./components/Process";
import StrainsPreview from "./components/StrainsPreview";
import Audience from "./components/Audience";
import LeadCapture from "./components/LeadCapture";

export default function Home() {
  return (
    <main>
      <Hero />
      <Credibility />
      <Science />
      <InsideLab />
      <Founder />
      <Process />
      <StrainsPreview />
      <Audience />
      <LeadCapture />
    </main>
  );
}
