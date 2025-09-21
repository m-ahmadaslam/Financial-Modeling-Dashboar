"use client";

import { useState, useEffect } from "react";
import { createNotification, notificationTemplates } from "@/lib/notifications";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  DocumentTextIcon,
  PencilIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BookmarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

// Import step components
import ProjectInfoStep from './ProjectInfoStep';
import TimelinesStep from './TimelinesStep';
import ProjectTypeStep from './ProjectTypeStep';
import RealInputSheetStep from './RealInputSheetStep';

interface ProjectFormContainerProps {
  isViewMode?: boolean;
}

interface DraftInfo {
  _id: string;
  projectName: string;
  projectReference: string;
  projectType: string;
  country: string;
  city: string;
  stage: string;
  currentStep: number;
  lastSaved: string;
  status: string;
  formData: Record<string, string>;
  version?: string;
}

export default function ProjectFormContainer({ isViewMode = false }: ProjectFormContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draft');

  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({
    // Project Info
    projectReference: '',
    projectName: '',
    country: '',
    city: '',
    stage: '',
    version: '',
    offtaker: '',
    modelStatus: '',
    reportingBaseCurrency: '',
    reportingAlternateCurrency: '',
    baseCurrencyUnit: '',
    alternateCurrencyUnit: '',
    
    // Timelines - Model & Bid Dates
    modelStartDate: '',
    bidSubmissionDate: '',
    ppaSigningDate: '',
    
    // Timelines - Financial Close
    financialCloseDateAsPerPPA: '',
    targetFCDate: '',
    financialCloseDateBeforeSensitivity: '',
    
    // Timelines - Construction
    constructionPeriodStartDate: '',
    earliestConnectionDateAsPerPPA: '',
    earliestConnectionDate: '',
    scheduledFirstConstructionMilestoneDateAsPerPPA: '',
    scheduledFirstConstructionMilestoneDate: '',
    constructionPeriod: '',
    
    // Timelines - Commercial Operation
    scheduledPCODAsPerPPA: '',
    scheduledPCOD: '',
    projectConstructionOverDate: '',
    commercialOperationDate: '',
    longstopDate: '',
    
    // Timelines - PPA Details
    tenorOfPPA: '',
    endOfCommercialOperations: '',
    extensionInPPA: '',
    endOfExtensionPeriod: '',
    
    // Timelines - Financing Terms
    eblMaxTenorAsPerRFP: '',
    maxTargetRefinancingDateAsPerRFP: '',
    
    // Legacy timeline fields (keeping for backward compatibility)
    bidDate: '',
    fcDate: '',
    cod: '',
    
    // Project Type
    projectType: '',
    
    // Plant Assumptions
    plantCapacityAC: '',
    plantCapacityDC: '',
    plf: '',
    degradationStartYear: '',
    degradationFirstYear: '',
    degradationSecondYear: '',
    
    // Financial Assumptions
    tariff: '',
    exchangeRate: '',
    inflationRate: '',
    projectLife: '',
    
    // Financing
    debtEquityRatio: '',
    interestRate: '',
    moratoriumPeriod: '',
    repaymentFrequency: '',
    upfrontFee: '',
    
    // VAT Assumptions
    vatRate: '',
    vatRecoveryPeriod: '',
    vatOnEquipment: '',
    vatOnServices: '',
    
    // Custom Duty
    customDutyRate: '',
    importDutyEquipment: '',
    importDutySpares: '',
    customsHandlingCharges: '',
    
    // Opex Assumptions
    omCost: '',
    insuranceCost: '',
    landLeaseCost: '',
    administrativeCost: '',
    omEscalation: '',
    majorMaintenanceCost: '',
    
    // Debt Assumptions
    debtAmount: '',
    debtInterestRate: '',
    debtTenor: '',
    debtServiceReserve: '',
    debtArrangementFee: '',
    debtCommitmentFee: '',
    
    // EBL Assumptions
    eblAmount: '',
    eblInterestRate: '',
    eblTenor: '',
    eblArrangementFee: '',
    eblCommitmentFee: '',
    eblRepaymentSchedule: '',
    
    // Terminal Value
    terminalValueMethod: '',
    terminalGrowthRate: '',
    exitMultiple: '',
    liquidationValue: '',
    terminalValueDiscountRate: '',
    terminalValueYear: '',
    
    // IRR
    targetIRR: '',
    hurdleRate: '',
    paybackPeriodTarget: '',
    npvTarget: '',
    dscrTarget: '',
    sensitivityAnalysisRange: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showFinalizationModal, setShowFinalizationModal] = useState(false);
  const [finalizationStep, setFinalizationStep] = useState(1);
  const [finalizationLoading, setFinalizationLoading] = useState(false);
  const [draftInfo, setDraftInfo] = useState<DraftInfo | null>(null);
  
  // Search functionality state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  
  // Searchable fields mapping
  const searchableFields = [
    { name: 'Input Sheet Data', keywords: ['input', 'sheet', 'data', 'financial', 'plant', 'financing', 'tax', 'debt', 'irr', 'terminal', 'opex', 'custom', 'ebl', 'assumptions', 'project', 'basic', 'timeline', 'macroeconomic'], stepIndex: 1, id: 'input-sheet-data' },
    { name: 'Project Type', keywords: ['type', 'classification', 'version'], stepIndex: 0, id: 'project-type' }
  ];

  const steps = [
    { name: 'Project Type', icon: '🏗️', description: 'Project classification & version', color: 'purple' },
    { name: 'Input Sheet Data', icon: '📊', description: 'Comprehensive financial model with 1000+ fields', color: 'indigo' },
  ];

  // Load draft if draftId is present
  useEffect(() => {
    if (draftId && !isViewMode) {
      loadDraft(draftId);
    }
  }, [draftId, isViewMode]);

  // Keyboard shortcut for search (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadDraft = async (id: string) => {
    setIsLoadingDraft(true);
    try {
      const response = await fetch(`/api/projects/draft/${id}`);
      if (response.ok) {
        const draft = await response.json();
        setFormData(draft.formData);
        setCurrentStep(draft.currentStep);
        setProjectId(draft._id);
        setDraftInfo(draft);
        
        // Mark steps as completed based on the draft's current step
        const completed = new Set<number>();
        for (let i = 0; i < draft.currentStep; i++) {
          completed.add(i);
        }
        setCompletedSteps(completed);

        // Save current project to localStorage for assumptions page
        if (draft.formData.projectName && draft.formData.version) {
          localStorage.setItem('currentProject', JSON.stringify({
            name: draft.formData.projectName,
            version: draft.formData.version,
            reference: draft.formData.projectReference || 'N/A'
          }));
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    } finally {
      setIsLoadingDraft(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (isViewMode) return;
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Save current project to localStorage for assumptions page when key fields change
    if (['projectName', 'version', 'projectReference'].includes(name)) {
      const updatedFormData = { ...formData, [name]: value };
      if (updatedFormData.projectName && updatedFormData.version) {
        localStorage.setItem('currentProject', JSON.stringify({
          name: updatedFormData.projectName,
          version: updatedFormData.version,
          reference: updatedFormData.projectReference || 'N/A'
        }));
      }
    }
  };

  // Smart validation that only validates essential fields for each step
  const validateCurrentStep = (): boolean => {
    // COMMENTED OUT FOR TESTING - All validation disabled
    // const newErrors: {[key: string]: string} = {};
    
    // switch (currentStep) {
    //   case 0: // Project Info - Essential for any project
    //     if (!formData.projectReference?.trim()) newErrors.projectReference = 'Project Reference is required';
    //     if (!formData.projectName?.trim()) newErrors.projectName = 'Project Name is required';
    //     if (!formData.country?.trim()) newErrors.country = 'Country is required';
    //     if (!formData.version?.trim()) newErrors.version = 'Project Version is required';
    //     break;
    //   case 1: // Timelines - Essential dates for project planning
    //     if (!formData.modelStartDate?.trim()) newErrors.modelStartDate = 'Model Start Date is required';
    //     if (!formData.bidSubmissionDate?.trim()) newErrors.bidSubmissionDate = 'Bid Submission Date is required';
    //     if (!formData.financialCloseDateAsPerPPA?.trim()) newErrors.financialCloseDateAsPerPPA = 'Financial Close Date as per PPA is required';
    //     if (!formData.targetFCDate?.trim()) newErrors.targetFCDate = 'Target FC Date is required';
    //     if (!formData.earliestConnectionDateAsPerPPA?.trim()) newErrors.earliestConnectionDateAsPerPPA = 'Earliest Connection Date as per PPA is required';
    //     if (!formData.earliestConnectionDate?.trim()) newErrors.earliestConnectionDate = 'Earliest Connection Date is required';
    //     if (!formData.scheduledFirstConstructionMilestoneDateAsPerPPA?.trim()) newErrors.scheduledFirstConstructionMilestoneDateAsPerPPA = 'Scheduled First Construction Milestone Date as per PPA is required';
    //     if (!formData.scheduledFirstConstructionMilestoneDate?.trim()) newErrors.scheduledFirstConstructionMilestoneDate = 'Scheduled First Construction Milestone Date is required';
    //     if (!formData.constructionPeriod?.trim()) newErrors.constructionPeriod = 'Construction Period is required';
    //     if (!formData.scheduledPCODAsPerPPA?.trim()) newErrors.scheduledPCODAsPerPPA = 'Scheduled PCOD as per PPA is required';
    //     if (!formData.scheduledPCOD?.trim()) newErrors.scheduledPCOD = 'Scheduled PCOD is required';
    //     if (!formData.longstopDate?.trim()) newErrors.longstopDate = 'Longstop Date is required';
    //     if (!formData.tenorOfPPA?.trim()) newErrors.tenorOfPPA = 'Tenor of PPA is required';
    //     if (!formData.eblMaxTenorAsPerRFP?.trim()) newErrors.eblMaxTenorAsPerRFP = 'EBL Max Tenor as per RFP is required';
    //     if (!formData.maxTargetRefinancingDateAsPerRFP?.trim()) newErrors.maxTargetRefinancingDateAsPerRFP = 'Max. Target Refinancing Date as per RFP is required';
    //     break;
    //   case 2: // Project Type - Essential for project classification
    //     if (!formData.projectType?.trim()) newErrors.projectType = 'Project Type is required';
    //     break;
    //   case 3: // Enterprise Assumptions - Core financial parameters
    //     if (!formData.tariff?.trim()) newErrors.tariff = 'Tariff Rate is required';
    //     if (!formData.exchangeRate?.trim()) newErrors.exchangeRate = 'Exchange Rate is required';
    //     if (!formData.inflationRate?.trim()) newErrors.inflationRate = 'Inflation Rate is required';
    //     if (!formData.projectLife?.trim()) newErrors.projectLife = 'Project Life is required';
    //     if (!formData.plantCapacityAC?.trim()) newErrors.plantCapacityAC = 'Plant Capacity AC is required';
    //     if (!formData.plf?.trim()) newErrors.plf = 'Plant Load Factor is required';
    //     if (!formData.debtEquityRatio?.trim()) newErrors.debtEquityRatio = 'Debt-Equity Ratio is required';
    //     if (!formData.interestRate?.trim()) newErrors.interestRate = 'Interest Rate is required';
    //     if (!formData.targetIRR?.trim()) newErrors.targetIRR = 'Target IRR is required';
    //     break;
    // }
    
    // setErrors(newErrors);
    // return Object.keys(newErrors).length === 0;
    
    // Always return true for testing - no validation
    return true;
  };

  // Check if a step is accessible (completed or current)
  const isStepAccessible = (stepIndex: number): boolean => {
    if (isViewMode) return true;
    // For drafts, allow access to all steps
    if (draftInfo !== null) return true;
    if (stepIndex <= currentStep) return true;
    if (completedSteps.has(stepIndex)) return true;
    return false;
  };

  // Check if a step is completed
  const isStepCompleted = (stepIndex: number): boolean => {
    // For drafts, check if the step has data
    if (draftInfo !== null) {
      return hasStepData(stepIndex);
    }
    // For new projects, use the completedSteps set
    return completedSteps.has(stepIndex);
  };

  const nextStep = () => {
    // For drafts, allow navigation without strict validation
    if (draftInfo !== null) {
      // Mark current step as completed if it has some data
      if (hasStepData(currentStep)) {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
      }
      
      // Move to next step
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      setErrors({});
      return;
    }
    
    // For new projects, validate strictly
    if (validateCurrentStep()) {
      // Mark current step as completed
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      
      // Move to next step
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      
      // Clear errors when moving to next step
      setErrors({});
    }
  };

  // Helper function to check if a step has any data
  const hasStepData = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Project Info
        return !!(formData.projectReference?.trim() || formData.projectName?.trim() || formData.country?.trim() || formData.version?.trim());
      case 1: // Timelines
        return !!(formData.modelStartDate?.trim() || formData.bidSubmissionDate?.trim() || formData.financialCloseDateAsPerPPA?.trim() || formData.targetFCDate?.trim() || formData.constructionPeriod?.trim() || formData.scheduledPCOD?.trim() || formData.tenorOfPPA?.trim());
      case 2: // Project Type
        return !!formData.projectType?.trim();
      case 3: // Enterprise Assumptions
        return !!(formData.tariff?.trim() || formData.exchangeRate?.trim() || formData.inflationRate?.trim() || formData.projectLife?.trim() || formData.plantCapacityAC?.trim() || formData.plf?.trim() || formData.debtEquityRatio?.trim() || formData.interestRate?.trim() || formData.targetIRR?.trim());
      default:
        return false;
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    // Clear errors when going back
    setErrors({});
  };

  const goToStep = (stepIndex: number) => {
    if (isStepAccessible(stepIndex)) {
      setCurrentStep(stepIndex);
      // Clear errors when navigating
      setErrors({});
    }
  };

  // Search functionality methods
  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchSuggestions([]);
      setSelectedSuggestionIndex(-1);
      return;
    }

    // Fuzzy search through searchable fields
    const matches = searchableFields.filter(field => 
      field.name.toLowerCase().includes(query.toLowerCase()) ||
      field.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 5); // Limit to 5 suggestions

    setSearchSuggestions(matches.map(match => match.name));
    setSelectedSuggestionIndex(-1);
  };

  const handleSearchSelect = (fieldName: string) => {
    const field = searchableFields.find(f => f.name === fieldName);
    if (field) {
      navigateToField(field);
    }
    setSearchQuery('');
    setSearchSuggestions([]);
    setShowSearch(false);
  };

  const navigateToField = (field: any) => {
    const stepIndex = field.stepIndex;
    
    // Check if all previous required steps are completed
    const canNavigateToStep = canNavigateToStepIndex(stepIndex);
    
    if (!canNavigateToStep) {
      // Show validation errors for the current step
      showValidationErrorsForStep(currentStep);
      return;
    }
    
    // Navigate to the step
    setCurrentStep(stepIndex);
    setErrors({});
    
    // Smooth scroll to the step after a brief delay
    setTimeout(() => {
      const stepElement = document.querySelector(`[data-step="${stepIndex}"]`);
      if (stepElement) {
        stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // If it's an assumption step and has required fields, expand it
      if (stepIndex > 2) {
        const fieldElement = document.querySelector(`#${field.id}`);
        if (fieldElement) {
          fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 100);
  };

  const checkStepRequiredFields = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Project Info - Essential fields
        return !!(formData.projectReference && formData.projectName && formData.country && formData.version);
      case 1: // Timelines - Essential dates
        return !!(formData.modelStartDate && formData.bidSubmissionDate && formData.financialCloseDateAsPerPPA && formData.targetFCDate && formData.constructionPeriod && formData.scheduledPCOD && formData.tenorOfPPA);
      case 2: // Project Type - Essential classification
        return !!formData.projectType;
      case 3: // Enterprise Assumptions - Core financial parameters
        return !!(formData.tariff && formData.exchangeRate && formData.inflationRate && formData.projectLife && formData.plantCapacityAC && formData.plf && formData.debtEquityRatio && formData.interestRate && formData.targetIRR);
      default:
        return true;
    }
  };

  // Check if user can navigate to a specific step index
  const canNavigateToStepIndex = (targetStepIndex: number): boolean => {
    // Always allow navigation to current step or previous steps
    if (targetStepIndex <= currentStep) {
      return true;
    }
    
    // Check if all previous steps have required fields filled
    for (let i = 0; i < targetStepIndex; i++) {
      if (!checkStepRequiredFields(i)) {
        return false;
      }
    }
    
    return true;
  };

  // Show validation errors for a specific step
  const showValidationErrorsForStep = (stepIndex: number) => {
    // COMMENTED OUT FOR TESTING - No validation errors shown
    // const newErrors: {[key: string]: string} = {};
    
    // switch (stepIndex) {
    //   case 0: // Project Info - Essential fields
    //     if (!formData.projectReference?.trim()) newErrors.projectReference = 'Project Reference is required';
    //     if (!formData.projectName?.trim()) newErrors.projectName = 'Project Name is required';
    //     if (!formData.country?.trim()) newErrors.country = 'Country is required';
    //     if (!formData.version?.trim()) newErrors.version = 'Project Version is required';
    //     break;
    //   case 1: // Timelines - Essential dates
    //     if (!formData.modelStartDate?.trim()) newErrors.modelStartDate = 'Model Start Date is required';
    //     if (!formData.bidSubmissionDate?.trim()) newErrors.bidSubmissionDate = 'Bid Submission Date is required';
    //     if (!formData.financialCloseDateAsPerPPA?.trim()) newErrors.financialCloseDateAsPerPPA = 'Financial Close Date as per PPA is required';
    //     if (!formData.targetFCDate?.trim()) newErrors.targetFCDate = 'Target FC Date is required';
    //     if (!formData.constructionPeriod?.trim()) newErrors.constructionPeriod = 'Construction Period is required';
    //     if (!formData.scheduledPCOD?.trim()) newErrors.scheduledPCOD = 'Scheduled PCOD is required';
    //     if (!formData.tenorOfPPA?.trim()) newErrors.tenorOfPPA = 'Tenor of PPA is required';
    //     break;
    //   case 2: // Project Type - Essential classification
    //     if (!formData.projectType?.trim()) newErrors.projectType = 'Project Type is required';
    //     break;
    //   case 3: // Enterprise Assumptions - Core financial parameters
    //     if (!formData.tariff?.trim()) newErrors.tariff = 'Tariff Rate is required';
    //     if (!formData.exchangeRate?.trim()) newErrors.exchangeRate = 'Exchange Rate is required';
    //     if (!formData.inflationRate?.trim()) newErrors.inflationRate = 'Inflation Rate is required';
    //     if (!formData.projectLife?.trim()) newErrors.projectLife = 'Project Life is required';
    //     if (!formData.plantCapacityAC?.trim()) newErrors.plantCapacityAC = 'Plant Capacity AC is required';
    //     if (!formData.plf?.trim()) newErrors.plf = 'Plant Load Factor is required';
    //     if (!formData.debtEquityRatio?.trim()) newErrors.debtEquityRatio = 'Debt-Equity Ratio is required';
    //     if (!formData.interestRate?.trim()) newErrors.interestRate = 'Interest Rate is required';
    //     if (!formData.targetIRR?.trim()) newErrors.targetIRR = 'Target IRR is required';
    //     break;
    // }
    
    // setErrors(newErrors);
    
    // // Show error message
    // if (Object.keys(newErrors).length > 0) {
    //   // Scroll to the current step to show errors
    //   setTimeout(() => {
    //     const stepElement = document.querySelector(`[data-step="${stepIndex}"]`);
    //     if (stepElement) {
    //       stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    //     }
    //   }, 100);
    // }
    
    // No validation errors for testing
    return;
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSearch(false);
      setSearchQuery('');
      setSearchSuggestions([]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < searchSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < searchSuggestions.length) {
        handleSearchSelect(searchSuggestions[selectedSuggestionIndex]);
      } else if (searchSuggestions.length > 0) {
        handleSearchSelect(searchSuggestions[0]);
      }
    }
  };

  const saveDraft = async () => {
    setSaveLoading(true);
    try {
      const response = await fetch('/api/projects/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData,
          currentStep,
          projectId,
          status: 'draft'
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        setProjectId(result.projectId);
        setSaveMessage('Draft saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      setSaveMessage('Error saving draft');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      setShowFinalizationModal(true);
    }
  };

  const handleFinalizeProject = async () => {
    setFinalizationLoading(true);
    try {
      const response = await fetch('/api/projects/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: { ...formData, version: formData.version },
          currentStep,
          projectId,
          status: 'completed',
          version: formData.version
        })
      });
      
      if (response.ok) {
        // Save current project to localStorage for assumptions page
        if (formData.projectName && formData.version) {
          localStorage.setItem('currentProject', JSON.stringify({
            name: formData.projectName,
            version: formData.version,
            reference: formData.projectReference || 'N/A'
          }));
        }

        // Create notification for project creation
        const notificationData = notificationTemplates.projectCreated(
          formData.projectName || 'Untitled Project',
          formData.projectReference || 'N/A',
          'project-id'
        );
        
        await createNotification(
          'superadmin',
          notificationData.type,
          notificationData.title,
          notificationData.message,
          notificationData.reference,
          notificationData.relatedId,
          'medium',
          notificationData.actionUrl
        );
        
        router.push('/dashboard/projects');
      }
    } catch (error) {
      console.error('Error finalizing project:', error);
    } finally {
      setFinalizationLoading(false);
    }
  };

  const renderStepContent = () => {
    const commonProps = {
      formData,
      errors,
      handleChange,
      isViewMode
    };

    switch (currentStep) {
      case 0:
        return <ProjectTypeStep {...commonProps} />;
      case 1:
        return <RealInputSheetStep {...commonProps} />;
      default:
        return <ProjectTypeStep {...commonProps} />;
    }
  };

  if (isLoadingDraft) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-4 shadow-2xl animate-pulse">
            <DocumentTextIcon className="h-8 w-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Project Draft</h2>
          <p className="text-gray-600">Please wait while we retrieve your project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 project-form-container">
      {/* Project Header with Draft Info */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                  <PlusIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {draftInfo ? 'Edit Project' : 'New Project'}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {draftInfo ? `Editing: ${draftInfo.projectName || 'Untitled Project'}` : 'Create a new financial project'}
                  </p>
                </div>
              </div>
              
              {/* Draft Status Badge */}
              {draftInfo && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="flex items-center space-x-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    <BookmarkIcon className="h-3 w-3" />
                    <span>Draft</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last saved: {new Date(draftInfo.lastSaved || Date.now()).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Optimized Project Tracker Bar */}
      <div className="sticky top-0 z-30 py-1 bg-gradient-to-br from-blue-50 via-white to-purple-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-md border border-white/30 p-2 sticky-tracker">
            {/* Search and Progress Bar */}
            <div className="mb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-gray-600 mb-1">
                <div className="flex items-center gap-2">
                  <span>Progress: {currentStep + 1} of {steps.length} steps</span>
                  
                  {/* Search Toggle Button */}
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className={`p-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all duration-200 group ${showSearch ? 'search-button-active bg-blue-100' : ''}`}
                    title="Search assumptions (Ctrl+K)"
                  >
                    <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
                
                <span className="text-xs">
                  {draftInfo !== null 
                    ? `${steps.filter((_, index) => hasStepData(index)).length} of ${steps.length} steps completed`
                    : `${Math.round(((currentStep + 1) / steps.length) * 100)}% Complete`
                  }
                </span>
              </div>

              {/* Project Version Display and View Assumptions Button */}
              {formData.version && (
                <div className="flex items-center justify-center mb-1 gap-2 relative z-10">
                  <div className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-xs font-semibold border border-blue-200">
                    <span className="mr-1">📋</span>
                    <span>Version: {formData.version}</span>
                  </div>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
                    title="View All Assumptions"
                  >
                    <span className="mr-2">👁️</span>
                    <span>View All Assumptions</span>
                  </button>
                </div>
              )}
               
              {/* Search Input */}
              {showSearch && (
                <div className="relative mb-1 search-slide-down">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="Search assumptions... (e.g., 'fin' for Financial, 'vat' for VAT)"
                      className="search-input w-full px-3 py-2 pl-8 pr-8 text-sm border border-gray-200 rounded-lg bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm text-gray-900 placeholder-gray-500"
                      autoFocus
                    />
                    <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSearchSuggestions([]);
                        }}
                        className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  {/* Search Suggestions */}
                  {searchSuggestions.length > 0 && (
                    <div className="search-suggestions-enter">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSearchSelect(suggestion)}
                          disabled={!canNavigateToStepIndex(searchableFields.find(f => f.name === suggestion)?.stepIndex || 0)}
                          className={`w-full px-3 py-2.5 text-left text-sm transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg ${
                            index === selectedSuggestionIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                          } ${
                            canNavigateToStepIndex(searchableFields.find(f => f.name === suggestion)?.stepIndex || 0)
                              ? 'hover:bg-blue-50 cursor-pointer'
                              : 'search-suggestion-blocked'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              canNavigateToStepIndex(searchableFields.find(f => f.name === suggestion)?.stepIndex || 0)
                                ? 'bg-blue-500' 
                                : 'bg-red-400'
                            }`}></div>
                            <span className="font-medium text-sm">{suggestion}</span>
                            <span className="text-xs text-gray-500 ml-auto">
                              {searchableFields.find(f => f.name === suggestion)?.keywords.slice(0, 2).join(', ')}
                            </span>
                            {!canNavigateToStepIndex(searchableFields.find(f => f.name === suggestion)?.stepIndex || 0) && (
                              <span className="text-xs text-red-500 font-medium">⚠️ Required fields missing</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Validation Error Message */}
                  {Object.keys(errors).length > 0 && showSearch && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-xs font-medium">Please complete required fields in the current step before proceeding</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: draftInfo !== null 
                      ? `${(steps.filter((_, index) => hasStepData(index)).length / steps.length) * 100}%`
                      : `${((currentStep + 1) / steps.length) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = isStepCompleted(index);
                const isAccessible = isStepAccessible(index);
                
                return (
                  <button
                    key={index}
                    onClick={() => !isViewMode && isAccessible && goToStep(index)}
                    disabled={isViewMode || !isAccessible}
                    className={`
                      flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md scale-105' 
                        : isCompleted 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 shadow-sm' 
                        : isAccessible
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-sm'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      }
                      ${isViewMode ? 'cursor-default' : 'cursor-pointer'}
                      group
                    `}
                  >
                    <span className="text-sm group-hover:scale-110 transition-transform">
                      {isCompleted ? '✅' : step.icon}
                    </span>
                    <span className="hidden sm:inline">{step.name}</span>
                    {isActive && (
                      <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 p-8 mt-4">
          {renderStepContent()}
        </div>

        {/* Enhanced Navigation Buttons */}
        {!isViewMode && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-8 gap-4">
            <div className="flex items-center justify-center sm:justify-start space-x-3">
              <button
                onClick={saveDraft}
                disabled={saveLoading}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 text-sm"
              >
                <DocumentTextIcon className="h-4 w-4" />
                <span>{saveLoading ? 'Saving...' : 'Save Draft'}</span>
              </button>
              {saveMessage && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span className="text-xs sm:text-sm font-medium">{saveMessage}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center sm:justify-end space-x-3">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 text-sm"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {currentStep === steps.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                >
                  <SparklesIcon className="h-4 w-4" />
                  <span>Complete Project</span>
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                >
                  <span>Next</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Validation Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
              <h3 className="text-sm font-semibold text-red-800">Please fix the following errors:</h3>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              {Object.values(errors).map((error, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>


      {/* Finalization Modal */}
      {showFinalizationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Project Finalization</h2>
                <button
                  onClick={() => setShowFinalizationModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= finalizationStep
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {finalizationStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Review Project Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Project Name</p>
                      <p className="text-gray-900">{formData.projectName || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Project Type</p>
                      <p className="text-gray-900">{formData.projectType || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Country</p>
                      <p className="text-gray-900">{formData.country || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Plant Capacity</p>
                      <p className="text-gray-900">{formData.plantCapacityAC ? `${formData.plantCapacityAC} MW AC` : 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              )}

              {finalizationStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Review Project Version</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">📋</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          Project Version Confirmed
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            <strong>Version:</strong> {formData.version || 'Not specified'}
                          </p>
                          <p className="mt-1">
                            This version will be used for project tracking and management.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {finalizationStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Final Confirmation</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <PencilIcon className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Important Notice
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Once you complete this project, it will be moved to the &quot;Finalized&quot; section and will be read-only. 
                            You cannot edit a finalized project. Make sure all information is correct before proceeding.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Project Summary</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Name:</strong> {formData.projectName}</p>
                      <p><strong>Type:</strong> {formData.projectType}</p>
                      <p><strong>Version:</strong> {formData.version}</p>
                      <p><strong>Steps Completed:</strong> {currentStep + 1} of {steps.length}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setShowFinalizationModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <div className="flex items-center space-x-3">
                {finalizationStep > 1 && (
                  <button
                    onClick={() => setFinalizationStep(prev => prev - 1)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                
                {finalizationStep < 3 ? (
                  <button
                    onClick={() => setFinalizationStep(prev => prev + 1)}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <span>Continue</span>
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinalizeProject}
                    disabled={finalizationLoading || !formData.version}
                    className="flex items-center px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    <span>{finalizationLoading ? 'Finalizing...' : 'Complete Project'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
