import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from './lib/jwt';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  if (['/home'].includes(pathname)) {
    const sessionToken = request.cookies.get('session')?.value || '';
    console.log(process.env.JWT_PUBLIC_KEY);
    const { valid } = await verifyJWT(sessionToken, process.env.JWT_PUBLIC_KEY || '');
    if (!valid) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  } else if (['/sign-in', '/sign-up', '/password-reset'].includes(pathname)) {
    const sessionToken = request.cookies.get('session')?.value || '';
    const { valid } = await verifyJWT(sessionToken, process.env.JWT_PUBLIC_KEY || '');
    if (valid) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }
  const response = NextResponse.next()
  return response
}