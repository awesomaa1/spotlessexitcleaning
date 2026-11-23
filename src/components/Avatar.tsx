import { useState } from "react"

export default function Avatar({
  src,
  name,
  className = "size-10",
  textClassName = "text-[14px]",
}: {
  src?: string
  name: string
  className?: string
  textClassName?: string
}) {
  const [imgError, setImgError] = useState(false)
  const isImage = Boolean(
    src &&
      (src.startsWith("/") ||
        src.startsWith("http") ||
        src.startsWith("data:")) &&
      !imgError,
  )

  const initials = name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  // Elegant deterministic gradients matching the brand
  const gradients = [
    "bg-gradient-to-br from-teal to-[#0d2f38] text-turquoise-bright border border-white/20",
    "bg-gradient-to-br from-[#1b505c] to-[#0e313a] text-white border border-turquoise/30",
    "bg-gradient-to-br from-[#123f4a] to-[#206775] text-turquoise-glow border border-white/30",
    "bg-gradient-to-br from-[#133d47] to-[#1d606e] text-white border border-white/20",
  ]
  const colorIndex =
    ((name.charCodeAt(0) || 0) + (name.charCodeAt(1) || 0)) % gradients.length
  const gradientClass = gradients[colorIndex]

  if (isImage && src) {
    return (
      <span
        className={`relative inline-block shrink-0 overflow-clip rounded-full bg-[#99a1af] ${className}`}
      >
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className="size-full object-cover"
        />
      </span>
    )
  }

  return (
    <span
      className={`ff-geist-bold relative inline-flex shrink-0 items-center justify-center rounded-full select-none shadow-xs ${gradientClass} ${className}`}
      aria-label={name}
    >
      <span className={`${textClassName} leading-none tracking-wider`}>
        {initials || name.slice(0, 2).toUpperCase()}
      </span>
    </span>
  )
}
