import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Send as SendIcon,
  Launch as LaunchIcon,
  QrCode as QrCodeIcon,
  Close as CloseIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  AttachMoney as PriceIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  timeline: string;
  rating: number;
  url: string;
  qrCode: string;
  features: string[];
  company: string;
  isPremium: boolean;
}

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'E-commerce Platform Pro',
    description: 'Complete e-commerce solution with advanced features including inventory management, payment processing, and analytics dashboard.',
    category: 'E-commerce',
    price: '$15,000 - $25,000',
    timeline: '8-12 weeks',
    rating: 4.8,
    url: 'https://demo.ecommerce-pro.com',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    features: ['Payment Integration', 'Inventory Management', 'Analytics', 'Mobile Responsive'],
    company: 'TechSolutions Inc.',
    isPremium: false,
  },
  {
    id: '2',
    name: 'Smart CRM System',
    description: 'AI-powered customer relationship management system with automation capabilities and advanced reporting.',
    category: 'CRM',
    price: '$12,000 - $20,000',
    timeline: '6-10 weeks',
    rating: 4.9,
    url: 'https://demo.smart-crm.com',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    features: ['AI Automation', 'Advanced Analytics', 'Lead Scoring', 'Integration APIs'],
    company: 'CRM Solutions Ltd.',
    isPremium: true,
  },
  {
    id: '3',
    name: 'Restaurant Management Suite',
    description: 'Complete restaurant management solution including POS, inventory, staff scheduling, and customer management.',
    category: 'Restaurant',
    price: '$8,000 - $15,000',
    timeline: '4-8 weeks',
    rating: 4.7,
    url: 'https://demo.restaurant-suite.com',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    features: ['POS System', 'Inventory Management', 'Staff Scheduling', 'Online Ordering'],
    company: 'RestaurantTech Pro',
    isPremium: true,
  },
  {
    id: '4',
    name: 'Medical Practice Manager',
    description: 'Comprehensive medical practice management system with patient records, appointment scheduling, and billing.',
    category: 'Medical',
    price: '$20,000 - $35,000',
    timeline: '10-16 weeks',
    rating: 4.6,
    url: 'https://demo.medical-manager.com',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    features: ['Patient Records', 'Appointment Scheduling', 'Billing System', 'HIPAA Compliant'],
    company: 'MedTech Solutions',
    isPremium: true,
  },
  {
    id: '5',
    name: 'Project Management Platform',
    description: 'Advanced project management tool with team collaboration, task tracking, and time management features.',
    category: 'Productivity',
    price: '$5,000 - $12,000',
    timeline: '3-6 weeks',
    rating: 4.5,
    url: 'https://demo.project-manager.com',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    features: ['Task Management', 'Team Collaboration', 'Time Tracking', 'Reporting'],
    company: 'ProductivityPlus',
    isPremium: false,
  },
  {
    id: '6',
    name: 'E-learning Management System',
    description: 'Complete online learning platform with course creation, student management, and assessment tools.',
    category: 'Education',
    price: '$10,000 - $18,000',
    timeline: '6-10 weeks',
    rating: 4.4,
    url: 'https://demo.learning-system.com',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    features: ['Course Creation', 'Student Management', 'Assessment Tools', 'Video Streaming'],
    company: 'EduTech Solutions',
    isPremium: true,
  },
  {
    id: '7',
    name: 'Inventory Management Pro',
    description: 'Advanced inventory tracking system with real-time monitoring, automated reordering, and analytics.',
    category: 'Inventory',
    price: '$7,000 - $14,000',
    timeline: '4-8 weeks',
    rating: 4.3,
    url: 'https://demo.inventory-pro.com',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    features: ['Real-time Tracking', 'Automated Reordering', 'Analytics Dashboard', 'Multi-location'],
    company: 'InventoryMaster',
    isPremium: false,
  },
  {
    id: '8',
    name: 'Digital Marketing Suite',
    description: 'Comprehensive digital marketing platform with SEO tools, social media management, and analytics.',
    category: 'Marketing',
    price: '$6,000 - $15,000',
    timeline: '5-9 weeks',
    rating: 4.7,
    url: 'https://demo.marketing-suite.com',
    qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    features: ['SEO Tools', 'Social Media Management', 'Email Marketing', 'Analytics'],
    company: 'MarketingPro Inc.',
    isPremium: true,
  },
];

