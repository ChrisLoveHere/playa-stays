import type { Locale } from '@/lib/i18n'
import { TeamMemberCard } from './TeamMemberCard'
import styles from './TeamSection.module.css'

const WHATSAPP_CHRIS =
  'https://wa.me/529841234567?text=Hi%20Chris%2C%20I%20found%20you%20on%20PlayaStays'

export function TeamSection({ locale }: { locale: Locale }) {
  const isEs = locale === 'es'

  return (
    <section className={`pad-lg ${styles.section}`} aria-label={isEs ? 'Con quién vas a hablar' : "Who you'll be talking to"}>
      <div className="container">
        <div className={styles.header}>
          <div className="eyebrow">{isEs ? 'CON QUIÉN VAS A HABLAR' : "WHO YOU'LL BE TALKING TO"}</div>
          <h2 className={styles.heading}>
            {isEs ? 'Un equipo local pequeño con el que sí hablarás.' : "A small, local team you'll actually speak with."}
          </h2>
          <p className={styles.subhead}>
            {isEs
              ? 'La mayoría de los mensajes reciben respuesta personal en horas, no días. Sin call center, sin respuestas plantilla.'
              : 'Most messages get a personal reply within hours, not days. No call center, no template responses.'}
          </p>
        </div>

        <div className={styles.grid}>
          <TeamMemberCard
            photoPath="/team/chris-love.jpg"
            name="Chris Love"
            role={isEs ? 'Fundador · Consultas de propietarios' : 'Founder · Owner inquiries'}
            description={
              isEs ? 'Lee cada envío de propietario en 24 horas.' : 'Reads every owner submission within 24 hours.'
            }
            socials={[
              { platform: 'linkedin', url: 'https://www.linkedin.com/in/chrislove89', ariaLabel: isEs ? 'Chris Love en LinkedIn' : 'Chris Love on LinkedIn' },
              { platform: 'facebook', url: 'https://www.facebook.com/Chrislove89', ariaLabel: isEs ? 'Chris Love en Facebook' : 'Chris Love on Facebook' },
              { platform: 'instagram', url: 'https://www.instagram.com/playastays', ariaLabel: isEs ? 'PlayaStays en Instagram' : 'PlayaStays on Instagram' },
            ]}
            whatsapp={{ url: WHATSAPP_CHRIS, label: 'WhatsApp Chris →' }}
          />
          <TeamMemberCard
            photoPath="/team/tony-sparks.png"
            name="Tony Sparks"
            role={isEs ? 'Jefe de Operaciones · Campo y mantenimiento' : 'Head of Operations · Field & maintenance'}
            description={
              isEs
                ? 'Gestiona las operaciones en sitio en todo Quintana Roo. Coordinación de proveedores, mantenimiento y preparación de propiedades.'
                : 'Manages on-the-ground operations across Quintana Roo. Vendor coordination, maintenance, and property readiness.'
            }
            socials={[
              { platform: 'linkedin', url: 'https://www.linkedin.com/in/tony-sparks-industries/', ariaLabel: 'Tony Sparks on LinkedIn' },
              { platform: 'facebook', url: 'https://www.facebook.com/anthony.sparks1', ariaLabel: 'Tony Sparks on Facebook' },
            ]}
          />
          <TeamMemberCard
            photoPath="/team/carmen-castro.png"
            name="Carmen Castro"
            role={isEs ? 'Gerente de Limpieza · Limpieza y cambios de huésped' : 'Housekeeping Manager · Cleaning & turnovers'}
            description={
              isEs
                ? 'Lidera nuestro equipo de limpieza nivel hotelero. Cada propiedad lista para huéspedes, cada cambio.'
                : 'Leads our hotel-standard cleaning team. Every property guest-ready, every turnover.'
            }
            socials={[
              { platform: 'facebook', url: 'https://www.facebook.com/carmen.castro.735927', ariaLabel: 'Carmen Castro on Facebook' },
            ]}
          />
        </div>
      </div>
    </section>
  )
}
