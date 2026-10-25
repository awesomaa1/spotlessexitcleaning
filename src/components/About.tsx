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
          className={`${panelInner} ${sectionY} grid items-center gap-[clamp(40px,5vw,96px)] lg:grid-cols-12`}
        >
          <figure className="relative lg:col-span-5">
            <img
              src="/assets/about.jpeg"
              alt="Crisp white linen catching soft afternoon light on a freshly made bed"
              loading="lazy"
              className="aspect-[4/5] w-full rounded-[28px] object-cover sm:aspect-[5/6] lg:aspect-[4/5.2] lg:rounded-[32px]"
            />
            <figcaption className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-[24px] bg-black/30 px-5 py-4 text-white backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-[360px]">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full bg-turquoise-glow"
              />
              <span className="ff-geist text-[14px] leading-[1.45]">
                The finishing touches are where a clean becomes Spotless.
              </span>
            </figcaption>
          </figure>

          <div className="lg:col-span-6 lg:col-start-7">
            <Eyebrow>Why Spotless</Eyebrow>
            <h2 id="about-title" className={`${h2} mt-6 text-ink`}>
              The difference is in the{" "}
              <span className="ff-script text-teal-text">details</span>.
            </h2>
            <p className="ff-geist mt-6 max-w-[560px] text-[clamp(17px,1.25vw,20px)] leading-[1.6] text-muted">
              Spotless Cleaning brings a considered, detail-first approach to
              Melbourne homes and rentals — calm, careful and consistent from
              the first visit to the hundredth.
            </p>

            <ol className="mt-[clamp(32px,3.5vw,56px)] border-t border-teal/15">
              {pillars.map((p, i) => (
                <li
                  key={p.title}
                  className="grid gap-2 border-b border-teal/15 py-6 sm:grid-cols-[72px_1fr] sm:gap-6 sm:py-7"
                >
                  <span className="ff-geist-medium text-[15px] text-teal-text">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="ff-geist-medium text-[clamp(20px,1.5vw,24px)] leading-[1.25] text-ink">
                      {p.title}
                    </h3>
                    <p className="ff-geist mt-2 max-w-[520px] text-[16px] leading-[1.6] text-muted">
                      {p.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
