import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Typography,
  ListItemButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import MicIcon from '@mui/icons-material/Mic';

const menuItems = [
  { to: "/dashboard", text: "Dashboard", icon: <DashboardIcon /> },
  { to: "/business-insights", text: "Business Insights", icon: <BusinessIcon /> },
  { to: "/personalized-products", text: "Solutions", icon: <LightbulbIcon /> },
  { to: "/voice-input", text: "Voice Input", icon: <MicIcon /> },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.to}
                selected={location.pathname === item.to}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(116, 66, 191, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(116, 66, 191, 0.2)',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.to ? '#7442BF' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{ color: location.pathname === item.to ? '#7442BF' : 'inherit' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
