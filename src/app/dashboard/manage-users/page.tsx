"use client";

import RouteProtection from "@/components/RouteProtection";
import DashboardLayout from "@/components/DashboardLayout";

export default function ManageUsers() {
  return (
    <RouteProtection requireAuth={true}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Users</h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600">User accounts and permissions will be managed here</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RouteProtection>
  );
}
