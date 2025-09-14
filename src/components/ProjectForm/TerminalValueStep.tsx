"use client";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface TerminalValueStepProps {
  formData: Record<string, string>;
  errors: {[key: string]: string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode: boolean;
}

export default function TerminalValueStep({ formData, errors, handleChange, isViewMode }: TerminalValueStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full mb-3 shadow-lg">
          <span className="text-xl">🎯</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Terminal Value
        </h2>
        <p className="text-gray-600 mt-1">Configure terminal value assumptions</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Terminal Value Method */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-violet-600 transition-colors">
            Terminal Value Method *
          </label>
          <select
            name="terminalValueMethod"
            value={formData.terminalValueMethod}
            onChange={handleChange}
            disabled={isViewMode}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-violet-100 focus:border-violet-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md appearance-none ${
              errors.terminalValueMethod ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
            } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
            required
          >
            <option value="">Select method</option>
            <option value="perpetuity">Perpetuity Growth</option>
            <option value="exit-multiple">Exit Multiple</option>
            <option value="liquidation">Liquidation Value</option>
            <option value="zero">Zero Terminal Value</option>
          </select>
          {errors.terminalValueMethod && (
            <p className="mt-1 text-sm text-red-600">{errors.terminalValueMethod}</p>
          )}
        </div>

        {/* Terminal Growth Rate */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-violet-600 transition-colors">
            Terminal Growth Rate (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="terminalGrowthRate"
              value={formData.terminalGrowthRate}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="10"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-violet-100 focus:border-violet-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.terminalGrowthRate ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.terminalGrowthRate && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.terminalGrowthRate && (
            <p className="mt-1 text-sm text-red-600">{errors.terminalGrowthRate}</p>
          )}
        </div>

        {/* Exit Multiple */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-violet-600 transition-colors">
            Exit Multiple (x) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="exitMultiple"
              value={formData.exitMultiple}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.1"
              min="0"
              max="50"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-violet-100 focus:border-violet-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.exitMultiple ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.0x"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">x</span>
            </div>
            {errors.exitMultiple && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.exitMultiple && (
            <p className="mt-1 text-sm text-red-600">{errors.exitMultiple}</p>
          )}
        </div>

        {/* Liquidation Value */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-violet-600 transition-colors">
            Liquidation Value (USD) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="liquidationValue"
              value={formData.liquidationValue}
              onChange={handleChange}
              disabled={isViewMode}
              step="1000"
              min="0"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-violet-100 focus:border-violet-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.liquidationValue ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0"
              required
            />
            {errors.liquidationValue && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.liquidationValue && (
            <p className="mt-1 text-sm text-red-600">{errors.liquidationValue}</p>
          )}
        </div>

        {/* Terminal Value Discount Rate */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-violet-600 transition-colors">
            Terminal Value Discount Rate (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="terminalValueDiscountRate"
              value={formData.terminalValueDiscountRate}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="50"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-violet-100 focus:border-violet-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.terminalValueDiscountRate ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.terminalValueDiscountRate && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.terminalValueDiscountRate && (
            <p className="mt-1 text-sm text-red-600">{errors.terminalValueDiscountRate}</p>
          )}
        </div>

        {/* Terminal Value Year */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-violet-600 transition-colors">
            Terminal Value Year *
          </label>
          <div className="relative">
            <input
              type="number"
              name="terminalValueYear"
              value={formData.terminalValueYear}
              onChange={handleChange}
              disabled={isViewMode}
              step="1"
              min="1"
              max="50"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-violet-100 focus:border-violet-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.terminalValueYear ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="25"
              required
            />
            {errors.terminalValueYear && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.terminalValueYear && (
            <p className="mt-1 text-sm text-red-600">{errors.terminalValueYear}</p>
          )}
        </div>
      </div>

      {/* Terminal Value Guidelines */}
      <div className="mt-6 p-4 bg-violet-50/50 border border-violet-200 rounded-lg">
        <h3 className="text-sm font-semibold text-violet-800 mb-2">
          Terminal Value Guidelines:
        </h3>
        <ul className="text-xs text-violet-700 space-y-1">
          <li>• Perpetuity Growth: Assumes cash flows grow at a constant rate forever</li>
          <li>• Exit Multiple: Values the project based on industry multiples</li>
          <li>• Liquidation Value: Assumes project assets are sold at end of life</li>
          <li>• Terminal growth rate typically ranges from 0% to 3%</li>
          <li>• Exit multiples vary by industry (typically 5-15x EBITDA)</li>
          <li>• Terminal value discount rate is usually 8-12%</li>
          <li>• Terminal value year is typically project life or 20-30 years</li>
        </ul>
      </div>
    </div>
  );
}
