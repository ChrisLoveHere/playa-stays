import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site-url'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'PlayaStays — Administración de Propiedades | Playa del Carmen & Riviera Maya',
    template: '%s | PlayaStays',
  },
  description:
    'PlayaStays es la empresa líder en administración de rentas vacacionales en Playa del Carmen — equipo local, gestión integral.',
}

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
