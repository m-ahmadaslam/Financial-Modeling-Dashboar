"use client";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ProjectInfoStepProps {
  formData: Record<string, string>;
  errors: {[key: string]: string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode: boolean;
}

// Enterprise Project Lifecycle Phases
const LIFECYCLE_PHASES = [
  { 
    id: 'estimation', 
    name: 'Estimation', 
    description: 'Initial project assessment and cost estimation'
  },
  { 
    id: 'awarded', 
    name: 'Awarded', 
    description: 'Project has been awarded and contract signed'
  },
  { 
    id: 'post_award', 
    name: 'Post Award', 
    description: 'Post-award planning and preparation phase'
  },
  { 
    id: 'rev_0', 
    name: 'Rev 0', 
    description: 'Initial revision and baseline establishment'
  },
  { 
    id: 'execution', 
    name: 'Execution', 
    description: 'Active project execution and implementation'
  },
  { 
    id: 'operation_maintenance', 
    name: 'Operation & Maintenance', 
    description: 'Operational phase and ongoing maintenance'
  },
  { 
    id: 'closing', 
    name: 'Closing', 
    description: 'Project closure and final deliverables'
  }
];

export default function ProjectInfoStep({ formData, errors, handleChange, isViewMode }: ProjectInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-3 shadow-lg">
          <span className="text-xl">📋</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Project Information
        </h2>
        <p className="text-gray-600 mt-1">Let&apos;s start with the basic details of your project</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
            Project Reference *
          </label>
          <div className="relative">
            <input
              type="text"
              name="projectReference"
              value={formData.projectReference}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.projectReference ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="Enter project reference"
              required
            />
            {errors.projectReference && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.projectReference && (
            <p className="mt-1 text-sm text-red-600">{errors.projectReference}</p>
          )}
        </div>
        
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
            Project Name *
          </label>
          <div className="relative">
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.projectName ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="Project Name"
              required
            />
            {errors.projectName && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.projectName && (
            <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>
          )}
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
            Lifecycle Phase *
          </label>
          <div className="relative">
            <select
              name="lifecyclePhase"
              value={formData.lifecyclePhase || 'estimation'}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.lifecyclePhase ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              required
            >
              {LIFECYCLE_PHASES.map((phase) => (
                <option key={phase.id} value={phase.id}>
                  {phase.name}
                </option>
              ))}
            </select>
            {errors.lifecyclePhase && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.lifecyclePhase && (
            <p className="mt-1 text-sm text-red-600">{errors.lifecyclePhase}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {LIFECYCLE_PHASES.find(p => p.id === formData.lifecyclePhase)?.description}
          </p>
        </div>
        
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
            Country *
          </label>
          <div className="relative">
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.country ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="Country"
              required
            />
            {errors.country && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country}</p>
          )}
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
            Offtaker
          </label>
          <div className="relative">
            <input
              type="text"
              name="offtaker"
              value={formData.offtaker}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.offtaker ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="Offtaker"
            />
            {errors.offtaker && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.offtaker && (
            <p className="mt-1 text-sm text-red-600">{errors.offtaker}</p>
          )}
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
            Model Status
          </label>
          <div className="relative">
            <select
              name="modelStatus"
              value={formData.modelStatus || 'estimation'}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.modelStatus ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <option value="estimation">Estimation</option>
              <option value="fc_model">FC Model</option>
              <option value="bid_model">Bid Model</option>
              <option value="execution">Execution</option>
            </select>
            {errors.modelStatus && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.modelStatus && (
            <p className="mt-1 text-sm text-red-600">{errors.modelStatus}</p>
          )}
        </div>
        
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
            City
          </label>
          <div className="relative">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.city ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="City"
            />
            {errors.city && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.city && (
            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
          )}
        </div>
        
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
            Stage
          </label>
          <div className="relative">
            <input
              type="text"
              name="stage"
              value={formData.stage}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.stage ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="Project Stage"
            />
            {errors.stage && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.stage && (
            <p className="mt-1 text-sm text-red-600">{errors.stage}</p>
          )}
        </div>

        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
            Project Version *
          </label>
          <div className="relative">
            <input
              type="text"
              name="version"
              value={formData.version || ''}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.version ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="1.0.0"
              required
            />
            {errors.version && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.version && (
            <p className="mt-1 text-sm text-red-600">{errors.version}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Use semantic versioning: MAJOR.MINOR.PATCH (e.g., 1.0.0)
          </p>
        </div>
      </div>

      {/* Currency Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
          Currency Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
              Reporting Base Currency
            </label>
            <div className="relative">
              <input
                type="text"
                name="reportingBaseCurrency"
                value={formData.reportingBaseCurrency}
                onChange={handleChange}
                disabled={isViewMode}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                  errors.reportingBaseCurrency ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
                } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="'000 SAR"
              />
              {errors.reportingBaseCurrency && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {errors.reportingBaseCurrency && (
              <p className="mt-1 text-sm text-red-600">{errors.reportingBaseCurrency}</p>
            )}
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
              Reporting Alternate Currency
            </label>
            <div className="relative">
              <input
                type="text"
                name="reportingAlternateCurrency"
                value={formData.reportingAlternateCurrency}
                onChange={handleChange}
                disabled={isViewMode}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                  errors.reportingAlternateCurrency ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
                } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="'000 USD"
              />
              {errors.reportingAlternateCurrency && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {errors.reportingAlternateCurrency && (
              <p className="mt-1 text-sm text-red-600">{errors.reportingAlternateCurrency}</p>
            )}
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
              Base Currency Unit
            </label>
            <div className="relative">
              <input
                type="text"
                name="baseCurrencyUnit"
                value={formData.baseCurrencyUnit}
                onChange={handleChange}
                disabled={isViewMode}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                  errors.baseCurrencyUnit ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
                } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="SAR"
              />
              {errors.baseCurrencyUnit && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {errors.baseCurrencyUnit && (
              <p className="mt-1 text-sm text-red-600">{errors.baseCurrencyUnit}</p>
            )}
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
              Alternate Currency Unit
            </label>
            <div className="relative">
              <input
                type="text"
                name="alternateCurrencyUnit"
                value={formData.alternateCurrencyUnit}
                onChange={handleChange}
                disabled={isViewMode}
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                  errors.alternateCurrencyUnit ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
                } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="USD"
              />
              {errors.alternateCurrencyUnit && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {errors.alternateCurrencyUnit && (
              <p className="mt-1 text-sm text-red-600">{errors.alternateCurrencyUnit}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
