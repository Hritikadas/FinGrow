import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge } from '@/lib/auth-edge';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Try to get token from cookie first, then from Authorization header
  let token = request.cookies.get('token')?.value;
  
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isProtectedPage = pathname.startsWith('/dashboard') ||
                          pathname.startsWith('/bundles') ||
                          pathname.startsWith('/simulation') ||
                          pathname.startsWith('/history') ||
                          pathname.startsWith('/chatbot') ||
                          pathname.startsWith('/settings');

  // Validate token
  let isAuthenticated = false;
  if (token) {
    try {
      const verified = await verifyTokenEdge(token);
      isAuthenticated = verified !== null;
      console.log('Middleware: Token verification', { 
        pathname, 
        hasToken: true, 
        tokenLength: token.length,
        isAuthenticated,
        userId: verified?.userId
      });
    } catch (error) {
      console.error('Middleware: Token verification error', { pathname, error });
      isAuthenticated = false;
    }
  } else {
    console.log('Middleware: No token found', { 
      pathname,
      cookies: request.cookies.getAll().map(c => c.name)
    });
  }

  // Redirect to login if accessing protected page without valid token
  if (isProtectedPage && !isAuthenticated) {
    console.log('Middleware: Redirecting to login (no auth)', { pathname });
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing auth pages with valid token
  if (isAuthPage && isAuthenticated) {
    console.log('Middleware: Redirecting to dashboard (already auth)', { pathname });
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  // Pass through with response
  const response = NextResponse.next();
  
  // Add debug header
  response.headers.set('x-middleware-auth', isAuthenticated ? 'true' : 'false');
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
