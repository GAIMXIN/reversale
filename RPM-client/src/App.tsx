import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { RequestProvider } from './contexts/RequestContext';
import { useAuth } from './contexts/AuthContext';
import Register from './screens/auth/register/Register';
import Login from './screens/auth/login/Login';
import BusinessInsights from './screens/businessInsights/BusinessInsights';
import PersonalizedProducts from './screens/personalizedProducts/PersonalizedProducts';
import Billing from './screens/billing/Billing';
import RequestReview from './screens/requestReview/RequestReview';
import PostListView from './screens/posts/PostListView';
import PostDetailPage from './screens/posts/PostDetailPage';
import Inbox from './screens/inbox/Inbox';
import ProfileSettings from './screens/profile/ProfileSettings';
import MainLayout from './screens/layout/MainLayout';
import ChatScreen from './screens/chat/ChatScreen';
import ChatLayout from './screens/layout/ChatLayout';
import SalesLayout from './components/SalesLayout';
import SalesDashboard from './screens/sales/SalesDashboard';
import SalesLeads from './screens/sales/SalesLeads';
import SalesDeals from './screens/sales/SalesDeals';
import SalesEarnings from './screens/sales/SalesEarnings';
import SalesInbox from './screens/sales/SalesInbox';
import SalesSettings from './screens/sales/SalesSettings';
import DraftEdit from './screens/sales/DraftEdit';
import MassEmailSender from './screens/tools/MassEmailSender';
import ToolsPlaceholder from './screens/tools/ToolsPlaceholder';
import './App.css';

// Protected Chat Component for regular users
const ProtectedChat: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Redirect salesperson users to their dashboard
  if (isAuthenticated && user?.userType === 'salesperson') {
    return <Navigate to="/sales/dashboard" replace />;
  }
  
  return (
    <ChatLayout>
      <ChatScreen isAuthenticated={isAuthenticated} />
    </ChatLayout>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedUserTypes?: ('test' | 'salesperson')[] }> = ({ 
  children, 
  allowedUserTypes = ['test'] 
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedUserTypes && user?.userType && !allowedUserTypes.includes(user.userType)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <RequestProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/register" element={<Register />} />
              <Route path="/signup" element={<Register />} />
              <Route path="/login" element={<Login />} />
              
              {/* Regular user routes */}
              <Route path="/" element={<ProtectedChat />} />
              <Route 
                path="/request-review/:id" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <RequestReview />
                  </ProtectedRoute>
                } 
              />
              
              {/* Post Routes */}
              <Route 
                path="/posts/:id" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <PostDetailPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Post Status Views - Single parameterized route */}
              <Route 
                path="/posts/status/:status" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><PostListView /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Legacy support - redirect old routes to new parameterized route */}
              <Route path="/posts/draft" element={<Navigate to="/posts/status/draft" replace />} />
              <Route path="/posts/sent" element={<Navigate to="/posts/status/sent" replace />} />
              <Route path="/posts/ongoing" element={<Navigate to="/posts/status/ongoing" replace />} />
              <Route path="/posts/completed" element={<Navigate to="/posts/status/completed" replace />} />
              
              {/* Inbox Route */}
              <Route 
                path="/inbox" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><Inbox /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Profile Settings Route */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><ProfileSettings /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/support" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><Inbox /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/business-insights" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><BusinessInsights /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/personalized-products" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><PersonalizedProducts /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/markets" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><PersonalizedProducts /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/billing" 
                element={
                  <ProtectedRoute allowedUserTypes={['test']}>
                    <ChatLayout><Billing /></ChatLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Sales routes - New commission-first sales architecture */}
              <Route 
                path="/sales/dashboard" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><SalesDashboard /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/leads" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><SalesLeads /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/deals" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><SalesDeals /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/earnings" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><SalesEarnings /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/inbox" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><SalesInbox /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/settings" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><SalesSettings /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/leads/:leadId/drafts/:draftId" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><DraftEdit /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/outreach/email-sender" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><MassEmailSender /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sales/tools" 
                element={
                  <ProtectedRoute allowedUserTypes={['salesperson']}>
                    <SalesLayout><ToolsPlaceholder /></SalesLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </RequestProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
