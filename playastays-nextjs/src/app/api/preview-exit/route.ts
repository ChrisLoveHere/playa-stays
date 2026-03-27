import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  draftMode().disable()
  const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') ?? '/'
  // Only redirect to same-origin paths
  const safePath = callbackUrl.startsWith('/') ? callbackUrl : '/'
  redirect(safePath)
}
