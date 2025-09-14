"use client";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface EBLAssumptionsStepProps {
  formData: Record<string, string>;
  errors: {[key: string]: string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode: boolean;
}

export default function EBLAssumptionsStep({ formData, errors, handleChange, isViewMode }: EBLAssumptionsStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full mb-3 shadow-lg">
          <span className="text-xl">📊</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          EBL Assumptions
        </h2>
        <p className="text-gray-600 mt-1">Configure Equity Bridge Loan parameters</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* EBL Amount */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-teal-600 transition-colors">
            EBL Amount (USD) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="eblAmount"
              value={formData.eblAmount}
              onChange={handleChange}
              disabled={isViewMode}
              step="1000"
              min="0"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-teal-100 focus:border-teal-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.eblAmount ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0"
              required
            />
            {errors.eblAmount && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.eblAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.eblAmount}</p>
          )}
        </div>

        {/* EBL Interest Rate */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-teal-600 transition-colors">
            EBL Interest Rate (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="eblInterestRate"
              value={formData.eblInterestRate}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="50"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-teal-100 focus:border-teal-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.eblInterestRate ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.eblInterestRate && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.eblInterestRate && (
            <p className="mt-1 text-sm text-red-600">{errors.eblInterestRate}</p>
          )}
        </div>

        {/* EBL Tenor */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-teal-600 transition-colors">
            EBL Tenor (Years) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="eblTenor"
              value={formData.eblTenor}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.5"
              min="0.5"
              max="10"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-teal-100 focus:border-teal-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.eblTenor ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="2.0"
              required
            />
            {errors.eblTenor && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.eblTenor && (
            <p className="mt-1 text-sm text-red-600">{errors.eblTenor}</p>
          )}
        </div>

        {/* EBL Arrangement Fee */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-teal-600 transition-colors">
            EBL Arrangement Fee (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="eblArrangementFee"
              value={formData.eblArrangementFee}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="10"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-teal-100 focus:border-teal-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.eblArrangementFee ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.eblArrangementFee && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.eblArrangementFee && (
            <p className="mt-1 text-sm text-red-600">{errors.eblArrangementFee}</p>
          )}
        </div>

        {/* EBL Commitment Fee */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-teal-600 transition-colors">
            EBL Commitment Fee (%) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="eblCommitmentFee"
              value={formData.eblCommitmentFee}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="5"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-teal-100 focus:border-teal-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.eblCommitmentFee ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.eblCommitmentFee && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.eblCommitmentFee && (
            <p className="mt-1 text-sm text-red-600">{errors.eblCommitmentFee}</p>
          )}
        </div>

        {/* EBL Repayment Schedule */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-teal-600 transition-colors">
            EBL Repayment Schedule *
          </label>
          <select
            name="eblRepaymentSchedule"
            value={formData.eblRepaymentSchedule}
            onChange={handleChange}
            disabled={isViewMode}
            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-teal-100 focus:border-teal-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md appearance-none ${
              errors.eblRepaymentSchedule ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
            } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
            required
          >
            <option value="">Select schedule</option>
            <option value="bullet">Bullet Payment</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="semi-annually">Semi-Annually</option>
            <option value="annually">Annually</option>
          </select>
          {errors.eblRepaymentSchedule && (
            <p className="mt-1 text-sm text-red-600">{errors.eblRepaymentSchedule}</p>
          )}
        </div>
      </div>

      {/* EBL Guidelines */}
      <div className="mt-6 p-4 bg-teal-50/50 border border-teal-200 rounded-lg">
        <h3 className="text-sm font-semibold text-teal-800 mb-2">
          EBL Guidelines:
        </h3>
        <ul className="text-xs text-teal-700 space-y-1">
          <li>• EBL typically covers 20-30% of equity contribution during construction</li>
          <li>• Interest rates are usually higher than project debt (8-15%)</li>
          <li>• EBL tenor typically matches construction period plus 6-12 months</li>
          <li>• Arrangement fees range from 1% to 3% of loan amount</li>
          <li>• Commitment fees are usually 0.5% to 1.5% annually</li>
          <li>• Repayment is typically bullet payment at project completion</li>
        </ul>
      </div>
    </div>
  );
}
