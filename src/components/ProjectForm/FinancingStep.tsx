"use client";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface FinancingStepProps {
  formData: Record<string, string>;
  errors: {[key: string]: string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode: boolean;
}

export default function FinancingStep({ formData, errors, handleChange, isViewMode }: FinancingStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mb-3 shadow-lg">
          <span className="text-xl">🏦</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Financing
        </h2>
        <p className="text-gray-600 mt-1">Configure the financing structure for your project</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Debt Equity Ratio */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-cyan-600 transition-colors">
            Debt:Equity Ratio *
          </label>
          <div className="relative">
            <input
              type="number"
              name="debtEquityRatio"
              value={formData.debtEquityRatio}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.1"
              min="0"
              max="100"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.debtEquityRatio ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="70:30"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.debtEquityRatio && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.debtEquityRatio && (
            <p className="mt-1 text-sm text-red-600">{errors.debtEquityRatio}</p>
          )}
        </div>

        {/* Interest Rate */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-cyan-600 transition-colors">
            Interest Rate (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="50"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.interestRate ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.interestRate && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.interestRate && (
            <p className="mt-1 text-sm text-red-600">{errors.interestRate}</p>
          )}
        </div>

        {/* Debt Tenor */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-cyan-600 transition-colors">
            Debt Tenor (Years) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="debtTenor"
              value={formData.debtTenor}
              onChange={handleChange}
              disabled={isViewMode}
              step="1"
              min="1"
              max="30"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.debtTenor ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="15"
              required
            />
            {errors.debtTenor && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.debtTenor && (
            <p className="mt-1 text-sm text-red-600">{errors.debtTenor}</p>
          )}
        </div>

        {/* Moratorium Period */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-cyan-600 transition-colors">
            Moratorium Period (Years) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="moratoriumPeriod"
              value={formData.moratoriumPeriod}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.5"
              min="0"
              max="10"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.moratoriumPeriod ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="2.0"
              required
            />
            {errors.moratoriumPeriod && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.moratoriumPeriod && (
            <p className="mt-1 text-sm text-red-600">{errors.moratoriumPeriod}</p>
          )}
        </div>

        {/* Repayment Frequency */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-cyan-600 transition-colors">
            Repayment Frequency *
          </label>
          <select
            name="repaymentFrequency"
            value={formData.repaymentFrequency}
            onChange={handleChange}
            disabled={isViewMode}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md appearance-none ${
              errors.repaymentFrequency ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
            } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
            required
          >
            <option value="">Select frequency</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="semi-annually">Semi-Annually</option>
            <option value="annually">Annually</option>
          </select>
          {errors.repaymentFrequency && (
            <p className="mt-1 text-sm text-red-600">{errors.repaymentFrequency}</p>
          )}
        </div>

        {/* Upfront Fee */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-cyan-600 transition-colors">
            Upfront Fee (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="upfrontFee"
              value={formData.upfrontFee}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="10"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-cyan-100 focus:border-cyan-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.upfrontFee ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.upfrontFee && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.upfrontFee && (
            <p className="mt-1 text-sm text-red-600">{errors.upfrontFee}</p>
          )}
        </div>
      </div>

      {/* Financing Guidelines */}
      <div className="mt-6 p-4 bg-cyan-50/50 border border-cyan-200 rounded-lg">
        <h3 className="text-sm font-semibold text-cyan-800 mb-2">
          Financing Guidelines:
        </h3>
        <ul className="text-xs text-cyan-700 space-y-1">
          <li>• Debt:Equity ratio typically ranges from 60:40 to 80:20 for renewable projects</li>
          <li>• Interest rates vary by country and credit rating (typically 4-12%)</li>
          <li>• Debt tenor: Solar/Wind (12-18 years), Hydro (15-25 years), Thermal (10-15 years)</li>
          <li>• Moratorium period usually covers construction period plus 6-12 months</li>
          <li>• Repayment frequency is typically quarterly or semi-annually</li>
          <li>• Upfront fees range from 0.5% to 2% of loan amount</li>
        </ul>
      </div>
    </div>
  );
}
