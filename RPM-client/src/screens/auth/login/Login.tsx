import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Link,
    Paper,
    Alert
  } from "@mui/material";
  import { Visibility, VisibilityOff } from "@mui/icons-material";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import logo from '../../../assests/img/logo.png';
  import { useAuth } from '../../../contexts/AuthContext';
  
  
  export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [error, setError] = useState('');
  
    const navigate = useNavigate();
    const { login } = useAuth();

    const API_BASE_URL = "http://localhost:2000/api/v1";

  
    const validate = () => {
      let valid = true;
      const newErrors = { email: "", password: "" };
  
      if (!email) {
        newErrors.email = "Email is required.";
        valid = false;
      } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        newErrors.email = "Enter a valid email address.";
        valid = false;
      }
  
      if (!password) {
        newErrors.password = "Password is required.";
        valid = false;
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
        valid = false;
      }
  
      setErrors(newErrors);
      return valid;
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!validate()) return;

      try {
        // 模拟登录验证 - 支持test用户和salesperson
        if (email === "test@example.com" && password === "123456") {
          // test用户登录
          const fakeToken = "fake-jwt-token-" + Math.random().toString(36).substring(7);
          const testUser = {
            id: "test-user-1",
            email: email,
            userType: 'test' as const,
            name: "Test User"
          };
          login(fakeToken, testUser);
          navigate('/');
        } else if (email === "salesman@example.com" && password === "123456") {
          // salesperson用户登录
          const fakeToken = "fake-jwt-token-" + Math.random().toString(36).substring(7);
          const salespersonUser = {
            id: "salesperson-user-1",
            email: email,
            userType: 'salesperson' as const,
            name: "Sales Representative"
          };
          login(fakeToken, salespersonUser);
          navigate('/sales/dashboard');
        } else if (email === "admin@example.com" && password === "12345678") {
          // admin用户登录
          const fakeToken = "fake-jwt-token-" + Math.random().toString(36).substring(7);
          const adminUser = {
            id: "admin-user-1",
            email: email,
            userType: 'admin' as const,
            name: "Administrator"
          };
          login(fakeToken, adminUser);
          navigate('/admin/dashboard');
        } else {
          throw new Error('Invalid credentials');
        }
      } catch (err) {
        setError('Invalid email or password. Try test@example.com, salesman@example.com, or admin@example.com with their respective passwords');
      }
    };
    
    
    
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
            <Box component="form" onSubmit={handleSubmit} mt={4} width="100%">
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Typography variant="subtitle1" gutterBottom>
                Email Address *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                
                placeholder="Enter your email"
                error={!!errors.email}
                helperText={errors.email}
              />
    
              <Typography variant="subtitle1" mt={3} gutterBottom>
                Password *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }
                }}
                placeholder="Enter your password"
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
    
              <Box textAlign="right" mt={1}>
                <Typography
                  variant="body2"
                  sx={{ cursor: "pointer", color: "#7442BF" }}
                  onClick={() => navigate("/unavailable")}
                >
                  Forgot Password?
                </Typography>
              </Box>
    
              <Box textAlign="center" mt={4}>
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  sx={{ borderRadius: 50, px: 5, py: 1.5, bgcolor: '#7442BF', borderColor: '#7442BF', '&:hover': { bgcolor: '#5e3399' } }}
                >
                  Login
                </Button>
              </Box>
    
              <Box textAlign="center" mt={3}>
                <Typography variant="body2">Don't have an account?</Typography>
                <Typography
                  variant="body2"
                  sx={{ cursor: "pointer", color: "#7442BF" }}
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    );
  }
  