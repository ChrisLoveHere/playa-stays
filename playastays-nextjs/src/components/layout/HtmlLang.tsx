'use client'

import { useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import { localeFromPath } from '@/lib/i18n'

/** Keeps <html lang> aligned with the active route (ES vs EN). Root layout uses suppressHydrationWarning on <html>. */
export function HtmlLang() {
  const pathname = usePathname() ?? '/'
  const lang = localeFromPath(pathname) === 'es' ? 'es' : 'en'

  useLayoutEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return null
}
