// Comprehensive Financial Model Assumptions - Based on Input Sheet Analysis
// 3,275 rows with 106 Named Cell References, 57 Pattern Groups, 78 Formulas with Changes

export interface FieldDefinition {
  id: string;
  name: string;
  description: string;
  type: 'input' | 'calculated' | 'formula' | 'named_cell';
  dataType: 'number' | 'text' | 'date' | 'percentage' | 'currency' | 'boolean';
  unit?: string;
  formula?: string;
  namedCell?: string;
  dependencies?: string[];
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
    pattern?: string;
  };
  defaultValue?: any;
  row?: number; // Original row from input sheet
  isRequired?: boolean;
}

export interface AssumptionSection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isExpanded?: boolean;
  fields: FieldDefinition[];
}

// Comprehensive assumptions based on actual input sheet data
export const COMPREHENSIVE_ASSUMPTIONS: AssumptionSection[] = [
  {
    id: 'project-identification',
    name: 'Project Identification',
    description: 'Basic project identification and reference information',
    icon: '📋',
    color: 'blue',
    order: 1,
    isExpanded: true,
    fields: [
      {
        id: 'project_name',
        name: 'Project Name',
        description: 'Official name of the project',
        type: 'input',
        dataType: 'text',
        validation: { required: true },
        row: 10,
        isRequired: true
      },
      {
        id: 'project_reference',
        name: 'Project Reference',
        description: 'Unique project identifier',
        type: 'input',
        dataType: 'text',
        validation: { required: true },
        isRequired: true
      },
      {
        id: 'country',
        name: 'Country',
        description: 'Project location country',
        type: 'input',
        dataType: 'text',
        validation: { required: true },
        isRequired: true
      },
      {
        id: 'city',
        name: 'City/Location',
        description: 'Specific project location',
        type: 'input',
        dataType: 'text',
        validation: { required: true },
        isRequired: true
      },
      {
        id: 'project_type',
        name: 'Project Type',
        description: 'Type of renewable energy project',
        type: 'input',
        dataType: 'text',
        validation: { required: true },
        isRequired: true
      }
    ]
  },
  {
    id: 'macroeconomic-assumptions',
    name: 'Macroeconomic Assumptions',
    description: 'Economic parameters and currency assumptions',
    icon: '🌍',
    color: 'green',
    order: 2,
    fields: [
      {
        id: 'exchange_rate',
        name: 'Exchange Rate (USD)',
        description: 'Local currency to USD exchange rate (1 USD = X local currency)',
        type: 'input',
        dataType: 'number',
        validation: { required: true, min: 0 },
        row: 80,
        defaultValue: 3.75,
        isRequired: true
      },
      {
        id: 'foreign_inflation',
        name: 'Foreign Inflation Rate',
        description: 'Annual foreign inflation rate',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { required: true, min: 0, max: 20 },
        namedCell: 'Foreign_inflation',
        row: 1160,
        isRequired: true
      },
      {
        id: 'local_inflation',
        name: 'Local Inflation Rate',
        description: 'Annual local inflation rate',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { required: true, min: 0, max: 20 },
        isRequired: true
      },
      {
        id: 'discount_rate',
        name: 'Discount Rate',
        description: 'Project discount rate for NPV calculations',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { required: true, min: 0, max: 30 },
        isRequired: true
      }
    ]
  },
  {
    id: 'project-timeline',
    name: 'Project Timeline',
    description: 'Key project dates and milestones',
    icon: '📅',
    color: 'purple',
    order: 3,
    fields: [
      {
        id: 'financial_close_date',
        name: 'Financial Close Date',
        description: 'Date of financial closing',
        type: 'input',
        dataType: 'date',
        validation: { required: true },
        isRequired: true
      },
      {
        id: 'construction_start_date',
        name: 'Construction Start Date',
        description: 'Date when construction begins',
        type: 'input',
        dataType: 'date',
        validation: { required: true },
        isRequired: true
      },
      {
        id: 'commercial_operation_date',
        name: 'Commercial Operation Date (COD)',
        description: 'Date when plant starts commercial operation',
        type: 'input',
        dataType: 'date',
        validation: { required: true },
        isRequired: true
      },
      {
        id: 'decommissioning_date',
        name: 'Date of Decommissioning',
        description: 'Planned decommissioning date',
        type: 'calculated',
        dataType: 'date',
        formula: 'commercial_operation_date + project_life',
        row: 1140,
        defaultValue: '2053-01-31'
      },
      {
        id: 'construction_period',
        name: 'Construction Period',
        description: 'Construction duration in months',
        type: 'calculated',
        dataType: 'number',
        unit: 'months',
        formula: 'DATEDIF(construction_start_date, commercial_operation_date, "M")'
      }
    ]
  },
  {
    id: 'plant-specifications',
    name: 'Plant Specifications',
    description: 'Technical specifications and capacity details',
    icon: '⚡',
    color: 'yellow',
    order: 4,
    fields: [
      {
        id: 'plant_capacity_ac',
        name: 'Plant Capacity (AC)',
        description: 'AC power capacity of the plant',
        type: 'input',
        dataType: 'number',
        unit: 'MW',
        validation: { required: true, min: 0 },
        isRequired: true
      },
      {
        id: 'plant_capacity_dc',
        name: 'Plant Capacity (DC)',
        description: 'DC power capacity of the plant',
        type: 'input',
        dataType: 'number',
        unit: 'MW',
        validation: { min: 0 }
      },
      {
        id: 'dc_ac_ratio',
        name: 'DC/AC Ratio',
        description: 'Ratio of DC to AC capacity',
        type: 'calculated',
        dataType: 'number',
        formula: 'plant_capacity_dc / plant_capacity_ac'
      },
      {
        id: 'plant_load_factor',
        name: 'Plant Load Factor (PLF)',
        description: 'Average plant load factor',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { required: true, min: 0, max: 100 },
        isRequired: true
      },
      {
        id: 'annual_energy_generation',
        name: 'Annual Energy Generation',
        description: 'Expected annual energy generation',
        type: 'calculated',
        dataType: 'number',
        unit: 'MWh',
        formula: 'plant_capacity_ac * plant_load_factor * 8760 / 100'
      },
      {
        id: 'degradation_rate_year1',
        name: 'Degradation Rate (Year 1)',
        description: 'Performance degradation in first year',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { min: 0, max: 5 }
      },
      {
        id: 'degradation_rate_annual',
        name: 'Annual Degradation Rate',
        description: 'Annual performance degradation after year 1',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { min: 0, max: 2 }
      }
    ]
  },
  {
    id: 'financial-structure',
    name: 'Financial Structure',
    description: 'Project financing and capital structure',
    icon: '💰',
    color: 'indigo',
    order: 5,
    fields: [
      {
        id: 'total_project_cost',
        name: 'Total Project Cost',
        description: 'Total project investment cost',
        type: 'input',
        dataType: 'currency',
        unit: 'USD',
        validation: { required: true, min: 0 },
        isRequired: true
      },
      {
        id: 'debt_percentage',
        name: 'Debt Percentage',
        description: 'Percentage of debt financing',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { required: true, min: 0, max: 100 },
        isRequired: true
      },
      {
        id: 'equity_percentage',
        name: 'Equity Percentage',
        description: 'Percentage of equity financing',
        type: 'calculated',
        dataType: 'percentage',
        unit: '%',
        formula: '100 - debt_percentage'
      },
      {
        id: 'debt_amount',
        name: 'Debt Amount',
        description: 'Total debt amount',
        type: 'calculated',
        dataType: 'currency',
        unit: 'USD',
        formula: 'total_project_cost * debt_percentage / 100'
      },
      {
        id: 'equity_amount',
        name: 'Equity Amount',
        description: 'Total equity amount',
        type: 'calculated',
        dataType: 'currency',
        unit: 'USD',
        formula: 'total_project_cost * equity_percentage / 100'
      }
    ]
  },
  {
    id: 'revenue-assumptions',
    name: 'Revenue Assumptions',
    description: 'Tariff and revenue parameters',
    icon: '💵',
    color: 'green',
    order: 6,
    fields: [
      {
        id: 'tariff_rate',
        name: 'Tariff Rate',
        description: 'Energy tariff rate',
        type: 'input',
        dataType: 'currency',
        unit: 'USD/MWh',
        validation: { required: true, min: 0 },
        isRequired: true
      },
      {
        id: 'tariff_escalation',
        name: 'Tariff Escalation',
        description: 'Annual tariff escalation rate',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { min: 0, max: 10 }
      },
      {
        id: 'annual_revenue_year1',
        name: 'Annual Revenue (Year 1)',
        description: 'First year revenue',
        type: 'calculated',
        dataType: 'currency',
        unit: 'USD',
        formula: 'annual_energy_generation * tariff_rate'
      },
      {
        id: 'ppa_term',
        name: 'PPA Term',
        description: 'Power Purchase Agreement term',
        type: 'input',
        dataType: 'number',
        unit: 'years',
        validation: { required: true, min: 1, max: 30 },
        isRequired: true
      }
    ]
  },
  {
    id: 'debt-assumptions',
    name: 'Debt Assumptions',
    description: 'Debt financing terms and conditions',
    icon: '🏦',
    color: 'blue',
    order: 7,
    fields: [
      {
        id: 'interest_rate',
        name: 'Interest Rate',
        description: 'Annual interest rate on debt',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { required: true, min: 0, max: 20 },
        isRequired: true
      },
      {
        id: 'debt_term',
        name: 'Debt Term',
        description: 'Debt repayment period',
        type: 'input',
        dataType: 'number',
        unit: 'years',
        validation: { required: true, min: 1, max: 25 },
        isRequired: true
      },
      {
        id: 'moratorium_period',
        name: 'Moratorium Period',
        description: 'Interest-only period',
        type: 'input',
        dataType: 'number',
        unit: 'years',
        validation: { min: 0, max: 5 }
      },
      {
        id: 'upfront_fee',
        name: 'Upfront Fee',
        description: 'One-time arrangement fee',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { min: 0, max: 5 }
      },
      {
        id: 'annual_debt_service',
        name: 'Annual Debt Service',
        description: 'Annual debt payment (P&I)',
        type: 'calculated',
        dataType: 'currency',
        unit: 'USD',
        formula: 'PMT(interest_rate/100, debt_term, debt_amount)'
      }
    ]
  },
  {
    id: 'operating-expenses',
    name: 'Operating Expenses',
    description: 'Operational and maintenance costs',
    icon: '🔧',
    color: 'orange',
    order: 8,
    fields: [
      {
        id: 'om_cost_fixed',
        name: 'O&M Cost (Fixed)',
        description: 'Fixed operation and maintenance cost',
        type: 'input',
        dataType: 'currency',
        unit: 'USD/MW/year',
        validation: { required: true, min: 0 },
        isRequired: true
      },
      {
        id: 'om_cost_variable',
        name: 'O&M Cost (Variable)',
        description: 'Variable operation and maintenance cost',
        type: 'input',
        dataType: 'currency',
        unit: 'USD/MWh',
        validation: { min: 0 }
      },
      {
        id: 'insurance_cost',
        name: 'Insurance Cost',
        description: 'Annual insurance premium',
        type: 'input',
        dataType: 'percentage',
        unit: '% of project cost',
        validation: { min: 0, max: 2 }
      },
      {
        id: 'land_lease_cost',
        name: 'Land Lease Cost',
        description: 'Annual land lease payment',
        type: 'input',
        dataType: 'currency',
        unit: 'USD/year',
        validation: { min: 0 }
      },
      {
        id: 'om_escalation',
        name: 'O&M Escalation',
        description: 'Annual O&M cost escalation',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { min: 0, max: 10 }
      },
      {
        id: 'total_annual_opex_year1',
        name: 'Total Annual OPEX (Year 1)',
        description: 'Total first year operating expenses',
        type: 'calculated',
        dataType: 'currency',
        unit: 'USD',
        formula: '(om_cost_fixed * plant_capacity_ac) + (om_cost_variable * annual_energy_generation) + (insurance_cost * total_project_cost / 100) + land_lease_cost'
      }
    ]
  },
  {
    id: 'tax-assumptions',
    name: 'Tax Assumptions',
    description: 'Tax rates and depreciation parameters',
    icon: '📊',
    color: 'red',
    order: 9,
    fields: [
      {
        id: 'corporate_tax_rate',
        name: 'Corporate Tax Rate',
        description: 'Corporate income tax rate',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { min: 0, max: 50 }
      },
      {
        id: 'vat_rate',
        name: 'VAT Rate',
        description: 'Value Added Tax rate',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { min: 0, max: 30 }
      },
      {
        id: 'depreciation_rate',
        name: 'Depreciation Rate',
        description: 'Annual depreciation rate',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { min: 0, max: 20 }
      },
      {
        id: 'depreciation_method',
        name: 'Depreciation Method',
        description: 'Method of depreciation calculation',
        type: 'input',
        dataType: 'text',
        defaultValue: 'Straight Line'
      }
    ]
  },
  {
    id: 'returns-analysis',
    name: 'Returns Analysis',
    description: 'IRR and return calculations',
    icon: '📈',
    color: 'purple',
    order: 10,
    fields: [
      {
        id: 'target_equity_irr',
        name: 'Target Equity IRR',
        description: 'Target internal rate of return on equity',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { required: true, min: 0, max: 50 },
        isRequired: true
      },
      {
        id: 'target_project_irr',
        name: 'Target Project IRR',
        description: 'Target project internal rate of return',
        type: 'input',
        dataType: 'percentage',
        unit: '%',
        validation: { required: true, min: 0, max: 50 },
        isRequired: true
      },
      {
        id: 'payback_period',
        name: 'Payback Period',
        description: 'Simple payback period',
        type: 'calculated',
        dataType: 'number',
        unit: 'years',
        formula: 'total_project_cost / annual_revenue_year1'
      },
      {
        id: 'dscr_minimum',
        name: 'Minimum DSCR',
        description: 'Minimum debt service coverage ratio',
        type: 'input',
        dataType: 'number',
        validation: { min: 1, max: 5 },
        defaultValue: 1.2
      }
    ]
  }
];

