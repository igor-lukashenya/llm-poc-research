import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Button, Alert } from '@mui/material';
import type { CsvFileParsingConfiguration } from '../types';

interface Props {
  configuration: CsvFileParsingConfiguration;
  onApply: (data: CsvFileParsingConfiguration) => void;
}

export default function JsonConfigEditor({ configuration, onApply }: Props) {
  const [jsonText, setJsonText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    setJsonText(JSON.stringify(configuration, null, 2));
    setParseError(null);
  }, [configuration]);

  const handleApply = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText) as CsvFileParsingConfiguration;
      setParseError(null);
      onApply(parsed);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  }, [jsonText, onApply]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, minHeight: 0, border: '1px solid #ddd', borderRadius: 1 }}>
        <Editor
          height="100%"
          language="json"
          value={jsonText}
          onChange={(v) => setJsonText(v ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
      </Box>
      {parseError && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {parseError}
        </Alert>
      )}
      <Button variant="contained" size="small" onClick={handleApply} sx={{ mt: 1, alignSelf: 'flex-end' }}>
        Apply JSON
      </Button>
    </Box>
  );
}
