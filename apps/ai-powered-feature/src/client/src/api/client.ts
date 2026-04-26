import axios from 'axios';
import type {
  TemplateSummary,
  TemplateDetail,
  CsvFileParsingConfiguration,
  GenerateConfigResponse,
  ParseResponse,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

export async function listTemplates(): Promise<TemplateSummary[]> {
  const { data } = await api.get<TemplateSummary[]>('/templates');
  return data;
}

export async function getTemplate(id: string): Promise<TemplateDetail> {
  const { data } = await api.get<TemplateDetail>(`/templates/${id}`);
  return data;
}

export async function createTemplate(
  name: string,
  configuration: CsvFileParsingConfiguration,
): Promise<TemplateDetail> {
  const { data } = await api.post<TemplateDetail>('/templates', { name, configuration });
  return data;
}

export async function updateTemplate(
  id: string,
  name: string,
  configuration: CsvFileParsingConfiguration,
): Promise<TemplateDetail> {
  const { data } = await api.put<TemplateDetail>(`/templates/${id}`, { name, configuration });
  return data;
}

export async function deleteTemplate(id: string): Promise<void> {
  await api.delete(`/templates/${id}`);
}

export async function generateConfiguration(file: File): Promise<GenerateConfigResponse> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<GenerateConfigResponse>('/generate-configuration', form);
  return data;
}

export async function parseFile(
  file: File,
  configuration: CsvFileParsingConfiguration,
): Promise<ParseResponse> {
  const form = new FormData();
  form.append('file', file);
  form.append('configuration', JSON.stringify(configuration));
  const { data } = await api.post<ParseResponse>('/parse', form);
  return data;
}

export default api;
