import { PHONE_HREF } from "../data/content"
import Button, { Eyebrow } from "./Button"
import { panel, panelWrap } from "./layout"

export default function FinalCta({ onQuote }: { onQuote: () => void }) {
  return (
    <section aria-labelledby="cta-title" className={panelWrap}>
      <div
        className={`${panel} flex min-h-[clamp(440px,48vw,760px)] items-center justify-center`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <img
            src="/images/closing-living-room.jpg"
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-black/[0.47]" />
        </div>
        <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-14 sm:py-20 text-center">
          <Eyebrow tone="dark">Ready when you are</Eyebrow>
          <h2
            id="cta-title"
            className="ff-script mt-6 sm:mt-8 text-[clamp(32px,5.4vw,80px)] leading-[1.08] sm:leading-[1.04] text-headline md:leading-[0.98]"
          >
            <span className="ff-geist">Ready for a </span>
            <span>Spotless </span>
            <span className="ff-geist">home?</span>
          </h2>
          <p className="ff-geist mt-4 sm:mt-6 max-w-[600px] text-[clamp(15px,1.4vw,22px)] leading-[1.5] text-headline/90">
            Tell us about your property and we will prepare a tailored quote —
            or speak with our team directly.
          </p>
          <div className="mt-8 sm:mt-10 flex w-full max-w-[340px] flex-col items-stretch gap-3 min-[440px]:w-auto min-[440px]:max-w-none min-[440px]:flex-row min-[440px]:items-center min-[440px]:gap-4">
            <Button as="button" type="button" onClick={onQuote} arrow>
              Get a Quick Quote
            </Button>
            <Button href={PHONE_HREF} variant="secondary">
              Contact Our Team
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
