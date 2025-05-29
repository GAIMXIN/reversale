import React, { useState, useEffect } from 'react';
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
import BusinessIcon from '@mui/icons-material/Business';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import { useAuth } from '../../contexts/AuthContext';

interface ChatSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const menuItems = [
  { to: "/dashboard", text: "Dashboard", icon: <DashboardIcon /> },
  { to: "/business-insights", text: "Business Insights", icon: <BusinessIcon /> },
  { to: "/personalized-products", text: "Solutions", icon: <LightbulbIcon /> },
  { to: "/contact-salesman", text: "Contact Salesman", icon: <SupportAgentIcon /> },
];

export default function ChatSidebar({ collapsed, onToggle }: ChatSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

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
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 72 : 280,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: collapsed ? 72 : 280,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          zIndex: 1200, // Ensure it's below the fixed logo
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
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

        {/* New Chat Button - Always show when authenticated */}
        {isAuthenticated && (
          <Box sx={{ p: 2 }}>
            <Tooltip title={collapsed ? 'New Chat' : ''} placement="right" arrow>
              <Button
                fullWidth={!collapsed}
                variant="contained"
                startIcon={collapsed ? null : <AddIcon />}
                onClick={handleNewChat}
                sx={{
                  bgcolor: '#7442BF',
                  color: 'white',
                  borderRadius: 2,
                  py: 1.5,
                  minWidth: collapsed ? 48 : 'auto',
                  width: collapsed ? 48 : '100%',
                  height: collapsed ? 48 : 'auto',
                  '&:hover': {
                    bgcolor: '#5e3399',
                  },
                }}
              >
                {collapsed ? <AddIcon /> : 'New Chat'}
              </Button>
            </Tooltip>
          </Box>
        )}

        {/* Chat History - Always show when authenticated and not collapsed */}
        {!collapsed && isAuthenticated && (
          <>
            <Box sx={{ overflow: 'auto', maxHeight: '200px', mb: 1 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  px: 2, 
                  py: 1, 
                  color: 'text.secondary',
                  fontWeight: 600 
                }}
              >
                Recent Chats
              </Typography>
              <List sx={{ pt: 0 }}>
                {chatHistory.map((chat) => (
                  <ListItem key={chat.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleChatSelect(chat.id)}
                      sx={{
                        px: 2,
                        py: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(116, 66, 191, 0.05)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ChatIcon sx={{ fontSize: 20, color: '#7442BF' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 500,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {chat.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'text.secondary',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block'
                              }}
                            >
                              {chat.lastMessage}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: 'text.disabled',
                                fontSize: '0.7rem'
                              }}
                            >
                              {formatTime(chat.timestamp)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
            <Divider />
          </>
        )}

        {/* Navigation Menu - Only show when authenticated */}
        {isAuthenticated && (
          <List sx={{ pt: 1 }}>
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
        )}

        {/* Login prompt for unauthenticated users */}
        {!isAuthenticated && !collapsed && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Login to access Dashboard and other features
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                color: '#7442BF',
                borderColor: '#7442BF',
                '&:hover': {
                  borderColor: '#5e3399',
                  bgcolor: 'rgba(116, 66, 191, 0.04)'
                }
              }}
            >
              Login
            </Button>
          </Box>
        )}

        {/* Footer */}
        {!collapsed && (
          <Box sx={{ 
            p: 2,
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