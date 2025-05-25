import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import StarIcon from '@mui/icons-material/Star';

interface BusinessData {
  businessName: string;
  businessDescription: string;
  businessAddress: string;
}

interface Insight {
  type: 'positive' | 'negative' | 'suggestion';
  title: string;
  description: string;
}

export default function BusinessInsights() {
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 使用模拟数据
        setBusinessData({
          businessName: "Sample Business",
          businessDescription: "A leading provider of innovative solutions",
          businessAddress: "123 Business Street, City, Country"
        });

        // 模拟API调用
        setTimeout(() => {
          setInsights([
            {
              type: 'positive',
              title: 'Strong Online Presence',
              description: 'Your business has a good online presence with positive customer reviews.',
            },
            {
              type: 'negative',
              title: 'Limited Operating Hours',
              description: 'Consider extending your business hours to capture more customers.',
            },
            {
              type: 'suggestion',
              title: 'Digital Marketing Opportunity',
              description: 'Implement a social media marketing strategy to reach more potential customers.',
            },
            {
              type: 'suggestion',
              title: 'Customer Loyalty Program',
              description: 'Develop a loyalty program to increase customer retention.',
            },
          ]);
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Error fetching business insights:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <TrendingUpIcon color="success" />;
      case 'negative':
        return <WarningIcon color="error" />;
      case 'suggestion':
        return <LightbulbIcon color="primary" />;
      default:
        return <StarIcon />;
    }
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
          Business Insights
        </Typography>

        {businessData && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {businessData.businessName}
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {businessData.businessDescription}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {businessData.businessAddress}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Insights
              </Typography>
              <List>
                {insights.map((insight, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        {getInsightIcon(insight.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={insight.title}
                        secondary={insight.description}
                      />
                    </ListItem>
                    {index < insights.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recommended Actions
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <LightbulbIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Implement Digital Marketing Strategy"
                    secondary="Develop a comprehensive social media marketing plan to increase online visibility."
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <LightbulbIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Optimize Business Hours"
                    secondary="Analyze peak hours and adjust operating schedule accordingly."
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <LightbulbIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Enhance Customer Experience"
                    secondary="Implement a customer feedback system to improve service quality."
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </Paper>
    </Container>
  );
} 