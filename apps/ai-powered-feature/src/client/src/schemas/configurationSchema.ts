import type { RJSFSchema, UiSchema } from '@rjsf/utils';

const mergeSourceSchema: RJSFSchema = {
  type: 'object',
  properties: {
    index: { type: 'integer', title: 'Index', default: -1 },
    variants: { type: 'array', items: { type: 'string' }, title: 'Variants', default: [] },
    offset: { type: 'integer', title: 'Offset', default: 0 },
    source: { type: 'string', enum: ['Cell', 'Header'], title: 'Source', default: 'Cell' },
  },
};

const parameterSchema: RJSFSchema = {
  type: 'object',
  required: ['logicalName'],
  properties: {
    index: { type: 'integer', title: 'Column Index', default: 0 },
    logicalName: { type: 'string', title: 'Logical Name' },
    source: { type: 'string', enum: ['Cell', 'Header'], title: 'Source', default: 'Cell' },
    type: {
      type: 'string',
      enum: ['String', 'Int', 'Long', 'Decimal', 'Double', 'Bool', 'DateTime'],
      title: 'Type',
      default: 'String',
    },
    format: { type: 'string', title: 'Format' },
    formats: { type: 'array', items: { type: 'string' }, title: 'Additional Formats', default: [] },
    variants: { type: 'array', items: { type: 'string' }, title: 'Variants', default: [] },
    offset: { type: 'integer', title: 'Offset', default: 0 },
    extractPattern: { type: 'string', title: 'Extract Pattern' },
    replacePattern: { type: 'string', title: 'Replace Pattern' },
    replaceWith: { type: 'string', title: 'Replace With' },
    trueValues: { type: 'array', items: { type: 'string' }, title: 'True Values', default: [] },
    timeZoneId: { type: 'string', title: 'Time Zone ID' },
    hasUtcOffset: { type: 'boolean', title: 'Has UTC Offset', default: false },
    mergeSeparator: { type: 'string', title: 'Merge Separator', default: ' ' },
    mergeFrom: {
      type: 'array',
      title: 'Merge From',
      items: mergeSourceSchema,
      default: [],
    },
  },
};

const blockSchema: RJSFSchema = {
  type: 'object',
  required: ['logicalName'],
  properties: {
    logicalName: { type: 'string', title: 'Block Name' },
    isCollection: { type: 'boolean', title: 'Is Collection', default: false },
    startIndex: { type: 'integer', title: 'Start Index', default: 0 },
    itemSize: { type: 'integer', title: 'Item Size', default: 0 },
    variants: { type: 'array', items: { type: 'string' }, title: 'Variants', default: [] },
    parameters: {
      type: 'array',
      title: 'Parameters',
      items: parameterSchema,
      default: [],
    },
  },
};

export const configurationSchema: RJSFSchema = {
  type: 'object',
  required: ['separator'],
  properties: {
    separator: { type: 'string', title: 'Separator', default: ',' },
    hasHeader: { type: 'boolean', title: 'Has Header', default: true },
    encoding: { type: 'string', title: 'Encoding' },
    grouping: {
      type: 'object',
      title: 'Grouping',
      properties: {
        propertyLogicalName: { type: 'string', title: 'Group By Property' },
      },
    },
    blocks: {
      type: 'array',
      title: 'Blocks',
      items: blockSchema,
      default: [],
    },
  },
};

export const configurationUiSchema: UiSchema = {
  'ui:order': ['separator', 'hasHeader', 'encoding', 'grouping', 'blocks'],
  separator: { 'ui:widget': 'text', 'ui:placeholder': 'e.g. , or ;' },
  encoding: { 'ui:widget': 'text', 'ui:placeholder': 'e.g. utf-8, iso-8859-1' },
  blocks: {
    items: {
      'ui:order': ['logicalName', 'isCollection', 'startIndex', 'itemSize', 'variants', 'parameters'],
      parameters: {
        items: {
          'ui:order': [
            'logicalName', 'index', 'source', 'type', 'format', 'formats',
            'variants', 'offset', 'extractPattern', 'replacePattern', 'replaceWith',
            'trueValues', 'timeZoneId', 'hasUtcOffset', 'mergeSeparator', 'mergeFrom',
          ],
          source: { 'ui:widget': 'select' },
          type: { 'ui:widget': 'select' },
          mergeFrom: { 'ui:options': { orderable: true } },
          formats: { 'ui:options': { orderable: false } },
          trueValues: { 'ui:options': { orderable: false } },
          variants: { 'ui:options': { orderable: false } },
        },
      },
    },
  },
};
