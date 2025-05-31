import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ContactMail as LeadsIcon,
  Handshake as DealsIcon,
  Inbox as InboxIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Build as ToolsIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assests/img/logo.png';

const drawerWidth = 240;
const HEADER_HEIGHT = 64; // Standard AppBar height

// Reorganized sidebar items with new order and grouping
const sidebarGroups = [
  // Group 1: Dashboard, Inbox & Chat
  {
    items: [
      { path: '/sales/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
      { path: '/sales/inbox', label: 'Inbox', icon: <InboxIcon /> },
      { path: '/sales/leads/deals-chat', label: 'Live Chat', icon: <ChatIcon /> },
    ]
  },
  // Group 2: Leads & Deals
  {
    items: [
      { path: '/sales/leads', label: 'Leads', icon: <LeadsIcon /> },
      { path: '/sales/deals', label: 'Deals', icon: <DealsIcon /> },
    ]
  },
  // Group 3: Tools (placeholder section)
  {
    items: [
      { path: '/sales/tools', label: 'Tools', icon: <ToolsIcon /> },
    ]
  }
];

interface SalesLayoutProps {
  children: React.ReactNode;
}

const SalesLayout: React.FC<SalesLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    navigate('/sales/settings');
    handleMenuClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleToolsClick = () => {
    // No longer needed - Tools is now a real route
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        {/* Logo Section */}
        <Box sx={{ 
          height: HEADER_HEIGHT, // Match AppBar height exactly
          px: 2, // Reduced horizontal padding
          py: 0, // Minimal vertical padding
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box 
            component="img" 
            src={logo} 
            alt="ReverSale" 
            sx={{ 
              height: 60, // Slightly smaller logo to fit better
              width: 'auto',
              maxWidth: 140, // Reduced max width
              objectFit: 'contain',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/sales/dashboard')}
          />
        </Box>

        {/* Navigation Menu with Groups */}
        <Box sx={{ px: 2, pt: 1, flex: 1 }}>
          {sidebarGroups.map((group, groupIndex) => (
            <Box key={groupIndex}>
              <List sx={{ py: 0 }}>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                      <ListItemButton
                        component={Link}
                        to={item.path}
                        selected={isActive}
                        sx={{
                          borderRadius: 2,
                          '&.Mui-selected': {
                            backgroundColor: '#7442BF',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#5e3399',
                            },
                          },
                          '&:hover': {
                            backgroundColor: isActive ? '#5e3399' : 'rgba(116, 66, 191, 0.08)',
                          },
                        }}
                      >
                        <ListItemIcon 
                          sx={{ 
                            color: isActive ? 'white' : '#7442BF',
                            minWidth: 40 
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.label}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontWeight: isActive ? 600 : 500,
                            },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
              
              {/* Add divider between groups (except after the last group) */}
              {groupIndex < sidebarGroups.length - 1 && (
                <Divider 
                  sx={{ 
                    my: 2,
                    mx: 1,
                    borderColor: '#d1d5db',
                    opacity: 0.6,
                  }} 
                />
              )}
            </Box>
          ))}
        </Box>

        {/* Footer */}
        <Box sx={{ 
          mt: 'auto', 
          p: 2,
          borderTop: '1px solid #e0e0e0'
        }}>
          <Typography variant="caption" sx={{ 
            color: '#6c757d',
            display: 'block',
            textAlign: 'center'
          }}>
            © 2024 ReverSale Sales
          </Typography>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Top AppBar */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            backgroundColor: 'white',
            borderBottom: '1px solid #e0e0e0',
            color: '#333',
            height: HEADER_HEIGHT, // Explicit height
          }}
        >
          <Toolbar sx={{ 
            justifyContent: 'flex-end',
            minHeight: `${HEADER_HEIGHT}px !important`, // Force consistent height
            height: HEADER_HEIGHT,
          }}>
            {/* Avatar with Dropdown */}
            <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40,
                  backgroundColor: '#7442BF',
                  fontSize: '1rem',
                  fontWeight: 600
                }}
              >
                {user?.name?.charAt(0) || 'S'}
              </Avatar>
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 180,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  borderRadius: 2,
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user?.name || 'Sales Representative'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              
              <MenuItem onClick={handleSettings} sx={{ py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default SalesLayout; 