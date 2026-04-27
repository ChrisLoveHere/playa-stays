import type { Locale } from '@/lib/i18n'
import styles from './MobileWhatsAppSticky.module.css'

const WHATSAPP_CHRIS =
  'https://wa.me/529841234567?text=Hi%20Chris%2C%20I%20found%20you%20on%20PlayaStays'

export function MobileWhatsAppSticky({ locale }: { locale: Locale }) {
  return (
    <a
      href={WHATSAPP_CHRIS}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      aria-label={locale === 'es' ? 'Mensaje a Chris por WhatsApp' : 'Message Chris on WhatsApp'}
    >
      <IconWhatsApp />
    </a>
  )
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor" aria-hidden>
      <path d="M16 3.5a12.5 12.5 0 0 0-10.8 18.8L3 28.5l6.4-2A12.5 12.5 0 1 0 16 3.5Zm0 22.7c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-3.8 1.2 1.2-3.7-.2-.4a9.8 9.8 0 1 1 8.5 4.5Zm5.4-7.3c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.1-.4.2-.8 0a8 8 0 0 1-2.4-1.5 8.8 8.8 0 0 1-1.6-2c-.2-.4 0-.6.2-.8l.5-.6.3-.5c0-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6 0-.8.4-.3.3-1.1 1-.1 2.5.9 1.4 2.6 4.3 6.3 5.8 3 .1 3.7-.3 4.4-.9.6-.7.8-1.4.9-1.6 0-.3 0-.5-.2-.6Z" />
    </svg>
  )
}
