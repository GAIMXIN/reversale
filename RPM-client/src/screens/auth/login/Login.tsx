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
        // 模拟登录验证
        if (email === "test@example.com" && password === "123456") {
          // 模拟成功登录，生成一个假的 token
          const fakeToken = "fake-jwt-token-" + Math.random().toString(36).substring(7);
          login(fakeToken);
          navigate('/dashboard');
        } else {
          throw new Error('Invalid credentials');
        }
      } catch (err) {
        setError('Invalid email or password');
      }
    };
    
    
    
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
            <Box display="flex" alignItems="center" mb={4}>
              <Box 
                component="img" 
                src={logo} 
                alt="reversale" 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  mr: 2,
                  filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))'
                }} 
              />
              <Typography
                variant="h4"
                component="div"
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #7442BF 30%, #9C27B0 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '0.5px'
                }}
              >
                Reversale
              </Typography>
            </Box>

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
                  onClick={() => navigate("/register")}
                >
                  Register
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    );
  }
  