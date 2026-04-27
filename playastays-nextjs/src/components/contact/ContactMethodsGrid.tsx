import type { Locale } from '@/lib/i18n'
import styles from './ContactMethodsGrid.module.css'

type Method = { name: string; meta: string; href?: string; placeholder?: boolean }

export function ContactMethodsGrid({ locale }: { locale: Locale }) {
  const isEs = locale === 'es'

  const groups: Array<{ title: string; sub: string; items: Method[] }> = [
    {
      title: isEs ? 'Ahora mismo' : 'Right now',
      sub: isEs
        ? 'Para preguntas urgentes o conversaciones en vivo'
        : 'For urgent questions or live conversations',
      items: [
        {
          name: 'WhatsApp Chris',
          meta: isEs ? 'Disponible 7am – 10pm · Respuesta en minutos' : 'Available 7am – 10pm · Usually replies in minutes',
          href: 'https://wa.me/529841234567?text=Hi%20Chris%2C%20I%20found%20you%20on%20PlayaStays',
        },
        {
          name: '+52 984 123 4567',
          meta: isEs ? 'Lun – Sáb 8am – 8pm MX' : 'Mon – Sat 8am – 8pm MX',
          href: 'tel:+529841234567',
        },
      ],
    },
    {
      title: isEs ? 'Esta semana' : 'This week',
      sub: isEs ? 'Para conversaciones más largas o agendar una llamada' : 'For longer conversations or to schedule a call',
      items: [
        {
          name: 'Chris@PlayaStays.com',
          meta: isEs ? 'Respuesta en 24 horas' : 'Reply within 24 hours',
          href: 'mailto:Chris@PlayaStays.com',
        },
        {
          name: isEs ? 'Agendar una llamada de 30 minutos' : 'Book a 30-minute call',
          meta: isEs ? 'Link de Calendly próximamente' : 'Calendly link coming soon',
          placeholder: true,
        },
      ],
    },
    {
      title: isEs ? 'Cuando puedas' : 'On your own time',
      sub: isEs ? 'Explora nuestros recursos' : 'Browse our resources',
      items: [
        {
          name: isEs ? 'Preguntas de precios' : 'Pricing FAQ',
          meta: isEs ? 'Preguntas comunes respondidas' : 'Common questions answered',
          href: isEs ? '/es/precios-administracion-propiedades/#faq' : '/property-management-pricing/#faq',
        },
        {
          name: isEs ? 'Visita nuestra oficina en Playa del Carmen' : 'Visit our Playa del Carmen office',
          meta: 'Calle 34 Nte 103, Zazil-ha',
          href: 'https://maps.app.goo.gl/6nD8M9GXRaCmW1hJ9',
        },
      ],
    },
  ]

  return (
    <section className={`pad-lg bg-ivory ${styles.section}`}>
      <div className="container">
        <div className={styles.header}>
          <div className="eyebrow">{isEs ? 'OTRAS FORMAS DE CONTACTARNOS' : 'OTHER WAYS TO REACH US'}</div>
          <h2 className={styles.heading}>
            {isEs ? 'Elige el camino que coincida con tu urgencia.' : 'Pick the path that matches how fast you need us.'}
          </h2>
        </div>
        <div className={styles.grid}>
          {groups.map(group => (
            <article key={group.title} className={styles.group}>
              <h3 className={styles.groupTitle}>{group.title}</h3>
              <p className={styles.groupSub}>{group.sub}</p>
              {group.items.map(item => (
                <div key={item.name} className={styles.option}>
                  <IconDot className={styles.icon} />
                  <div>
                    {item.href ? (
                      <a
                        className={styles.name}
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {item.name}
                      </a>
                    ) : (
                      <span className={styles.name}>{item.name}</span>
                    )}
                    {/* TODO: Replace placeholder text with real Calendly link when account is set up */}
                    <p className={`${styles.meta} ${item.placeholder ? styles.placeholder : ''}`}>{item.meta}</p>
                  </div>
                </div>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function IconDot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4Zm0 4.5a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4Z" />
    </svg>
  )
}
