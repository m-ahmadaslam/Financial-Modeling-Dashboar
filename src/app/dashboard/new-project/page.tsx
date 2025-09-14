"use client";

import { useState, useEffect, Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import RouteProtection from "@/components/RouteProtection";
import ProjectFormContainer from "@/components/ProjectForm/ProjectFormContainer";

function NewProjectContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after a brief delay to ensure proper hydration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <RouteProtection>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </DashboardLayout>
      </RouteProtection>
    );
  }

  return (
    <RouteProtection>
      <DashboardLayout>
        <ProjectFormContainer />
      </DashboardLayout>
    </RouteProtection>
  );
}

export default function NewProject() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewProjectContent />
    </Suspense>
  );
}
