import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAuthenticated = !!token
  const role = token?.role as string | undefined
  const isBlocked = token?.is_blocked as boolean | undefined

  // Admin routes
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!isAuthenticated || role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Student protected routes
  const studentRoutes = ['/dashboard', '/notes', '/payment']
  const isStudentRoute = studentRoutes.some((r) => pathname.startsWith(r))

  if (isStudentRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (isBlocked) {
      return NextResponse.redirect(new URL('/login?blocked=1', request.url))
    }
  }

  return NextResponse.next()
}

export default proxy

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/notes/:path*',
    '/payment/:path*',
    '/admin/:path*',
  ],
}
