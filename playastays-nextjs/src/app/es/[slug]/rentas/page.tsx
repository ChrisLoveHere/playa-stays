import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getCitySlugs, getCity, getCitiesForNavigation } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { RentalCategoryTemplate } from '@/components/templates/RentalCategoryTemplate'
import { loadBrowseProperties } from '@/lib/property-browse'

export const revalidate = 1800

export const dynamicParams = true

export async function generateStaticParams() {
  const citySlugs = await getCitySlugs()
  return citySlugs.map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const city = await getCity(params.slug)
  if (!city) return {}
  const name = city.title.rendered
  return buildMetadata({
    title: `Rentas vacacionales en ${name} | PlayaStays`,
    description:
      city.meta.ps_excerpt_es ||
      city.meta.ps_seo_desc ||
      `Explora rentas vacacionales gestionadas en ${name}.`,
    canonical: `https://www.playastays.com/es/${params.slug}/rentas/`,
    hreflangEn: `https://www.playastays.com/${params.slug}/rentals/`,
  })
}

interface Props {
  params: { slug: string }
  searchParams: Record<string, string | string[] | undefined>
}

export default async function EsCityRentalsPage({ params, searchParams }: Props) {
  const { isEnabled: preview } = draftMode()

  const city = await getCity(params.slug, preview)
  if (!city) notFound()

  const cities = await getCitiesForNavigation(preview)
  const browseCities = cities.map(c => ({ slug: c.slug, name: c.title.rendered }))

  const properties = await loadBrowseProperties(searchParams, {
    citySlug: params.slug,
    preview,
  })

  const name = city.title.rendered

  return (
    <RentalCategoryTemplate
      title={`Rentas vacacionales en ${name}`}
      tag="🏖️ Rentas gestionadas por PlayaStays"
      description={`Explora rentas vacacionales gestionadas profesionalmente en ${name}. Cada anuncio es administrado por nuestro equipo local bilingüe.`}
      canonicalHref={`/es/${params.slug}/rentas/`}
      properties={properties}
      city={city}
      breadcrumbs={[
        { label: 'Inicio', href: '/es/' },
        { label: name, href: `/es/${params.slug}/` },
        { label: 'Rentas', href: null },
      ]}
      stats={[
        { val: '4.97★', key: 'Calificación promedio' },
        { val: '6', key: 'Ciudades' },
        { val: '24/7', key: 'Soporte a huéspedes' },
      ]}
      locale="es"
      browseCities={browseCities}
    />
  )
}
