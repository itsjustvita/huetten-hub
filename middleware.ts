import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  console.log(
    'Middleware: Path:',
    request.nextUrl.pathname,
    'Token:',
    token ? 'exists' : 'not found'
  );

  if (!token && !request.nextUrl.pathname.startsWith('/login')) {
    console.log('Middleware: Redirecting to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jose.jwtVerify(token, secret);
      console.log('Middleware: Token verified');
      if (request.nextUrl.pathname === '/login') {
        console.log('Middleware: Redirecting to /dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.log('Middleware: Token verification failed', error);
      if (!request.nextUrl.pathname.startsWith('/login')) {
        console.log('Middleware: Redirecting to /login due to invalid token');
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  console.log('Middleware: Allowing request to proceed');
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
