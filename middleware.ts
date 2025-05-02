import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from './lib/jwt';
 
export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  if (['/home'].includes(pathname)) {
    const sessionToken = request.cookies.get('session')?.value;
    if (!sessionToken || verifyJWT(sessionToken, (globalThis as unknown as Global).publicKey) === null) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  } else if (['/sign-in', '/sign-up', '/password-reset'].includes(pathname)) {
    const sessionToken = request.cookies.get('session')?.value;
    if (sessionToken && verifyJWT(sessionToken, (globalThis as unknown as Global).publicKey) !== null) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }
  const response = NextResponse.next()
  return response
}