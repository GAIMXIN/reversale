import React, { useState } from "react";
import { ReactNode } from "react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle, Logout } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface SalesmanLayoutProps {
  children: ReactNode;
}

const SalesmanLayout: React.FC<SalesmanLayoutProps> = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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

  const handleBackToDashboard = () => {
    navigate('/salesman-dashboard');
    handleClose();
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* User Menu Button */}
      <Box sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000
      }}>
        <IconButton
          onClick={handleMenu}
          sx={{
            bgcolor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            '&:hover': {
              bgcolor: 'rgba(116, 66, 191, 0.1)',
            }
          }}
        >
          <AccountCircle sx={{ color: '#7442BF' }} />
        </IconButton>
      </Box>

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
        <MenuItem onClick={handleBackToDashboard}>
          Dashboard
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>

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

export default SalesmanLayout; 