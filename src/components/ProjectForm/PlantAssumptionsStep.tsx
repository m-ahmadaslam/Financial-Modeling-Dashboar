"use client";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface PlantAssumptionsStepProps {
  formData: Record<string, string>;
  errors: {[key: string]: string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode: boolean;
}

export default function PlantAssumptionsStep({ formData, errors, handleChange, isViewMode }: PlantAssumptionsStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-3 shadow-lg">
          <span className="text-xl">⚡</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Plant Assumptions
        </h2>
        <p className="text-gray-600 mt-1">
          {formData.projectType ? 
            `Configure ${formData.projectType.charAt(0).toUpperCase() + formData.projectType.slice(1)} plant specifications` : 
            'Configure plant capacity and performance parameters'
          }
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Plant Capacity AC */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
            Plant Capacity (MW AC) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="plantCapacityAC"
              value={formData.plantCapacityAC}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.plantCapacityAC ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00"
              required
            />
            {errors.plantCapacityAC && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.plantCapacityAC && (
            <p className="mt-1 text-sm text-red-600">{errors.plantCapacityAC}</p>
          )}
        </div>

        {/* Plant Capacity DC - Only for Solar */}
        {formData.projectType === 'solar' && (
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
              Plant Capacity (MW DC)
            </label>
            <div className="relative">
              <input
                type="number"
                name="plantCapacityDC"
                value={formData.plantCapacityDC}
                onChange={handleChange}
                disabled={isViewMode}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                  errors.plantCapacityDC ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
                } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
                placeholder="0.00"
              />
              {errors.plantCapacityDC && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {errors.plantCapacityDC && (
              <p className="mt-1 text-sm text-red-600">{errors.plantCapacityDC}</p>
            )}
          </div>
        )}

        {/* PLF - Plant Load Factor */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
            PLF (Plant Load Factor) *
          </label>
          <div className="relative">
            <input
              type="number"
              name="plf"
              value={formData.plf}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="100"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.plf ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
              required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.plf && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.plf && (
            <p className="mt-1 text-sm text-red-600">{errors.plf}</p>
          )}
        </div>

        {/* Degradation Start Year */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
            Degradation Start (Year)
          </label>
          <div className="relative">
            <input
              type="number"
              name="degradationStartYear"
              value={formData.degradationStartYear}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.degradationStartYear ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="1.00"
            />
            {errors.degradationStartYear && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.degradationStartYear && (
            <p className="mt-1 text-sm text-red-600">{errors.degradationStartYear}</p>
          )}
        </div>

        {/* Degradation First Year */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
            Degradation - First Year
          </label>
          <div className="relative">
            <input
              type="number"
              name="degradationFirstYear"
              value={formData.degradationFirstYear}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="100"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.degradationFirstYear ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.degradationFirstYear && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.degradationFirstYear && (
            <p className="mt-1 text-sm text-red-600">{errors.degradationFirstYear}</p>
          )}
        </div>

        {/* Degradation Second Year Onward */}
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
            Degradation - Second Year Onward
          </label>
          <div className="relative">
            <input
              type="number"
              name="degradationSecondYear"
              value={formData.degradationSecondYear}
              onChange={handleChange}
              disabled={isViewMode}
              step="0.01"
              min="0"
              max="100"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md ${
                errors.degradationSecondYear ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              placeholder="0.00%"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">%</span>
            </div>
            {errors.degradationSecondYear && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-8">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.degradationSecondYear && (
            <p className="mt-1 text-sm text-red-600">{errors.degradationSecondYear}</p>
          )}
        </div>
      </div>

      {/* Project Type Specific Information */}
      {formData.projectType && (
        <div className="mt-6 p-4 bg-blue-50/50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            {formData.projectType.charAt(0).toUpperCase() + formData.projectType.slice(1)} Project Guidelines:
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            {formData.projectType === 'solar' && (
              <>
                <li>• Solar projects typically have PLF between 15-25%</li>
                <li>• DC capacity is usually 1.2-1.4x the AC capacity</li>
                <li>• Degradation typically starts from year 1</li>
                <li>• First year degradation: 0.5-1.5%</li>
                <li>• Annual degradation: 0.5-0.8%</li>
              </>
            )}
            {formData.projectType === 'wind' && (
              <>
                <li>• Wind projects typically have PLF between 25-40%</li>
                <li>• Degradation typically starts from year 1</li>
                <li>• First year degradation: 1-2%</li>
                <li>• Annual degradation: 0.5-1%</li>
              </>
            )}
            {formData.projectType === 'hydro' && (
              <>
                <li>• Hydro projects typically have PLF between 30-60%</li>
                <li>• Degradation is minimal for hydro projects</li>
                <li>• First year degradation: 0-0.5%</li>
                <li>• Annual degradation: 0-0.2%</li>
              </>
            )}
            {formData.projectType === 'thermal' && (
              <>
                <li>• Thermal projects typically have PLF between 60-85%</li>
                <li>• Degradation typically starts from year 1</li>
                <li>• First year degradation: 1-3%</li>
                <li>• Annual degradation: 0.5-1.5%</li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
