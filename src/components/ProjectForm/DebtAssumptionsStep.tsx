"use client";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DebtAssumptionsStepProps {
  formData: Record<string, string>;
  errors: {[key: string]: string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode: boolean;
}

export default function DebtAssumptionsStep({ formData, errors, handleChange, isViewMode }: DebtAssumptionsStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-3 shadow-lg">
          <span className="text-xl">💳</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Debt Assumptions
        </h2>
        <p className="text-gray-600 mt-1">Configure debt financing parameters</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Debt Amount */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
            Debt Amount (USD) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="debtAmount"
              value={formData.debtAmount}
              onChange={handleChange}
              disabled={isViewMode}
              step="1000"
              min="0"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.debtAmount ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0"
              required
            />
            {errors.debtAmount && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.debtAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.debtAmount}</p>
          )}
        </div>

        {/* Debt Interest Rate */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
            Debt Interest Rate (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="debtInterestRate"
              value={formData.debtInterestRate}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="50"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.debtInterestRate ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.debtInterestRate && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.debtInterestRate && (
            <p className="mt-1 text-sm text-red-600">{errors.debtInterestRate}</p>
          )}
        </div>

        {/* Debt Tenor */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
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
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
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

        {/* Debt Service Reserve */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
            Debt Service Reserve (Months) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="debtServiceReserve"
              value={formData.debtServiceReserve}
              onChange={handleChange}
              disabled={isViewMode}
              step="1"
              min="0"
              max="24"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.debtServiceReserve ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="6"
              required
            />
            {errors.debtServiceReserve && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.debtServiceReserve && (
            <p className="mt-1 text-sm text-red-600">{errors.debtServiceReserve}</p>
          )}
        </div>

        {/* Debt Arrangement Fee */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
            Debt Arrangement Fee (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="debtArrangementFee"
              value={formData.debtArrangementFee}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="10"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.debtArrangementFee ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.debtArrangementFee && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.debtArrangementFee && (
            <p className="mt-1 text-sm text-red-600">{errors.debtArrangementFee}</p>
          )}
        </div>

        {/* Debt Commitment Fee */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
            Debt Commitment Fee (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="debtCommitmentFee"
              value={formData.debtCommitmentFee}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="5"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.debtCommitmentFee ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.debtCommitmentFee && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.debtCommitmentFee && (
            <p className="mt-1 text-sm text-red-600">{errors.debtCommitmentFee}</p>
          )}
        </div>
      </div>

      {/* Debt Guidelines */}
      <div className="mt-6 p-4 bg-indigo-50/50 border border-indigo-200 rounded-lg">
        <h3 className="text-sm font-semibold text-indigo-800 mb-2">
          Debt Guidelines:
        </h3>
        <ul className="text-xs text-indigo-700 space-y-1">
          <li>• Debt amount typically represents 60-80% of total project cost</li>
          <li>• Interest rates vary by country and credit rating (typically 4-12%)</li>
          <li>• Debt tenor: Solar/Wind (12-18 years), Hydro (15-25 years), Thermal (10-15 years)</li>
          <li>• Debt service reserve typically covers 6-12 months of debt obligations</li>
          <li>• Arrangement fees range from 0.5% to 2% of loan amount</li>
          <li>• Commitment fees are usually 0.25% to 1% annually on undrawn amounts</li>
        </ul>
      </div>
    </div>
  );
}
