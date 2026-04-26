import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import CategoryIcon from "@mui/icons-material/Category";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "../hooks/useThemeMode";

const EXPANDED_WIDTH = 220;
const COLLAPSED_WIDTH = 64;

export default function Sidebar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { mode, toggleTheme } = useThemeMode();

  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isMobile) {
      document.documentElement.style.setProperty("--sidebar-width", "0px");
    } else {
      const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;
      document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
    }
  }, [collapsed, isMobile]);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const items = [
    { icon: <HomeIcon />, text: "Home", onClick: () => handleNavigate("/") },
    { icon: <StorefrontIcon />, text: "Catalog", onClick: () => handleNavigate("/catalog") },
    { divider: true },
    { icon: <CategoryIcon />, text: "Categories", onClick: () => handleNavigate("/catalog?filter=category") },
    { icon: <SearchIcon />, text: "Search", onClick: () => handleNavigate("/catalog?focus=search") },
    { icon: <FavoriteIcon />, text: "Favorites", onClick: () => handleNavigate("/catalog?filter=favorites") },
    { icon: <WhatshotIcon />, text: "Popular", onClick: () => handleNavigate("/catalog?sort=rating-desc") },
    { icon: <LocalOfferIcon />, text: "Sale", onClick: () => handleNavigate("/catalog?sort=price-asc") },
    { divider: true },
    {
      icon: mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />,
      text: mode === "dark" ? "Light Mode" : "Dark Mode",
      onClick: toggleTheme,
    },
  ];

  const sidebarContent = (showCollapsed: boolean) => (
    <>
      <List>
        {items.map((item, idx) =>
          item.divider ? (
            <Divider key={idx} />
          ) : (
            <ListItem disablePadding key={item.text}>
              <ListItemButton
                onClick={item.onClick}
                sx={{ justifyContent: showCollapsed ? "center" : "flex-start" }}
              >
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  {item.icon}
                </ListItemIcon>
                {!showCollapsed && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      {!isMobile && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: collapsed ? "center" : "flex-end",
            p: 1,
          }}
        >
          <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <IconButton onClick={() => setCollapsed((c) => !c)} size="small">
              {collapsed ? <ArrowRightIcon /> : <ArrowLeftIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </>
  );

  // Mobile: temporary drawer
  if (isMobile) {
    return (
      <>
        <IconButton
          aria-label="open menu"
          onClick={() => setMobileOpen(true)}
          sx={{
            position: "fixed",
            top: 8,
            left: 8,
            zIndex: 11,
            backgroundColor: "background.paper",
            boxShadow: 1,
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { width: EXPANDED_WIDTH, boxSizing: "border-box" },
          }}
        >
          {sidebarContent(false)}
        </Drawer>
      </>
    );
  }

  // Desktop: fixed sidebar
  return (
    <Box
      sx={{
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        minHeight: "100vh",
        backgroundColor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10,
        transition: "width 0.2s",
      }}
    >
      {sidebarContent(collapsed)}
    </Box>
  );
}
