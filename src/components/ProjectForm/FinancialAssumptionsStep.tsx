"use client";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface FinancialAssumptionsStepProps {
  formData: Record<string, string>;
  errors: {[key: string]: string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode: boolean;
}

export default function FinancialAssumptionsStep({ formData, errors, handleChange, isViewMode }: FinancialAssumptionsStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full mb-3 shadow-lg">
          <span className="text-xl">💰</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Financial Assumptions
        </h2>
        <p className="text-gray-600 mt-1">Define the financial parameters for your project</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tariff */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-emerald-600 transition-colors">
            Tariff (USD/kWh) *
          </label>
          <div className="relative">
                         <input
               type="number"
               name="tariff"
               value={formData.tariff}
               onChange={handleChange}
               disabled={isViewMode}
               step="0.001"
               min="0"
               className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                 errors.tariff ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
               } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
               placeholder="0.000"
               required
             />
            {errors.tariff && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.tariff && (
            <p className="mt-1 text-sm text-red-600">{errors.tariff}</p>
          )}
        </div>

        {/* Exchange Rate */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-emerald-600 transition-colors">
            Exchange Rate (USD to Local)
          </label>
          <div className="relative">
            <input
              type="number"
              name="exchangeRate"
              value={formData.exchangeRate}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
                             className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                 errors.exchangeRate ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
               } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00"
            />
            {errors.exchangeRate && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.exchangeRate && (
            <p className="mt-1 text-sm text-red-600">{errors.exchangeRate}</p>
          )}
        </div>

                {/* Inflation Rate */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-emerald-600 transition-colors">
            Inflation Rate (%)
          </label>
          <div className="relative">
            <input
              type="number"
              name="inflationRate"
              value={formData.inflationRate}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="100"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.inflationRate ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.inflationRate && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.inflationRate && (
            <p className="mt-1 text-sm text-red-600">{errors.inflationRate}</p>
          )}
        </div>

        {/* Project Life */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-emerald-600 transition-colors">
            Project Life (Years) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="projectLife"
              value={formData.projectLife}
              onChange={handleChange}
              disabled={isViewMode}
              step="1"
              min="1"
              max="50"
                             className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                 errors.projectLife ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
               } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="25"
              required
            />
            {errors.projectLife && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.projectLife && (
            <p className="mt-1 text-sm text-red-600">{errors.projectLife}</p>
          )}
        </div>

        {/* Construction Period */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-emerald-600 transition-colors">
            Construction Period (Years)
          </label>
          <div className="relative">
            <input
              type="number"
              name="constructionPeriod"
              value={formData.constructionPeriod}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.5"
              min="0.5"
              max="10"
                             className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                 errors.constructionPeriod ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
               } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="2.0"
            />
            {errors.constructionPeriod && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.constructionPeriod && (
            <p className="mt-1 text-sm text-red-600">{errors.constructionPeriod}</p>
          )}
        </div>

        {/* Debt Service Reserve */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-emerald-600 transition-colors">
            Debt Service Reserve (Months)
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
                             className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                 errors.debtServiceReserve ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
               } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="6"
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
      </div>

              {/* Financial Guidelines */}
        <div className="mt-6 p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg">
          <h3 className="text-sm font-semibold text-emerald-800 mb-2">
            Financial Guidelines:
          </h3>
          <ul className="text-sm text-emerald-700 space-y-1">
          <li>• Tariff typically ranges from 0.03 to 0.15 USD/kWh depending on technology and location</li>
          <li>• Exchange rates should reflect current market conditions</li>
          <li>• Inflation rates vary by country (typically 2-8% annually)</li>
          <li>• Project life: Solar/Wind (25-30 years), Hydro (30-50 years), Thermal (20-30 years)</li>
          <li>• Construction period: Solar (1-2 years), Wind (1-3 years), Hydro (3-8 years), Thermal (2-5 years)</li>
          <li>• Debt service reserve typically covers 6-12 months of debt obligations</li>
        </ul>
      </div>
    </div>
  );
}
