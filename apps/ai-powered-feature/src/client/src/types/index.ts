export interface TemplateSummary {
  id: string;
  name: string;
  separator: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateDetail {
  id: string;
  name: string;
  configuration: CsvFileParsingConfiguration;
  createdAt: string;
  updatedAt: string;
}

export interface CsvFileParsingConfiguration {
  separator: string;
  hasHeader: boolean;
  encoding?: string | null;
  grouping?: { propertyLogicalName: string } | null;
  blocks: CsvFileBlockConfiguration[];
}

export interface CsvFileBlockConfiguration {
  logicalName: string;
  isCollection: boolean;
  startIndex: number;
  itemSize: number;
  variants: string[];
  parameters: CsvFileParameterMapping[];
}

export interface CsvFileParameterMapping {
  index: number;
  logicalName: string;
  source: 'Cell' | 'Header';
  type: 'String' | 'Int' | 'Long' | 'Decimal' | 'Double' | 'Bool' | 'DateTime';
  format?: string | null;
  formats: string[];
  variants: string[];
  offset: number;
  extractPattern?: string | null;
  replacePattern?: string | null;
  replaceWith?: string | null;
  trueValues: string[];
  timeZoneId?: string | null;
  hasUtcOffset: boolean;
  mergeSeparator: string;
  mergeFrom: CsvMergeSource[];
}

export interface CsvMergeSource {
  index: number;
  variants: string[];
  offset: number;
  source: 'Cell' | 'Header';
}

export interface GenerateConfigResponse {
  configuration: CsvFileParsingConfiguration;
  detectedFormat: string;
  detectedColumns: string[];
  separator: string;
  warnings: string[];
  isValid: boolean;
  validationErrors: string[];
  validationWarnings: string[];
}

export interface ParseResponse {
  fileName: string;
  totalRows: number;
  rows: Record<string, unknown>[];
}

export interface ErrorResponse {
  error: string;
  details?: string[] | null;
}
