// Enterprise Financial Model Assumptions Data Structure
// Based on comprehensive input sheet analysis and industry standards

export interface AssumptionField {
  id: string;
  name: string;
  description: string;
  type: 'input' | 'calculated' | 'formula' | 'readonly';
  dataType: 'number' | 'text' | 'date' | 'percentage' | 'currency';
  unit?: string;
  formula?: string;
  dependencies?: string[];
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
    pattern?: string;
  };
  defaultValue?: any;
  category: string;
  subcategory?: string;
  isCritical?: boolean;
  remarks?: string;
}

export interface AssumptionSection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  fields: AssumptionField[];
  subsections?: AssumptionSection[];
}

export const ENTERPRISE_ASSUMPTIONS: AssumptionSection[] = [
  {
    id: 'project-basic-info',
    name: 'Project Basic Information',
    description: 'Core project identification and basic details',
    icon: '📋',
    color: 'blue',
    order: 1,
    fields: [
      {
        id: 'project_name',
        name: 'Project Name',
        description: 'Official name of the project',
        type: 'input',
        dataType: 'text',
        validation: { required: true },
        category: 'basic',
        isCritical: true
      },
      {
        id: 'project_reference',
        name: 'Project Reference',
        description: 'Unique project identifier',
        type: 'input',
        dataType: 'text',
        validation: { required: true },
        category: 'basic',
        isCritical: true
      },
      {
        id: 'project_type',
        name: 'Project Type',
        description: 'Type of renewable energy project',
        type: 'input',
        dataType: 'text',
        validation: { required: true },
        category: 'basic',
        isCritical: true
      },
      {
        id: 'country',
        name: 'Country',
        description: 'Project location country',
        type: 'input',
        dataType: 'text',
        validation: { required: true },
        category: 'basic',
        isCritical: true
      },
      {
        id: 'city',
        name: 'City',
        description: 'Project location city',
        type: 'input',
        dataType: 'text',
        validation: { required: true },
        category: 'basic',
        isCritical: true
      },
      {
        id: 'lifecycle_phase',
        name: 'Lifecycle Phase',
        description: 'Current project lifecycle phase',
        type: 'input',
        dataType: 'text',
        validation: { required: true },
        category: 'basic',
        isCritical: true
      }
    ]
  },
  {
    id: 'financial-parameters',
    name: 'Financial Parameters',
    description: 'Core financial assumptions and economic parameters',
    icon: '💰',
    color: 'green',
    order: 2,
    fields: [
      {
        id: 'tariff_rate',
        name: 'Tariff Rate',
        description: 'Energy tariff rate per unit',
        type: 'input',
        dataType: 'currency',
        unit: 'USD/MWh',
        validation: { required: true, min: 0 },
        category: 'financial',
        isCritical: true
      },
      {
        id: 'exchange_rate',
        name: 'Exchange Rate',
        description: 'Local currency to USD exchange rate',
        type: 'input',
        dataType: 'number',
        validation: { required: true, min: 0 },
        category: 'financial',
        isCritical: true
      },
      {
        id: 'inflation_rate',
        name: 'Inflation Rate',
        description: 'Annual inflation rate',
        type: 'input',
        dataType: 'percentage',
        validation: { required: true, min: 0, max: 100 },
        category: 'financial',
        isCritical: true
      },
      {
        id: 'foreign_inflation_rate',
        name: 'Foreign Inflation Rate',
        description: 'Foreign currency inflation rate',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 100 },
        category: 'financial'
      },
      {
        id: 'project_life',
        name: 'Project Life',
        description: 'Total project lifetime in years',
        type: 'input',
        dataType: 'number',
        unit: 'years',
        validation: { required: true, min: 1, max: 50 },
        category: 'financial',
        isCritical: true
      },
      {
        id: 'discount_rate',
        name: 'Discount Rate',
        description: 'Project discount rate for NPV calculations',
        type: 'input',
        dataType: 'percentage',
        validation: { required: true, min: 0, max: 50 },
        category: 'financial',
        isCritical: true
      }
    ]
  },
  {
    id: 'plant-assumptions',
    name: 'Plant Assumptions',
    description: 'Technical specifications and performance parameters',
    icon: '⚡',
    color: 'yellow',
    order: 3,
    fields: [
      {
        id: 'plant_capacity_ac',
        name: 'Plant Capacity (AC)',
        description: 'AC power capacity of the plant',
        type: 'input',
        dataType: 'number',
        unit: 'MW',
        validation: { required: true, min: 0 },
        category: 'technical',
        isCritical: true
      },
      {
        id: 'plant_capacity_dc',
        name: 'Plant Capacity (DC)',
        description: 'DC power capacity of the plant',
        type: 'input',
        dataType: 'number',
        unit: 'MW',
        validation: { min: 0 },
        category: 'technical'
      },
      {
        id: 'plf',
        name: 'Plant Load Factor (PLF)',
        description: 'Average plant load factor',
        type: 'input',
        dataType: 'percentage',
        validation: { required: true, min: 0, max: 100 },
        category: 'technical',
        isCritical: true
      },
      {
        id: 'degradation_start_year',
        name: 'Degradation Start Year',
        description: 'Year when degradation begins',
        type: 'input',
        dataType: 'number',
        unit: 'years',
        validation: { min: 1 },
        category: 'technical'
      },
      {
        id: 'degradation_first_year',
        name: 'First Year Degradation',
        description: 'Degradation rate in first year',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 10 },
        category: 'technical'
      },
      {
        id: 'degradation_second_year',
        name: 'Second Year Degradation',
        description: 'Degradation rate in second year',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 10 },
        category: 'technical'
      },
      {
        id: 'annual_energy_generation',
        name: 'Annual Energy Generation',
        description: 'Calculated annual energy generation',
        type: 'calculated',
        dataType: 'number',
        unit: 'MWh',
        formula: 'plant_capacity_ac * plf * 8760',
        category: 'technical',
        isCritical: true
      }
    ]
  },
  {
    id: 'financing-structure',
    name: 'Financing Structure',
    description: 'Debt and equity financing parameters',
    icon: '🏦',
    color: 'purple',
    order: 4,
    fields: [
      {
        id: 'debt_equity_ratio',
        name: 'Debt-Equity Ratio',
        description: 'Ratio of debt to equity financing',
        type: 'input',
        dataType: 'number',
        validation: { required: true, min: 0, max: 10 },
        category: 'financing',
        isCritical: true
      },
      {
        id: 'debt_percentage',
        name: 'Debt Percentage',
        description: 'Percentage of debt financing',
        type: 'calculated',
        dataType: 'percentage',
        formula: 'debt_equity_ratio / (1 + debt_equity_ratio) * 100',
        category: 'financing'
      },
      {
        id: 'equity_percentage',
        name: 'Equity Percentage',
        description: 'Percentage of equity financing',
        type: 'calculated',
        dataType: 'percentage',
        formula: '100 - debt_percentage',
        category: 'financing'
      },
      {
        id: 'interest_rate',
        name: 'Interest Rate',
        description: 'Annual interest rate on debt',
        type: 'input',
        dataType: 'percentage',
        validation: { required: true, min: 0, max: 20 },
        category: 'financing',
        isCritical: true
      },
      {
        id: 'moratorium_period',
        name: 'Moratorium Period',
        description: 'Interest-only period in years',
        type: 'input',
        dataType: 'number',
        unit: 'years',
        validation: { min: 0, max: 10 },
        category: 'financing'
      },
      {
        id: 'repayment_frequency',
        name: 'Repayment Frequency',
        description: 'Frequency of debt repayments',
        type: 'input',
        dataType: 'text',
        category: 'financing'
      },
      {
        id: 'upfront_fee',
        name: 'Upfront Fee',
        description: 'One-time upfront fee percentage',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 5 },
        category: 'financing'
      }
    ]
  },
  {
    id: 'tax-assumptions',
    name: 'Tax Assumptions',
    description: 'Tax rates and recovery parameters',
    icon: '🧾',
    color: 'red',
    order: 5,
    fields: [
      {
        id: 'vat_rate',
        name: 'VAT Rate',
        description: 'Value Added Tax rate',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 50 },
        category: 'tax'
      },
      {
        id: 'vat_recovery_period',
        name: 'VAT Recovery Period',
        description: 'Period for VAT recovery in years',
        type: 'input',
        dataType: 'number',
        unit: 'years',
        validation: { min: 0, max: 10 },
        category: 'tax'
      },
      {
        id: 'vat_on_equipment',
        name: 'VAT on Equipment',
        description: 'VAT applicable on equipment',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 50 },
        category: 'tax'
      },
      {
        id: 'vat_on_services',
        name: 'VAT on Services',
        description: 'VAT applicable on services',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 50 },
        category: 'tax'
      },
      {
        id: 'corporate_tax_rate',
        name: 'Corporate Tax Rate',
        description: 'Corporate income tax rate',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 50 },
        category: 'tax'
      },
      {
        id: 'depreciation_rate',
        name: 'Depreciation Rate',
        description: 'Annual depreciation rate for tax purposes',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 20 },
        category: 'tax'
      }
    ]
  },
  {
    id: 'custom-duty',
    name: 'Custom Duty',
    description: 'Import duties and customs charges',
    icon: '📦',
    color: 'orange',
    order: 6,
    fields: [
      {
        id: 'custom_duty_rate',
        name: 'Custom Duty Rate',
        description: 'Rate of custom duty on imports',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 100 },
        category: 'customs'
      },
      {
        id: 'import_duty_equipment',
        name: 'Import Duty - Equipment',
        description: 'Custom duty on equipment imports',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 100 },
        category: 'customs'
      },
      {
        id: 'import_duty_spares',
        name: 'Import Duty - Spares',
        description: 'Custom duty on spare parts imports',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 100 },
        category: 'customs'
      },
      {
        id: 'customs_handling_charges',
        name: 'Customs Handling Charges',
        description: 'Additional handling charges percentage',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 10 },
        category: 'customs'
      }
    ]
  },
  {
    id: 'operational-expenses',
    name: 'Operational Expenses',
    description: 'Operating and maintenance cost assumptions',
    icon: '💼',
    color: 'teal',
    order: 7,
    fields: [
      {
        id: 'om_cost',
        name: 'O&M Cost',
        description: 'Annual operation and maintenance cost',
        type: 'input',
        dataType: 'currency',
        unit: 'USD/MW/year',
        validation: { required: true, min: 0 },
        category: 'operational',
        isCritical: true
      },
      {
        id: 'insurance_cost',
        name: 'Insurance Cost',
        description: 'Annual insurance cost',
        type: 'input',
        dataType: 'currency',
        unit: 'USD/MW/year',
        validation: { min: 0 },
        category: 'operational'
      },
      {
        id: 'land_lease_cost',
        name: 'Land Lease Cost',
        description: 'Annual land lease cost',
        type: 'input',
        dataType: 'currency',
        unit: 'USD/year',
        validation: { min: 0 },
        category: 'operational'
      },
      {
        id: 'administrative_cost',
        name: 'Administrative Cost',
        description: 'Annual administrative cost',
        type: 'input',
        dataType: 'currency',
        unit: 'USD/year',
        validation: { min: 0 },
        category: 'operational'
      },
      {
        id: 'om_escalation',
        name: 'O&M Escalation',
        description: 'Annual escalation rate for O&M costs',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 10 },
        category: 'operational'
      },
      {
        id: 'major_maintenance_cost',
        name: 'Major Maintenance Cost',
        description: 'Cost of major maintenance activities',
        type: 'input',
        dataType: 'currency',
        unit: 'USD/MW',
        validation: { min: 0 },
        category: 'operational'
      }
    ]
  },
  {
    id: 'debt-assumptions',
    name: 'Debt Assumptions',
    description: 'Detailed debt financing parameters',
    icon: '💳',
    color: 'cyan',
    order: 8,
    fields: [
      {
        id: 'debt_amount',
        name: 'Debt Amount',
        description: 'Total debt amount',
        type: 'calculated',
        dataType: 'currency',
        unit: 'USD',
        formula: 'total_project_cost * debt_percentage / 100',
        category: 'debt'
      },
      {
        id: 'debt_interest_rate',
        name: 'Debt Interest Rate',
        description: 'Interest rate on debt',
        type: 'input',
        dataType: 'percentage',
        validation: { required: true, min: 0, max: 20 },
        category: 'debt',
        isCritical: true
      },
      {
        id: 'debt_tenor',
        name: 'Debt Tenor',
        description: 'Debt repayment period in years',
        type: 'input',
        dataType: 'number',
        unit: 'years',
        validation: { required: true, min: 1, max: 30 },
        category: 'debt',
        isCritical: true
      },
      {
        id: 'debt_service_reserve',
        name: 'Debt Service Reserve',
        description: 'Debt service reserve requirement',
        type: 'input',
        dataType: 'currency',
        unit: 'USD',
        validation: { min: 0 },
        category: 'debt'
      },
      {
        id: 'debt_arrangement_fee',
        name: 'Debt Arrangement Fee',
        description: 'One-time arrangement fee',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 5 },
        category: 'debt'
      },
      {
        id: 'debt_commitment_fee',
        name: 'Debt Commitment Fee',
        description: 'Annual commitment fee',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 2 },
        category: 'debt'
      }
    ]
  },
  {
    id: 'ebl-assumptions',
    name: 'EBL Assumptions',
    description: 'Export Bank Letter of Credit parameters',
    icon: '📊',
    color: 'emerald',
    order: 9,
    fields: [
      {
        id: 'ebl_amount',
        name: 'EBL Amount',
        description: 'Export Bank Letter amount',
        type: 'input',
        dataType: 'currency',
        unit: 'USD',
        validation: { min: 0 },
        category: 'ebl'
      },
      {
        id: 'ebl_interest_rate',
        name: 'EBL Interest Rate',
        description: 'Interest rate on EBL',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 20 },
        category: 'ebl'
      },
      {
        id: 'ebl_tenor',
        name: 'EBL Tenor',
        description: 'EBL repayment period',
        type: 'input',
        dataType: 'number',
        unit: 'years',
        validation: { min: 0, max: 10 },
        category: 'ebl'
      },
      {
        id: 'ebl_arrangement_fee',
        name: 'EBL Arrangement Fee',
        description: 'One-time EBL arrangement fee',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 5 },
        category: 'ebl'
      },
      {
        id: 'ebl_commitment_fee',
        name: 'EBL Commitment Fee',
        description: 'Annual EBL commitment fee',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 2 },
        category: 'ebl'
      },
      {
        id: 'ebl_repayment_schedule',
        name: 'EBL Repayment Schedule',
        description: 'EBL repayment schedule type',
        type: 'input',
        dataType: 'text',
        category: 'ebl'
      }
    ]
  },
  {
    id: 'terminal-value',
    name: 'Terminal Value',
    description: 'Exit valuation and terminal value assumptions',
    icon: '🎯',
    color: 'rose',
    order: 10,
    fields: [
      {
        id: 'terminal_value_method',
        name: 'Terminal Value Method',
        description: 'Method for calculating terminal value',
        type: 'input',
        dataType: 'text',
        category: 'terminal'
      },
      {
        id: 'terminal_growth_rate',
        name: 'Terminal Growth Rate',
        description: 'Perpetual growth rate for terminal value',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 10 },
        category: 'terminal'
      },
      {
        id: 'exit_multiple',
        name: 'Exit Multiple',
        description: 'Exit multiple for valuation',
        type: 'input',
        dataType: 'number',
        validation: { min: 0, max: 50 },
        category: 'terminal'
      },
      {
        id: 'liquidation_value',
        name: 'Liquidation Value',
        description: 'Liquidation value of assets',
        type: 'input',
        dataType: 'currency',
        unit: 'USD',
        validation: { min: 0 },
        category: 'terminal'
      },
      {
        id: 'terminal_value_discount_rate',
        name: 'Terminal Value Discount Rate',
        description: 'Discount rate for terminal value',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 20 },
        category: 'terminal'
      },
      {
        id: 'terminal_value_year',
        name: 'Terminal Value Year',
        description: 'Year for terminal value calculation',
        type: 'input',
        dataType: 'number',
        unit: 'years',
        validation: { min: 1 },
        category: 'terminal'
      }
    ]
  },
  {
    id: 'irr-analysis',
    name: 'IRR Analysis',
    description: 'Internal Rate of Return and financial targets',
    icon: '📈',
    color: 'violet',
    order: 11,
    fields: [
      {
        id: 'target_irr',
        name: 'Target IRR',
        description: 'Target internal rate of return',
        type: 'input',
        dataType: 'percentage',
        validation: { required: true, min: 0, max: 50 },
        category: 'irr',
        isCritical: true
      },
      {
        id: 'hurdle_rate',
        name: 'Hurdle Rate',
        description: 'Minimum acceptable return rate',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 30 },
        category: 'irr'
      },
      {
        id: 'payback_period_target',
        name: 'Target Payback Period',
        description: 'Target payback period in years',
        type: 'input',
        dataType: 'number',
        unit: 'years',
        validation: { min: 1, max: 20 },
        category: 'irr'
      },
      {
        id: 'npv_target',
        name: 'Target NPV',
        description: 'Target net present value',
        type: 'input',
        dataType: 'currency',
        unit: 'USD',
        validation: { min: 0 },
        category: 'irr'
      },
      {
        id: 'dscr_target',
        name: 'Target DSCR',
        description: 'Target debt service coverage ratio',
        type: 'input',
        dataType: 'number',
        validation: { min: 1, max: 5 },
        category: 'irr'
      },
      {
        id: 'sensitivity_analysis_range',
        name: 'Sensitivity Analysis Range',
        description: 'Range for sensitivity analysis',
        type: 'input',
        dataType: 'percentage',
        validation: { min: 0, max: 50 },
        category: 'irr'
      }
    ]
  }
];

