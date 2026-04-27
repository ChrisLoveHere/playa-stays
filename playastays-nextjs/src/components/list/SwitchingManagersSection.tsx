import type { Locale } from '@/lib/i18n'
import styles from './SwitchingManagersSection.module.css'

export function SwitchingManagersSection({ locale }: { locale: Locale }) {
  const isEs = locale === 'es'
  const cards = [
    {
      title: isEs ? 'Revisamos tu contrato actual' : 'We review your current contract',
      body: isEs
        ? 'Envíanos tu contrato de administración actual. Identificaremos el período de aviso, términos de salida y obligaciones pendientes — para que sepas exactamente lo que necesitas antes de cambiar.'
        : "Send us your existing management agreement. We'll identify the notice period, exit terms, and any holdover obligations — so you know exactly what's needed before switching.",
      icon: <IconContract />,
    },
    {
      title: isEs ? 'Coordinamos la transferencia de la propiedad' : 'We coordinate the property handoff',
      body: isEs
        ? 'Llaves, códigos, contactos de proveedores, exportación de calendarios y traspaso de canales — gestionamos la transición con tu administrador actual sin que nada se caiga.'
        : 'Keys, codes, vendor contacts, calendar exports, and channel handoffs — we manage the transition with your current manager so nothing falls through the cracks.',
      icon: <IconHandoff />,
    },
    {
      title: isEs ? 'Las reservas siguen activas durante el cambio' : 'Bookings stay live during the switch',
      body: isEs
        ? 'Las reservas existentes se transfieren limpiamente. Los huéspedes no notan el cambio. No pierdes una sola reserva — y honramos cada compromiso que hizo tu administrador actual.'
        : "Existing reservations transfer cleanly. Guests don't notice the change. You don't lose a single booking — and we honor every commitment your current manager made.",
      icon: <IconCalendar />,
    },
  ]

  return (
    <section className={`pad-lg bg-ivory ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <div className="eyebrow">{isEs ? '¿CAMBIANDO DE ADMINISTRADOR?' : 'SWITCHING MANAGERS?'}</div>
          <h2 className={styles.heading}>{isEs ? 'Hacemos que cambiar sea fácil.' : 'We make switching painless.'}</h2>
          <p className={styles.subhead}>
            {isEs
              ? 'La mayoría de nuestros nuevos propietarios vienen de otro administrador. Así manejamos la transición para que tú no tengas que hacerlo.'
              : "Most of our new owners come from another manager. Here's how we handle the transition so you don't have to."}
          </p>
        </div>
        <div className={styles.grid}>
          {cards.map(card => (
            <article key={card.title} className={styles.card}>
              <div className={styles.icon} aria-hidden>
                {card.icon}
              </div>
              <h3 className={styles.title}>{card.title}</h3>
              <p className={styles.body}>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function IconContract() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 2.5h8.5L20 8v12.5A1.5 1.5 0 0 1 18.5 22h-12A1.5 1.5 0 0 1 5 20.5v-16A2 2 0 0 1 7 2.5Zm7.5 1.8v3.4h3.4L13.5 4.3ZM8 11h8v1.5H8V11Zm0 3.5h8V16H8v-1.5Z" />
    </svg>
  )
}

function IconHandoff() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.2 8.2h4.9a2.8 2.8 0 1 1 0 5.6H9.6V12h1.5a1 1 0 0 0 0-2H6.2V8.2Zm11.6 7.6h-4.9a2.8 2.8 0 1 1 0-5.6h1.5V12h-1.5a1 1 0 0 0 0 2h4.9v1.8ZM6.8 13.2l3.5-3.5 1.3 1.3-3.5 3.5-1.3-1.3Zm10.4-2.4 1.3 1.3-3.5 3.5-1.3-1.3 3.5-3.5Z" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 2.5h1.8v2H15V2.5h1.8v2H19A2 2 0 0 1 21 6.5v13A2.5 2.5 0 0 1 18.5 22h-13A2.5 2.5 0 0 1 3 19.5v-13a2 2 0 0 1 2-2h2V2.5Zm12.2 7H4.8v10a.7.7 0 0 0 .7.7h13a.7.7 0 0 0 .7-.7v-10ZM7.8 12h2.4v2.4H7.8V12Z" />
    </svg>
  )
}
