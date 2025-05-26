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
  IconButton,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { to: "/dashboard", text: "Dashboard", icon: <DashboardIcon /> },
  { to: "/business-insights", text: "Business Insights", icon: <BusinessIcon /> },
  { to: "/personalized-products", text: "Solutions", icon: <LightbulbIcon /> },
  { to: "/contact-salesman", text: "Contact Salesman", icon: <SupportAgentIcon /> },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 72 : 240,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: collapsed ? 72 : 240,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', mt: 8 }}>
        {/* Toggle Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: collapsed ? 'center' : 'flex-end',
          p: 1,
          borderBottom: '1px solid #e0e0e0'
        }}>
          <IconButton 
            onClick={onToggle}
            sx={{ 
              color: '#7442BF',
              '&:hover': {
                backgroundColor: 'rgba(116, 66, 191, 0.1)',
              }
            }}
          >
            {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Box>

        {/* Brand/Logo Area */}
        {!collapsed && (
          <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 50%, #E91E63 100%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ReverSSale
            </Typography>
          </Box>
        )}

        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <Tooltip 
                title={collapsed ? item.text : ''} 
                placement="right"
                arrow
              >
                <ListItemButton
                  component={Link}
                  to={item.to}
                  selected={location.pathname === item.to}
                  sx={{
                    minHeight: 48,
                    justifyContent: collapsed ? 'center' : 'initial',
                    px: 2.5,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(116, 66, 191, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(116, 66, 191, 0.2)',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(116, 66, 191, 0.05)',
                    },
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      minWidth: 0,
                      mr: collapsed ? 0 : 3,
                      justifyContent: 'center',
                      color: location.pathname === item.to ? '#7442BF' : 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText 
                      primary={item.text}
                      sx={{ 
                        opacity: collapsed ? 0 : 1,
                        color: location.pathname === item.to ? '#7442BF' : 'inherit'
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        {/* Footer */}
        {!collapsed && (
          <Box sx={{ 
            position: 'absolute', 
            bottom: 16, 
            left: 16, 
            right: 16,
            textAlign: 'center'
          }}>
            <Typography variant="caption" color="text.secondary">
              © 2024 ReverSSale
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
