// ============================================================
// /es/blog/page.tsx  →  https://www.playastays.com/es/blog/
// ============================================================

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import {
  getBlogPosts,
  getBlogTopicTerms,
  getBlogAreaTerms,
} from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { SITE_URL } from '@/lib/site-url'
import { BlogHubView } from '@/components/blog/BlogHubView'
import { CtaStrip } from '@/components/sections'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'Blog de Administración de Propiedades | PlayaStays',
  description:
    'Estrategias de Airbnb, guías de inversión, datos de mercado y consejos operativos para propietarios en la Riviera Maya.',
  canonical: `${SITE_URL}/es/blog/`,
  hreflangEn: `${SITE_URL}/blog/`,
})

interface Props {
  searchParams: { page?: string; q?: string; topic?: string; area?: string }
}

export default async function EsBlogPage({ searchParams }: Props) {
  const { isEnabled: preview } = draftMode()
  const page = Math.max(1, Number(searchParams.page ?? 1) || 1)
  const q = searchParams.q ?? ''
  const topicSlug = searchParams.topic?.trim() ?? ''
  const areaSlug = searchParams.area?.trim() ?? ''

  const [posts, topicTerms, areaTerms] = await Promise.all([
    getBlogPosts({
      perPage: 9,
      page,
      preview,
      topicSlug: topicSlug || null,
      areaSlug: areaSlug || null,
      search: q || null,
    }),
    getBlogTopicTerms(),
    getBlogAreaTerms(),
  ])

  const hasTaxonomies = topicTerms.length > 0 && areaTerms.length > 0

  return (
    <>
      <BlogHubView
        posts={posts}
        page={page}
        locale="es"
        breadcrumbs={[
          { label: 'Inicio', href: '/es/' },
          { label: 'Blog', href: null },
        ]}
        kicker="Perspectivas y guías"
        title="Revista PlayaStays"
        intro="Perspectivas locales, guías para propietarios, el mercado y artículos prácticos sobre administración de propiedades, rentas vacacionales y ser dueño en Playa del Carmen y la Riviera Maya."
        q={q}
        topicSlug={topicSlug}
        areaSlug={areaSlug}
        topicTerms={topicTerms}
        areaTerms={areaTerms}
        hasTaxonomies={hasTaxonomies}
      />

      <CtaStrip
        eyebrow="¿Tienes una propiedad en la Riviera Maya?"
        headline="Obtén un estimado de ingresos gratis — sin compromisos."
        cta={{ label: 'Obtener mi estimado →', href: '/es/publica-tu-propiedad/' }}
      />
    </>
  )
}
