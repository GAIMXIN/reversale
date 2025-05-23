import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box, Avatar, Menu,
  MenuItem,
} from "@mui/material";
import { Link } from "wouter";
import { useNavigate } from "react-router-dom"
import logo from '../../assests/img/logo.png';

export function Navbar() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const providerObj = { nameTitle: "Dr."};
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user?.userType || localStorage.getItem("role");
  const providerUserName = user?.firstName || localStorage.getItem("userName");

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (e: any) => {
    e.preventDefault()
    setAnchorEl(null);
  };

  const handleLogout = (e: any) => {
    e.preventDefault()
    // setAnchorEl(null);
    localStorage.removeItem("user");
    navigate("/")
  };

  const userDisplayName = () => {
    const role = userRole?.toLowerCase();
    const name = providerUserName
      ? providerUserName.replace(/^"|"$/g, "")
      : "";

    if (role === "doctor") {
      return `${providerObj?.nameTitle || "Dr."} ${name}`;
    } else if (role === "patient") {
      return name;
    } else {
      return "";
    }
  };



  return (
    <AppBar color="default" sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* App Name / Logo */}
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            alignItems: "center"
          }}
        >
         <Box component="img" src={logo} alt="reversale" sx={{ width: 40, height: 40, mr: 1 }} />           Reversale
        </Typography>


        {/* Auth Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {providerObj ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <div>
                <Button onClick={handleMenuOpen} startIcon={<Avatar src={"/assets/img/profilePic.jpg"} />}>
                  {userDisplayName()}
                </Button>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClick={handleMenuClose}>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            </Box>
          ) : (
            <>            
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
