"use client";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface VATAssumptionsStepProps {
  formData: Record<string, string>;
  errors: {[key: string]: string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode: boolean;
}

export default function VATAssumptionsStep({ formData, errors, handleChange, isViewMode }: VATAssumptionsStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full mb-3 shadow-lg">
          <span className="text-xl">🧾</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          VAT Assumptions
        </h2>
        <p className="text-gray-600 mt-1">Configure Value Added Tax parameters</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VAT Rate */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
            VAT Rate (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="vatRate"
              value={formData.vatRate}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="50"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.vatRate ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.vatRate && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.vatRate && (
            <p className="mt-1 text-sm text-red-600">{errors.vatRate}</p>
          )}
        </div>

        {/* VAT Recovery Period */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
            VAT Recovery Period (Months) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="vatRecoveryPeriod"
              value={formData.vatRecoveryPeriod}
              onChange={handleChange}
              disabled={isViewMode}
              step="1"
              min="0"
              max="60"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.vatRecoveryPeriod ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="12"
              required
            />
            {errors.vatRecoveryPeriod && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.vatRecoveryPeriod && (
            <p className="mt-1 text-sm text-red-600">{errors.vatRecoveryPeriod}</p>
          )}
        </div>

        {/* VAT on Equipment */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
            VAT on Equipment (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="vatOnEquipment"
              value={formData.vatOnEquipment}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="50"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.vatOnEquipment ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.vatOnEquipment && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.vatOnEquipment && (
            <p className="mt-1 text-sm text-red-600">{errors.vatOnEquipment}</p>
          )}
        </div>

        {/* VAT on Services */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
            VAT on Services (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="vatOnServices"
              value={formData.vatOnServices}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="50"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-pink-100 focus:border-pink-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.vatOnServices ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.vatOnServices && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.vatOnServices && (
            <p className="mt-1 text-sm text-red-600">{errors.vatOnServices}</p>
          )}
        </div>
      </div>

      {/* VAT Guidelines */}
      <div className="mt-6 p-4 bg-pink-50/50 border border-pink-200 rounded-lg">
        <h3 className="text-sm font-semibold text-pink-800 mb-2">
          VAT Guidelines:
        </h3>
        <ul className="text-xs text-pink-700 space-y-1">
          <li>• VAT rates vary by country (typically 5-25%)</li>
          <li>• Some countries offer reduced VAT rates for renewable energy projects</li>
          <li>• VAT recovery period typically ranges from 3-24 months</li>
          <li>• Equipment and services may have different VAT rates</li>
          <li>• Some jurisdictions allow VAT credits for business inputs</li>
        </ul>
      </div>
    </div>
  );
}
