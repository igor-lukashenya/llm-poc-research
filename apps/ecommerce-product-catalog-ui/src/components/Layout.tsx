import { Box } from "@mui/material";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
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
      <Box
        component="main"
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
          paddingLeft: { xs: 0, sm: "var(--sidebar-width, 220px)" },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
