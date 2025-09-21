'use client';

import React, { useState, useEffect } from 'react';
import { FinancialFormulaEngine } from '@/lib/financial-formula-engine';
import { COMPLETE_FINANCIAL_MODEL } from '@/lib/complete-financial-model';
import { useBackendAPI } from '@/hooks/useBackendAPI';

export default function FinancialModelTester() {
  const [testResults, setTestResults] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const { analysis, isConnected } = useBackendAPI();

  const testFinancialModel = async () => {
    setIsTesting(true);
    
    try {
      // Test 1: Formula Engine with Real Data
      const formulaEngine = new FinancialFormulaEngine();
      
      // Sample real data from Ahmed.xlsx
      const testData = {
        field_32: new Date('2025-01-01'), // Project start date
        field_37: 12, // Construction period months
        field_40: 6, // Additional months
        field_58: 100, // Shareholding percentage
        field_2125: 0.05, // PV delay rate
        field_2126: 30, // Days per bank month
        civil_works_cost: 50000000, // $50M
        equipment_cost: 80000000, // $80M
        installation_cost: 20000000, // $20M
        contingency_cost: 15000000, // $15M
        annual_ebitda: 25000000, // $25M
        annual_debt_service: 12000000, // $12M
        total_equity: 100000000, // $100M
        annual_equity_cashflow: 15000000, // $15M
        project_life_years: 25,
        discount_rate: 0.08,
        annual_project_cashflow: 20000000 // $20M
      };

      const calculatedResults = formulaEngine.calculateFormulas(testData);
      
      // Test 2: Complete Financial Model Structure
      const modelStructure = COMPLETE_FINANCIAL_MODEL;
      const inputFields = Object.values(modelStructure)
        .flatMap(section => Object.values(section.headings))
        .flatMap(heading => heading.assumptions.filter(field => field.type === 'input'));
      
      const calculatedFields = Object.values(modelStructure)
        .flatMap(section => Object.values(section.headings))
        .flatMap(heading => heading.assumptions.filter(field => field.type === 'calculated'));

      // Test 3: Backend Integration
      const backendTest = {
        connected: isConnected,
        hasAnalysis: !!analysis,
        totalFields: analysis?.totalFields || 0,
        inputFields: analysis?.inputFields || 0,
        calculatedFields: analysis?.calculatedFields || 0
      };

      setTestResults({
        formulaEngine: {
          status: 'SUCCESS',
          results: calculatedResults,
          availableFormulas: FinancialFormulaEngine.getAvailableFormulas()
        },
        modelStructure: {
          status: 'SUCCESS',
          totalSections: Object.keys(modelStructure).length,
          totalInputFields: inputFields.length,
          totalCalculatedFields: calculatedFields.length,
          sections: Object.keys(modelStructure)
        },
        backendIntegration: {
          status: backendTest.connected ? 'SUCCESS' : 'WARNING',
          ...backendTest
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      setTestResults({
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    if (isConnected && analysis) {
      testFinancialModel();
    }
  }, [isConnected, analysis]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Financial Model Test Results
        </h2>
        <button
          onClick={testFinancialModel}
          disabled={isTesting}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded text-sm"
        >
          {isTesting ? 'Testing...' : 'Run Test'}
        </button>
      </div>

      {testResults && (
        <div className="space-y-4">
          {/* Formula Engine Test */}
          {testResults.formulaEngine && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-800 mb-2">
                ✅ Formula Engine Test - {testResults.formulaEngine.status}
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Calculated Results:</strong>
                  <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                    {JSON.stringify(testResults.formulaEngine.results, null, 2)}
                  </pre>
                </div>
                <div>
                  <strong>Available Formulas:</strong>
                  <div className="mt-1 text-xs">
                    {Object.keys(testResults.formulaEngine.availableFormulas).length} formulas loaded
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Model Structure Test */}
          {testResults.modelStructure && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-blue-800 mb-2">
                ✅ Model Structure Test - {testResults.modelStructure.status}
              </h3>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium">Sections</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {testResults.modelStructure.totalSections}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Input Fields</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {testResults.modelStructure.totalInputFields}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Calculated Fields</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {testResults.modelStructure.totalCalculatedFields}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Total Fields</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {testResults.modelStructure.totalInputFields + testResults.modelStructure.totalCalculatedFields}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Backend Integration Test */}
          {testResults.backendIntegration && (
            <div className={`border rounded-lg p-4 ${
              testResults.backendIntegration.status === 'SUCCESS' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <h3 className={`text-lg font-medium mb-2 ${
                testResults.backendIntegration.status === 'SUCCESS' 
                  ? 'text-green-800' 
                  : 'text-yellow-800'
              }`}>
                {testResults.backendIntegration.status === 'SUCCESS' ? '✅' : '⚠️'} 
                Backend Integration Test - {testResults.backendIntegration.status}
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium">Connection</div>
                  <div className={`text-lg font-bold ${
                    testResults.backendIntegration.connected ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {testResults.backendIntegration.connected ? 'Connected' : 'Disconnected'}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Analysis Available</div>
                  <div className={`text-lg font-bold ${
                    testResults.backendIntegration.hasAnalysis ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {testResults.backendIntegration.hasAnalysis ? 'Yes' : 'No'}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Total Fields</div>
                  <div className="text-lg font-bold text-blue-600">
                    {testResults.backendIntegration.totalFields}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {testResults.status === 'ERROR' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                ❌ Test Failed
              </h3>
              <p className="text-red-700">{testResults.error}</p>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            Test completed at: {new Date(testResults.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {!testResults && !isTesting && (
        <div className="text-center text-gray-500 py-8">
          Click "Run Test" to test the complete financial model with real data
        </div>
      )}
    </div>
  );
}
