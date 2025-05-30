import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  LinearProgress,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import StarIcon from '@mui/icons-material/Star';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import GroupIcon from '@mui/icons-material/Group';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssessmentIcon from '@mui/icons-material/Assessment';

interface BusinessData {
  businessName: string;
  businessDescription: string;
  businessAddress: string;
}

interface Insight {
  type: 'positive' | 'negative' | 'suggestion';
  title: string;
  description: string;
  revenueIncrease?: string;
  customerIncrease?: string;
  timeframe?: string;
  priority?: 'high' | 'medium' | 'low';
  revenueSource?: string[];
  monthlyRevenue?: number;
  yearlyRevenue?: number;
  successProbability?: number;
}

interface GrowthProjection {
  category: string;
  currentRevenue: number;
  projectedRevenue: number;
  currentCustomers: number;
  projectedCustomers: number;
  timeframe: string;
  confidence: number;
  revenueSources: string[];
  icon: string;
  color: string;
}

export default function BusinessInsights() {
  const [businessData] = useState<BusinessData>({
    businessName: "Tech Innovations Ltd",
    businessDescription: "A leading provider of innovative technology solutions",
    businessAddress: "123 Business District, Tech City"
  });

  const [insights] = useState<Insight[]>([
    {
      type: 'suggestion',
      title: 'Digital Marketing Automation',
      description: 'Implement AI-powered marketing automation to reach targeted audiences and improve conversion rates through personalized campaigns.',
      revenueIncrease: '+$20,000',
      customerIncrease: '+300 customers',
      timeframe: '6 months',
      priority: 'high',
      monthlyRevenue: 20000,
      yearlyRevenue: 240000,
      successProbability: 85,
      revenueSource: [
        'Online advertising optimization: +$8,500/month',
        'SEO traffic generation: +$6,200/month', 
        'Social media marketing: +$3,800/month',
        'Content marketing ROI: +$1,500/month'
      ]
    },
    {
      type: 'suggestion',
      title: 'Extended Operating Hours',
      description: 'Extending business hours to capture evening and weekend customers, increasing market accessibility and service availability.',
      revenueIncrease: '+$11,000',
      customerIncrease: '+175 customers',
      timeframe: '3 months',
      priority: 'high',
      monthlyRevenue: 11000,
      yearlyRevenue: 132000,
      successProbability: 92,
      revenueSource: [
        'Evening services: +$5,800/month',
        'Weekend operations: +$3,200/month',
        'Holiday special services: +$1,500/month',
        'Express service fees: +$500/month'
      ]
    },
    {
      type: 'suggestion',
      title: 'Customer Loyalty Program',
      description: 'Develop a comprehensive loyalty program to increase customer retention, repeat purchases, and referral generation.',
      revenueIncrease: '+$9,000',
      customerIncrease: '+60 customers',
      timeframe: '4 months',
      priority: 'medium',
      monthlyRevenue: 9000,
      yearlyRevenue: 108000,
      successProbability: 78,
      revenueSource: [
        'Membership renewals: +$4,200/month',
        'Referral rewards: +$2,800/month',
        'Points redemption boost: +$1,500/month',
        'Member exclusive services: +$500/month'
      ]
    }
  ]);

  const [growthProjections] = useState<GrowthProjection[]>([
    {
      category: 'Digital Marketing',
      currentRevenue: 50000,
      projectedRevenue: 70000,
      currentCustomers: 500,
      projectedCustomers: 800,
      timeframe: '6 months',
      confidence: 85,
      revenueSources: ['Online advertising', 'SEO optimization', 'Social media marketing', 'Content marketing'],
      icon: '📱',
      color: '#7442BF'
    },
    {
      category: 'Extended Hours',
      currentRevenue: 50000,
      projectedRevenue: 61000,
      currentCustomers: 500,
      projectedCustomers: 675,
      timeframe: '3 months',
      confidence: 92,
      revenueSources: ['Evening services', 'Weekend operations', 'Holiday special services', 'Express service fees'],
      icon: '⏰',
      color: '#2196F3'
    },
    {
      category: 'Loyalty Program',
      currentRevenue: 50000,
      projectedRevenue: 59000,
      currentCustomers: 500,
      projectedCustomers: 560,
      timeframe: '4 months',
      confidence: 78,
      revenueSources: ['Membership renewals', 'Points redemption', 'Referral rewards', 'Member exclusive services'],
      icon: '🎯',
      color: '#FF9800'
    }
  ]);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Container 
      maxWidth={false}
      sx={{ 
        mt: 8, 
        mb: 4,
        px: 0,
        width: '100%',
      }}
    >
      {/* Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        background: 'linear-gradient(135deg, #7442BF 0%, #9C27B0 100%)', 
        color: 'white' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <AssessmentIcon sx={{ fontSize: 40 }} />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Business Growth Solutions & Revenue Analysis
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {businessData.businessName}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {businessData.businessDescription}
          </Typography>
        </Box>
      </Paper>

      {/* Growth Projections Overview */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimelineIcon color="primary" />
          Revenue Growth Projections
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3
        }}>
          {growthProjections.map((projection, index) => (
            <Card key={index} sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '2px solid #e9ecef',
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                borderColor: projection.color
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="h4" sx={{ fontSize: '2rem' }}>
                    {projection.icon}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ color: projection.color, fontWeight: 600 }}>
                    {projection.category}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Revenue Growth
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(projection.currentRevenue)} → {formatCurrency(projection.projectedRevenue)}
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ color: projection.color, textAlign: 'center', mb: 1, fontWeight: 700 }}>
                    +{formatCurrency(projection.projectedRevenue - projection.currentRevenue)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Customer Growth
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {projection.currentCustomers} → {projection.projectedCustomers}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="info.main" sx={{ textAlign: 'center', mb: 1 }}>
                    +{projection.projectedCustomers - projection.currentCustomers} customers
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Revenue Sources:
                  </Typography>
                  {projection.revenueSources.map((source, idx) => (
                    <Chip 
                      key={idx}
                      label={source}
                      size="small"
                      sx={{ 
                        mr: 0.5, 
                        mb: 0.5,
                        bgcolor: `${projection.color}15`,
                        color: projection.color,
                        border: `1px solid ${projection.color}30`
                      }}
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Success Probability: {projection.confidence}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={projection.confidence}
                    sx={{ 
                      height: 10,
                      borderRadius: 5,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        background: projection.confidence >= 80 
                          ? `linear-gradient(90deg, ${projection.color}, ${projection.color}CC)`
                          : `linear-gradient(90deg, #ff9800, #ffc107)`,
                        borderRadius: 5
                      }
                    }}
                  />
                </Box>

                <Chip 
                  label={`Timeline: ${projection.timeframe}`}
                  size="small"
                  sx={{ 
                    bgcolor: projection.color,
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      {/* Detailed Revenue Solutions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LightbulbIcon color="primary" />
          Detailed Revenue Solutions
        </Typography>
        
        <List>
          {insights.map((insight, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ 
                py: 3,
                bgcolor: index % 2 === 0 ? 'transparent' : '#f8f9fa',
                borderRadius: 2,
                mb: 1
              }}>
                <ListItemIcon>
                  {getInsightIcon(insight.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h6" component="span">
                        {insight.title}
                      </Typography>
                      {insight.priority && (
                        <Chip 
                          label={`${insight.priority} priority`}
                          size="small"
                          color={getPriorityColor(insight.priority)}
                          variant="outlined"
                        />
                      )}
                      {insight.successProbability && (
                        <Chip 
                          label={`${insight.successProbability}% success rate`}
                          size="small"
                          sx={{ 
                            bgcolor: insight.successProbability >= 80 ? '#4caf50' : '#ff9800',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                        {insight.description}
                      </Typography>
                      
                      {/* Revenue Details */}
                      <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                        gap: 2,
                        mt: 2,
                        mb: 2
                      }}>
                        {insight.revenueIncrease && (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            p: 2,
                            bgcolor: 'success.light',
                            borderRadius: 2,
                            color: 'success.contrastText'
                          }}>
                            <AttachMoneyIcon />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Revenue Increase
                              </Typography>
                              <Typography variant="h6">
                                {insight.revenueIncrease}
                              </Typography>
                              {insight.monthlyRevenue && (
                                <Typography variant="caption">
                                  +${insight.monthlyRevenue.toLocaleString()}/month
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        )}
                        
                        {insight.customerIncrease && (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            p: 2,
                            bgcolor: 'info.light',
                            borderRadius: 2,
                            color: 'info.contrastText'
                          }}>
                            <GroupIcon />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Customer Growth
                              </Typography>
                              <Typography variant="h6">
                                {insight.customerIncrease}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                        
                        {insight.timeframe && (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            p: 2,
                            bgcolor: 'warning.light',
                            borderRadius: 2,
                            color: 'warning.contrastText'
                          }}>
                            <TimelineIcon />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Implementation Time
                              </Typography>
                              <Typography variant="h6">
                                {insight.timeframe}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>

                      {/* Success Probability Bar */}
                      {insight.successProbability && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Success Probability: {insight.successProbability}%
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={insight.successProbability}
                            sx={{ 
                              height: 10,
                              borderRadius: 5,
                              bgcolor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                background: insight.successProbability >= 80 
                                  ? 'linear-gradient(90deg, #4caf50, #8bc34a)'
                                  : insight.successProbability >= 60
                                  ? 'linear-gradient(90deg, #ff9800, #ffc107)'
                                  : 'linear-gradient(90deg, #f44336, #ff5722)',
                                borderRadius: 5
                              }
                            }}
                          />
                        </Box>
                      )}

                      {/* Revenue Sources */}
                      {insight.revenueSource && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'primary.main' }}>
                            💰 Revenue Sources Breakdown:
                          </Typography>
                          <Box sx={{ pl: 2 }}>
                            {insight.revenueSource.map((source, idx) => (
                              <Typography key={idx} variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
                                • {source}
                              </Typography>
                            ))}
                          </Box>
                          {insight.yearlyRevenue && (
                            <Typography variant="body2" sx={{ mt: 1, fontWeight: 600, color: 'success.main' }}>
                              📈 Annual Revenue Potential: +${insight.yearlyRevenue.toLocaleString()}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < insights.length - 1 && <Divider sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Container>
  );
} 