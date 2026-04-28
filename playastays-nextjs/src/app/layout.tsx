import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { draftMode } from 'next/headers'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { SITE_URL } from '@/lib/site-url'
import { getCitiesForNavigation, getSiteConfig } from '@/lib/wordpress'
import { AppChrome } from '@/components/layout/AppChrome'
import { HtmlLang } from '@/components/layout/HtmlLang'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'PlayaStays — Vacation Rental Management | Playa del Carmen & Riviera Maya',
    template: '%s | PlayaStays',
  },
  description:
    "PlayaStays is Playa del Carmen's leading vacation rental management company — local team, full-service Airbnb & rental management.",
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isPreview } = draftMode()
  const [cities, config] = await Promise.all([getCitiesForNavigation(), getSiteConfig()])

  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className={isPreview ? 'has-draft-preview' : undefined} suppressHydrationWarning>
        <HtmlLang />
        <AppChrome cities={cities} config={config} isPreview={isPreview}>
          {children}
        </AppChrome>
        <SpeedInsights />
      </body>
    </html>
  )
}
