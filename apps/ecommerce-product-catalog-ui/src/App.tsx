import { BrowserRouter as Router, Routes, Route } from "react-router";
import { ThemeProvider } from "./hooks/useThemeMode";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
