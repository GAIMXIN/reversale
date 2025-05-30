import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import {
  Build as BuildIcon,
  Code as CodeIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

const ToolsPlaceholder: React.FC = () => {
  const toolPlaceholders = [
    {
      id: 'tool-a',
      name: 'Tool A',
      description: 'Advanced utility module for enhanced productivity',
      icon: <BuildIcon sx={{ fontSize: 48, color: '#7442BF' }} />,
      status: 'Coming Soon',
    },
    {
      id: 'tool-b',
      name: 'Tool B',
      description: 'Analytics and reporting tools for better insights',
      icon: <AnalyticsIcon sx={{ fontSize: 48, color: '#7442BF' }} />,
      status: 'Coming Soon',
    },
    {
      id: 'tool-c',
      name: 'Tool C',
      description: 'Automation and workflow optimization suite',
      icon: <CodeIcon sx={{ fontSize: 48, color: '#7442BF' }} />,
      status: 'Coming Soon',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
          Tools
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Powerful utilities and modules to enhance your sales workflow and productivity.
        </Typography>
      </Box>

      {/* Tool Cards Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
        gap: 3 
      }}>
        {toolPlaceholders.map((tool) => (
          <Card 
            key={tool.id}
            sx={{ 
              borderRadius: 3, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Icon */}
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                {tool.icon}
              </Box>

              {/* Title */}
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#333', 
                  mb: 1,
                  textAlign: 'center'
                }}
              >
                {tool.name}
              </Typography>

              {/* Description */}
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary', 
                  mb: 2,
                  textAlign: 'center',
                  flex: 1
                }}
              >
                {tool.description}
              </Typography>

              {/* Status Badge */}
              <Box sx={{ textAlign: 'center', mt: 'auto' }}>
                <Chip 
                  label={tool.status}
                  size="small"
                  sx={{ 
                    bgcolor: '#f3e5f5',
                    color: '#7442BF',
                    fontWeight: 500,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Footer Info */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          More powerful tools and integrations are being developed. Stay tuned for updates!
        </Typography>
      </Box>
    </Box>
  );
};

export default ToolsPlaceholder; 