import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  InputAdornment,
  Badge,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachIcon,
  EmojiEmotions as EmojiIcon,
  MoreVert as MoreVertIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'notification';
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'lead' | 'deal';
  participants: number;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  avatar?: string;
  status: 'active' | 'inactive';
}

const LeadsDealsChat: React.FC = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<string>('lead-1');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Mock chat rooms data
  const chatRooms: ChatRoom[] = [
    {
      id: 'lead-1',
      name: 'Tech Solutions Inc.',
      type: 'lead',
      participants: 3,
      lastMessage: 'We are very interested in your proposal...',
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      unreadCount: 2,
      status: 'active'
    },
    {
      id: 'lead-2',
      name: 'Digital Marketing Agency',
      type: 'lead',
      participants: 2,
      lastMessage: 'Can we schedule a demo?',
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      unreadCount: 0,
      status: 'active'
    },
    {
      id: 'deal-1',
      name: 'CRM System Custom Development',
      type: 'deal',
      participants: 4,
      lastMessage: 'Project update: Frontend development is 60% complete',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      unreadCount: 1,
      status: 'active'
    },
    {
      id: 'deal-2',
      name: 'E-commerce Platform Upgrade',
      type: 'deal',
      participants: 5,
      lastMessage: 'Test environment is ready',
      lastMessageTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      unreadCount: 0,
      status: 'active'
    },
  ];

  // Mock messages for selected room
  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      senderId: 'client-1',
      senderName: 'John Manager',
      message: 'Hello, we are very interested in your CRM solution',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text'
    },
    {
      id: '2',
      senderId: 'sales-1',
      senderName: 'Sales Rep',
      message: 'Hello John! Great to hear you are interested in our product. I can arrange a product demo for you.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
      type: 'text'
    },
    {
      id: '3',
      senderId: 'system',
      senderName: 'System',
      message: 'John Manager has viewed the product demo document',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      type: 'system'
    },
    {
      id: '4',
      senderId: 'client-1',
      senderName: 'John Manager',
      message: 'We are very interested in your proposal. Could you provide a more detailed quote?',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text'
    },
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString('en-US');
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'current-user',
        senderName: 'Me',
        message: message.trim(),
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filterRoomsByType = (type: 'lead' | 'deal') => {
    return chatRooms.filter(room => room.type === type);
  };

  const getCurrentRooms = () => {
    if (selectedTab === 0) return chatRooms; // All
    if (selectedTab === 1) return filterRoomsByType('lead'); // Leads
    if (selectedTab === 2) return filterRoomsByType('deal'); // Deals
    return [];
  };

  const getTabIcon = (index: number) => {
    switch (index) {
      case 0: return <GroupIcon />;
      case 1: return <PersonIcon />;
      case 2: return <TrendingIcon />;
      default: return <GroupIcon />;
    }
  };

  const getTotalUnreadCount = () => {
    return getCurrentRooms().reduce((total, room) => total + room.unreadCount, 0);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', bgcolor: 'white' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
          Leads & Deals Chat
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Real-time communication with your potential clients and project teams
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar - Chat Rooms List */}
        <Box sx={{ 
          width: 350, 
          borderRight: '1px solid #e0e0e0', 
          bgcolor: '#fafafa',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: '1px solid #e0e0e0', bgcolor: 'white' }}>
            <Tabs 
              value={selectedTab} 
              onChange={(_, newValue) => setSelectedTab(newValue)}
              variant="fullWidth"
            >
              <Tab 
                icon={<Badge badgeContent={getTotalUnreadCount() || null} color="error">{getTabIcon(0)}</Badge>}
                label="All" 
              />
              <Tab 
                icon={<Badge badgeContent={filterRoomsByType('lead').reduce((total, room) => total + room.unreadCount, 0) || null} color="error">{getTabIcon(1)}</Badge>}
                label="Leads" 
              />
              <Tab 
                icon={<Badge badgeContent={filterRoomsByType('deal').reduce((total, room) => total + room.unreadCount, 0) || null} color="error">{getTabIcon(2)}</Badge>}
                label="Deals" 
              />
            </Tabs>
          </Box>

          {/* Rooms List */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <List sx={{ p: 0 }}>
              {getCurrentRooms().map((room) => (
                <ListItem
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: selectedRoom === room.id ? 'rgba(116, 66, 191, 0.1)' : 'transparent',
                    borderLeft: selectedRoom === room.id ? '3px solid #7442BF' : '3px solid transparent',
                    '&:hover': {
                      bgcolor: 'rgba(116, 66, 191, 0.05)',
                    },
                    py: 2,
                  }}
                >
                  <ListItemAvatar>
                    <Badge badgeContent={room.unreadCount || null} color="error">
                      <Avatar sx={{ 
                        bgcolor: room.type === 'lead' ? '#2196f3' : '#4caf50',
                        width: 45,
                        height: 45
                      }}>
                        {room.type === 'lead' ? <PersonIcon /> : <BusinessIcon />}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography 
                          variant="subtitle1" 
                          noWrap
                          sx={{ 
                            fontWeight: room.unreadCount > 0 ? 600 : 400,
                            color: '#333',
                            maxWidth: '180px'
                          }}
                        >
                          {room.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                          {formatLastMessageTime(room.lastMessageTime)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Chip 
                            label={room.type === 'lead' ? 'Lead' : 'Deal'}
                            size="small"
                            sx={{ 
                              fontSize: '0.7rem',
                              height: 18,
                              bgcolor: room.type === 'lead' ? '#e3f2fd' : '#e8f5e8',
                              color: room.type === 'lead' ? '#1976d2' : '#2e7d32'
                            }}
                          />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {room.participants} participants
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ 
                          color: 'text.secondary',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                        }}>
                          {room.lastMessage}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        {/* Chat Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Chat Header */}
          <Box sx={{ 
            p: 3, 
            borderBottom: '1px solid #e0e0e0', 
            bgcolor: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#7442BF' }}>
                <BusinessIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                  {chatRooms.find(room => room.id === selectedRoom)?.name || 'Select Chat Room'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {chatRooms.find(room => room.id === selectedRoom)?.participants} participants online
                </Typography>
              </Box>
            </Box>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 2,
            bgcolor: '#f8f9fa'
          }}>
            {messages.map((msg) => (
              <Box key={msg.id} sx={{ mb: 2 }}>
                {msg.type === 'system' ? (
                  <Box sx={{ textAlign: 'center', py: 1 }}>
                    <Chip 
                      label={msg.message}
                      size="small"
                      sx={{ 
                        bgcolor: '#e0e0e0',
                        color: 'text.secondary',
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: msg.senderId === 'current-user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: 2
                  }}>
                    {msg.senderId !== 'current-user' && (
                      <Avatar sx={{ 
                        bgcolor: '#2196f3',
                        width: 32,
                        height: 32,
                        fontSize: '0.8rem'
                      }}>
                        {msg.senderName.charAt(0)}
                      </Avatar>
                    )}
                    
                    <Box sx={{ 
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: msg.senderId === 'current-user' ? 'flex-end' : 'flex-start'
                    }}>
                      {msg.senderId !== 'current-user' && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          {msg.senderName}
                        </Typography>
                      )}
                      
                      <Paper sx={{ 
                        p: 2,
                        bgcolor: msg.senderId === 'current-user' ? '#7442BF' : 'white',
                        color: msg.senderId === 'current-user' ? 'white' : 'text.primary',
                        borderRadius: 2,
                        maxWidth: '100%'
                      }}>
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          {msg.message}
                        </Typography>
                      </Paper>
                      
                      <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {formatTime(msg.timestamp)}
                      </Typography>
                    </Box>

                    {msg.senderId === 'current-user' && (
                      <Avatar sx={{ 
                        bgcolor: '#7442BF',
                        width: 32,
                        height: 32,
                        fontSize: '0.8rem'
                      }}>
                        Me
                      </Avatar>
                    )}
                  </Box>
                )}
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Message Input */}
          <Box sx={{ 
            p: 3, 
            borderTop: '1px solid #e0e0e0', 
            bgcolor: 'white'
          }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton size="small">
                      <EmojiIcon />
                    </IconButton>
                    <IconButton size="small">
                      <AttachIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      sx={{ 
                        color: message.trim() ? '#7442BF' : 'text.disabled'
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#7442BF',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#7442BF',
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LeadsDealsChat; 