// Clean Comprehensive Input Data - Modular Structure
// Generated from massive file cleanup

// Import all sections
import { projectdetailsAssumptions } from './assumptions/project-details';
import { timelinesAssumptions } from './assumptions/timelines';
import { operatingcostsopexAssumptions } from './assumptions/operating-costs--opex-';
import { sensitivityanalysisAssumptions } from './assumptions/sensitivity-analysis';
import { macroeconomicassumptionsAssumptions } from './assumptions/macroeconomic-assumptions';
import { constructioncostsAssumptions } from './assumptions/construction-costs';
import { planttechnicalspecificationsAssumptions } from './assumptions/plant-technical-specifications';
import { revenuetariffAssumptions } from './assumptions/revenue---tariff';
import { debtfinancingAssumptions } from './assumptions/debt-financing';
import { financialstructureAssumptions } from './assumptions/financial-structure';

// Main comprehensive sections object
export const COMPREHENSIVE_SECTIONS: any = {
  project_details: projectdetailsAssumptions,
  timelines: timelinesAssumptions,
  operating_costs__opex_: operatingcostsopexAssumptions,
  sensitivity_analysis: sensitivityanalysisAssumptions,
  macroeconomic_assumptions: macroeconomicassumptionsAssumptions,
  construction_costs: constructioncostsAssumptions,
  plant_technical_specifications: planttechnicalspecificationsAssumptions,
  revenue___tariff: revenuetariffAssumptions,
  debt_financing: debtfinancingAssumptions,
  financial_structure: financialstructureAssumptions,
};

// Types
export interface InputField {
  id: string;
  name: string;
  row: number;
  type: 'input' | 'calculated';
  dataType: 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'boolean';
  value?: string | number;
  unit?: string;
  required?: boolean;
  formula?: string;
  namedCell?: string;
  section?: string;
  heading?: string;
  isNamedCell?: boolean;
  hasFormula?: boolean;
  originalFormula?: string;
}

export interface Section {
  id: string;
  name: string;
  icon: string;
  color: string;
  headings: Record<string, Heading>;
  fields: InputField[];
}

export interface Heading {
  id: string;
  name: string;
  assumptions: InputField[];
}

export const getDataStatistics = () => {
  const allFields = Object.values(COMPREHENSIVE_SECTIONS).flatMap((section: any) => 
    Object.values(section.headings).flatMap((heading: any) => heading.assumptions)
  );
  const inputFields = allFields.filter((field: any) => field.type === 'input');
  const calculatedFields = allFields.filter((field: any) => field.type === 'calculated');
  const namedCells = allFields.filter((field: any) => field.isNamedCell);
  const withFormulas = allFields.filter((field: any) => field.formula);

  return {
    totalSections: Object.keys(COMPREHENSIVE_SECTIONS).length,
    totalFields: allFields.length,
    inputFields: inputFields.length,
    calculatedFields: calculatedFields.length,
    namedCells: namedCells.length,
    withFormulas: withFormulas.length,
    rowRange: {
      min: Math.min(...allFields.map((f: any) => f.row)),
      max: Math.max(...allFields.map((f: any) => f.row))
    }
  };
};

