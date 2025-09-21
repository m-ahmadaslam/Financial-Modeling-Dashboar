import { useState, useEffect, useCallback } from 'react';
import { backendAPI, ExcelAnalysisResult, FieldInfo, SectionInfo } from '@/lib/backend-api';

export interface UseBackendAPIState {
  analysis: ExcelAnalysisResult | null;
  loading: boolean;
  error: string | null;
  isConnected: boolean;
}

export interface UseBackendAPIActions {
  analyzeExcelFile: (filename: string) => Promise<void>;
  getCurrentAnalysis: () => Promise<void>;
  exportToCSV: () => Promise<any>;
  uploadExcelFile: (file: File) => Promise<void>;
  refreshAnalysis: () => Promise<void>;
  clearError: () => void;
}

export function useBackendAPI(): UseBackendAPIState & UseBackendAPIActions {
  const [analysis, setAnalysis] = useState<ExcelAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Check backend connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      await backendAPI.healthCheck();
      setIsConnected(true);
    } catch (err) {
      setIsConnected(false);
      console.warn('Backend not connected:', err);
    }
  }, []);

  const analyzeExcelFile = useCallback(async (filename: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await backendAPI.analyzeExcelFile(filename);
      setAnalysis(result);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze Excel file');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentAnalysis = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await backendAPI.getCurrentAnalysis();
      setAnalysis(result);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current analysis');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportToCSV = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await backendAPI.exportToCSV();
      setIsConnected(true);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export to CSV');
      setIsConnected(false);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadExcelFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await backendAPI.uploadExcelFile(file);
      setAnalysis(result);
      setIsConnected(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload Excel file');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshAnalysis = useCallback(async () => {
    if (analysis) {
      await getCurrentAnalysis();
    }
  }, [analysis, getCurrentAnalysis]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    analysis,
    loading,
    error,
    isConnected,
    
    // Actions
    analyzeExcelFile,
    getCurrentAnalysis,
    exportToCSV,
    uploadExcelFile,
    refreshAnalysis,
    clearError
  };
}

// Hook for getting specific data from analysis
export function useAnalysisData(analysis: ExcelAnalysisResult | null) {
  const [inputFields, setInputFields] = useState<FieldInfo[]>([]);
  const [calculatedFields, setCalculatedFields] = useState<FieldInfo[]>([]);
  const [sections, setSections] = useState<SectionInfo[]>([]);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    if (analysis) {
      setInputFields(backendAPI.getInputFields(analysis));
      setCalculatedFields(backendAPI.getCalculatedFields(analysis));
      setSections(analysis.sections);
      setStatistics(backendAPI.getAnalysisStatistics(analysis));
    } else {
      setInputFields([]);
      setCalculatedFields([]);
      setSections([]);
      setStatistics(null);
    }
  }, [analysis]);

  const getFieldsBySection = useCallback((sectionId: string) => {
    return analysis ? backendAPI.getFieldsBySection(analysis, sectionId) : [];
  }, [analysis]);

  const getFieldsByHeading = useCallback((sectionId: string, headingId: string) => {
    return analysis ? backendAPI.getFieldsByHeading(analysis, sectionId, headingId) : [];
  }, [analysis]);

  const getComprehensiveSections = useCallback(() => {
    return analysis ? backendAPI.transformToComprehensiveSections(analysis) : {};
  }, [analysis]);

  return {
    inputFields,
    calculatedFields,
    sections,
    statistics,
    getFieldsBySection,
    getFieldsByHeading,
    getComprehensiveSections
  };
}
