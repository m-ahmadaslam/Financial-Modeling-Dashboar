"use client";

import { useState, useEffect } from 'react';
import { ENTERPRISE_ASSUMPTIONS, AssumptionField, AssumptionSection, calculateFormulas, validateAssumption } from '@/lib/assumptions-data';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalculatorIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface EnterpriseAssumptionsStepProps {
  formData: Record<string, any>;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode?: boolean;
}

export default function EnterpriseAssumptionsStep({ 
  formData, 
  errors, 
  handleChange, 
  isViewMode = false 
}: EnterpriseAssumptionsStepProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['project-basic-info']));
  const [calculatedValues, setCalculatedValues] = useState<Record<string, any>>({});

  // Calculate formulas when formData changes
  useEffect(() => {
    const calculated = calculateFormulas(formData);
    setCalculatedValues(calculated);
  }, [formData]);

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

  const getFieldValue = (field: AssumptionField): any => {
    if (field.type === 'calculated') {
      return calculatedValues[field.id] || formData[field.id] || '';
    }
    return formData[field.id] || field.defaultValue || '';
  };

  const getFieldError = (field: AssumptionField): string | null => {
    return errors[field.id] || null;
  };

  const isFieldReadOnly = (field: AssumptionField): boolean => {
    return field.type === 'calculated' || field.type === 'formula' || field.type === 'readonly' || isViewMode;
  };

  const renderField = (field: AssumptionField) => {
    const value = getFieldValue(field);
    const error = getFieldError(field);
    const isReadOnly = isFieldReadOnly(field);
    const isCalculated = field.type === 'calculated';

    return (
      <div key={field.id} className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <span>{field.name}</span>
            {field.isCritical && (
              <span className="text-red-500 text-xs">*</span>
            )}
            {isCalculated && (
              <CalculatorIcon className="w-4 h-4 text-blue-500" title="Calculated field" />
            )}
            {field.type === 'formula' && (
              <PencilIcon className="w-4 h-4 text-green-500" title="Formula field" />
            )}
          </label>
          {field.unit && (
            <span className="text-xs text-gray-500">{field.unit}</span>
          )}
        </div>
        
        {field.description && (
          <p className="text-xs text-gray-500">{field.description}</p>
        )}

        <div className="relative">
          {isReadOnly ? (
            <div className={`
              px-3 py-2 border rounded-lg text-sm
              ${isCalculated 
                ? 'bg-blue-50 border-blue-200 text-blue-900 font-medium' 
                : 'bg-gray-50 border-gray-200 text-gray-600'
              }
            `}>
              {isCalculated ? (
                <div className="flex items-center space-x-2">
                  <CalculatorIcon className="w-4 h-4" />
                  <span>{value || 'Calculating...'}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <EyeIcon className="w-4 h-4" />
                  <span>{value || 'N/A'}</span>
                </div>
              )}
            </div>
          ) : (
            <input
              type={field.dataType === 'number' || field.dataType === 'percentage' ? 'number' : 
                    field.dataType === 'date' ? 'date' : 'text'}
              name={field.id}
              value={value}
              onChange={handleChange}
              placeholder={`Enter ${field.name.toLowerCase()}`}
              className={`
                w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                ${field.dataType === 'percentage' ? 'pr-8' : ''}
              `}
              step={field.dataType === 'number' ? '0.01' : undefined}
              min={field.validation?.min}
              max={field.validation?.max}
            />
          )}
          
          {field.dataType === 'percentage' && !isReadOnly && (
            <span className="absolute right-3 top-2 text-gray-500 text-sm">%</span>
          )}
        </div>

        {error && (
          <div className="flex items-center space-x-1 text-red-600 text-xs">
            <ExclamationTriangleIcon className="w-3 h-3" />
            <span>{error}</span>
          </div>
        )}

        {field.formula && (
          <div className="bg-gray-100 p-2 rounded text-xs font-mono text-gray-600">
            <span className="font-semibold">Formula:</span> {field.formula}
          </div>
        )}

        {field.remarks && (
          <div className="text-xs text-gray-500 italic">
            {field.remarks}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (section: AssumptionSection) => {
    const isExpanded = expandedSections.has(section.id);
    const hasErrors = (section.fields || []).some(field => errors[field.id]);
    const completedFields = (section.fields || []).filter(field => 
      field.type === 'input' && formData[field.id] && formData[field.id] !== ''
    ).length;
    const totalInputFields = (section.fields || []).filter(field => field.type === 'input').length;
    const progress = totalInputFields > 0 ? (completedFields / totalInputFields) * 100 : 100;

    return (
      <div key={section.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <button
          onClick={() => toggleSection(section.id)}
          className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{section.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Progress indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {completedFields}/{totalInputFields}
                </span>
              </div>
              
              {/* Status indicators */}
              <div className="flex items-center space-x-2">
                {hasErrors && (
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                )}
                {progress === 100 && !hasErrors && (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                )}
                {isExpanded ? (
                  <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </button>

        {isExpanded && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {(section.fields || []).map(field => renderField(field))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enterprise Financial Assumptions</h2>
        <p className="text-gray-600">
          Configure comprehensive financial parameters for your project. 
          {isViewMode ? ' View-only mode - calculations are displayed.' : ' Required fields are marked with *.'}
        </p>
      </div>

      <div className="space-y-4">
        {ENTERPRISE_ASSUMPTIONS.map(section => renderSection(section))}
      </div>

      {/* Summary Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assumptions Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4">
            <div className="font-medium text-gray-900">Project Type</div>
            <div className="text-gray-600">{formData.project_type || 'Not specified'}</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="font-medium text-gray-900">Plant Capacity</div>
            <div className="text-gray-600">
              {formData.plant_capacity_ac ? `${formData.plant_capacity_ac} MW` : 'Not specified'}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="font-medium text-gray-900">Target IRR</div>
            <div className="text-gray-600">
              {formData.target_irr ? `${formData.target_irr}%` : 'Not specified'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
