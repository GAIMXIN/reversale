import React, { useState } from "react";
import { ReactNode } from "react";
import { Box, Container } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          mt: 8, // 为顶部导航栏留出空间
          overflow: 'auto', // 防止内容溢出
          minWidth: 0, // 允许flex子项收缩
        }}
      >
        <Container maxWidth={false} sx={{ px: 0 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
