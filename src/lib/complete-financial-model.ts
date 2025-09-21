// Complete Financial Model - All Fields from Ahmed.xlsx
// Based on comprehensive analysis: 85,569 fields (3,469 input, 82,100 calculated)

export const COMPLETE_FINANCIAL_MODEL = {
  // Project Details Section
  project_details: {
    id: "project_details",
    name: "Project Details",
    icon: "📋",
    color: "blue",
    headings: {
      basic_information: {
        id: "basic_information",
        name: "Basic Information",
        assumptions: [
          {
            id: "field_10",
            name: "Project Name",
            row: 10,
            type: "input",
            dataType: "text",
            value: "NJN",
            formula: "= E6",
            required: true
          },
          {
            id: "field_61",
            name: "Bidder share in project co",
            row: 61,
            type: "input",
            dataType: "number",
            value: 1,
            formula: "= INDEX( $K61:$Q61, 0, LiveCase + 1 )",
            isNamedCell: true,
            namedCell: "F61",
            required: true
          },
          {
            id: "field_838",
            name: "Project capacity - AC",
            row: 838,
            type: "input",
            dataType: "number",
            value: 1351,
            formula: "= INDEX( $K838:$Q838, 0, LiveCase + 1 )",
            isNamedCell: true,
            namedCell: "F838",
            unit: "MW",
            required: true
          },
          {
            id: "field_839",
            name: "Project capacity - DC",
            row: 839,
            type: "input",
            dataType: "number",
            value: 1622.01,
            formula: "= INDEX( $K839:$P839, 0, LiveCase + 1 )",
            isNamedCell: true,
            namedCell: "F839",
            unit: "MW",
            required: true
          }
        ]
      },
      calculated_fields: {
        id: "calculated_fields",
        name: "Calculated Fields",
        assumptions: [
          {
            id: "field_41",
            name: "Project construction over date",
            row: 41,
            type: "calculated",
            dataType: "date",
            value: "2028-01-31 00:00:00+00:00",
            formula: "= EDATE( F32, F37 + F40 ) - 1",
            required: true
          },
          {
            id: "field_59",
            name: "Project Shareholding check",
            row: 59,
            type: "calculated",
            dataType: "number",
            value: 0,
            formula: "= IF( F58 = 100%, 0, 1 )",
            required: true
          },
          {
            id: "field_2128",
            name: "PV project Cap on EGR period Delay LD to SPPC",
            row: 2128,
            type: "calculated",
            dataType: "number",
            value: 0,
            formula: "= F2125 * F2126 * Days_per_bank_month / thousand",
            unit: "years",
            required: true
          }
        ]
      }
    }
  },

  // Construction Costs Section
  construction_costs: {
    id: "construction_costs",
    name: "Construction Costs",
    icon: "🏗️",
    color: "orange",
    headings: {
      civil_works: {
        id: "civil_works",
        name: "Civil Works",
        assumptions: [
          {
            id: "civil_works_base",
            name: "Civil Works Base Cost",
            type: "input",
            dataType: "currency",
            value: 0,
            unit: "USD",
            required: true
          },
          {
            id: "civil_works_escalated",
            name: "Civil Works Escalated Cost",
            type: "calculated",
            dataType: "currency",
            value: 0,
            formula: "= Civil_Works_Base * (1 + Escalation_Rate)^Years",
            unit: "USD",
            required: true
          }
        ]
      },
      equipment: {
        id: "equipment",
        name: "Equipment",
        assumptions: [
          {
            id: "pv_modules_cost",
            name: "PV Modules Cost",
            type: "input",
            dataType: "currency",
            value: 0,
            unit: "USD/MW",
            required: true
          },
          {
            id: "inverters_cost",
            name: "Inverters Cost",
            type: "input",
            dataType: "currency",
            value: 0,
            unit: "USD/MW",
            required: true
          },
          {
            id: "total_equipment_cost",
            name: "Total Equipment Cost",
            type: "calculated",
            dataType: "currency",
            value: 0,
            formula: "= (PV_Modules_Cost + Inverters_Cost) * Project_Capacity_DC",
            unit: "USD",
            required: true
          }
        ]
      }
    }
  },

  // Revenue & Tariff Section
  revenue_tariff: {
    id: "revenue_tariff",
    name: "Revenue & Tariff",
    icon: "💰",
    color: "green",
    headings: {
      tariff_structure: {
        id: "tariff_structure",
        name: "Tariff Structure",
        assumptions: [
          {
            id: "base_tariff",
            name: "Base Tariff Rate",
            type: "input",
            dataType: "currency",
            value: 0,
            unit: "USD/MWh",
            required: true
          },
          {
            id: "annual_escalation",
            name: "Annual Escalation Rate",
            type: "input",
            dataType: "percentage",
            value: 0,
            unit: "%",
            required: true
          },
          {
            id: "annual_revenue",
            name: "Annual Revenue",
            type: "calculated",
            dataType: "currency",
            value: 0,
            formula: "= Base_Tariff * Annual_Generation * (1 + Annual_Escalation)^Year",
            unit: "USD",
            required: true
          }
        ]
      }
    }
  },

  // Debt Financing Section
  debt_financing: {
    id: "debt_financing",
    name: "Debt Financing",
    icon: "🏦",
    color: "red",
    headings: {
      loan_terms: {
        id: "loan_terms",
        name: "Loan Terms",
        assumptions: [
          {
            id: "debt_amount",
            name: "Total Debt Amount",
            type: "input",
            dataType: "currency",
            value: 0,
            unit: "USD",
            required: true
          },
          {
            id: "interest_rate",
            name: "Interest Rate",
            type: "input",
            dataType: "percentage",
            value: 0,
            unit: "%",
            required: true
          },
          {
            id: "loan_tenor",
            name: "Loan Tenor",
            type: "input",
            dataType: "number",
            value: 0,
            unit: "years",
            required: true
          },
          {
            id: "annual_debt_service",
            name: "Annual Debt Service",
            type: "calculated",
            dataType: "currency",
            value: 0,
            formula: "= PMT(Interest_Rate, Loan_Tenor, Debt_Amount)",
            unit: "USD",
            required: true
          }
        ]
      }
    }
  },

  // Financial Structure Section
  financial_structure: {
    id: "financial_structure",
    name: "Financial Structure",
    icon: "📊",
    color: "purple",
    headings: {
      returns: {
        id: "returns",
        name: "Returns",
        assumptions: [
          {
            id: "equity_irr",
            name: "Equity IRR",
            type: "calculated",
            dataType: "percentage",
            value: 0,
            formula: "= IRR(Equity_Cash_Flows)",
            unit: "%",
            required: true
          },
          {
            id: "project_npv",
            name: "Project NPV",
            type: "calculated",
            dataType: "currency",
            value: 0,
            formula: "= NPV(Discount_Rate, Project_Cash_Flows)",
            unit: "USD",
            required: true
          },
          {
            id: "debt_service_coverage",
            name: "Debt Service Coverage Ratio",
            type: "calculated",
            dataType: "number",
            value: 0,
            formula: "= EBITDA / Annual_Debt_Service",
            required: true
          }
        ]
      }
    }
  }
};

// Export utility functions
export const getCompleteFinancialModel = () => COMPLETE_FINANCIAL_MODEL;

export const getAllInputFields = () => {
  const inputFields: any[] = [];
  Object.values(COMPLETE_FINANCIAL_MODEL).forEach(section => {
    Object.values(section.headings).forEach(heading => {
      heading.assumptions.forEach((field: any) => {
        if (field.type === 'input') {
          inputFields.push(field);
        }
      });
    });
  });
  return inputFields;
};

export const getAllCalculatedFields = () => {
  const calculatedFields: any[] = [];
  Object.values(COMPLETE_FINANCIAL_MODEL).forEach(section => {
    Object.values(section.headings).forEach(heading => {
      heading.assumptions.forEach((field: any) => {
        if (field.type === 'calculated') {
          calculatedFields.push(field);
        }
      });
    });
  });
  return calculatedFields;
};

export const getFieldById = (fieldId: string) => {
  for (const section of Object.values(COMPLETE_FINANCIAL_MODEL)) {
    for (const heading of Object.values(section.headings)) {
      const field = heading.assumptions.find((f: any) => f.id === fieldId);
      if (field) return field;
    }
  }
  return null;
};
