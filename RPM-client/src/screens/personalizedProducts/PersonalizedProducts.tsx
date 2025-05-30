import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  IconButton,
  Avatar,
  Divider,
  LinearProgress,
  CardMedia,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Tooltip,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupIcon from '@mui/icons-material/Group';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import BusinessIcon from '@mui/icons-material/Business';
import StarIcon from '@mui/icons-material/Star';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LaunchIcon from '@mui/icons-material/Launch';
import GetAppIcon from '@mui/icons-material/GetApp';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LanguageIcon from '@mui/icons-material/Language';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import KeyboardIcon from '@mui/icons-material/Keyboard';

interface ProductPreview {
  title: string;
  description: string;
  image: string;
  url: string;
  domain: string;
  favicon: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  category: string;
  revenueIncrease: string;
  monthlyRevenue: number;
  yearlyRevenue: number;
  customerGrowth: string;
  implementationTime: string;
  matchScore: number;
  revenueStreams: string[];
  successStories: {
    company: string;
    result: string;
  }[];
  // New fields for real product display
  productUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  qrCode?: string;
  preview?: ProductPreview;
  screenshots?: string[];
  demoUrl?: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  products?: Product[]; // Add products to messages
}

export default function PersonalizedProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI Product Consultant. Tell me about your business needs, challenges, or goals, and I'll recommend the perfect products to boost your revenue.",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  React.useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (isListening) {
      stopListening();
    }
  };

  const allProducts: Product[] = [
    {
      id: '1',
      name: 'Shopify Plus E-commerce Platform',
      description: 'Enterprise-grade e-commerce solution with advanced customization and scalability.',
      price: '$2,000/month',
      features: ['Advanced checkout', 'Multi-channel selling', 'Custom apps', 'Analytics dashboard'],
      category: 'E-commerce',
      revenueIncrease: '+45%',
      monthlyRevenue: 15000,
      yearlyRevenue: 180000,
      customerGrowth: '+60%',
      implementationTime: '2-4 weeks',
      matchScore: 95,
      revenueStreams: [
        'Online sales optimization: +$8,500/month',
        'Multi-channel integration: +$4,200/month',
        'Conversion rate improvement: +$2,300/month'
      ],
      successStories: [
        { company: 'Fashion Forward', result: '300% increase in online sales' },
        { company: 'Tech Gadgets Co', result: '150% improvement in conversion rate' }
      ],
      productUrl: 'https://www.shopify.com/plus',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      preview: {
        title: 'Shopify Plus - Enterprise Ecommerce Platform',
        description: 'The commerce platform trusted by millions of businesses worldwide. Build, customize, and scale your online store.',
        image: 'https://cdn.shopify.com/shopifycloud/brochure/assets/home/hero-desktop-4d1a6e5e.jpg',
        url: 'https://www.shopify.com/plus',
        domain: 'shopify.com',
        favicon: 'https://cdn.shopify.com/favicon.ico'
      },
      screenshots: [
        'https://cdn.shopify.com/shopifycloud/brochure/assets/home/hero-desktop-4d1a6e5e.jpg',
        'https://cdn.shopify.com/shopifycloud/brochure/assets/home/build-desktop-4d1a6e5e.jpg'
      ],
      demoUrl: 'https://www.shopify.com/plus/demo'
    },
    {
      id: '2',
      name: 'HubSpot CRM & Marketing Hub',
      description: 'All-in-one CRM, marketing, sales, and service platform for growing businesses.',
      price: '$800/month',
      features: ['Contact management', 'Email marketing', 'Sales automation', 'Analytics'],
      category: 'CRM & Marketing',
      revenueIncrease: '+35%',
      monthlyRevenue: 12000,
      yearlyRevenue: 144000,
      customerGrowth: '+50%',
      implementationTime: '1-2 weeks',
      matchScore: 92,
      revenueStreams: [
        'Lead generation improvement: +$6,500/month',
        'Sales process automation: +$3,800/month',
        'Customer retention: +$1,700/month'
      ],
      successStories: [
        { company: 'StartupGrow', result: '400% increase in qualified leads' },
        { company: 'ServicePro', result: '250% improvement in sales efficiency' }
      ],
      productUrl: 'https://www.hubspot.com/products/crm',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      preview: {
        title: 'HubSpot CRM - Free Customer Relationship Management Software',
        description: 'HubSpot\'s free CRM gives you everything you need to organize, track, and build better relationships with leads and customers.',
        image: 'https://www.hubspot.com/hubfs/assets/hubspot.com/web-team/WBZ/Feature%20Pages/CRM/hero-crm-desktop.png',
        url: 'https://www.hubspot.com/products/crm',
        domain: 'hubspot.com',
        favicon: 'https://www.hubspot.com/favicon.ico'
      },
      demoUrl: 'https://www.hubspot.com/products/crm/demo'
    },
    {
      id: '3',
      name: 'Slack Business+ Communication',
      description: 'Advanced team collaboration platform with enterprise security and compliance.',
      price: '$12.50/user/month',
      features: ['Unlimited messaging', 'Video calls', 'File sharing', 'App integrations'],
      category: 'Communication',
      revenueIncrease: '+25%',
      monthlyRevenue: 8000,
      yearlyRevenue: 96000,
      customerGrowth: '+30%',
      implementationTime: '1 week',
      matchScore: 88,
      revenueStreams: [
        'Productivity improvement: +$4,500/month',
        'Reduced meeting time: +$2,200/month',
        'Better collaboration: +$1,300/month'
      ],
      successStories: [
        { company: 'RemoteTeam Inc', result: '40% increase in team productivity' },
        { company: 'CollabCorp', result: '60% reduction in email volume' }
      ],
      productUrl: 'https://slack.com/pricing',
      appStoreUrl: 'https://apps.apple.com/app/slack/id618783545',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=com.Slack',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      preview: {
        title: 'Slack - Where work happens',
        description: 'Slack is where work flows. It\'s where the people you need, the information you share, and the tools you use come together.',
        image: 'https://a.slack-edge.com/80588/marketing/img/homepage/bold-existing-users/hero-product-ui.png',
        url: 'https://slack.com',
        domain: 'slack.com',
        favicon: 'https://a.slack-edge.com/80588/img/favicon-32.png'
      }
    },
    {
      id: '4',
      name: 'Zoom Business Pro',
      description: 'Professional video conferencing solution with advanced features for business meetings.',
      price: '$19.99/user/month',
      features: ['HD video/audio', 'Screen sharing', 'Recording', 'Webinar hosting'],
      category: 'Video Conferencing',
      revenueIncrease: '+20%',
      monthlyRevenue: 6000,
      yearlyRevenue: 72000,
      customerGrowth: '+25%',
      implementationTime: '1 week',
      matchScore: 85,
      revenueStreams: [
        'Remote meeting efficiency: +$3,200/month',
        'Travel cost savings: +$1,800/month',
        'Client engagement: +$1,000/month'
      ],
      successStories: [
        { company: 'GlobalConsult', result: '80% reduction in travel costs' },
        { company: 'MeetingPro', result: '200% increase in client meetings' }
      ],
      productUrl: 'https://zoom.us/pricing',
      appStoreUrl: 'https://apps.apple.com/app/zoom/id546505307',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=us.zoom.videomeetings',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      preview: {
        title: 'Zoom - Video Conferencing, Cloud Phone, Webinars, Chat',
        description: 'Zoom\'s secure, reliable video platform powers all of your communication needs, including meetings, chat, phone, webinars, and online events.',
        image: 'https://st1.zoom.us/static/6.3.21909/image/new/ZoomLogo_112x112.png',
        url: 'https://zoom.us',
        domain: 'zoom.us',
        favicon: 'https://st1.zoom.us/static/6.3.21909/image/favicon.ico'
      }
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: searchQuery,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setSearchQuery('');
    setIsAnalyzing(true);

    // AI analyzes user needs and matches products
    setTimeout(() => {
      const keywords = searchQuery.toLowerCase();
      let matchedProducts: Product[] = [];

      // Match products based on keywords
      if (keywords.includes('ecommerce') || keywords.includes('online store') || keywords.includes('shop') || keywords.includes('sell online')) {
        matchedProducts.push(allProducts[0]); // Shopify
      }
      if (keywords.includes('crm') || keywords.includes('customer') || keywords.includes('sales') || keywords.includes('marketing')) {
        matchedProducts.push(allProducts[1]); // HubSpot
      }
      if (keywords.includes('communication') || keywords.includes('team') || keywords.includes('collaboration') || keywords.includes('chat')) {
        matchedProducts.push(allProducts[2]); // Slack
      }
      if (keywords.includes('meeting') || keywords.includes('video') || keywords.includes('conference') || keywords.includes('zoom')) {
        matchedProducts.push(allProducts[3]); // Zoom
      }

      // If no specific match, recommend popular products
      if (matchedProducts.length === 0) {
        matchedProducts = allProducts.slice(0, 2);
      }

      // Sort by match score
      matchedProducts.sort((a, b) => b.matchScore - a.matchScore);

      setProducts(matchedProducts);

      const aiResponse: Message = {
        id: Date.now() + 1,
        text: `Based on your needs "${searchQuery}", I've found ${matchedProducts.length} perfect solutions that can significantly boost your revenue. Here are the product recommendations with real-world links and download options:`,
        sender: 'ai',
        timestamp: new Date(),
        products: matchedProducts
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleLearnMore = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (product?.productUrl) {
      window.open(product.productUrl, '_blank');
    }
  };

  const handlePurchase = (productId: string) => {
    const product = allProducts.find(p => p.id === productId);
    if (product?.productUrl) {
      window.open(product.productUrl, '_blank');
    }
  };

  const handleShowQR = (product: Product) => {
    setSelectedProduct(product);
    setQrDialogOpen(true);
  };

  const handleCloseQR = () => {
    setQrDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleAppDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDemoClick = (demoUrl: string) => {
    window.open(demoUrl, '_blank');
  };

  return (
    <Box sx={{ mt: 8, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)', 
        color: 'white' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <BusinessIcon sx={{ fontSize: 40 }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            AI-Powered Product Solutions
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Tell us your business needs and get personalized product recommendations with revenue projections
        </Typography>
      </Paper>

      {/* AI Consultation */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyIcon color="primary" />
          AI Product Consultant
        </Typography>
        
        {/* Messages */}
        <Box sx={{ mb: 3, maxHeight: 400, overflowY: 'auto' }}>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2,
                alignItems: 'flex-start',
                gap: 1
              }}
            >
              {msg.sender === 'ai' && (
                <Avatar sx={{ bgcolor: '#FF6B6B', width: 32, height: 32 }}>
                  <SmartToyIcon sx={{ fontSize: 16 }} />
                </Avatar>
              )}
              
              <Box sx={{ maxWidth: '75%' }}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: msg.sender === 'user' 
                      ? 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)'
                      : 'white',
                    color: msg.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: 3,
                    border: msg.sender === 'ai' ? '1px solid #e9ecef' : 'none',
                    mb: 1
                  }}
                >
                  <Typography variant="body1">
                    {msg.text}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                    {msg.timestamp.toLocaleTimeString()}
                  </Typography>
                </Paper>

                {/* Product Preview Cards for AI messages */}
                {msg.sender === 'ai' && msg.products && msg.products.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {msg.products.map((product) => (
                      <Card key={product.id} sx={{ 
                        maxWidth: 400,
                        border: '1px solid #e0e0e0',
                        borderRadius: 2,
                        overflow: 'hidden',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}>
                        {/* Product Preview Header */}
                        {product.preview && (
                          <Box sx={{ position: 'relative' }}>
                            <CardMedia
                              component="img"
                              height="120"
                              image={product.preview.image}
                              alt={product.preview.title}
                              sx={{ objectFit: 'cover' }}
                            />
                            <Box sx={{ 
                              position: 'absolute', 
                              top: 8, 
                              right: 8,
                              display: 'flex',
                              gap: 1
                            }}>
                              <IconButton
                                size="small"
                                onClick={() => handleShowQR(product)}
                                sx={{ 
                                  bgcolor: 'rgba(255,255,255,0.9)',
                                  '&:hover': { bgcolor: 'white' }
                                }}
                              >
                                <QrCodeIcon fontSize="small" />
                              </IconButton>
                              {product.productUrl && (
                                <IconButton
                                  size="small"
                                  onClick={() => window.open(product.productUrl, '_blank')}
                                  sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.9)',
                                    '&:hover': { bgcolor: 'white' }
                                  }}
                                >
                                  <LaunchIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          </Box>
                        )}

                        <CardContent sx={{ p: 2 }}>
                          {/* URL Preview Info */}
                          {product.preview && (
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Box 
                                  component="img"
                                  src={product.preview.favicon}
                                  alt=""
                                  sx={{ width: 16, height: 16 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {product.preview.domain}
                                </Typography>
                                <LanguageIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                              </Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {product.preview.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                                {product.preview.description}
                              </Typography>
                            </Box>
                          )}

                          {/* Product Info */}
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {product.name}
                            </Typography>
                            <Chip 
                              label={product.price}
                              color="primary"
                              size="small"
                            />
                          </Box>

                          {/* Revenue Impact */}
                          <Box sx={{ 
                            bgcolor: 'success.light', 
                            p: 1.5, 
                            borderRadius: 1, 
                            mb: 2,
                            color: 'success.contrastText'
                          }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              💰 Revenue Impact: {product.revenueIncrease} (+${product.monthlyRevenue.toLocaleString()}/month)
                            </Typography>
                          </Box>

                          {/* Action Buttons */}
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {product.demoUrl && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleDemoClick(product.demoUrl!)}
                                sx={{ 
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 3,
                                }}
                              >
                                Try Demo
                              </Button>
                            )}
                            {product.appStoreUrl && (
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<PhoneAndroidIcon sx={{ fontSize: 14 }} />}
                                onClick={() => handleAppDownload(product.appStoreUrl!)}
                                sx={{ 
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 3,
                                }}
                              >
                                iOS
                              </Button>
                            )}
                            {product.playStoreUrl && (
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<GetAppIcon sx={{ fontSize: 14 }} />}
                                onClick={() => handleAppDownload(product.playStoreUrl!)}
                                sx={{ 
                                  fontSize: '0.75rem',
                                  minWidth: 'auto',
                                  px: 1.5,
                                  py: 0.5,
                                  borderRadius: 3,
                                }}
                              >
                                Android
                              </Button>
                            )}
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleLearnMore(product.id)}
                              sx={{ 
                                fontSize: '0.75rem',
                                minWidth: 'auto',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)',
                              }}
                            >
                              Learn More
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          ))}
          
          {isAnalyzing && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#FF6B6B', width: 32, height: 32 }}>
                <SmartToyIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Paper sx={{ p: 2, border: '1px solid #e9ecef' }}>
                <Typography variant="body2" color="text.secondary">
                  AI is analyzing your needs and matching products...
                </Typography>
                <LinearProgress sx={{ mt: 1, width: 200 }} />
              </Paper>
            </Box>
          )}
        </Box>

        {/* Input */}
        <Box sx={{ display: 'flex', gap: 2, position: 'relative' }}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isVoiceMode ? "Click the microphone to speak..." : "Describe your business needs (e.g., 'I need to improve customer management and increase sales')"}
            variant="outlined"
            disabled={isListening}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: isListening ? 'rgba(255, 0, 0, 0.05)' : 'white',
                border: isListening ? '2px solid #ff4444' : undefined
              }
            }}
            InputProps={{
              endAdornment: (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title={isVoiceMode ? "Switch to keyboard" : "Switch to voice input"}>
                    <IconButton
                      onClick={toggleVoiceMode}
                      size="small"
                      sx={{ 
                        color: isVoiceMode ? '#7442BF' : 'text.secondary',
                        bgcolor: isVoiceMode ? 'rgba(116, 66, 191, 0.1)' : '#f8f9fa',
                        borderRadius: 2,
                      }}
                    >
                      {isVoiceMode ? <KeyboardIcon /> : <MicIcon />}
                    </IconButton>
                  </Tooltip>
                  {isVoiceMode && (
                    <Tooltip title={isListening ? "Stop listening" : "Start voice input"}>
                      <IconButton
                        onClick={isListening ? stopListening : startListening}
                        disabled={!recognition}
                        size="small"
                        sx={{ 
                          color: isListening ? '#ff4444' : '#7442BF',
                          bgcolor: isListening ? 'rgba(255, 68, 68, 0.1)' : 'rgba(116, 66, 191, 0.1)',
                          borderRadius: 2,
                        }}
                      >
                        {isListening ? <MicIcon /> : <MicOffIcon />}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              )
            }}
          />
          <IconButton
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isAnalyzing}
            sx={{ 
              bgcolor: '#7442BF',
              color: 'white',
              borderRadius: 3,
              '&:hover': { 
                bgcolor: '#5e3399',
              },
              '&:disabled': { 
                bgcolor: '#e0e0e0',
                color: '#9e9e9e'
              },
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Voice Status */}
        {isListening && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: 'rgba(255, 68, 68, 0.1)', 
            borderRadius: 2,
            border: '1px solid rgba(255, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ 
              width: 12, 
              height: 12, 
              bgcolor: '#ff4444', 
              borderRadius: '50%',
              animation: 'blink 1s infinite',
              '@keyframes blink': {
                '0%, 50%': { opacity: 1 },
                '51%, 100%': { opacity: 0.3 }
              }
            }} />
            <Typography variant="body2" color="error">
              🎤 Listening... Speak now
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Product Recommendations */}
      {products.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon color="primary" />
            Recommended Solutions for Your Business
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, 
            gap: 3,
            mt: 3
          }}>
            {products.map((product) => (
              <Card key={product.id} sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: '2px solid #e9ecef',
                '&:hover': {
                  border: '2px solid #7442BF',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(116, 66, 191, 0.15)'
                },
                transition: 'all 0.3s ease'
              }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {product.name}
                    </Typography>
                    <Chip 
                      label={`${product.matchScore}% Match`}
                      color="primary"
                      size="small"
                      icon={<StarIcon />}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description}
                  </Typography>

                  {/* Revenue Projections */}
                  <Box sx={{ 
                    bgcolor: 'success.light', 
                    p: 2, 
                    borderRadius: 2, 
                    mb: 2,
                    color: 'success.contrastText'
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      💰 Revenue Impact
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                      <Typography variant="body2">
                        Revenue: <strong>{product.revenueIncrease}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Customers: <strong>{product.customerGrowth}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Monthly: <strong>+${product.monthlyRevenue.toLocaleString()}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Yearly: <strong>+${product.yearlyRevenue.toLocaleString()}</strong>
                      </Typography>
                    </Box>
                  </Box>

                  {/* Features */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Key Features:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {product.features.map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Pricing and Actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                      {product.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Setup: {product.implementationTime}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<InfoIcon />}
                      onClick={() => handleLearnMore(product.id)}
                      sx={{ 
                        flex: 1,
                        borderRadius: 3,
                      }}
                    >
                      Learn More
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handlePurchase(product.id)}
                      sx={{ 
                        flex: 1,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)',
                      }}
                    >
                      Get Started
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>
      )}
      
      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onClose={handleCloseQR} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <QrCodeIcon color="primary" />
            <Typography variant="h6">Download {selectedProduct?.name}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          {selectedProduct && (
            <Box>
              {/* QR Code */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 3,
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 2
              }}>
                <Box
                  component="img"
                  src={selectedProduct.qrCode || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZha2UgUVI8L3RleHQ+PC9zdmc+'}
                  alt="QR Code"
                  sx={{ width: 200, height: 200, border: '1px solid #ddd' }}
                />
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                Scan this QR code with your phone to visit the product page
              </Typography>

              {/* Download Links */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                {selectedProduct.productUrl && (
                  <Button
                    variant="outlined"
                    startIcon={<LanguageIcon />}
                    onClick={() => window.open(selectedProduct.productUrl, '_blank')}
                    fullWidth
                  >
                    Visit Website
                  </Button>
                )}
                
                {selectedProduct.appStoreUrl && (
                  <Button
                    variant="outlined"
                    startIcon={<PhoneAndroidIcon />}
                    onClick={() => handleAppDownload(selectedProduct.appStoreUrl!)}
                    fullWidth
                  >
                    Download for iOS
                  </Button>
                )}
                
                {selectedProduct.playStoreUrl && (
                  <Button
                    variant="outlined"
                    startIcon={<GetAppIcon />}
                    onClick={() => handleAppDownload(selectedProduct.playStoreUrl!)}
                    fullWidth
                  >
                    Download for Android
                  </Button>
                )}

                {selectedProduct.demoUrl && (
                  <Button
                    variant="contained"
                    onClick={() => handleDemoClick(selectedProduct.demoUrl!)}
                    sx={{ 
                      bgcolor: '#7442BF',
                      '&:hover': { bgcolor: '#5e3399' }
                    }}
                    fullWidth
                  >
                    Try Live Demo
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={handleCloseQR} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Floating Voice Assistant */}
      {!isVoiceMode && (
        <Fab
          color="primary"
          onClick={() => {
            setIsVoiceMode(true);
            setTimeout(() => startListening(), 100);
          }}
          disabled={!recognition}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)',
            '&:hover': { 
              background: 'linear-gradient(135deg, #5e3399 0%, #7b1fa2 100%)',
            },
            '&:disabled': { 
              bgcolor: '#e0e0e0',
              color: '#9e9e9e'
            },
            zIndex: 1000
          }}
        >
          <Tooltip title="Voice Assistant">
            <MicIcon />
          </Tooltip>
        </Fab>
      )}
    </Box>
  );
} 