import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Button,
  Divider,
} from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddIcon from '@mui/icons-material/Add';
import InboxIcon from '@mui/icons-material/Inbox';
import ChatIcon from '@mui/icons-material/Chat';
import DraftsIcon from '@mui/icons-material/Drafts';
import { useAuth } from '../../contexts/AuthContext';
import { useRequest } from '../../contexts/RequestContext';
import logo from '../../assests/img/logo.png';

interface ChatSidebarProps {
  width: number;
  onWidthChange: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

// Basic navigation items - Remove Inbox and Marketplace since they're moving to system menu
const basicMenuItems: any[] = [];

// Chat history items (for authenticated users)
const getChatHistoryItems = (isAuthenticated: boolean) => {
  if (!isAuthenticated) return [];
  
  return [
    { to: "/?chat=1", text: "E-commerce Help", icon: <ChatIcon /> },
    { to: "/?chat=2", text: "Restaurant Operations", icon: <ChatIcon /> },
    { to: "/?chat=3", text: "Tech Startup", icon: <ChatIcon /> },
    { to: "/?chat=4", text: "Medical Practice", icon: <ChatIcon /> },
  ];
};

// System navigation items - Add Inbox and Marketplace at the top
const systemMenuItems = [
  { to: "/inbox", text: "Inbox", icon: <InboxIcon /> },
  { to: "/drafts", text: "Drafts&Products", icon: <DraftsIcon /> },
  { to: "/chat-salesman", text: "Chat with Salesman", icon: <SupportAgentIcon /> },
  { to: "/billing", text: "Billing & Invoices", icon: <ReceiptIcon /> },
  { to: "/support", text: "Support", icon: <SupportAgentIcon /> },
];

export default function ChatSidebar({ 
  width, 
  onWidthChange, 
  minWidth = 72, 
  maxWidth = 400 
}: ChatSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { requestHistory, getInboxUnreadCount } = useRequest();
  const [isResizing, setIsResizing] = useState(false);

  // Determine if sidebar is in collapsed state based on width
  const isCollapsed = width <= 120;

  // Handle mouse events for resizing
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Starting resize...'); // Debug log
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    e.preventDefault();
    const newWidth = e.clientX;
    console.log('Resizing to width:', newWidth); // Debug log
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      onWidthChange(newWidth);
    }
  }, [isResizing, minWidth, maxWidth, onWidthChange]);

  const handleMouseUp = useCallback(() => {
    console.log('Ending resize...'); // Debug log
    setIsResizing(false);
  }, []);

  // Add and remove event listeners
  useEffect(() => {
    if (isResizing) {
      console.log('Adding resize event listeners'); // Debug log
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      console.log('Removing resize event listeners'); // Debug log
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleToggle = () => {
    const newWidth = isCollapsed ? 240 : 72;
    onWidthChange(newWidth);
  };

  const handleNewChat = () => {
    // Navigate to new chat
    navigate('/');
  };

  // Get chat history items
  const chatHistoryItems = getChatHistoryItems(isAuthenticated);

  // Always show sidebar for all authenticated users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: width,
          flexShrink: 0,
          transition: isResizing ? 'none' : 'width 0.2s ease',
          '& .MuiDrawer-paper': {
            width: width,
            boxSizing: 'border-box',
            backgroundColor: '#f5f5f5',
            transition: isResizing ? 'none' : 'width 0.2s ease',
            overflowX: 'hidden',
            borderRight: 'none',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', pt: 0, height: '100%' }}>
          {/* Top Bar with Logo and Toggle Button */}
          <Box sx={{ 
            px: 4, // Standard horizontal padding  
            py: 1,
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            minHeight: 20,
          }}>
            {/* Logo - only show when expanded */}
            {!isCollapsed && (
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.8,
                  },
                  transition: 'opacity 0.2s ease',
                }}
                onClick={() => navigate('/')}
              >
                <Box 
                  component="img" 
                  src={logo} 
                  alt="ReverSale" 
                  sx={{ 
                    height: 40,
                    width: 'auto',
                    maxWidth: 140,
                    objectFit: 'contain',
                  }} 
                />
              </Box>
            )}

            {/* Toggle Button */}
            <Tooltip 
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} 
              placement="right"
              arrow
            >
              <IconButton 
                onClick={handleToggle}
                sx={{ 
                  color: '#7442BF',
                  '&:hover': {
                    backgroundColor: 'rgba(116, 66, 191, 0.1)',
                  }
                }}
              >
                {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Tooltip>
          </Box>

          {/* New Chat Button */}
          {isAuthenticated && (
            <Box sx={{ px: 2, py: 2 }}> {/* Match the same horizontal padding */}
              <Tooltip 
                title={isCollapsed ? "New Chat" : ""} 
                placement="right"
                arrow
              >
                <Button
                  variant="contained"
                  onClick={handleNewChat}
                  startIcon={!isCollapsed ? <AddIcon /> : null}
                  sx={{
                    width: '100%', // Use full width within the container
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    bgcolor: '#7442BF',
                    color: 'white',
                    borderRadius: 2,
                    py: 1.5,
                    px: isCollapsed ? 1 : 2,
                    minWidth: isCollapsed ? 48 : 'auto',
                    '&:hover': {
                      bgcolor: '#5e3399',
                    },
                    boxShadow: '0 2px 8px rgba(116, 66, 191, 0.3)',
                  }}
                >
                  {isCollapsed ? <AddIcon /> : "New Chat"}
                </Button>
              </Tooltip>
            </Box>
          )}

          {/* Basic Navigation */}
          {isAuthenticated && (
            <List sx={{ pt: 1, px: 2 }}>
              {basicMenuItems.map((item) => {
                const count = item.to === "/inbox" ? getInboxUnreadCount() : 0;
                const isSelected = location.pathname === item.to || location.pathname.startsWith(item.to);
                
                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip 
                      title={isCollapsed ? `${item.text}${count > 0 ? ` (${count})` : ''}` : ''} 
                      placement="right"
                      arrow
                    >
                      <ListItemButton
                        component={Link}
                        to={item.to}
                        selected={isSelected}
                        sx={{
                          minHeight: 48,
                          justifyContent: isCollapsed ? 'center' : 'initial',
                          px: 2,
                          borderRadius: 2,
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
                            mr: isCollapsed ? 0 : 3,
                            justifyContent: 'center',
                            color: isSelected ? '#7442BF' : 'inherit'
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography sx={{ 
                                  color: isSelected ? '#7442BF' : 'inherit',
                                  fontWeight: isSelected ? 600 : 400
                                }}>
                                  {item.text}
                                </Typography>
                                {count > 0 && (
                                  <Typography variant="caption" sx={{ 
                                    bgcolor: '#7442BF',
                                    color: 'white',
                                    borderRadius: '12px',
                                    px: 1,
                                    py: 0.25,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    minWidth: '20px',
                                    textAlign: 'center'
                                  }}>
                                    {count}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                );
              })}
            </List>
          )}

          {/* Chat History */}
          {isAuthenticated && chatHistoryItems.length > 0 && (
            <>
              {!isCollapsed && (
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    CHAT HISTORY
                  </Typography>
                </Box>
              )}
              <List sx={{ pt: 0, px: 2 }}>
                {chatHistoryItems.map((item) => {
                  const isSelected = location.pathname + location.search === item.to;
                  
                  return (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                      <Tooltip 
                        title={isCollapsed ? item.text : ''} 
                        placement="right"
                        arrow
                      >
                        <ListItemButton
                          component={Link}
                          to={item.to}
                          selected={isSelected}
                          sx={{
                            minHeight: 48,
                            justifyContent: isCollapsed ? 'center' : 'initial',
                            px: 2,
                            borderRadius: 2,
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
                              mr: isCollapsed ? 0 : 3,
                              justifyContent: 'center',
                              color: isSelected ? '#7442BF' : 'inherit'
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          {!isCollapsed && (
                            <ListItemText 
                              primary={
                                <Typography sx={{ 
                                  color: isSelected ? '#7442BF' : 'inherit',
                                  fontWeight: isSelected ? 600 : 400
                                }}>
                                  {item.text}
                                </Typography>
                              }
                            />
                          )}
                        </ListItemButton>
                      </Tooltip>
                    </ListItem>
                  );
                })}
              </List>
            </>
          )}

          <Divider sx={{ mx: 2, my: 3 }} />

          {/* System Navigation Menu */}
          {isAuthenticated && (
            <List sx={{ pt: 1, px: 2 }}>
              {systemMenuItems.map((item) => {
                const count = item.to === "/inbox" ? getInboxUnreadCount() : 0;
                const isSelected = location.pathname === item.to;
                
                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                    <Tooltip 
                      title={isCollapsed ? `${item.text}${count > 0 ? ` (${count})` : ''}` : ''} 
                      placement="right"
                      arrow
                    >
                      <ListItemButton
                        component={Link}
                        to={item.to}
                        selected={isSelected}
                        sx={{
                          minHeight: 48,
                          justifyContent: isCollapsed ? 'center' : 'initial',
                          px: 2,
                          borderRadius: 2,
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
                            mr: isCollapsed ? 0 : 3,
                            justifyContent: 'center',
                            color: isSelected ? '#7442BF' : 'inherit'
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography sx={{ 
                                  color: isSelected ? '#7442BF' : 'inherit',
                                  fontWeight: isSelected ? 600 : 400
                                }}>
                                  {item.text}
                                </Typography>
                                {count > 0 && (
                                  <Typography variant="caption" sx={{ 
                                    bgcolor: '#7442BF',
                                    color: 'white',
                                    borderRadius: '12px',
                                    px: 1,
                                    py: 0.25,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    minWidth: '20px',
                                    textAlign: 'center'
                                  }}>
                                    {count}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                );
              })}
            </List>
          )}

          {/* Footer */}
          {!isCollapsed && (
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
                © 2024 ReverSale
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Resize Handle */}
      <Box
        onMouseDown={handleMouseDown}
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 8,
          cursor: 'col-resize',
          backgroundColor: 'transparent',
          borderRight: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            backgroundColor: 'rgba(116, 66, 191, 0.1)',
            borderRight: '3px solid #7442BF',
            '& .resize-indicator': {
              opacity: 1,
              backgroundColor: '#7442BF',
            }
          },
          '&:active': {
            backgroundColor: 'rgba(116, 66, 191, 0.2)',
            borderRight: '3px solid #7442BF',
            '& .resize-indicator': {
              opacity: 1,
              backgroundColor: '#7442BF',
            }
          },
          zIndex: 1001,
          transition: 'all 0.2s ease',
        }}
      >
        {/* Visual grip indicator */}
        <Box
          className="resize-indicator"
          sx={{
            width: 4,
            height: 60,
            backgroundColor: '#d0d0d0',
            borderRadius: 2,
            opacity: 0.3,
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '8px 0',
          }}
        >
          {/* Grip dots */}
          {[...Array(6)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 2,
                height: 2,
                backgroundColor: 'currentColor',
                borderRadius: '50%',
                opacity: 0.6,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
} 