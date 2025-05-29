import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Badge,
} from '@mui/material';
import {
  SupportAgent,
  Phone,
  Email,
  Send,
  Mic,
  MicOff,
  Person,
  Schedule,
  CheckCircle,
  TrendingUp,
  Groups,
} from '@mui/icons-material';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  agentName?: string;
}

export default function ContactSalesman() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAgentOnline, setIsAgentOnline] = useState(true);
  const [currentAgent, setCurrentAgent] = useState({
    name: 'Sarah Johnson',
    title: 'Senior Sales Manager',
    avatar: 'SJ',
    status: 'online'
  });
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Sarah from ReverSSale sales team. I'm here to help you find the perfect products and solutions for your business. How can I assist you today?",
      sender: 'agent',
      timestamp: new Date(),
      agentName: 'Sarah Johnson'
    },
    {
      id: 2,
      text: "I can provide personalized product recommendations, discuss pricing, share success stories, and answer any questions about your services.",
      sender: 'agent',
      timestamp: new Date(),
      agentName: 'Sarah Johnson'
    }
  ]);

  const quickActions = [
    "I need product recommendations",
    "What's trending in my industry?",
    "I want to discuss pricing",
    "Show me success stories",
    "Tell me about your services"
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // 模拟人工客服回复
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me check our latest product catalog for you. Based on your business profile, I have some excellent recommendations.",
        "I understand your needs. Our team has helped many similar businesses achieve great results. Let me share some specific solutions with you.",
        "Perfect! I can see from your profile that you're in the tech industry. We have some exciting new products that would be perfect for your business model.",
        "Absolutely! I'd love to discuss this further. Our success rate with businesses like yours is over 95%. Let me explain how we can help you grow.",
        "Thank you for reaching out! I have access to our complete product suite and can provide detailed information about pricing and implementation.",
        "Great to hear from you! Based on your company size and industry, I can recommend several solutions that have worked well for similar businesses."
      ];
      
      const response: Message = {
        id: Date.now() + 1,
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'agent',
        timestamp: new Date(),
        agentName: currentAgent.name
      };
      
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const newMessage: Message = {
      id: Date.now(),
      text: action,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    // 根据快捷操作给出相应回复
    setTimeout(() => {
      let response: Message;
      
      switch (action) {
        case "I need product recommendations":
          response = {
            id: Date.now() + 1,
            text: "Excellent! I'd be happy to help you with product recommendations. Based on your business profile, I can suggest solutions that align with your goals. What specific challenges are you looking to solve?",
            sender: 'agent',
            timestamp: new Date(),
            agentName: currentAgent.name
          };
          break;
        case "What's trending in my industry?":
          response = {
            id: Date.now() + 1,
            text: "Great question! In your industry, we're seeing strong demand for automation tools, customer service solutions, and data analytics platforms. Our clients report 40-60% efficiency improvements with these technologies.",
            sender: 'agent',
            timestamp: new Date(),
            agentName: currentAgent.name
          };
          break;
        case "I want to discuss pricing":
          response = {
            id: Date.now() + 1,
            text: "I'd be happy to discuss pricing with you! Our solutions are designed to provide excellent ROI. Let me understand your specific needs first, and I can provide you with a customized quote that fits your budget.",
            sender: 'agent',
            timestamp: new Date(),
            agentName: currentAgent.name
          };
          break;
        case "Show me success stories":
          response = {
            id: Date.now() + 1,
            text: "I love sharing success stories! We recently helped a company similar to yours increase their sales by 85% within 6 months. Another client reduced their operational costs by 45%. Would you like to hear more details about these cases?",
            sender: 'agent',
            timestamp: new Date(),
            agentName: currentAgent.name
          };
          break;
        case "Tell me about your services":
          response = {
            id: Date.now() + 1,
            text: "We offer comprehensive business solutions including e-commerce platforms, digital marketing tools, CRM systems, and consulting services. Our team provides end-to-end support from implementation to ongoing optimization.",
            sender: 'agent',
            timestamp: new Date(),
            agentName: currentAgent.name
          };
          break;
        default:
          response = {
            id: Date.now() + 1,
            text: "I'd be happy to help you with that! Let me gather some information and provide you with the best options available.",
            sender: 'agent',
            timestamp: new Date(),
            agentName: currentAgent.name
          };
      }
      
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 2, height: 'calc(100vh - 100px)' }}>
      {/* Header */}
      <Paper sx={{ 
        p: 3, 
        mb: 2, 
        background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)', 
        color: 'white',
        borderRadius: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SupportAgent sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Sales Support Center
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Connect with our expert sales team for personalized business solutions
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Badge 
                badgeContent={isAgentOnline ? "●" : "○"} 
                color={isAgentOnline ? "success" : "error"}
                sx={{ '& .MuiBadge-badge': { right: -2, top: 2 } }}
              >
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                  {currentAgent.avatar}
                </Avatar>
              </Badge>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                {currentAgent.name}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Chat Interface */}
      <Paper sx={{ 
        height: 'calc(100% - 120px)',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
            bgcolor: '#fafbfc',
          }}
        >
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 3,
                alignItems: 'flex-start',
                gap: 1
              }}
            >
              {msg.sender !== 'user' && (
                <Avatar 
                  sx={{ 
                    bgcolor: '#7442BF',
                    width: 32,
                    height: 32,
                    fontSize: '0.8rem'
                  }}
                >
                  {currentAgent.avatar}
                </Avatar>
              )}
              
              <Box sx={{ maxWidth: '75%' }}>
                {msg.sender !== 'user' && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {msg.agentName}
                  </Typography>
                )}
                
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: msg.sender === 'user' 
                      ? 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)'
                      : 'white',
                    color: msg.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: 3,
                    boxShadow: msg.sender === 'user' 
                      ? '0 4px 20px rgba(116, 66, 191, 0.3)'
                      : '0 2px 10px rgba(0,0,0,0.1)',
                    border: msg.sender === 'agent' ? '1px solid #e9ecef' : 'none',
                    mt: msg.sender !== 'user' ? 0.5 : 0
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {msg.text}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      opacity: 0.7, 
                      display: 'block', 
                      mt: 1,
                      textAlign: msg.sender === 'user' ? 'right' : 'left'
                    }}
                  >
                    {msg.timestamp.toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Quick Actions */}
        <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e9ecef' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Quick actions:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {quickActions.map((action, index) => (
              <Chip
                key={index}
                label={action}
                onClick={() => handleQuickAction(action)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'white'
                  }
                }}
                size="small"
              />
            ))}
          </Box>
        </Box>

        {/* Input Area */}
        <Box sx={{ 
          p: 3,
          bgcolor: 'white',
          borderTop: '1px solid #e9ecef'
        }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message to our sales team..."
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: '#f8f9fa',
                  '&:hover': {
                    bgcolor: 'white'
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white'
                  }
                }
              }}
            />
            <IconButton
              color={isRecording ? 'error' : 'primary'}
              onClick={toggleRecording}
              sx={{ 
                bgcolor: isRecording ? '#ffebee' : '#f3e5f5',
                '&:hover': { 
                  bgcolor: isRecording ? '#ffcdd2' : '#e1bee7',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
              title="Voice Input"
            >
              {isRecording ? <MicOff /> : <Mic />}
            </IconButton>
            <IconButton
              onClick={handleSendMessage}
              disabled={!message.trim()}
              sx={{ 
                bgcolor: '#7442BF',
                color: 'white',
                '&:hover': { 
                  bgcolor: '#5e3399',
                  transform: 'scale(1.05)'
                },
                '&:disabled': {
                  bgcolor: '#e0e0e0',
                  color: '#9e9e9e'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Send />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              💬 Human sales agent online • Response time: ~30 seconds
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                icon={<Person />} 
                label="Human Support" 
                size="small" 
                color="primary" 
                variant={isAgentOnline ? "filled" : "outlined"}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 