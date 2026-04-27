import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PRIVATE_PREFIXES = ['/admin', '/portal']

const WWW_AUTHENTICATE = 'Basic realm="PlayaStays Admin"'

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

function privateErrorResponse(
  status: number,
  body: string,
  extraHeaders?: Record<string, string>
): NextResponse {
  const headers = new Headers({
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Robots-Tag': 'noindex, nofollow',
    'Cache-Control': 'private, no-store',
    ...extraHeaders,
  })
  return new NextResponse(body, { status, headers })
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  const isPrivate = PRIVATE_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))

  if (isPrivate) {
    const expectedUser = (process.env.ADMIN_BASIC_AUTH_USER ?? '').trim()
    const expectedPassword = (process.env.ADMIN_BASIC_AUTH_PASSWORD ?? '').trim()

    if (!expectedUser || !expectedPassword) {
      return privateErrorResponse(
        503,
        'Service Unavailable: admin auth not configured'
      )
    }

    const authHeader = request.headers.get('authorization') ?? ''

    if (!authHeader.startsWith('Basic ')) {
      return privateErrorResponse(401, 'Unauthorized', {
        'WWW-Authenticate': WWW_AUTHENTICATE,
      })
    }

    const b64 = authHeader.slice(6).trim()
    let decoded: string
    try {
      decoded = atob(b64)
    } catch {
      return privateErrorResponse(401, 'Unauthorized', {
        'WWW-Authenticate': WWW_AUTHENTICATE,
      })
    }

    const colonIdx = decoded.indexOf(':')
    const givenUser = colonIdx === -1 ? decoded : decoded.slice(0, colonIdx)
    const givenPassword = colonIdx === -1 ? '' : decoded.slice(colonIdx + 1)

    if (!timingSafeEqual(givenUser, expectedUser) || !timingSafeEqual(givenPassword, expectedPassword)) {
      return privateErrorResponse(401, 'Unauthorized', {
        'WWW-Authenticate': WWW_AUTHENTICATE,
      })
    }

    requestHeaders.set('x-ps-private', '1')

    const response = NextResponse.next({ request: { headers: requestHeaders } })
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
