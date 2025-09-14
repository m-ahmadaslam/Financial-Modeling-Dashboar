"use client";

import { useState } from "react";

interface AssumptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: Record<string, string>;
  currentStep: number;
  steps: Array<{ name: string; icon: string; description: string; color: string }>;
}

export default function AssumptionsModal({ 
  isOpen, 
  onClose, 
  formData, 
  currentStep, 
  steps 
}: AssumptionsModalProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'json'>('cards');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <span className="text-2xl">👁️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">All Project Assumptions</h2>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-sm text-gray-600">Project: {formData.projectName || 'Untitled'}</span>
                  <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-200">
                    Version: {formData.version}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
          
          {/* View Mode Tabs */}
          <div className="mt-4 flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'cards'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Card View
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'json'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📄 JSON View
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Info Section */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <span className="mr-2">📋</span>
                  Project Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Reference:</span>
                    <span className="text-blue-900">{formData.projectReference || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Name:</span>
                    <span className="text-blue-900">{formData.projectName || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Country:</span>
                    <span className="text-blue-900">{formData.country || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">City:</span>
                    <span className="text-blue-900">{formData.city || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Stage:</span>
                    <span className="text-blue-900">{formData.stage || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Offtaker:</span>
                    <span className="text-blue-900">{formData.offtaker || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Model Status:</span>
                    <span className="text-blue-900">{formData.modelStatus || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Currency Settings Section */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <span className="mr-2">💱</span>
                  Currency Settings
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Base Currency:</span>
                    <span className="text-blue-900">{formData.reportingBaseCurrency || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Alt Currency:</span>
                    <span className="text-blue-900">{formData.reportingAlternateCurrency || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Base Unit:</span>
                    <span className="text-blue-900">{formData.baseCurrencyUnit || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Alt Unit:</span>
                    <span className="text-blue-900">{formData.alternateCurrencyUnit || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Timelines Section */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
                  <span className="mr-2">📅</span>
                  Timelines
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">Model Start:</span>
                    <span className="text-green-900">{formData.modelStartDate || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">Bid Submission:</span>
                    <span className="text-green-900">{formData.bidSubmissionDate || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">PPA Signing:</span>
                    <span className="text-green-900">{formData.ppaSigningDate || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">FC Date (PPA):</span>
                    <span className="text-green-900">{formData.financialCloseDateAsPerPPA || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">Target FC:</span>
                    <span className="text-green-900">{formData.targetFCDate || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">Construction Period:</span>
                    <span className="text-green-900">{formData.constructionPeriod ? `${formData.constructionPeriod} months` : 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">Scheduled PCOD:</span>
                    <span className="text-green-900">{formData.scheduledPCOD || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">Longstop Date:</span>
                    <span className="text-green-900">{formData.longstopDate || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">PPA Tenor:</span>
                    <span className="text-green-900">{formData.tenorOfPPA ? `${formData.tenorOfPPA} years` : 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-green-800">EBL Max Tenor:</span>
                    <span className="text-green-900">{formData.eblMaxTenorAsPerRFP ? `${formData.eblMaxTenorAsPerRFP} years after FC` : 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Project Type Section */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
                  <span className="mr-2">🏗️</span>
                  Project Type
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-purple-800">Type:</span>
                    <span className="text-purple-900">{formData.projectType || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Plant Assumptions Section */}
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center">
                  <span className="mr-2">⚡</span>
                  Plant Assumptions
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-indigo-800">Capacity AC:</span>
                    <span className="text-indigo-900">{formData.plantCapacityAC ? `${formData.plantCapacityAC} MW` : 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-indigo-800">Capacity DC:</span>
                    <span className="text-indigo-900">{formData.plantCapacityDC ? `${formData.plantCapacityDC} MW` : 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-indigo-800">PLF:</span>
                    <span className="text-indigo-900">{formData.plf ? `${formData.plf}%` : 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-indigo-800">Degradation Start:</span>
                    <span className="text-indigo-900">{formData.degradationStartYear || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Financial Assumptions Section */}
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center">
                  <span className="mr-2">💰</span>
                  Financial Assumptions
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-yellow-800">Tariff:</span>
                    <span className="text-yellow-900">{formData.tariff || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-yellow-800">Exchange Rate:</span>
                    <span className="text-yellow-900">{formData.exchangeRate || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-yellow-800">Inflation Rate:</span>
                    <span className="text-yellow-900">{formData.inflationRate || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-yellow-800">Project Life:</span>
                    <span className="text-yellow-900">{formData.projectLife ? `${formData.projectLife} years` : 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Financing Section */}
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                <h3 className="text-lg font-semibold text-pink-900 mb-3 flex items-center">
                  <span className="mr-2">🏦</span>
                  Financing
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-pink-800">Debt-Equity Ratio:</span>
                    <span className="text-pink-900">{formData.debtEquityRatio || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-pink-800">Interest Rate:</span>
                    <span className="text-pink-900">{formData.interestRate || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-pink-800">Moratorium Period:</span>
                    <span className="text-pink-900">{formData.moratoriumPeriod || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* VAT Assumptions Section */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center">
                  <span className="mr-2">🧾</span>
                  VAT Assumptions
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-red-800">VAT Rate:</span>
                    <span className="text-red-900">{formData.vatRate ? `${formData.vatRate}%` : 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-red-800">Recovery Period:</span>
                    <span className="text-red-900">{formData.vatRecoveryPeriod || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Custom Duty Section */}
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center">
                  <span className="mr-2">📦</span>
                  Custom Duty
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-orange-800">Duty Rate:</span>
                    <span className="text-orange-900">{formData.customDutyRate ? `${formData.customDutyRate}%` : 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-orange-800">Equipment Duty:</span>
                    <span className="text-orange-900">{formData.importDutyEquipment || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* OPEX Assumptions Section */}
              <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
                <h3 className="text-lg font-semibold text-teal-900 mb-3 flex items-center">
                  <span className="mr-2">💼</span>
                  OPEX Assumptions
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-teal-800">OM Cost:</span>
                    <span className="text-teal-900">{formData.omCost || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-teal-800">Insurance Cost:</span>
                    <span className="text-teal-900">{formData.insuranceCost || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-teal-800">Land Lease Cost:</span>
                    <span className="text-teal-900">{formData.landLeaseCost || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Debt Assumptions Section */}
              <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                <h3 className="text-lg font-semibold text-cyan-900 mb-3 flex items-center">
                  <span className="mr-2">💳</span>
                  Debt Assumptions
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-cyan-800">Debt Amount:</span>
                    <span className="text-cyan-900">{formData.debtAmount || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-cyan-800">Interest Rate:</span>
                    <span className="text-cyan-900">{formData.debtInterestRate || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-cyan-800">Tenor:</span>
                    <span className="text-cyan-900">{formData.debtTenor || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* EBL Assumptions Section */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-900 mb-3 flex items-center">
                  <span className="mr-2">📊</span>
                  EBL Assumptions
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-emerald-800">EBL Amount:</span>
                    <span className="text-emerald-900">{formData.eblAmount || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-emerald-800">Interest Rate:</span>
                    <span className="text-emerald-900">{formData.eblInterestRate || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-emerald-800">Tenor:</span>
                    <span className="text-emerald-900">{formData.eblTenor || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Terminal Value Section */}
              <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
                <h3 className="text-lg font-semibold text-rose-900 mb-3 flex items-center">
                  <span className="mr-2">🎯</span>
                  Terminal Value
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-rose-800">Method:</span>
                    <span className="text-rose-900">{formData.terminalValueMethod || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-rose-800">Growth Rate:</span>
                    <span className="text-rose-900">{formData.terminalGrowthRate || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-rose-800">Exit Multiple:</span>
                    <span className="text-rose-900">{formData.exitMultiple || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* IRR Section */}
              <div className="bg-violet-50 rounded-xl p-4 border border-violet-200">
                <h3 className="text-lg font-semibold text-violet-900 mb-3 flex items-center">
                  <span className="mr-2">📈</span>
                  IRR & Returns
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-violet-800">Target IRR:</span>
                    <span className="text-violet-900">{formData.targetIRR ? `${formData.targetIRR}%` : 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-violet-800">Hurdle Rate:</span>
                    <span className="text-violet-900">{formData.hurdleRate ? `${formData.hurdleRate}%` : 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-violet-800">Payback Period:</span>
                    <span className="text-violet-900">{formData.paybackPeriodTarget || 'Not specified'}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">📄</span>
                  JSON View of All Assumptions
                </h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{JSON.stringify(formData, null, 2)}</pre>
                </div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">JSON Summary</h3>
                <div className="text-sm text-blue-800 space-y-2">
                  <p><strong>Total Fields:</strong> {Object.keys(formData).length}</p>
                  <p><strong>Filled Fields:</strong> {Object.values(formData).filter(value => value && value.trim() !== '').length}</p>
                  <p><strong>Empty Fields:</strong> {Object.values(formData).filter(value => !value || value.trim() === '').length}</p>
                  <p><strong>Completion Rate:</strong> {Math.round((Object.values(formData).filter(value => value && value.trim() !== '').length / Object.keys(formData).length) * 100)}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Summary Section - Only shown in card view */}
          {viewMode === 'cards' && (
            <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">📊</span>
                Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.values(formData).filter(value => value && value.trim() !== '').length}
                  </div>
                  <div className="text-gray-600">Fields Filled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((Object.values(formData).filter(value => value && value.trim() !== '').length / Object.keys(formData).length) * 100)}%
                  </div>
                  <div className="text-gray-600">Completion</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentStep + 1}
                  </div>
                  <div className="text-gray-600">Current Step</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {steps.length}
                  </div>
                  <div className="text-gray-600">Total Steps</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200 flex-shrink-0">
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleString()}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
