import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'bn'] as const
const defaultLocale = 'en' as const

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    )
  }
}

export const config = {
  // FIX: Ensure sw.js, manifest.json, and images are NOT intercepted by middleware
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json|icon.png).*)'],
}