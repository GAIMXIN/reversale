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
} from "@mui/material";
import { Send as SendIcon, Mic as MicIcon, MicOff as MicOffIcon, Keyboard as KeyboardIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  
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
    setInput("");

    // Simulate AI analysis and response
    setTimeout(() => {
      let aiResponse = "";
      
      if (isAuthenticated) {
        // Authenticated users get unrestricted AI responses
        if (userInput.includes('ecommerce') || userInput.includes('e-commerce') || userInput.includes('online store') || userInput.includes('selling online')) {
          aiResponse = `Based on your e-commerce business, here's my comprehensive analysis:

🎯 **Detailed Pain Point Analysis:**
• Customer acquisition costs have increased by 38% year-over-year
• Cart abandonment rate averaging 69.8% (industry benchmark: 70%)
• Inventory management inefficiencies causing 15% stock-outs
• Competition from Amazon and other platforms reducing margins by 12%

💡 **Strategic Recommendations:**
• Implement abandoned cart recovery sequences (can recover 15-25% of lost sales)
• Optimize product pages for conversion (A/B testing can improve by 20-30%)
• Implement dynamic pricing strategies
• Focus on customer lifetime value optimization

📊 **Expected Results:**
• 25-40% increase in conversion rates
• 30-50% reduction in customer acquisition costs
• 20-35% improvement in inventory turnover

🔗 **Professional Network Access:**
I can connect you with verified specialists who have achieved these results for similar businesses. Would you like me to recommend specific experts based on your current priorities?`;
        } else if (userInput.includes('restaurant') || userInput.includes('food') || userInput.includes('cafe') || userInput.includes('dining')) {
          aiResponse = `Comprehensive analysis for your food service business:

🎯 **Industry-Specific Challenges:**
• Staff turnover averaging 75% annually (industry standard: 70-80%)
• Food waste representing 4-10% of total food purchases
• Online ordering integration challenges affecting 30% of potential revenue
• Review management across 15+ platforms

💡 **Optimization Strategies:**
• Implement staff retention programs (can reduce turnover by 25-40%)
• Deploy inventory management systems to reduce waste by 20-30%
• Integrate unified online ordering platform
• Automate review response and reputation management

📊 **Projected Improvements:**
• 15-25% reduction in labor costs
• 20-30% decrease in food waste
• 25-40% increase in online orders
• 15-20% improvement in customer satisfaction scores

🚀 **Next Steps:**
I can provide detailed implementation roadmaps and connect you with specialists who have successfully executed these strategies. What's your primary focus area?`;
        } else if (userInput.includes('medical') || userInput.includes('doctor') || userInput.includes('healthcare') || userInput.includes('clinic') || userInput.includes('soap') || userInput.includes('patient') || userInput.includes('physician') || userInput.includes('hospital') || userInput.includes('wife') || userInput.includes('husband') || userInput.includes('notes') || userInput.includes('documentation') || userInput.includes('evening') || userInput.includes('home late') || userInput.includes('work from home') || userInput.includes('family time')) {
          aiResponse = `🏥 **Healthcare Practice Analysis - Real Case Study:**

I understand the challenges in medical practice! A doctor's wife recently told us: *"My husband always comes home late and brings his work of writing SOAP notes to home to work during evenings."*

🎯 **Common Healthcare Pain Points:**
• Excessive documentation time (2-3 hours daily)
• SOAP notes taking time away from family
• Administrative burden and physician burnout
• Work-life balance challenges

💡 **Preview of Our Solution - NuroScript:**
• Ambient dictation technology that auto-generates SOAP notes
• Real-time transcription during patient consultations
• 60-70% reduction in documentation time
• Physicians get their evenings back with family

💡 **Potential Solutions I Can Connect You With:**
• **Dr. Sarah Mitchell** - Healthcare Workflow Optimization Specialist
• **TechMed Solutions** - Medical Documentation Automation
• **NuroScript Team** - Ambient Dictation Technology Experts
• **Dr. James Chen** - Physician Burnout Prevention Consultant

🔐 **Want to see the FULL NuroScript demo and solve this exact problem?**
**👉 PLEASE LOGIN** to access:
• Live interactive demo of ambient dictation technology
• Complete case studies showing 60-70% documentation time reduction
• Direct contact with healthcare technology specialists
• Video testimonials from physicians who got their evenings back
• Free trial of NuroScript for your practice

**🚀 Ready to transform your practice and reclaim your personal time? LOGIN NOW to get started!**`;
        } else {
          // Generic helpful response for authenticated users
          aiResponse = `I'm here to provide comprehensive business analysis and solutions without any restrictions!

🎯 **What I Can Help You With:**
• Detailed industry analysis and benchmarking
• Strategic recommendations with projected ROI
• Implementation roadmaps and timelines
• Direct connections to verified professionals
• Case studies and success stories
• Custom solutions for your specific challenges

💡 **How to Get Started:**
Simply describe your business situation, challenges, or goals, and I'll provide:
• In-depth analysis with data-driven insights
• Specific, actionable recommendations
• Expected outcomes and timelines
• Professional network connections when relevant

🚀 **No Limitations:**
As an authenticated user, you have full access to all features and detailed insights. What would you like to explore first?`;
        }
      } else {
        // Non-authenticated users get limited responses with login prompts
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
          aiResponse = `I can help you analyze your business challenges and connect you with the right professionals!

🎯 **What I Can Help You With:**
• Business pain point analysis
• Industry-specific insights
• Professional network connections
• Growth strategy recommendations

💡 **How It Works:**
1. Tell me about your business or industry
2. I'll analyze your main challenges
3. I'll suggest relevant professionals who can help
4. Login to connect with them directly

🔐 **Ready to get started?**
Simply describe your business situation, and I'll provide targeted insights and professional connections. For full access to contact details and detailed consultations, please login.

What industry or business challenge would you like to discuss?`;
        }
      }

      const assistantMessage: Message = { role: 'assistant', content: aiResponse };
      setMessages(prev => [...prev, assistantMessage]);
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
        // For now, we'll simulate the process
        setTimeout(() => {
          setInput("This is a simulated voice input. In a real implementation, this would be the transcribed text from your speech.");
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
        position: 'relative'
      }}>
        {/* Logo and Brand */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4
        }}>
          <Box 
            component="img" 
            src={logo} 
            alt="reverssale" 
            sx={{ 
              width: 72, 
              height: 72, 
              mb: 3,
              filter: 'drop-shadow(0px 4px 8px rgba(116, 66, 191, 0.2))'
            }} 
          />
          <Typography
            variant="h2"
            component="div"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 50%, #E91E63 100%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px',
              textAlign: 'center',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              '& .special-s': {
                background: 'linear-gradient(45deg, #FFD700 0%, #FFA500 30%, #FF6B6B 60%, #7442BF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                fontWeight: 800,
                fontSize: '1.1em',
                animation: 'shimmer 2s ease-in-out infinite alternate',
                filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))',
                transform: 'scale(1.05)',
                '@keyframes shimmer': {
                  '0%': {
                    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.4)) brightness(1)',
                  },
                  '100%': {
                    filter: 'drop-shadow(0 0 12px rgba(255, 107, 107, 0.6)) brightness(1.2)',
                  }
                }
              }
            }}
          >
            Rever<span className="special-s">S</span><span className="special-s">S</span>ale
          </Typography>
        </Box>

        {/* Main Voice Button - Prominent Center Position */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4
        }}>
          <Fab
            onClick={isRecording ? stopRecording : startRecording}
            sx={{
              width: 120,
              height: 120,
              bgcolor: isRecording ? '#ff4757' : '#7442BF',
              color: 'white',
              boxShadow: isRecording 
                ? '0 8px 32px rgba(255, 71, 87, 0.4), 0 0 0 0 rgba(255, 71, 87, 0.7)'
                : '0 8px 32px rgba(116, 66, 191, 0.4), 0 0 0 0 rgba(116, 66, 191, 0.7)',
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
                  boxShadow: '0 8px 32px rgba(255, 71, 87, 0.4), 0 0 0 0 rgba(255, 71, 87, 0.7)',
                },
                '50%': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 32px rgba(255, 71, 87, 0.4), 0 0 0 20px rgba(255, 71, 87, 0)',
                },
                '100%': {
                  transform: 'scale(1)',
                  boxShadow: '0 8px 32px rgba(255, 71, 87, 0.4), 0 0 0 0 rgba(255, 71, 87, 0)',
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
          
          {/* Voice Button Instructions */}
          <Typography 
            sx={{ 
              mt: 3,
              color: isRecording ? '#ff4757' : '#7442BF',
              fontSize: '1.2rem',
              fontWeight: 600,
              textAlign: 'center',
              animation: isRecording ? 'fadeInOut 2s ease-in-out infinite' : 'none',
              '@keyframes fadeInOut': {
                '0%, 100%': { opacity: 0.7 },
                '50%': { opacity: 1 }
              }
            }}
          >
            {isRecording ? 'Recording... Click to stop' : '🎤 Click to start voice conversation'}
          </Typography>
          
          <Typography 
            sx={{ 
              mt: 1,
              color: '#6c757d',
              fontSize: '0.95rem',
              textAlign: 'center',
              maxWidth: '400px'
            }}
          >
            {isRecording 
              ? 'Describe your business challenges or industry, and I\'ll analyze and recommend professionals'
              : 'Describe your business or industry, and I\'ll analyze your pain points and match you with the right professionals'
            }
          </Typography>
        </Box>

        {/* Alternative Text Input Toggle */}
        <Button
          startIcon={<KeyboardIcon />}
          onClick={() => setShowTextInput(!showTextInput)}
          sx={{
            color: '#6c757d',
            textTransform: 'none',
            fontSize: '0.9rem',
            mb: 3,
            '&:hover': {
              bgcolor: 'rgba(116, 66, 191, 0.05)',
              color: '#7442BF'
            }
          }}
        >
          {showTextInput ? 'Hide text input' : 'Use text input'}
        </Button>

        {/* Text Input Section - Only show when toggled */}
        {showTextInput && (
          <Container maxWidth="sm" sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              p: 2,
              bgcolor: 'white',
              borderRadius: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e9ecef',
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
                placeholder="Type your message..."
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
                onClick={handleSend}
                sx={{ 
                  bgcolor: '#7442BF',
                  color: 'white',
                  '&:hover': { 
                    bgcolor: '#5e3399',
                    transform: 'scale(1.05)'
                  },
                  width: 44,
                  height: 44,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease'
                }}
              >
                <SendIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Box>
          </Container>
        )}

        {/* Chat Section */}
        {messages.length > 0 && (
          <Container maxWidth="md" sx={{ 
            flex: 1,
            display: 'flex', 
            flexDirection: 'column', 
            py: 4,
            mt: 2,
            width: '100%'
          }}>
            <Box sx={{ 
              flex: 1, 
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