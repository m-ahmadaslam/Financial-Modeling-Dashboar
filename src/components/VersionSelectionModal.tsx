"use client";

import React, { useState } from "react";
import { 
  XMarkIcon, 
  DocumentDuplicateIcon, 
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface VersionSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVersionSelect: (versionId: string, versionNumber: string) => void;
  projectName: string;
  projectReference: string;
  availableVersions: ProjectVersion[];
  nextVersionNumber: string;
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
}

export default function VersionSelectionModal({
  isOpen,
  onClose,
  onVersionSelect,
  projectName,
  projectReference,
  availableVersions,
  nextVersionNumber
}: VersionSelectionModalProps) {
  const [selectedVersionId, setSelectedVersionId] = useState<string>('');
  const [hoveredVersionId, setHoveredVersionId] = useState<string>('');

  if (!isOpen) return null;

  const handleVersionSelect = () => {
    if (selectedVersionId) {
      if (selectedVersionId === 'start-fresh') {
        // Handle start fresh option
        if (confirm(`Are you sure you want to create version ${nextVersionNumber} from scratch?\n\nThis will:\n• Create a new draft project\n• Start with empty forms (no previous data)\n• Allow you to enter all assumptions from the beginning`)) {
          onVersionSelect('start-fresh', 'fresh');
        }
      } else {
        // Handle existing version selection
        const selectedVersion = availableVersions.find(v => v._id === selectedVersionId);
        if (selectedVersion) {
          if (confirm(`Are you sure you want to create version ${nextVersionNumber} based on ${selectedVersion.projectName} (v${selectedVersion.version})?\n\nThis will:\n• Create a new draft project\n• Load all data from the selected version\n• Allow you to modify assumptions as needed`)) {
            onVersionSelect(selectedVersionId, selectedVersion.version || '1.0');
          }
        }
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'draft':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (currentStep: number) => {
    return Math.round(((currentStep + 1) / 13) * 100);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <DocumentDuplicateIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Create New Version</h2>
                <p className="text-blue-100">Select which version to base your new version on</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Project Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{projectName}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">Ref:</span>
                <span className="font-mono font-medium">{projectReference}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-500">New Version:</span>
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  v{nextVersionNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Version Selection */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Available Source Versions</h4>
            <p className="text-gray-600 text-sm">
              Choose which version's data you want to load into your new version, or start completely fresh.
            </p>
            
            {/* Start Fresh Option */}
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl cursor-pointer hover:border-green-300 hover:bg-green-100 transition-all duration-200"
                 onClick={() => setSelectedVersionId('start-fresh')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                    <DocumentDuplicateIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-green-800">Start Fresh</h5>
                    <p className="text-sm text-green-700">Create new version with no previous data</p>
                  </div>
                </div>
                {selectedVersionId === 'start-fresh' && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-800">
                <DocumentDuplicateIcon className="w-4 h-4" />
                <span className="text-sm font-medium">What happens next?</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                After selecting a version (or "Start Fresh") and clicking "Create New Version", you'll be taken to the project form. 
                If you select a version, data will be pre-loaded. If you choose "Start Fresh", you'll start with empty forms.
              </p>
            </div>
            
            {/* Scroll Indicator */}
            <div className="mt-2 text-center">
              <div className="inline-flex items-center space-x-1 text-xs text-gray-500">
                <span>↓ Scroll to see all versions and action buttons ↓</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {availableVersions.map((version) => {
              const isSelected = selectedVersionId === version._id;
              const isHovered = hoveredVersionId === version._id;
              
              return (
                <div
                  key={version._id}
                  className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : isHovered 
                        ? 'border-gray-300 bg-gray-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedVersionId(version._id)}
                  onMouseEnter={() => setHoveredVersionId(version._id)}
                  onMouseLeave={() => setHoveredVersionId('')}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Version Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        v{version.version || '1.0'}
                      </div>
                      {version.isLatestVersion && (
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Latest
                        </div>
                      )}
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(version.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(version.status)}
                        <span className="capitalize">{version.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Version Details */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(version.lastSaved).toLocaleDateString()}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress:</span>
                        <span className="font-medium text-gray-900">
                          {getProgressPercentage(version.currentStep)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(version.currentStep)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <span className="ml-1 font-medium capitalize">{version.projectType}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <span className="ml-1 font-medium">{version.country}, {version.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  {isHovered && !isSelected && (
                    <div className="absolute inset-0 bg-blue-500/5 border-2 border-blue-300 rounded-xl flex items-center justify-center">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                        <EyeIcon className="w-4 h-4" />
                        <span>Click to select</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Bottom Indicator */}
          <div className="text-center py-4 border-t border-gray-100 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <span className="text-sm">Action buttons below</span>
              <ArrowRightIcon className="w-4 h-4" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 bg-white sticky bottom-0">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            
            <button
              onClick={handleVersionSelect}
              disabled={!selectedVersionId}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selectedVersionId
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <DocumentDuplicateIcon className="w-5 h-5" />
              <span>
                {selectedVersionId === 'start-fresh'
                  ? `Create New Version v${nextVersionNumber} (Start Fresh)`
                  : selectedVersionId 
                    ? `Create New Version v${nextVersionNumber}` 
                    : 'Please select an option first'
                }
              </span>
              {selectedVersionId && <ArrowRightIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
