import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Credibility from "./components/Credibility"
import Origin from "./components/Origin"
import Science from "./components/Science"
import LabFeature from "./components/LabFeature"
import Founder from "./components/Founder"
import LabSection from "./components/LabSection"
import SpawnProcess from "./components/SpawnProcess"
import Species from "./components/Species"
import Products from "./components/Products"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">

      <Navbar />

      <Hero />

      <Credibility />

      <Origin />

      <Science />

      <LabFeature />

      <Founder />

      <LabSection />

      <SpawnProcess />

      <Species />

      <Products />

      <Footer />

    </main>
  )
}