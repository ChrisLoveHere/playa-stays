// ============================================================
// /es/blog/page.tsx  →  https://www.playastays.com/es/blog/
// Spanish blog index. Renders ES title/excerpt from post meta
// when available; falls back to EN content.
// ============================================================

import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { getBlogPosts } from '@/lib/wordpress'
import { buildMetadata } from '@/lib/seo'
import { EsBlogCard } from '@/components/content/Cards'
import { Hero } from '@/components/hero/Hero'
import { CtaStrip } from '@/components/sections'

export const revalidate = 3600

export const metadata: Metadata = buildMetadata({
  title: 'Blog de Administración de Propiedades | PlayaStays',
  description: 'Estrategias de Airbnb, guías de inversión, datos de mercado y consejos operativos para propietarios en la Riviera Maya.',
  canonical: 'https://www.playastays.com/es/blog/',
  hreflangEn: 'https://www.playastays.com/blog/',
})

interface Props {
  searchParams: { page?: string }
}

export default async function EsBlogPage({ searchParams }: Props) {
  const { isEnabled: preview } = draftMode()
  const page = Number(searchParams.page ?? 1)

  const posts = await getBlogPosts({ perPage: 9, page, preview })

  return (
    <>
      <Hero
        variant="centred"
        breadcrumbs={[
          { label: 'Inicio', href: '/es/' },
          { label: 'Blog', href: null },
        ]}
        tag="Información para Propietarios"
        headline="Conocimiento de gestión de rentas,<br /><em>directo desde Playa del Carmen</em>"
        sub="Estrategias de Airbnb, guías de inversión, datos de mercado y consejos operativos para propietarios en la Riviera Maya."
        primaryCta={{ label: 'Obtener estimado gratis', href: '/es/publica-tu-propiedad/' }}
      />

      <section className="pad-lg bg-ivory">
        <div className="container">
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--light)' }}>
              Aún no hay artículos. Vuelve pronto.
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map(p => <EsBlogCard key={p.id} post={p} />)}
            </div>
          )}

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 48 }}>
            {page > 1 && (
              <Link href={`/es/blog/?page=${page - 1}`} className="btn btn-ghost btn-sm">
                ← Anterior
              </Link>
            )}
            {posts.length === 9 && (
              <Link href={`/es/blog/?page=${page + 1}`} className="btn btn-ghost btn-sm">
                Siguiente →
              </Link>
            )}
          </div>
        </div>
      </section>

      <CtaStrip
        eyebrow="¿Tienes una propiedad en la Riviera Maya?"
        headline="Obtén un estimado de ingresos gratis — sin compromisos."
        cta={{ label: 'Obtener mi estimado →', href: '/es/publica-tu-propiedad/' }}
      />
    </>
  )
}
