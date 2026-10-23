import {
  PHONE_HREF,
  services,
  type Service,
  type ServiceId,
} from "../data/content"
import { Eyebrow } from "./Button"
import { ArrowUpRight } from "./Icons"
import { container, h2, sectionY } from "./layout"

// Alternating 7/5 then 5/7 spans give the grid its editorial asymmetry.
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
      className={`group relative isolate flex min-h-[520px] flex-col justify-between overflow-clip rounded-[28px] p-5 text-white sm:min-h-[560px] sm:p-7 lg:min-h-0 lg:rounded-[32px] lg:p-9 ${spans[service.id]}`}
    >
      <img
        src={service.image}
        alt={service.imageAlt}
        loading="lazy"
        className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-black/10"
      />

      <div className="flex items-center justify-between gap-3">
        <span className="ff-geist-medium inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2 text-[13px] backdrop-blur-md">
          <span className="text-turquoise-glow">{service.index}</span>
          <span aria-hidden className="h-3 w-px bg-white/30" />
          {service.audience}
        </span>
      </div>

      <div>
        <h3 className="ff-geist-medium text-[clamp(28px,2.3vw,42px)] leading-[1.05] tracking-[-0.01em]">
          {service.name}
        </h3>
        <p className="ff-geist mt-3 max-w-[480px] text-[16px] leading-[1.55] text-white/85 lg:text-[17px]">
          {service.summary}
        </p>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <ul className="flex max-w-[520px] flex-wrap gap-2">
            {service.includes.map((item) => (
              <li
                key={item}
                className="ff-geist rounded-full bg-white/10 px-3 py-1.5 text-[13px] text-white/90 backdrop-blur-md"
              >
                {item}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onQuote(service.id)}
            className="ff-geist-semibold inline-flex min-h-[48px] items-center gap-2 rounded-full bg-turquoise-bright py-2 pl-5 pr-2 text-[15px] text-teal transition-colors hover:bg-[#8af3ec]"
          >
            Get a quote
            <span className="flex size-8 items-center justify-center rounded-full bg-teal text-turquoise-bright transition-transform group-hover:rotate-45">
              <ArrowUpRight size={18} />
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
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className={`bg-white ${sectionY}`}
    >
      <div className={container}>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>Our services</Eyebrow>
            <h2 id="services-title" className={`${h2} mt-6 text-ink`}>
              Care for every kind of{" "}
              <span className="ff-script text-teal-text">space</span>.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="ff-geist text-[18px] leading-[1.6] text-muted">
              From weekly home cleans to guest-ready Airbnb turnovers,
              specialised linen care and inspection-ready end-of-lease cleans —
              each service is tailored to the property in front of us.
            </p>
            <a
              href={PHONE_HREF}
              className="ff-geist-semibold mt-5 inline-flex items-center gap-2 text-[16px] text-teal underline decoration-turquoise decoration-2 underline-offset-[6px] hover:decoration-teal"
            >
              Not sure which you need? Talk to us
            </a>
          </div>
        </div>

        <div className="mt-[clamp(40px,5vw,80px)] grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} onQuote={onQuote} />
          ))}
        </div>
      </div>
    </section>
  )
}
