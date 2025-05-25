import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  IconButton,
  Avatar,
  Divider,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Send,
  Person,
  Business,
  Phone,
  Email,
  Flag,
  Interests,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const { logout } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Mock user data
  const userData = {
    email: 'test@example.com',
    phoneNumber: '+86 1234567890',
    hasCompany: 'yes',
    companyName: 'Test Company',
    address: '123 Test Street, Test City',
    goals: ['Increase Sales', 'Improve Customer Service'],
    interests: ['E-commerce', 'Technology'],
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Mock AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: 'This is a mock AI response. In a real application, this would connect to an actual AI service.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
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
    // Add voice recognition logic here
  };

  return (
    <Container maxWidth="xl" sx={{ 
      mt: { xs: 2, md: 4 }, 
      mb: { xs: 2, md: 4 }, 
      height: 'calc(100vh - 64px)',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      pt: { xs: 2, md: 4 },
      pl: { md: 0 }
    }}>
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 2, md: 3 }, 
        flexDirection: { xs: 'column', md: 'row' },
        height: { xs: 'auto', md: 'calc(100vh - 300px)' },
        alignItems: 'flex-start',
        maxWidth: '1200px',
        width: 'fit-content'
      }}>
        {/* User Info Card */}
        <Box sx={{ 
          width: { xs: '100%', md: '400px' },
          flexShrink: 0,
          height: { xs: 'auto', md: 'calc(100vh - 300px)' }
        }}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2, 
            boxShadow: 3,
            overflow: 'auto'
          }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  sx={{
                    width: { xs: 40, md: 50 },
                    height: { xs: 40, md: 50 },
                    bgcolor: theme.palette.primary.main,
                    fontSize: { xs: '1rem', md: '1.2rem' },
                  }}
                >
                  {userData.email[0].toUpperCase()}
                </Avatar>
                <Box ml={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    {userData.email}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box mb={1.5}>
                <Box display="flex" alignItems="center" mb={0.75}>
                  <Email sx={{ mr: 1, color: 'text.secondary', fontSize: { xs: '1rem', md: '1.1rem' } }} />
                  <Typography variant="body2">{userData.email}</Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={0.75}>
                  <Phone sx={{ mr: 1, color: 'text.secondary', fontSize: { xs: '1rem', md: '1.1rem' } }} />
                  <Typography variant="body2">{userData.phoneNumber}</Typography>
                </Box>
                {userData.hasCompany === 'yes' && (
                  <>
                    <Box display="flex" alignItems="center" mb={0.75}>
                      <Business sx={{ mr: 1, color: 'text.secondary', fontSize: { xs: '1rem', md: '1.1rem' } }} />
                      <Typography variant="body2">{userData.companyName}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={0.75}>
                      <Flag sx={{ mr: 1, color: 'text.secondary', fontSize: { xs: '1rem', md: '1.1rem' } }} />
                      <Typography variant="body2">{userData.address}</Typography>
                    </Box>
                  </>
                )}
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box mb={1.5}>
                <Typography variant="subtitle2" gutterBottom>
                  Goals
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.75}>
                  {userData.goals.map((goal) => (
                    <Chip
                      key={goal}
                      label={goal}
                      size="small"
                      sx={{ 
                        bgcolor: theme.palette.primary.light,
                        fontSize: { xs: '0.7rem', md: '0.75rem' }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Interests
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={0.75}>
                  {userData.interests.map((interest) => (
                    <Chip
                      key={interest}
                      label={interest}
                      size="small"
                      sx={{ 
                        bgcolor: theme.palette.secondary.light,
                        fontSize: { xs: '0.7rem', md: '0.75rem' }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* AI Chat Interface */}
        <Box sx={{ 
          flex: 1,
          minWidth: 0,
          height: { xs: 'calc(100vh - 400px)', md: 'calc(100vh - 300px)' },
          aspectRatio: { xs: 'auto', md: '1/1' },
          maxWidth: { xs: '100%', md: 'calc(100vh - 300px)' }
        }}>
          <Card sx={{ 
            height: '100%', 
            borderRadius: 2, 
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              p: { xs: 1.5, md: 2 }
            }}>
              <Typography variant="h6" gutterBottom sx={{ px: { xs: 1, md: 2 } }}>
                AI Assistant
              </Typography>

              {/* Message List */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  mb: 2,
                  p: { xs: 1, md: 2 },
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  minHeight: 0,
                  maxHeight: { xs: 'calc(100% - 100px)', md: 'calc(100% - 120px)' }
                }}
              >
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Paper
                      sx={{
                        p: { xs: 1, md: 1.5 },
                        maxWidth: '80%',
                        bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.100',
                        color: msg.sender === 'user' ? 'white' : 'text.primary',
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="body2">{msg.text}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                        {msg.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>

              {/* Input Area */}
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                p: { xs: 1, md: 2 },
                bgcolor: 'background.paper',
                borderTop: 1,
                borderColor: 'divider'
              }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  variant="outlined"
                  size="small"
                  sx={{ 
                    bgcolor: 'white',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
                <IconButton
                  color={isRecording ? 'error' : 'primary'}
                  onClick={toggleRecording}
                  sx={{ 
                    bgcolor: 'grey.100',
                    '&:hover': { bgcolor: 'grey.200' }
                  }}
                >
                  {isRecording ? <MicOff /> : <Mic />}
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  sx={{ 
                    bgcolor: 'grey.100',
                    '&:hover': { bgcolor: 'grey.200' }
                  }}
                >
                  <Send />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard; 