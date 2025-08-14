// src/middleware.ts
// Security middleware for CSRF protection and security headers

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // CSRF Protection for POST requests
  if (request.method === 'POST') {
    const csrfToken = request.headers.get('X-CSRF-Token');
    const sessionToken = request.cookies.get('csrf-token')?.value;

    // For now, we'll just check if the token exists
    // In a real implementation, you'd validate against stored tokens
    if (!csrfToken || !sessionToken) {
      return new NextResponse(
        JSON.stringify({ error: 'CSRF token missing or invalid' }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(response.headers.entries())
          }
        }
      );
    }
  }

  // Rate limiting headers
  response.headers.set('X-RateLimit-Limit', '100');
  response.headers.set('X-RateLimit-Remaining', '99'); // This would be dynamic in real implementation

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