// Formula calculation engine
export const calculateComprehensiveFormulas = (formData: Record<string, any>): Record<string, any> => {
  const calculated = { ...formData };
  
  try {
    // Basic calculations
    if (calculated.plant_capacity_dc && calculated.plant_capacity_ac) {
      calculated.dc_ac_ratio = calculated.plant_capacity_dc / calculated.plant_capacity_ac;
    }
    
    if (calculated.debt_percentage) {
      calculated.equity_percentage = 100 - calculated.debt_percentage;
    }
    
    if (calculated.total_project_cost && calculated.debt_percentage) {
      calculated.debt_amount = calculated.total_project_cost * (calculated.debt_percentage / 100);
      calculated.equity_amount = calculated.total_project_cost * ((100 - calculated.debt_percentage) / 100);
    }
    
    if (calculated.plant_capacity_ac && calculated.plant_load_factor) {
      calculated.annual_energy_generation = calculated.plant_capacity_ac * (calculated.plant_load_factor / 100) * 8760;
    }
    
    if (calculated.annual_energy_generation && calculated.tariff_rate) {
      calculated.annual_revenue_year1 = calculated.annual_energy_generation * calculated.tariff_rate;
    }
    
    // OPEX calculations
    const omFixed = (calculated.om_cost_fixed || 0) * (calculated.plant_capacity_ac || 0);
    const omVariable = (calculated.om_cost_variable || 0) * (calculated.annual_energy_generation || 0);
    const insurance = (calculated.insurance_cost || 0) * (calculated.total_project_cost || 0) / 100;
    const landLease = calculated.land_lease_cost || 0;
    calculated.total_annual_opex_year1 = omFixed + omVariable + insurance + landLease;
    
    // Payback period
    if (calculated.total_project_cost && calculated.annual_revenue_year1) {
      calculated.payback_period = calculated.total_project_cost / calculated.annual_revenue_year1;
    }
    
    // Date calculations
    if (calculated.commercial_operation_date && calculated.ppa_term) {
      const codDate = new Date(calculated.commercial_operation_date);
      const decommissioningDate = new Date(codDate);
      decommissioningDate.setFullYear(codDate.getFullYear() + (calculated.ppa_term || 25));
      calculated.decommissioning_date = decommissioningDate.toISOString().split('T')[0];
    }
    
    // Construction period calculation
    if (calculated.construction_start_date && calculated.commercial_operation_date) {
      const startDate = new Date(calculated.construction_start_date);
      const codDate = new Date(calculated.commercial_operation_date);
      const diffTime = Math.abs(codDate.getTime() - startDate.getTime());
      calculated.construction_period = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30)); // in months
    }
    
  } catch (error) {
    console.error('Formula calculation error:', error);
  }
  
  return calculated;
};

// Get all input fields for form rendering
export const getInputFields = (): FieldDefinition[] => {
  const inputFields: FieldDefinition[] = [];
  
  COMPREHENSIVE_ASSUMPTIONS.forEach(section => {
    section.fields.forEach(field => {
      if (field.type === 'input') {
        inputFields.push(field);
      }
    });
  });
  
  return inputFields;
};

// Get all calculated fields for display
export const getCalculatedFields = (): FieldDefinition[] => {
  const calculatedFields: FieldDefinition[] = [];
  
  COMPREHENSIVE_ASSUMPTIONS.forEach(section => {
    section.fields.forEach(field => {
      if (field.type === 'calculated' || field.type === 'formula') {
        calculatedFields.push(field);
      }
    });
  });
  
  return calculatedFields;
};
