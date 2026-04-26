import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      defaultProps: { size: 'medium' },
    },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
    },
  },
});

export default theme;
