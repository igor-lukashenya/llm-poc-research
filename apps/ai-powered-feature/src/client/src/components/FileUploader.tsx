import { useState } from 'react';
import { Card, CardContent, Typography, Button, Tabs, Tab, Box, TextField, Chip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface Props {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function FileUploader({ file, onFileChange }: Props) {
  const [tab, setTab] = useState(0);
  const [pasteText, setPasteText] = useState('');

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    onFileChange(f);
  };

  const handlePasteApply = () => {
    if (!pasteText.trim()) return;
    const f = new File([pasteText], 'pasted.csv', { type: 'text/csv' });
    onFileChange(f);
  };

  return (
    <Card variant="outlined">
      <CardContent sx={{ pb: '12px !important' }}>
        <Typography variant="subtitle2" gutterBottom>
          File Upload / Paste
        </Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 1, minHeight: 36 }}>
          <Tab label="Upload File" sx={{ minHeight: 36, py: 0 }} />
          <Tab label="Paste Content" sx={{ minHeight: 36, py: 0 }} />
        </Tabs>

        {tab === 0 && (
          <Box>
            <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} size="small">
              Choose File
              <input type="file" hidden accept=".csv,.txt,.tsv" onChange={handleFileInput} />
            </Button>
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <TextField
              multiline
              rows={3}
              fullWidth
              size="small"
              placeholder="Paste CSV content here..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
            />
            <Button variant="outlined" size="small" onClick={handlePasteApply} sx={{ mt: 1 }}>
              Use Pasted Content
            </Button>
          </Box>
        )}

        {file && (
          <Chip
            label={`${file.name} (${(file.size / 1024).toFixed(1)} KB)`}
            onDelete={() => onFileChange(null)}
            sx={{ mt: 1 }}
            size="small"
          />
        )}
      </CardContent>
    </Card>
  );
}
