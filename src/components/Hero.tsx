import { useEffect, useRef, useState } from "react"
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

// Inject all keyframes once
const glassKeyframes = `
  @keyframes floatA {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%      { transform: translateY(-10px) rotate(-0.4deg); }
    66%      { transform: translateY(-5px) rotate(0.3deg); }
  }
  @keyframes floatB {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%      { transform: translateY(-7px) rotate(0.35deg); }
    66%      { transform: translateY(-13px) rotate(-0.3deg); }
  }
  @keyframes shimmerSweep {
    0%   { transform: translateX(-130%) skewX(-15deg); opacity: 0; }
    20%  { opacity: 1; }
    100% { transform: translateX(230%) skewX(-15deg); opacity: 0; }
  }
  @keyframes sparkPop {
    0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
    55%  { transform: scale(1.3) rotate(10deg); opacity: 1; }
    100% { transform: scale(0) rotate(20deg); opacity: 0; }
  }
`
if (typeof document !== "undefined" && !document.getElementById("glass-review-keyframes")) {
  const s = document.createElement("style")
  s.id = "glass-review-keyframes"
  s.textContent = glassKeyframes
  document.head.appendChild(s)
}

// Sparkle dots that burst on hover-enter and fade out
function Sparkles({ active }: { active: boolean }) {
  if (!active) return null
  const dots = [
    { top: "10%",  left: "74%", delay: "0ms",   size: 5 },
    { top: "20%",  left: "92%", delay: "55ms",  size: 4 },
    { top: "72%",  left: "84%", delay: "110ms", size: 6 },
    { top: "78%",  left: "14%", delay: "35ms",  size: 4 },
    { top: "8%",   left: "28%", delay: "85ms",  size: 3 },
    { top: "50%",  left: "96%", delay: "140ms", size: 3 },
  ]
  return (
    <>
      {dots.map((d, i) => (
        <span
          key={i}
          aria-hidden
          style={{
            position: "absolute",
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: "rgba(72,209,204,0.95)",
            boxShadow: "0 0 8px 3px rgba(72,209,204,0.65)",
            animation: `sparkPop 0.55s ${d.delay} cubic-bezier(0.22,1,0.36,1) forwards`,
            pointerEvents: "none",
            zIndex: 30,
          }}
        />
      ))}
    </>
  )
}

