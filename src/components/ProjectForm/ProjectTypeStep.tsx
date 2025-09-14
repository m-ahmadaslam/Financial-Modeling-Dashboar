"use client";

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ProjectTypeStepProps {
  formData: Record<string, string>;
  errors: {[key: string]: string};
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  isViewMode: boolean;
}

export default function ProjectTypeStep({ formData, errors, handleChange, isViewMode }: ProjectTypeStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-3 shadow-lg">
          <span className="text-xl">🏗️</span>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Project Type
        </h2>
        <p className="text-gray-600 mt-1">Select the type of project you&apos;re creating</p>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-orange-600 transition-colors">
            Select Project Type *
          </label>
          <div className="relative">
            <select
              name="projectType"
              value={formData.projectType}
              onChange={handleChange}
              disabled={isViewMode}
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 text-gray-900 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md appearance-none ${
                errors.projectType ? 'border-red-500 focus:ring-red-100 focus:border-red-500' : 'border-gray-200'
              } ${isViewMode ? 'opacity-60 cursor-not-allowed' : ''}`}
              required
            >
              <option value="">Select a type</option>
              <option value="solar">Solar</option>
              <option value="wind">Wind</option>
              <option value="hydro">Hydro</option>
              <option value="thermal">Thermal</option>
            </select>
            {errors.projectType && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.projectType && (
            <p className="mt-1 text-sm text-red-600">{errors.projectType}</p>
          )}
        </div>
      </div>
    </div>
  );
}
