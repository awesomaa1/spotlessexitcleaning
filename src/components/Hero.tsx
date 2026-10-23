import { useEffect, useState } from "react"
import {
  PHONE_DISPLAY,
  PHONE_HREF,
  assets,
  navLinks,
  reviews,
} from "../data/content"
import Button, { Stars } from "./Button"
import { Close, Menu } from "./Icons"
import Logo from "./Logo"

function GlassReview({
  reviewIndex = 0,
  className,
}: {
  reviewIndex?: number
  className: string
}) {
  const r = reviews[reviewIndex] ?? reviews[0]
  return (
    <figure
      className={`group absolute z-10 hidden items-center gap-[16px] rounded-[32px] bg-white/[0.12] bg-gradient-to-br from-white/[0.22] via-white/[0.10] to-white/[0.04] backdrop-blur-xl backdrop-saturate-150 border border-white/30 px-[20px] py-[12px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_12px_36px_rgba(0,0,0,0.28)] transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-white/[0.2] hover:border-white/50 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.65),0_18px_44px_rgba(0,0,0,0.36)] min-[1180px]:flex ${className}`}
    >
      <span className="size-[42px] shrink-0 overflow-clip rounded-full bg-[#99a1af] ring-2 ring-white/40 shadow-md transition-transform duration-300 group-hover:scale-105">
        <img src={r.avatar} alt="" className="size-full object-cover" />
      </span>
      <div className="flex w-[310px] flex-col">
        <div className="flex items-center justify-between">
          <Stars count={r.rating} size={14} />
          <span className="ff-geist-medium text-[10px] tracking-wider uppercase text-turquoise-glow bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
            Verified Client
          </span>
        </div>
        <blockquote className="ff-geist pt-[6px] text-[12px] leading-[17px] text-white/95">
          "{r.quote}"
        </blockquote>
        <figcaption className="pt-[6px] flex items-center justify-between">
          <span className="ff-geist-bold text-[12px] leading-[16px] text-white">
            {r.name}
          </span>
          <span className="ff-geist text-[12px] leading-[16px] text-turquoise-glow">
            {r.location}
          </span>
        </figcaption>
      </div>
    </figure>
  )
}

