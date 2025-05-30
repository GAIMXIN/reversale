import React, { useState, useEffect } from "react";
import { ReactNode } from "react";
import { Box, Container, IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle, Logout, Person } from "@mui/icons-material";
import ChatSidebar from "./ChatSidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ChatLayoutProps {
  children: ReactNode;
}

const SIDEBAR_WIDTH_KEY = 'reversal-sidebar-width';
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 72;
const MAX_WIDTH = 400;

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  // Load sidebar width from localStorage or use default
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return savedWidth ? parseInt(savedWidth, 10) : DEFAULT_WIDTH;
  });
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Save sidebar width to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  const handleSidebarWidthChange = (newWidth: number) => {
    setSidebarWidth(newWidth);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileSettings = () => {
    navigate('/dashboard');
    handleClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <ChatSidebar 
        width={sidebarWidth}
        onWidthChange={handleSidebarWidthChange}
        minWidth={MIN_WIDTH}
        maxWidth={MAX_WIDTH}
      />
      
      {/* User Button - Login or Logout */}
      {isAuthenticated ? (
        <>
          <IconButton
            sx={{
              position: 'fixed',
              top: 16,
              right: 16,
              zIndex: 1000,
              bgcolor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              '&:hover': {
                bgcolor: 'rgba(116, 66, 191, 0.1)',
              }
            }}
            onClick={handleMenu}
          >
            <AccountCircle sx={{ color: '#7442BF' }} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleProfileSettings}>
              <Person sx={{ mr: 1 }} />
              Profile / Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </>
      ) : (
        <IconButton
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 1000,
            bgcolor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            color: '#7442BF',
            '&:hover': {
              bgcolor: 'rgba(116, 66, 191, 0.1)',
            }
          }}
          onClick={() => navigate('/login')}
        >
          <AccountCircle />
        </IconButton>
      )}

      {/* 
        MAIN CONTENT AREA - FLEX CENTERED:
        
        This structure ensures content stays centered regardless of sidebar width:
        1. Main area takes all remaining space (flex: 1)
        2. Uses flexbox to center content horizontally (justifyContent: 'center')
        3. Inner wrapper constrains max-width and adds padding
        4. Content stays centered when sidebar toggles between collapsed/expanded
      */}
      <Box 
        component="main" 
        sx={{ 
          flex: 1, // Take all remaining space after sidebar
          display: 'flex', // Use flexbox for centering
          justifyContent: 'center', // Center content horizontally
          overflow: 'auto',
          minWidth: 0, // Prevent flex item from overflowing
          position: 'relative',
        }}
      >
        {/* Centering and Max-Width Wrapper */}
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: '1040px' }, // Responsive max-width
            px: { xs: 2, sm: 3 }, // Responsive horizontal padding (theme.spacing)
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default ChatLayout; 