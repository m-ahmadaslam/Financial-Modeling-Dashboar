// Backend API service for connecting to FastAPI
const BACKEND_URL = 'http://localhost:8000';

export interface FieldInfo {
  id: string;
  name: string;
  row: number;
  column: string;
  type: 'input' | 'calculated';
  dataType: 'text' | 'number' | 'currency' | 'percentage' | 'date' | 'boolean';
  value: any;
  formula?: string;
  isNamedCell: boolean;
  namedCell?: string;
  required: boolean;
  unit?: string;
  section: string;
  heading: string;
}

export interface SectionInfo {
  id: string;
  name: string;
  row: number;
  headings: Record<string, any>;
  fields: FieldInfo[];
}

export interface ExcelAnalysisResult {
  totalSheets: number;
  totalFields: number;
  inputFields: number;
  calculatedFields: number;
  sections: SectionInfo[];
  formulaPatterns: Record<string, number>;
  analysisTimestamp: string;
}

export interface CSVExportData {
  metadata: {
    totalSheets: number;
    totalFields: number;
    inputFields: number;
    calculatedFields: number;
    analysisTimestamp: string;
  };
  sections: Array<{
    id: string;
    name: string;
    row: number;
    fieldCount: number;
  }>;
  fields: FieldInfo[];
}

class BackendAPI {
  private baseURL: string;

  constructor(baseURL: string = BACKEND_URL) {
    this.baseURL = baseURL;
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseURL}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
  }

  async analyzeExcelFile(filename: string): Promise<ExcelAnalysisResult> {
    const response = await fetch(`${this.baseURL}/analyze-excel/${filename}`);
    if (!response.ok) {
      throw new Error(`Excel analysis failed: ${response.statusText}`);
    }
    return response.json();
  }

  async getCurrentAnalysis(): Promise<ExcelAnalysisResult> {
    const response = await fetch(`${this.baseURL}/get-analysis`);
    if (!response.ok) {
      throw new Error(`Get analysis failed: ${response.statusText}`);
    }
    return response.json();
  }

  async exportToCSV(): Promise<CSVExportData> {
    const response = await fetch(`${this.baseURL}/export-csv`);
    if (!response.ok) {
      throw new Error(`CSV export failed: ${response.statusText}`);
    }
    return response.json();
  }

  async uploadExcelFile(file: File): Promise<ExcelAnalysisResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/upload-excel`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`File upload failed: ${response.statusText}`);
    }
    return response.json();
  }

  // Utility methods for data transformation
  transformToComprehensiveSections(analysis: ExcelAnalysisResult): any {
    const comprehensiveSections: any = {};

    analysis.sections.forEach((section) => {
      const sectionId = section.id.replace('section_', '').toLowerCase();
      const sectionName = section.name.toLowerCase().replace(/\s+/g, '_');

      comprehensiveSections[sectionId] = {
        id: sectionId,
        name: section.name,
        icon: this.getSectionIcon(section.name),
        color: this.getSectionColor(section.name),
        headings: this.transformHeadings(section.headings, section.fields),
        fields: section.fields.map(field => this.transformField(field))
      };
    });

    return comprehensiveSections;
  }

  private transformHeadings(headings: Record<string, any>, fields: FieldInfo[]): Record<string, any> {
    const transformedHeadings: any = {};

    // Group fields by heading
    const fieldsByHeading: Record<string, FieldInfo[]> = {};
    fields.forEach(field => {
      const headingKey = field.heading || 'general';
      if (!fieldsByHeading[headingKey]) {
        fieldsByHeading[headingKey] = [];
      }
      fieldsByHeading[headingKey].push(field);
    });

    // Create heading objects
    Object.entries(fieldsByHeading).forEach(([headingKey, headingFields]) => {
      transformedHeadings[headingKey] = {
        id: headingKey,
        name: this.formatHeadingName(headingKey),
        assumptions: headingFields.map(field => this.transformField(field))
      };
    });

    return transformedHeadings;
  }

  private transformField(field: FieldInfo): any {
    return {
      id: field.id,
      name: field.name,
      row: field.row,
      type: field.type,
      dataType: field.dataType,
      value: field.value,
      formula: field.formula,
      isNamedCell: field.isNamedCell,
      namedCell: field.namedCell,
      required: field.required,
      unit: field.unit
    };
  }

  private getSectionIcon(sectionName: string): string {
    const iconMap: Record<string, string> = {
      'MODEL STRUCTURE': '🏗️',
      'CONSTRUCTION': '🏗️',
      'OPERATION': '⚙️',
      'REVENUE': '💰',
      'DEBT': '🏦',
      'EQUITY': '📈',
      'TAX': '📊',
      'TECHNICAL': '🔧',
      'FINANCING': '💳',
      'ASSUMPTION': '📋',
      'INPUT': '📝',
      'OUTPUT': '📤',
      'CALCULATION': '🧮'
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (sectionName.toUpperCase().includes(key)) {
        return icon;
      }
    }
    return '📋';
  }

  private getSectionColor(sectionName: string): string {
    const colorMap: Record<string, string> = {
      'MODEL STRUCTURE': 'blue',
      'CONSTRUCTION': 'orange',
      'OPERATION': 'green',
      'REVENUE': 'green',
      'DEBT': 'red',
      'EQUITY': 'blue',
      'TAX': 'purple',
      'TECHNICAL': 'gray',
      'FINANCING': 'indigo',
      'ASSUMPTION': 'blue',
      'INPUT': 'blue',
      'OUTPUT': 'green',
      'CALCULATION': 'purple'
    };

    for (const [key, color] of Object.entries(colorMap)) {
      if (sectionName.toUpperCase().includes(key)) {
        return color;
      }
    }
    return 'blue';
  }

  private formatHeadingName(headingKey: string): string {
    return headingKey
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Get statistics about the analysis
  getAnalysisStatistics(analysis: ExcelAnalysisResult) {
    return {
      totalSheets: analysis.totalSheets,
      totalFields: analysis.totalFields,
      inputFields: analysis.inputFields,
      calculatedFields: analysis.calculatedFields,
      totalSections: analysis.sections.length,
      formulaPatterns: analysis.formulaPatterns,
      lastAnalyzed: analysis.analysisTimestamp
    };
  }

  // Get input fields only
  getInputFields(analysis: ExcelAnalysisResult): FieldInfo[] {
    return analysis.sections
      .flatMap(section => section.fields)
      .filter(field => field.type === 'input');
  }

  // Get calculated fields only
  getCalculatedFields(analysis: ExcelAnalysisResult): FieldInfo[] {
    return analysis.sections
      .flatMap(section => section.fields)
      .filter(field => field.type === 'calculated');
  }

  // Get fields by section
  getFieldsBySection(analysis: ExcelAnalysisResult, sectionId: string): FieldInfo[] {
    const section = analysis.sections.find(s => s.id === sectionId);
    return section ? section.fields : [];
  }

  // Get fields by heading
  getFieldsByHeading(analysis: ExcelAnalysisResult, sectionId: string, headingId: string): FieldInfo[] {
    const section = analysis.sections.find(s => s.id === sectionId);
    if (!section) return [];
    
    return section.fields.filter(field => field.heading === headingId);
  }
}

// Export singleton instance
export const backendAPI = new BackendAPI();

// Export the class for custom instances
export default BackendAPI;
