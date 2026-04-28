import Image from 'next/image'
import Link from 'next/link'
import styles from './ServiceHubCityCards.module.css'

const CITIES = [
  { slug: 'playa-del-carmen', en: 'Playa del Carmen', es: 'Playa del Carmen' },
  { slug: 'tulum', en: 'Tulum', es: 'Tulum' },
  { slug: 'puerto-morelos', en: 'Puerto Morelos', es: 'Puerto Morelos' },
  { slug: 'akumal', en: 'Akumal', es: 'Akumal' },
  { slug: 'xpu-ha', en: 'Xpu-Ha', es: 'Xpu-Ha' },
  { slug: 'chetumal', en: 'Chetumal', es: 'Chetumal' },
  { slug: 'cozumel', en: 'Cozumel', es: 'Cozumel' },
  { slug: 'isla-mujeres', en: 'Isla Mujeres', es: 'Isla Mujeres' },
] as const

export function ServiceHubCityCards({
  locale,
  hubSlug,
}: {
  locale: 'en' | 'es'
  hubSlug: string
}) {
  const isEs = locale === 'es'
  const base = isEs ? '/es' : ''
  const sectionLabel = isEs ? 'Selecciona tu mercado' : 'Choose your market'

  return (
    <section className={`pad-lg bg-ivory ${styles.root}`} id="choose-city" aria-label={sectionLabel}>
      <div className="container">
        <div className={styles.header}>
          <div className="eyebrow mb-8">{isEs ? 'Elige tu mercado' : 'Choose your market'}</div>
          <h2 className="section-title mt-12 mb-16">
            {isEs ? 'Dónde operamos en Quintana Roo' : 'Where we operate across Quintana Roo'}
          </h2>
          <p className="body-text">
            {isEs
              ? 'El enlace principal abre el servicio en tu ciudad. También puedes revisar primero el contexto del mercado local.'
              : 'The primary link opens this service in your city. You can also review the broader local market first.'}
          </p>
        </div>

        <div className={styles.grid}>
          {CITIES.map(city => {
            const name = isEs ? city.es : city.en
            const cityHref = `${base}/${city.slug}/`
            const hubHref = `${base}/${city.slug}/${hubSlug}/`
            return (
              <article key={city.slug} className={styles.card}>
                <div className={styles.media}>
                  <Image
                    src={`/home/cities/${city.slug}.jpg`}
                    alt=""
                    fill
                    className={styles.mediaImg}
                    sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, (max-width: 1100px) 33vw, 25vw"
                    unoptimized
                  />
                  <div className={styles.mediaGradient} aria-hidden />
                </div>
                <div className={styles.body}>
                  <h3 className={styles.city}>{name}</h3>
                  <p className={styles.tagline}>
                    {isEs
                      ? `Ejecución local y operación en ${name}.`
                      : `Local execution and on-the-ground operations in ${name}.`}
                  </p>
                  <Link href={hubHref} className={styles.primary}>
                    {isEs ? `Ver ${name} →` : `View ${name} →`}
                  </Link>
                  <Link href={cityHref} className={styles.secondary}>
                    {isEs ? `Explorar mercado de ${name} →` : `Explore ${name} market →`}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
