// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

const flightRoutes = createRouteMatcher([
  '/api/flight/(.*)',
  '/flight/(.*)'
]);

const hotelRoutes = createRouteMatcher([
  '/api/hotel/(.*)',
  '/hotel/(.*)'
]);

const carRoutes = createRouteMatcher([
  '/api/car/(.*)',
  '/car/(.*)'
]);

async function checkServiceStatus(
  service: 'flight' | 'hotel' | 'car',
  req: Request
): Promise<NextResponse | null> {
  try {
    const url = new URL(req.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    
    // Check service status
    const response = await fetch(`${baseUrl}/api/config/service-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ service }),
    });

    if (!response.ok) {
      return new NextResponse(
        JSON.stringify({
          error: `${service} service is currently disabled`,
          code: 'SERVICE_DISABLED'
        }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check provider if specified
    const providerId = new URL(req.url).searchParams.get('providerId');
    if (providerId) {
      const providerResponse = await fetch(`${baseUrl}/api/config/provider-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ service, providerId }),
      });

      if (!providerResponse.ok) {
        return new NextResponse(
          JSON.stringify({
            error: `Requested provider is not available`,
            code: 'PROVIDER_DISABLED'
          }),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    return null;
  } catch (error) {
    console.error('Service check error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Service check failed' }),
      { status: 500 }
    );
  }
}

export default clerkMiddleware(async (auth, req) => {
  // Protect dashboard routes
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Check service availability
  if (flightRoutes(req)) {
    const serviceCheck = await checkServiceStatus('flight', req);
    if (serviceCheck) return serviceCheck;
  }
  
  if (hotelRoutes(req)) {
    const serviceCheck = await checkServiceStatus('hotel', req);
    if (serviceCheck) return serviceCheck;
  }
  
  if (carRoutes(req)) {
    const serviceCheck = await checkServiceStatus('car', req);
    if (serviceCheck) return serviceCheck;
  }
});

export const config = {
  matcher: [
    // Skip files
    '/((?!.*\\..*))',
    // Skip Next.js internals
    '/((?!_next).)*',
    // Include API routes
    '/api/:path*',
    // Include auth routes
    '/sign-in:path*',
    '/sign-up:path*',
    // Include app routes
    '/dashboard/:path*',
    '/flight/:path*',
    '/hotel/:path*',
    '/car/:path*',
  ]
};