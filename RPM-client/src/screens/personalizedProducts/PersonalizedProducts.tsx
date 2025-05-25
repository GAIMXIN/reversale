import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Chip,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  features: string[];
  category: string;
}

export default function PersonalizedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // TODO: 调用API获取个性化产品推荐
        // const response = await fetchPersonalizedProducts();
        // setProducts(response.products);

        // 模拟API调用
        setTimeout(() => {
          setProducts([
            {
              id: '1',
              name: 'Business Analytics Dashboard',
              description: 'Comprehensive analytics dashboard to track your business performance and customer insights.',
              image: 'https://source.unsplash.com/random/400x300?dashboard',
              price: '$99/month',
              features: [
                'Real-time analytics',
                'Customer behavior tracking',
                'Sales forecasting',
                'Custom reports',
              ],
              category: 'Analytics',
            },
            {
              id: '2',
              name: 'Customer Relationship Management',
              description: 'Streamline your customer interactions and improve customer satisfaction.',
              image: 'https://source.unsplash.com/random/400x300?customer',
              price: '$149/month',
              features: [
                'Customer database',
                'Communication tools',
                'Task management',
                'Automated follow-ups',
              ],
              category: 'CRM',
            },
            {
              id: '3',
              name: 'Digital Marketing Suite',
              description: 'All-in-one digital marketing solution to boost your online presence.',
              image: 'https://source.unsplash.com/random/400x300?marketing',
              price: '$199/month',
              features: [
                'Social media management',
                'Email marketing',
                'SEO tools',
                'Content creation',
              ],
              category: 'Marketing',
            },
          ]);
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLearnMore = (productId: string) => {
    // TODO: 实现产品详情页面导航
    console.log('Learn more about product:', productId);
  };

  const handlePurchase = (productId: string) => {
    // TODO: 实现购买流程
    console.log('Purchase product:', productId);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Personalized Solutions
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Based on your business needs and goals, we've selected these solutions to help you grow.
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            md: 'repeat(3, 1fr)' 
          }, 
          gap: 3 
        }}>
          {products.map((product) => (
            <Card key={product.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {product.features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
                <Typography variant="h6" color="primary" gutterBottom>
                  {product.price}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<InfoIcon />}
                    onClick={() => handleLearnMore(product.id)}
                  >
                    Learn More
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handlePurchase(product.id)}
                  >
                    Get Started
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>
    </Container>
  );
} 