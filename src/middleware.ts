import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle video files
  const videoExtRe = /\.(mp4|webm|ogg)$/;
  if (videoExtRe.exec(request.nextUrl.pathname)) {
    const response = NextResponse.next();
    
    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Range');
    
    // Add video-specific headers
    response.headers.set('Accept-Ranges', 'bytes');
    
    if (request.nextUrl.pathname.endsWith('.mp4')) {
      response.headers.set('Content-Type', 'video/mp4');
    } else if (request.nextUrl.pathname.endsWith('.webm')) {
      response.headers.set('Content-Type', 'video/webm');
    }
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/projects/:path*\\.(mp4|webm|ogg)',
  ],
};
