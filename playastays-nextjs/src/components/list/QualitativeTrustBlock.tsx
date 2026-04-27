import type { Locale } from '@/lib/i18n'
import styles from './QualitativeTrustBlock.module.css'

export function QualitativeTrustBlock({ locale }: { locale: Locale }) {
  const isEs = locale === 'es'
  return (
    <section className={`pad-lg bg-sand ${styles.section}`}>
      <div className={`container ${styles.wrap}`}>
        <div className="eyebrow">{isEs ? 'EL RESULTADO' : 'THE OUTCOME'}</div>
        <h2 className={styles.heading}>
          {isEs
            ? 'Los propietarios ganan significativamente más con nosotros que auto-administrando.'
            : 'Owners earn meaningfully more with us than self-managing.'}
        </h2>
        <p className={styles.subhead}>
          {isEs
            ? 'Precios profesionales, exposición multicanal y control operacional más estricto consistentemente mueven los números a favor de nuestros propietarios — incluso después de nuestra comisión.'
            : "Professional pricing, multi-channel exposure, and tighter operational control consistently move the numbers in our owners' favor — even after our management fee."}
        </p>
      </div>
    </section>
  )
}
