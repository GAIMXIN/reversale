import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress,
  FormHelperText,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import logo from '../../../assests/img/logo.png';

export default function RegisterScreen() {
  const navigate = useNavigate();

  const [role, setrole] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    role: "",
    first: "",
    last: "",
    email: "",
    password: "",
  });
  const API_BASE_URL = "http://localhost:2000/api/v1";
  const validate = () => {
    const newErrors: typeof errors = {
      role: "",
      first: "",
      last: "",
      email: "",
      password: "",
    };
    let valid = true;

    if (!role) {
      newErrors.role = "Please select a user type.";
      valid = false;
    }
    if (!first.trim()) {
      newErrors.first = "First name is required.";
      valid = false;
    } else if (!/^[A-Za-z]+$/.test(first)) {
      newErrors.first = "First name should contain only letters.";
      valid = false;
    }

    if (!last.trim()) {
      newErrors.last = "Last name is required.";
      valid = false;
    } else if (!/^[A-Za-z]+$/.test(last)) {
      newErrors.last = "Last name should contain only letters.";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
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


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          first,
          last,
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      if (data.success) {
        alert("Registration successful! Please log in.");
        navigate("/");
      } else{
        alert(data.message);
      }
    } catch (error: any) {
      alert(error.message);
      console.error("Registration error:", error);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Box display="flex" justifyContent="center" mt={5}>
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
         <Box component="img" src={logo} alt="reversale" sx={{ width: 40, height: 40, mr: 1 }} /> 
          Reversale
        </Typography>
      </Box>
      <Box mt={3} mb={2} bgcolor="#7442BF" color="white" p={2} borderRadius={1}>
        <Typography variant="h5">User Registration for Reversale</Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" error={!!errors.role}>
          <InputLabel id="role-label">Registering as *</InputLabel>
          <Select
            labelId="role-label"
            value={role}
            label="Registering as *"
            onChange={(e) => {
              setrole(e.target.value);
              if (errors.role) {
                setErrors((prev) => ({ ...prev, role: "" }));
              }
            }}
          >
            <MenuItem value="patient">Patient</MenuItem>
            <MenuItem value="doctor">Doctor</MenuItem>
          </Select>
          <FormHelperText>{errors.role}</FormHelperText>
        </FormControl>

        <TextField
          label="First Name *"
          variant="outlined"
          fullWidth
          margin="normal"
          value={first}
          onChange={(e) => {
            setFirst(e.target.value);
            if (errors.first) {
              setErrors((prev) => ({ ...prev, first: "" }));
            }
          }}
          error={!!errors.first}
          helperText={errors.first}
        />

        <TextField
          label="Last Name *"
          variant="outlined"
          fullWidth
          margin="normal"
          value={last}
          onChange={(e) => {
            setLast(e.target.value);
            if (errors.last) {
              setErrors((prev) => ({ ...prev, last: "" }));
            }
          }}
          error={!!errors.last}
          helperText={errors.last}
        />

        <TextField
          label="Email Address *"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: "" }));
            }
          }}
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          label="Password *"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: "" }));
            }
          }}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box mt={3} mb={2}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: '50px', paddingY: 1.5, bgcolor: '#7442BF', borderColor: '#7442BF', '&:hover': { bgcolor: '#5e3399' } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Create"}
          </Button>
        </Box>

        <Box textAlign="center" mt={2}>
          <Typography variant="body2" color="textSecondary">
            Already have an account?
          </Typography>
          <Typography
            variant="body2"
            sx={{ cursor: "pointer", fontWeight: 600, color: "#7442BF" }}
            onClick={() => navigate("/")}
          >
            Login
          </Typography>
        </Box>
      </form>
    </Container>
  );
}
