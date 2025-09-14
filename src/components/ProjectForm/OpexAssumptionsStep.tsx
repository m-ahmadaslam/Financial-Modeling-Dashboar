"use client";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface OpexAssumptionsStepProps {
  formData: Record<string, string>;
  errors: {[key: string]: string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode: boolean;
}

export default function OpexAssumptionsStep({ formData, errors, handleChange, isViewMode }: OpexAssumptionsStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-lime-500 to-green-600 rounded-full mb-3 shadow-lg">
          <span className="text-xl">💼</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Opex Assumptions
        </h2>
        <p className="text-gray-600 mt-1">Configure operational expenditure parameters</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* O&M Cost */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-lime-600 transition-colors">
            O&M Cost (USD/kW/year) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="omCost"
              value={formData.omCost}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-lime-100 focus:border-lime-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.omCost ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00"
              required
            />
            {errors.omCost && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.omCost && (
            <p className="mt-1 text-sm text-red-600">{errors.omCost}</p>
          )}
        </div>

        {/* Insurance Cost */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-lime-600 transition-colors">
            Insurance Cost (USD/kW/year) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="insuranceCost"
              value={formData.insuranceCost}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-lime-100 focus:border-lime-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.insuranceCost ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00"
              required
            />
            {errors.insuranceCost && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.insuranceCost && (
            <p className="mt-1 text-sm text-red-600">{errors.insuranceCost}</p>
          )}
        </div>

        {/* Land Lease Cost */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-lime-600 transition-colors">
            Land Lease Cost (USD/kW/year) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="landLeaseCost"
              value={formData.landLeaseCost}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-lime-100 focus:border-lime-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.landLeaseCost ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00"
              required
            />
            {errors.landLeaseCost && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.landLeaseCost && (
            <p className="mt-1 text-sm text-red-600">{errors.landLeaseCost}</p>
          )}
        </div>

        {/* Administrative Cost */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-lime-600 transition-colors">
            Administrative Cost (USD/kW/year) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="administrativeCost"
              value={formData.administrativeCost}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-lime-100 focus:border-lime-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.administrativeCost ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00"
              required
            />
            {errors.administrativeCost && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.administrativeCost && (
            <p className="mt-1 text-sm text-red-600">{errors.administrativeCost}</p>
          )}
        </div>

        {/* O&M Escalation */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-lime-600 transition-colors">
            O&M Escalation (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="omEscalation"
              value={formData.omEscalation}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="20"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-lime-100 focus:border-lime-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.omEscalation ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.omEscalation && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.omEscalation && (
            <p className="mt-1 text-sm text-red-600">{errors.omEscalation}</p>
          )}
        </div>

        {/* Major Maintenance Cost */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-lime-600 transition-colors">
            Major Maintenance Cost (USD/kW) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="majorMaintenanceCost"
              value={formData.majorMaintenanceCost}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-lime-100 focus:border-lime-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.majorMaintenanceCost ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00"
              required
            />
            {errors.majorMaintenanceCost && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.majorMaintenanceCost && (
            <p className="mt-1 text-sm text-red-600">{errors.majorMaintenanceCost}</p>
          )}
        </div>
      </div>

      {/* Opex Guidelines */}
      <div className="mt-6 p-4 bg-lime-50/50 border border-lime-200 rounded-lg">
        <h3 className="text-sm font-semibold text-lime-800 mb-2">
          Opex Guidelines:
        </h3>
        <ul className="text-xs text-lime-700 space-y-1">
          <li>• O&M costs: Solar (15-25 USD/kW/year), Wind (25-40 USD/kW/year), Hydro (10-20 USD/kW/year)</li>
          <li>• Insurance costs typically range from 5-15 USD/kW/year</li>
          <li>• Land lease costs vary by location (5-50 USD/kW/year)</li>
          <li>• Administrative costs are usually 5-15 USD/kW/year</li>
          <li>• O&M escalation typically follows inflation rate (2-5% annually)</li>
          <li>• Major maintenance costs occur every 5-10 years</li>
        </ul>
      </div>
    </div>
  );
}
