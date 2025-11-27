import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import { Box } from "@mui/material";


import Home from "./Home";
import Catalog from "./Catalog";
import Sidebar from "./Sidebar";

const theme = createTheme();

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: "flex",
            width: "100vw",
            height: "100vh",
            minHeight: 0,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <Sidebar />
          {/* Main content should adapt to sidebar width. Use padding-left instead of margin-left, and make it responsive to sidebar state. */}
          <Box
            id="main-content"
            sx={{
              flex: 1,
              width: "100%",
              height: "100vh",
              minHeight: 0,
              minWidth: 0,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "padding-left 0.2s",
              // Use a CSS variable for sidebar width, default to 220px
              paddingLeft: { sm: 'var(--sidebar-width, 220px)' },
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}
