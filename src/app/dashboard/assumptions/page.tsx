"use client";

import { useState, useEffect } from "react";
import RouteProtection from "@/components/RouteProtection";
import DashboardLayout from "@/components/DashboardLayout";

export default function Assumptions() {
  const [currentProject, setCurrentProject] = useState<{
    name: string;
    version: string;
    reference: string;
  } | null>(null);

  const [availableProjects, setAvailableProjects] = useState<Array<{
    name: string;
    version: string;
    reference: string;
  }>>([]);

  // Simulate getting current project from context or localStorage
  useEffect(() => {
    // For now, we'll simulate this - in a real app, this would come from context or API
    const savedProject = localStorage.getItem('currentProject');
    if (savedProject) {
      try {
        setCurrentProject(JSON.parse(savedProject));
      } catch (error) {
        console.error('Error parsing saved project:', error);
      }
    }

    // Simulate available projects (in real app, this would come from API)
    const demoProjects = [
      {
        name: "Solar Farm Project Alpha",
        version: "1.0.0",
        reference: "SOLAR-001"
      },
      {
        name: "Wind Energy Project Beta",
        version: "2.1.0",
        reference: "WIND-002"
      },
      {
        name: "Hydroelectric Project Gamma",
        version: "1.5.2",
        reference: "HYDRO-003"
      }
    ];
    setAvailableProjects(demoProjects);
  }, []);

  const handleProjectChange = (projectIndex: number) => {
    if (projectIndex === -1) {
      setCurrentProject(null);
      localStorage.removeItem('currentProject');
    } else {
      const selectedProject = availableProjects[projectIndex];
      setCurrentProject(selectedProject);
      localStorage.setItem('currentProject', JSON.stringify(selectedProject));
    }
  };

  return (
    <RouteProtection requireAuth={true}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Project Selector */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Select Project</h2>
              <span className="text-sm text-gray-500">Choose a project to work on</span>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={currentProject ? availableProjects.findIndex(p => p.reference === currentProject.reference) : -1}
                onChange={(e) => handleProjectChange(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value={-1}>-- Select a Project --</option>
                {availableProjects.map((project, index) => (
                  <option key={project.reference} value={index}>
                    {project.name} (v{project.version}) - {project.reference}
                  </option>
                ))}
              </select>
              {currentProject && (
                <button
                  onClick={() => handleProjectChange(-1)}
                  className="px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          {/* Project Version Header */}
          {currentProject && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <span className="text-xl">📋</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentProject.name}
                    </h2>
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <span>Ref: {currentProject.reference}</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        Version {currentProject.version}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Working on assumptions for this project version</p>
                </div>
              </div>
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-6">Financial Assumptions</h1>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Assumptions Management</h3>
              <p className="text-gray-600">Financial assumptions and parameters will be managed here</p>
              
              {!currentProject && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    No active project selected. Please select a project to view and manage its assumptions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RouteProtection>
  );
}
