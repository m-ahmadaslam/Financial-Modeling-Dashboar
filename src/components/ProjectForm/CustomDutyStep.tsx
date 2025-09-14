"use client";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface CustomDutyStepProps {
  formData: Record<string, string>;
  errors: {[key: string]: string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode: boolean;
}

export default function CustomDutyStep({ formData, errors, handleChange, isViewMode }: CustomDutyStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-3 shadow-lg">
          <span className="text-xl">📦</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Custom Duty
        </h2>
        <p className="text-gray-600 mt-1">Configure import duty and customs parameters</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Custom Duty Rate */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-amber-600 transition-colors">
            Custom Duty Rate (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="customDutyRate"
              value={formData.customDutyRate}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="100"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.customDutyRate ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.customDutyRate && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.customDutyRate && (
            <p className="mt-1 text-sm text-red-600">{errors.customDutyRate}</p>
          )}
        </div>

        {/* Import Duty on Equipment */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-amber-600 transition-colors">
            Import Duty on Equipment (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="importDutyEquipment"
              value={formData.importDutyEquipment}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="100"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.importDutyEquipment ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.importDutyEquipment && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.importDutyEquipment && (
            <p className="mt-1 text-sm text-red-600">{errors.importDutyEquipment}</p>
          )}
        </div>

        {/* Import Duty on Spares */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-amber-600 transition-colors">
            Import Duty on Spares (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="importDutySpares"
              value={formData.importDutySpares}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="100"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.importDutySpares ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.importDutySpares && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.importDutySpares && (
            <p className="mt-1 text-sm text-red-600">{errors.importDutySpares}</p>
          )}
        </div>

        {/* Customs Handling Charges */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-amber-600 transition-colors">
            Customs Handling Charges (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="customsHandlingCharges"
              value={formData.customsHandlingCharges}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="20"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-amber-100 focus:border-amber-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.customsHandlingCharges ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.customsHandlingCharges && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.customsHandlingCharges && (
            <p className="mt-1 text-sm text-red-600">{errors.customsHandlingCharges}</p>
          )}
        </div>
      </div>

      {/* Custom Duty Guidelines */}
      <div className="mt-6 p-4 bg-amber-50/50 border border-amber-200 rounded-lg">
        <h3 className="text-sm font-semibold text-amber-800 mb-2">
          Custom Duty Guidelines:
        </h3>
        <ul className="text-xs text-amber-700 space-y-1">
          <li>• Custom duty rates vary significantly by country and equipment type</li>
          <li>• Renewable energy equipment often qualifies for reduced or zero duty</li>
          <li>• Spare parts typically have higher duty rates than main equipment</li>
          <li>• Customs handling charges are usually 1-5% of CIF value</li>
          <li>• Some countries offer duty exemptions for renewable energy projects</li>
        </ul>
      </div>
    </div>
  );
}
