import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  IconButton,
  Typography,
  Button,
  Tooltip,
  Fab,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { 
  Send as SendIcon, 
  Mic as MicIcon, 
  MicOff as MicOffIcon, 
  Keyboard as KeyboardIcon,
  ArrowBack,
  Restaurant,
  LocalHospital,
  Store,
  Business,
  Computer,
  Build,
  School,
  DirectionsCar,
  Home,
  Spa,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assests/img/logo.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SalesmanChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Service field icon mapping
  const fieldIcons: { [key: string]: any } = {
    restaurant: Restaurant,
    healthcare: LocalHospital,
    retail: Store,
    business: Business,
    technology: Computer,
    manufacturing: Build,
    education: School,
    automotive: DirectionsCar,
    realestate: Home,
    wellness: Spa,
  };

  // Service field name mapping
  const fieldNames: { [key: string]: string } = {
    restaurant: 'Restaurant & Food Service',
    healthcare: 'Healthcare & Medical',
    retail: 'Retail & E-commerce',
    business: 'Business Services',
    technology: 'Technology & Software',
    manufacturing: 'Manufacturing & Industrial',
    education: 'Education & Training',
    automotive: 'Automotive & Transportation',
    realestate: 'Real Estate & Property',
    wellness: 'Wellness & Beauty',
  };

  // Redirect to dashboard if no field selected
  useEffect(() => {
    if (!user?.selectedField) {
      navigate('/salesman-dashboard');
    }
  }, [user?.selectedField, navigate]);

  // Initialize welcome message
  useEffect(() => {
    if (user?.selectedField) {
      const fieldName = fieldNames[user.selectedField];
      const welcomeMessage: Message = {
        role: 'assistant',
        content: `Welcome to the ${fieldName} consultation service! 

I'm your AI assistant, specialized in helping clients in the ${fieldName.toLowerCase()} industry. As a sales representative, you can use me to:

🎯 **Analyze client challenges** - I'll help identify pain points and opportunities
💡 **Generate solutions** - Get industry-specific recommendations and strategies  
📊 **Provide data insights** - Access relevant market data and benchmarks
🤝 **Craft proposals** - Help create compelling offers for your clients

How can I assist you with your client consultation today?`
      };
      setMessages([welcomeMessage]);
    }
  }, [user?.selectedField]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input.toLowerCase();
    setInput("");

    // Simulate AI response for salesman
    setTimeout(() => {
      let aiResponse = "";
      
      if (user?.selectedField) {
        const fieldName = fieldNames[user.selectedField];
        
        if (userInput.includes('client') || userInput.includes('customer')) {
          aiResponse = `Based on your ${fieldName.toLowerCase()} expertise, here's how I can help with your client:

🎯 **Client Analysis Framework:**
• Industry-specific pain point identification
• Competitive landscape assessment  
• ROI potential calculation
• Implementation timeline planning

💡 **Recommended Approach:**
• Start with discovery questions about their current challenges
• Present data-driven insights specific to ${fieldName.toLowerCase()}
• Offer tailored solutions with clear value propositions
• Provide case studies from similar businesses

📊 **Key Metrics to Discuss:**
• Industry benchmarks and performance indicators
• Expected ROI and payback periods
• Implementation costs and resource requirements

Would you like me to help you prepare specific questions or proposals for your client meeting?`;
        } else if (userInput.includes('proposal') || userInput.includes('offer')) {
          aiResponse = `I'll help you create a compelling proposal for your ${fieldName.toLowerCase()} client:

📋 **Proposal Structure:**
1. **Executive Summary** - Key challenges and proposed solutions
2. **Current State Analysis** - Pain points and missed opportunities  
3. **Recommended Solutions** - Specific strategies and tools
4. **Implementation Plan** - Timeline, milestones, and deliverables
5. **Investment & ROI** - Costs, expected returns, and success metrics

💼 **Value Proposition Elements:**
• Quantified benefits (cost savings, revenue increase, efficiency gains)
• Risk mitigation strategies
• Competitive advantages
• Success stories from similar clients

🎯 **Next Steps:**
• Schedule follow-up meetings
• Provide trial periods or pilot programs
• Establish clear success criteria

What specific aspect of the proposal would you like me to help you develop?`;
        } else if (userInput.includes('question') || userInput.includes('discovery')) {
          aiResponse = `Here are strategic discovery questions for your ${fieldName.toLowerCase()} client consultation:

🔍 **Current State Questions:**
• What are your biggest operational challenges right now?
• How do you currently measure success in your business?
• What processes take up most of your team's time?
• Where do you see the most waste or inefficiency?

📊 **Performance Questions:**
• What are your key performance indicators?
• How do you compare to industry benchmarks?
• What growth targets are you trying to achieve?
• What's preventing you from reaching your goals?

💰 **Financial Questions:**
• What's your current budget for improvements/solutions?
• What would a 20% improvement in [specific metric] be worth to you?
• How do you typically evaluate ROI on new investments?

🎯 **Decision-Making Questions:**
• Who else is involved in this decision?
• What's your timeline for implementing changes?
• What would need to happen for this to be considered a success?

Which area would you like me to help you explore further with your client?`;
        } else {
          aiResponse = `As your AI assistant for ${fieldName.toLowerCase()} consultations, I'm here to help you excel in client interactions.

🚀 **How I Can Support You:**
• **Client Analysis** - Help assess client needs and challenges
• **Solution Development** - Generate industry-specific recommendations
• **Proposal Creation** - Craft compelling offers and presentations
• **Objection Handling** - Prepare responses to common concerns
• **Market Intelligence** - Provide industry insights and benchmarks

💡 **Popular Requests:**
• "Help me prepare questions for a client discovery call"
• "Create a proposal for [specific client challenge]"
• "What are the latest trends in ${fieldName.toLowerCase()}?"
• "How should I position our solution against competitors?"

What specific aspect of your client consultation can I help you with today?`;
        }
      }

      const assistantMessage: Message = { role: 'assistant', content: aiResponse };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const startRecording = async () => {
    setIsRecording(true);
    // Voice recording implementation would go here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Stop recording and process speech
  };

  const selectedFieldIcon = user?.selectedField ? fieldIcons[user.selectedField] : null;
  const selectedFieldName = user?.selectedField ? fieldNames[user.selectedField] : '';

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#f8f9fa'
    }}>
      {/* Header */}
      <Paper sx={{ 
        p: 2, 
        borderRadius: 0,
        borderBottom: '1px solid #e0e0e0',
        background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => navigate('/salesman-dashboard')}
            sx={{ color: 'white' }}
          >
            <ArrowBack />
          </IconButton>
          <Box 
            component="img" 
            src={logo} 
            alt="reverssale" 
            sx={{ width: 32, height: 32 }} 
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              AI Consultation Assistant
            </Typography>
            {selectedFieldIcon && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                {React.createElement(selectedFieldIcon, { sx: { fontSize: 16 } })}
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {selectedFieldName}
                </Typography>
              </Box>
            )}
          </Box>
          <Chip 
            label="Salesman Mode"
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600
            }}
          />
        </Box>
      </Paper>

      {/* Messages */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              mb: 1
            }}
          >
            <Paper
              sx={{
                p: 2,
                maxWidth: '70%',
                bgcolor: message.role === 'user' ? '#7442BF' : 'white',
                color: message.role === 'user' ? 'white' : 'text.primary',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {message.content}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Input Area */}
      <Paper sx={{ 
        p: 2, 
        borderRadius: 0,
        borderTop: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          {showTextInput ? (
            <>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message to AI assistant..."
                variant="outlined"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={!input.trim()}
                sx={{
                  bgcolor: '#7442BF',
                  color: 'white',
                  '&:hover': { bgcolor: '#5e3399' },
                  '&:disabled': { bgcolor: '#ccc' }
                }}
              >
                <SendIcon />
              </IconButton>
              <IconButton
                onClick={() => setShowTextInput(false)}
                sx={{ color: '#7442BF' }}
              >
                <MicIcon />
              </IconButton>
            </>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              width: '100%',
              gap: 2
            }}>
              <Tooltip title="Switch to text input">
                <IconButton
                  onClick={() => setShowTextInput(true)}
                  sx={{
                    bgcolor: 'white',
                    border: '2px solid #7442BF',
                    color: '#7442BF',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                >
                  <KeyboardIcon />
                </IconButton>
              </Tooltip>
              
              <Fab
                color="primary"
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                sx={{
                  bgcolor: isRecording ? '#ff4444' : '#7442BF',
                  '&:hover': { 
                    bgcolor: isRecording ? '#cc3333' : '#5e3399' 
                  },
                  width: 64,
                  height: 64
                }}
              >
                {isRecording ? <MicOffIcon /> : <MicIcon />}
              </Fab>
              
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {isRecording ? 'Recording...' : 'Hold to speak'}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default SalesmanChatScreen; 