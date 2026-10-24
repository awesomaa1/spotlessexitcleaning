import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import {
  PHONE_DISPLAY,
  PHONE_HREF,
  services,
  type ServiceId,
} from "../data/content"
import Button, { Eyebrow } from "./Button"
import { Check } from "./Icons"
import { panel, panelInner, panelWrap, sectionY } from "./layout"

/* ─────────────────────────────────────────────────────────────────────────────
   PRICING ENGINE  (all prices AUD, sourced from Spotless price list)
───────────────────────────────────────────────────────────────────────────── */

type PriceRange = { min: number; max: number }

/** Airbnb / turnover pricing by bedroom count */
const airbnbPrices: Record<string, PriceRange> = {
  Studio: { min: 75, max: 95 },
  "1": { min: 90, max: 120 },
  "2": { min: 120, max: 160 },
  "3": { min: 160, max: 210 },
  "4": { min: 200, max: 270 },
  "5+": { min: 240, max: 320 },
}

/** End-of-lease pricing by beds+baths key */
const leasePrices: Record<string, PriceRange> = {
  "Studio_1": { min: 190, max: 240 },
  "1_1": { min: 240, max: 310 },
  "2_1": { min: 290, max: 360 },
  "2_2": { min: 330, max: 420 },
  "3_1": { min: 360, max: 460 },
  "3_2": { min: 420, max: 520 },
  "3_3": { min: 460, max: 580 },
  "4_1": { min: 480, max: 620 },
  "4_2": { min: 520, max: 680 },
  "4_3": { min: 570, max: 730 },
  "5+_1": { min: 520, max: 720 },
  "5+_2": { min: 580, max: 780 },
  "5+_3": { min: 640, max: 860 },
  "5+_4+": { min: 700, max: 950 },
}

/** Regular house cleaning by bedroom count */
const housePrices: Record<string, PriceRange> = {
  Studio: { min: 65, max: 85 },
  "1": { min: 75, max: 95 },
  "2": { min: 95, max: 135 },
  "3": { min: 130, max: 180 },
  "4": { min: 170, max: 230 },
  "5+": { min: 200, max: 270 },
}

/** Lease-clean add-ons: extra cost each */
const leaseAddonPrices: Record<string, number> = {
  "Carpet steam clean": 80,
  "Oven deep clean": 55,
  "Window tracks & screens": 40,
  "Wall spot cleaning": 35,
}

/** Linen-service prices per item type */
const linenItemPrices: Record<string, number> = {
  "Bed linen": 12,
  "Towels": 8,
  "Table linen": 10,
  "Curtains": 20,
  "Cushion & sofa covers": 15,
}

const frequencyDiscount: Record<string, number> = {
  "One-off": 0,
  "Monthly": 0,
  "Fortnightly": 0.05,
  "Weekly": 0.10,
}

function computeEstimate(
  service: ServiceId | null,
  f: FormState,
): PriceRange | null {
  if (!service) return null

  if (service === "house") {
    const base = housePrices[f.bedrooms] ?? null
    if (!base) return null
    const disc = frequencyDiscount[f.frequency] ?? 0
    return {
      min: Math.round(base.min * (1 - disc)),
      max: Math.round(base.max * (1 - disc)),
    }
  }

  if (service === "airbnb") {
    return airbnbPrices[f.bedrooms] ?? null
  }

  if (service === "lease") {
    const beds = f.bedrooms
    const baths = f.bathrooms
    const key = `${beds}_${baths}`
    const base = leasePrices[key] ?? leasePrices[`${beds}_1`] ?? null
    if (!base) return null
    const addonTotal = f.leaseExtras.reduce(
      (acc, extra) => acc + (leaseAddonPrices[extra] ?? 0),
      0,
    )
    return {
      min: base.min + addonTotal,
      max: base.max + addonTotal,
    }
  }

  if (service === "linen") {
    if (f.linenItems.length === 0) return null
    const total = f.linenItems.reduce(
      (acc, item) => acc + (linenItemPrices[item] ?? 10),
      0,
    )
    const volumeMultiplier: Record<string, number> = {
      "A single load": 1,
      "A few loads": 2.5,
      "Ongoing service": 4,
    }
    const mult = volumeMultiplier[f.linenVolume] ?? 1
    const base = Math.round(total * mult)
    return { min: Math.round(base * 0.9), max: Math.round(base * 1.15) }
  }

  return null
}

/* ─────────────────────────────────────────────────────────────────────────────
   FORM STATE
───────────────────────────────────────────────────────────────────────────── */

