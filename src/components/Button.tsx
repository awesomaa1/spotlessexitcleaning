import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { assets } from "../data/content"
import { ArrowRight } from "./Icons"

type Variant = "primary" | "secondary" | "glass" | "ink" | "outline"

const variants: Record<Variant, string> = {
  // Hero "Get Quick Quote": bright turquoise with deep teal type
  primary:
    "bg-turquoise-bright text-teal shadow-[0_4px_20px_rgba(113,238,230,0.35)] hover:bg-[#8af3ec] hover:shadow-[0_6px_28px_rgba(113,238,230,0.5)] hover:-translate-y-0.5 active:translate-y-0",
  // Glassmorphism secondary button on photography / dark panels (Hero, Final CTA, Mobile Menu)
  secondary:
    "bg-white/[0.12] bg-gradient-to-b from-white/[0.22] to-white/[0.06] backdrop-blur-xl backdrop-saturate-150 border border-white/30 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_8px_24px_rgba(0,0,0,0.22)] hover:bg-white/[0.22] hover:border-white/50 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_12px_32px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:translate-y-0",
  glass:
    "bg-white/[0.12] bg-gradient-to-b from-white/[0.22] to-white/[0.06] backdrop-blur-xl backdrop-saturate-150 border border-white/30 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_8px_24px_rgba(0,0,0,0.22)] hover:bg-white/[0.22] hover:border-white/50 hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_12px_32px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 active:translate-y-0",
  // Light-surface counterpart of the primary action
  ink: "bg-teal text-white shadow-[0_4px_18px_rgba(18,63,74,0.25)] hover:bg-ink hover:shadow-[0_6px_24px_rgba(18,63,74,0.35)] hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "bg-white/60 backdrop-blur-md text-teal border border-teal/20 shadow-[0_2px_8px_rgba(18,63,74,0.06)] hover:border-teal/40 hover:bg-white/90 hover:-translate-y-0.5 active:translate-y-0",
}

type Common = {
  variant?: Variant
  arrow?: boolean
  children: ReactNode
  className?: string
}

type AnchorProps = Common & {
  as?: "a"
} & Omit<ComponentPropsWithoutRef<"a">, keyof Common>
type NativeButtonProps = Common & {
  as: "button"
} & Omit<ComponentPropsWithoutRef<"button">, keyof Common>

export default function Button(props: AnchorProps | NativeButtonProps) {
  const { variant = "primary", arrow = false, children, className = "" } = props
  const classes = `ff-geist-bold inline-flex min-h-[52.8px] items-center justify-center gap-[8.8px] rounded-[999px] px-[24px] py-[13.6px] text-center text-[15px] leading-[18.72px] uppercase whitespace-nowrap transition-all duration-200 sm:text-[16px] disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`

  const arrowEl = arrow ? (
    variant === "primary" ? (
      <img
        src={assets.arrowIcon}
        alt=""
        width={20}
        height={20}
        className="block size-[20px] shrink-0"
      />
    ) : (
      <ArrowRight className="shrink-0" />
    )
  ) : null

  if (props.as === "button") {
    const {
      as: _as,
      variant: _v,
      arrow: _a,
      children: _c,
      className: _cn,
      ...rest
    } = props
    return (
      <button className={classes} {...rest}>
        {children}
        {arrowEl}
      </button>
    )
  }
  const {
    as: _as,
    variant: _v,
    arrow: _a,
    children: _c,
    className: _cn,
    ...rest
  } = props
  return (
    <a className={classes} {...rest}>
      {children}
      {arrowEl}
    </a>
  )
}

export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode
  tone?: "light" | "dark"
}) {
  return (
    <p
      className={`ff-geist-semibold flex items-center gap-3 text-[13px] uppercase tracking-[0.16em] ${
        tone === "light" ? "text-teal-text" : "text-turquoise-glow"
      }`}
    >
      <span
        aria-hidden
        className={`h-px w-8 ${
          tone === "light" ? "bg-teal-text/50" : "bg-turquoise-glow/60"
        }`}
      />
      {children}
    </p>
  )
}

export function Stars({
  count = 5,
  size = 16,
}: {
  count?: number
  size?: number
}) {
  return (
    <span
      className="flex gap-[2px]"
      role="img"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <img
          key={i}
          src={assets.star}
          alt=""
          width={16}
          height={16}
          style={{ width: size, height: size }}
          className="block"
        />
      ))}
    </span>
  )
}
