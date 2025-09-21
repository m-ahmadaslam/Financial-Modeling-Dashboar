"use client";

import { useState, useEffect } from 'react';
import { 
  COMPREHENSIVE_SECTIONS, 
  calculateComprehensiveFormulas, 
  getDataStatistics,
  getSections,
  getHeadings,
  getAssumptions,
  getInputFields,
  getCalculatedFields,
  FormulaPatterns,
  getFormulaType,
  InputField,
  Section,
  Heading
} from '@/lib/comprehensive-input-data-enhanced';
import { 
  ChevronDownIcon, 
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalculatorIcon,
  PencilIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface EnhancedRealInputSheetStepProps {
  formData: Record<string, any>;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode?: boolean;
}

export default function EnhancedRealInputSheetStep({ 
  formData, 
  errors, 
  handleChange, 
  isViewMode = false 
}: EnhancedRealInputSheetStepProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['project_basic_information']));
  const [expandedHeadings, setExpandedHeadings] = useState<Set<string>>(new Set());
  const [calculatedValues, setCalculatedValues] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<'input' | 'calculated'>('input');
  const [selectedSection, setSelectedSection] = useState<string>('project_basic_information');
  const [selectedHeading, setSelectedHeading] = useState<string>('');

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

  const getFieldValue = (field: InputField) => {
    if (field.type === 'calculated') {
      return calculatedValues[field.id] || field.value || '';
    }
    return formData[field.id] || field.value || '';
  };

  const getFieldDisplayValue = (field: InputField) => {
    const value = getFieldValue(field);
    if (field.unit && value !== '') {
      return `${value} ${field.unit}`;
    }
    return value;
  };

  const getFieldIcon = (field: InputField) => {
    if (field.type === 'calculated') {
      return <CalculatorIcon className="h-4 w-4 text-green-500" />;
    }
    
    switch (field.dataType) {
      case 'currency':
        return <CurrencyDollarIcon className="h-4 w-4 text-yellow-500" />;
      case 'date':
        return <CalendarIcon className="h-4 w-4 text-blue-500" />;
      case 'percentage':
        return <ChartBarIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <PencilIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getFormulaDisplay = (field: InputField) => {
    if (!field.formula) return null;
    
    const formulaType = getFormulaType(field.formula);
    return (
      <div className="text-xs text-gray-500 mt-1">
        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
          {field.formula}
        </span>
        <span className="ml-2 text-blue-600">({formulaType})</span>
      </div>
    );
  };

  const renderField = (field: InputField) => {
    const isExpanded = expandedSections.has(field.section || '');
    const isCalculated = field.type === 'calculated';
    const isReadOnly = isCalculated || isViewMode;
    const fieldValue = getFieldValue(field);
    const hasError = errors[field.id];

    return (
      <div key={field.id} className="border-b border-gray-100 py-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getFieldIcon(field)}
              <label className="text-sm font-medium text-gray-700">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {field.isNamedCell && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {field.namedCell}
                </span>
              )}
            </div>
            
            {getFormulaDisplay(field)}
            
            {isCalculated ? (
              <div className="mt-2">
                <div className="text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded border">
                  {getFieldDisplayValue(field)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Calculated Value
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <input
                  type={field.dataType === 'date' ? 'date' : field.dataType === 'number' ? 'number' : 'text'}
                  id={field.id}
                  name={field.id}
                  value={fieldValue}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    hasError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : isReadOnly 
                        ? 'border-gray-200 bg-gray-50 text-gray-600' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder={field.unit ? `Enter value in ${field.unit}` : 'Enter value'}
                />
                {hasError && (
                  <p className="mt-1 text-sm text-red-600">{hasError}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (section: Section) => {
    const isExpanded = expandedSections.has(section.id);
    const headings = Object.values(section.headings);
    const inputFields = (section.fields || []).filter(f => f.type === 'input');
    const calculatedFields = (section.fields || []).filter(f => f.type === 'calculated');
    
    return (
      <div key={section.id} className="border border-gray-200 rounded-lg mb-4">
        <div 
          className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
          onClick={() => toggleSection(section.id)}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{section.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
              <p className="text-sm text-gray-600">
                {inputFields.length} input, {calculatedFields.length} calculated fields
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              section.color === 'blue' ? 'bg-blue-100 text-blue-800' :
              section.color === 'green' ? 'bg-green-100 text-green-800' :
              section.color === 'red' ? 'bg-red-100 text-red-800' :
              section.color === 'purple' ? 'bg-purple-100 text-purple-800' :
              section.color === 'orange' ? 'bg-orange-100 text-orange-800' :
              section.color === 'cyan' ? 'bg-cyan-100 text-cyan-800' :
              section.color === 'slate' ? 'bg-slate-100 text-slate-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {section.color}
            </span>
            {isExpanded ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            )}
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-4 border-t border-gray-200">
            {/* Hierarchical Structure */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Structure</h4>
              <div className="space-y-2">
                {headings.map(heading => (
                  <div key={heading.id} className="ml-4">
                    <div 
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      onClick={() => toggleHeading(heading.id)}
                    >
                      <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{heading.name}</span>
                      <span className="text-xs text-gray-500">({heading.assumptions.length} assumptions)</span>
                      {expandedHeadings.has(heading.id) ? (
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    
                    {expandedHeadings.has(heading.id) && (
                      <div className="ml-6 mt-2 space-y-1">
                        {heading.assumptions.map(assumption => (
                          <div key={assumption.id} className="flex items-center gap-2 text-xs text-gray-600">
                            <CogIcon className="h-3 w-3" />
                            <span>{assumption.name}</span>
                            <span className={`px-1 py-0.5 rounded text-xs ${
                              assumption.type === 'input' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {assumption.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="mb-4">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('input')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'input'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <PencilIcon className="h-4 w-4 inline mr-2" />
                    Input Fields ({inputFields.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('calculated')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'calculated'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <CalculatorIcon className="h-4 w-4 inline mr-2" />
                    Calculated Fields ({calculatedFields.length})
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Fields Display */}
            <div className="space-y-4">
              {activeTab === 'input' ? (
                inputFields.length > 0 ? (
                  inputFields.map(renderField)
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <PencilIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No input fields in this section</p>
                  </div>
                )
              ) : (
                calculatedFields.length > 0 ? (
                  calculatedFields.map(renderField)
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalculatorIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No calculated fields in this section</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const stats = getDataStatistics();
  const sections = getSections();

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Comprehensive Input Sheet</h2>
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span className="text-sm text-gray-600">Enhanced Structure</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalSections}</div>
            <div className="text-sm text-blue-800">Sections</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.totalFields}</div>
            <div className="text-sm text-green-800">Total Fields</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.inputFields}</div>
            <div className="text-sm text-yellow-800">Input Fields</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.calculatedFields}</div>
            <div className="text-sm text-purple-800">Calculated Fields</div>
          </div>
        </div>
      </div>

      {/* Section Dropdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Section
        </label>
        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {sections.map(section => (
            <option key={section.id} value={section.id}>
              {section.icon} {section.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sections Display */}
      <div className="space-y-4">
        {Object.values(COMPREHENSIVE_SECTIONS).map(renderSection)}
      </div>
    </div>
  );
}
