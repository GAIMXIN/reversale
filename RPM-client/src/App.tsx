import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Register from './screens/auth/register/Register';
import Login from './screens/auth/login/Login';
import Dashboard from './screens/dashboard/Dashboard';
import SalesmanDashboard from './screens/dashboard/SalesmanDashboard';
import ContactSalesman from './screens/contactSalesman/ContactSalesman';
import BusinessInsights from './screens/businessInsights/BusinessInsights';
import PersonalizedProducts from './screens/personalizedProducts/PersonalizedProducts';
import MainLayout from './screens/layout/MainLayout';
import SalesmanLayout from './screens/layout/SalesmanLayout';
import ChatScreen from './screens/chat/ChatScreen';
import SalesmanChatScreen from './screens/chat/SalesmanChatScreen';
import ChatLayout from './screens/layout/ChatLayout';

// Protected Chat Component for regular users
const ProtectedChat: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Redirect salesman users to their dashboard
  if (isAuthenticated && user?.userType === 'salesman') {
    return <Navigate to="/salesman-dashboard" replace />;
  }
  
  return (
    <ChatLayout>
      <ChatScreen isAuthenticated={isAuthenticated} />
    </ChatLayout>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedUserTypes?: ('test' | 'salesman')[] }> = ({ 
  children, 
  allowedUserTypes = ['test', 'salesman'] 
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user && !allowedUserTypes.includes(user.userType)) {
    // Redirect to appropriate dashboard based on user type
    if (user.userType === 'salesman') {
      return <Navigate to="/salesman-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Regular user routes */}
            <Route path="/" element={<ProtectedChat />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute allowedUserTypes={['test']}>
                  <ChatLayout><Dashboard /></ChatLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contact-salesman" 
              element={
                <ProtectedRoute allowedUserTypes={['test']}>
                  <ChatLayout><ContactSalesman /></ChatLayout>
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
            
            {/* Salesman routes */}
            <Route 
              path="/salesman-dashboard" 
              element={
                <ProtectedRoute allowedUserTypes={['salesman']}>
                  <SalesmanLayout><SalesmanDashboard /></SalesmanLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/salesman-chat" 
              element={
                <ProtectedRoute allowedUserTypes={['salesman']}>
                  <SalesmanChatScreen />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
