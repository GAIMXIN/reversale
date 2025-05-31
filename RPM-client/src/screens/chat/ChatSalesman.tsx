import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Phone as PhoneIcon,
  VideoCall as VideoCallIcon,
  Schedule as ScheduleIcon,
  AttachMoney as BudgetIcon,
  Star as StarIcon,
  Launch as LaunchIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

interface Message {
  id: string;
  sender: 'user' | 'salesman' | 'system';
  content: string;
  timestamp: Date;
  type: 'text' | 'system' | 'draft' | 'product';
  draft?: any;
  product?: Product;
}

interface Draft {
  id: string;
  title: string;
  content: string;
  budget: string;
  timeline: string;
  category?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  timeline: string;
  rating: number;
  url: string;
  features: string[];
  company: string;
}

interface Salesman {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
  specialties: string[];
}

const salesmen: Salesman[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'E-commerce Growth Specialist',
    avatar: '/avatars/sarah.jpg',
    isOnline: true,
    specialties: ['E-commerce', 'Digital Marketing', 'Conversion Optimization']
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    role: 'Restaurant Operations Expert',
    avatar: '/avatars/mike.jpg',
    isOnline: true,
    specialties: ['Restaurant Management', 'Food Service', 'Operations']
  },
  {
    id: '3',
    name: 'Dr. Lisa Wang',
    role: 'Healthcare Technology Consultant',
    avatar: '/avatars/lisa.jpg',
    isOnline: false,
    specialties: ['Healthcare IT', 'Medical Practice', 'EMR Systems']
  }
];

