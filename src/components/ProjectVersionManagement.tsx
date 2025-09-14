"use client";

import React, { useState, useEffect } from "react";
import { 
  EyeIcon, 
  TrashIcon, 
  DocumentDuplicateIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import ScreenshotComment from './ScreenshotComment';
import AssumptionsModal from './ProjectForm/AssumptionsModal';
import VersionSelectionModal from './VersionSelectionModal';

interface ProjectVersionManagementProps {
  projects: ProjectVersion[];
  onDeleteVersion: (versionId: string) => void;
  onViewVersion: (versionId: string) => void;
  onCreateNewVersion: (parentProject: ProjectVersion) => void;
  deleteLoading?: string | null;
  versionLoading?: string | null;
}

interface ProjectVersion {
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
  totalVersions?: number;
  comments?: Comment[];
}

interface Comment {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  drawing?: string;
  timestamp: string;
  likes: string[];
  replies?: Comment[];
}

interface ProjectGroup {
  projectName: string;
  projectReference: string;
  versions: ProjectVersion[];
  latestVersion: ProjectVersion;
}

export default function ProjectVersionManagement({
  projects,
  onDeleteVersion,
  onViewVersion,
  onCreateNewVersion,
  deleteLoading,
  versionLoading
}: ProjectVersionManagementProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [versionComments, setVersionComments] = useState<{ [key: string]: Comment[] }>({});
  const [showAssumptionsModal, setShowAssumptionsModal] = useState(false);
  const [selectedVersionForAssumptions, setSelectedVersionForAssumptions] = useState<ProjectVersion | null>(null);
  const [assumptionsViewMode, setAssumptionsViewMode] = useState<'cards' | 'json'>('cards');
  
  // Version selection modal state
  const [showVersionSelectionModal, setShowVersionSelectionModal] = useState(false);
  const [selectedProjectForVersion, setSelectedProjectForVersion] = useState<ProjectGroup | null>(null);

  // Load comments from localStorage
  useEffect(() => {
    const savedComments = localStorage.getItem('versionComments');
    if (savedComments) {
      try {
        setVersionComments(JSON.parse(savedComments));
      } catch (error) {
        console.error('Error loading saved comments:', error);
      }
    }
  }, []);

  // Save comments to localStorage
  useEffect(() => {
    if (Object.keys(versionComments).length > 0) {
      localStorage.setItem('versionComments', JSON.stringify(versionComments));
    }
  }, [versionComments]);

  // Group projects by project name
  const groupedProjects: ProjectGroup[] = React.useMemo(() => {
    const projectMap = new Map<string, ProjectVersion[]>();
    
    // Group projects by project name
    projects.forEach(project => {
      const key = project.projectName || 'Untitled Project';
      if (!projectMap.has(key)) {
        projectMap.set(key, []);
      }
      projectMap.get(key)!.push(project);
    });

    // Convert to ProjectGroup array
    return Array.from(projectMap.entries()).map(([projectName, versions]) => {
      // Sort versions by version number (descending)
      const sortedVersions = versions.sort((a, b) => {
        const versionA = parseFloat(a.version || '0');
        const versionB = parseFloat(b.version || '0');
        return versionB - versionA;
      });

      return {
        projectName,
        projectReference: versions[0].projectReference,
        versions: sortedVersions,
        latestVersion: sortedVersions[0]
      };
    });
  }, [projects]);

  const toggleProjectExpansion = (projectName: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectName)) {
        newSet.delete(projectName);
      } else {
        newSet.add(projectName);
      }
      return newSet;
    });
  };

  const toggleComments = (versionId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(versionId)) {
        newSet.delete(versionId);
      } else {
        newSet.add(versionId);
      }
      return newSet;
    });
  };

  const handleAddComment = async (versionId: string, content?: string, drawing?: string) => {
    if (!content?.trim() && !drawing) return;

    const newCommentObj: Comment = {
      _id: Date.now().toString(),
      userId: 'anonymous-user',
      userName: 'Super Admin',
      userAvatar: undefined,
      content: content || 'Drawing added',
      drawing: drawing,
      timestamp: new Date().toISOString(),
      likes: [],
      replies: []
    };

    setVersionComments(prev => ({
      ...prev,
      [versionId]: [...(prev[versionId] || []), newCommentObj]
    }));

    setNewComment(prev => ({ ...prev, [versionId]: '' }));
  };

  const handleScreenshotComment = (versionId: string, screenshot: string, annotations?: string) => {
    const newCommentObj: Comment = {
      _id: Date.now().toString(),
      userId: 'anonymous-user',
      userName: 'Super Admin',
      userAvatar: undefined,
      content: 'Screenshot added',
      drawing: annotations || screenshot,
      timestamp: new Date().toISOString(),
      likes: [],
      replies: []
    };

    setVersionComments(prev => ({
      ...prev,
      [versionId]: [...(prev[versionId] || []), newCommentObj]
    }));
  };

  const handleViewAssumptions = (version: ProjectVersion, viewMode: 'cards' | 'json' = 'cards') => {
    setSelectedVersionForAssumptions(version);
    setAssumptionsViewMode(viewMode);
    setShowAssumptionsModal(true);
  };

  const shouldShowNewVersionButton = (version: ProjectVersion): boolean => {
    return version.status === 'completed';
  };

  const handleOpenVersionSelection = (projectGroup: ProjectGroup) => {
    setSelectedProjectForVersion(projectGroup);
    setShowVersionSelectionModal(true);
  };

  const handleVersionSelect = (versionId: string, versionNumber: string) => {
    if (selectedProjectForVersion) {
      // Find the selected version
      const selectedVersion = selectedProjectForVersion.versions.find(v => v._id === versionId);
      if (selectedVersion) {
        // Create new version based on selected version
        onCreateNewVersion(selectedVersion);
        setShowVersionSelectionModal(false);
        setSelectedProjectForVersion(null);
      }
    }
  };

  const getNextVersion = (currentVersion: string): string => {
    const versionNum = parseFloat(currentVersion);
    return (versionNum + 0.1).toFixed(1);
  };

  const steps = [
    { name: 'Project Info', icon: '📋', description: 'Basic project details', color: 'blue' },
    { name: 'Timelines', icon: '📅', description: 'Key milestones', color: 'green' },
    { name: 'Project Type', icon: '🏗️', description: 'Project classification', color: 'purple' },
    { name: 'Plant Assumptions', icon: '⚡', description: 'Capacity & performance', color: 'indigo' },
    { name: 'Financial Assumptions', icon: '💰', description: 'Economic parameters', color: 'yellow' },
    { name: 'Financing', icon: '🏦', description: 'Funding structure', color: 'pink' },
    { name: 'VAT Assumptions', icon: '🧾', description: 'Tax considerations', color: 'red' },
    { name: 'Custom Duty', icon: '📦', description: 'Import duties', color: 'orange' },
    { name: 'Opex Assumptions', icon: '💼', description: 'Operating expenses', color: 'teal' },
    { name: 'Debt Assumptions', icon: '💳', description: 'Debt financing', color: 'cyan' },
    { name: 'EBL Assumptions', icon: '📊', description: 'Bridge loan details', color: 'emerald' },
    { name: 'Terminal Value', icon: '🎯', description: 'Exit valuation', color: 'rose' },
    { name: 'IRR', icon: '📈', description: 'Return analysis', color: 'violet' },
  ];

  if (groupedProjects.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <DocumentDuplicateIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
        <p className="text-gray-600">No project versions have been created yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedProjects.map((projectGroup) => {
        const isExpanded = expandedProjects.has(projectGroup.projectName);
        const latestVersion = projectGroup.latestVersion;
        
        return (
          <div key={projectGroup.projectName} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
            {/* Project Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Project Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${
                    latestVersion.projectType === 'solar' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                    latestVersion.projectType === 'wind' ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
                    latestVersion.projectType === 'hydro' ? 'bg-gradient-to-br from-cyan-400 to-blue-500' :
                    latestVersion.projectType === 'thermal' ? 'bg-gradient-to-br from-red-400 to-pink-500' : 
                    'bg-gradient-to-br from-gray-400 to-gray-600'
                  }`}>
                    {latestVersion.projectType === 'solar' ? '☀️' :
                     latestVersion.projectType === 'wind' ? '💨' :
                     latestVersion.projectType === 'hydro' ? '💧' :
                     latestVersion.projectType === 'thermal' ? '🔥' : '⚡'}
                  </div>

                  {/* Project Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {projectGroup.projectName}
                      </h3>
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        v{latestVersion.version}
                      </div>
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Latest
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{latestVersion.country}, {latestVersion.city}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{new Date(latestVersion.lastSaved).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Ref:</span>
                        <span className="font-mono text-xs">{latestVersion.projectReference}</span>
                      </div>
                    </div>

                    {/* Project Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Type</p>
                        <p className="font-semibold text-gray-900 capitalize">{latestVersion.projectType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Progress</p>
                        <p className="font-semibold text-gray-900">{Math.round(((latestVersion.currentStep + 1) / 13) * 100)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            latestVersion.status === 'draft' ? 'bg-yellow-500' :
                            latestVersion.status === 'completed' ? 'bg-blue-500' :
                            'bg-green-500'
                          }`}></div>
                          <span className="font-semibold text-gray-900 capitalize">{latestVersion.status}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Versions</p>
                        <p className="font-semibold text-gray-900">{projectGroup.versions.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {latestVersion.status === 'completed' && shouldShowNewVersionButton(latestVersion) && (
                    <button
                      onClick={() => handleOpenVersionSelection(projectGroup)}
                      disabled={versionLoading === latestVersion._id}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 text-sm font-medium disabled:opacity-50"
                    >
                      {versionLoading === latestVersion._id ? (
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                      ) : (
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      )}
                      <span>New Version</span>
                    </button>
                  )}

                  {/* Expand/Collapse Versions */}
                  <button
                    onClick={() => toggleProjectExpansion(projectGroup.projectName)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 text-sm font-medium"
                  >
                    <span>
                      {isExpanded ? 'Hide' : 'Show'} Versions ({projectGroup.versions.length})
                    </span>
                    {isExpanded ? (
                      <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Versions Dropdown */}
            {isExpanded && (
              <div className="border-t border-gray-100 bg-gray-50/50">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectGroup.versions.map((version) => (
                      <div key={version._id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
                        {/* Version Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              v{version.version || '1.0'}
                            </div>
                            {version.isLatestVersion && (
                              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                Latest
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => onViewVersion(version._id)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="View Version"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            
                            {version.status === 'completed' && (
                              <>
                                <button
                                  onClick={() => handleViewAssumptions(version, 'cards')}
                                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                                  title="View Assumptions"
                                >
                                  <DocumentTextIcon className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleViewAssumptions(version, 'json')}
                                  className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                                  title="View JSON"
                                >
                                  <CodeBracketIcon className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            
                            {version.status === 'draft' && (
                              <button
                                onClick={() => onDeleteVersion(version._id)}
                                disabled={deleteLoading === version._id}
                                className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                                title="Delete Version"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {/* Version Info */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <CalendarIcon className="w-3 h-3" />
                            <span>{new Date(version.lastSaved).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Progress:</span>
                            <span className="font-medium text-gray-900">
                              {Math.round(((version.currentStep + 1) / 13) * 100)}%
                            </span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${Math.round(((version.currentStep + 1) / 13) * 100)}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">Status:</span>
                            <div className="flex items-center space-x-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                version.status === 'draft' ? 'bg-yellow-500' :
                                version.status === 'completed' ? 'bg-blue-500' :
                                'bg-green-500'
                              }`}></div>
                              <span className="font-medium text-gray-900 capitalize">{version.status}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Comments Toggle */}
                        <button
                          onClick={() => toggleComments(version._id)}
                          className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <ChatBubbleLeftIcon className="w-4 h-4" />
                          <span>
                            {expandedComments.has(version._id) ? 'Hide' : 'Show'} Comments
                            {versionComments[version._id] && versionComments[version._id].length > 0 && (
                              <span className="ml-1">({versionComments[version._id].length})</span>
                            )}
                          </span>
                        </button>
                        
                        {/* Comments Section */}
                        {expandedComments.has(version._id) && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            {/* Screenshot Comment */}
                            <ScreenshotComment
                              versionId={version._id}
                              onScreenshotSubmit={handleScreenshotComment}
                            />

                            {/* Add Comment Form */}
                            <div className="mb-4">
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  value={newComment[version._id] || ''}
                                  onChange={(e) => setNewComment(prev => ({ ...prev, [version._id]: e.target.value }))}
                                  placeholder="Write a comment..."
                                  className="flex-1 text-sm border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && newComment[version._id]?.trim()) {
                                      handleAddComment(version._id, newComment[version._id]);
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => newComment[version._id]?.trim() && handleAddComment(version._id, newComment[version._id])}
                                  disabled={!newComment[version._id]?.trim()}
                                  className="px-3 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                                >
                                  Post
                                </button>
                              </div>
                            </div>
                            
                            {/* Comments List */}
                            <div className="space-y-3 max-h-48 overflow-y-auto">
                              {versionComments[version._id] && versionComments[version._id].length > 0 ? (
                                versionComments[version._id].map((comment) => (
                                  <div key={comment._id} className="flex space-x-2">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-xs text-white font-medium">A</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                                        <div className="flex items-center space-x-2 mb-1">
                                          <span className="text-xs font-medium text-gray-900">{comment.userName}</span>
                                          <span className="text-xs text-gray-500">
                                            {new Date(comment.timestamp).toLocaleDateString()}
                                          </span>
                                        </div>
                                        {comment.content && (
                                          <p className="text-xs text-gray-800">{comment.content}</p>
                                        )}
                                        {comment.drawing && (
                                          <div className="mt-2">
                                            <img
                                              src={comment.drawing}
                                              alt="Drawing"
                                              className="max-w-full h-auto rounded border border-gray-200"
                                              style={{ maxHeight: '150px' }}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-4">
                                  <p className="text-xs text-gray-500">
                                    No comments yet. Be the first to comment!
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Assumptions Modal */}
      {showAssumptionsModal && selectedVersionForAssumptions && (
        <AssumptionsModal
          isOpen={showAssumptionsModal}
          onClose={() => {
            setShowAssumptionsModal(false);
            setSelectedVersionForAssumptions(null);
          }}
          formData={selectedVersionForAssumptions.formData}
          currentStep={selectedVersionForAssumptions.currentStep}
          steps={steps}
        />
      )}

      {/* Version Selection Modal */}
      {showVersionSelectionModal && selectedProjectForVersion && (
        <VersionSelectionModal
          isOpen={showVersionSelectionModal}
          onClose={() => {
            setShowVersionSelectionModal(false);
            setSelectedProjectForVersion(null);
          }}
          onVersionSelect={handleVersionSelect}
          projectName={selectedProjectForVersion.projectName}
          projectReference={selectedProjectForVersion.projectReference}
          availableVersions={selectedProjectForVersion.versions}
          nextVersionNumber={getNextVersion(selectedProjectForVersion.latestVersion.version || '0')}
        />
      )}
    </div>
  );
}
