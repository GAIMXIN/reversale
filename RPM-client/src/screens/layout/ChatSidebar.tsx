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
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import { useAuth } from '../../contexts/AuthContext';

interface ChatSidebarProps {
  width: number;
  onWidthChange: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const menuItems = [
  { to: "/dashboard", text: "Dashboard", icon: <DashboardIcon /> },
  { to: "/markets", text: "Markets", icon: <StorefrontIcon /> },
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
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [isResizing, setIsResizing] = useState(false);

  // Determine if sidebar is in collapsed state based on width
  const isCollapsed = width <= 120;

  // 模拟聊天历史数据
  useEffect(() => {
    const mockChatHistory: ChatHistory[] = [
      {
        id: '1',
        title: 'E-commerce Strategy',
        lastMessage: 'Based on your e-commerce business...',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30分钟前
      },
      {
        id: '2',
        title: 'Restaurant Operations',
        lastMessage: 'I see you\'re in the food service...',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2小时前
      },
      {
        id: '3',
        title: 'Tech Startup Advice',
        lastMessage: 'For your tech business...',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1天前
      },
    ];
    setChatHistory(mockChatHistory);
  }, []);

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
    const newWidth = isCollapsed ? 280 : 72;
    onWidthChange(newWidth);
  };

  const handleNewChat = () => {
    // 清除当前聊天内容，开始新对话
    navigate('/');
    // 这里可以添加清除聊天状态的逻辑
  };

  const handleChatSelect = (chatId: string) => {
    // 加载选中的聊天记录
    navigate(`/?chat=${chatId}`);
    // 这里可以添加加载特定聊天记录的逻辑
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  // 如果是salesman用户，不显示侧边栏
  if (user?.userType === 'salesman') {
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
            borderRight: 'none', // Remove default border
          },
        }}
      >
        <Box sx={{ overflow: 'auto', pt: 0, height: '100%' }}>
          {/* Toggle Button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: isCollapsed ? 'center' : 'flex-end',
            p: 1,
            borderBottom: '1px solid #e0e0e0'
          }}>
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
          </Box>

          {/* New Request Button */}
          {isAuthenticated && (
            <Box sx={{ p: 2 }}>
              <Tooltip 
                title={isCollapsed ? "New Request" : ""} 
                placement="right"
                arrow
              >
                <Button
                  variant="contained"
                  onClick={handleNewChat}
                  startIcon={!isCollapsed ? <AddIcon /> : null}
                  sx={{
                    width: '100%',
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
                  {isCollapsed ? <AddIcon /> : "New Request"}
                </Button>
              </Tooltip>
            </Box>
          )}

          {/* Recent Chats */}
          {isAuthenticated && !isCollapsed && (
            <Box sx={{ px: 2, pb: 2 }}>
              <Typography variant="subtitle2" sx={{ 
                color: '#6c757d', 
                mb: 1, 
                px: 1,
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Recent Chats
              </Typography>
              <List sx={{ py: 0 }}>
                {chatHistory.slice(0, 3).map((chat) => (
                  <ListItem key={chat.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleChatSelect(chat.id)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        px: 2,
                        py: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(116, 66, 191, 0.05)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <ChatIcon sx={{ fontSize: 18, color: '#7442BF' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ 
                            fontWeight: 500,
                            fontSize: '0.85rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {chat.title}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ 
                            color: '#6c757d',
                            fontSize: '0.7rem'
                          }}>
                            {formatTime(chat.timestamp)}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Divider sx={{ mx: 2, mb: 2 }} />

          {/* Navigation Menu */}
          {isAuthenticated && (
            <List sx={{ pt: 1 }}>
              {menuItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <Tooltip 
                    title={isCollapsed ? item.text : ''} 
                    placement="right"
                    arrow
                  >
                    <ListItemButton
                      component={Link}
                      to={item.to}
                      selected={location.pathname === item.to}
                      sx={{
                        minHeight: 48,
                        justifyContent: isCollapsed ? 'center' : 'initial',
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
                          mr: isCollapsed ? 0 : 3,
                          justifyContent: 'center',
                          color: location.pathname === item.to ? '#7442BF' : 'inherit'
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {!isCollapsed && (
                        <ListItemText 
                          primary={item.text}
                          sx={{ 
                            opacity: isCollapsed ? 0 : 1,
                            color: location.pathname === item.to ? '#7442BF' : 'inherit'
                          }}
                        />
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              ))}
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