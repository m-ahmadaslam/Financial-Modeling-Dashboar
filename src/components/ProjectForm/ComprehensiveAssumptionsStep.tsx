"use client";

import { useState, useEffect } from 'react';
import { 
  COMPREHENSIVE_ASSUMPTIONS, 
  calculateComprehensiveFormulas, 
  FieldDefinition,
  AssumptionSection 
} from '@/lib/comprehensive-assumptions';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalculatorIcon,
  EyeIcon,
  PencilIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface ComprehensiveAssumptionsStepProps {
  formData: Record<string, any>;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode?: boolean;
}

export default function ComprehensiveAssumptionsStep({ 
  formData, 
  errors, 
  handleChange, 
  isViewMode = false 
}: ComprehensiveAssumptionsStepProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['project-identification']));
  const [calculatedValues, setCalculatedValues] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');

  // Calculate formulas when formData changes
  useEffect(() => {
    const calculated = calculateComprehensiveFormulas(formData);
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

  const getFieldValue = (field: FieldDefinition): any => {
    if (field.type === 'calculated' || field.type === 'formula') {
      return calculatedValues[field.id] || formData[field.id] || field.defaultValue || '';
    }
    return formData[field.id] || field.defaultValue || '';
  };

  const getFieldError = (field: FieldDefinition): string | null => {
    return errors[field.id] || null;
  };

  const isFieldReadOnly = (field: FieldDefinition): boolean => {
    return field.type === 'calculated' || field.type === 'formula' || field.type === 'named_cell' || isViewMode;
  };

  const getFieldIcon = (field: FieldDefinition) => {
    if (field.type === 'calculated' || field.type === 'formula') {
      return <CalculatorIcon className="w-4 h-4 text-blue-500" />;
    }
    if (field.dataType === 'currency') {
      return <CurrencyDollarIcon className="w-4 h-4 text-green-500" />;
    }
    if (field.dataType === 'date') {
      return <CalendarIcon className="w-4 h-4 text-purple-500" />;
    }
    if (field.dataType === 'percentage') {
      return <ChartBarIcon className="w-4 h-4 text-orange-500" />;
    }
    return <PencilIcon className="w-4 h-4 text-gray-500" />;
  };

  const renderField = (field: FieldDefinition) => {
    const value = getFieldValue(field);
    const error = getFieldError(field);
    const isReadOnly = isFieldReadOnly(field);
    const isCalculated = field.type === 'calculated' || field.type === 'formula';

    return (
      <div key={field.id} className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            {getFieldIcon(field)}
            <span>{field.name}</span>
            {field.isRequired && (
              <span className="text-red-500 text-xs">*</span>
            )}
            {field.namedCell && (
              <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                {field.namedCell}
              </span>
            )}
          </label>
          <div className="flex items-center space-x-2">
            {field.unit && (
              <span className="text-xs text-gray-500">{field.unit}</span>
            )}
            {field.row && (
              <span className="text-xs bg-gray-100 text-gray-600 px-1 rounded">
                Row {field.row}
              </span>
            )}
          </div>
        </div>
        
        {field.description && (
          <p className="text-xs text-gray-500">{field.description}</p>
        )}

        <div className="relative">
          {isReadOnly ? (
            <div className={`
              px-3 py-2 border rounded-lg text-sm min-h-[38px] flex items-center
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
              type={
                field.dataType === 'number' || field.dataType === 'percentage' ? 'number' : 
                field.dataType === 'date' ? 'date' : 
                field.dataType === 'currency' ? 'number' : 'text'
              }
              name={field.id}
              value={value}
              onChange={handleChange}
              placeholder={`Enter ${field.name.toLowerCase()}`}
              className={`
                w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                ${field.dataType === 'percentage' ? 'pr-8' : ''}
                ${field.dataType === 'currency' ? 'pl-8' : ''}
              `}
              step={field.dataType === 'number' || field.dataType === 'currency' ? '0.01' : undefined}
              min={field.validation?.min}
              max={field.validation?.max}
            />
          )}
          
          {field.dataType === 'percentage' && !isReadOnly && (
            <span className="absolute right-3 top-2 text-gray-500 text-sm">%</span>
          )}
          
          {field.dataType === 'currency' && !isReadOnly && (
            <span className="absolute left-3 top-2 text-gray-500 text-sm">$</span>
          )}
        </div>

        {error && (
          <div className="flex items-center space-x-1 text-red-600 text-xs">
            <ExclamationTriangleIcon className="w-3 h-3" />
            <span>{error}</span>
          </div>
        )}

        {field.formula && (
          <div className="bg-blue-50 p-2 rounded text-xs font-mono text-blue-700 border border-blue-200">
            <span className="font-semibold">Formula:</span> {field.formula}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (section: AssumptionSection) => {
    const isExpanded = expandedSections.has(section.id);
    const hasErrors = (section.fields || []).some(field => errors[field.id]);
    
    // Filter fields based on active tab
    const fieldsToShow = (section.fields || []).filter(field => {
      if (activeTab === 'input') {
        return field.type === 'input';
      } else {
        return field.type === 'calculated' || field.type === 'formula' || field.type === 'named_cell';
      }
    });

    if (fieldsToShow.length === 0) return null;

    const completedFields = fieldsToShow.filter(field => 
      field.type === 'input' && formData[field.id] && formData[field.id] !== ''
    ).length;
    const totalInputFields = fieldsToShow.filter(field => field.type === 'input').length;
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
              {/* Field count */}
              <div className="text-xs text-gray-500">
                {fieldsToShow.length} field{fieldsToShow.length !== 1 ? 's' : ''}
              </div>
              
              {/* Progress indicator for input fields */}
              {activeTab === 'input' && totalInputFields > 0 && (
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
              )}
              
              {/* Status indicators */}
              <div className="flex items-center space-x-2">
                {hasErrors && (
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                )}
                {progress === 100 && !hasErrors && activeTab === 'input' && (
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
              {fieldsToShow.map(field => renderField(field))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Get statistics
  const totalInputFields = COMPREHENSIVE_ASSUMPTIONS.reduce((total, section) => 
    total + (section.fields || []).filter(f => f.type === 'input').length, 0);
  const totalCalculatedFields = COMPREHENSIVE_ASSUMPTIONS.reduce((total, section) => 
    total + (section.fields || []).filter(f => f.type === 'calculated' || f.type === 'formula').length, 0);
  const completedInputFields = COMPREHENSIVE_ASSUMPTIONS.reduce((total, section) => 
    total + (section.fields || []).filter(f => f.type === 'input' && formData[f.id] && formData[f.id] !== '').length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Comprehensive Financial Assumptions</h2>
        <p className="text-gray-600">
          Complete financial modeling system based on 3,275 rows of input sheet data.
          {isViewMode ? ' View-only mode - all calculations are displayed.' : ' Fill in input fields to see automatic calculations.'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{totalInputFields}</div>
          <div className="text-sm opacity-90">Input Fields</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{totalCalculatedFields}</div>
          <div className="text-sm opacity-90">Calculated Fields</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{completedInputFields}</div>
          <div className="text-sm opacity-90">Completed Inputs</div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{Math.round((completedInputFields / totalInputFields) * 100)}%</div>
          <div className="text-sm opacity-90">Progress</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        <button
          onClick={() => setActiveTab('input')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'input'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <PencilIcon className="w-4 h-4" />
          <span>Input Fields ({totalInputFields})</span>
        </button>
        
        <button
          onClick={() => setActiveTab('output')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'output'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <CalculatorIcon className="w-4 h-4" />
          <span>Calculated Fields ({totalCalculatedFields})</span>
        </button>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {COMPREHENSIVE_ASSUMPTIONS.map(section => renderSection(section))}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4">
            <div className="font-medium text-gray-900">Total Project Cost</div>
            <div className="text-gray-600">
              {calculatedValues.total_project_cost ? 
                `$${calculatedValues.total_project_cost.toLocaleString()}` : 
                'Not specified'}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="font-medium text-gray-900">Plant Capacity</div>
            <div className="text-gray-600">
              {calculatedValues.plant_capacity_ac ? 
                `${calculatedValues.plant_capacity_ac} MW AC` : 
                'Not specified'}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="font-medium text-gray-900">Target Equity IRR</div>
            <div className="text-gray-600">
              {calculatedValues.target_equity_irr ? 
                `${calculatedValues.target_equity_irr}%` : 
                'Not specified'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
