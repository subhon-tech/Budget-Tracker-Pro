import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Cookie names used by NextAuth
const AUTH_COOKIES = [
    'next-auth.session-token',
    '__Secure-next-auth.session-token',
    'next-auth.csrf-token',
    '__Secure-next-auth.csrf-token',
    'next-auth.callback-url',
    '__Secure-next-auth.callback-url',
    '__Host-next-auth.csrf-token',
]

// Max safe cookie header size (in bytes). Node default is 8KB; we set 6KB as our threshold.
const MAX_COOKIE_SIZE = 6000

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
    '/login',
    '/signup',
    '/pricing',
    '/payment-success',
    '/api',
    '/_next',
]

function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some(route => pathname.startsWith(route)) || pathname.includes('.')
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Step 1: Check total cookie header size
    const cookieHeader = request.headers.get('cookie') || ''

    if (cookieHeader.length > MAX_COOKIE_SIZE) {
        // The cookie header is too large — clear all auth cookies and redirect to login
        const loginUrl = new URL('/login', request.url)
        const response = NextResponse.redirect(loginUrl)

        // Delete all known auth cookies
        for (const name of AUTH_COOKIES) {
            response.cookies.delete(name)
        }

        // Also try to delete any cookie that looks like a session token
        const allCookies = request.cookies.getAll()
        for (const cookie of allCookies) {
            if (cookie.name.includes('next-auth') || cookie.name.includes('session')) {
                response.cookies.delete(cookie.name)
            }
        }

        return response
    }

    // Step 2: Allow public routes without auth check
    if (isPublicRoute(pathname)) {
        return NextResponse.next()
    }

    // Step 3: Check authentication for protected routes
    try {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        })

        if (!token) {
            const loginUrl = new URL('/login', request.url)
            return NextResponse.redirect(loginUrl)
        }
    } catch (error) {
        // If token parsing fails (e.g. corrupted cookie), clear cookies and redirect
        const loginUrl = new URL('/login', request.url)
        const response = NextResponse.redirect(loginUrl)

        for (const name of AUTH_COOKIES) {
            response.cookies.delete(name)
        }

        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
