import React, { useState } from "react";
import { ReactNode } from "react";
import { Box, Container, IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle, Logout } from "@mui/icons-material";
import ChatSidebar from "./ChatSidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from '../../assests/img/logo.png';

interface ChatLayoutProps {
  children: ReactNode;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <ChatSidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      
      {/* Dynamic Logo positioned to the right of sidebar */}
      <Box
        sx={{
          position: 'fixed',
          top: 4,
          left: sidebarCollapsed ? 88 : 296, // 72px (collapsed width) + 16px margin OR 280px (expanded width) + 16px margin
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'left 0.3s ease', // Smooth transition when sidebar toggles
        }}
        onClick={() => navigate('/')}
      >
        <Box 
          component="img" 
          src={logo} 
          alt="ReverSale" 
          sx={{ 
            height: 50, // Fixed height instead of width to maintain aspect ratio
            width: 'auto', // Let width adjust automatically
            maxWidth: 200, // Prevent it from getting too wide
            objectFit: 'contain', // Ensure the entire logo is visible
          }} 
        />
      </Box>

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

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          minWidth: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ChatLayout; 