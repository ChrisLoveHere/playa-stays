// ============================================================
// /es/rentas/page.tsx  →  https://www.playastays.com/es/rentas/
// Spanish rentals index. Mirrors /rentals/page.tsx with
// locale="es" and ES-correct metadata + hrefs.
// ============================================================

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getProperties } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { RentalCategoryTemplate } from '@/components/templates/RentalCategoryTemplate'

export const revalidate = 1800

export const metadata: Metadata = buildMetadata({
  title: 'Rentas Vacacionales en Playa del Carmen | PlayaStays',
  description: 'Explora rentas vacacionales gestionadas profesionalmente en Quintana Roo. Todas las propiedades administradas por el equipo local de PlayaStays. Anuncios verificados, soporte bilingüe.',
  canonical: 'https://www.playastays.com/es/rentas/',
  hreflangEn: 'https://www.playastays.com/rentals/',
})

interface Props {
  searchParams: {
    bedrooms?: string
    type?:     string
    feature?:  string | string[]
    city?:     string
    sort?:     string
  }
}

export default async function EsRentalsPage({ searchParams }: Props) {
  const { isEnabled: preview } = draftMode()

  const features = Array.isArray(searchParams.feature)
    ? searchParams.feature
    : searchParams.feature ? [searchParams.feature] : []

  const properties = await getProperties({
    bedrooms:     searchParams.bedrooms,
    propertyType: searchParams.type,
    feature:      features[0],
    citySlug:     searchParams.city,
    perPage:      18,
    preview,
  })

  return (
    <RentalCategoryTemplate
      title="Rentas vacacionales en Quintana Roo"
      tag="🏖️ Rentas gestionadas por PlayaStays"
      description="Explora rentas vacacionales gestionadas profesionalmente en Playa del Carmen, Tulum, Akumal y más. Cada propiedad es administrada por nuestro equipo local bilingüe."
      canonicalHref="/es/rentas/"
      properties={properties}
      breadcrumbs={[
        { label: 'Inicio', href: '/es/' },
        { label: 'Rentas', href: null },
      ]}
      stats={[
        { val: '200+', key: 'Propiedades administradas' },
        { val: '4.97★', key: 'Calificación promedio' },
        { val: '6',     key: 'Ciudades' },
        { val: '24/7',  key: 'Soporte a huéspedes' },
      ]}
      locale="es"
    />
  )
}
