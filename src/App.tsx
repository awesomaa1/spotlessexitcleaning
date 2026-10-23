import { useCallback, useState } from "react"
import About from "./components/About"
import FinalCta from "./components/FinalCta"
import Footer from "./components/Footer"
import Hero from "./components/Hero"
import Process from "./components/Process"
import QuoteForm from "./components/QuoteForm"
import Reviews from "./components/Reviews"
import Services from "./components/Services"
import StickyNav from "./components/StickyNav"
import { sectionIds, type ServiceId } from "./data/content"
import useActiveSection from "./hooks/useActiveSection"

export default function App() {
  const [service, setService] = useState<ServiceId | null>(null)
  const active = useActiveSection(sectionIds)

  // Every quote CTA routes here; service cards preselect their service.
  const requestQuote = useCallback((id?: ServiceId) => {
    if (id) setService(id)
    document
      .getElementById("quote")
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])
  const openQuote = useCallback(() => requestQuote(), [requestQuote])

  return (
    <div className="min-h-screen bg-white">
      <a
        href="#quote"
        className="ff-geist-semibold sr-only z-[70] rounded-full bg-turquoise-bright px-5 py-3 text-teal focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to quote form
      </a>
      <StickyNav onQuote={openQuote} active={active} />
      <main className="flex flex-col">
        <Hero onQuote={openQuote} active={active} />
        <Services onQuote={requestQuote} />
        <About />
        <Process onQuote={openQuote} />
        <QuoteForm service={service} onServiceChange={setService} />
        <Reviews />
        <FinalCta onQuote={openQuote} />
      </main>
      <div className="h-2 sm:h-[16px]" />
      <Footer onQuote={requestQuote} />
    </div>
  )
}
