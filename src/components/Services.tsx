import { useRef, useState } from "react"
import {
  PHONE_HREF,
  services,
  type Service,
  type ServiceId,
} from "../data/content"
import { Eyebrow } from "./Button"
import { ArrowUpRight } from "./Icons"
import { container, h2, sectionY } from "./layout"

// Alternating 7/5 then 5/7 spans give the grid its editorial asymmetry on desktop.
const spans: Record<ServiceId, string> = {
  house: "lg:col-span-7 lg:h-[clamp(560px,40vw,700px)]",
  airbnb: "lg:col-span-5 lg:h-[clamp(560px,40vw,700px)]",
  linen: "lg:col-span-5 lg:h-[clamp(500px,34vw,600px)]",
  lease: "lg:col-span-7 lg:h-[clamp(500px,34vw,600px)]",
}

function ServiceCard({
  service,
  onQuote,
}: {
  service: Service
  onQuote: (id: ServiceId) => void
}) {
  return (
    <article
      className={`group relative isolate flex min-h-[440px] w-[calc((100vw-36px)/1.5)] min-w-[240px] max-w-[340px] shrink-0 snap-start flex-col justify-between overflow-clip rounded-[24px] p-4 text-white sm:min-h-[500px] sm:w-[calc((100vw-48px)/1.5)] sm:rounded-[28px] sm:p-7 md:w-auto md:min-w-0 md:max-w-none md:shrink lg:min-h-0 lg:rounded-[32px] lg:p-9 ${spans[service.id]}`}
    >
      <img
        src={service.image}
        alt={service.imageAlt}
        loading="lazy"
        className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/15"
      />

      <div className="flex items-center justify-between gap-3">
        <span className="ff-geist-medium inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-[11px] sm:text-[13px] backdrop-blur-md">
          <span className="text-turquoise-glow">{service.index}</span>
          <span aria-hidden className="h-3 w-px bg-white/30" />
          {service.audience}
        </span>
      </div>

      <div>
        <h3 className="ff-geist-medium text-[22px] min-[400px]:text-[24px] sm:text-[28px] lg:text-[clamp(28px,2.3vw,42px)] leading-[1.1] sm:leading-[1.05] tracking-[-0.01em]">
          {service.name}
        </h3>
        <p className="ff-geist mt-2 sm:mt-3 line-clamp-3 text-[13px] sm:text-[15px] lg:text-[17px] leading-[1.5] text-white/90">
          {service.summary}
        </p>
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:flex-wrap sm:items-end sm:justify-between gap-3 sm:gap-4">
          <ul className="flex max-w-[520px] flex-wrap gap-1.5 sm:gap-2">
            {service.includes.map((item) => (
              <li
                key={item}
                className="ff-geist rounded-full bg-white/10 px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-[13px] text-white/95 backdrop-blur-md"
              >
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onQuote(service.id)}
            className="ff-geist-semibold flex w-full items-center justify-between sm:w-auto sm:justify-start min-h-[44px] sm:min-h-[48px] gap-2 rounded-full bg-turquoise-bright py-1.5 pl-4 pr-1.5 sm:py-2 sm:pl-5 sm:pr-2 text-[13px] sm:text-[15px] text-teal transition-colors hover:bg-[#8af3ec]"
          >
            <span>Get a quote</span>
            <span className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-teal text-turquoise-bright transition-transform group-hover:rotate-45">
              <ArrowUpRight size={16} />
            </span>
            <span className="sr-only"> for {service.name}</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Services({
  onQuote,
}: {
  onQuote: (id: ServiceId) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = () => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const itemWidth = el.scrollWidth / services.length
    const idx = Math.min(
      services.length - 1,
      Math.max(0, Math.round(el.scrollLeft / itemWidth)),
    )
    setActiveIndex(idx)
  }

  const scrollToCard = (idx: number) => {
    if (!scrollRef.current) return
    const cards = scrollRef.current.children
    if (cards[idx]) {
      ;(cards[idx] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      })
    }
  }

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className={`bg-white ${sectionY}`}
    >
      <div className={container}>
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Our services</Eyebrow>
            <h2 id="services-title" className={`${h2} mt-4 sm:mt-6 text-ink`}>
              Care for every kind of{" "}
              <span className="ff-script text-teal-text">space</span>.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="ff-geist text-[16px] sm:text-[18px] leading-[1.6] text-muted">
              From weekly home cleans to guest-ready Airbnb turnovers,
              specialised linen care and inspection-ready end-of-lease cleans —
              each service is tailored to the property in front of us.
            </p>
            <a
              href={PHONE_HREF}
              className="ff-geist-semibold mt-4 sm:mt-5 inline-flex items-center gap-2 text-[15px] sm:text-[16px] text-teal underline decoration-turquoise decoration-2 underline-offset-[6px] hover:decoration-teal"
            >
              Not sure which you need? Talk to us
            </a>
          </div>
        </div>

        {/* Cards container: horizontal swipe with 1.5 cards visible on mobile, grid on md+ */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="mt-[clamp(32px,5vw,80px)] -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3.5 sm:gap-4 md:grid md:grid-cols-2 lg:grid-cols-12 md:overflow-visible pb-3 pt-1"
        >
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} onQuote={onQuote} />
          ))}
          {/* Spacer so last card has comfortable right padding when scrolled */}
          <div aria-hidden className="w-1 shrink-0 md:hidden" />
        </div>

        {/* Mobile carousel indicator dots */}
        <div
          className="mt-4 flex items-center justify-center gap-2 md:hidden"
          aria-hidden="true"
        >
          {services.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToCard(i)}
              aria-label={`Scroll to ${s.name}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? "w-6 bg-turquoise"
                  : "w-2 bg-teal/20 hover:bg-teal/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
