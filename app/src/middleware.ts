import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authMiddleware } from './features/authentication/middlewares/authMiddleware'

export function middleware(request: NextRequest) {
  const authResponse = authMiddleware(request)
  if (authResponse) {
    return authResponse
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.svg (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.svg).*)',
  ],
}