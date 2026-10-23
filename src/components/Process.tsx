import { PHONE_DISPLAY, PHONE_HREF } from "../data/content"
import Button, { Eyebrow } from "./Button"
import { container, h2, sectionY } from "./layout"

const steps = [
  {
    title: "Share your property details",
    body: "Tell us which service you need, the size of your property and where it is located.",
    meta: "Online or by phone",
  },
  {
    title: "Receive your quote",
    body: "We review your details and send a clear, tailored quote — with no obligation to book.",
    meta: "Tailored to your space",
  },
  {
    title: "Arrange your clean",
    body: "Choose a day and time that suits you, and we take care of everything from there.",
    meta: "At a time that suits you",
  },
]

export default function Process({ onQuote }: { onQuote: () => void }) {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className={`bg-white ${sectionY}`}
    >
      <div className={container}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[760px]">
            <Eyebrow>How it works</Eyebrow>
            <h2 id="process-title" className={`${h2} mt-6 text-ink`}>
              A simple booking process.
            </h2>
          </div>
          <p className="ff-geist max-w-[420px] text-[18px] leading-[1.6] text-muted">
            Three steps from first enquiry to a freshly cleaned space. Most
            people are done in a couple of minutes.
          </p>
        </div>

        <ol className="mt-[clamp(48px,5vw,88px)] grid gap-0 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => {
            const last = i === steps.length - 1
            return (
              <li
                key={s.title}
                className="relative grid grid-cols-[56px_1fr] gap-x-5 pb-10 md:block md:pb-0"
              >
                {/* Connector: vertical on mobile, horizontal on desktop */}
                {!last && (
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-[27.5px] top-[56px] w-px bg-teal/15 md:hidden"
                  />
                )}
                <div className="flex items-center md:mb-8">
                  <span className="ff-geist-medium relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-sand text-[18px] text-teal ring-1 ring-teal/10">
                    0{i + 1}
                  </span>
                  {!last && (
                    <span
                      aria-hidden
                      className="ml-4 hidden h-px flex-1 bg-teal/15 md:block"
                    />
                  )}
                </div>
                <div className="pt-3 md:pt-0">
                  <p className="ff-geist-semibold text-[12px] uppercase tracking-[0.14em] text-teal-text">
                    {s.meta}
                  </p>
                  <h3 className="ff-geist-medium mt-3 text-[clamp(22px,1.7vw,28px)] leading-[1.2] text-ink">
                    {s.title}
                  </h3>
                  <p className="ff-geist mt-3 max-w-[380px] text-[16px] leading-[1.6] text-muted">
                    {s.body}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="mt-[clamp(40px,4.5vw,72px)] flex flex-col gap-5 border-t border-teal/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="ff-geist text-[16px] text-muted">
            Prefer to talk it through?{" "}
            <a
              href={PHONE_HREF}
              className="ff-geist-semibold text-teal underline decoration-turquoise decoration-2 underline-offset-[5px]"
            >
              Call {PHONE_DISPLAY}
            </a>
          </p>
          <Button
            as="button"
            type="button"
            variant="ink"
            arrow
            onClick={onQuote}
            className="self-start sm:self-auto"
          >
            Get a Quick Quote
          </Button>
        </div>
      </div>
    </section>
  )
}
