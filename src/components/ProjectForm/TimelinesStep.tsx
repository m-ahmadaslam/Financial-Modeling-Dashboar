"use client";

import { useState } from 'react';
import { ExclamationTriangleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface TimelinesStepProps {
  formData: Record<string, string>;
  errors: {[key: string]: string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode: boolean;
}

interface TimelineSection {
  id: string;
  title: string;
  description: string;
  fields: Array<{
    name: string;
    label: string;
    type: 'date' | 'number' | 'text';
    required?: boolean;
    placeholder?: string;
    unit?: string;
  }>;
}

const TIMELINE_SECTIONS: TimelineSection[] = [
  {
    id: 'model-dates',
    title: 'Model & Bid Dates',
    description: 'Initial project modeling and bidding timeline',
    fields: [
      { name: 'modelStartDate', label: 'Model Start Date', type: 'date', required: true },
      { name: 'bidSubmissionDate', label: 'Bid Submission Date', type: 'date', required: true },
      { name: 'ppaSigningDate', label: 'PPA Signing Date', type: 'date' },
    ]
  },
  {
    id: 'financial-close',
    title: 'Financial Close',
    description: 'Financial close and target dates',
    fields: [
      { name: 'financialCloseDateAsPerPPA', label: 'Financial Close Date as per PPA', type: 'date', required: true },
      { name: 'targetFCDate', label: 'Target FC Date', type: 'date', required: true },
      { name: 'financialCloseDateBeforeSensitivity', label: 'Financial Close Date before Sensitivity', type: 'date' },
    ]
  },
  {
    id: 'construction',
    title: 'Construction Timeline',
    description: 'Construction period and milestone dates',
    fields: [
      { name: 'constructionPeriodStartDate', label: 'Construction Period Start Date', type: 'date' },
      { name: 'earliestConnectionDateAsPerPPA', label: 'Earliest Connection Date as per PPA', type: 'date', required: true },
      { name: 'earliestConnectionDate', label: 'Earliest Connection Date', type: 'date', required: true },
      { name: 'scheduledFirstConstructionMilestoneDateAsPerPPA', label: 'Scheduled First Construction Milestone Date as per PPA', type: 'date', required: true },
      { name: 'scheduledFirstConstructionMilestoneDate', label: 'Scheduled First Construction Milestone Date', type: 'date', required: true },
      { name: 'constructionPeriod', label: 'Construction Period', type: 'number', required: true, unit: 'months' },
    ]
  },
  {
    id: 'commercial-operation',
    title: 'Commercial Operation',
    description: 'Commercial operation and PCOD dates',
    fields: [
      { name: 'scheduledPCODAsPerPPA', label: 'Scheduled PCOD as per PPA', type: 'date', required: true },
      { name: 'scheduledPCOD', label: 'Scheduled PCOD', type: 'date', required: true },
      { name: 'projectConstructionOverDate', label: 'Project Construction Over Date', type: 'date' },
      { name: 'commercialOperationDate', label: 'Commercial Operation Date', type: 'date' },
      { name: 'longstopDate', label: 'Longstop Date', type: 'date', required: true },
    ]
  },
  {
    id: 'ppa-details',
    title: 'PPA Details',
    description: 'Power Purchase Agreement terms and extensions',
    fields: [
      { name: 'tenorOfPPA', label: 'Tenor of PPA', type: 'number', required: true, unit: 'years' },
      { name: 'endOfCommercialOperations', label: 'End of Commercial Operations', type: 'date' },
      { name: 'extensionInPPA', label: 'Extension in PPA', type: 'number', unit: 'years' },
      { name: 'endOfExtensionPeriod', label: 'End of Extension Period', type: 'date' },
    ]
  },
  {
    id: 'financing-terms',
    title: 'Financing Terms',
    description: 'EBL and refinancing timeline',
    fields: [
      { name: 'eblMaxTenorAsPerRFP', label: 'EBL Max Tenor as per RFP', type: 'number', required: true, unit: 'years after FC' },
      { name: 'maxTargetRefinancingDateAsPerRFP', label: 'Max. Target Refinancing Date as per RFP', type: 'number', required: true, unit: 'years after PCOD' },
    ]
  }
];

export default function TimelinesStep({ formData, errors, handleChange, isViewMode }: TimelinesStepProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['model-dates', 'financial-close']));

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const renderField = (field: TimelineSection['fields'][0]) => {
    const fieldName = field.name;
    const fieldValue = formData[fieldName] || '';
    const hasError = errors[fieldName];

    return (
      <div key={fieldName} className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-green-600 transition-colors">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {field.type === 'date' ? (
            <input
              type="date"
              name={fieldName}
              value={fieldValue}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                hasError ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              required={field.required}
            />
          ) : field.type === 'number' ? (
            <div className="relative">
              <input
                type="number"
                name={fieldName}
                value={fieldValue}
                onChange={handleChange}
                disabled={isViewMode}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                  hasError ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
                } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder={field.placeholder}
                required={field.required}
              />
              {field.unit && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 text-sm">{field.unit}</span>
                </div>
              )}
            </div>
          ) : (
            <input
              type="text"
              name={fieldName}
              value={fieldValue}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                hasError ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder={field.placeholder}
              required={field.required}
            />
          )}
          {hasError && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {hasError && (
          <p className="mt-1 text-sm text-red-600">{hasError}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 relative z-0">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mb-3 shadow-lg">
          <span className="text-xl">📅</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Project Timelines
        </h2>
        <p className="text-gray-600 mt-1">Define the key milestones and deadlines</p>
      </div>
      
      <div className="space-y-4">
        {TIMELINE_SECTIONS.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          
          return (
            <div key={section.id} className="bg-white/50 rounded-xl border border-gray-200 shadow-sm relative z-0">
              <button
                onClick={() => toggleSection(section.id)}
                disabled={isViewMode}
                className={`w-full px-6 py-4 text-left flex items-center justify-between transition-all duration-200 ${
                  isViewMode ? 'cursor-default' : 'cursor-pointer hover:bg-gray-50'
                }`}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                </div>
                {!isViewMode && (
                  <div className="flex items-center">
                    {isExpanded ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                )}
              </button>
              
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                    {(section.fields || []).map(renderField)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
