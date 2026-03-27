import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Note: In Next.js App Router, Firebase Client Auth doesn't work perfectly in edge middleware 
// without relying on cookies. For full protection, we should use Firebase Admin to verify cookies, 
// or protect via client-side components using AuthContext.
// This is a basic middleware to check for a generic session cookie or direct to public/login.
// For true Firebase verifyIdToken, we would need to pass ID tokens to cookies.

export function middleware(request: NextRequest) {
    // In a real app, you would verify a session cookie here.
    // Example placeholder for cookie check:
    // const session = request.cookies.get('session');

    // if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    //   return NextResponse.redirect(new URL('/login/admin', request.url));
    // }

    // if (!session && request.nextUrl.pathname.startsWith('/user')) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/dashboard/:path*', '/user/:path*', '/admin/:path*'],
};
