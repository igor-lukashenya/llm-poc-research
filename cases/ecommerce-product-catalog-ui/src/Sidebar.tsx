import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import HomeIcon from "@mui/icons-material/Home";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import CategoryIcon from "@mui/icons-material/Category";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

export default function Sidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  // Set CSS variable for sidebar width on collapse/expand
  useEffect(() => {
    const sidebarWidth = collapsed ? 64 : 220;
    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${sidebarWidth}px`
    );
  }, [collapsed]);
  // List of sidebar items
  const items = [
    { icon: <HomeIcon />, text: "Home", onClick: () => navigate("/") },
    {
      icon: <StorefrontIcon />,
      text: "Catalog",
      onClick: () => navigate("/catalog"),
    },
    { divider: true },
    { icon: <CategoryIcon />, text: "Categories" },
    { icon: <SearchIcon />, text: "Search" },
    { icon: <FavoriteIcon />, text: "Favorites" },
    { icon: <WhatshotIcon />, text: "Popular" },
    { icon: <LocalOfferIcon />, text: "Sale" },
  ];

  return (
    <Box
      sx={{
        width: collapsed ? 64 : 220,
        minHeight: "100vh",
        backgroundColor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10,
        display: { xs: "none", sm: "block" },
        transition: "width 0.2s",
      }}
    >
      <List>
        {items.map((item, idx) =>
          item.divider ? (
            <Divider key={idx} />
          ) : (
            <ListItem disablePadding key={item.text}>
              <ListItemButton
                onClick={item.onClick}
                sx={{ justifyContent: collapsed ? "center" : "flex-start" }}
              >
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.text} />}
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
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
    </Box>
  );
}
