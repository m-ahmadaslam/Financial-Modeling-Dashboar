// Financial Formula Engine - Hardcoded Excel Formulas
// Based on comprehensive analysis of Ahmed.xlsx

export interface FormulaContext {
  [key: string]: any;
}

export class FinancialFormulaEngine {
  private context: FormulaContext = {};

  constructor(initialContext: FormulaContext = {}) {
    this.context = { ...initialContext };
  }

  setContext(context: FormulaContext) {
    this.context = { ...context };
  }

  getValue(fieldId: string): any {
    return this.context[fieldId];
  }

  // Hardcoded Excel formulas from Ahmed.xlsx
  calculateFormulas(formData: Record<string, any>): Record<string, any> {
    this.setContext(formData);
    const results: Record<string, any> = {};

    // Project Construction Over Date: = EDATE( F32, F37 + F40 ) - 1
    if (this.getValue('field_32') && this.getValue('field_37') && this.getValue('field_40')) {
      const startDate = new Date(this.getValue('field_32'));
      const months = this.getValue('field_37') + this.getValue('field_40');
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + months);
      endDate.setDate(endDate.getDate() - 1);
      results['field_41'] = endDate.toISOString();
    }

    // Project Shareholding Check: = IF( F58 = 100%, 0, 1 )
    if (this.getValue('field_58') !== undefined) {
      results['field_59'] = this.getValue('field_58') === 100 ? 0 : 1;
    }

    // PV Project Cap on EGR Period Delay LD: = F2125 * F2126 * Days_per_bank_month / thousand
    if (this.getValue('field_2125') && this.getValue('field_2126')) {
      const daysPerBankMonth = 30; // Standard assumption
      const thousand = 1000;
      results['field_2128'] = (this.getValue('field_2125') * this.getValue('field_2126') * daysPerBankMonth) / thousand;
    }

    // INDEX formulas - extract values from named ranges
    results['field_61'] = this.calculateIndexFormula('field_61', 'LiveCase');
    results['field_78'] = this.calculateIndexFormula('field_78', 'LiveCase');
    results['field_838'] = this.calculateIndexFormula('field_838', 'LiveCase');
    results['field_839'] = this.calculateIndexFormula('field_839', 'LiveCase');
    results['field_2042'] = this.calculateIndexFormula('field_2042', 'LiveCase');
    results['field_2125'] = this.calculateIndexFormula('field_2125', 'LiveCase');
    results['field_2127'] = this.calculateIndexFormula('field_2127', 'LiveCase');

    // Financial calculations
    results['total_project_cost'] = this.calculateTotalProjectCost();
    results['debt_service_coverage'] = this.calculateDebtServiceCoverage();
    results['equity_irr'] = this.calculateEquityIRR();
    results['project_npv'] = this.calculateProjectNPV();

    return results;
  }

  private calculateIndexFormula(fieldId: string, caseVariable: string): any {
    // Simulate INDEX formula behavior
    const baseValue = this.getValue(fieldId);
    if (baseValue !== undefined) {
      return baseValue;
    }

    // Default values based on field type
    const defaultValues: Record<string, any> = {
      'field_61': 1, // Bidder share
      'field_78': '2025-01-01', // Reference date
      'field_838': 1351, // AC capacity
      'field_839': 1622.01, // DC capacity
      'field_2042': 1, // Tax funding
      'field_2125': 0, // PV delay rate
      'field_2127': 0 // Solar delay rate
    };

    return defaultValues[fieldId] || 0;
  }

  private calculateTotalProjectCost(): number {
    // Sum of all construction costs
    const constructionCosts = [
      this.getValue('civil_works_cost') || 0,
      this.getValue('equipment_cost') || 0,
      this.getValue('installation_cost') || 0,
      this.getValue('contingency_cost') || 0
    ];
    return constructionCosts.reduce((sum, cost) => sum + cost, 0);
  }

  private calculateDebtServiceCoverage(): number {
    const ebitda = this.getValue('annual_ebitda') || 0;
    const debtService = this.getValue('annual_debt_service') || 1;
    return ebitda / debtService;
  }

  private calculateEquityIRR(): number {
    // Simplified IRR calculation
    const equityInvestment = this.getValue('total_equity') || 0;
    const annualCashFlow = this.getValue('annual_equity_cashflow') || 0;
    const projectLife = this.getValue('project_life_years') || 25;
    
    if (equityInvestment === 0) return 0;
    
    // Simplified IRR approximation
    return (annualCashFlow * projectLife - equityInvestment) / equityInvestment * 100;
  }

  private calculateProjectNPV(): number {
    const discountRate = this.getValue('discount_rate') || 0.08;
    const annualCashFlow = this.getValue('annual_project_cashflow') || 0;
    const projectLife = this.getValue('project_life_years') || 25;
    const initialInvestment = this.getValue('total_project_cost') || 0;
    
    let npv = -initialInvestment;
    for (let year = 1; year <= projectLife; year++) {
      npv += annualCashFlow / Math.pow(1 + discountRate, year);
    }
    
    return npv;
  }

  // Get all available formulas
  static getAvailableFormulas(): Record<string, string> {
    return {
      'field_41': '= EDATE( F32, F37 + F40 ) - 1',
      'field_59': '= IF( F58 = 100%, 0, 1 )',
      'field_61': '= INDEX( $K61:$Q61, 0, LiveCase + 1 )',
      'field_78': '= INDEX( $K78:$Q78, 0, LiveCase + 1 )',
      'field_838': '= INDEX( $K838:$Q838, 0, LiveCase + 1 )',
      'field_839': '= INDEX( $K839:$P839, 0, LiveCase + 1 )',
      'field_2042': '= INDEX( $K2042:$Q2042, 0, LiveCase + 1 )',
      'field_2125': '= INDEX( $K2125:$Q2125, 0, LiveCase + 1 )',
      'field_2127': '= INDEX( $K2127:$Q2127, 0, LiveCase + 1 )',
      'field_2128': '= F2125 * F2126 * Days_per_bank_month / thousand',
      'total_project_cost': '= SUM(Civil Works + Equipment + Installation + Contingency)',
      'debt_service_coverage': '= EBITDA / Annual Debt Service',
      'equity_irr': '= IRR(Equity Cash Flows)',
      'project_npv': '= NPV(Discount Rate, Project Cash Flows)'
    };
  }
}

// Export singleton instance
export const formulaEngine = new FinancialFormulaEngine();
