import { withAuth } from 'next-auth/middleware'

/**
 * Authentication Middleware
 * 
 * Protects routes by requiring valid authentication tokens.
 * Excludes public assets and authentication endpoints from protection.
 * 
 * Protected routes include:
 * - All pages except auth pages
 * - API routes except auth endpoints
 * 
 * Excluded from protection:
 * - Authentication API routes (/api/auth/*)
 * - Sign-in pages (/auth/*)
 * - Next.js static assets (_next/static, _next/image)
 * - Image files (.png, .jpg, .svg, etc.)
 * - Favicon and other static assets
 */
export default withAuth(
  function middleware() {
    // Custom middleware logic can be added here
    // Currently passes through all authenticated requests
  },
  {
    callbacks: {
      /**
       * Authorization callback - determines if user can access protected routes
       * @param token - JWT token from NextAuth session
       * @returns true if user has valid token, false otherwise
       */
      authorized: ({ token }) => !!token,
    },
  }
)

/**
 * Middleware Configuration
 * 
 * Defines which routes should be protected by authentication.
 * Uses negative lookahead regex to exclude specific paths from authentication.
 */
export const config = {
  matcher: [
    // Protect all routes except:
    // - /api/auth/* (NextAuth endpoints)
    // - /auth/* (sign-in pages)  
    // - /_next/static/* (Next.js static files)
    // - /_next/image/* (Next.js image optimization)
    // - /favicon.ico
    // - Image files (.png, .jpg, .jpeg, .svg, .gif, .ico)
    '/((?!api/auth|auth|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.gif|.*\\.ico).*)',
  ]
}