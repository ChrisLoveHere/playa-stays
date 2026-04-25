import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PRIVATE_PREFIXES = ['/admin', '/portal']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  const isPrivate = PRIVATE_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))

  if (isPrivate) {
    // AUTH STUB: When a real auth provider is wired (e.g. NextAuth, Clerk,
    // or a custom JWT/session system), this block should:
    //   1. Check for a valid session cookie / bearer token
    //   2. Verify the user's role (ps_admin vs ps_owner)
    //   3. Redirect unauthenticated users to /login
    //   4. Redirect owners away from /admin (and vice versa if needed)
    //
    // For now, private routes are accessible but explicitly NOT crawled
    // (robots.txt + metadata noindex). The route shells carry auth-required
    // messaging so no sensitive data is exposed without backend integration.

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
