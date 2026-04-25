/** Build tel: link from a display phone string (keeps leading + when present). */
export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return `tel:${digits}`
  return `tel:+${digits}`
}
