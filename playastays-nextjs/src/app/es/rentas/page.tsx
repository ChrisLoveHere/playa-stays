// ============================================================
// /es/rentas/page.tsx  →  https://www.playastays.com/es/rentas/
// Spanish rentals index. Mirrors /rentals/page.tsx with
// locale="es" and ES-correct metadata + hrefs.
// ============================================================

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { buildMetadata } from '@/lib/seo'
import { RentalCategoryTemplate } from '@/components/templates/RentalCategoryTemplate'
import { loadBrowseProperties } from '@/lib/property-browse'
import { getCitiesForNavigation } from '@/lib/wordpress'

export const revalidate = 1800

export const metadata: Metadata = buildMetadata({
  title: 'Rentas Vacacionales en Playa del Carmen | PlayaStays',
  description: 'Explora rentas vacacionales gestionadas profesionalmente en Quintana Roo. Todas las propiedades administradas por el equipo local de PlayaStays. Anuncios verificados, soporte bilingüe.',
  canonical: 'https://www.playastays.com/es/rentas/',
  hreflangEn: 'https://www.playastays.com/rentals/',
})

interface Props {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function EsRentalsPage({ searchParams }: Props) {
  const { isEnabled: preview } = draftMode()

  const cities = await getCitiesForNavigation(preview)
  const browseCities = cities.map(c => ({ slug: c.slug, name: c.title.rendered }))

  const properties = await loadBrowseProperties(searchParams, {
    citySlug: typeof searchParams.city === 'string' ? searchParams.city : undefined,
    preview,
  })

  return (
    <RentalCategoryTemplate
      title='Rentas vacacionales en <span class="rentals-search-hero__accent">Quintana Roo</span>'
      tag=""
      description="Explora rentas vacacionales gestionadas profesionalmente en Playa del Carmen, Tulum y destinos de la Riviera Maya."
      canonicalHref="/es/rentas/"
      properties={properties}
      breadcrumbs={[
        { label: 'Inicio', href: '/es/' },
        { label: 'Rentas', href: null },
      ]}
      locale="es"
      browseCities={browseCities}
      browseLayout="search-led"
    />
  )
}
