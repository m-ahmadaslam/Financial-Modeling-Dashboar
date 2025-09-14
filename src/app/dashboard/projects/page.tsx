"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import RouteProtection from "@/components/RouteProtection";
import LifecycleVersionHistory from "@/components/LifecycleVersionHistory";
import ProjectVersionManagement from "@/components/ProjectVersionManagement";
import VersionSelectionModal from "@/components/VersionSelectionModal";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
  MapPinIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FolderIcon,
  CogIcon,
  WrenchScrewdriverIcon,
  CalculatorIcon,
  PresentationChartLineIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  ChartBarIcon
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
  parentProjectId?: string;
  isLatestVersion?: boolean;
}

// Enterprise Project Lifecycle Phases
const LIFECYCLE_PHASES = [
  { 
    id: 'estimation', 
    name: 'Estimation', 
    icon: CalculatorIcon, 
    color: 'blue',
    description: 'Initial project assessment and cost estimation'
  },
  { 
    id: 'awarded', 
    name: 'Awarded', 
    icon: CheckCircleIcon, 
    color: 'green',
    description: 'Project has been awarded and contract signed'
  },
  { 
    id: 'post_award', 
    name: 'Post Award', 
    icon: DocumentTextIcon, 
    color: 'purple',
    description: 'Post-award planning and preparation phase'
  },
  { 
    id: 'rev_0', 
    name: 'Rev 0', 
    icon: ChartBarIcon, 
    color: 'orange',
    description: 'Initial revision and baseline establishment'
  },
  { 
    id: 'execution', 
    name: 'Execution', 
    icon: CogIcon, 
    color: 'indigo',
    description: 'Active project execution and implementation'
  },
  { 
    id: 'operation_maintenance', 
    name: 'Operation & Maintenance', 
    icon: WrenchScrewdriverIcon, 
    color: 'teal',
    description: 'Operational phase and ongoing maintenance'
  },
  { 
    id: 'closing', 
    name: 'Closing', 
    icon: PresentationChartLineIcon, 
    color: 'red',
    description: 'Project closure and final deliverables'
  }
];

