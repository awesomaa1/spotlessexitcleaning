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
      <div className={`${container} grid gap-10 lg:grid-cols-12`}>
        <div className="lg:col-span-3">
          <Eyebrow>Client words</Eyebrow>
          <h2
            id="reviews-title"
            className="ff-geist mt-6 text-[clamp(26px,2vw,32px)] leading-[1.2] text-ink"
          >
            In their own words.
          </h2>
          <p className="ff-geist mt-4 max-w-[300px] text-[16px] leading-[1.6] text-muted">
            Feedback shared with us by Spotless clients across Melbourne.
          </p>
          {multiple && (
            <div className="mt-8 flex items-center gap-2">
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
          className="border-t border-teal/15 pt-10 lg:col-span-8 lg:col-start-5 lg:pt-14"
          aria-live="polite"
        >
          <span
            aria-hidden
            className="ff-script block h-[0.6em] text-[clamp(80px,7vw,120px)] leading-[1] text-turquoise"
          >
            &ldquo;
          </span>
          <blockquote className="ff-geist mt-2 text-[clamp(26px,2.9vw,50px)] leading-[1.22] tracking-[-0.015em] text-ink">
            {r.quote}
          </blockquote>
          <figcaption className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <span className="flex items-center gap-4">
              <span className="size-14 overflow-clip rounded-full bg-[#99a1af]">
                <img src={r.avatar} alt="" className="size-full object-cover" />
              </span>
              <span>
                <span className="ff-geist-semibold block text-[17px] text-ink">
                  {r.name}
                </span>
                <span className="ff-geist block text-[15px] text-teal-text">
                  {r.location}
                </span>
              </span>
            </span>
            <span
              aria-hidden
              className="hidden h-10 w-px bg-teal/15 sm:block"
            />
            <Stars count={r.rating} size={20} />
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
