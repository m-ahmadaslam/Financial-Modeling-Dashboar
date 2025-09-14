import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Define protected routes
    const protectedRoutes = [
      "/dashboard",
      "/dashboard/new-project",
      "/dashboard/projects",
      "/dashboard/charts",
      "/dashboard/assumptions",
      "/dashboard/manage-users",
      "/dashboard/manage-authorization"
    ];

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    );

    // If accessing a protected route without authentication
    if (isProtectedRoute && !token) {
      const url = new URL("/auth/signin", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // If authenticated user tries to access auth pages, redirect to dashboard
    if (token && (pathname === "/auth/signin" || pathname === "/auth/signup")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => {
        // Allow all requests to pass through, we'll handle auth logic above
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
