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
  email: string
  phone: string
  contactMethod: string
  notes: string
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
  email: "",
  phone: "",
  contactMethod: "Phone",
  notes: "",
}

type Errors = Partial<Record<"service" | "suburb" | "name" | "email" | "phone" | "linenItems", string>>

/* ---------- Field primitives ---------- */

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

/* ---------- Form ---------- */

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

  const fid = (name: string) => `${uid}-${name}`

  function validate(): Errors {
    const e: Errors = {}
    if (!service) e.service = "Choose the service you would like quoted."
    if (service === "linen" && f.linenItems.length === 0)
      e.linenItems = "Select at least one item type."
    if (!f.suburb.trim()) e.suburb = "Enter your suburb or postcode."
    if (!f.name.trim()) e.name = "Enter your name."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
      e.email = "Enter a valid email address."
    if (f.phone.replace(/\D/g, "").length < 8)
      e.phone = "Enter a valid phone number."
    return e
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    const firstKey = Object.keys(e)[0]
    if (firstKey) {
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
    // TODO: connect to the enquiry endpoint / CRM. The payload is assembled here.
    await new Promise((r) => setTimeout(r, 900))
    setStatus("sent")
  }

  function reset() {
    setF(initial)
    setErrors({})
    setStatus("idle")
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
          {/* Intro column */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Eyebrow tone="dark">Quick quote</Eyebrow>
              <h2
                id="quote-title"
                className="ff-geist mt-6 text-[clamp(36px,3.8vw,64px)] leading-[1.04] tracking-[-0.02em] text-headline"
              >
                Tell us about your{" "}
                <span className="ff-script text-turquoise-bright">space</span>.
              </h2>
              <p className="ff-geist mt-6 max-w-[420px] text-[18px] leading-[1.6] text-white/75">
                A few details are all we need to prepare a tailored quote for
                your property.
              </p>
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

          {/* Form card */}
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
                    Thank you, {f.name.trim().split(" ")[0]}.
                  </h3>
                  <p className="ff-geist mx-auto mt-4 max-w-[460px] text-[17px] leading-[1.6] text-muted">
                    Your request for{" "}
                    <span className="ff-geist-semibold text-ink">
                      {selected?.name}
                    </span>{" "}
                    in {f.suburb} has been received. We will be in touch by{" "}
                    {f.contactMethod.toLowerCase()} with your tailored quote.
                  </p>
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
                  {/* 01 Service */}
                  <div data-field="service">
                    <GroupHeading index="01" title="Service" />
                    <fieldset
                      aria-describedby={
                        errors.service ? `${fid("service")}-error` : undefined
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

                    {/* Conditional, service-specific questions */}
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
                                  options={["1", "2–3", "4–10", "More than 10"]}
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
                                  onChange={(v) => set("linenCollection", v)}
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
                            options={["House", "Apartment / unit", "Townhouse"]}
                            value={f.propertyType}
                            onChange={(v) => set("propertyType", v)}
                          />
                          <div className="grid grid-cols-2 gap-5">
                            <Field label="Bedrooms" htmlFor={fid("bedrooms")}>
                              <Select
                                id={fid("bedrooms")}
                                value={f.bedrooms}
                                onChange={(v) => set("bedrooms", v)}
                                options={["Studio", "1", "2", "3", "4", "5+"]}
                              />
                            </Field>
                            <Field label="Bathrooms" htmlFor={fid("bathrooms")}>
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
                            onChange={(e) => set("suburb", e.target.value)}
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

                  {/* 03 Contact */}
                  <div>
                    <GroupHeading index="03" title="Your details" />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div data-field="name" className="sm:col-span-2">
                        <Field
                          label="Full name"
                          required
                          error={errors.name}
                          htmlFor={fid("name")}
                        >
                          <input
                            id={fid("name")}
                            value={f.name}
                            onChange={(e) => set("name", e.target.value)}
                            autoComplete="name"
                            aria-invalid={!!errors.name}
                            aria-describedby={
                              errors.name ? `${fid("name")}-error` : undefined
                            }
                            className={inputBase}
                          />
                        </Field>
                      </div>
                      <div data-field="email">
                        <Field
                          label="Email"
                          required
                          error={errors.email}
                          htmlFor={fid("email")}
                        >
                          <input
                            id={fid("email")}
                            type="email"
                            value={f.email}
                            onChange={(e) => set("email", e.target.value)}
                            autoComplete="email"
                            aria-invalid={!!errors.email}
                            aria-describedby={
                              errors.email ? `${fid("email")}-error` : undefined
                            }
                            className={inputBase}
                          />
                        </Field>
                      </div>
                      <div data-field="phone">
                        <Field
                          label="Phone"
                          required
                          error={errors.phone}
                          htmlFor={fid("phone")}
                        >
                          <input
                            id={fid("phone")}
                            type="tel"
                            value={f.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            autoComplete="tel"
                            placeholder="04xx xxx xxx"
                            aria-invalid={!!errors.phone}
                            aria-describedby={
                              errors.phone ? `${fid("phone")}-error` : undefined
                            }
                            className={inputBase}
                          />
                        </Field>
                      </div>
                      <div className="sm:col-span-2">
                        <Segmented
                          legend="Preferred contact"
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
                        className="sm:col-span-2"
                      >
                        <textarea
                          id={fid("notes")}
                          rows={4}
                          value={f.notes}
                          onChange={(e) => set("notes", e.target.value)}
                          placeholder="Access, pets, priority areas, preferred days…"
                          className={`${inputBase} py-3`}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="flex flex-col gap-5 border-t border-teal/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <p className="ff-geist max-w-[360px] text-[13px] leading-[1.55] text-muted">
                      Your details are only used to prepare and discuss your
                      quote.
                    </p>
                    <Button
                      as="button"
                      type="submit"
                      arrow
                      disabled={status === "sending"}
                      className="sm:min-w-[240px]"
                    >
                      {status === "sending" ? "Sending…" : "Request My Quote"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
