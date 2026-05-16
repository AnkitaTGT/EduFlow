import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";

  // Public paths
  if (pathname === '/login' || pathname === '/') {
    return NextResponse.next();
  }

  // Basic mock check: simulate session cookie or rely on client-side redirect if not present.
  // In a real app using App Router, we'd verify the Firebase ID token or session cookie here.
  const session = request.cookies.get('session');

  if (!session && !useMock) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Simplified role check for mock - relies heavily on client side since edge environment
  // can't run full firebase-admin easily without separate API routes.
  // We will handle specific sub-route protections inside the layout/page components.

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