function GlassReview({
  reviewIndex = 0,
  className,
  floatAnim = "floatA",
}: {
  reviewIndex?: number
  className: string
  floatAnim?: "floatA" | "floatB"
}) {
  const r = reviews[reviewIndex] ?? reviews[0]
  const cardRef = useRef<HTMLElement>(null)
  const [tilt, setTilt]       = useState({ x: 0, y: 0 })
  const [magnet, setMagnet]   = useState({ x: 0, y: 0 })
  const [spot, setSpot]       = useState({ x: 50, y: 50 })
  const [hovered, setHovered] = useState(false)
  const [shimmer, setShimmer] = useState(false)
  const [sparks, setSparks]   = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top  + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width  / 2)  // -1..1
    const dy = (e.clientY - cy) / (rect.height / 2)  // -1..1
    setTilt({ x: dy * 7, y: dx * -7 })               // 3-D tilt
    setMagnet({ x: dx * 11, y: dy * 11 })            // magnetic drift
    setSpot({
      x: ((e.clientX - rect.left) / rect.width)  * 100,
      y: ((e.clientY - rect.top)  / rect.height) * 100,
    })
  }

  const handleMouseEnter = () => {
    setHovered(true)
    // One-shot shimmer + sparkles
    setShimmer(true);  setTimeout(() => setShimmer(false), 580)
    setSparks(true);   setTimeout(() => setSparks(false), 600)
  }

  const handleMouseLeave = () => {
    setHovered(false)
    setTilt({ x: 0, y: 0 })
    setMagnet({ x: 0, y: 0 })
    setSpot({ x: 50, y: 50 })
  }

  const cardStyle: React.CSSProperties = {
    animation: `${floatAnim} ${floatAnim === "floatA" ? "5.4s" : "6.8s"} ease-in-out infinite`,
    animationPlayState: hovered ? "paused" : "running",
    transform: hovered
      ? `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translate(${magnet.x}px, ${magnet.y}px) scale(1.05)`
      : undefined,
    transition: hovered
      ? "transform 0.1s cubic-bezier(0.23,1,0.32,1)"
      : "transform 0.8s cubic-bezier(0.23,1,0.32,1)",
    willChange: "transform",
  }

  return (
    <figure
      ref={cardRef}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute z-10 hidden items-center gap-[16px] rounded-[32px] overflow-hidden
        bg-white/[0.12] bg-gradient-to-br from-white/[0.22] via-white/[0.10] to-white/[0.04]
        backdrop-blur-xl backdrop-saturate-150 border px-[20px] py-[12px]
        min-[1180px]:flex cursor-default select-none
        ${hovered
          ? "border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_28px_60px_rgba(0,0,0,0.5),0_0_44px_rgba(72,209,204,0.26)]"
          : "border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_12px_36px_rgba(0,0,0,0.28)]"
        } ${className}`}
    >
      {/* Aurora spotlight that follows cursor */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, borderRadius: "inherit",
          pointerEvents: "none",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s ease",
          background: `radial-gradient(circle 130px at ${spot.x}% ${spot.y}%, rgba(72,209,204,0.28) 0%, rgba(255,255,255,0.08) 55%, transparent 80%)`,
        }}
      />

      {/* One-shot shimmer sweep on enter */}
      {shimmer && (
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, borderRadius: "inherit",
            pointerEvents: "none",
            background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.24) 50%, transparent 70%)",
            animation: "shimmerSweep 0.55s ease forwards",
          }}
        />
      )}

      {/* Sparkle burst on enter */}
      <Sparkles active={sparks} />

      {/* Avatar */}
      <span
        className={`relative size-[42px] shrink-0 overflow-clip rounded-full bg-[#99a1af] shadow-md
          transition-all duration-500
          ${hovered
            ? "ring-[3px] ring-turquoise/75 scale-110 shadow-[0_0_16px_rgba(72,209,204,0.6)]"
            : "ring-2 ring-white/40"
          }`}
      >
        <img src={r.avatar} alt="" className="size-full object-cover" />
      </span>

      {/* Text content */}
      <div className="flex w-[310px] flex-col relative z-10">
        <div className="flex items-center justify-between">
          <Stars count={r.rating} size={14} />
          <span
            className={`ff-geist-medium text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border
              transition-all duration-300
              ${hovered
                ? "text-turquoise bg-turquoise/20 border-turquoise/50 scale-105"
                : "text-turquoise-glow bg-white/10 border-white/20"
              }`}
          >
            Verified Client
          </span>
        </div>
        <blockquote
          className={`ff-geist pt-[6px] text-[12px] leading-[17px] transition-colors duration-300
            ${hovered ? "text-white" : "text-white/90"}`}
        >
          "{r.quote}"
        </blockquote>
        <figcaption className="pt-[6px] flex items-center justify-between">
          <span className="ff-geist-bold text-[12px] leading-[16px] text-white">
            {r.name}
          </span>
          <span
            className={`ff-geist text-[12px] leading-[16px] transition-all duration-300
              ${hovered ? "text-turquoise translate-x-[3px]" : "text-turquoise-glow"}`}
          >
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
      className="fixed inset-0 z-[60] flex flex-col bg-ink p-5 sm:p-8 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-white"
    >
      <div className="flex items-center justify-between">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex size-[40px] sm:size-[44px] items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          autoFocus
        >
          <Close size={20} />
        </button>
      </div>
      <nav aria-label="Mobile" className="mt-8 sm:mt-12 flex-1 overflow-y-auto">
        <ul className="flex flex-col">
          {navLinks.map((l) => {
            const current = l.href === `#${active}`
            return (
              <li key={l.label} className="border-b border-white/10">
                <a
                  href={l.href}
                  onClick={onClose}
                  aria-current={current ? "true" : undefined}
                  className={`ff-geist flex items-center justify-between py-3.5 sm:py-4 text-[clamp(22px,5.5vw,32px)] leading-tight transition-colors ${
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
      <div className="flex flex-col gap-3 pt-4 sm:pt-6">
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
      <div className="relative flex h-[calc(100svh-16px)] max-h-[1100px] min-h-[560px] sm:min-h-[640px] flex-col overflow-clip rounded-[24px] sm:h-[calc(100svh-32px)] sm:rounded-[39px]">
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
          floatAnim="floatA"
          className="left-[2.5%] min-[1440px]:left-[4.5%] top-[18%] min-[1440px]:top-[20%]"
        />
        <GlassReview
          reviewIndex={1}
          floatAnim="floatB"
          className="right-[2.5%] min-[1440px]:right-[4.5%] bottom-[10%] min-[1440px]:bottom-[12%]"
        />

        <header className="relative z-20 flex w-full items-center justify-between px-4 py-3 sm:px-6 sm:py-5 lg:px-[clamp(20px,5vw,96.585px)] lg:py-[clamp(18px,2vw,38.634px)]">
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

          <div className="flex items-center gap-2 sm:gap-[clamp(10px,1vw,18.667px)]">
            <a
              href={PHONE_HREF}
              className="group flex items-center gap-[12.444px]"
              aria-label={`Call ${PHONE_DISPLAY}`}
            >
              <span className="flex size-[38px] sm:size-[clamp(40px,2.28vw,43.556px)] items-center justify-center rounded-full bg-turquoise transition-transform group-hover:scale-105">
                <img
                  src={assets.phoneIcon}
                  alt=""
                  width={21.7778}
                  height={21.7778}
                  className="block size-[18px] sm:size-[21.778px]"
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
              className="flex size-[38px] sm:size-[44px] items-center justify-center rounded-full bg-white/[0.14] backdrop-blur-xl border border-white/30 text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:bg-white/[0.25] hover:border-white/50 transition-all duration-200 lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-6 pb-8 sm:pb-12 text-center">
          <div className="flex flex-col items-center gap-[clamp(16px,1.7vw,32px)] capitalize text-headline">
            <h1 className="ff-script text-[clamp(32px,7.5vw,80px)] leading-[1.08] sm:leading-[1.02] md:whitespace-nowrap md:leading-[0.92]">
              <span className="ff-inter">A </span>
              <span>Spotless </span>
              <span className="ff-geist">Space, Every Time.</span>
            </h1>
            <p className="ff-geist max-w-[660px] text-[clamp(15px,3.8vw,24px)] leading-relaxed sm:leading-[normal] text-headline/90">
              Professional cleaning and specialised linen &amp; fabric care for
              homes, Airbnb properties and end-of-lease cleans.
            </p>
          </div>
          <div className="mt-[clamp(20px,2.4vw,40px)] flex w-full max-w-[340px] flex-col items-stretch gap-3 min-[440px]:w-auto min-[440px]:max-w-none min-[440px]:flex-row min-[440px]:items-center min-[440px]:gap-4">
            <Button as="button" type="button" onClick={onQuote} arrow>
              Get Quick Quote
            </Button>
            <Button
              href="#services"
              variant="secondary"
              className="h-[52.8px] w-full min-[440px]:w-[205px] flex-none gap-[16px] rounded-[65px] px-[24px] py-[12px]"
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
