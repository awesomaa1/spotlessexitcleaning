import { useCallback, useEffect, useState } from "react"
import { PHONE_DISPLAY, PHONE_HREF, assets, navLinks } from "../data/content"
import { MobileMenu } from "./Hero"
import { Menu } from "./Icons"
import Logo from "./Logo"

/** Compact header that appears once the hero has scrolled away. */
export default function StickyNav({
  onQuote,
  active,
}: {
  onQuote: () => void
  active: string
}) {
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    const hero = document.getElementById("top")
    if (!hero) return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-120px 0px 0px 0px" },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <div
        aria-hidden={!visible}
        inert={!visible}
        className={`fixed inset-x-0 top-3 z-50 flex justify-center px-3 transition-all duration-300 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <div className="flex w-full max-w-[1120px] items-center justify-between gap-2 rounded-full bg-ink/90 py-1.5 pl-3 pr-1.5 shadow-[0_12px_40px_-12px_rgba(13,42,49,0.45)] backdrop-blur-xl border border-white/10 sm:gap-4 sm:py-2 sm:pl-5 sm:pr-2">
          <Logo size="compact" />
          <nav aria-label="Sticky" className="hidden lg:block">
            <ul className="ff-lato flex gap-7 text-[16px]">
              {/* The logo returns to the top, so Home is omitted here. */}
              {navLinks.slice(1).map((l) => {
                const current = l.href === `#${active}`
                return (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      aria-current={current ? "true" : undefined}
                      className={`relative block py-1 transition-colors hover:text-white ${
                        current ? "text-white" : "text-nav-muted"
                      }`}
                    >
                      {l.label}
                      <span
                        aria-hidden
                        className={`absolute -bottom-1 left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-turquoise transition-opacity ${
                          current ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href={PHONE_HREF}
              aria-label={`Call ${PHONE_DISPLAY}`}
              className="flex size-[36px] sm:size-[40px] shrink-0 items-center justify-center rounded-full bg-turquoise transition-transform hover:scale-105"
            >
              <img
                src={assets.phoneIcon}
                alt=""
                width={21.7778}
                height={21.7778}
                className="block size-[16px] sm:size-[18px]"
              />
            </a>
            <button
              type="button"
              onClick={onQuote}
              className="ff-geist-semibold shrink-0 rounded-full bg-turquoise-bright px-3.5 py-1.5 sm:px-5 sm:py-2 text-[13px] sm:text-[15px] leading-[20px] sm:leading-[24px] whitespace-nowrap text-teal transition-colors hover:bg-[#8af3ec]"
            >
              <span className="min-[380px]:hidden">Quote</span>
              <span className="hidden min-[380px]:inline sm:hidden">Get a Quote</span>
              <span className="hidden sm:inline">Get a Quick Quote</span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex size-[36px] sm:size-[40px] shrink-0 items-center justify-center rounded-full bg-white/[0.14] backdrop-blur-xl border border-white/25 text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)] hover:bg-white/[0.25] hover:border-white/40 transition-all lg:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <MobileMenu onClose={closeMenu} onQuote={onQuote} active={active} />
      )}
    </>
  )
}
