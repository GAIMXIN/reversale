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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
  CardContent,
  Chip,
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
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRequest } from '../../contexts/RequestContext';
import logo from '../../assests/img/logo.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  draft?: {
    title: string;
    content: string;
    budget: string;
    timeline: string;
  };
  product?: {
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
  };
}

interface ChatScreenProps {
  isAuthenticated?: boolean;
}

// Simple Product Card Component for non-authenticated users
const ProductCard = ({ product, onContactSales, onViewDetails }: { 
  product: any, 
  onContactSales: () => void, 
  onViewDetails: () => void 
}) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'e-commerce': return '#e91e63';
      case 'crm': return '#2196f3';
      case 'restaurant': return '#ff9800';
      case 'medical': return '#4caf50';
      default: return '#7442BF';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Typography
        key={index}
        component="span"
        sx={{
          fontSize: 16,
          color: index < Math.floor(rating) ? '#ffc107' : '#e0e0e0'
        }}
      >
        ★
      </Typography>
    ));
  };

  return (
    <Card sx={{ 
      maxWidth: 400,
      mx: 'auto',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(116, 66, 191, 0.15)',
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            color: '#333',
            mb: 1
          }}>
            {product.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip
              label={product.category}
              size="small"
              sx={{
                bgcolor: getCategoryColor(product.category),
                color: 'white',
                fontSize: '0.75rem'
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {renderStars(product.rating)}
              <Typography variant="caption" sx={{ color: '#666', ml: 0.5 }}>
                ({product.rating})
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ 
          color: '#666',
          mb: 3,
          lineHeight: 1.5
        }}>
          {product.description}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: '#7442BF', fontWeight: 600, mb: 1, display: 'block' }}>
            Key Features:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {product.features.slice(0, 3).map((feature: string, index: number) => (
              <Chip
                key={index}
                label={feature}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.7rem',
                  height: '24px',
                  borderColor: '#7442BF',
                  color: '#7442BF'
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1.5, 
          mb: 3,
          p: 2,
          bgcolor: 'rgba(116, 66, 191, 0.03)',
          borderRadius: 2
        }}>
          <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
            <span style={{ color: '#7442BF', fontWeight: 600 }}>{product.price}</span>
          </Typography>
          <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
            Timeline: <span style={{ color: '#7442BF', fontWeight: 600 }}>{product.timeline}</span>
          </Typography>
          <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
            By {product.company}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Button
            variant="contained"
            onClick={onContactSales}
            sx={{
              bgcolor: '#7442BF',
              '&:hover': { bgcolor: '#5e3399' },
              fontWeight: 600
            }}
          >
            Contact Sales
          </Button>
          
          <Button
            variant="outlined"
            onClick={onViewDetails}
            sx={{
              borderColor: '#7442BF',
              color: '#7442BF',
              '&:hover': {
                borderColor: '#5e3399',
                bgcolor: 'rgba(116, 66, 191, 0.05)'
              }
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function ChatScreen({ isAuthenticated = false }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isCreatingRequest, setIsCreatingRequest] = useState(false);
  const [editingDraft, setEditingDraft] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
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

  // 判断用户输入是否表达产品需求
  const isProductRequest = (userInput: string): boolean => {
    const lowerInput = userInput.toLowerCase();
    
    // 产品需求关键词
    const productKeywords = [
      'i want a platform', 'i want a system', 'i need a platform', 'i need a system',
      'build a platform', 'create a platform', 'develop a system', 'make a system',
      'looking for a solution', 'searching for a tool', 'need a tool', 'want a solution',
      'recommend a platform', 'suggest a system', 'find me a', 'show me platforms',
      'what platform', 'which system', 'best platform', 'good system',
      'platform for', 'system for', 'software for', 'tool for'
    ];
    
    return productKeywords.some(keyword => lowerInput.includes(keyword));
  };

  const generateDraft = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('ecommerce') || lowerInput.includes('e-commerce') || lowerInput.includes('online store') || lowerInput.includes('selling online')) {
      return {
        title: "E-commerce Business Optimization Project",
        content: `**Business Challenge:**
${userInput}

**Identified Pain Points:**
• High customer acquisition costs reducing profitability
• Cart abandonment rates above industry average (70%+)
• Inventory management inefficiencies causing stock-outs
• Mobile conversion rates significantly lower than desktop
• Competition from major platforms affecting margins

**Proposed Solutions:**
• Implement advanced cart recovery system with personalized emails
• Optimize mobile checkout process and page load speeds
• Set up intelligent inventory management with automated reordering
• Develop targeted customer acquisition campaigns with lower CPM
• Create competitive analysis and pricing strategy optimization

**Expected Outcomes:**
• 25-40% reduction in cart abandonment rates
• 30-50% improvement in customer acquisition efficiency
• 20-35% increase in overall conversion rates
• Streamlined inventory management reducing stock-outs by 80%

**Implementation Approach:**
1. Conduct comprehensive website audit and performance analysis
2. Implement technical optimizations for mobile experience
3. Set up advanced analytics and conversion tracking
4. Deploy cart recovery and email marketing automation
5. Optimize inventory management systems and processes`,
        budget: "$15,000 - $25,000",
        timeline: "6-8 weeks"
      };
    } else if (lowerInput.includes('restaurant') || lowerInput.includes('food') || lowerInput.includes('cafe') || lowerInput.includes('dining')) {
      return {
        title: "Restaurant Operations Optimization Project",
        content: `**Business Challenge:**
${userInput}

**Identified Pain Points:**
• High staff turnover rates affecting service quality
• Food waste and inventory management inefficiencies
• Limited online ordering and delivery capabilities
• Inconsistent customer experience and satisfaction
• Difficulty managing peak hour operations

**Proposed Solutions:**
• Implement comprehensive staff training and retention program
• Deploy smart inventory management system with waste tracking
• Set up integrated online ordering and delivery platform
• Create standardized service protocols and quality systems
• Optimize kitchen workflow and order management processes

**Expected Outcomes:**
• 40-60% reduction in staff turnover rates
• 25-35% decrease in food waste and inventory costs
• 30-50% increase in online order volume
• Improved customer satisfaction scores by 20-30%
• Enhanced operational efficiency during peak hours

**Implementation Approach:**
1. Assess current operations and identify optimization opportunities
2. Implement staff training programs and retention strategies
3. Deploy technology solutions for inventory and order management
4. Establish quality control and customer service standards
5. Monitor performance and continuously optimize processes`,
        budget: "$12,000 - $20,000",
        timeline: "4-6 weeks"
      };
    } else if (lowerInput.includes('medical') || lowerInput.includes('doctor') || lowerInput.includes('healthcare') || lowerInput.includes('clinic') || lowerInput.includes('soap') || lowerInput.includes('patient') || lowerInput.includes('physician') || lowerInput.includes('hospital')) {
      return {
        title: "Medical Practice Digital Transformation Project",
        content: `**Business Challenge:**
${userInput}

**Identified Pain Points:**
• Excessive time spent on documentation outside patient care
• Administrative burden leading to physician burnout
• Work-life balance severely impacted by evening documentation
• EHR systems reducing face-to-face patient interaction time
• Inefficient workflow processes affecting productivity

**Proposed Solutions:**
• Deploy NuroScript ambient dictation technology for automatic SOAP note generation
• Implement streamlined EHR integration and workflow optimization
• Set up voice-activated documentation system requiring no manual typing
• Create efficient patient data management and retrieval systems
• Establish automated billing and administrative process workflows

**Expected Outcomes:**
• 60-70% reduction in documentation time
• 2-3 hours saved daily - eliminate taking work home
• Improved work-life balance for healthcare providers
• Enhanced patient interaction with more eye contact and engagement
• Reduced physician burnout and stress levels

**Implementation Approach:**
1. Assess current documentation workflow and time allocation
2. Install and configure NuroScript ambient dictation system
3. Integrate with existing EHR systems and train staff
4. Implement workflow optimization and process improvements
5. Monitor performance and continuously refine the system`,
        budget: "$20,000 - $35,000",
        timeline: "3-4 weeks"
      };
    } else {
      return {
        title: "Business Operations Optimization Project",
        content: `**Business Challenge:**
${userInput}

**Identified Pain Points:**
• Operational inefficiencies affecting productivity and profitability
• Manual processes that could be automated for better efficiency
• Lack of integrated systems for streamlined operations
• Customer service and satisfaction improvement opportunities
• Growth planning and strategic development needs

**Proposed Solutions:**
• Conduct comprehensive business process analysis and optimization
• Implement automation tools for repetitive tasks and workflows
• Integrate systems for better data flow and decision making
• Develop customer service enhancement strategies
• Create growth planning and strategic development roadmap

**Expected Outcomes:**
• 30-50% improvement in operational efficiency
• Significant time savings through process automation
• Better decision making through integrated data systems
• Enhanced customer satisfaction and retention
• Clear roadmap for sustainable business growth

**Implementation Approach:**
1. Analyze current business processes and identify optimization opportunities
2. Implement automation tools and integrated systems
3. Train staff on new processes and technologies
4. Establish performance monitoring and continuous improvement
5. Develop long-term strategic growth plan`,
        budget: "$10,000 - $18,000",
        timeline: "4-6 weeks"
      };
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input.toLowerCase();
    const originalInput = input;
    setInput("");

    // 检查是否为产品需求，如果是则跳转到产品推荐页面
    if (isProductRequest(originalInput)) {
      // 对于未登录用户，直接显示产品推荐卡片
      if (!isAuthenticated) {
        setTimeout(() => {
          const aiResponse = `I found a great platform solution for you. Here's a recommendation based on your request: "${originalInput}"`;

          const aiMessage: Message = { 
            role: 'assistant', 
            content: aiResponse,
            product: {
              id: '1',
              name: 'E-commerce Platform Pro',
              description: 'Complete e-commerce solution with advanced features including inventory management, payment processing, and analytics dashboard.',
              category: 'E-commerce',
              price: '$15,000 - $25,000',
              timeline: '8-12 weeks',
              rating: 4.8,
              url: 'https://demo.ecommerce-pro.com',
              features: ['Payment Integration', 'Inventory Management', 'Analytics', 'Mobile Responsive'],
              company: 'TechSolutions Inc.',
            }
          };
          
          setMessages(prev => [...prev, aiMessage]);
        }, 1000);
        return;
      }

      // 对于已登录用户，显示AI响应并跳转到drafts页面
      setTimeout(() => {
        const aiResponse = `I understand you're looking for a platform solution. Let me show you some product recommendations that might fit your needs.

Based on your request: "${originalInput}"

I'll redirect you to our product recommendations page where you can:
• Browse suitable platform solutions
• View detailed product features and pricing
• Access demo links and QR codes
• Connect directly with our specialists

Redirecting you now...`;

        const aiMessage: Message = { 
            role: 'assistant', 
          content: aiResponse
        };
        
        setMessages(prev => [...prev, aiMessage]);
        
        // 跳转到产品推荐页面，传递用户查询
        setTimeout(() => {
          navigate('/drafts?tab=products', { 
            state: { 
              query: originalInput 
            } 
          });
        }, 2000);
      }, 1000);
      return;
    }

    // For authenticated users - generate editable draft like non-authenticated users
    if (isAuthenticated) {
      setIsCreatingRequest(true);
      
    setTimeout(() => {
        const draft = generateDraft(originalInput);
        
      let aiResponse = "";
      
      if (userInput.includes('ecommerce') || userInput.includes('e-commerce') || userInput.includes('online store') || userInput.includes('selling online')) {
          aiResponse = `🚀 **Advanced E-commerce Business Analysis:**

Based on your e-commerce business, here's my comprehensive analysis:

🎯 **Detailed Pain Point Analysis:**
• Customer acquisition costs have increased by 38% year-over-year
• Cart abandonment rate averaging 69.8% (industry benchmark: 70%)
• Inventory management inefficiencies causing 15% stock-outs
• Competition from Amazon and other platforms reducing margins by 12%
• Mobile conversion rates 2.3x lower than desktop

💡 **Verified Specialists Available:**
• **Sarah Chen** - E-commerce Growth Specialist (increased client revenue by 245%)
• **Mike Rodriguez** - UX/UI Designer (reduced cart abandonment by 40%)
• **Lisa Wang** - Inventory Management Expert (saved clients $50K+ annually)
• **David Kim** - Digital Marketing Strategist (cut acquisition costs by 35%)
• **Emma Thompson** - Mobile Optimization Specialist

📊 **Market Intelligence:**
• Your industry segment is growing 23% annually
• Top performing product categories in your niche
• Competitor analysis and pricing strategies
• Emerging market opportunities

✅ **Editable Draft Created:**
I've generated a comprehensive business analysis draft that you can now edit and customize. This includes detailed recommendations, budget estimates, and timeline projections.

🎯 **Next Steps:**
Review and edit your personalized business plan, then send it to verified specialists for detailed proposals.`;
        } else if (userInput.includes('medical') || userInput.includes('doctor') || userInput.includes('healthcare') || userInput.includes('clinic') || userInput.includes('soap') || userInput.includes('patient') || userInput.includes('physician') || userInput.includes('hospital')) {
          aiResponse = `🏥 **Comprehensive Healthcare Practice Analysis:**

**Advanced Medical Practice Optimization:**

🎯 **Detailed Healthcare Pain Points:**
• Physicians spend 2-3 hours daily on documentation outside patient care
• SOAP notes and medical records consume 35-40% of a doctor's time
• Administrative burden leads to physician burnout (affecting 50% of doctors)
• Work-life balance severely impacted by after-hours documentation
• EHR systems causing 23% productivity decrease

💡 **Premium Healthcare Solutions:**
• **Dr. Sarah Mitchell** - Healthcare Workflow Optimization (reduced doc time by 65%)
• **NuroScript AI Team** - Ambient Dictation Specialists (eliminated evening work)
• **TechMed Solutions** - EHR Integration Experts
• **Dr. James Chen** - Physician Burnout Prevention (helped 200+ doctors)
• **HealthTech Innovations** - Practice Management Optimization

🎥 **Exclusive Demo Access:**
• Live NuroScript ambient dictation demonstration
• Case studies: doctors who got their evenings back
• ROI calculator for practice efficiency improvements
• Integration roadmap with your current EHR system

📊 **Medical Industry Insights:**
• 78% of practices using ambient AI see immediate improvement
• Average 60-70% reduction in documentation time
• $125,000 annual savings per physician in productivity gains
• Patient satisfaction increases by 45% with more face-time

✅ **Advanced Draft Generated:**
Your editable medical practice optimization plan includes specific technology recommendations, implementation timeline, and detailed cost-benefit analysis.`;
        } else {
          aiResponse = `🚀 **Premium Business Consultation Analysis:**

**Comprehensive Business Intelligence Report:**

🎯 **Advanced Business Analysis:**
• Market positioning assessment
• Competitive landscape analysis
• Revenue optimization opportunities
• Operational efficiency improvements
• Growth strategy recommendations

💡 **Expert Network Access:**
• Industry-specific consultants
• Verified business advisors
• Technology implementation specialists
• Financial optimization experts
• Strategic planning professionals

📊 **Premium Market Data:**
• Real-time industry trends
• Competitor performance metrics
• Market opportunity analysis
• Customer behavior insights
• Revenue forecasting models

✅ **Editable Business Plan Created:**
Your comprehensive business strategy document is ready for customization. Includes detailed implementation roadmap, budget planning, and success metrics.

🎯 **Exclusive Features:**
• Direct access to verified consultants
• Advanced analytics and reporting
• Personalized recommendation engine
• Priority support and consultation

Ready to transform your business with expert guidance?`;
        }

        const aiMessage: Message = { 
          role: 'assistant', 
          content: aiResponse,
          draft: draft
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsCreatingRequest(false);
      }, 2000);
      return;
    }

    // For non-authenticated users - generate editable draft
    setIsCreatingRequest(true);
    
      setTimeout(() => {
      const draft = generateDraft(originalInput);
      
      const aiResponse = `I've analyzed your business challenge and created a detailed project proposal for you. 

**Here's what I found:**
Based on your input, I've identified key pain points and created a comprehensive solution approach that addresses your specific needs.

🎯 **Click the draft below to review and edit the details:**`;

      const aiMessage: Message = { 
          role: 'assistant', 
        content: aiResponse,
        draft: draft
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsCreatingRequest(false);
    }, 2000);
  };

  const handleEditDraft = (draft: any) => {
    setEditingDraft({ ...draft });
    setEditDialogOpen(true);
  };

  const handleSaveDraft = () => {
    // For non-authenticated users, redirect to login
    if (!isAuthenticated) {
      navigate('/login?message=Please login to save changes and contact our experts&redirect=chat-salesman');
      setEditDialogOpen(false);
      return;
    }
    
    if (!editingDraft) return;

    // Generate unique ID for the draft
    const draftId = Date.now().toString();
    const timestamp = new Date().toISOString();
    
    // Determine category based on draft content
    const lowerContent = editingDraft.content.toLowerCase();
    let category = 'General';
    if (lowerContent.includes('ecommerce') || lowerContent.includes('e-commerce') || lowerContent.includes('online store')) {
      category = 'E-commerce';
    } else if (lowerContent.includes('medical') || lowerContent.includes('doctor') || lowerContent.includes('healthcare')) {
      category = 'Medical';
    } else if (lowerContent.includes('restaurant') || lowerContent.includes('food') || lowerContent.includes('cafe')) {
      category = 'Restaurant';
    } else if (lowerContent.includes('tech') || lowerContent.includes('software') || lowerContent.includes('app')) {
      category = 'Tech';
    }

    // Create draft object
    const draftToSave = {
      id: draftId,
      title: editingDraft.title,
      content: editingDraft.content,
      budget: editingDraft.budget,
      timeline: editingDraft.timeline,
      category: category,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Save to localStorage
    try {
      const existingDrafts = localStorage.getItem('reversale-drafts');
      const drafts = existingDrafts ? JSON.parse(existingDrafts) : [];
      drafts.push(draftToSave);
      localStorage.setItem('reversale-drafts', JSON.stringify(drafts));
      
      // Show success message
      alert('Draft saved successfully! You can find it in the Drafts section.');
      
      // Update the message with updated draft
      setMessages(prev => prev.map(msg => 
        msg.draft ? { ...msg, draft: editingDraft } : msg
      ));
      
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft. Please try again.');
    }
    
    setEditDialogOpen(false);
  };

  const handleSendToSalesman = async () => {
    if (!editingDraft) return;
    
    // For non-authenticated users, redirect to login
    if (!isAuthenticated) {
      navigate('/login?message=Please login to connect with our experts&redirect=chat-salesman');
      setEditDialogOpen(false);
      return;
    }
    
    // Create draft object to pass to chat-salesman
    // Determine category based on draft content
    const lowerContent = editingDraft.content.toLowerCase();
    let category = 'General';
    if (lowerContent.includes('ecommerce') || lowerContent.includes('e-commerce') || lowerContent.includes('online store')) {
      category = 'E-commerce';
    } else if (lowerContent.includes('medical') || lowerContent.includes('doctor') || lowerContent.includes('healthcare')) {
      category = 'Medical';
    } else if (lowerContent.includes('restaurant') || lowerContent.includes('food') || lowerContent.includes('cafe')) {
      category = 'Restaurant';
    } else if (lowerContent.includes('tech') || lowerContent.includes('software') || lowerContent.includes('app')) {
      category = 'Tech';
    }
    
    const draftToPass = {
      id: Date.now().toString(),
      title: editingDraft.title,
      content: editingDraft.content,
      budget: editingDraft.budget,
      timeline: editingDraft.timeline,
      category: category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      // First try to send email
      const emailData = {
        to: 'sales@reversale.com',
        subject: `New Project Inquiry: ${editingDraft.title}`,
        html: `
          <h2>New Project Inquiry</h2>
          <h3>${editingDraft.title}</h3>
          
          <div style="margin: 20px 0;">
            <strong>Project Details:</strong>
            <div style="white-space: pre-line; margin-top: 10px; padding: 15px; background: #f8f9fa; border-radius: 5px;">
              ${editingDraft.content}
            </div>
          </div>
          
          <div style="display: flex; gap: 30px; margin: 20px 0;">
            <div>
              <strong>Budget:</strong> ${editingDraft.budget}
            </div>
            <div>
              <strong>Timeline:</strong> ${editingDraft.timeline}
            </div>
          </div>
          
          <p>Please contact this client to discuss their project requirements.</p>
        `
      };

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        // Email sent successfully, also navigate to chat with draft data
        navigate('/chat-salesman', { state: { draft: draftToPass } });
        alert('Connecting you with our sales expert...');
      } else {
        // Email failed, still navigate to chat with draft data
        navigate('/chat-salesman', { state: { draft: draftToPass } });
        alert('Connecting you with our sales expert...');
      }
    } catch (error) {
      console.log('Email service not available, redirecting to chat with draft data...');
      // Always navigate to chat with draft data
      navigate('/chat-salesman', { state: { draft: draftToPass } });
      alert('Connecting you with our sales expert...');
    }
    
    setEditDialogOpen(false);
  };

  const handleSendViaEmail = async () => {
    if (!editingDraft) return;
    
    // For non-authenticated users, redirect to login
    if (!isAuthenticated) {
      navigate('/login?message=Please login to send via email&redirect=chat-salesman');
      setEditDialogOpen(false);
      return;
    }
    
    try {
      // Create email content for user's email client
      const subject = encodeURIComponent(`Project Inquiry: ${editingDraft.title}`);
      const body = encodeURIComponent(`
Project Title: ${editingDraft.title}

Project Details:
${editingDraft.content}

Budget Range: ${editingDraft.budget}
Timeline: ${editingDraft.timeline}

Please contact me to discuss this project further.

Best regards,
[Your Name]
[Your Contact Information]
      `);
      
      // Open user's default email client
      const mailto = `mailto:sales@reversale.com?subject=${subject}&body=${body}`;
      window.open(mailto, '_blank');
      
      // Show confirmation message
      alert('Email client opened! Please send the email from your email application.');
      
    } catch (error) {
      console.error('Error opening email client:', error);
      alert('Unable to open email client. Please manually send an email to sales@reversale.com');
    }
    
    setEditDialogOpen(false);
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
        minHeight: '100vh',
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#ffffff',
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
          position: 'sticky',
          top: 0,
          zIndex: 100
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

        {/* Main Content Container */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
        }}>
          {/* Central Content Area */}
          <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          py: 6,
            flex: messages.length === 0 ? 1 : 0
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
              fontSize: { xs: '1.8rem', md: '2rem' },
              fontFamily: 'Inter, sans-serif'
            }}
          >
            How can I help you today - solve business challenges or find the right platform?
          </Typography>

            {/* Input Area - Directly under headline */}
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
          </Box>

          {/* Chat Messages */}
          {messages.length > 0 && (
              <Box sx={{ 
              flex: 1,
              px: 3,
              pb: 4,
              overflow: 'auto'
              }}>
                {messages.map((message, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Paper
                    sx={{
                      p: 3,
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
                    <Typography sx={{ fontSize: '1rem', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                      {message.content}
                    </Typography>
                  </Paper>
                  
                  {/* Draft Card */}
                  {message.draft && (
                    <Paper
                      onClick={() => {
                        console.log('Draft clicked!', message.draft); // Debug log
                        handleEditDraft(message.draft);
                      }}
                      sx={{
                        mt: 2,
                        p: 3,
                        maxWidth: '75%',
                        cursor: 'pointer',
                        border: '2px dashed #7442BF',
                        borderRadius: 3,
                        bgcolor: 'rgba(116, 66, 191, 0.02)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#5e3399',
                          bgcolor: 'rgba(116, 66, 191, 0.05)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(116, 66, 191, 0.15)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EditIcon sx={{ color: '#7442BF', mr: 1 }} />
                        <Typography variant="h6" sx={{ color: '#7442BF', fontWeight: 600 }}>
                          {message.draft.title}
                        </Typography>
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#666', 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {message.draft.content.replace(/\*\*/g, '').substring(0, 200)}...
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                            Budget
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#7442BF', fontWeight: 600 }}>
                            {message.draft.budget}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                            Timeline
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#7442BF', fontWeight: 600 }}>
                            {message.draft.timeline}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 2, 
                          color: '#7442BF', 
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        Click to review and edit details
                      </Typography>
                    </Paper>
                  )}
                  
                  {/* Product Card for non-authenticated users */}
                  {message.product && (
                    <Box sx={{ mt: 2, maxWidth: '75%' }}>
                      <ProductCard 
                        product={message.product}
                        onContactSales={() => {
                          alert('Please log in to contact our sales team and get detailed consultation for this product.');
                        }}
                        onViewDetails={() => {
                          alert('Please log in to view detailed product information and access demo links.');
                        }}
                      />
                    </Box>
                  )}
                </Box>
                ))}
              </Box>
          )}
        </Box>

        {/* Draft Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              maxHeight: '90vh'
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid #e9ecef',
            pb: 2
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#7442BF' }}>
              Edit Project Proposal
            </Typography>
            <IconButton onClick={() => setEditDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            {editingDraft && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  label="Project Title"
                  value={editingDraft.title}
                  onChange={(e) => setEditingDraft({...editingDraft, title: e.target.value})}
                  fullWidth
                  variant="outlined"
                />
                
                <TextField
                  label="Project Details"
                  value={editingDraft.content}
                  onChange={(e) => setEditingDraft({...editingDraft, content: e.target.value})}
                  fullWidth
                  multiline
                  rows={12}
                  variant="outlined"
                    sx={{
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                    }
                  }}
                />
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Budget Range"
                    value={editingDraft.budget}
                    onChange={(e) => setEditingDraft({...editingDraft, budget: e.target.value})}
                    sx={{ flex: 1 }}
                    variant="outlined"
                  />
                  
                  <TextField
                    label="Timeline"
                    value={editingDraft.timeline}
                    onChange={(e) => setEditingDraft({...editingDraft, timeline: e.target.value})}
                    sx={{ flex: 1 }}
                    variant="outlined"
                  />
              </Box>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3, borderTop: '1px solid #e9ecef', gap: 2 }}>
            <Button
              onClick={() => setEditDialogOpen(false)}
              variant="outlined"
              sx={{
                borderColor: '#ddd',
                color: '#666',
                '&:hover': {
                  borderColor: '#bbb',
                  bgcolor: '#f5f5f5'
                }
              }}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSaveDraft}
              variant="outlined"
              startIcon={<SaveIcon />}
              sx={{
                borderColor: '#7442BF',
                color: '#7442BF',
                '&:hover': {
                  borderColor: '#5e3399',
                  bgcolor: 'rgba(116, 66, 191, 0.05)'
                }
              }}
            >
              {isAuthenticated ? 'Save Changes' : 'Login to Our Salesman'}
            </Button>
            
            <Button
              onClick={handleSendViaEmail}
              variant="outlined"
              startIcon={<SendIcon />}
              sx={{
                borderColor: '#2196F3',
                color: '#2196F3',
                '&:hover': {
                  borderColor: '#1976D2',
                  bgcolor: 'rgba(33, 150, 243, 0.05)'
                }
              }}
            >
              {isAuthenticated ? 'Send via Email' : 'Login to Send Email'}
            </Button>
            
            <Button
              onClick={handleSendToSalesman}
              variant="contained"
              startIcon={<SendIcon />}
              sx={{
                bgcolor: '#7442BF',
                color: 'white',
                '&:hover': {
                  bgcolor: '#5e3399'
                }
              }}
            >
              {isAuthenticated ? 'Send to Our Experts' : 'Login to Contact Experts'}
            </Button>
          </DialogActions>
        </Dialog>
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
        {/* Central Content Area */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
          py: 6,
          flex: messages.length === 0 ? 1 : 0
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
            fontSize: { xs: '1.8rem', md: '2rem' },
            fontFamily: 'Inter, sans-serif'
          }}
        >
            How can I help you today - solve business challenges or find the right platform?
        </Typography>

          {/* Input Area - Directly under headline */}
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
                <Box key={index} sx={{ mb: 3 }}>
                <Paper
                  sx={{
                    p: 3,
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
                    <Typography sx={{ fontSize: '1rem', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                    {message.content}
                  </Typography>
                </Paper>
                  
                  {/* Draft Card for Authenticated Users */}
                  {message.draft && (
                    <Paper
                      onClick={() => {
                        console.log('Draft clicked!', message.draft); // Debug log
                        handleEditDraft(message.draft);
                      }}
                      sx={{
                        mt: 2,
                        p: 3,
                        maxWidth: '75%',
                        cursor: 'pointer',
                        border: '2px dashed #7442BF',
                        borderRadius: 3,
                        bgcolor: 'rgba(116, 66, 191, 0.02)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#5e3399',
                          bgcolor: 'rgba(116, 66, 191, 0.05)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(116, 66, 191, 0.15)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EditIcon sx={{ color: '#7442BF', mr: 1 }} />
                        <Typography variant="h6" sx={{ color: '#7442BF', fontWeight: 600 }}>
                          {message.draft.title}
                        </Typography>
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#666', 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {message.draft.content.replace(/\*\*/g, '').substring(0, 200)}...
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                            Budget
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#7442BF', fontWeight: 600 }}>
                            {message.draft.budget}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#888', display: 'block' }}>
                            Timeline
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#7442BF', fontWeight: 600 }}>
                            {message.draft.timeline}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 2, 
                          color: '#7442BF', 
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        Click to review and edit details
                      </Typography>
                    </Paper>
                  )}
                  
                  {/* Product Card for non-authenticated users */}
                  {message.product && (
                    <Box sx={{ mt: 2, maxWidth: '75%' }}>
                      <ProductCard 
                        product={message.product}
                        onContactSales={() => {
                          alert('Please log in to contact our sales team and get detailed consultation for this product.');
                        }}
                        onViewDetails={() => {
                          alert('Please log in to view detailed product information and access demo links.');
                        }}
                      />
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Container>
        )}
      </Box>

      {/* Draft Edit Dialog for Authenticated Users */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e9ecef',
          pb: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#7442BF' }}>
            Edit Project Proposal
          </Typography>
          <IconButton onClick={() => setEditDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {editingDraft && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Project Title"
                value={editingDraft.title}
                onChange={(e) => setEditingDraft({...editingDraft, title: e.target.value})}
                fullWidth
                variant="outlined"
              />
              
              <TextField
                label="Project Details"
                value={editingDraft.content}
                onChange={(e) => setEditingDraft({...editingDraft, content: e.target.value})}
                fullWidth
                multiline
                rows={12}
                variant="outlined"
                sx={{
                  '& .MuiInputBase-input': {
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                  }
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Budget Range"
                  value={editingDraft.budget}
                  onChange={(e) => setEditingDraft({...editingDraft, budget: e.target.value})}
                  sx={{ flex: 1 }}
                  variant="outlined"
                />
                
                <TextField
                  label="Timeline"
                  value={editingDraft.timeline}
                  onChange={(e) => setEditingDraft({...editingDraft, timeline: e.target.value})}
                  sx={{ flex: 1 }}
                  variant="outlined"
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e9ecef', gap: 2 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: '#ddd',
              color: '#666',
              '&:hover': {
                borderColor: '#bbb',
                bgcolor: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleSaveDraft}
            variant="outlined"
            startIcon={<SaveIcon />}
            sx={{
              borderColor: '#7442BF',
              color: '#7442BF',
              '&:hover': {
                borderColor: '#5e3399',
                bgcolor: 'rgba(116, 66, 191, 0.05)'
              }
            }}
          >
            Save Changes
          </Button>
          
          <Button
            onClick={handleSendViaEmail}
            variant="outlined"
            startIcon={<SendIcon />}
            sx={{
              borderColor: '#2196F3',
              color: '#2196F3',
              '&:hover': {
                borderColor: '#1976D2',
                bgcolor: 'rgba(33, 150, 243, 0.05)'
              }
            }}
          >
            Send via Email
          </Button>
          
          <Button
            onClick={handleSendToSalesman}
            variant="contained"
            startIcon={<SendIcon />}
            sx={{
              bgcolor: '#7442BF',
              color: 'white',
              '&:hover': {
                bgcolor: '#5e3399'
              }
            }}
          >
            Send to Our Experts
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Add global type declaration
declare global {
  interface Window {
    stopRecording: () => void;
  }
} 