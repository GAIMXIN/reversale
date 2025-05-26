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
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
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

  const allProducts: Product[] = [
    {
      id: '1',
      name: 'AI-Powered CRM System',
      description: 'Intelligent customer relationship management with automated lead scoring and personalized communication.',
      price: '$149/month',
      features: ['Smart lead scoring', 'Automated follow-ups', 'Customer analytics', 'Sales pipeline management'],
      category: 'Customer Management',
      revenueIncrease: '+35%',
      monthlyRevenue: 8750,
      yearlyRevenue: 105000,
      customerGrowth: '+45%',
      implementationTime: '2-3 weeks',
      matchScore: 95,
      revenueStreams: [
        'Increased conversion rates: +$4,200/month',
        'Better customer retention: +$2,800/month',
        'Upselling opportunities: +$1,750/month'
      ],
      successStories: [
        { company: 'TechStart Inc', result: '40% increase in sales within 3 months' },
        { company: 'GrowthCorp', result: '60% improvement in customer retention' }
      ]
    },
    {
      id: '2',
      name: 'Digital Marketing Automation Platform',
      description: 'Complete marketing automation suite with AI-driven campaigns and multi-channel reach.',
      price: '$199/month',
      features: ['Multi-channel campaigns', 'AI content generation', 'Performance analytics', 'A/B testing'],
      category: 'Marketing',
      revenueIncrease: '+50%',
      monthlyRevenue: 12500,
      yearlyRevenue: 150000,
      customerGrowth: '+70%',
      implementationTime: '1-2 weeks',
      matchScore: 92,
      revenueStreams: [
        'New customer acquisition: +$6,500/month',
        'Improved conversion rates: +$3,800/month',
        'Brand awareness boost: +$2,200/month'
      ],
      successStories: [
        { company: 'MarketLeader Co', result: '300% ROI in first quarter' },
        { company: 'BrandBoost Ltd', result: '85% increase in qualified leads' }
      ]
    },
    {
      id: '3',
      name: 'E-commerce Optimization Suite',
      description: 'Advanced e-commerce tools with inventory management, pricing optimization, and customer insights.',
      price: '$249/month',
      features: ['Inventory automation', 'Dynamic pricing', 'Customer behavior analytics', 'Mobile optimization'],
      category: 'E-commerce',
      revenueIncrease: '+42%',
      monthlyRevenue: 10500,
      yearlyRevenue: 126000,
      customerGrowth: '+55%',
      implementationTime: '3-4 weeks',
      matchScore: 88,
      revenueStreams: [
        'Optimized pricing strategy: +$5,200/month',
        'Reduced cart abandonment: +$3,100/month',
        'Cross-selling automation: +$2,200/month'
      ],
      successStories: [
        { company: 'ShopSmart', result: '50% reduction in cart abandonment' },
        { company: 'RetailPro', result: '35% increase in average order value' }
      ]
    },
    {
      id: '4',
      name: 'Business Intelligence Dashboard',
      description: 'Real-time analytics and reporting platform with predictive insights and custom KPI tracking.',
      price: '$99/month',
      features: ['Real-time dashboards', 'Predictive analytics', 'Custom reports', 'Data visualization'],
      category: 'Analytics',
      revenueIncrease: '+25%',
      monthlyRevenue: 6250,
      yearlyRevenue: 75000,
      customerGrowth: '+30%',
      implementationTime: '1 week',
      matchScore: 85,
      revenueStreams: [
        'Data-driven decisions: +$3,500/month',
        'Operational efficiency: +$1,800/month',
        'Cost optimization: +$950/month'
      ],
      successStories: [
        { company: 'DataDriven Inc', result: '25% cost reduction through insights' },
        { company: 'AnalyticsPro', result: '40% faster decision making' }
      ]
    },
    {
      id: '5',
      name: 'Customer Support Automation',
      description: 'AI-powered customer support with chatbots, ticket management, and satisfaction tracking.',
      price: '$79/month',
      features: ['AI chatbots', 'Ticket automation', 'Customer satisfaction tracking', '24/7 support'],
      category: 'Customer Service',
      revenueIncrease: '+20%',
      monthlyRevenue: 5000,
      yearlyRevenue: 60000,
      customerGrowth: '+25%',
      implementationTime: '1-2 weeks',
      matchScore: 82,
      revenueStreams: [
        'Improved customer satisfaction: +$2,800/month',
        'Reduced support costs: +$1,500/month',
        'Faster issue resolution: +$700/month'
      ],
      successStories: [
        { company: 'ServiceFirst', result: '90% customer satisfaction rate' },
        { company: 'SupportPro', result: '60% reduction in response time' }
      ]
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

    // AI分析用户需求并匹配产品
    setTimeout(() => {
      const keywords = searchQuery.toLowerCase();
      let matchedProducts: Product[] = [];

      // 根据关键词匹配产品
      if (keywords.includes('crm') || keywords.includes('customer') || keywords.includes('sales')) {
        matchedProducts.push(allProducts[0]); // CRM
      }
      if (keywords.includes('marketing') || keywords.includes('advertising') || keywords.includes('promotion')) {
        matchedProducts.push(allProducts[1]); // Marketing
      }
      if (keywords.includes('ecommerce') || keywords.includes('online store') || keywords.includes('shop')) {
        matchedProducts.push(allProducts[2]); // E-commerce
      }
      if (keywords.includes('analytics') || keywords.includes('data') || keywords.includes('report')) {
        matchedProducts.push(allProducts[3]); // Analytics
      }
      if (keywords.includes('support') || keywords.includes('service') || keywords.includes('help')) {
        matchedProducts.push(allProducts[4]); // Support
      }

      // 如果没有特定匹配，推荐热门产品
      if (matchedProducts.length === 0) {
        matchedProducts = allProducts.slice(0, 3);
      }

      // 按匹配度排序
      matchedProducts.sort((a, b) => b.matchScore - a.matchScore);

      setProducts(matchedProducts);

      const aiResponse: Message = {
        id: Date.now() + 1,
        text: `Based on your needs "${searchQuery}", I've found ${matchedProducts.length} perfect solutions that can significantly boost your revenue. These products have helped similar businesses achieve remarkable growth!`,
        sender: 'ai',
        timestamp: new Date(),
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
    console.log('Learn more about product:', productId);
  };

  const handlePurchase = (productId: string) => {
    console.log('Purchase product:', productId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
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
        <Box sx={{ mb: 3, maxHeight: 300, overflowY: 'auto' }}>
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
              
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '75%',
                  bgcolor: msg.sender === 'user' 
                    ? 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)'
                    : 'white',
                  color: msg.sender === 'user' ? 'white' : 'text.primary',
                  borderRadius: 3,
                  border: msg.sender === 'ai' ? '1px solid #e9ecef' : 'none',
                }}
              >
                <Typography variant="body1">
                  {msg.text}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                  {msg.timestamp.toLocaleTimeString()}
                </Typography>
              </Paper>
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your business needs (e.g., 'I need to improve customer management and increase sales')"
            variant="outlined"
            sx={{ 
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              }
            }}
          />
          <IconButton
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isAnalyzing}
            sx={{ 
              bgcolor: '#7442BF',
              color: 'white',
              '&:hover': { bgcolor: '#5e3399' },
              '&:disabled': { bgcolor: '#e0e0e0' }
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
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

                  {/* Revenue Streams */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Revenue Streams:
                    </Typography>
                    {product.revenueStreams.map((stream, idx) => (
                      <Typography key={idx} variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
                        • {stream}
                      </Typography>
                    ))}
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

                  {/* Success Stories */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Success Stories:
                    </Typography>
                    {product.successStories.map((story, idx) => (
                      <Typography key={idx} variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
                        📈 <strong>{story.company}:</strong> {story.result}
                      </Typography>
                    ))}
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
                      sx={{ flex: 1 }}
                    >
                      Learn More
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handlePurchase(product.id)}
                      sx={{ 
                        flex: 1,
                        background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5e3399 0%, #7b1fa2 100%)',
                        }
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
    </Container>
  );
} 