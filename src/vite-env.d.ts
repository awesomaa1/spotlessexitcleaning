/// <reference types="vite/client" />

interface Window {
  fbq?: (
    action: string,
    event: string,
    params?: Record<string, unknown>
  ) => void
  _fbq?: unknown
}
