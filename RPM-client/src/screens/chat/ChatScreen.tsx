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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { 
  Send as SendIcon, 
  Mic as MicIcon, 
  MicOff as MicOffIcon, 
  Keyboard as KeyboardIcon,
  Add as AddIcon,
  Folder as FolderIcon,
  CameraAlt as CameraIcon,
  Photo as PhotoIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRequest } from '../../contexts/RequestContext';
import logo from '../../assests/img/logo.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatScreenProps {
  isAuthenticated?: boolean;
}

export default function ChatScreen({ isAuthenticated = false }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const navigate = useNavigate();
  const { createRequestFromText } = useRequest();
  
  // 处理聊天历史记录加载
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chat');
    
    if (chatId && isAuthenticated) {
      // 根据chatId加载对应的聊天记录
      loadChatHistory(chatId);
    } else if (!chatId && isAuthenticated) {
      // 如果是新聊天，清空消息
      setMessages([]);
    }
  }, [isAuthenticated]);

  const loadChatHistory = (chatId: string) => {
    // 模拟加载聊天历史记录
    const mockHistories: { [key: string]: Message[] } = {
      '1': [
        { role: 'user', content: 'I need help with my e-commerce business' },
        { role: 'assistant', content: 'Based on your e-commerce business, here\'s my comprehensive analysis:\n\n🎯 **Detailed Pain Point Analysis:**\n• Customer acquisition costs have increased by 38% year-over-year\n• Cart abandonment rate averaging 69.8% (industry benchmark: 70%)\n• Inventory management inefficiencies causing 15% stock-outs\n• Competition from Amazon and other platforms reducing margins by 12%' }
      ],
      '2': [
        { role: 'user', content: 'How can I improve my restaurant operations?' },
        { role: 'assistant', content: 'Comprehensive analysis for your food service business:\n\n🎯 **Industry-Specific Challenges:**\n• Staff turnover averaging 75% annually (industry standard: 70-80%)\n• Food waste representing 4-10% of total food purchases\n• Online ordering integration challenges affecting 30% of potential revenue' }
      ],
      '3': [
        { role: 'user', content: 'I\'m starting a tech company, what should I focus on?' },
        { role: 'assistant', content: 'For your tech business, here\'s my comprehensive analysis:\n\n🎯 **Detailed Pain Point Analysis:**\n• User acquisition and retention challenges\n• Product-market fit validation requirements\n• Scaling technical infrastructure efficiently\n• Competitive differentiation strategies' }
      ],
      '4': [
        { role: 'user', content: 'My husband is a doctor and always brings SOAP notes home to work on evenings. This is affecting our family time. Is there any solution?' },
        { role: 'assistant', content: '🏥 **Medical Practice Analysis - A Real Case Study:**\n\n**The Problem:** A doctor\'s wife recently shared with our platform: *"My husband always comes home late and brings his work of writing SOAP notes to home to work during evenings."*\n\n🎯 **Healthcare Industry Pain Points:**\n• Physicians spend 2-3 hours daily on documentation outside patient care\n• SOAP notes and medical records consume 35-40% of a doctor\'s time\n• Administrative burden leads to physician burnout (affecting 50% of doctors)\n• Work-life balance severely impacted by after-hours documentation\n\n💡 **Dasion\'s Solution - NuroScript Ambient Dictation Tool:**\n• **Auto-generates SOAP notes** during patient consultations\n• **Real-time transcription** and medical terminology recognition\n• **Structured documentation** that integrates with EMR systems\n• **Voice-activated workflow** - no typing required\n\n📊 **Expected Results with NuroScript:**\n• **60-70% reduction** in documentation time\n• **2-3 hours saved daily** - no more taking work home\n• **Improved work-life balance** for healthcare providers\n• **Enhanced patient interaction** (more eye contact, less screen time)\n• **Reduced physician burnout** and stress levels\n\n🎥 **Next Steps:**\nWe\'ll present a video demonstration of how NuroScript works and let you try it to see how it would solve this exact pain point. The tool learns medical terminology and can generate complete SOAP notes from natural conversation.\n\n**Ready to see how this could transform your practice and bring back your evenings?**' }
      ]
    };
    
    const history = mockHistories[chatId] || [];
    setMessages(history);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input.toLowerCase();
    const originalInput = input;
    setInput("");

    if (isAuthenticated) {
      // For authenticated users, create request summary and navigate to review page
      setIsCreatingRequest(true);
      
      try {
        const requestSummary = await createRequestFromText(originalInput);
        navigate(`/request-review/${requestSummary.id}`);
      } catch (error) {
        console.error('Error creating request:', error);
        setIsCreatingRequest(false);
        
        // Fallback to chat response if request creation fails
        setTimeout(() => {
          const aiResponse: Message = { 
            role: 'assistant', 
            content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment." 
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 1000);
      }
      return;
    }

    // For non-authenticated users, continue with existing chat flow
    setTimeout(() => {
      let aiResponse = "";
      
      if (userInput.includes('ecommerce') || userInput.includes('e-commerce') || userInput.includes('online store') || userInput.includes('selling online')) {
        aiResponse = `Based on your e-commerce business, I've identified several key pain points:

🎯 **Main Pain Points:**
• Customer acquisition costs are rising
• Cart abandonment rates (average 70%)
• Inventory management complexity
• Competition from larger platforms

💡 **Potential Clients I Can Connect You With:**
• **Sarah Chen** - Digital Marketing Specialist (can help reduce acquisition costs)
• **Mike Rodriguez** - UX/UI Designer (specializes in checkout optimization)
• **Lisa Wang** - Inventory Management Consultant
• **David Kim** - E-commerce Growth Strategist

🔐 **Want to connect with these professionals?**
Please **login** to access their contact information, portfolios, and schedule consultations. Our verified network of experts is ready to help you solve these challenges!

Would you like me to provide more specific advice about your e-commerce challenges?`;
      } else if (userInput.includes('restaurant') || userInput.includes('food') || userInput.includes('cafe') || userInput.includes('dining')) {
        aiResponse = `I see you're in the food service industry. Here are the common pain points I've identified:

🎯 **Main Pain Points:**
• Staff retention and training costs
• Food waste and inventory spoilage
• Online ordering and delivery management
• Customer review management

💡 **Potential Clients I Can Connect You With:**
• **Emma Thompson** - Restaurant Operations Consultant
• **Carlos Martinez** - Food Waste Reduction Specialist
• **Jennifer Liu** - Digital Ordering Systems Expert
• **Alex Johnson** - Staff Training and Retention Advisor

🔐 **Ready to get their contact details?**
**Login** to access their profiles, case studies, and book consultations. These professionals have helped similar businesses increase efficiency by 30-40%!

Which area would you like to focus on first?`;
      } else if (userInput.includes('medical') || userInput.includes('doctor') || userInput.includes('healthcare') || userInput.includes('clinic') || userInput.includes('soap') || userInput.includes('patient') || userInput.includes('physician') || userInput.includes('hospital')) {
        aiResponse = `🏥 **Healthcare Practice Analysis:**

I understand the challenges in medical practice! A doctor's wife recently told us: *"My husband always comes home late and brings his work of writing SOAP notes to home to work during evenings."*

🎯 **Common Healthcare Pain Points:**
• Excessive documentation time (2-3 hours daily)
• SOAP notes taking time away from family
• Administrative burden and physician burnout
• Work-life balance challenges

💡 **Potential Solutions I Can Connect You With:**
• **Dr. Sarah Mitchell** - Healthcare Workflow Optimization Specialist
• **TechMed Solutions** - Medical Documentation Automation
• **NuroScript Team** - Ambient Dictation Technology Experts
• **Dr. James Chen** - Physician Burnout Prevention Consultant

🔐 **Want to see how NuroScript can solve this exact problem?**
**Login** to access:
• Live demo of ambient dictation technology
• Case studies showing 60-70% documentation time reduction
• Direct contact with healthcare technology specialists
• Video testimonials from physicians who got their evenings back

**Ready to transform your practice and reclaim your personal time?**`;
      } else if (userInput.includes('tech') || userInput.includes('software') || userInput.includes('app') || userInput.includes('saas')) {
        aiResponse = `For your tech business, I've analyzed these critical pain points:

🎯 **Main Pain Points:**
• User acquisition and retention
• Product-market fit validation
• Scaling technical infrastructure
• Competitive differentiation

💡 **Potential Clients I Can Connect You With:**
• **Rachel Green** - Product-Market Fit Consultant
• **Tom Wilson** - DevOps and Scaling Expert
• **Nina Patel** - User Growth Strategist
• **James Brown** - Competitive Analysis Specialist

🔐 **Ready to connect with these experts?**
**Login** to access their contact information, case studies, and book consultations. These professionals have helped similar businesses scale efficiently!

What's your biggest challenge right now?`;
      } else {
        // Generic response for non-authenticated users
        aiResponse = `I can help you identify business challenges and connect you with the right professionals!

🎯 **Common Business Pain Points I Help With:**
• Operations inefficiency
• Customer acquisition challenges
• Technology implementation
• Staff management issues
• Financial optimization

💡 **How I Can Help:**
• Analyze your specific business situation
• Identify key pain points and opportunities
• Connect you with verified industry experts
• Provide implementation roadmaps

🔐 **Want personalized analysis and expert connections?**
**Please login** to access:
• Detailed business analysis
• Direct contact with specialists
• Custom solution recommendations
• Case studies and success stories

What specific business challenge would you like help with?`;
      }

      const aiMessage: Message = { role: 'assistant', content: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Here you would typically send the audio to a speech-to-text service
        // For now, we'll simulate the process with a business-focused summary
        setTimeout(() => {
          const businessSummaries = [
            "I need help improving my restaurant's customer retention and reducing food waste.",
            "My e-commerce business is struggling with high cart abandonment rates and customer acquisition costs.",
            "I'm looking for solutions to streamline my healthcare practice's documentation workflow.",
            "My tech startup needs guidance on scaling our infrastructure and finding product-market fit.",
            "I want to optimize my retail store's inventory management and increase online sales.",
            "My consulting business needs better client management and marketing strategies."
          ];
          
          // Randomly select a business summary to simulate speech-to-text + AI summarization
          const randomSummary = businessSummaries[Math.floor(Math.random() * businessSummaries.length)];
          setInput(randomSummary);
          setIsRecording(false);
        }, 2000);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Store the stop function globally so it can be called from the stop button
      window.stopRecording = () => {
        mediaRecorder.stop();
        setIsRecording(false);
      };
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (window.stopRecording) {
      window.stopRecording();
    }
  };

  // Menu handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Action handlers
  const handleFileUpload = () => {
    handleMenuClose();
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '*/*';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        console.log('Files selected:', files);
        // Handle file upload logic here
        // You can process the files and add them to the chat
      }
    };
    input.click();
  };

  const handleCameraCapture = async () => {
    handleMenuClose();
    try {
      // Check if camera is supported
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Create a video element to show camera preview
        // This is a basic implementation - you might want to create a proper camera modal
        console.log('Camera access granted');
        // Stop the stream for now
        stream.getTracks().forEach(track => track.stop());
        // You can implement a proper camera capture modal here
      } else {
        alert('Camera not supported on this device');
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access denied');
    }
  };

  const handlePhotoSelect = () => {
    handleMenuClose();
    // Create a file input for images only
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        console.log('Photos selected:', files);
        // Handle photo selection logic here
        // You can process the images and add them to the chat
      }
    };
    input.click();
  };

  // Landing Page for Unauthenticated Users
  if (!isAuthenticated) {
    return (
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100vh',
        width: '100vw',
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#ffffff',
        zIndex: 9999,
        overflow: 'hidden'
      }}>
        {/* Top Navigation Bar */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 4,
          py: 2,
          borderBottom: '1px solid #f0f0f0',
          bgcolor: '#ffffff',
          position: 'relative',
          zIndex: 10000
        }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              component="img" 
              src={logo} 
              alt="ReverSale" 
              sx={{ 
                width: 120, 
                height: 'auto',
                maxHeight: 40
              }} 
            />
          </Box>

          {/* Auth Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                bgcolor: '#7442BF',
                color: 'white',
                borderRadius: '25px',
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#5e3399'
                }
              }}
            >
              Log in
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/signup')}
              sx={{
                borderColor: '#7442BF',
                color: '#7442BF',
                borderRadius: '25px',
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#5e3399',
                  bgcolor: 'rgba(116, 66, 191, 0.05)'
                }
              }}
            >
              Sign up
            </Button>
          </Box>
        </Box>

        {/* Main Landing Content */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          py: 6,
          bgcolor: '#ffffff',
          position: 'relative'
        }}>
          {/* Microphone Button */}
          <Box sx={{ mb: 4 }}>
            <Fab
              onClick={isRecording ? stopRecording : startRecording}
              sx={{
                width: 120,
                height: 120,
                bgcolor: isRecording ? '#ff4757' : '#7442BF',
                color: 'white',
                boxShadow: isRecording 
                  ? '0 8px 32px rgba(255, 71, 87, 0.4)'
                  : '0 8px 32px rgba(116, 66, 191, 0.4)',
                '&:hover': {
                  bgcolor: isRecording ? '#ff3838' : '#5e3399',
                  transform: 'scale(1.05)',
                  boxShadow: isRecording 
                    ? '0 12px 40px rgba(255, 71, 87, 0.5)'
                    : '0 12px 40px rgba(116, 66, 191, 0.5)',
                },
                transition: 'all 0.3s ease',
                animation: isRecording ? 'pulse 1.5s ease-in-out infinite' : 'none',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    boxShadow: '0 8px 32px rgba(255, 71, 87, 0.4)',
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 32px rgba(255, 71, 87, 0.4), 0 0 0 20px rgba(255, 71, 87, 0)',
                  },
                  '100%': {
                    transform: 'scale(1)',
                    boxShadow: '0 8px 32px rgba(255, 71, 87, 0.4)',
                  }
                }
              }}
            >
              {isRecording ? (
                <MicOffIcon sx={{ fontSize: 48 }} />
              ) : (
                <MicIcon sx={{ fontSize: 48 }} />
              )}
            </Fab>
          </Box>

          {/* Main Headline */}
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              color: '#000',
              textAlign: 'center',
              mb: 3,
              fontSize: { xs: '2rem', md: '2rem' },
              fontFamily: 'Inter, sans-serif'
            }}
          >
            What's the pinpoint in your business operations today?
          </Typography>

          {/* Placeholder Input */}
          <Box sx={{
            width: '100%',
            maxWidth: '600px',
            bgcolor: 'white',
            borderRadius: '25px',
            border: '1px solid #e9ecef',
            px: 3,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            position: 'relative',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            '&:hover': {
              boxShadow: '0 6px 25px rgba(116, 66, 191, 0.15)',
              borderColor: 'rgba(116, 66, 191, 0.2)'
            },
            '&:focus-within': {
              boxShadow: '0 6px 25px rgba(116, 66, 191, 0.2)',
              borderColor: '#7442BF'
            }
          }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tap the mic or text your need here. I will summarize it for you."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              multiline
              maxRows={4}
              sx={{
                '& .MuiOutlinedInput-root': {
                  border: 'none',
                  fontSize: '1rem',
                  '& fieldset': {
                    border: 'none'
                  },
                  '&:hover fieldset': {
                    border: 'none'
                  },
                  '&.Mui-focused fieldset': {
                    border: 'none'
                  }
                }
              }}
            />
            <IconButton 
              onClick={handleMenuOpen}
              sx={{ 
                color: '#6c757d',
                fontSize: '1.2rem',
                '&:hover': {
                  bgcolor: 'rgba(116, 66, 191, 0.1)',
                  color: '#7442BF'
                }
              }}
            >
              <AddIcon />
            </IconButton>
            <IconButton 
              onClick={handleSend}
              disabled={!input.trim() || isCreatingRequest}
              sx={{ 
                bgcolor: '#7442BF',
                color: 'white',
                '&:hover': { 
                  bgcolor: '#5e3399',
                  transform: 'scale(1.05)'
                },
                '&:disabled': {
                  bgcolor: '#ccc',
                  color: '#999'
                },
                width: 40,
                height: 40,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              {isCreatingRequest ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                <SendIcon sx={{ fontSize: 20 }} />
              )}
            </IconButton>

            {/* Action Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #e9ecef',
                  mt: 1,
                  zIndex: 99999,
                  minWidth: 200
                }
              }}
              MenuListProps={{
                sx: {
                  py: 1
                }
              }}
              sx={{
                zIndex: 99999
              }}
            >
              <MenuItem onClick={handleFileUpload} sx={{ py: 1.5, px: 2 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <FolderIcon sx={{ color: '#7442BF', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Files" 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: '0.95rem',
                      fontWeight: 500 
                    } 
                  }} 
                />
              </MenuItem>
              
              <MenuItem onClick={handleCameraCapture} sx={{ py: 1.5, px: 2 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CameraIcon sx={{ color: '#7442BF', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Camera" 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: '0.95rem',
                      fontWeight: 500 
                    } 
                  }} 
                />
              </MenuItem>
              
              <MenuItem onClick={handlePhotoSelect} sx={{ py: 1.5, px: 2 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <PhotoIcon sx={{ color: '#7442BF', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Photos" 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: '0.95rem',
                      fontWeight: 500 
                    } 
                  }} 
                />
              </MenuItem>
            </Menu>
          </Box>

          {/* Chat Messages for Landing Page */}
          {messages.length > 0 && (
            <Container 
              maxWidth={false}
              sx={{ 
                mt: 4,
                width: '100%',
                px: 0,
              }}
            >
              <Box sx={{ 
                overflow: 'auto', 
                px: 1
              }}>
                {messages.map((message, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 3,
                      mb: 3,
                      maxWidth: '75%',
                      ml: message.role === 'user' ? 'auto' : 0,
                      bgcolor: message.role === 'user' ? '#7442BF' : 'white',
                      color: message.role === 'user' ? 'white' : '#495057',
                      borderRadius: 3,
                      boxShadow: message.role === 'user' 
                        ? '0 4px 15px rgba(116, 66, 191, 0.3)' 
                        : '0 4px 15px rgba(0,0,0,0.1)',
                      border: message.role === 'user' ? 'none' : '1px solid #e9ecef'
                    }}
                  >
                    <Typography sx={{ fontSize: '1rem', lineHeight: 1.5 }}>
                      {message.content}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Container>
          )}
        </Box>
      </Box>
    );
  }

  // Authenticated Chat Interface (existing implementation)
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8f9fa' }}>
      {/* Main Content */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        py: 6,
        bgcolor: '#ffffff',
        position: 'relative'
      }}>
        {/* Microphone Button */}
        <Box sx={{ mb: 4 }}>
          <Fab
            onClick={isRecording ? stopRecording : startRecording}
            sx={{
              width: 120,
              height: 120,
              bgcolor: isRecording ? '#ff4757' : '#7442BF',
              color: 'white',
              boxShadow: isRecording 
                ? '0 8px 32px rgba(255, 71, 87, 0.4)'
                : '0 8px 32px rgba(116, 66, 191, 0.4)',
              '&:hover': {
                bgcolor: isRecording ? '#ff3838' : '#5e3399',
                transform: 'scale(1.05)',
                boxShadow: isRecording 
                  ? '0 12px 40px rgba(255, 71, 87, 0.5)'
                  : '0 12px 40px rgba(116, 66, 191, 0.5)',
              },
              transition: 'all 0.3s ease',
              animation: isRecording ? 'pulse 1.5s ease-in-out infinite' : 'none',
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                  boxShadow: '0 8px 32px rgba(255, 71, 87, 0.4)',
                },
                '50%': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 32px rgba(255, 71, 87, 0.4), 0 0 0 20px rgba(255, 71, 87, 0)',
                },
                '100%': {
                  transform: 'scale(1)',
                  boxShadow: '0 8px 32px rgba(255, 71, 87, 0.4)',
                }
              }
            }}
          >
            {isRecording ? (
              <MicOffIcon sx={{ fontSize: 48 }} />
            ) : (
              <MicIcon sx={{ fontSize: 48 }} />
            )}
          </Fab>
        </Box>

        {/* Main Headline */}
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            color: '#000',
            textAlign: 'center',
            mb: 3,
            fontSize: { xs: '2rem', md: '2rem' },
            fontFamily: 'Inter, sans-serif'
          }}
        >
          What's the pinpoint in your business operations today?
        </Typography>

        {/* Input Field */}
        <Box sx={{
          width: '100%',
          maxWidth: '600px',
          bgcolor: 'white',
          borderRadius: '25px',
          border: '1px solid #e9ecef',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          position: 'relative',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0 6px 25px rgba(116, 66, 191, 0.15)',
            borderColor: 'rgba(116, 66, 191, 0.2)'
          },
          '&:focus-within': {
            boxShadow: '0 6px 25px rgba(116, 66, 191, 0.2)',
            borderColor: '#7442BF'
          }
        }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tap the mic or text your need here. I will summarize it for you."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                border: 'none',
                fontSize: '1rem',
                '& fieldset': {
                  border: 'none'
                },
                '&:hover fieldset': {
                  border: 'none'
                },
                '&.Mui-focused fieldset': {
                  border: 'none'
                }
              }
            }}
          />
          <IconButton 
            onClick={handleMenuOpen}
            sx={{ 
              color: '#6c757d',
              fontSize: '1.2rem',
              '&:hover': {
                bgcolor: 'rgba(116, 66, 191, 0.1)',
                color: '#7442BF'
              }
            }}
          >
            <AddIcon />
          </IconButton>
          <IconButton 
            onClick={handleSend}
            disabled={!input.trim() || isCreatingRequest}
            sx={{ 
              bgcolor: '#7442BF',
              color: 'white',
              '&:hover': { 
                bgcolor: '#5e3399',
                transform: 'scale(1.05)'
              },
              '&:disabled': {
                bgcolor: '#ccc',
                color: '#999'
              },
              width: 40,
              height: 40,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease'
            }}
          >
            {isCreatingRequest ? (
              <CircularProgress size={20} sx={{ color: 'white' }} />
            ) : (
              <SendIcon sx={{ fontSize: 20 }} />
            )}
          </IconButton>

          {/* Action Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                border: '1px solid #e9ecef',
                mt: 1,
                zIndex: 99999,
                minWidth: 200
              }
            }}
            MenuListProps={{
              sx: {
                py: 1
              }
            }}
            sx={{
              zIndex: 99999
            }}
          >
            <MenuItem onClick={handleFileUpload} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <FolderIcon sx={{ color: '#7442BF', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText 
                primary="Files" 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontSize: '0.95rem',
                    fontWeight: 500 
                  } 
                }} 
              />
            </MenuItem>
            
            <MenuItem onClick={handleCameraCapture} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CameraIcon sx={{ color: '#7442BF', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText 
                primary="Camera" 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontSize: '0.95rem',
                    fontWeight: 500 
                  } 
                }} 
              />
            </MenuItem>
            
            <MenuItem onClick={handlePhotoSelect} sx={{ py: 1.5, px: 2 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PhotoIcon sx={{ color: '#7442BF', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText 
                primary="Photos" 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontSize: '0.95rem',
                    fontWeight: 500 
                  } 
                }} 
              />
            </MenuItem>
          </Menu>
        </Box>

        {/* Chat Messages for Authenticated Users */}
        {messages.length > 0 && (
          <Container 
            maxWidth={false}
            sx={{ 
              mt: 4,
              width: '100%',
              px: 0,
            }}
          >
            <Box sx={{ 
              overflow: 'auto', 
              px: 1
            }}>
              {messages.map((message, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 3,
                    mb: 3,
                    maxWidth: '75%',
                    ml: message.role === 'user' ? 'auto' : 0,
                    bgcolor: message.role === 'user' ? '#7442BF' : 'white',
                    color: message.role === 'user' ? 'white' : '#495057',
                    borderRadius: 3,
                    boxShadow: message.role === 'user' 
                      ? '0 4px 15px rgba(116, 66, 191, 0.3)' 
                      : '0 4px 15px rgba(0,0,0,0.1)',
                    border: message.role === 'user' ? 'none' : '1px solid #e9ecef'
                  }}
                >
                  <Typography sx={{ fontSize: '1rem', lineHeight: 1.5 }}>
                    {message.content}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Container>
        )}
      </Box>
    </Box>
  );
}

// Add global type declaration
declare global {
  interface Window {
    stopRecording: () => void;
  }
} 