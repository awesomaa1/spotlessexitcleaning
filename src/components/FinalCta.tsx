import { PHONE_HREF } from "../data/content"
import Button, { Eyebrow } from "./Button"
import { panel, panelWrap } from "./layout"

export default function FinalCta({ onQuote }: { onQuote: () => void }) {
  return (
    <section aria-labelledby="cta-title" className={panelWrap}>
      <div
        className={`${panel} flex min-h-[clamp(520px,48vw,760px)] items-center justify-center`}
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
        <div className="relative z-10 flex flex-col items-center px-5 py-20 text-center">
          <Eyebrow tone="dark">Ready when you are</Eyebrow>
          <h2
            id="cta-title"
            className="ff-script mt-8 text-[clamp(42px,5.4vw,80px)] leading-[1.04] text-headline md:leading-[0.98]"
          >
            <span className="ff-geist">Ready for a </span>
            <span>Spotless </span>
            <span className="ff-geist">home?</span>
          </h2>
          <p className="ff-geist mt-6 max-w-[600px] text-[clamp(17px,1.4vw,22px)] leading-[1.5] text-headline/90">
            Tell us about your property and we will prepare a tailored quote —
            or speak with our team directly.
          </p>
          <div className="mt-10 flex w-full flex-col items-stretch gap-[16px] min-[420px]:w-auto min-[420px]:flex-row min-[420px]:items-center">
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