export function MobileMenu({
  onClose,
  onQuote,
  active,
}: {
  onClose: () => void
  onQuote: () => void
  active: string
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] flex flex-col bg-ink p-5 text-white"
    >
      <div className="flex items-center justify-between">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex size-[44px] items-center justify-center rounded-full bg-white/10"
          autoFocus
        >
          <Close size={22} />
        </button>
      </div>
      <nav aria-label="Mobile" className="mt-12 flex-1 overflow-y-auto">
        <ul className="flex flex-col">
          {navLinks.map((l) => {
            const current = l.href === `#${active}`
            return (
              <li key={l.label} className="border-b border-white/10">
                <a
                  href={l.href}
                  onClick={onClose}
                  aria-current={current ? "true" : undefined}
                  className={`ff-geist flex items-center justify-between py-4 text-[28px] leading-tight transition-colors ${
                    current ? "text-turquoise-glow" : "text-white"
                  }`}
                >
                  {l.label}
                  {current && (
                    <span
                      aria-hidden
                      className="size-2 rounded-full bg-turquoise"
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="flex flex-col gap-3 pt-6">
        <Button
          as="button"
          type="button"
          arrow
          onClick={() => {
            onClose()
            onQuote()
          }}
        >
          Get a Quick Quote
        </Button>
        <Button href={PHONE_HREF} variant="secondary">
          Call {PHONE_DISPLAY}
        </Button>
      </div>
    </div>
  )
}

export default function Hero({
  onQuote,
  active,
}: {
  onQuote: () => void
  active: string
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="bg-white p-2 sm:p-[16px]"
    >
      <div className="relative flex h-[calc(100svh-16px)] max-h-[1100px] min-h-[640px] flex-col overflow-clip rounded-[28px] sm:h-[calc(100svh-32px)] sm:rounded-[39px]">
        {/* Background: photo with 47% black scrim, as in the hero frame */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[#841b1b]" />
          <img
            src={assets.heroPhoto}
            alt=""
            className="absolute inset-0 size-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/[0.47]" />
        </div>

        <GlassReview
          reviewIndex={0}
          className="left-[2.5%] min-[1440px]:left-[4.5%] top-[18%] min-[1440px]:top-[20%]"
        />
        <GlassReview
          reviewIndex={1}
          className="right-[2.5%] min-[1440px]:right-[4.5%] bottom-[10%] min-[1440px]:bottom-[12%]"
        />

        <header className="relative z-20 flex w-full items-center justify-between px-[clamp(20px,5vw,96.585px)] py-[clamp(18px,2vw,38.634px)]">
          <Logo />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="ff-lato flex items-start gap-[clamp(24px,2.6vw,56px)] text-[clamp(17px,1.35vw,25.756px)] capitalize leading-[normal]">
              {navLinks.map((l) => {
                const current = l.href === `#${active}`
                return (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      aria-current={current ? "true" : undefined}
                      className={`transition-colors hover:text-white ${
                        current ? "text-white" : "text-nav-muted"
                      }`}
                    >
                      {l.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-[clamp(10px,1vw,18.667px)]">
            <a
              href={PHONE_HREF}
              className="group flex items-center gap-[12.444px]"
              aria-label={`Call ${PHONE_DISPLAY}`}
            >
              <span className="flex size-[clamp(40px,2.28vw,43.556px)] items-center justify-center rounded-full bg-turquoise transition-transform group-hover:scale-105">
                <img
                  src={assets.phoneIcon}
                  alt=""
                  width={21.7778}
                  height={21.7778}
                  className="block size-[21.778px]"
                />
              </span>
              <span className="ff-geist-semibold hidden whitespace-nowrap text-[clamp(16px,1.14vw,21.778px)] leading-[31.111px] text-white xl:inline">
                {PHONE_DISPLAY}
              </span>
            </a>
            <button
              type="button"
              onClick={onQuote}
              className="ff-geist-semibold hidden rounded-full bg-turquoise px-[clamp(18px,1.3vw,24.889px)] py-[clamp(6px,0.65vw,12.444px)] text-center text-[clamp(16px,1.14vw,21.778px)] leading-[31.111px] whitespace-nowrap text-teal transition-colors hover:bg-turquoise-bright sm:block"
            >
              Book Now
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="flex size-[44px] items-center justify-center rounded-full bg-white/[0.14] backdrop-blur-xl border border-white/30 text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:bg-white/[0.25] hover:border-white/50 transition-all duration-200 lg:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-10 text-center">
          <div className="flex flex-col items-center gap-[clamp(20px,1.7vw,32px)] capitalize text-headline">
            <h1 className="ff-script text-[clamp(44px,6vw,80px)] leading-[1.02] md:whitespace-nowrap md:leading-[0.92]">
              <span className="ff-inter">A </span>
              <span>Spotless </span>
              <span className="ff-geist">Space, Every Time.</span>
            </h1>
            <p className="ff-geist max-w-[680px] text-[clamp(17px,1.4vw,24px)] leading-[normal]">
              Professional cleaning and specialised linen &amp; fabric care for
              homes, Airbnb properties and end-of-lease cleans.
            </p>
          </div>
          <div className="mt-[clamp(24px,2.4vw,40px)] flex flex-col items-stretch gap-[16px] min-[420px]:flex-row min-[420px]:items-center">
            <Button as="button" type="button" onClick={onQuote} arrow>
              Get Quick Quote
            </Button>
            <Button
              href="#services"
              variant="secondary"
              className="h-[52.8px] flex-none gap-[16px] rounded-[65px] px-[24px] py-[12px] min-[420px]:w-[205px]"
            >
              Explore Services
            </Button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <MobileMenu
          onClose={() => setMenuOpen(false)}
          onQuote={onQuote}
          active={active}
        />
      )}
    </section>
  )
}
