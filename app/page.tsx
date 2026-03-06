import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Credibility from "./components/Credibility";
import Origin from "./components/Origin";
import Science from "./components/Science";
import Founder from "./components/Founder";
import LabSection from "./components/LabSection";
import Audience from "./components/Audience";
import Products from "./components/Products";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <Navbar />
      
      {/* 1. Impactful Intro: Pink Oysters from your Cary experiments */}
      <Hero />
      
      {/* 2. Quick Trust: PhD/NC State highlights */}
      <Credibility />
      
      {/* 3. The Story: Transition from Cary research to Moncure production */}
      <Origin />
      
      {/* 4. The Expertise: Detailed Academic Credentials (PhD, MS, BSc) */}
      <Science />
      
      {/* 5. The Personal Touch: Dr. Anna Thomas's leadership */}
      <Founder />
      
      {/* 6. The Method: Lab standards and the 01-04 Spawn Workflow */}
      <LabSection />
      
      {/* 7. The Market: Who we serve (Growers, Labs, Innovators) */}
      <Audience />
      
      {/* 8. The Offer: Lion's Mane, Gray, and Pink Oyster technical cards */}
      <Products />
      
      {/* 9. The Action: Capturing leads for pre-orders and inquiries */}
      <Contact />
      
      <Footer />
    </main>
  );
}