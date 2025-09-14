"use client";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface IRRStepProps {
  formData: Record<string, string>;
  errors: {[key: string]: string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode: boolean;
}

export default function IRRStep({ formData, errors, handleChange, isViewMode }: IRRStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full mb-3 shadow-lg">
          <span className="text-xl">📈</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          IRR & Financial Metrics
        </h2>
        <p className="text-gray-600 mt-1">Configure Internal Rate of Return and financial targets</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target IRR */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-rose-600 transition-colors">
            Target IRR (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="targetIRR"
              value={formData.targetIRR}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="50"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-rose-100 focus:border-rose-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.targetIRR ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.targetIRR && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.targetIRR && (
            <p className="mt-1 text-sm text-red-600">{errors.targetIRR}</p>
          )}
        </div>

        {/* Hurdle Rate */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-rose-600 transition-colors">
            Hurdle Rate (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="hurdleRate"
              value={formData.hurdleRate}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="50"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-rose-100 focus:border-rose-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.hurdleRate ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.hurdleRate && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.hurdleRate && (
            <p className="mt-1 text-sm text-red-600">{errors.hurdleRate}</p>
          )}
        </div>

        {/* Payback Period Target */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-rose-600 transition-colors">
            Payback Period Target (Years) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="paybackPeriodTarget"
              value={formData.paybackPeriodTarget}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.5"
              min="1"
              max="20"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-rose-100 focus:border-rose-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.paybackPeriodTarget ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="5.0"
              required
            />
            {errors.paybackPeriodTarget && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.paybackPeriodTarget && (
            <p className="mt-1 text-sm text-red-600">{errors.paybackPeriodTarget}</p>
          )}
        </div>

        {/* NPV Target */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-rose-600 transition-colors">
            NPV Target (USD) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="npvTarget"
              value={formData.npvTarget}
              onChange={handleChange}
              disabled={isViewMode}
              step="1000"
              min="0"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-rose-100 focus:border-rose-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.npvTarget ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0"
              required
            />
            {errors.npvTarget && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.npvTarget && (
            <p className="mt-1 text-sm text-red-600">{errors.npvTarget}</p>
          )}
        </div>

        {/* DSCR Target */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-rose-600 transition-colors">
            DSCR Target (x) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="dscrTarget"
              value={formData.dscrTarget}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="1"
              max="5"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-rose-100 focus:border-rose-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.dscrTarget ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="1.25x"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">x</span>
            </div>
            {errors.dscrTarget && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.dscrTarget && (
            <p className="mt-1 text-sm text-red-600">{errors.dscrTarget}</p>
          )}
        </div>

        {/* Sensitivity Analysis Range */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-rose-600 transition-colors">
            Sensitivity Analysis Range (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="sensitivityAnalysisRange"
              value={formData.sensitivityAnalysisRange}
              onChange={handleChange}
              disabled={isViewMode}
              step="1"
              min="5"
              max="50"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-rose-100 focus:border-rose-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.sensitivityAnalysisRange ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="20%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.sensitivityAnalysisRange && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.sensitivityAnalysisRange && (
            <p className="mt-1 text-sm text-red-600">{errors.sensitivityAnalysisRange}</p>
          )}
        </div>
      </div>

      {/* IRR Guidelines */}
      <div className="mt-6 p-4 bg-rose-50/50 border border-rose-200 rounded-lg">
        <h3 className="text-sm font-semibold text-rose-800 mb-2">
          IRR & Financial Metrics Guidelines:
        </h3>
        <ul className="text-xs text-rose-700 space-y-1">
          <li>• Target IRR: Solar (8-12%), Wind (10-15%), Hydro (8-12%), Thermal (12-18%)</li>
          <li>• Hurdle rate is typically 2-4% above target IRR</li>
          <li>• Payback period: Solar/Wind (5-8 years), Hydro (6-10 years), Thermal (4-7 years)</li>
          <li>• NPV target should be positive and significant</li>
          <li>• DSCR target is typically 1.25x to 1.5x for project finance</li>
          <li>• Sensitivity analysis range is usually ±20% for key variables</li>
        </ul>
      </div>
    </div>
  );
}
