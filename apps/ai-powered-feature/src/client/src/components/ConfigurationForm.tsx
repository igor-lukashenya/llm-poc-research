import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import type { IChangeEvent } from '@rjsf/core';
import { configurationSchema, configurationUiSchema } from '../schemas/configurationSchema';
import type { CsvFileParsingConfiguration } from '../types';

interface Props {
  formData: CsvFileParsingConfiguration;
  onChange: (data: CsvFileParsingConfiguration) => void;
}

export default function ConfigurationForm({ formData, onChange }: Props) {
  const handleChange = (e: IChangeEvent<CsvFileParsingConfiguration>) => {
    if (e.formData) {
      onChange(e.formData);
    }
  };

  return (
    <Form
      schema={configurationSchema}
      uiSchema={configurationUiSchema}
      formData={formData}
      validator={validator}
      onChange={handleChange}
      liveValidate={false}
      showErrorList={false}
    >
      {/* Hide the default submit button */}
      <div />
    </Form>
  );
}
