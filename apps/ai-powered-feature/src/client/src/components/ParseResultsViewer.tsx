import { Box, Typography } from '@mui/material';
import type { ParseResponse } from '../types';

interface Props {
  result: ParseResponse | null;
}

export default function ParseResultsViewer({ result }: Props) {
  if (!result) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom>
        Parse Results — {result.totalRows} row(s) from "{result.fileName}"
      </Typography>
      <Box
        component="pre"
        sx={{
          maxHeight: 400,
          overflow: 'auto',
          bgcolor: '#f5f5f5',
          p: 2,
          borderRadius: 1,
          fontSize: 12,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        {JSON.stringify(result.rows, null, 2)}
      </Box>
    </Box>
  );
}
