'use client';

import React, { useState, useEffect } from 'react';

interface TimelineInputsProps {
  inputs: any;
  onChange: (inputs: any) => void;
}

export default function TimelineInputs({ inputs, onChange }: TimelineInputsProps) {
  const [formData, setFormData] = useState({
    // Timeline Inputs from Excel Time sheet
    model_start_date: '2025-01-01',
    ppa_signing_date: '2025-09-17',
    financial_close_date: '',
    construction_period_start_date: '',
    construction_period: 25, // months
    scheduled_pcod_as_per_ppa: '2028-01-30',
    scheduled_pcod: '2028-01-31',
    commercial_operation_date: '',
    tenor_of_ppa: 25, // years
    end_of_commercial_operations: '2053-01-31',
    extension_in_ppa: 0, // years
    end_of_extension_period: '2053-01-31',
    months_in_quarterly_period: 3,
    
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const inputFields = [
    {
      section: 'Timeline Inputs',
      fields: [
        { key: 'model_start_date', label: 'Model start date', type: 'date' },
        { key: 'ppa_signing_date', label: 'PPA signing date', type: 'date' },
        { key: 'financial_close_date', label: 'Financial close date', type: 'date', placeholder: '#REF!' },
        { key: 'construction_period_start_date', label: 'Construction period start date', type: 'date', placeholder: '#REF!' },
        { key: 'construction_period', label: 'Construction period', type: 'number', unit: 'months' },
        { key: 'scheduled_pcod_as_per_ppa', label: 'Scheduled PCOD as per PPA', type: 'date' },
        { key: 'scheduled_pcod', label: 'Scheduled PCOD', type: 'date' },
        { key: 'commercial_operation_date', label: 'Commercial Operation date', type: 'date', placeholder: '#REF!' },
        { key: 'tenor_of_ppa', label: 'Tenor of PPA', type: 'number', unit: 'years' },
        { key: 'end_of_commercial_operations', label: 'End of commercial operations', type: 'date' },
        { key: 'extension_in_ppa', label: 'Extension in PPA', type: 'number', unit: 'years' },
        { key: 'end_of_extension_period', label: 'End of extension period', type: 'date' },
        { key: 'months_in_quarterly_period', label: 'Months in a quarterly period', type: 'number', unit: 'months' },
      ]
    }
  ];

  const renderField = (field: any) => {
    const value = formData[field.key as keyof typeof formData];
    
    return (
      <div key={field.key} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
          {field.unit && (
            <span className="text-gray-500 ml-1">({field.unit})</span>
          )}
        </label>
        
        {field.type === 'select' ? (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
          >
            {field.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : field.type === 'number' ? (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.key, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
          />
        ) : (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
          />
        )}
        
        {field.placeholder === '#REF!' && (
          <p className="text-xs text-orange-600">
            This field will be calculated based on other inputs
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {inputFields.map((section) => (
        <div key={section.section}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            {section.section}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.fields.map(renderField)}
          </div>
        </div>
      ))}
      
      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Timeline Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-700 font-medium">Model Start:</span>
            <div className="text-blue-900">{formData.model_start_date}</div>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Construction:</span>
            <div className="text-blue-900">{formData.construction_period} months</div>
          </div>
          <div>
            <span className="text-blue-700 font-medium">PPA Tenor:</span>
            <div className="text-blue-900">{formData.tenor_of_ppa} years</div>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Extension:</span>
            <div className="text-blue-900">{formData.extension_in_ppa} years</div>
          </div>
        </div>
      </div>
    </div>
  );
}
