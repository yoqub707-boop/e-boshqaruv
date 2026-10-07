// E-Boshqaruv - Next.js Middleware
// Autentifikatsiya va routelarni himoyalash

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Himoyalanmagan yo'llar (login, public)
const PUBLIC_PATHS = ['/login', '/api/auth/login'];

// Statik fayllar va API uchun middleware ishlamasligi kerak
const IGNORED_PATHS = ['/_next', '/favicon.ico', '/images', '/api/health'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Statik fayllarni o'tkazib yuborish
  if (IGNORED_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Ochiq yo'llarni o'tkazib yuborish
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Auth tokenni tekshirish
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // Token yo'q - login sahifasiga yo'naltirish
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token mavjud - davom ettirish
  // (JWT tekshiruvi API route/server component da amalga oshiriladi)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Quyidagi yo'llardan boshqa barcha yo'llar uchun middleware ishlaydi:
     * - api (API routes)
     * - _next/static (statik fayllar)
     * - _next/image (rasm optimizatsiyasi)
     * - favicon.ico (favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