// Formula calculation functions
export const calculateFormulas = (formData: Record<string, any>): Record<string, any> => {
  const calculated = { ...formData };
  
  // Calculate debt percentage
  if (calculated.debt_equity_ratio) {
    calculated.debt_percentage = (calculated.debt_equity_ratio / (1 + calculated.debt_equity_ratio)) * 100;
    calculated.equity_percentage = 100 - calculated.debt_percentage;
  }
  
  // Calculate annual energy generation
  if (calculated.plant_capacity_ac && calculated.plf) {
    calculated.annual_energy_generation = calculated.plant_capacity_ac * (calculated.plf / 100) * 8760;
  }
  
  // Calculate debt amount (requires total project cost)
  if (calculated.total_project_cost && calculated.debt_percentage) {
    calculated.debt_amount = calculated.total_project_cost * (calculated.debt_percentage / 100);
  }
  
  return calculated;
};

// Validation functions
export const validateAssumption = (field: AssumptionField, value: any): string | null => {
  if (field.validation?.required && (!value || value === '')) {
    return `${field.name} is required`;
  }
  
  if (field.dataType === 'number' && value !== '' && value !== null) {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return `${field.name} must be a valid number`;
    }
    
    if (field.validation?.min !== undefined && numValue < field.validation.min) {
      return `${field.name} must be at least ${field.validation.min}`;
    }
    
    if (field.validation?.max !== undefined && numValue > field.validation.max) {
      return `${field.name} must be at most ${field.validation.max}`;
    }
  }
  
  if (field.dataType === 'percentage' && value !== '' && value !== null) {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return `${field.name} must be a valid percentage`;
    }
    
    if (field.validation?.min !== undefined && numValue < field.validation.min) {
      return `${field.name} must be at least ${field.validation.min}%`;
    }
    
    if (field.validation?.max !== undefined && numValue > field.validation.max) {
      return `${field.name} must be at most ${field.validation.max}%`;
    }
  }
  
  return null;
};
