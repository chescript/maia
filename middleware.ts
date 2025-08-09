import { createMiddlewareClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient(request, response)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard']
  const adminPaths = ['/admin']
  const authPaths = ['/login', '/signup']
  
  const { pathname } = request.nextUrl

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path => 
    pathname.startsWith(path)
  )
  const isAdminPath = adminPaths.some(path => 
    pathname.startsWith(path)
  )
  const isAuthPath = authPaths.some(path => 
    pathname === path
  )

  // If user is not authenticated and trying to access protected routes
  if (!session && (isProtectedPath || isAdminPath)) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (session && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Check admin access for admin paths
  if (isAdminPath && session) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}