// Enhanced formula calculation function with pattern matching
export const calculateComprehensiveFormulas = (formData: Record<string, any>) => {
  const calculated: Record<string, any> = {};
  
  // Process all calculated fields
  Object.values(COMPREHENSIVE_SECTIONS).forEach((section: any) => {
    section.fields.forEach((field: any) => {
      if (field.type === 'calculated' && field.formula) {
        try {
          let result = field.formula;
          
          // Pattern 1: INDEX formulas
          if (result.includes('INDEX')) {
            const indexMatch = result.match(/INDEX\(\s*\$([A-Z])(\d+):\$([A-Z])(\d+),\s*0,\s*LiveCase\s*\+\s*1\s*\)/);
            if (indexMatch) {
              const cellRef = `${indexMatch[1]}${indexMatch[2]}`;
              result = formData[cellRef] || field.value || 0;
            }
          }
          
          // Pattern 2: EDATE formulas
          if (result.includes('EDATE')) {
            const edateMatch = result.match(/EDATE\(\s*F(\d+),\s*F(\d+)\s*\+\s*F(\d+)\s*\)\s*-\s*1/);
            if (edateMatch) {
              const startDate = formData[`F${edateMatch[1]}`] || field.value;
              const months1 = formData[`F${edateMatch[2]}`] || 0;
              const months2 = formData[`F${edateMatch[3]}`] || 0;
              const totalMonths = months1 + months2;
              
              if (startDate) {
                const date = new Date(startDate);
                date.setMonth(date.getMonth() + totalMonths);
                date.setDate(date.getDate() - 1);
                result = date.toISOString();
              }
            }
          }
          
          // Pattern 3: IF formulas
          if (result.includes('IF')) {
            const ifMatch = result.match(/IF\(\s*F(\d+)\s*=\s*100%,\s*(\d+),\s*(\d+)\s*\)/);
            if (ifMatch) {
              const condition = formData[`F${ifMatch[1]}`] || 0;
              result = condition === 100 ? ifMatch[2] : ifMatch[3];
            }
          }
          
          // Pattern 4: Simple arithmetic
          if (result.includes('+') || result.includes('-') || result.includes('*') || result.includes('/')) {
            result = result.replace(/F(\d+)/g, (match: string, rowNum: string) => {
              const fieldId = `field_${rowNum}`;
              return formData[fieldId] || 0;
            });
            
            if (field.namedCell) {
              result = result.replace(field.namedCell, formData[field.namedCell] || 0);
            }
            
            try {
              result = eval(result.replace(/[^0-9+\-*/.()]/g, ''));
            } catch (e) {
              result = field.value || 0;
            }
          }
          
          calculated[field.id] = result;
        } catch (error) {
          console.error(`Error calculating ${field.name}:`, error);
          calculated[field.id] = field.value || 0;
        }
      }
    });
  });
  
  return calculated;
};

// Get sections for dropdown
export const getSections = () => {
  return Object.entries(COMPREHENSIVE_SECTIONS).map(([key, section]: [string, any]) => ({
    id: key,
    name: section.name,
    icon: section.icon,
    color: section.color
  }));
};

// Get headings for a section
export const getHeadings = (sectionId: string) => {
  const section = (COMPREHENSIVE_SECTIONS as any)[sectionId];
  if (!section) return [];
  
  return Object.entries(section.headings).map(([key, heading]: [string, any]) => ({
    id: key,
    name: heading.name
  }));
};

// Get assumptions for a heading
export const getAssumptions = (sectionId: string, headingId: string) => {
  const section = (COMPREHENSIVE_SECTIONS as any)[sectionId];
  if (!section || !section.headings[headingId]) return [];
  
  return section.headings[headingId].assumptions;
};

// Get input fields only (for Input tab)
export const getInputFields = () => {
  return Object.values(COMPREHENSIVE_SECTIONS).flatMap((section: any) => 
    Object.values(section.headings).flatMap((heading: any) => 
      heading.assumptions.filter((field: any) => field.type === 'input')
    )
  );
};

// Get calculated fields only (for Output/Calculated tab)
export const getCalculatedFields = () => {
  return Object.values(COMPREHENSIVE_SECTIONS).flatMap((section: any) => 
    Object.values(section.headings).flatMap((heading: any) => 
      heading.assumptions.filter((field: any) => field.type === 'calculated')
    )
  );
};

// Formula pattern matching utilities
export const FormulaPatterns = {
  INDEX: /INDEX\(\s*\$([A-Z])(\d+):\$([A-Z])(\d+),\s*0,\s*LiveCase\s*\+\s*1\s*\)/,
  EDATE: /EDATE\(\s*F(\d+),\s*F(\d+)\s*\+\s*F(\d+)\s*\)\s*-\s*1/,
  IF: /IF\(\s*F(\d+)\s*=\s*100%,\s*(\d+),\s*(\d+)\s*\)/,
  ARITHMETIC: /[+\-*/]/,
  CELL_REF: /F(\d+)/g,
  NAMED_CELL: /\$([A-Z])(\d+)/
};

// Validate formula patterns
export const validateFormula = (formula: string) => {
  const patterns = Object.values(FormulaPatterns);
  return patterns.some(pattern => pattern.test(formula));
};

// Get formula type
export const getFormulaType = (formula: string) => {
  if (FormulaPatterns.INDEX.test(formula)) return 'INDEX';
  if (FormulaPatterns.EDATE.test(formula)) return 'EDATE';
  if (FormulaPatterns.IF.test(formula)) return 'IF';
  if (FormulaPatterns.ARITHMETIC.test(formula)) return 'ARITHMETIC';
  return 'UNKNOWN';

};