export default function Projects() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectDraft[]>([]);
  const [allProjects, setAllProjects] = useState<ProjectDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'phases' | 'versions'>('phases');
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [versionLoading, setVersionLoading] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects/draft');
      if (response.ok) {
        const data = await response.json();
        const allProjectsData = data.drafts || [];
        
        // Store all projects for version history
        setAllProjects(allProjectsData);
        
        // Process projects to group by parent project and determine latest versions
        const processedProjects = processProjectsForVersions(allProjectsData);
        setProjects(processedProjects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const processProjectsForVersions = (allProjects: ProjectDraft[]): ProjectDraft[] => {
    // Group projects by projectReference (assuming this is the unique identifier)
    const projectGroups = new Map<string, ProjectDraft[]>();
    
    allProjects.forEach(project => {
      const key = project.projectReference || project._id;
      if (!projectGroups.has(key)) {
        projectGroups.set(key, []);
      }
      projectGroups.get(key)!.push(project);
    });

    // Process each group to determine latest versions and parent relationships
    const processedProjects: ProjectDraft[] = [];
    
    projectGroups.forEach((groupProjects, key) => {
      // Sort by version number or creation date
      const sortedProjects = groupProjects.sort((a, b) => {
        const versionA = parseFloat(a.version || '0');
        const versionB = parseFloat(b.version || '0');
        return versionB - versionA; // Latest first
      });

      // Only add the latest version to the main list
      if (sortedProjects.length > 0) {
        const latestProject = {
          ...sortedProjects[0],
          isLatestVersion: true,
          parentProjectId: key,
          totalVersions: sortedProjects.length
        };
        processedProjects.push(latestProject);
      }
    });

    return processedProjects;
  };

  // Helper function to check if a project should show the "New Version" button
  const shouldShowNewVersionButton = (project: ProjectDraft): boolean => {
    // Only show for completed projects
    if (project.status !== 'completed') return false;
    
    // Get all versions of this project
    const projectVersions = getAllProjectVersions(project.projectReference);
    
    // Find the latest completed version
    const latestCompletedVersion = projectVersions
      .filter(p => p.status === 'completed')
      .sort((a, b) => parseFloat(b.version || '0') - parseFloat(a.version || '0'))[0];
    
    // Show button if this is the latest completed version
    return latestCompletedVersion && latestCompletedVersion._id === project._id;
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
    
    try {
      setDeleteLoading(projectId);
      const response = await fetch(`/api/projects/draft?projectId=${projectId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchProjects(); // Refresh the list to update version counts and latest version status
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCreateVersion = async (parentProject: ProjectDraft) => {
    try {
      setVersionLoading(parentProject._id);
      
      // Get the next version number
      const nextVersion = getNextVersion(parentProject.version || '0');
      
      // Create a new version based on the parent project
      const newVersionData = {
        formData: {
          ...parentProject.formData,
          version: nextVersion
        },
        currentStep: 0,
        status: 'draft',
        version: nextVersion,
        parentProjectId: parentProject.parentProjectId || parentProject._id
      };

      const response = await fetch('/api/projects/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVersionData)
      });

      if (response.ok) {
        // Navigate to the new project form with the new draft
        const result = await response.json();
        if (result.projectId) {
          router.push(`/dashboard/new-project?draft=${result.projectId}`);
        }
        await fetchProjects(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating new version:', error);
    } finally {
      setVersionLoading(null);
    }
  };

  const handleCreateVersionFromData = async (versionData: any) => {
    try {
      setVersionLoading(versionData.parentProjectId);
      
      const response = await fetch('/api/projects/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(versionData)
      });

      if (response.ok) {
        // Navigate to the new project form with the new draft
        const result = await response.json();
        if (result.projectId) {
          router.push(`/dashboard/new-project?draft=${result.projectId}`);
        }
        await fetchProjects(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating new version from data:', error);
    } finally {
      setVersionLoading(null);
    }
  };

  // Add version selection modal state
  const [showVersionSelectionModal, setShowVersionSelectionModal] = useState(false);
  const [selectedProjectForVersion, setSelectedProjectForVersion] = useState<ProjectDraft | null>(null);

  const handleOpenVersionSelection = (project: ProjectDraft) => {
    setSelectedProjectForVersion(project);
    setShowVersionSelectionModal(true);
  };

  const handleVersionSelect = (versionId: string, versionNumber: string) => {
    if (selectedProjectForVersion) {
      if (versionId === 'start-fresh') {
        // Create new version from scratch
        const freshVersionData = {
          formData: {}, // Empty form data
          currentStep: 0,
          status: 'draft',
          version: getNextVersion(selectedProjectForVersion.version || '0'),
          parentProjectId: selectedProjectForVersion.parentProjectId || selectedProjectForVersion._id,
          projectName: selectedProjectForVersion.projectName,
          projectReference: selectedProjectForVersion.projectReference,
          projectType: selectedProjectForVersion.projectType,
          country: selectedProjectForVersion.country,
          city: selectedProjectForVersion.city,
          stage: selectedProjectForVersion.stage,
          lifecyclePhase: selectedProjectForVersion.lifecyclePhase
        };
        
        // Create the new version
        handleCreateVersionFromData(freshVersionData);
        setShowVersionSelectionModal(false);
        setSelectedProjectForVersion(null);
      } else {
        // Find the selected version from all projects
        const selectedVersion = allProjects.find(v => v._id === versionId);
        if (selectedVersion) {
          // Create new version based on selected version
          handleCreateVersion(selectedVersion);
          setShowVersionSelectionModal(false);
          setSelectedProjectForVersion(null);
        }
      }
    }
  };

  const handleDeleteVersion = async (versionId: string) => {
    if (!confirm('Are you sure you want to delete this version? This action cannot be undone.')) return;
    
    try {
      setDeleteLoading(versionId);
      const response = await fetch(`/api/projects/draft?projectId=${versionId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchProjects(); // Refresh the list to update version counts and latest version status
      }
    } catch (error) {
      console.error('Error deleting version:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const getNextVersion = (currentVersion: string): string => {
    const versionNum = parseFloat(currentVersion);
    return (versionNum + 0.1).toFixed(1);
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

  const getProjectsByPhase = (phase: string) => {
    if (phase === 'all') return projects;
    return projects.filter(project => project.lifecyclePhase === phase);
  };

  const getAllProjectVersions = (projectReference: string) => {
    // Get all projects from the original data, not the processed list
    return allProjects.filter(project => 
      project.projectReference === projectReference
    ).sort((a, b) => parseFloat(b.version || '0') - parseFloat(a.version || '0'));
  };



  const getPhaseIcon = (phaseId: string) => {
    const phase = LIFECYCLE_PHASES.find(p => p.id === phaseId);
    return phase ? phase.icon : DocumentTextIcon;
  };

  const getPhaseColor = (phaseId: string) => {
    const phase = LIFECYCLE_PHASES.find(p => p.id === phaseId);
    return phase ? phase.color : 'gray';
  };

  const filteredProjects = getProjectsByPhase(activePhase);

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
                    Enterprise Project Portfolio
                  </h1>
                  <p className="text-gray-600 mt-2">Manage your financial modeling projects across all lifecycle phases</p>
                </div>
                <button
                  onClick={() => router.push('/dashboard/new-project')}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  New Project
                </button>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('phases')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'phases'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ChartBarIcon className="w-4 h-4" />
                  <span>Lifecycle Phases</span>
                </button>
                
                <button
                  onClick={() => setViewMode('versions')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'versions'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <DocumentDuplicateIcon className="w-4 h-4" />
                  <span>Version Management</span>
                </button>
              </div>

              <div className="text-sm text-gray-600">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
              </div>
            </div>

            {/* Phase Navigation */}
            {viewMode === 'phases' && (
              <div className="mb-6">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                  <button
                    onClick={() => setActivePhase('all')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      activePhase === 'all'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FolderIcon className="w-4 h-4" />
                    <span>All Phases</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                      {projects.length}
                    </span>
                  </button>
                  
                  {LIFECYCLE_PHASES.map((phase) => {
                    const phaseProjects = projects.filter(p => p.lifecyclePhase === phase.id);
                    const IconComponent = phase.icon;
                    
                    return (
                      <button
                        key={phase.id}
                        onClick={() => setActivePhase(phase.id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                          activePhase === phase.id
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{phase.name}</span>
                        <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                          {phaseProjects.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

                         {/* Projects Display */}
             {loading ? (
               <div className="text-center py-12">
                 <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4 shadow-2xl animate-pulse">
                   <DocumentTextIcon className="w-8 h-8 text-white" />
                 </div>
                 <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Project Portfolio</h2>
                 <p className="text-gray-600">Please wait while we fetch your enterprise projects...</p>
               </div>
                                     ) : viewMode === 'versions' ? (
              <ProjectVersionManagement
                projects={allProjects}
                onDeleteVersion={(versionId: string) => handleDeleteVersion(versionId)}
                onViewVersion={(versionId: string) => router.push(`/dashboard/new-project?draft=${versionId}&view=true`)}
                onCreateNewVersion={(parentProject) => handleCreateVersion(parentProject)}
                deleteLoading={deleteLoading}
                versionLoading={versionLoading}
              />
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full mb-4 shadow-2xl">
                  <DocumentTextIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  No projects in {activePhase === 'all' ? 'your portfolio' : LIFECYCLE_PHASES.find(p => p.id === activePhase)?.name}
                </h2>
                <p className="text-gray-600 mb-6">
                  {activePhase === 'all' 
                    ? "Start creating your first enterprise project" 
                    : `No projects in the ${LIFECYCLE_PHASES.find(p => p.id === activePhase)?.name} phase`
                  }
                </p>
                <button
                  onClick={() => router.push('/dashboard/new-project')}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Create First Project
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProjects.map((project) => {
                  const projectVersions = getAllProjectVersions(project.projectReference);
                  const isExpanded = expandedProjects.has(project._id);
                  const IconComponent = getPhaseIcon(project.lifecyclePhase || 'estimation');
                  const phaseColor = getPhaseColor(project.lifecyclePhase || 'estimation');
                  
                  return (
                    <div key={project._id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                      {/* Main Project Card */}
                      <div className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            {/* Project Icon and Type */}
                            <div className="flex items-center space-x-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${
                                project.projectType === 'solar' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                                project.projectType === 'wind' ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
                                project.projectType === 'hydro' ? 'bg-gradient-to-br from-cyan-400 to-blue-500' :
                                project.projectType === 'thermal' ? 'bg-gradient-to-br from-red-400 to-pink-500' : 
                                'bg-gradient-to-br from-gray-400 to-gray-600'
                              }`}>
                                {project.projectType === 'solar' ? '☀️' :
                                 project.projectType === 'wind' ? '💨' :
                                 project.projectType === 'hydro' ? '💧' :
                                 project.projectType === 'thermal' ? '🔥' : '⚡'}
                              </div>
                              
                              {/* Lifecycle Phase Badge */}
                              <div className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-${phaseColor}-500`}>
                                <div className="flex items-center space-x-1">
                                  <IconComponent className="w-3 h-3" />
                                  <span>{LIFECYCLE_PHASES.find(p => p.id === project.lifecyclePhase)?.name || 'Estimation'}</span>
                                </div>
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
                                
                                {/* Latest Version Indicator */}
                                {project.isLatestVersion && (
                                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Latest
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center space-x-1">
                                  <MapPinIcon className="w-4 h-4" />
                                  <span>{project.country}, {project.city}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  <span>{new Date(project.lastSaved).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-gray-500">Ref:</span>
                                  <span className="font-mono text-xs">{project.projectReference}</span>
                                </div>
                              </div>

                              {/* Project Stats */}
                              <div className="grid grid-cols-4 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Type</p>
                                  <p className="font-semibold text-gray-900 capitalize">{project.projectType}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Progress</p>
                                  <p className="font-semibold text-gray-900">{Math.round(((project.currentStep + 1) / 13) * 100)}%</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                                  <div className="flex items-center space-x-1">
                                    <div className={`w-2 h-2 rounded-full ${
                                      project.status === 'draft' ? 'bg-yellow-500' :
                                      project.status === 'completed' ? 'bg-blue-500' :
                                      'bg-green-500'
                                    }`}></div>
                                    <span className="font-semibold text-gray-900 capitalize">{project.status}</span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide">Versions</p>
                                  <p className="font-semibold text-gray-900">{projectVersions.length}</p>
                                </div>
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
                                <PencilIcon className="w-4 h-4" />
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

                                                         {/* Version Management */}
                             {project.status === 'completed' && shouldShowNewVersionButton(project) && (
                               <button
                                 onClick={() => handleOpenVersionSelection(project)}
                                 disabled={versionLoading === project._id}
                                 className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 text-sm font-medium disabled:opacity-50"
                               >
                                 {versionLoading === project._id ? (
                                   <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                 ) : (
                                   <DocumentDuplicateIcon className="w-4 h-4" />
                                 )}
                                 <span>New Version</span>
                               </button>
                             )}

                            {/* Expand/Collapse Versions */}
                            {projectVersions.length > 1 && (
                              <button
                                onClick={() => toggleProjectExpansion(project._id)}
                                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-300"
                              >
                                {isExpanded ? (
                                  <ChevronUpIcon className="w-4 h-4" />
                                ) : (
                                  <ChevronDownIcon className="w-4 h-4" />
                                )}
                              </button>
                            )}

                            {/* Delete Button for Drafts */}
                            {project.status === 'draft' && (
                              <button
                                onClick={() => handleDelete(project._id)}
                                disabled={deleteLoading === project._id}
                                className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-300 disabled:opacity-50"
                              >
                                {deleteLoading === project._id ? (
                                  <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <TrashIcon className="w-4 h-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Version History (Expandable) */}
                      {isExpanded && projectVersions.length > 1 && (
                        <div className="border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
                          <div className="p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                              <DocumentDuplicateIcon className="w-4 h-4" />
                              <span>Version History</span>
                            </h4>
                            <div className="space-y-2">
                              {projectVersions.map((version) => (
                                <div key={version._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                                  <div className="flex items-center space-x-3">
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                      v{version.version || '1.0'}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {version.projectName || 'Untitled Project'}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(version.lastSaved).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {version.isLatestVersion && (
                                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                        Latest
                                      </div>
                                    )}
                                    <button
                                      onClick={() => router.push(`/dashboard/new-project?draft=${version._id}&view=true`)}
                                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300 text-xs font-medium"
                                    >
                                      View
                                    </button>
                                    {version.status === 'completed' && (
                                      <button
                                        onClick={() => handleDeleteVersion(version._id)}
                                        disabled={deleteLoading === version._id}
                                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-300 disabled:opacity-50"
                                      >
                                        {deleteLoading === version._id ? (
                                          <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                          <TrashIcon className="w-4 h-4" />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
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

         {/* Version Selection Modal */}
         {showVersionSelectionModal && selectedProjectForVersion && (
           <VersionSelectionModal
             isOpen={showVersionSelectionModal}
             onClose={() => {
               setShowVersionSelectionModal(false);
               setSelectedProjectForVersion(null);
             }}
             onVersionSelect={handleVersionSelect}
             projectName={selectedProjectForVersion.projectName || 'Untitled Project'}
             projectReference={selectedProjectForVersion.projectReference || ''}
             availableVersions={allProjects.filter(p => p.projectReference === selectedProjectForVersion.projectReference)}
             nextVersionNumber={getNextVersion(selectedProjectForVersion.version || '0')}
           />
         )}
       </DashboardLayout>
     </RouteProtection>
   );
 } 
 