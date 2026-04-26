import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import TemplatesListPage from './pages/TemplatesListPage';
import TemplateEditorPage from './pages/TemplateEditorPage';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TemplatesListPage />} />
          <Route path="/templates/new" element={<TemplateEditorPage />} />
          <Route path="/templates/:id" element={<TemplateEditorPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
