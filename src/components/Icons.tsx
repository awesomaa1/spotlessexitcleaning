import type { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    "aria-hidden": true,
    ...props,
  }
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.167 10h11.666M11.667 5.833 15.833 10l-4.166 4.167" />
    </svg>
  )
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 14 14 6M7.5 6H14v6.5" />
    </svg>
  )
}

export function Check(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m4.5 10.5 3.5 3.5 7.5-8" />
    </svg>
  )
}

export function Menu(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 6.5h14M3 13.5h14" />
    </svg>
  )
}

export function Close(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 5 10 10M15 5 5 15" />
    </svg>
  )
}

export function ChevronLeft(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5 7 10l5 5" />
    </svg>
  )
}

export function ChevronRight(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m8 5 5 5-5 5" />
    </svg>
  )
}

export function Pin(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10 17.5s5.5-5 5.5-9.25a5.5 5.5 0 1 0-11 0C4.5 12.5 10 17.5 10 17.5Z" />
      <circle cx="10" cy="8.25" r="2" />
    </svg>
  )
}
