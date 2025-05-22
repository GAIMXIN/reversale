import React from "react";
import { NavLink } from "react-router-dom";
import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  Drawer,
  ListItemButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation } from "wouter";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const Sidebar = () => {
  const [location] = useLocation();

  const doctorMenu = [
    { to: "/doctor-dashboard", text: "Dashboard", icon: <DashboardIcon /> },
    { to: "/doctor-addpatient", text: "Add Patient", icon: <PersonAddAlt1Icon /> },
    { to: "/provider/user_setting", text: "User Settings", icon: <SettingsIcon /> },
  ];

  const patientMenu = [
    { to: "/patient-dashboard", text: "Dashboard", icon: <DashboardIcon /> },
  ];

  const role = localStorage.getItem("role");
  const menuItems = role === "doctor" ? doctorMenu : patientMenu;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 100,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          mt: 9,
        },
      }}
    >
      <Box
        className="left_sidemenu"
        sx={{ width: 250, bgcolor: "background.paper", height: "100vh", padding: 2 }}
      >
        <List component="nav" className="sidemenu_list">
          {menuItems.map(({ to, text, icon }) => {
            const isActive = location === to;
            return (
              <ListItemButton
                key={to}
                component={NavLink}
                to={to}
                sx={{
                  bgcolor: isActive ? "blue" : "transparent",
                  color: isActive ? "white" : "black",
                  borderRadius: 2,
                  "&:hover": { bgcolor: isActive ? "blue" : "#f0f0f0" },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? "white" : "inherit" }}>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