type FormState = {
  frequency: string
  listings: string
  turnovers: string
  linenSupply: boolean
  linenItems: string[]
  linenVolume: string
  linenCollection: string
  moveOutDate: string
  leaseExtras: string[]
  propertyType: string
  bedrooms: string
  bathrooms: string
  suburb: string
  name: string
  address: string
  email: string
  phone: string
  contactMethod: string
  notes: string
  preferredDate: string
}

const initial: FormState = {
  frequency: "Fortnightly",
  listings: "1",
  turnovers: "Weekly",
  linenSupply: false,
  linenItems: [],
  linenVolume: "A few loads",
  linenCollection: "Pick-up & delivery",
  moveOutDate: "",
  leaseExtras: [],
  propertyType: "House",
  bedrooms: "2",
  bathrooms: "1",
  suburb: "",
  name: "",
  address: "",
  email: "",
  phone: "",
  contactMethod: "Phone",
  notes: "",
  preferredDate: "",
}

type Errors = Partial<Record<"service" | "suburb" | "name" | "address" | "email" | "phone" | "linenItems", string>>

/* ─────────────────────────────────────────────────────────────────────────────
   FIELD PRIMITIVES
───────────────────────────────────────────────────────────────────────────── */

const inputBase =
  "ff-geist block w-full min-h-[52px] rounded-[14px] border border-teal/15 bg-white px-4 text-[16px] text-ink placeholder:text-muted/60 transition-colors hover:border-teal/30 focus:border-turquoise focus:outline-none focus:ring-4 focus:ring-turquoise/20 aria-[invalid=true]:border-[#c2410c]"

function Field({
  label,
  hint,
  error,
  required,
  children,
  htmlFor,
  className = "",
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
  htmlFor: string
  className?: string
}) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className="ff-geist-medium mb-2 flex items-baseline justify-between gap-3 text-[14px] text-ink"
      >
        <span>
          {label}
          {required && <span className="text-teal-text"> *</span>}
        </span>
        {hint && (
          <span className="ff-geist text-[13px] text-muted">{hint}</span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${htmlFor}-error`}
          className="ff-geist mt-2 text-[13px] text-[#b4400b]"
        >
          {error}
        </p>
      )}
    </div>
  )
}

function Segmented({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string
  name: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <fieldset>
      <legend className="ff-geist-medium mb-2 text-[14px] text-ink">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="relative cursor-pointer">
            <input
              type="radio"
              name={name}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
              className="peer sr-only"
            />
            <span className="ff-geist-medium flex min-h-[44px] items-center rounded-full border border-teal/15 px-4 text-[15px] text-ink transition-colors hover:border-teal/35 peer-checked:border-teal peer-checked:bg-teal peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-turquoise/30">
              {o}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function CheckChips({
  legend,
  options,
  values,
  onToggle,
  error,
  id,
}: {
  legend: string
  options: string[]
  values: string[]
  onToggle: (v: string) => void
  error?: string
  id: string
}) {
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="ff-geist-medium mb-2 text-[14px] text-ink">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = values.includes(o)
          return (
            <label key={o} className="relative cursor-pointer">
              <input
                type="checkbox"
                checked={on}
                onChange={() => onToggle(o)}
                className="peer sr-only"
              />
              <span className="ff-geist-medium flex min-h-[44px] items-center gap-2 rounded-full border border-teal/15 px-4 text-[15px] text-ink transition-colors hover:border-teal/35 peer-checked:border-turquoise peer-checked:bg-turquoise/15 peer-focus-visible:ring-4 peer-focus-visible:ring-turquoise/30">
                <span
                  aria-hidden
                  className={`flex size-[18px] items-center justify-center rounded-[6px] border ${
                    on ? "border-teal bg-teal text-white" : "border-teal/25"
                  }`}
                >
                  {on && <Check size={14} />}
                </span>
                {o}
              </span>
            </label>
          )
        })}
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="ff-geist mt-2 text-[13px] text-[#b4400b]"
        >
          {error}
        </p>
      )}
    </fieldset>
  )
}

function Select({
  id,
  value,
  onChange,
  options,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} appearance-none pr-10`}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <svg
        aria-hidden
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-teal"
      >
        <path d="m5 7.5 5 5 5-5" />
      </svg>
    </div>
  )
}

function GroupHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="ff-geist-medium flex size-9 shrink-0 items-center justify-center rounded-full bg-sand text-[14px] text-teal">
        {index}
      </span>
      <h3 className="ff-geist-medium text-[20px] leading-tight text-ink">
        {title}
      </h3>
      <span aria-hidden className="h-px flex-1 bg-teal/10" />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   ESTIMATE PANEL
