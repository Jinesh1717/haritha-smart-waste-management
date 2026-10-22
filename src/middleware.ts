import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Route Protection Strategy
 * --------------------------
 * Firebase Client SDK does NOT work in Next.js Edge middleware.
 * The reliable approach for this app is:
 *   1. Store a lightweight session marker in a cookie at login time.
 *   2. Middleware reads that cookie to decide whether to allow or redirect.
 *   3. The actual role-based authorization (admin vs collector vs resident)
 *      is enforced client-side by the AuthContext + per-page guards,
 *      because Firestore role lookups require the full client SDK.
 *
 * Cookie name : hks_session
 * Cookie value: "admin" | "collector" | "resident"
 * Set by      : login pages (see /login/admin, /login/staff, /login pages)
 * Cleared by  : logoutUser() in services/auth.ts
 */

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get('hks_session')?.value;

    // ---- /dashboard/** requires "admin" session ----
    if (pathname.startsWith('/dashboard')) {
        if (!sessionCookie || sessionCookie !== 'admin') {
            const loginUrl = new URL('/login/admin', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // ---- /collector requires "collector" session ----
    if (pathname.startsWith('/collector')) {
        if (!sessionCookie || sessionCookie !== 'collector') {
            const loginUrl = new URL('/login/staff', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // ---- /user/** requires any authenticated session ----
    if (pathname.startsWith('/user')) {
        if (!sessionCookie) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/user/:path*', '/collector/:path*'],
};