export default function ChatSalesman() {
  const location = useLocation();
  const [selectedSalesman, setSelectedSalesman] = useState<Salesman | null>(salesmen[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Initialize messages based on whether a draft was passed
  useEffect(() => {
    const draft = location.state?.draft;
    const product = location.state?.product;
    const userQuery = location.state?.userQuery;
    const type = location.state?.type;
    
    if (draft) {
      // If a draft was passed, show the draft first and then salesman response
      const initialMessages: Message[] = [
        {
          id: '1',
          sender: 'system',
          content: 'Sarah Chen joined the conversation',
          timestamp: new Date(),
          type: 'system'
        },
        {
          id: '2',
          sender: 'user',
          content: `I'd like to discuss my project proposal: ${draft.title}`,
          timestamp: new Date(),
          type: 'draft',
          draft: draft
        },
        {
          id: '3',
          sender: 'salesman',
          content: `Hi! I'm Sarah, your dedicated e-commerce specialist. I've reviewed your project proposal about ${draft.title.toLowerCase()}. I have some great strategies that have helped my clients achieve excellent results. When would be a good time to discuss your specific challenges?`,
          timestamp: new Date(),
          type: 'text'
        }
      ];
      setMessages(initialMessages);
    } else if (product && type === 'product-recommendation') {
      // If a product recommendation was passed
      const initialMessages: Message[] = [
        {
          id: '1',
          sender: 'system',
          content: 'Sarah Chen joined the conversation',
          timestamp: new Date(),
          type: 'system'
        },
        {
          id: '2',
          sender: 'user',
          content: userQuery ? `I was looking for: "${userQuery}" and I'm interested in this product:` : 'I\'m interested in this product:',
          timestamp: new Date(),
          type: 'product',
          product: product
        },
        {
          id: '3',
          sender: 'salesman',
          content: `Hi! I'm Sarah, your dedicated specialist. I see you're interested in ${product.name}. This is an excellent choice for ${product.category.toLowerCase()} solutions. I'd love to discuss how this product can specifically address your business needs and show you some success stories from similar implementations. What specific challenges are you looking to solve?`,
          timestamp: new Date(),
          type: 'text'
        }
      ];
      setMessages(initialMessages);
    } else {
      // Default messages without draft or product
      const defaultMessages: Message[] = [
        {
          id: '1',
          sender: 'system',
          content: 'Sarah Chen joined the conversation',
          timestamp: new Date(),
          type: 'system'
        },
        {
          id: '2',
          sender: 'salesman',
          content: 'Hi! I\'m Sarah, your dedicated specialist. How can I help you with your business challenges today?',
          timestamp: new Date(),
          type: 'text'
        }
      ];
      setMessages(defaultMessages);
    }
  }, [location.state]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate salesman response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me share some insights based on my experience with similar businesses...",
        "I've seen this challenge before with other clients. Here's what we can do to address this...",
        "Perfect! I can definitely help you with that. Let me explain the approach we've used successfully...",
        "That's exactly the kind of challenge I specialize in. Would you like me to create a detailed implementation plan?"
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'salesman',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', bgcolor: '#f8f9fa' }}>
      {/* Salesmen List */}
      <Box sx={{
        width: 320,
        bgcolor: 'white',
        borderRight: '1px solid #e9ecef',
        overflow: 'auto'
      }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #e9ecef' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#7442BF' }}>
            Available Specialists
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
            Connect with experts who can help solve your business challenges
          </Typography>
        </Box>

        <List sx={{ p: 0 }}>
          {salesmen.map((salesman) => (
            <ListItemButton
              key={salesman.id}
              selected={selectedSalesman?.id === salesman.id}
              onClick={() => setSelectedSalesman(salesman)}
              sx={{
                py: 2,
                px: 3,
                '&.Mui-selected': {
                  bgcolor: 'rgba(116, 66, 191, 0.1)',
                  borderRight: '3px solid #7442BF'
                }
              }}
            >
              <ListItemAvatar>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={salesman.avatar}
                    sx={{ 
                      width: 48, 
                      height: 48,
                      bgcolor: '#7442BF'
                    }}
                  >
                    {salesman.name.charAt(0)}
                  </Avatar>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 2,
                      right: 2,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: salesman.isOnline ? '#4CAF50' : '#ccc',
                      border: '2px solid white'
                    }}
                  />
                </Box>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {salesman.name}
                  </Typography>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                      {salesman.role}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {salesman.specialties.slice(0, 2).map((specialty) => (
                        <Chip
                          key={specialty}
                          label={specialty}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: 20,
                            bgcolor: 'rgba(116, 66, 191, 0.1)',
                            color: '#7442BF'
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                }
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedSalesman && (
          <>
            {/* Chat Header */}
            <Box sx={{
              p: 3,
              bgcolor: 'white',
              borderBottom: '1px solid #e9ecef',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={selectedSalesman.avatar}
                  sx={{ bgcolor: '#7442BF' }}
                >
                  {selectedSalesman.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedSalesman.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {selectedSalesman.role} • {selectedSalesman.isOnline ? 'Online' : 'Offline'}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton sx={{ color: '#7442BF' }}>
                  <PhoneIcon />
                </IconButton>
                <IconButton sx={{ color: '#7442BF' }}>
                  <VideoCallIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Messages */}
            <Box sx={{
              flex: 1,
              overflow: 'auto',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}>
              {messages.map((message) => (
                <Box key={message.id}>
                  {message.type === 'system' ? (
                    <Box sx={{ textAlign: 'center', my: 2 }}>
                      <Typography variant="caption" sx={{ 
                        color: '#666',
                        bgcolor: '#f0f0f0',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1
                      }}>
                        {message.content}
                      </Typography>
                    </Box>
                  ) : message.type === 'draft' ? (
                    // Special display for draft messages
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      mb: 2
                    }}>
                      <Paper sx={{
                        p: 3,
                        maxWidth: '80%',
                        bgcolor: '#7442BF',
                        color: 'white',
                        borderRadius: 2,
                      }}>
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                          {message.content}
                        </Typography>
                        
                        {message.draft && (
                          <Box sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.1)', 
                            borderRadius: 2, 
                            p: 2, 
                            mt: 2 
                          }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                              📋 {message.draft.title}
                            </Typography>
                            
                            {message.draft.category && (
                              <Chip
                                label={message.draft.category}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                                  color: 'white',
                                  mb: 2,
                                  fontSize: '0.75rem'
                                }}
                              />
                            )}
                            
                            <Typography variant="body2" sx={{ 
                              mb: 2, 
                              lineHeight: 1.6,
                              maxHeight: 120,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 5,
                              WebkitBoxOrient: 'vertical',
                            }}>
                              {message.draft.content.replace(/\*\*/g, '').substring(0, 300)}...
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BudgetIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption">
                                  {message.draft.budget}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ScheduleIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption">
                                  {message.draft.timeline}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        )}
                        
                        <Typography variant="caption" sx={{
                          opacity: 0.8,
                          mt: 2,
                          display: 'block'
                        }}>
                          {message.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Paper>
                    </Box>
                  ) : message.type === 'product' ? (
                    // Special display for product recommendation messages
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      mb: 2
                    }}>
                      <Paper sx={{
                        p: 3,
                        maxWidth: '80%',
                        bgcolor: '#7442BF',
                        color: 'white',
                        borderRadius: 2,
                      }}>
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                          {message.content}
                        </Typography>
                        
                        {message.product && (
                          <Box sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.1)', 
                            borderRadius: 2, 
                            p: 2, 
                            mt: 2 
                          }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                              🚀 {message.product.name}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <Chip
                                label={message.product.category}
                                size="small"
                                sx={{
                                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                                  color: 'white',
                                  fontSize: '0.75rem'
                                }}
                              />
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {Array.from({ length: 5 }, (_, index) => (
                                  <StarIcon
                                    key={index}
                                    sx={{
                                      fontSize: 14,
                                      color: index < Math.floor(message.product?.rating || 0) ? '#ffc107' : 'rgba(255, 255, 255, 0.3)'
                                    }}
                                  />
                                ))}
                                <Typography variant="caption" sx={{ ml: 0.5 }}>
                                  ({message.product?.rating})
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Typography variant="body2" sx={{ 
                              mb: 2, 
                              lineHeight: 1.6,
                              maxHeight: 100,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                            }}>
                              {message.product.description}
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 1, display: 'block' }}>
                                Key Features:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {message.product.features.slice(0, 3).map((feature, index) => (
                                  <Chip
                                    key={index}
                                    label={feature}
                                    size="small"
                                    sx={{
                                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                                      color: 'white',
                                      fontSize: '0.7rem',
                                      height: '20px'
                                    }}
                                  />
                                ))}
                                {message.product.features.length > 3 && (
                                  <Chip
                                    label={`+${message.product.features.length - 3} more`}
                                    size="small"
                                    sx={{
                                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      fontSize: '0.7rem',
                                      height: '20px'
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BudgetIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption">
                                  {message.product.price}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <ScheduleIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption">
                                  {message.product.timeline}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BusinessIcon sx={{ fontSize: 16 }} />
                                <Typography variant="caption">
                                  {message.product.company}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<LaunchIcon />}
                              onClick={() => window.open(message.product?.url || '', '_blank')}
                              sx={{
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                color: 'white',
                                fontSize: '0.75rem',
                                '&:hover': {
                                  borderColor: 'rgba(255, 255, 255, 0.5)',
                                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                              }}
                            >
                              View Demo
                            </Button>
                          </Box>
                        )}
                        
                        <Typography variant="caption" sx={{
                          opacity: 0.8,
                          mt: 2,
                          display: 'block'
                        }}>
                          {message.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Paper>
                    </Box>
                  ) : (
                    <Box sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}>
                      <Paper sx={{
                        p: 2,
                        maxWidth: '70%',
                        bgcolor: message.sender === 'user' ? '#7442BF' : 'white',
                        color: message.sender === 'user' ? 'white' : '#333',
                        borderRadius: 2,
                        border: message.sender === 'salesman' ? '1px solid #e9ecef' : 'none'
                      }}>
                        <Typography variant="body1">
                          {message.content}
                        </Typography>
                        <Typography variant="caption" sx={{
                          opacity: 0.7,
                          mt: 1,
                          display: 'block'
                        }}>
                          {message.timestamp.toLocaleTimeString()}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>

            {/* Message Input */}
            <Box sx={{
              p: 3,
              bgcolor: 'white',
              borderTop: '1px solid #e9ecef'
            }}>
              <Box sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'flex-end'
              }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                />
                <IconButton>
                  <AttachFileIcon />
                </IconButton>
                <IconButton
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  sx={{
                    bgcolor: '#7442BF',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#5e3399'
                    },
                    '&:disabled': {
                      bgcolor: '#ccc'
                    }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
} 