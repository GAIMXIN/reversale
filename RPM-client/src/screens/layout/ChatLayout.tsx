import React, { useState } from "react";
import { ReactNode } from "react";
import { Box, Container, IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle, Logout } from "@mui/icons-material";
import ChatSidebar from "./ChatSidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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