import { Eyebrow } from "./Button"
import { h2, panel, panelInner, panelWrap, sectionY } from "./layout"

const pillars = [
  {
    title: "Attention to detail",
    body: "Skirting boards, light switches, window tracks, the fold of a towel. We finish the small things most people never think to check.",
  },
  {
    title: "Tailored to your property",
    body: "A family home, a short-stay apartment and a vacated rental each need something different. Every clean is shaped around the space and how it is used.",
  },
  {
    title: "A straightforward booking",
    body: "Share a few details, receive a clear quote and choose a time that suits. No back-and-forth, no guesswork — just a clean you can rely on.",
  },
]

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className={panelWrap}>
      <div className={`${panel} bg-sand`}>
        <div
          className={`${panelInner} ${sectionY} grid gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-[clamp(40px,5vw,96px)] lg:items-start`}
        >
          {/* Header: order-1 on mobile, top of right column on desktop */}
          <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7 lg:row-start-1">
            <Eyebrow>Why Spotless</Eyebrow>
            <h2 id="about-title" className={`${h2} mt-4 sm:mt-6 text-ink`}>
              The difference is in the{" "}
              <span className="ff-script text-teal-text">details</span>.
            </h2>
            <p className="ff-geist mt-4 sm:mt-6 max-w-[560px] text-[clamp(16px,1.25vw,20px)] leading-[1.6] text-muted">
              Spotless Cleaning brings a considered, detail-first approach to
              Melbourne homes and rentals — calm, careful and consistent from
              the first visit to the hundredth.
            </p>
          </div>

          {/* Photo: order-2 on mobile, left column spanning both rows on desktop */}
          <figure className="relative order-2 lg:order-1 lg:col-span-5 lg:row-start-1 lg:row-end-3">
            <img
              src="/assets/about.jpeg"
              alt="Crisp white linen catching soft afternoon light on a freshly made bed"
              loading="lazy"
              className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5.2] w-full rounded-[20px] sm:rounded-[28px] object-cover lg:rounded-[32px]"
            />
            <figcaption className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-[360px] flex items-center gap-2.5 sm:gap-3 rounded-[18px] sm:rounded-[24px] bg-black/40 px-3.5 py-2.5 sm:px-5 sm:py-4 text-white backdrop-blur-md">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full bg-turquoise-glow"
              />
              <span className="ff-geist text-[12px] sm:text-[14px] leading-[1.4]">
                The finishing touches are where a clean becomes Spotless.
              </span>
            </figcaption>
          </figure>

          {/* Pillars: order-3 on mobile, bottom of right column on desktop */}
          <ol className="order-3 lg:order-3 lg:col-span-6 lg:col-start-7 lg:row-start-2 border-t border-teal/15">
            {pillars.map((p, i) => (
              <li
                key={p.title}
                className="grid gap-2 border-b border-teal/15 py-5 sm:grid-cols-[72px_1fr] sm:gap-6 sm:py-7"
              >
                <span className="ff-geist-medium text-[14px] sm:text-[15px] text-teal-text">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="ff-geist-medium text-[clamp(19px,1.5vw,24px)] leading-[1.25] text-ink">
                    {p.title}
                  </h3>
                  <p className="ff-geist mt-1.5 sm:mt-2 max-w-[520px] text-[15px] sm:text-[16px] leading-[1.6] text-muted">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
