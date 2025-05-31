import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  Chat,
  TrendingUp,
  Analytics,
  Notifications,
  Settings,
  Person,
  Business,
  Star,
  Circle,
  Visibility,
  Message,
  Assignment,
  AttachMoney,
  Timeline,
  Restaurant,
  LocalHospital,
  Store,
  Computer,
  Build,
  School,
  DirectionsCar,
  Home,
  Spa,
  MoreVert,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// 接口定义
interface SalesmanData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  selectedField: string;
  performance: 'excellent' | 'good' | 'needs_improvement';
  activeClients: number;
  totalRevenue: number;
  conversionRate: number;
  clientSatisfaction: number;
  onlineStatus: 'online' | 'offline' | 'busy';
  lastActive: Date;
}

interface ClientData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  company: string;
  industry: string;
  status: 'active' | 'potential' | 'converted' | 'inactive';
  assignedSalesman: string;
  lastContact: Date;
  totalValue: number;
  satisfaction: number;
}

interface ConversationData {
  id: string;
  clientName: string;
  salesmanName: string;
  field: string;
  status: 'active' | 'pending' | 'completed';
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  priority: 'high' | 'medium' | 'low';
}

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [selectedConversation, setSelectedConversation] = useState<ConversationData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // 服务领域图标映射
  const fieldIcons: { [key: string]: any } = {
    restaurant: Restaurant,
    healthcare: LocalHospital,
    retail: Store,
    business: Business,
    technology: Computer,
    manufacturing: Build,
    education: School,
    automotive: DirectionsCar,
    realestate: Home,
    wellness: Spa,
  };

  // 模拟数据
  const [salesmanData] = useState<SalesmanData[]>([
    {
      id: 'sm1',
      name: 'Alex Johnson',
      email: 'alex@company.com',
      avatar: 'AJ',
      selectedField: 'restaurant',
      performance: 'excellent',
      activeClients: 8,
      totalRevenue: 285000,
      conversionRate: 68,
      clientSatisfaction: 4.7,
      onlineStatus: 'online',
      lastActive: new Date(),
    },
    {
      id: 'sm2',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      avatar: 'SC',
      selectedField: 'technology',
      performance: 'good',
      activeClients: 12,
      totalRevenue: 420000,
      conversionRate: 72,
      clientSatisfaction: 4.5,
      onlineStatus: 'online',
      lastActive: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: 'sm3',
      name: 'Mike Wilson',
      email: 'mike@company.com',
      avatar: 'MW',
      selectedField: 'healthcare',
      performance: 'good',
      activeClients: 6,
      totalRevenue: 195000,
      conversionRate: 65,
      clientSatisfaction: 4.3,
      onlineStatus: 'busy',
      lastActive: new Date(Date.now() - 1000 * 60 * 30),
    },
  ]);

  const [clientData] = useState<ClientData[]>([
    {
      id: 'cl1',
      name: 'John Smith',
      email: 'john@restaurant.com',
      avatar: 'JS',
      company: 'Smith\'s Bistro',
      industry: 'restaurant',
      status: 'active',
      assignedSalesman: 'Alex Johnson',
      lastContact: new Date(Date.now() - 1000 * 60 * 30),
      totalValue: 45000,
      satisfaction: 5,
    },
    {
      id: 'cl2',
      name: 'Emily Davis',
      email: 'emily@techstart.com',
      avatar: 'ED',
      company: 'TechStart Inc',
      industry: 'technology',
      status: 'potential',
      assignedSalesman: 'Sarah Chen',
      lastContact: new Date(Date.now() - 1000 * 60 * 60 * 2),
      totalValue: 120000,
      satisfaction: 4,
    },
    {
      id: 'cl3',
      name: 'Dr. Robert Lee',
      email: 'robert@clinic.com',
      avatar: 'RL',
      company: 'City Medical Clinic',
      industry: 'healthcare',
      status: 'converted',
      assignedSalesman: 'Mike Wilson',
      lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24),
      totalValue: 85000,
      satisfaction: 4,
    },
  ]);

  const [conversationData] = useState<ConversationData[]>([
    {
      id: 'conv1',
      clientName: 'John Smith',
      salesmanName: 'Alex Johnson',
      field: 'restaurant',
      status: 'active',
      lastMessage: 'I need help optimizing my restaurant operations...',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      messageCount: 24,
      priority: 'high',
    },
    {
      id: 'conv2',
      clientName: 'Emily Davis',
      salesmanName: 'Sarah Chen',
      field: 'technology',
      status: 'pending',
      lastMessage: 'Can you help me with software development strategy?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      messageCount: 8,
      priority: 'medium',
    },
    {
      id: 'conv3',
      clientName: 'Dr. Robert Lee',
      salesmanName: 'Mike Wilson',
      field: 'healthcare',
      status: 'completed',
      lastMessage: 'Thank you for the excellent consultation!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      messageCount: 15,
      priority: 'low',
    },
  ]);

  // 统计数据
  const totalSalesmen = salesmanData.length;
  const totalClients = clientData.length;
  const activeConversations = conversationData.filter(conv => conv.status === 'active').length;
  const totalRevenue = salesmanData.reduce((sum, sm) => sum + sm.totalRevenue, 0);
  const avgSatisfaction = clientData.reduce((sum, cl) => sum + cl.satisfaction, 0) / clientData.length;

  const statsData = [
    { label: 'Total Salesmen', value: totalSalesmen.toString(), icon: People, color: '#7442BF' },
    { label: 'Total Clients', value: totalClients.toString(), icon: Business, color: '#9C27B0' },
    { label: 'Active Conversations', value: activeConversations.toString(), icon: Chat, color: '#E91E63' },
    { label: 'Total Revenue', value: `$${(totalRevenue / 1000).toFixed(0)}K`, icon: AttachMoney, color: '#FF6B6B' },
  ];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4caf50';
      case 'busy': return '#ff9800';
      case 'offline': return '#9e9e9e';
      case 'active': return '#2196f3';
      case 'potential': return '#ff9800';
      case 'converted': return '#4caf50';
      case 'inactive': return '#9e9e9e';
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return '#4caf50';
      case 'good': return '#2196f3';
      case 'needs_improvement': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const handleConversationView = (conversation: ConversationData) => {
    setSelectedConversation(conversation);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f8f9fa',
      pt: 2
    }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* 头部区域 */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 2
          }}>
            <IconButton sx={{ bgcolor: 'white', boxShadow: 2 }}>
              <Badge badgeContent={5} color="error">
                <Notifications color="primary" />
              </Badge>
            </IconButton>
            <IconButton sx={{ bgcolor: 'white', boxShadow: 2 }}>
              <Settings color="primary" />
            </IconButton>
          </Box>
        </Box>

        {/* 统计卡片 */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          {statsData.map((stat, index) => (
            <Card key={index} sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
              border: `1px solid ${stat.color}20`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${stat.color}25`,
              }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <stat.icon sx={{ fontSize: 32, color: stat.color }} />
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* 主要内容区域 */}
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{ mb: 3 }}
          >
            <Tab label="Salesman Overview" />
            <Tab label="Client Management" />
            <Tab label="Conversation Monitoring" />
            <Tab label="Performance Analysis" />
          </Tabs>

          {/* 销售员概览 */}
          {tabValue === 0 && (
            <Box>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <People color="primary" />
                    Salesman Status Overview
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Salesman</TableCell>
                          <TableCell>Professional Field</TableCell>
                          <TableCell>Online Status</TableCell>
                          <TableCell>Active Clients</TableCell>
                          <TableCell>Total Revenue</TableCell>
                          <TableCell>Conversion Rate</TableCell>
                          <TableCell>Client Satisfaction</TableCell>
                          <TableCell>Performance Rating</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {salesmanData.map((salesman) => {
                          const FieldIcon = fieldIcons[salesman.selectedField];
                          return (
                            <TableRow key={salesman.id}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                  <Avatar sx={{ bgcolor: '#7442BF' }}>
                                    {salesman.avatar}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                      {salesman.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {salesman.email}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {FieldIcon && <FieldIcon sx={{ fontSize: 20, color: '#7442BF' }} />}
                                  <Typography variant="body2">
                                    {salesman.selectedField}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Circle sx={{ 
                                    fontSize: 12, 
                                    color: getStatusColor(salesman.onlineStatus) 
                                  }} />
                                  <Typography variant="body2">
                                    {salesman.onlineStatus === 'online' ? 'Online' : 
                                     salesman.onlineStatus === 'busy' ? 'Busy' : 'Offline'}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>{salesman.activeClients}</TableCell>
                              <TableCell>${(salesman.totalRevenue / 1000).toFixed(0)}K</TableCell>
                              <TableCell>{salesman.conversionRate}%</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                                  <Typography variant="body2">
                                    {salesman.clientSatisfaction.toFixed(1)}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={
                                    salesman.performance === 'excellent' ? 'Excellent' :
                                    salesman.performance === 'good' ? 'Good' : 'Needs Improvement'
                                  }
                                  size="small"
                                  sx={{ 
                                    bgcolor: getPerformanceColor(salesman.performance) + '20',
                                    color: getPerformanceColor(salesman.performance),
                                    fontWeight: 600
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* 客户管理 */}
          {tabValue === 1 && (
            <Box>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Business color="primary" />
                    Client Management Overview
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Client</TableCell>
                          <TableCell>Company</TableCell>
                          <TableCell>Industry</TableCell>
                          <TableCell>Assigned Salesman</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Last Contact</TableCell>
                          <TableCell>Project Value</TableCell>
                          <TableCell>Satisfaction</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {clientData.map((client) => (
                          <TableRow key={client.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: '#9C27B0' }}>
                                  {client.avatar}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {client.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {client.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>{client.company}</TableCell>
                            <TableCell>
                              <Chip 
                                label={client.industry}
                                size="small"
                                sx={{ bgcolor: '#E91E6320', color: '#E91E63' }}
                              />
                            </TableCell>
                            <TableCell>{client.assignedSalesman}</TableCell>
                            <TableCell>
                              <Chip 
                                label={
                                  client.status === 'active' ? 'Active' :
                                  client.status === 'potential' ? 'Potential' :
                                  client.status === 'converted' ? 'Converted' : 'Inactive'
                                }
                                size="small"
                                sx={{ 
                                  bgcolor: getStatusColor(client.status) + '20',
                                  color: getStatusColor(client.status),
                                  fontWeight: 600
                                }}
                              />
                            </TableCell>
                            <TableCell>{formatTime(client.lastContact)}</TableCell>
                            <TableCell>${(client.totalValue / 1000).toFixed(0)}K</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star}
                                    sx={{ 
                                      fontSize: 16,
                                      color: star <= client.satisfaction ? '#ffc107' : '#e0e0e0'
                                    }}
                                  />
                                ))}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* 对话监控 */}
          {tabValue === 2 && (
            <Box>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chat color="primary" />
                    Real-time Conversation Monitoring
                  </Typography>
                  <List>
                    {conversationData.map((conversation, index) => {
                      const FieldIcon = fieldIcons[conversation.field];
                      return (
                        <React.Fragment key={conversation.id}>
                          <ListItem
                            sx={{ 
                              bgcolor: conversation.status === 'active' ? '#f8f9fa' : 'transparent',
                              borderRadius: 2,
                              mb: 1
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: '#7442BF' }}>
                                <Chat />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {conversation.clientName} ↔ {conversation.salesmanName}
                                  </Typography>
                                  <Chip 
                                    label={conversation.priority === 'high' ? 'High Priority' : 
                                           conversation.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                                    size="small"
                                    sx={{ 
                                      bgcolor: getStatusColor(conversation.priority) + '20',
                                      color: getStatusColor(conversation.priority),
                                      fontWeight: 600
                                    }}
                                  />
                                  {FieldIcon && <FieldIcon sx={{ fontSize: 16, color: '#7442BF' }} />}
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    {conversation.lastMessage}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      {formatTime(conversation.timestamp)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {conversation.messageCount} messages
                                    </Typography>
                                    <Chip 
                                      label={
                                        conversation.status === 'active' ? 'In Progress' :
                                        conversation.status === 'pending' ? 'Waiting' : 'Completed'
                                      }
                                      size="small"
                                      variant="outlined"
                                    />
                                  </Box>
                                </Box>
                              }
                            />
                            <IconButton 
                              onClick={() => handleConversationView(conversation)}
                              sx={{ ml: 1 }}
                            >
                              <Visibility />
                            </IconButton>
                          </ListItem>
                          {index < conversationData.length - 1 && <Divider />}
                        </React.Fragment>
                      );
                    })}
                  </List>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* 性能分析 */}
          {tabValue === 3 && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUp color="primary" />
                      Revenue Analysis
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      {salesmanData.map((salesman) => (
                        <Box key={salesman.id} sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{salesman.name}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              ${(salesman.totalRevenue / 1000).toFixed(0)}K
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={(salesman.totalRevenue / 500000) * 100}
                            sx={{ 
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'grey.200',
                              '& .MuiLinearProgress-bar': {
                                background: `linear-gradient(90deg, ${getPerformanceColor(salesman.performance)}, ${getPerformanceColor(salesman.performance)}80)`,
                                borderRadius: 4
                              }
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Analytics color="primary" />
                      Client Satisfaction
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#7442BF' }}>
                          {avgSatisfaction.toFixed(1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Average Client Satisfaction
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 1 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              sx={{ 
                                fontSize: 24,
                                color: star <= Math.floor(avgSatisfaction) ? '#ffc107' : '#e0e0e0'
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                      
                      {clientData.map((client) => (
                        <Box key={client.id} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{client.name}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Star sx={{ fontSize: 16, color: '#ffc107' }} />
                              <Typography variant="body2">{client.satisfaction}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}
        </Box>

        {/* 对话详情对话框 */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Conversation Details
          </DialogTitle>
          <DialogContent>
            {selectedConversation && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedConversation.clientName} ↔ {selectedConversation.salesmanName}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Field: {selectedConversation.field} | Status: {selectedConversation.status} | Priority: {selectedConversation.priority}
                </Typography>
                <Typography variant="body1" paragraph>
                  Last Message: {selectedConversation.lastMessage}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Messages: {selectedConversation.messageCount} | Last Updated: {formatTime(selectedConversation.timestamp)}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
            <Button variant="contained" onClick={() => setDialogOpen(false)}>
              View Full Conversation
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard; 