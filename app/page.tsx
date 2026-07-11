import Hero from "./components/Hero";
import Credibility from "./components/Credibility";
import Science from "./components/Science";
import InsideLab from "./components/InsideLab";
import Founder from "./components/Founder";
import Process from "./components/Process";
import StrainsPreview from "./components/StrainsPreview";
import Audience from "./components/Audience";
import LeadCapture from "./components/LeadCapture";

// Hero reads product photos via the Admin SDK, which isn't tracked by
// Next's fetch cache — without this the homepage would be baked statically
// at build time and never reflect a cover-photo change made later.
export const revalidate = 60;

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
