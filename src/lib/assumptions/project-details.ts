// PROJECT DETAILS Assumptions
export const projectdetailsAssumptions: any = {
  

    "id": "project_details",
    "name": "Project details",
    "icon": "📋",
    "color": "blue",
    "headings": {
      "project_information": {
        "id": "project_information",
        "name": "Project Information",
        "assumptions": [
          {
            "id": "field_10",
            "name": "Project Name",
            "row": 10,
            "type": "input",
            "dataType": "text",
            "value": "NJN",
            "formula": "= E6",
            "isNamedCell": false,
            "required": true,
            "section": "project_details",
            "heading": "project_information"
          },
          {
            "id": "field_41",
            "name": "Project construction over date",
            "row": 41,
            "type": "calculated",
            "dataType": "date",
            "value": "2028-01-31 00:00:00+00:00",
            "formula": "= EDATE( F32, F37 + F40 ) - 1",
            "isNamedCell": false,
            "required": true,
            "section": "project_details",
            "heading": "project_information"
          },
          {
            "id": "field_59",
            "name": "Project Shareholding check",
            "row": 59,
            "type": "calculated",
            "dataType": "number",
            "value": 0,
            "formula": "= IF( F58 = 100%, 0, 1 )",
            "isNamedCell": false,
            "required": true,
            "section": "project_details",
            "heading": "project_information"
          },
          {
            "id": "field_61",
            "name": "Bidder share in project co",
            "row": 61,
            "type": "input",
            "dataType": "number",
            "value": 1,
            "formula": "= INDEX( $K61:$Q61, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "namedCell": "F61",
            "section": "project_details",
            "heading": "project_information"
          },
          {
            "id": "field_78",
            "name": "Reference date for indexation",
            "row": 78,
            "type": "input",
            "dataType": "date",
            "value": "2025-01-01 00:00:00+00:00",
            "formula": "= INDEX( $K78:$Q78, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "namedCell": "F78",
            "section": "project_details",
            "heading": "project_information"
          },
          {
            "id": "field_838",
            "name": "Project capacity - AC",
            "row": 838,
            "type": "input",
            "dataType": "number",
            "value": 1351,
            "formula": "= INDEX( $K838:$Q838, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "namedCell": "F838",
            "unit": "MW",
            "section": "project_details",
            "heading": "project_information"
          },
          {
            "id": "field_839",
            "name": "Project capacity - DC",
            "row": 839,
            "type": "input",
            "dataType": "number",
            "value": 1622.01,
            "formula": "= INDEX( $K839:$P839, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "namedCell": "F839",
            "unit": "MW",
            "section": "project_details",
            "heading": "project_information"
          },
          {
            "id": "field_2042",
            "name": "Tax during EGR period funded as project cost?",
            "row": 2042,
            "type": "input",
            "dataType": "currency",
            "value": 1,
            "formula": "= INDEX( $K2042:$Q2042, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "unit": "USD",
            "namedCell": "F2042",
            "section": "project_details",
            "heading": "project_information"
          },
          {
            "id": "field_2125",
            "name": "PV project delay LD rate for EGR period to SPPC",
            "row": 2125,
            "type": "input",
            "dataType": "percentage",
            "value": 0,
            "formula": "= INDEX( $K2125:$Q2125, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "unit": "%",
            "namedCell": "F2125",
            "section": "project_details",
            "heading": "project_information"
          },
          {
            "id": "field_2127",
            "name": "Solar project delay LD rate for EGR period to SPPC",
            "row": 2127,
            "type": "input",
            "dataType": "percentage",
            "value": 0,
            "formula": "= INDEX( $K2127:$Q2127, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "unit": "%",
            "namedCell": "F2127",
            "section": "project_details",
            "heading": "project_information"
          },
          {
            "id": "field_2128",
            "name": "PV project Cap on EGR period Delay LD to SPPC",
            "row": 2128,
            "type": "calculated",
            "dataType": "number",
            "value": 0,
            "formula": "= F2125 * F2126 * Days_per_bank_month / thousand",
            "isNamedCell": false,
            "required": true,
            "unit": "years",
            "section": "project_details",
            "heading": "project_information"
          }
        ]
      },
      "project_capacity": {
        "id": "project_capacity",
        "name": "Project Capacity",
        "assumptions": [
          {
            "id": "field_838",
            "name": "Project capacity - AC",
            "row": 838,
            "type": "input",
            "dataType": "number",
            "value": 1351,
            "formula": "= INDEX( $K838:$Q838, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "namedCell": "F838",
            "unit": "MW",
            "section": "project_basic_information",
            "heading": "project_capacity"
          },
          {
            "id": "field_839",
            "name": "Project capacity - DC",
            "row": 839,
            "type": "input",
            "dataType": "number",
            "value": 1622.01,
            "formula": "= INDEX( $K839:$P839, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "namedCell": "F839",
            "unit": "MW",
            "section": "project_basic_information",
            "heading": "project_capacity"
          }
        ]
      },
      "project_calculations": {
        "id": "project_calculations",
        "name": "Project Calculations",
        "assumptions": [
          {
            "id": "field_41",
            "name": "Project construction over date",
            "row": 41,
            "type": "calculated",
            "dataType": "date",
            "value": "2028-01-31 00:00:00+00:00",
            "formula": "= EDATE( F32, F37 + F40 ) - 1",
            "isNamedCell": false,
            "required": true,
            "section": "project_basic_information",
            "heading": "project_calculations"
          },
          {
            "id": "field_59",
            "name": "Project Shareholding check",
            "row": 59,
            "type": "calculated",
            "dataType": "number",
            "value": 0,
            "formula": "= IF( F58 = 100%, 0, 1 )",
            "isNamedCell": false,
            "required": true,
            "section": "project_basic_information",
            "heading": "project_calculations"
          },
          {
            "id": "field_78",
            "name": "Reference date for indexation",
            "row": 78,
            "type": "input",
            "dataType": "date",
            "value": "2025-01-01 00:00:00+00:00",
            "formula": "= INDEX( $K78:$Q78, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "namedCell": "F78",
            "section": "project_basic_information",
            "heading": "project_calculations"
          }
        ]
      },
      "key_dates": {
        "id": "key_dates",
        "name": "Key Dates",
        "assumptions": [
          {
            "id": "field_41",
            "name": "Project construction over date",
            "row": 41,
            "type": "calculated",
            "dataType": "date",
            "value": "2028-01-31 00:00:00+00:00",
            "formula": "= EDATE( F32, F37 + F40 ) - 1",
            "isNamedCell": false,
            "required": true,
            "section": "project_basic_information",
            "heading": "key_dates"
          },
          {
            "id": "field_78",
            "name": "Reference date for indexation",
            "row": 78,
            "type": "input",
            "dataType": "date",
            "value": "2025-01-01 00:00:00+00:00",
            "formula": "= INDEX( $K78:$Q78, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "namedCell": "F78",
            "section": "project_basic_information",
            "heading": "key_dates"
          }
        ]
      },
      "timeline_calculations": {
        "id": "timeline_calculations",
        "name": "Timeline Calculations",
        "assumptions": [
          {
            "id": "field_2042",
            "name": "Tax during EGR period funded as project cost?",
            "row": 2042,
            "type": "input",
            "dataType": "currency",
            "value": 1,
            "formula": "= INDEX( $K2042:$Q2042, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "unit": "USD",
            "namedCell": "F2042",
            "section": "project_basic_information",
            "heading": "timeline_calculations"
          },
          {
            "id": "field_2125",
            "name": "PV project delay LD rate for EGR period to SPPC",
            "row": 2125,
            "type": "input",
            "dataType": "percentage",
            "value": 0,
            "formula": "= INDEX( $K2125:$Q2125, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "unit": "%",
            "namedCell": "F2125",
            "section": "project_basic_information",
            "heading": "timeline_calculations"
          },
          {
            "id": "field_2127",
            "name": "Solar project delay LD rate for EGR period to SPPC",
            "row": 2127,
            "type": "input",
            "dataType": "percentage",
            "value": 0,
            "formula": "= INDEX( $K2127:$Q2127, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "unit": "%",
            "namedCell": "F2127",
            "section": "project_basic_information",
            "heading": "timeline_calculations"
          },
          {
            "id": "field_2128",
            "name": "PV project Cap on EGR period Delay LD to SPPC",
            "row": 2128,
            "type": "calculated",
            "dataType": "number",
            "value": 0,
            "formula": "= F2125 * F2126 * Days_per_bank_month / thousand",
            "isNamedCell": false,
            "required": true,
            "unit": "years",
            "section": "project_basic_information",
            "heading": "timeline_calculations"
          }
        ]
      },
      "macroeconomic_rates": {
        "id": "macroeconomic_rates",
        "name": "Macroeconomic Rates",
        "assumptions": [
          {
            "id": "field_2125",
            "name": "PV project delay LD rate for EGR period to SPPC",
            "row": 2125,
            "type": "input",
            "dataType": "percentage",
            "value": 0,
            "formula": "= INDEX( $K2125:$Q2125, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "unit": "%",
            "namedCell": "F2125",
            "section": "project_basic_information",
            "heading": "macroeconomic_rates"
          },
          {
            "id": "field_2127",
            "name": "Solar project delay LD rate for EGR period to SPPC",
            "row": 2127,
            "type": "input",
            "dataType": "percentage",
            "value": 0,
            "formula": "= INDEX( $K2127:$Q2127, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "unit": "%",
            "namedCell": "F2127",
            "section": "project_basic_information",
            "heading": "macroeconomic_rates"
          }
        ]
      },
      "technical_specifications": {
        "id": "technical_specifications",
        "name": "Technical Specifications",
        "assumptions": [
          {
            "id": "field_838",
            "name": "Project capacity - AC",
            "row": 838,
            "type": "input",
            "dataType": "number",
            "value": 1351,
            "formula": "= INDEX( $K838:$Q838, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "namedCell": "F838",
            "unit": "MW",
            "section": "project_basic_information",
            "heading": "technical_specifications"
          },
          {
            "id": "field_839",
            "name": "Project capacity - DC",
            "row": 839,
            "type": "input",
            "dataType": "number",
            "value": 1622.01,
            "formula": "= INDEX( $K839:$P839, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "namedCell": "F839",
            "unit": "MW",
            "section": "project_basic_information",
            "heading": "technical_specifications"
          }
        ]
      },
      "cost_breakdown": {
        "id": "cost_breakdown",
        "name": "Cost Breakdown",
        "assumptions": [
          {
            "id": "field_2042",
            "name": "Tax during EGR period funded as project cost?",
            "row": 2042,
            "type": "input",
            "dataType": "currency",
            "value": 1,
            "formula": "= INDEX( $K2042:$Q2042, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "unit": "USD",
            "namedCell": "F2042",
            "section": "project_basic_information",
            "heading": "cost_breakdown"
          }
        ]
      },
      "financial_structure": {
        "id": "financial_structure",
        "name": "Financial Structure",
        "assumptions": [
          {
            "id": "field_2042",
            "name": "Tax during EGR period funded as project cost?",
            "row": 2042,
            "type": "input",
            "dataType": "currency",
            "value": 1,
            "formula": "= INDEX( $K2042:$Q2042, 0, LiveCase + 1 )",
            "isNamedCell": true,
            "required": true,
            "unit": "USD",
            "namedCell": "F2042",
            "section": "project_basic_information",
            "heading": "financial_structure"
          }
        ]
      }
    },
    "fields": [
      {
        "id": "field_10",
        "name": "Project Name",
        "row": 10,
        "type": "input",
        "dataType": "text",
        "value": "NJN",
        "formula": "= E6",
        "isNamedCell": false,
        "required": true,
        "section": "project_basic_information"
      },
      {
        "id": "field_41",
        "name": "Project construction over date",
        "row": 41,
        "type": "calculated",
        "dataType": "date",
        "value": "2028-01-31 00:00:00+00:00",
        "formula": "= EDATE( F32, F37 + F40 ) - 1",
        "isNamedCell": false,
        "required": true,
        "section": "project_basic_information"
      },
      {
        "id": "field_59",
        "name": "Project Shareholding check",
        "row": 59,
        "type": "calculated",
        "dataType": "number",
        "value": 0,
        "formula": "= IF( F58 = 100%, 0, 1 )",
        "isNamedCell": false,
        "required": true,
        "section": "project_basic_information"
      },
      {
        "id": "field_61",
        "name": "Bidder share in project co",
        "row": 61,
        "type": "input",
        "dataType": "number",
        "value": 1,
        "formula": "= INDEX( $K61:$Q61, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": true,
        "namedCell": "F61",
        "section": "project_basic_information"
      },
      {
        "id": "field_78",
        "name": "Reference date for indexation",
        "row": 78,
        "type": "input",
        "dataType": "date",
        "value": "2025-01-01 00:00:00+00:00",
        "formula": "= INDEX( $K78:$Q78, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": true,
        "namedCell": "F78",
        "section": "project_basic_information"
      },
      {
        "id": "field_838",
        "name": "Project capacity - AC",
        "row": 838,
        "type": "input",
        "dataType": "number",
        "value": 1351,
        "formula": "= INDEX( $K838:$Q838, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": true,
        "namedCell": "F838",
        "unit": "MW",
        "section": "project_basic_information"
      },
      {
        "id": "field_839",
        "name": "Project capacity - DC",
        "row": 839,
        "type": "input",
        "dataType": "number",
        "value": 1622.01,
        "formula": "= INDEX( $K839:$P839, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": true,
        "namedCell": "F839",
        "unit": "MW",
        "section": "project_basic_information"
      },
      {
        "id": "field_2042",
        "name": "Tax during EGR period funded as project cost?",
        "row": 2042,
        "type": "input",
        "dataType": "currency",
        "value": 1,
        "formula": "= INDEX( $K2042:$Q2042, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": true,
        "unit": "USD",
        "namedCell": "F2042",
        "section": "project_basic_information"
      },
      {
        "id": "field_2125",
        "name": "PV project delay LD rate for EGR period to SPPC",
        "row": 2125,
        "type": "input",
        "dataType": "percentage",
        "value": 0,
        "formula": "= INDEX( $K2125:$Q2125, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": true,
        "unit": "%",
        "namedCell": "F2125",
        "section": "project_basic_information"
      },
      {
        "id": "field_2127",
        "name": "Solar project delay LD rate for EGR period to SPPC",
        "row": 2127,
        "type": "input",
        "dataType": "percentage",
        "value": 0,
        "formula": "= INDEX( $K2127:$Q2127, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": true,
        "unit": "%",
        "namedCell": "F2127",
        "section": "project_basic_information"
      },
      {
        "id": "field_2128",
        "name": "PV project Cap on EGR period Delay LD to SPPC",
        "row": 2128,
        "type": "calculated",
        "dataType": "number",
        "value": 0,
        "formula": "= F2125 * F2126 * Days_per_bank_month / thousand",
        "isNamedCell": false,
        "required": true,
        "unit": "years",
        "section": "project_basic_information"
      }
    ]
};

// Fields array is already included in the structure above