───────────────────────────────────────────────────────────────────────────── */

function EstimatePanel({
  estimate,
  service,
  frequency,
}: {
  estimate: PriceRange | null
  service: ServiceId | null
  frequency: string
}) {
  if (!service) return null

  const hasEstimate = estimate !== null
  const discountLabel: Record<string, string> = {
    Weekly: "10% weekly discount applied",
    Fortnightly: "5% fortnightly discount applied",
  }
  const showDiscount = service === "house" && discountLabel[frequency]

  return (
    <div
      className="mt-6 overflow-hidden rounded-[20px] border border-turquoise/20 bg-gradient-to-br from-teal/[0.06] to-turquoise/[0.04] p-5 transition-all duration-300 sm:p-6"
      role="region"
      aria-label="Price estimate"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="ff-geist-medium text-[13px] uppercase tracking-wider text-teal/70">
            Estimated price
          </p>
          {hasEstimate ? (
            <p className="ff-geist mt-1 text-[clamp(28px,3vw,36px)] font-bold leading-none text-teal">
              ${estimate!.min}
              <span className="text-[0.65em] text-teal/60"> – ${estimate!.max}</span>
              <span className="ff-geist ml-2 text-[14px] font-normal text-muted">
                AUD
              </span>
            </p>
          ) : (
            <p className="ff-geist mt-1 text-[18px] italic text-muted">
              Fill in details above to see your estimate
            </p>
          )}
          {showDiscount && hasEstimate && (
            <p className="ff-geist mt-2 flex items-center gap-1.5 text-[13px] text-teal">
              <span className="flex size-4 items-center justify-center rounded-full bg-teal text-white">
                <Check size={10} />
              </span>
              {discountLabel[frequency]}
            </p>
          )}
        </div>
        <div className="shrink-0 rounded-[12px] bg-turquoise-bright/10 p-2.5">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="text-teal"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4m0 4h.01" />
          </svg>
        </div>
      </div>

      <p className="ff-geist mt-4 text-[12px] leading-[1.5] text-muted">
        * Prices are estimates only and may vary depending on property size,
        condition, and additional requirements. A final quote will be confirmed
        after review.
      </p>

      {hasEstimate && (
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-teal/10 pt-4 text-center">
          {[
            { icon: "✓", label: "No obligation" },
            { icon: "⟳", label: "Free revision" },
            { icon: "★", label: "Satisfaction guarantee" },
          ].map(({ icon, label }) => (
            <div key={label} className="rounded-[10px] bg-white/60 px-1 py-2">
              <span className="block text-[16px]">{icon}</span>
              <span className="ff-geist mt-0.5 block text-[11px] leading-tight text-muted">
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   BOOKING STEP
───────────────────────────────────────────────────────────────────────────── */

function BookingStep({
  f,
  set,
  errors,
  fid,
  estimate,
  service,
  status,
  onBack,
}: {
  f: FormState
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void
  errors: Errors
  fid: (n: string) => string
  estimate: PriceRange | null
  service: ServiceId | null
  status: "idle" | "sending" | "sent"
  onBack: () => void
}) {
  const selected = services.find((s) => s.id === service)
  return (
    <div className="space-y-8">
      {/* Estimate summary card */}
      {estimate && (
        <div className="rounded-[20px] bg-teal p-5 text-white sm:p-6">
          <p className="ff-geist text-[13px] text-white/65">Your quote for</p>
          <p className="ff-geist-semibold mt-0.5 text-[18px]">
            {selected?.name}
          </p>
          <div className="mt-4">
            <p className="ff-geist text-[12px] uppercase tracking-wider text-white/60">
              Estimated price
            </p>
            <p className="ff-geist-semibold mt-1 text-[32px] leading-none text-turquoise-bright">
              ${estimate.min}
              <span className="text-[0.6em] text-white/50">
                {" "}– ${estimate.max}
              </span>
              <span className="ff-geist ml-2 text-[14px] font-normal text-white/50">
                AUD
              </span>
            </p>
            <p className="ff-geist mt-1 text-[12px] text-white/50">
              Prices may vary by property condition
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["No hidden fees", "Free cancellation (24hrs)", "Insured cleaners"].map(
              (t) => (
                <span
                  key={t}
                  className="ff-geist flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[12px] text-white/80"
                >
                  <Check size={11} />
                  {t}
                </span>
              ),
            )}
          </div>
        </div>
      )}

      <GroupHeading index="04" title="Book your clean" />

      <div className="space-y-6">
        <div data-field="name">
          <Field label="Full name" required error={errors.name} htmlFor={fid("name")}>
            <input
              id={fid("name")}
              value={f.name}
              onChange={(e) => set("name", e.target.value)}
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? `${fid("name")}-error` : undefined}
              className={inputBase}
            />
          </Field>
        </div>

        <div data-field="address">
          <Field
            label="Full property address"
            required
            error={errors.address}
            htmlFor={fid("address")}
          >
            <input
              id={fid("address")}
              value={f.address}
              onChange={(e) => set("address", e.target.value)}
              autoComplete="street-address"
              placeholder="e.g. 12 Collins St, Melbourne VIC 3000"
              aria-invalid={!!errors.address}
              aria-describedby={errors.address ? `${fid("address")}-error` : undefined}
              className={inputBase}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div data-field="email">
            <Field label="Email" required error={errors.email} htmlFor={fid("email")}>
              <input
                id={fid("email")}
                type="email"
                value={f.email}
                onChange={(e) => set("email", e.target.value)}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${fid("email")}-error` : undefined}
                className={inputBase}
              />
            </Field>
          </div>
          <div data-field="phone">
            <Field label="Phone" required error={errors.phone} htmlFor={fid("phone")}>
              <input
                id={fid("phone")}
                type="tel"
                value={f.phone}
                onChange={(e) => set("phone", e.target.value)}
                autoComplete="tel"
                placeholder="04xx xxx xxx"
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? `${fid("phone")}-error` : undefined}
                className={inputBase}
              />
            </Field>
          </div>
        </div>

        <Field
          label="Preferred date"
          hint="Optional – we'll confirm availability"
          htmlFor={fid("preferredDate")}
          className="sm:max-w-[320px]"
        >
          <input
            id={fid("preferredDate")}
            type="date"
            value={f.preferredDate}
            onChange={(e) => set("preferredDate", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className={inputBase}
          />
        </Field>

        <div className="sm:col-span-2">
          <Segmented
            legend="Preferred contact method"
            name="contactMethod"
            options={["Phone", "Email"]}
            value={f.contactMethod}
            onChange={(v) => set("contactMethod", v)}
          />
        </div>

        <Field
          label="Anything else we should know?"
          hint="Optional"
          htmlFor={fid("notes")}
        >
          <textarea
            id={fid("notes")}
            rows={3}
            value={f.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Access details, pets, priority areas, preferred days…"
            className={`${inputBase} py-3`}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-4 border-t border-teal/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="ff-geist flex items-center gap-2 text-[14px] text-muted transition-colors hover:text-ink"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M12 4L6 10l6 6" />
          </svg>
          Back to estimate
        </button>
        <Button
          as="button"
          type="submit"
          arrow
          disabled={status === "sending"}
          className="sm:min-w-[220px]"
        >
          {status === "sending" ? "Booking…" : "Confirm Booking Request"}
        </Button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN FORM
───────────────────────────────────────────────────────────────────────────── */

export default function QuoteForm({
  service,
  onServiceChange,
}: {
  service: ServiceId | null
  onServiceChange: (id: ServiceId) => void
}) {
  const uid = useId()
  const [f, setF] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [step, setStep] = useState<"quote" | "booking">("quote")
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setF((prev) => ({ ...prev, [k]: v }))
  const toggle = (k: "linenItems" | "leaseExtras", v: string) =>
    setF((prev) => ({
      ...prev,
      [k]: prev[k].includes(v)
        ? prev[k].filter((x) => x !== v)
        : [...prev[k], v],
    }))

  useEffect(() => {
    if (status === "sent") successRef.current?.focus()
  }, [status])

  useEffect(() => {
    if (service) setErrors((e) => ({ ...e, service: undefined }))
  }, [service])

  useEffect(() => {
    setStep("quote")
  }, [service])

  const fid = (name: string) => `${uid}-${name}`
  const estimate = computeEstimate(service, f)

  function validateQuoteStep(): Errors {
    const e: Errors = {}
    if (!service) e.service = "Choose the service you would like quoted."
    if (service === "linen" && f.linenItems.length === 0)
      e.linenItems = "Select at least one item type."
    if (!f.suburb.trim()) e.suburb = "Enter your suburb or postcode."
    return e
  }

  function validateBookingStep(): Errors {
    const e: Errors = {}
    if (!f.name.trim()) e.name = "Enter your name."
    if (!f.address.trim()) e.address = "Enter the full property address."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
      e.email = "Enter a valid email address."
    if (f.phone.replace(/\D/g, "").length < 8)
      e.phone = "Enter a valid phone number."
    return e
  }

  function handleProceedToBooking() {
    const e = validateQuoteStep()
    setErrors(e)
    if (Object.keys(e).length > 0) {
      const firstKey = Object.keys(e)[0]
      const target = formRef.current?.querySelector<HTMLElement>(
        `[data-field="${firstKey}"]`,
      )
      target?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    setStep("booking")
    // Scroll to the top of the quote section (not the whole page)
    setTimeout(() => {
      document
        .getElementById("quote")
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 50)
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (step === "quote") {
      handleProceedToBooking()
      return
    }
    const e = validateBookingStep()
    setErrors(e)
    if (Object.keys(e).length > 0) {
      const firstKey = Object.keys(e)[0]
      const target = formRef.current?.querySelector<HTMLElement>(
        `[data-field="${firstKey}"]`,
      )
      target?.scrollIntoView({ behavior: "smooth", block: "center" })
      target
        ?.querySelector<HTMLElement>("input, select, textarea")
        ?.focus({ preventScroll: true })
      return
    }
    setStatus("sending")

    // ── Send booking notification to owner via Web3Forms ──
    // Web3Forms is free (no backend needed). Get your access key at
    // https://web3forms.com and replace the key below.
    const selectedService = services.find((s) => s.id === service)
    const estimateText = estimate
      ? `$${estimate.min} – $${estimate.max} AUD`
      : "Contact for quote"

    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          // ⚠️  Replace with your Web3Forms access key from https://web3forms.com
          access_key: "YOUR_WEB3FORMS_ACCESS_KEY",
          subject: `🧹 New Booking Request – ${selectedService?.name ?? service} (${f.suburb})`,
          from_name: f.name,
          replyto: f.email,
          message: [
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            `  SPOTLESS – NEW BOOKING REQUEST`,
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            ``,
            `SERVICE:       ${selectedService?.name ?? service}`,
            `ESTIMATE:      ${estimateText}`,
            ``,
            `PROPERTY:      ${f.propertyType}`,
            `BEDROOMS:      ${service !== "linen" ? f.bedrooms : "N/A"}`,
            `BATHROOMS:     ${service !== "linen" ? f.bathrooms : "N/A"}`,
            `SUBURB:        ${f.suburb}`,
            `ADDRESS:       ${f.address}`,
            ``,
            service === "house" ? `FREQUENCY:     ${f.frequency}` : "",
            service === "lease" && f.leaseExtras.length > 0
              ? `EXTRAS:        ${f.leaseExtras.join(", ")}` : "",
            service === "lease" && f.moveOutDate
              ? `MOVE-OUT DATE: ${f.moveOutDate}` : "",
            service === "linen" ? `LINEN ITEMS:   ${f.linenItems.join(", ")}` : "",
            ``,
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            `CUSTOMER DETAILS`,
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            `NAME:          ${f.name}`,
            `EMAIL:         ${f.email}`,
            `PHONE:         ${f.phone}`,
            `CONTACT VIA:   ${f.contactMethod}`,
            f.preferredDate ? `PREFERRED DATE: ${f.preferredDate}` : "",
            f.notes ? `\nNOTES: ${f.notes}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      })
    } catch (_err) {
      // Submission still counts as sent even if notification fails.
      // Check your Web3Forms dashboard for submissions.
      console.error("Notification failed:", _err)
    }

    setStatus("sent")
  }

  function reset() {
    setF(initial)
    setErrors({})
    setStatus("idle")
    setStep("quote")
  }

  const selected = services.find((s) => s.id === service)
  const showRooms = service !== "linen"

  return (
    <section
      id="quote"
      aria-labelledby="quote-title"
      className={`${panelWrap} mt-0`}
    >
      <div className={`${panel} bg-teal text-white`}>
        <div
          className={`${panelInner} ${sectionY} grid gap-[clamp(40px,5vw,80px)] lg:grid-cols-12`}
        >
          {/* ── Intro / sidebar ── */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Eyebrow tone="dark">Quick quote</Eyebrow>
              <h2
                id="quote-title"
                className="ff-geist mt-6 text-[clamp(36px,3.8vw,64px)] leading-[1.04] tracking-[-0.02em] text-headline"
              >
                {step === "booking" ? (
                  <>
                    Ready to{" "}
                    <span className="ff-script text-turquoise-bright">book</span>?
                  </>
                ) : (
                  <>
                    Tell us about your{" "}
                    <span className="ff-script text-turquoise-bright">space</span>.
                  </>
                )}
              </h2>
              <p className="ff-geist mt-6 max-w-[420px] text-[18px] leading-[1.6] text-white/75">
                {step === "booking"
                  ? "Confirm your details and we'll lock in your clean right away."
                  : "A few details are all we need to prepare a tailored quote for your property."}
              </p>

              {step === "quote" && (
                <ul className="mt-10 space-y-4">
                  {[
                    "No obligation to book",
                    "Priced for your property and service",
                    "A real person reviews every request",
                  ].map((t) => (
                    <li
                      key={t}
                      className="ff-geist flex items-center gap-3 text-[16px] text-white/90"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-turquoise-bright/15 text-turquoise-bright">
                        <Check size={16} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              )}

              {/* Step indicator */}
              <div className="mt-10 flex items-center gap-1">
                {(["Get estimate", "Book clean"] as const).map((label, i) => {
                  const active =
                    (i === 0 && step === "quote") ||
                    (i === 1 && step === "booking")
                  const done = i === 0 && step === "booking"
                  return (
                    <div key={label} className="flex items-center gap-2">
                      <span
                        className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-colors ${
                          done
                            ? "bg-turquoise-bright text-teal"
                            : active
                              ? "bg-white text-teal"
                              : "bg-white/15 text-white/40"
                        }`}
                      >
                        {done ? <Check size={14} /> : i + 1}
                      </span>
                      <span
                        className={`ff-geist text-[13px] ${
                          active || done ? "text-white" : "text-white/40"
                        }`}
                      >
                        {label}
                      </span>
                      {i < 1 && (
                        <span className="mx-2 text-white/25">→</span>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-10 rounded-[24px] bg-white/[0.06] p-6 ring-1 ring-white/10">
                <p className="ff-geist text-[14px] text-white/65">
                  Prefer to talk?
                </p>
                <a
                  href={PHONE_HREF}
                  className="ff-geist-semibold mt-1 block text-[24px] leading-tight text-white hover:text-turquoise-bright"
                >
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>

          {/* ── Form card ── */}
          <div className="lg:col-span-8">
            <div className="rounded-[24px] bg-white p-5 text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] sm:rounded-[32px] sm:p-8 lg:p-12">
              {status === "sent" ? (
                <div
                  ref={successRef}
                  tabIndex={-1}
                  role="status"
                  className="py-8 text-center outline-none sm:py-16"
                >
                  <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-turquoise-bright text-teal">
                    <Check size={30} />
                  </span>
                  <h3 className="ff-geist mt-8 text-[clamp(28px,2.6vw,40px)] leading-tight text-ink">
                    Booking confirmed, {f.name.trim().split(" ")[0]}!
                  </h3>
                  <p className="ff-geist mx-auto mt-4 max-w-[460px] text-[17px] leading-[1.6] text-muted">
                    Your{" "}
                    <span className="ff-geist-semibold text-ink">
                      {selected?.name}
                    </span>{" "}
                    request for {f.suburb} has been received. We will be in
                    touch by {f.contactMethod.toLowerCase()} to confirm your
                    appointment.
                  </p>
                  {estimate && (
                    <div className="mx-auto mt-6 max-w-[300px] rounded-[16px] bg-sand p-4">
                      <p className="ff-geist text-[13px] text-muted">
                        Your estimated price
                      </p>
                      <p className="ff-geist-semibold mt-1 text-[28px] text-teal">
                        ${estimate.min} – ${estimate.max}
                        <span className="ff-geist ml-1 text-[14px] font-normal text-muted">
                          AUD
                        </span>
                      </p>
                    </div>
                  )}
                  <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button
                      as="button"
                      type="button"
                      variant="outline"
                      onClick={reset}
                    >
                      Start a new request
                    </Button>
                    <Button href={PHONE_HREF} variant="ink">
                      Call {PHONE_DISPLAY}
                    </Button>
                  </div>
                </div>
              ) : (
                <form
                  ref={formRef}
                  onSubmit={onSubmit}
                  noValidate
                  className="space-y-12"
                >
                  {step === "quote" ? (
                    <>
                      {/* 01 Service */}
                      <div data-field="service">
                        <GroupHeading index="01" title="Service" />
                        <fieldset
                          aria-describedby={
                            errors.service
                              ? `${fid("service")}-error`
                              : undefined
                          }
                        >
                          <legend className="sr-only">
                            Which service do you need?
                          </legend>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {services.map((s) => (
                              <label
                                key={s.id}
                                className="group relative cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  name="service"
                                  value={s.id}
                                  checked={service === s.id}
                                  onChange={() => onServiceChange(s.id)}
                                  className="peer sr-only"
                                />
                                <span className="flex min-h-[84px] items-center gap-4 rounded-[18px] border border-teal/15 p-4 pr-12 transition-colors hover:border-teal/35 peer-checked:border-turquoise peer-checked:bg-turquoise/10 peer-checked:ring-1 peer-checked:ring-turquoise peer-focus-visible:ring-4 peer-focus-visible:ring-turquoise/30">
                                  <img
                                    src={s.image}
                                    alt=""
                                    className="size-12 shrink-0 rounded-[12px] object-cover"
                                  />
                                  <span>
                                    <span className="ff-geist-semibold block text-[16px] text-ink">
                                      {s.name}
                                    </span>
                                    <span className="ff-geist block text-[13px] text-muted">
                                      {s.audience}
                                    </span>
                                  </span>
                                </span>
                                <span
                                  aria-hidden
                                  className="absolute right-4 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-teal/20 text-transparent transition-colors peer-checked:border-teal peer-checked:bg-teal peer-checked:text-white"
                                >
                                  <Check size={14} />
                                </span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        {errors.service && (
                          <p
                            id={`${fid("service")}-error`}
                            className="ff-geist mt-3 text-[13px] text-[#b4400b]"
                          >
                            {errors.service}
                          </p>
                        )}

                        {/* Service-specific questions */}
                        {service && (
                          <div
                            className="mt-6 space-y-6 rounded-[20px] bg-sand/70 p-5 sm:p-6"
                            aria-live="polite"
                          >
                            {service === "house" && (
                              <Segmented
                                legend="How often would you like a clean?"
                                name="frequency"
                                options={[
                                  "One-off",
                                  "Weekly",
                                  "Fortnightly",
                                  "Monthly",
                                ]}
                                value={f.frequency}
                                onChange={(v) => set("frequency", v)}
                              />
                            )}

                            {service === "airbnb" && (
                              <>
                                <div className="grid gap-5 sm:grid-cols-2">
                                  <Field
                                    label="Number of listings"
                                    htmlFor={fid("listings")}
                                  >
                                    <Select
                                      id={fid("listings")}
                                      value={f.listings}
                                      onChange={(v) => set("listings", v)}
                                      options={[
                                        "1",
                                        "2–3",
                                        "4–10",
                                        "More than 10",
                                      ]}
                                    />
                                  </Field>
                                  <Field
                                    label="Typical turnovers"
                                    htmlFor={fid("turnovers")}
                                  >
                                    <Select
                                      id={fid("turnovers")}
                                      value={f.turnovers}
                                      onChange={(v) => set("turnovers", v)}
                                      options={[
                                        "A few per month",
                                        "Weekly",
                                        "Several per week",
                                        "Daily",
                                      ]}
                                    />
                                  </Field>
                                </div>
                                <label className="flex cursor-pointer items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={f.linenSupply}
                                    onChange={(e) =>
                                      set("linenSupply", e.target.checked)
                                    }
                                    className="size-5 accent-[#123f4a]"
                                  />
                                  <span className="ff-geist text-[15px] text-ink">
                                    Include linen laundering between stays
                                  </span>
                                </label>
                              </>
                            )}

                            {service === "linen" && (
                              <>
                                <div data-field="linenItems">
                                  <CheckChips
                                    id={fid("linenItems")}
                                    legend="What needs care?"
                                    options={[
                                      "Bed linen",
                                      "Towels",
                                      "Table linen",
                                      "Curtains",
                                      "Cushion & sofa covers",
                                    ]}
                                    values={f.linenItems}
                                    onToggle={(v) => toggle("linenItems", v)}
                                    error={errors.linenItems}
                                  />
                                </div>
                                <div className="grid gap-5 sm:grid-cols-2">
                                  <Field
                                    label="Approximate volume"
                                    htmlFor={fid("linenVolume")}
                                  >
                                    <Select
                                      id={fid("linenVolume")}
                                      value={f.linenVolume}
                                      onChange={(v) => set("linenVolume", v)}
                                      options={[
                                        "A single load",
                                        "A few loads",
                                        "Ongoing service",
                                      ]}
                                    />
                                  </Field>
                                  <Field
                                    label="Collection"
                                    htmlFor={fid("linenCollection")}
                                  >
                                    <Select
                                      id={fid("linenCollection")}
                                      value={f.linenCollection}
                                      onChange={(v) =>
                                        set("linenCollection", v)
                                      }
                                      options={[
                                        "Pick-up & delivery",
                                        "I will drop off",
                                      ]}
                                    />
                                  </Field>
                                </div>
                              </>
                            )}

                            {service === "lease" && (
                              <>
                                <Field
                                  label="Move-out or inspection date"
                                  hint="Optional"
                                  htmlFor={fid("moveOut")}
                                  className="sm:max-w-[320px]"
                                >
                                  <input
                                    id={fid("moveOut")}
                                    type="date"
                                    value={f.moveOutDate}
                                    onChange={(e) =>
                                      set("moveOutDate", e.target.value)
                                    }
                                    className={inputBase}
                                  />
                                </Field>
                                <CheckChips
                                  id={fid("leaseExtras")}
                                  legend="Any extras?"
                                  options={[
                                    "Carpet steam clean",
                                    "Oven deep clean",
                                    "Window tracks & screens",
                                    "Wall spot cleaning",
                                  ]}
                                  values={f.leaseExtras}
                                  onToggle={(v) => toggle("leaseExtras", v)}
                                />
                                {f.leaseExtras.length > 0 && (
                                  <div className="rounded-[12px] bg-white/80 p-4 text-[13px]">
                                    <p className="ff-geist-medium mb-2 text-ink">
                                      Add-on costs:
                                    </p>
                                    {f.leaseExtras.map((extra) => (
                                      <div
                                        key={extra}
                                        className="ff-geist flex justify-between py-0.5 text-muted"
                                      >
                                        <span>{extra}</span>
                                        <span className="ff-geist-medium text-teal">
                                          +${leaseAddonPrices[extra]}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 02 Property */}
                      <div>
                        <GroupHeading
                          index="02"
                          title={
                            service === "linen" ? "Location" : "Property details"
                          }
                        />
                        <div className="space-y-6">
                          {showRooms && (
                            <>
                              <Segmented
                                legend="Property type"
                                name="propertyType"
                                options={[
                                  "House",
                                  "Apartment / unit",
                                  "Townhouse",
                                ]}
                                value={f.propertyType}
                                onChange={(v) => set("propertyType", v)}
                              />
                              <div className="grid grid-cols-2 gap-5">
                                <Field
                                  label="Bedrooms"
                                  htmlFor={fid("bedrooms")}
                                >
                                  <Select
                                    id={fid("bedrooms")}
                                    value={f.bedrooms}
                                    onChange={(v) => set("bedrooms", v)}
                                    options={[
                                      "Studio",
                                      "1",
                                      "2",
                                      "3",
                                      "4",
                                      "5+",
                                    ]}
                                  />
                                </Field>
                                <Field
                                  label="Bathrooms"
                                  htmlFor={fid("bathrooms")}
                                >
                                  <Select
                                    id={fid("bathrooms")}
                                    value={f.bathrooms}
                                    onChange={(v) => set("bathrooms", v)}
                                    options={["1", "2", "3", "4+"]}
                                  />
                                </Field>
                              </div>
                            </>
                          )}
                          <div data-field="suburb">
                            <Field
                              label="Suburb or postcode"
                              required
                              error={errors.suburb}
                              htmlFor={fid("suburb")}
                            >
                              <input
                                id={fid("suburb")}
                                value={f.suburb}
                                onChange={(e) =>
                                  set("suburb", e.target.value)
                                }
                                placeholder="e.g. Richmond 3121"
                                autoComplete="postal-code"
                                aria-invalid={!!errors.suburb}
                                aria-describedby={
                                  errors.suburb
                                    ? `${fid("suburb")}-error`
                                    : undefined
                                }
                                className={inputBase}
                              />
                            </Field>
                          </div>
                        </div>
                      </div>

                      {/* 03 Instant estimate */}
                      <div>
                        <GroupHeading index="03" title="Your instant estimate" />
                        <EstimatePanel
                          estimate={estimate}
                          service={service}
                          frequency={f.frequency}
                        />
                      </div>

                      {/* Proceed CTA */}
                      <div className="flex flex-col gap-5 border-t border-teal/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                        <p className="ff-geist max-w-[360px] text-[13px] leading-[1.55] text-muted">
                          Happy with your estimate? Proceed to confirm your booking.
                        </p>
                        <Button
                          as="button"
                          type="submit"
                          arrow
                          className="sm:min-w-[240px]"
                        >
                          Proceed to Booking →
                        </Button>
                      </div>
                    </>
                  ) : (
                    <BookingStep
                      f={f}
                      set={set}
                      errors={errors}
                      fid={fid}
                      estimate={estimate}
                      service={service}
                      status={status}
                      onBack={() => setStep("quote")}
                    />
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
