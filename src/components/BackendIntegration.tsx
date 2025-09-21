'use client';

import React, { useState, useEffect } from 'react';
import { useBackendAPI, useAnalysisData } from '@/hooks/useBackendAPI';
import { backendAPI } from '@/lib/backend-api';

interface BackendIntegrationProps {
  onAnalysisComplete?: (analysis: any) => void;
  onError?: (error: string) => void;
}

export default function BackendIntegration({ onAnalysisComplete, onError }: BackendIntegrationProps) {
  const {
    analysis,
    loading,
    error,
    isConnected,
    analyzeExcelFile,
    getCurrentAnalysis,
    exportToCSV,
    uploadExcelFile,
    clearError
  } = useBackendAPI();

  const {
    inputFields,
    calculatedFields,
    sections,
    statistics,
    getComprehensiveSections
  } = useAnalysisData(analysis);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  // Auto-analyze Ahmed.xlsx on component mount
  useEffect(() => {
    if (isConnected && !analysis) {
      analyzeExcelFile('Ahmed.xlsx');
    }
  }, [isConnected, analysis, analyzeExcelFile]);

  // Notify parent component when analysis is complete
  useEffect(() => {
    if (analysis && onAnalysisComplete) {
      const comprehensiveSections = getComprehensiveSections();
      onAnalysisComplete({
        analysis,
        comprehensiveSections,
        inputFields,
        calculatedFields,
        statistics
      });
    }
  }, [analysis, onAnalysisComplete, getComprehensiveSections, inputFields, calculatedFields, statistics]);

  // Notify parent component of errors
  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      await uploadExcelFile(file);
    }
  };

  const handleExportCSV = async () => {
    try {
      const csvData = await exportToCSV();
      // Create and download CSV file
      const blob = new Blob([JSON.stringify(csvData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'excel-analysis.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Backend Not Connected
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Make sure the FastAPI backend is running on port 8000.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm"
              >
                Retry Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-3 w-3 bg-green-400 rounded-full"></div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">
              Backend Connected
            </h3>
            <p className="text-sm text-gray-500">
              FastAPI backend is running and ready
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            {showUpload ? 'Hide Upload' : 'Upload Excel'}
          </button>
          <button
            onClick={handleExportCSV}
            disabled={!analysis}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm"
          >
            Export CSV
          </button>
        </div>
      </div>

      {showUpload && (
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Excel File
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      )}

      {loading && (
        <div className="mt-4 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Analyzing Excel file...</span>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <button
                  onClick={clearError}
                  className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {analysis && statistics && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{statistics.totalSheets}</div>
            <div className="text-sm text-blue-800">Sheets</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{statistics.totalFields}</div>
            <div className="text-sm text-green-800">Total Fields</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{statistics.inputFields}</div>
            <div className="text-sm text-purple-800">Input Fields</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{statistics.calculatedFields}</div>
            <div className="text-sm text-orange-800">Calculated Fields</div>
          </div>
        </div>
      )}
    </div>
  );
}
