import React, { useState } from 'react';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle, Logout, Person } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ChatSidebar from '../layout/ChatSidebar';

interface PostDetailLayoutProps {
  children: React.ReactNode;
  rightSidebar: React.ReactNode;
}

const SIDEBAR_WIDTH_KEY = 'reversal-sidebar-width';
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 72;
const MAX_WIDTH = 400;
const RIGHT_SIDEBAR_WIDTH = 320;

const PostDetailLayout: React.FC<PostDetailLayoutProps> = ({ children, rightSidebar }) => {
  // Load sidebar width from localStorage or use default
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return savedWidth ? parseInt(savedWidth, 10) : DEFAULT_WIDTH;
  });
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSidebarWidthChange = (newWidth: number) => {
    setSidebarWidth(newWidth);
    localStorage.setItem(SIDEBAR_WIDTH_KEY, newWidth.toString());
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
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: `${sidebarWidth}px 1fr ${RIGHT_SIDEBAR_WIDTH}px`,
      minHeight: '100vh',
      bgcolor: '#fafafa',
      transition: 'grid-template-columns 0.2s ease',
    }}>
      {/* Left Sidebar */}
      <Box sx={{ position: 'relative' }}>
        <ChatSidebar 
          width={sidebarWidth}
          onWidthChange={handleSidebarWidthChange}
          minWidth={MIN_WIDTH}
          maxWidth={MAX_WIDTH}
        />
      </Box>

      {/* Main Content Area - Centered */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        position: 'relative',
        minWidth: 0, // Prevent overflow
      }}>
        {/* Centered Content Container */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Box sx={{
            width: '100%',
            maxWidth: '800px', // Optimal reading width
            px: { xs: 2, sm: 4 },
            py: 4,
          }}>
            {children}
          </Box>
        </Box>
      </Box>

      {/* Right Sidebar */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f5f5f5', // Match left sidebar background
        borderLeft: '1px solid #e0e0e0',
        position: 'relative',
      }}>
        {/* User Avatar in Right Sidebar Header */}
        {isAuthenticated && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            p: 2,
            borderBottom: '1px solid #e0e0e0'
          }}>
            <IconButton
              onClick={handleMenu}
              sx={{
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  bgcolor: 'rgba(116, 66, 191, 0.1)',
                }
              }}
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
          </Box>
        )}

        {/* Right Sidebar Content */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          p: 3,
        }}>
          {rightSidebar}
        </Box>
      </Box>
    </Box>
  );
};

export default PostDetailLayout; 