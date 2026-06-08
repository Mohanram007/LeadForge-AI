import { NextRequest, NextResponse } from 'next/server';

// ─── In-memory rate limiter ───────────────────────────────────────────────────
// Stores: IP → { count, windowStart }
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60;   // 60 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    // New window
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  return false;
}

// ─── Clean up stale entries periodically ─────────────────────────────────────
function cleanupRateLimit() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS * 2) {
      rateLimitMap.delete(ip);
    }
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  // Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // XSS protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",   // Next.js needs these
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://*.supabase.co https://api.openai.com https://maps.googleapis.com",
      "frame-ancestors 'none'",
    ].join('; ')
  );
  return response;
}

// ─── Proxy (formerly middleware) ─────────────────────────────────────────────
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Periodically clean map (rough approximation, every ~200 requests)
  if (Math.random() < 0.005) cleanupRateLimit();

  // ── 1. Block suspicious path traversal / injection patterns ──────────────
  const suspiciousPatterns = [
    /\.\.\//,           // Path traversal
    /<script/i,         // XSS attempts in URL
    /javascript:/i,     // JS protocol
    /on\w+\s*=/i,       // Event handler injection
    /union.*select/i,   // SQL injection
    /exec\s*\(/i,       // SQL exec
    /%00/,              // Null byte
    /\x00/,             // Null byte literal
  ];
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(pathname) || pattern.test(request.url)) {
      return new NextResponse('Bad Request', { status: 400 });
    }
  }

  // ── 2. Rate limit all /api/* routes ──────────────────────────────────────
  if (pathname.startsWith('/api/')) {
    const ip = getClientIP(request);
    if (isRateLimited(ip)) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please slow down.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }

    // Block overly large request bodies (guard against DoS)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 1_048_576) {
      // 1 MB limit
      return new NextResponse(
        JSON.stringify({ error: 'Request body too large.' }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Block API requests with unexpected content types for mutations
    const method = request.method;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      const contentType = request.headers.get('content-type') ?? '';
      if (!contentType.includes('application/json') && !contentType.includes('multipart/form-data')) {
        return new NextResponse(
          JSON.stringify({ error: 'Unsupported content type.' }),
          { status: 415, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // ── 3. Build response and attach security headers ─────────────────────────
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

// ─── Matcher ─────────────────────────────────────────────────────────────────
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
