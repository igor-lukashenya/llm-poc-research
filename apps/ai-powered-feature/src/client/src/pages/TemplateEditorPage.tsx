import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, TextField, Grid, Snackbar, Alert, CircularProgress, Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import * as yup from 'yup';
import { getTemplate, createTemplate, updateTemplate, generateConfiguration, parseFile } from '../api/client';
import type { CsvFileParsingConfiguration, ParseResponse } from '../types';
import ConfigurationForm from '../components/ConfigurationForm';
import JsonConfigEditor from '../components/JsonConfigEditor';
import FileUploader from '../components/FileUploader';
import ParseResultsViewer from '../components/ParseResultsViewer';

const nameSchema = yup.string().required('Name is required').min(3, 'Name must be at least 3 characters');

const defaultConfig: CsvFileParsingConfiguration = {
  separator: ',',
  hasHeader: true,
  blocks: [],
};

export default function TemplateEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [configuration, setConfiguration] = useState<CsvFileParsingConfiguration>(defaultConfig);
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseResponse | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; severity: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      getTemplate(id)
        .then((t) => {
          setName(t.name);
          setConfiguration(t.configuration);
        })
        .catch(() => setSnackbar({ message: 'Failed to load template', severity: 'error' }))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleFormChange = useCallback((data: CsvFileParsingConfiguration) => {
    setConfiguration(data);
  }, []);

  const handleJsonApply = useCallback((data: CsvFileParsingConfiguration) => {
    setConfiguration(data);
  }, []);

  const handleSave = async () => {
    try {
      await nameSchema.validate(name);
      setNameError(null);
    } catch (e) {
      if (e instanceof yup.ValidationError) {
        setNameError(e.message);
        return;
      }
    }

    setSaving(true);
    try {
      if (isNew) {
        await createTemplate(name, configuration);
      } else {
        await updateTemplate(id!, name, configuration);
      }
      setSnackbar({ message: 'Template saved successfully', severity: 'success' });
      setTimeout(() => navigate('/'), 500);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to save template';
      setSnackbar({ message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      setSnackbar({ message: 'Please upload a file first', severity: 'warning' });
      return;
    }
    setGenerating(true);
    try {
      const result = await generateConfiguration(file);
      setConfiguration(result.configuration);
      const msgs: string[] = [];
      if (result.warnings?.length) msgs.push(`Warnings: ${result.warnings.join(', ')}`);
      if (result.validationErrors?.length) msgs.push(`Errors: ${result.validationErrors.join(', ')}`);
      if (result.validationWarnings?.length) msgs.push(`Validation warnings: ${result.validationWarnings.join(', ')}`);
      if (msgs.length) {
        setSnackbar({ message: msgs.join(' | '), severity: 'warning' });
      } else {
        setSnackbar({ message: `Configuration generated (${result.detectedFormat})`, severity: 'success' });
      }
    } catch {
      setSnackbar({ message: 'Failed to generate configuration', severity: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  const handleTestParse = async () => {
    if (!file) {
      setSnackbar({ message: 'Please upload a file first', severity: 'warning' });
      return;
    }
    setParsing(true);
    try {
      const result = await parseFile(file, configuration);
      setParseResult(result);
      setSnackbar({ message: `Parsed ${result.totalRows} rows`, severity: 'success' });
    } catch {
      setSnackbar({ message: 'Failed to parse file', severity: 'error' });
    } finally {
      setParsing(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 24px)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Back
        </Button>
        <Typography variant="h5" sx={{ flex: 1 }}>
          {isNew ? 'New Template' : `Edit Template: ${name}`}
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </Box>

      {/* Split layout */}
      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {/* Left Panel — Form */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
          <TextField
            label="Template Name"
            value={name}
            onChange={(e) => { setName(e.target.value); setNameError(null); }}
            error={!!nameError}
            helperText={nameError}
            fullWidth
            sx={{ mb: 2 }}
          />
          <ConfigurationForm formData={configuration} onChange={handleFormChange} />
        </Grid>

        {/* Right Panel — Tools */}
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, maxHeight: 'calc(100vh - 100px)' }}>
          {/* JSON Editor */}
          <Box sx={{ flex: '0 0 40%', minHeight: 200, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>JSON Configuration</Typography>
            <Box sx={{ height: 'calc(100% - 24px)' }}>
              <JsonConfigEditor configuration={configuration} onApply={handleJsonApply} />
            </Box>
          </Box>

          {/* File uploader */}
          <Box sx={{ mb: 2 }}>
            <FileUploader file={file} onFileChange={setFile} />
          </Box>

          {/* Action buttons */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AutoFixHighIcon />}
              onClick={handleGenerate}
              disabled={generating || !file}
            >
              {generating ? 'Generating...' : 'Generate with AI'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<PlayArrowIcon />}
              onClick={handleTestParse}
              disabled={parsing || !file}
            >
              {parsing ? 'Parsing...' : 'Test Parse'}
            </Button>
          </Stack>

          {/* Parse results */}
          <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <ParseResultsViewer result={parseResult} />
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={!!snackbar}
        autoHideDuration={6000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {snackbar ? <Alert severity={snackbar.severity} onClose={() => setSnackbar(null)}>{snackbar.message}</Alert> : undefined}
      </Snackbar>
    </Box>
  );
}
