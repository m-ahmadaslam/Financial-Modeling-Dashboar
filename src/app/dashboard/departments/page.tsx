"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import RouteProtection from "@/components/RouteProtection";
import { 
  BuildingOfficeIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalculatorIcon,
  EyeIcon,
  ArrowRightIcon,
  FolderIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ProjectDraft {
  _id: string;
  projectName: string;
  projectReference: string;
  projectType: string;
  country: string;
  city: string;
  stage: string;
  currentStep: number;
  lastSaved: string;
  status: string;
  formData: Record<string, string>;
  version?: string;
  lifecyclePhase?: string;
  department?: string;
}

// Department Configuration
const DEPARTMENTS = [
  {
    id: 'tender',
    name: 'Tender Department',
    icon: DocumentTextIcon,
    color: 'blue',
    description: 'Project tendering and bidding processes',
    bgGradient: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'equity',
    name: 'Equity Department', 
    icon: CurrencyDollarIcon,
    color: 'green',
    description: 'Equity investments and financial modeling',
    bgGradient: 'from-green-500 to-emerald-600'
  },
  {
    id: 'dc',
    name: 'DC Department',
    icon: BuildingOfficeIcon,
    color: 'purple',
    description: 'Data center and infrastructure projects',
    bgGradient: 'from-purple-500 to-pink-600'
  },
  {
    id: 'neom',
    name: 'NEOM Department',
    icon: ChartBarIcon,
    color: 'orange',
    description: 'NEOM megacity development projects',
    bgGradient: 'from-orange-500 to-red-600'
  }
];

export default function Departments() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDepartment, setActiveDepartment] = useState<string>('all');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects/draft');
      if (response.ok) {
        const data = await response.json();
        const allProjects = data.drafts || [];
        
        // Assign departments to projects based on project type or other criteria
        const projectsWithDepartments = allProjects.map(project => ({
          ...project,
          department: assignDepartmentToProject(project)
        }));
        
        setProjects(projectsWithDepartments);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Smart department assignment logic
  const assignDepartmentToProject = (project: ProjectDraft): string => {
    const projectType = project.projectType?.toLowerCase();
    const projectName = project.projectName?.toLowerCase();
    const stage = project.stage?.toLowerCase();
    
    // NEOM projects (specific to Saudi megacity)
    if (projectName?.includes('neom') || project.country === 'Saudi Arabia' && project.city?.toLowerCase().includes('neom')) {
      return 'neom';
    }
    
    // Data Center projects
    if (projectType === 'dc' || projectName?.includes('data center') || projectName?.includes('infrastructure')) {
      return 'dc';
    }
    
    // Equity/Investment projects
    if (projectType === 'equity' || projectName?.includes('investment') || projectName?.includes('financial')) {
      return 'equity';
    }
    
    // Tender/Bidding projects
    if (stage === 'tender' || stage === 'bidding' || projectName?.includes('tender') || projectName?.includes('bid')) {
      return 'tender';
    }
    
    // Default assignment based on project type
    switch (projectType) {
      case 'solar':
      case 'wind':
      case 'hydro':
        return 'tender'; // Renewable energy projects typically go through tendering
      case 'thermal':
        return 'dc'; // Thermal projects often related to infrastructure
      default:
        return 'tender'; // Default to tender for most projects
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getProjectsByDepartment = (department: string) => {
    if (department === 'all') return projects;
    return projects.filter(project => project.department === department);
  };

  const toggleProjectExpansion = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const getDepartmentIcon = (departmentId: string) => {
    const dept = DEPARTMENTS.find(d => d.id === departmentId);
    return dept ? dept.icon : FolderIcon;
  };

  const getDepartmentColor = (departmentId: string) => {
    const dept = DEPARTMENTS.find(d => d.id === departmentId);
    return dept ? dept.color : 'gray';
  };

  const getDepartmentGradient = (departmentId: string) => {
    const dept = DEPARTMENTS.find(d => d.id === departmentId);
    return dept ? dept.bgGradient : 'from-gray-500 to-gray-600';
  };

  const getAssumptionsSummary = (formData: Record<string, string>) => {
    const keyAssumptions = [
      'projectType', 'country', 'city', 'stage', 'lifecyclePhase',
      'solarCapacity', 'windCapacity', 'projectCost', 'equityRatio',
      'debtRatio', 'irr', 'npv', 'paybackPeriod'
    ];
    
    return keyAssumptions
      .filter(key => formData[key])
      .map(key => ({
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: formData[key]
      }))
      .slice(0, 6); // Show top 6 assumptions
  };

  const filteredProjects = getProjectsByDepartment(activeDepartment);

  return (
    <RouteProtection requireAuth={true}>
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Department Portfolio Management
                  </h1>
                  <p className="text-gray-600 mt-2">Organize and manage projects by department with comprehensive assumptions tracking</p>
                </div>
                <button
                  onClick={() => router.push('/dashboard/new-project')}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                  New Project
                </button>
              </div>
            </div>

            {/* Department Navigation */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                <button
                  onClick={() => setActiveDepartment('all')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeDepartment === 'all'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FolderIcon className="w-4 h-4" />
                  <span>All Departments</span>
                  <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {projects.length}
                  </span>
                </button>
                
                {DEPARTMENTS.map((dept) => {
                  const deptProjects = projects.filter(p => p.department === dept.id);
                  const IconComponent = dept.icon;
                  
                  return (
                    <button
                      key={dept.id}
                      onClick={() => setActiveDepartment(dept.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                        activeDepartment === dept.id
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{dept.name}</span>
                      <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {deptProjects.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Department Overview Cards */}
            {activeDepartment === 'all' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {DEPARTMENTS.map((dept) => {
                  const deptProjects = projects.filter(p => p.department === dept.id);
                  const completedProjects = deptProjects.filter(p => p.status === 'completed');
                  const IconComponent = dept.icon;
                  
                  return (
                    <div key={dept.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                      <div className={`p-6 bg-gradient-to-r ${dept.bgGradient} text-white rounded-t-xl`}>
                        <div className="flex items-center justify-between">
                          <IconComponent className="w-8 h-8" />
                          <span className="text-2xl font-bold">{deptProjects.length}</span>
                        </div>
                        <h3 className="text-lg font-semibold mt-2">{dept.name}</h3>
                        <p className="text-sm opacity-90 mt-1">{dept.description}</p>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Total Projects</p>
                            <p className="font-semibold text-gray-900">{deptProjects.length}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Completed</p>
                            <p className="font-semibold text-green-600">{completedProjects.length}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveDepartment(dept.id)}
                          className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                          View Projects
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Projects Display */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4 shadow-2xl animate-pulse">
                  <BuildingOfficeIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Department Portfolio</h2>
                <p className="text-gray-600">Please wait while we fetch your department projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full mb-4 shadow-2xl">
                  <BuildingOfficeIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No projects in {activeDepartment === 'all' ? 'any department' : DEPARTMENTS.find(d => d.id === activeDepartment)?.name}
                </h2>
                <p className="text-gray-600 mb-6">
                  {activeDepartment === 'all' 
                    ? "Start creating your first department project" 
                    : `No projects assigned to the ${DEPARTMENTS.find(d => d.id === activeDepartment)?.name}`
                  }
                </p>
                <button
                  onClick={() => router.push('/dashboard/new-project')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <BuildingOfficeIcon className="w-5 h-5 mr-2" />
                  Create First Project
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProjects.map((project) => {
                  const isExpanded = expandedProjects.has(project._id);
                  const IconComponent = getDepartmentIcon(project.department || 'tender');
                  const deptColor = getDepartmentColor(project.department || 'tender');
                  const assumptions = getAssumptionsSummary(project.formData);
                  
                  return (
                    <div key={project._id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                      {/* Main Project Card */}
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            {/* Department Icon and Type */}
                            <div className="flex items-center space-x-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-${deptColor}-500`}>
                                <IconComponent className="w-6 h-6" />
                              </div>
                              
                              {/* Department Badge */}
                              <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-${deptColor}-500`}>
                                {DEPARTMENTS.find(d => d.id === project.department)?.name || 'Tender Department'}
                              </div>
                            </div>

                            {/* Project Details */}
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">
                                  {project.projectName || 'Untitled Project'}
                                </h3>
                                
                                {/* Version Badge */}
                                {project.version && (
                                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    v{project.version}
                                  </div>
                                )}
                                
                                {/* Status Badge */}
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  project.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                  project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {project.status}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-gray-500">Ref:</span>
                                  <span className="font-mono text-xs">{project.projectReference}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-gray-500">Type:</span>
                                  <span className="capitalize">{project.projectType}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-gray-500">Location:</span>
                                  <span>{project.country}, {project.city}</span>
                                </div>
                              </div>

                              {/* Key Assumptions Preview */}
                              <div className="grid grid-cols-3 gap-3">
                                {assumptions.slice(0, 3).map((assumption, index) => (
                                  <div key={index} className="bg-gray-50 rounded-lg p-2">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">{assumption.label}</p>
                                    <p className="font-semibold text-gray-900 text-sm">{assumption.value}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 ml-4">
                            {project.status === 'draft' && (
                              <button
                                onClick={() => router.push(`/dashboard/new-project?draft=${project._id}`)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm font-medium"
                              >
                                <CalculatorIcon className="w-4 h-4" />
                                <span>Continue</span>
                              </button>
                            )}
                            
                            {project.status === 'completed' && (
                              <button
                                onClick={() => router.push(`/dashboard/new-project?draft=${project._id}&view=true`)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 text-sm font-medium"
                              >
                                <EyeIcon className="w-4 h-4" />
                                <span>View</span>
                              </button>
                            )}

                            {/* Expand/Collapse Assumptions */}
                            <button
                              onClick={() => toggleProjectExpansion(project._id)}
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-300"
                            >
                              {isExpanded ? (
                                <ArrowRightIcon className="w-4 h-4 rotate-90" />
                              ) : (
                                <ArrowRightIcon className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Assumptions Section */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
                          <div className="p-6">
                            <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center space-x-2">
                              <CalculatorIcon className="w-5 h-5" />
                              <span>Project Assumptions & Financial Data</span>
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {assumptions.map((assumption, index) => (
                                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">{assumption.label}</p>
                                  <p className="font-semibold text-gray-900">{assumption.value}</p>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-4 text-center">
                              <button
                                onClick={() => router.push(`/dashboard/new-project?draft=${project._id}&view=true`)}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                              >
                                <EyeIcon className="w-4 h-4" />
                                <span>View Full Assumptions</span>
                                <ArrowRightIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </RouteProtection>
  );
}