const ProductRecommendations: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Get user query from navigation state
  const userQuery = location.state?.query || '';

  useEffect(() => {
    // Check login status (you can replace this with actual auth check)
    const token = localStorage.getItem('auth-token');
    setIsLoggedIn(!!token);
    
    // Show all products regardless of login status since this is now in a protected route
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.features.some(feature => 
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setDetailsDialogOpen(true);
  };

  const handleViewQrCode = (product: Product) => {
    setSelectedProduct(product);
    setQrDialogOpen(true);
  };

  const handleContactSalesman = (product: Product) => {
    navigate('/chat-salesman', { 
      state: { 
        product: product,
        userQuery: userQuery,
        type: 'product-recommendation'
      } 
    });
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'e-commerce': return '#e91e63';
      case 'crm': return '#2196f3';
      case 'restaurant': return '#ff9800';
      case 'medical': return '#4caf50';
      case 'productivity': return '#9c27b0';
      case 'education': return '#3f51b5';
      case 'inventory': return '#607d8b';
      case 'marketing': return '#ff5722';
      default: return '#7442BF';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        sx={{
          fontSize: 16,
          color: index < Math.floor(rating) ? '#ffc107' : '#e0e0e0'
        }}
      />
    ));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
          Discover Products & Solutions
        </Typography>
        <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
          {userQuery ? `Based on your requirements: "${userQuery}"` : 'Find the perfect platform or tool for your business needs'}
        </Typography>

        {/* Search Bar */}
        <Box sx={{ maxWidth: 500, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search products by name, category, features, or company..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#7442BF' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: 'white',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#7442BF',
                  },
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#7442BF',
                  },
                },
              },
            }}
          />
        </Box>

        {/* Search Results Summary */}
        {searchQuery && (
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            {filteredProducts.length === 0 
              ? `No products found for "${searchQuery}"`
              : `Found ${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'} for "${searchQuery}"`
            }
          </Typography>
        )}
      </Box>

      {/* Products Grid */}
      <Box sx={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'flex-start'
      }}>
        {filteredProducts.map((product) => (
          <Box 
            key={product.id}
            sx={{
              flex: '1 1 calc(33.333% - 16px)',
              minWidth: '300px',
              maxWidth: 'calc(50% - 16px)',
              '@media (max-width: 960px)': {
                flex: '1 1 calc(50% - 16px)',
                maxWidth: '100%'
              },
              '@media (max-width: 600px)': {
                flex: '1 1 100%',
                maxWidth: '100%'
              }
            }}
          >
            <Card sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(116, 66, 191, 0.15)',
              }
            }}>
              {product.isPremium && (
                <Chip
                  label="Premium"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    bgcolor: '#ffc107',
                    color: '#000',
                    fontWeight: 600,
                    zIndex: 1
                  }}
                />
              )}
              
              <CardContent sx={{ flex: 1, p: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 600, 
                    color: '#333',
                    mb: 1,
                    pr: product.isPremium ? 8 : 0
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

                {/* Description */}
                <Typography variant="body2" sx={{ 
                  color: '#666',
                  mb: 3,
                  lineHeight: 1.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {product.description}
                </Typography>

                {/* Features */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="caption" sx={{ color: '#7442BF', fontWeight: 600, mb: 1, display: 'block' }}>
                    Key Features:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {product.features.slice(0, 3).map((feature, index) => (
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
                    {product.features.length > 3 && (
                      <Chip
                        label={`+${product.features.length - 3} more`}
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: '0.7rem',
                          height: '24px',
                          borderColor: '#999',
                          color: '#999'
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Product Info */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1.5, 
                  mb: 3,
                  p: 2,
                  bgcolor: 'rgba(116, 66, 191, 0.03)',
                  borderRadius: 2,
                  border: '1px solid rgba(116, 66, 191, 0.1)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PriceIcon sx={{ fontSize: 18, color: '#7442BF' }} />
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
                      <span style={{ color: '#7442BF', fontWeight: 600 }}>{product.price}</span>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ScheduleIcon sx={{ fontSize: 18, color: '#7442BF' }} />
                    <Typography variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
                      <span style={{ color: '#7442BF', fontWeight: 600 }}>{product.timeline}</span>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <BusinessIcon sx={{ fontSize: 18, color: '#999' }} />
                    <Typography variant="body2" sx={{ color: '#999', fontWeight: 500 }}>
                      {product.company}
                    </Typography>
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 'auto' }}>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={() => handleContactSalesman(product)}
                    sx={{
                      bgcolor: '#7442BF',
                      '&:hover': { bgcolor: '#5e3399' },
                      fontWeight: 600
                    }}
                  >
                    Contact Sales
                  </Button>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(product)}
                      sx={{
                        flex: 1,
                        borderColor: '#7442BF',
                        color: '#7442BF',
                        fontSize: '0.75rem',
                        '&:hover': {
                          borderColor: '#5e3399',
                          bgcolor: 'rgba(116, 66, 191, 0.05)'
                        }
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<QrCodeIcon />}
                      onClick={() => handleViewQrCode(product)}
                      sx={{
                        flex: 1,
                        borderColor: '#7442BF',
                        color: '#7442BF',
                        fontSize: '0.75rem',
                        '&:hover': {
                          borderColor: '#5e3399',
                          bgcolor: 'rgba(116, 66, 191, 0.05)'
                        }
                      }}
                    >
                      QR Code
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Empty State */}
      {filteredProducts.length === 0 && searchQuery && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          px: 4 
        }}>
          <SearchIcon sx={{ 
            fontSize: 64, 
            color: '#ccc', 
            mb: 2 
          }} />
          <Typography variant="h6" sx={{ 
            color: '#666', 
            mb: 1,
            fontWeight: 500 
          }}>
            No products found
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#999',
            mb: 3 
          }}>
            Try searching with different keywords like "management", "e-commerce", or "analytics"
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setSearchQuery('')}
            sx={{
              borderColor: '#7442BF',
              color: '#7442BF',
              '&:hover': {
                borderColor: '#5e3399',
                bgcolor: 'rgba(116, 66, 191, 0.05)'
              }
            }}
          >
            Clear Search
          </Button>
        </Box>
      )}

      {/* Product Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, maxHeight: '90vh' }
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
            {selectedProduct?.name}
          </Typography>
          <IconButton onClick={() => setDetailsDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {selectedProduct && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Product Info */}
              <Box>
                <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.6, mb: 2 }}>
                  {selectedProduct.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chip
                    label={selectedProduct.category}
                    sx={{
                      bgcolor: getCategoryColor(selectedProduct.category),
                      color: 'white'
                    }}
                  />
                  {selectedProduct.isPremium && (
                    <Chip label="Premium" sx={{ bgcolor: '#ffc107', color: '#000' }} />
                  )}
                </Box>
              </Box>

              {/* All Features */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#7442BF', mb: 1 }}>
                  Features
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedProduct.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      variant="outlined"
                      sx={{
                        borderColor: '#7442BF',
                        color: '#7442BF'
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* URL */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#7442BF', mb: 1 }}>
                  Demo URL
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<LaunchIcon />}
                  onClick={() => window.open(selectedProduct.url, '_blank')}
                  sx={{
                    borderColor: '#7442BF',
                    color: '#7442BF',
                    '&:hover': {
                      borderColor: '#5e3399',
                      bgcolor: 'rgba(116, 66, 191, 0.05)'
                    }
                  }}
                >
                  {selectedProduct.url}
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e9ecef', gap: 2 }}>
          <Button
            onClick={() => setDetailsDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: '#ddd',
              color: '#666',
              '&:hover': { borderColor: '#bbb', bgcolor: '#f5f5f5' }
            }}
          >
            Close
          </Button>
          
          <Button
            onClick={() => {
              if (selectedProduct) {
                handleContactSalesman(selectedProduct);
                setDetailsDialogOpen(false);
              }
            }}
            variant="contained"
            startIcon={<SendIcon />}
            sx={{
              bgcolor: '#7442BF',
              '&:hover': { bgcolor: '#5e3399' }
            }}
          >
            Contact Sales
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
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
            QR Code - {selectedProduct?.name}
          </Typography>
          <IconButton onClick={() => setQrDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3, textAlign: 'center' }}>
          {selectedProduct && (
            <Box>
              <Box sx={{ 
                p: 3, 
                border: '2px solid #e0e0e0', 
                borderRadius: 2, 
                mb: 2,
                bgcolor: '#f9f9f9'
              }}>
                <img 
                  src={selectedProduct.qrCode} 
                  alt="QR Code"
                  style={{ 
                    width: '200px', 
                    height: '200px',
                    backgroundColor: '#fff',
                    padding: '16px'
                  }} 
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Scan this QR code to access the product demo
              </Typography>
              <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 1 }}>
                {selectedProduct.url}
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e9ecef' }}>
          <Button
            onClick={() => setQrDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: '#ddd',
              color: '#666',
              '&:hover': { borderColor: '#bbb', bgcolor: '#f5f5f5' }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductRecommendations; 