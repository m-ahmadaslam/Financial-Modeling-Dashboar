"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";

interface RouteProtectionProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function RouteProtection({
  children,
  requireAuth = true,
  allowedRoles = [],
  redirectTo = "/auth/signin"
}: RouteProtectionProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a session
        const currentSession = await getSession() as Session | null;
        
        if (requireAuth) {
          // If authentication is required but user is not authenticated
          if (!currentSession || !isAuthenticated) {
            // Store the intended destination for redirect after login
            if (pathname !== "/auth/signin" && pathname !== "/auth/signup") {
              sessionStorage.setItem("redirectAfterLogin", pathname);
            }
            router.push(redirectTo);
            return;
          }

          // If roles are specified, check if user has required role
          if (allowedRoles.length > 0 && currentSession?.user?.role) {
            const userRole = currentSession.user.role;
            if (!allowedRoles.includes(userRole)) {
              // User doesn't have required role, redirect to unauthorized page
              router.push("/unauthorized");
              return;
            }
          }
        } else {
          // If authentication is not required but user is authenticated
          // and trying to access auth pages, redirect to dashboard
          if (isAuthenticated && (pathname === "/auth/signin" || pathname === "/auth/signup")) {
            const redirectPath = sessionStorage.getItem("redirectAfterLogin") || "/dashboard";
            sessionStorage.removeItem("redirectAfterLogin");
            router.push(redirectPath);
            return;
          }
        }

        setIsChecking(false);
      } catch (error) {
        console.error("Auth check error:", error);
        if (requireAuth) {
          router.push(redirectTo);
        }
        setIsChecking(false);
      }
    };

    if (!loading) {
      checkAuth();
    }
  }, [isAuthenticated, loading, requireAuth, allowedRoles, redirectTo, router, pathname]);

  // Show loading spinner while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-white/20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4 shadow-2xl animate-pulse">
            <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Access</h2>
          <p className="text-gray-700 font-medium">Please wait while we check your credentials...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated, don't render children
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If authentication is not required but user is authenticated and trying to access auth pages
  if (!requireAuth && isAuthenticated && (pathname === "/auth/signin" || pathname === "/auth/signup")) {
    return null;
  }

  return <>{children}</>;
}
