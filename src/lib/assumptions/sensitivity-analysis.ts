// SENSITIVITY ANALYSIS Assumptions
export const sensitivityanalysisAssumptions: any = {
  

    "id": "sensitivity_analysis",
    "name": "Sensitivity Analysis",
    "icon": "📈",
    "color": "red",
    "headings": {
      "project_calculations": {
        "id": "project_calculations",
        "name": "Project Calculations",
        "assumptions": [
          {
            "id": "field_1229",
            "name": "Swap allocation check - Cons",
            "row": 1229,
            "type": "calculated",
            "dataType": "number",
            "value": 0,
            "formula": "= IF( ( F1214 + F1219 + F1224 ) <> 1, 1, 0 )",
            "isNamedCell": false,
            "required": false,
            "section": "sensitivity_analysis",
            "heading": "project_calculations"
          },
          {
            "id": "field_1230",
            "name": "Swap allocation check - Ops",
            "row": 1230,
            "type": "calculated",
            "dataType": "number",
            "value": 0,
            "formula": "= IF( ( F1215 + F1220 + F1225 ) <> 1, 1, 0 )",
            "isNamedCell": false,
            "required": false,
            "section": "sensitivity_analysis",
            "heading": "project_calculations"
          }
        ]
      },
      "timeline_calculations": {
        "id": "timeline_calculations",
        "name": "Timeline Calculations",
        "assumptions": [
          {
            "id": "field_47",
            "name": "End of extension period",
            "row": 47,
            "type": "calculated",
            "dataType": "date",
            "value": "2053-01-31 00:00:00+00:00",
            "formula": "= EOMONTH( F45, F46 * Months_per_year)",
            "isNamedCell": false,
            "required": false,
            "section": "sensitivity_analysis",
            "heading": "timeline_calculations"
          }
        ]
      }
    },
    "fields": [
      {
        "id": "field_47",
        "name": "End of extension period",
        "row": 47,
        "type": "calculated",
        "dataType": "date",
        "value": "2053-01-31 00:00:00+00:00",
        "formula": "= EOMONTH( F45, F46 * Months_per_year)",
        "isNamedCell": false,
        "required": false,
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1214",
        "name": "Bank 1 swap allocation - Cons",
        "row": 1214,
        "type": "input",
        "dataType": "number",
        "value": 1,
        "formula": "= INDEX( $K1214:$Q1214, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F1214",
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1215",
        "name": "Bank 1 swap allocation - Ops",
        "row": 1215,
        "type": "input",
        "dataType": "number",
        "value": 1,
        "formula": "= INDEX( $K1215:$Q1215, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F1215",
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1216",
        "name": "Bank 1 swap credit spread - Cons",
        "row": 1216,
        "type": "input",
        "dataType": "number",
        "value": 0,
        "formula": "= INDEX( $K1216:$Q1216, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F1216",
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1217",
        "name": "Bank 1 swap credit spread - Ops",
        "row": 1217,
        "type": "input",
        "dataType": "number",
        "value": 0,
        "formula": "= INDEX( $K1217:$Q1217, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F1217",
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1219",
        "name": "Bank 2 swap allocation - Cons",
        "row": 1219,
        "type": "input",
        "dataType": "number",
        "value": 0,
        "formula": "= INDEX( $K1219:$Q1219, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F1219",
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1220",
        "name": "Bank 2 swap allocation - Ops",
        "row": 1220,
        "type": "input",
        "dataType": "number",
        "value": 0,
        "formula": "= INDEX( $K1220:$Q1220, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F1220",
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1221",
        "name": "Bank 2 swap credit spread - Cons",
        "row": 1221,
        "type": "input",
        "dataType": "number",
        "value": 0,
        "formula": "= INDEX( $K1221:$Q1221, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F1221",
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1222",
        "name": "Bank 2 swap credit spread - Ops",
        "row": 1222,
        "type": "input",
        "dataType": "number",
        "value": 0,
        "formula": "= INDEX( $K1222:$Q1222, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F1222",
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1224",
        "name": "Bank 3 swap allocation - Cons",
        "row": 1224,
        "type": "input",
        "dataType": "number",
        "value": 0,
        "formula": "= INDEX( $K1224:$Q1224, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F1224",
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1225",
        "name": "Bank 3 swap allocation - Ops",
        "row": 1225,
        "type": "input",
        "dataType": "number",
        "value": 0,
        "formula": "= INDEX( $K1225:$Q1225, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F1225",
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1226",
        "name": "Bank 3 swap credit spread - Cons",
        "row": 1226,
        "type": "input",
        "dataType": "number",
        "value": 0,
        "formula": "= INDEX( $K1226:$Q1226, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F1226",
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1227",
        "name": "Bank 3 swap credit spread - Ops",
        "row": 1227,
        "type": "input",
        "dataType": "number",
        "value": 0,
        "formula": "= INDEX( $K1227:$Q1227, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F1227",
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1229",
        "name": "Swap allocation check - Cons",
        "row": 1229,
        "type": "calculated",
        "dataType": "number",
        "value": 0,
        "formula": "= IF( ( F1214 + F1219 + F1224 ) <> 1, 1, 0 )",
        "isNamedCell": false,
        "required": false,
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1230",
        "name": "Swap allocation check - Ops",
        "row": 1230,
        "type": "calculated",
        "dataType": "number",
        "value": 0,
        "formula": "= IF( ( F1215 + F1220 + F1225 ) <> 1, 1, 0 )",
        "isNamedCell": false,
        "required": false,
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_1744",
        "name": "EBL swap credit premium",
        "row": 1744,
        "type": "input",
        "dataType": "number",
        "value": 0,
        "formula": "= INDEX( $K1744:$Q1744, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F1744",
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_2126",
        "name": "Cap for Delay LD in EGR in months",
        "row": 2126,
        "type": "input",
        "dataType": "number",
        "value": 0,
        "formula": "= INDEX( $K2126:$Q2126, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F2126",
        "unit": "months",
        "section": "sensitivity_analysis"
      },
      {
        "id": "field_2144",
        "name": "Cap on delay LD",
        "row": 2144,
        "type": "input",
        "dataType": "number",
        "value": 0,
        "formula": "= INDEX( $K2144:$Q2144, 0, LiveCase + 1 )",
        "isNamedCell": true,
        "required": false,
        "namedCell": "F2144",
        "section": "sensitivity_analysis"
      }
    ]
};

// Fields array is already included in the structure above
