import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    const isAuthenticated = !!token;

    const publicRoutes = ['/login', '/signup'];
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isAuthenticated) {
      if (isPublicRoute) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return NextResponse.next();
    }

    if (!isAuthenticated) {
      if (!isPublicRoute) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};