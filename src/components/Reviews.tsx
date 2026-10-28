import { useState } from "react"
import { reviews } from "../data/content"
import { Eyebrow, Stars } from "./Button"
import { ChevronLeft, ChevronRight } from "./Icons"
import { container, sectionY } from "./layout"

export default function Reviews() {
  const [index, setIndex] = useState(0)
  const r = reviews[index]
  const multiple = reviews.length > 1
  const go = (d: number) =>
    setIndex((i) => (i + d + reviews.length) % reviews.length)

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className={`bg-white ${sectionY}`}
    >
      <div className={`${container} grid gap-8 lg:grid-cols-12 lg:gap-10`}>
        <div className="lg:col-span-3">
          <Eyebrow>Client words</Eyebrow>
          <h2
            id="reviews-title"
            className="ff-geist mt-4 sm:mt-6 text-[clamp(24px,2vw,32px)] leading-[1.2] text-ink"
          >
            In their own words.
          </h2>
          <p className="ff-geist mt-3 sm:mt-4 max-w-[300px] text-[15px] sm:text-[16px] leading-[1.6] text-muted">
            Feedback shared with us by Spotless clients across Melbourne.
          </p>
          {multiple && (
            <div className="hidden lg:flex mt-8 items-center gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous review"
                className="flex size-12 items-center justify-center rounded-full text-teal ring-1 ring-teal/20 transition-colors hover:bg-sand"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next review"
                className="flex size-12 items-center justify-center rounded-full text-teal ring-1 ring-teal/20 transition-colors hover:bg-sand"
              >
                <ChevronRight />
              </button>
              <span className="ff-geist ml-3 text-[14px] text-muted">
                {index + 1} / {reviews.length}
              </span>
            </div>
          )}
        </div>

        <figure
          className="border-t border-teal/15 pt-8 sm:pt-10 lg:col-span-8 lg:col-start-5 lg:pt-14"
          aria-live="polite"
        >
          <span
            aria-hidden
            className="ff-script block h-[0.55em] text-[clamp(64px,7vw,120px)] leading-[1] text-turquoise"
          >
            &ldquo;
          </span>
          <blockquote className="ff-geist mt-2 text-[clamp(20px,4.5vw,48px)] leading-[1.28] sm:leading-[1.22] tracking-[-0.015em] text-ink">
            {r.quote}
          </blockquote>
          <figcaption className="mt-8 sm:mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <span className="flex items-center gap-3.5 sm:gap-4">
              <span className="size-12 sm:size-14 shrink-0 overflow-clip rounded-full bg-[#99a1af]">
                <img src={r.avatar} alt="" className="size-full object-cover" />
              </span>
              <span>
                <span className="ff-geist-semibold block text-[16px] sm:text-[17px] text-ink">
                  {r.name}
                </span>
                <span className="ff-geist block text-[14px] sm:text-[15px] text-teal-text">
                  {r.location}
                </span>
              </span>
            </span>

            <div className="flex items-center gap-4">
              <Stars count={r.rating} size={18} />
              {multiple && (
                <div className="flex lg:hidden items-center gap-2 pl-3 border-l border-teal/15">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous review"
                    className="flex size-10 items-center justify-center rounded-full text-teal ring-1 ring-teal/20 transition-colors hover:bg-sand"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next review"
                    className="flex size-10 items-center justify-center rounded-full text-teal ring-1 ring-teal/20 transition-colors hover:bg-sand"
                  >
                    <ChevronRight />
                  </button>
                  <span className="ff-geist text-[12px] text-muted whitespace-nowrap">
                    {index + 1}/{reviews.length}
                  </span>
                </div>
              )}
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
