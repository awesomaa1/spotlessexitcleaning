import {
  PHONE_DISPLAY,
  PHONE_HREF,
  navLinks,
  services,
  type ServiceId,
} from "../data/content"
import { Pin } from "./Icons"
import Logo from "./Logo"
import { panel, panelInner, panelWrap } from "./layout"

const heading =
  "ff-geist-semibold text-[12px] uppercase tracking-[0.16em] text-turquoise-glow"
const link =
  "ff-geist text-[15px] text-white/75 transition-colors hover:text-white"

export default function Footer({
  onQuote,
}: {
  onQuote: (id?: ServiceId) => void
}) {
  return (
    <footer className={`${panelWrap} pb-2 sm:pb-[16px]`}>
      <div className={`${panel} bg-ink text-white`}>
        <div className={`${panelInner} pb-8 pt-[clamp(48px,5vw,80px)]`}>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
            <div className="sm:col-span-2 lg:col-span-4">
              <Logo />
              <p className="ff-geist mt-6 max-w-[340px] text-[15px] leading-[1.6] text-white/70">
                Premium home, Airbnb, linen &amp; fabric and end-of-lease
                cleaning for Melbourne properties.
              </p>
              <button
                type="button"
                onClick={() => onQuote()}
                className="ff-geist-semibold mt-6 rounded-full bg-turquoise px-6 py-2.5 text-[16px] text-teal transition-colors hover:bg-turquoise-bright"
              >
                Book Now
              </button>
            </div>

            <nav aria-label="Services" className="lg:col-span-3 lg:col-start-6">
              <h2 className={heading}>Services</h2>
              <ul className="mt-5 space-y-3">
                {services.map((s) => (
                  <li key={s.id}>
                    <a
                      href="#quote"
                      onClick={(e) => {
                        e.preventDefault()
                        onQuote(s.id)
                      }}
                      className={link}
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Footer" className="lg:col-span-2">
              <h2 className={heading}>Navigate</h2>
              <ul className="mt-5 space-y-3">
                {navLinks.map((n) => (
                  <li key={n.label}>
                    <a href={n.href} className={link}>
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-3">
              <h2 className={heading}>Contact</h2>
              <ul className="mt-5 space-y-4">
                <li>
                  <a
                    href={PHONE_HREF}
                    className="ff-geist-semibold text-[20px] text-white transition-colors hover:text-turquoise-bright"
                  >
                    {PHONE_DISPLAY}
                  </a>
                </li>
                <li className="ff-geist flex items-center gap-2 text-[15px] text-white/75">
                  <Pin size={18} className="text-turquoise" />
                  Melbourne, Victoria
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="ff-geist text-[13px] text-white/55">
              © {new Date().getFullYear()} Spotless Cleaning. All rights
              reserved.
            </p>
            <ul className="flex gap-6">
              <li>
                <a
                  href="/privacy"
                  className="ff-geist text-[13px] text-white/55 hover:text-white"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="ff-geist text-[13px] text-white/55 hover:text-white"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
