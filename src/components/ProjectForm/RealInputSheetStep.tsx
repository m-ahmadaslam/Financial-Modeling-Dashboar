"use client";

import { useState, useEffect } from 'react';
import { COMPREHENSIVE_SECTIONS, calculateComprehensiveFormulas, getDataStatistics, getSections, getHeadings, getAssumptions, getInputFields, getCalculatedFields, FormulaPatterns, getFormulaType, InputField } from '@/lib/comprehensive-input-data';
import { COMPREHENSIVE_ASSUMPTIONS } from '@/lib/comprehensive-assumptions';
import { formulaEngine } from '@/lib/financial-formula-engine';
import BackendIntegration from '@/components/BackendIntegration';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalculatorIcon,
  PencilIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface RealInputSheetStepProps {
  formData: Record<string, any>;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode?: boolean;
}

export default function RealInputSheetStep({ 
  formData, 
  errors, 
  handleChange, 
  isViewMode = false 
}: RealInputSheetStepProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['project_basic_information']));
  const [expandedHeadings, setExpandedHeadings] = useState<Set<string>>(new Set());
  const [calculatedValues, setCalculatedValues] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<'input' | 'calculated'>('input');
  const [selectedSection, setSelectedSection] = useState<string>('project_basic_information');
  const [selectedHeading, setSelectedHeading] = useState<string>('');
  
  // Backend integration state
  const [backendAnalysis, setBackendAnalysis] = useState<any>(null);
  const [useBackendData, setUseBackendData] = useState<boolean>(false);
  const [backendError, setBackendError] = useState<string | null>(null);

  // Calculate formulas when formData changes
  useEffect(() => {
    // Use the new formula engine for better calculations
    const calculated = formulaEngine.calculateFormulas(formData);
    setCalculatedValues(calculated);
  }, [formData]);

  // Backend integration handlers
  const handleBackendAnalysisComplete = (analysisData: any) => {
    setBackendAnalysis(analysisData);
    setUseBackendData(true);
    setBackendError(null);
  };

  const handleBackendError = (error: string) => {
    setBackendError(error);
    setUseBackendData(false);
  };

  // Get data source (backend or local)
  const getDataSource = () => {
    if (useBackendData && backendAnalysis?.comprehensiveSections) {
      return backendAnalysis.comprehensiveSections;
    }
    
    // Use COMPREHENSIVE_SECTIONS which has the proper structure and order
    return COMPREHENSIVE_SECTIONS;
  };

  const getStatistics = () => {
    if (useBackendData && backendAnalysis?.statistics) {
      return backendAnalysis.statistics;
    }
    return getDataStatistics();
  };

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

  const toggleHeading = (headingId: string) => {
    setExpandedHeadings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(headingId)) {
        newSet.delete(headingId);
      } else {
        newSet.add(headingId);
      }
      return newSet;
    });
  };

  const getFieldValue = (field: InputField): any => {
    if (field.type === 'calculated') {
      return calculatedValues[field.id] || formData[field.id] || field.value || '';
    }
    return formData[field.id] || field.value || '';
  };

  const getFieldIcon = (field: InputField) => {
    if (field.type === 'calculated') {
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

  const renderField = (field: InputField) => {
    const value = getFieldValue(field);
    const error = errors[field.id];
    const isReadOnly = field.type === 'calculated' || isViewMode;
    const isCalculated = field.type === 'calculated';

    return (
      <div key={`${field.id}-${field.row || Math.random()}`} className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            {getFieldIcon(field)}
            <span>{field.name}</span>
            {field.required && (
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
            <span className="text-xs bg-gray-100 text-gray-600 px-1 rounded">
              R{field.row}
            </span>
          </div>
        </div>

        <div className="relative">
          {isReadOnly ? (
            <div className={`
              px-3 py-2 border rounded-lg text-sm min-h-[38px] flex items-center
              ${isCalculated 
                ? 'bg-blue-50 border-blue-200 text-blue-900 font-medium' 
                : 'bg-gray-50 border-gray-200 text-gray-600'
              }
            `}>
              <div className="flex items-center space-x-2">
                <CalculatorIcon className="w-4 h-4" />
                <span>{value || 'Calculating...'}</span>
              </div>
            </div>
          ) : (
            <input
              type={
                field.dataType === 'number' || field.dataType === 'percentage' || field.dataType === 'currency' ? 'number' : 
                field.dataType === 'date' ? 'date' : 'text'
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

  const renderSection = (sectionKey: string, section: any) => {
    const isExpanded = expandedSections.has(sectionKey);
    
    // Filter fields based on active tab
    const fieldsToShow = (section.fields || []).filter((field: InputField) => {
      if (activeTab === 'input') {
        return field.type === 'input';
      } else {
        return field.type === 'calculated';
      }
    });

    if (fieldsToShow.length === 0) return null;

    const hasErrors = fieldsToShow.some((field: InputField) => errors[field.id]);
    const completedFields = fieldsToShow.filter((field: InputField) => 
      field.type === 'input' && formData[field.id] && formData[field.id] !== ''
    ).length;
    const totalInputFields = fieldsToShow.filter((field: InputField) => field.type === 'input').length;
    const progress = totalInputFields > 0 ? (completedFields / totalInputFields) * 100 : 100;

    return (
      <div key={sectionKey} className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{section.icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                <p className="text-sm text-gray-600">{fieldsToShow.length} fields • Rows {Math.min(...fieldsToShow.map((f: InputField) => f.row))}-{Math.max(...fieldsToShow.map((f: InputField) => f.row))}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Progress for input fields */}
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
              {fieldsToShow.map((field: InputField) => renderField(field))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Get statistics
  const stats = getStatistics();
  const dataSource = getDataSource();
  // @ts-ignore - Type compatibility issue with value types
  const allFields = Object.values(dataSource).flatMap(section => section?.fields || []);
  const completedInputFields = allFields.filter((f: any) => f && f.type === 'input' && formData[f.id] && formData[f.id] !== '').length;

  return (
    <div className="space-y-6">
      {/* Backend Integration */}
      <BackendIntegration 
        onAnalysisComplete={handleBackendAnalysisComplete}
        onError={handleBackendError}
      />

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Real Input Sheet Data - Named Cells</h2>
        <p className="text-gray-600">
          {stats.totalFields} fields across {stats.totalSections} sections from actual input sheet (rows {stats.rowRange.min}-{stats.rowRange.max}).
          {isViewMode ? ' View-only mode.' : ' Enter data to see calculations.'}
          {useBackendData && ' (Using backend data)'}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{stats.rowRange.max - stats.rowRange.min + 1}</div>
          <div className="text-sm opacity-90">Rows Analyzed</div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{stats.inputFields}</div>
          <div className="text-sm opacity-90">Input Fields</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{stats.calculatedFields}</div>
          <div className="text-sm opacity-90">Calculated Fields</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{Math.round((completedInputFields / stats.inputFields) * 100)}%</div>
          <div className="text-sm opacity-90">Complete</div>
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
          <span>Input Fields ({stats.inputFields})</span>
        </button>
        
        <button
          onClick={() => setActiveTab('calculated')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'calculated'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <CalculatorIcon className="w-4 h-4" />
          <span>Calculated Fields ({stats.calculatedFields})</span>
        </button>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {Object.entries(dataSource).map(([key, section]) => renderSection(key, section))}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4">
            <div className="font-medium text-gray-900">Plant Capacity</div>
            <div className="text-gray-600">
              {calculatedValues.plant_capacity_mw ? 
                `${calculatedValues.plant_capacity_mw} MW` : 
                'Not specified'}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="font-medium text-gray-900">Total Project Cost</div>
            <div className="text-gray-600">
              {calculatedValues.total_project_cost ? 
                `$${calculatedValues.total_project_cost.toLocaleString()}` : 
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
