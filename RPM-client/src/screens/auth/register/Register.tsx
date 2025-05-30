import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../../contexts/AuthContext";
import logo from '../../../assests/img/logo.png';

interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  companyName: string;
  industry: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
}

const INDUSTRIES = [
  "Healthcare",
  "Local Business", 
  "Other"
];

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" }
];

const COUNTRY_CODES = [
  { code: "+1", country: "United States/Canada" },
  { code: "+44", country: "United Kingdom" },
  { code: "+86", country: "China" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
  { code: "+61", country: "Australia" },
  { code: "+65", country: "Singapore" },
  { code: "+91", country: "India" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+39", country: "Italy" },
  { code: "+34", country: "Spain" },
  { code: "+31", country: "Netherlands" },
  { code: "+41", country: "Switzerland" },
  { code: "+46", country: "Sweden" },
  { code: "+47", country: "Norway" },
  { code: "+45", country: "Denmark" },
  { code: "+358", country: "Finland" },
  { code: "+43", country: "Austria" },
  { code: "+32", country: "Belgium" },
  { code: "+351", country: "Portugal" },
  { code: "+30", country: "Greece" },
  { code: "+36", country: "Hungary" },
  { code: "+48", country: "Poland" },
  { code: "+420", country: "Czech Republic" },
  { code: "+421", country: "Slovakia" },
  { code: "+385", country: "Croatia" },
  { code: "+386", country: "Slovenia" },
  { code: "+40", country: "Romania" },
  { code: "+359", country: "Bulgaria" },
  { code: "+380", country: "Ukraine" },
  { code: "+7", country: "Russia" },
  { code: "+90", country: "Turkey" },
  { code: "+966", country: "Saudi Arabia" },
  { code: "+971", country: "UAE" },
  { code: "+972", country: "Israel" },
  { code: "+20", country: "Egypt" },
  { code: "+27", country: "South Africa" },
  { code: "+55", country: "Brazil" },
  { code: "+54", country: "Argentina" },
  { code: "+56", country: "Chile" },
  { code: "+57", country: "Colombia" },
  { code: "+58", country: "Venezuela" },
  { code: "+52", country: "Mexico" },
  { code: "+51", country: "Peru" },
  { code: "+593", country: "Ecuador" },
  { code: "+595", country: "Paraguay" },
  { code: "+598", country: "Uruguay" },
  { code: "+591", country: "Bolivia" },
  { code: "+593", country: "Ecuador" },
];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+1");
  const [step, setStep] = useState(1);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    phoneNumber: Yup.string()
      .matches(/^\d{10,15}$/, "Invalid phone number")
      .required("Phone number is required"),
    companyName: Yup.string()
      .required("Company name is required"),
    industry: Yup.string()
      .required("Industry is required"),
    address1: Yup.string()
      .required("Address is required"),
    address2: Yup.string(),
    city: Yup.string()
      .required("City is required"),
    state: Yup.string()
      .required("State is required"),
    zip: Yup.string()
      .matches(/^[0-9]{5}$/, "ZIP code must be 5 digits")
      .required("ZIP code is required"),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      companyName: "",
      industry: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // New payload format for future use
        const newPayload = {
          email: values.email,
          password: values.password,
          phone: `${countryCode}${values.phoneNumber}`,
          company: {
            name: values.companyName,
            industry: values.industry,
            address1: values.address1,
            address2: values.address2,
            city: values.city,
            state: values.state,
            zip: values.zip
          }
        };
        
        console.log("New registration payload format:", newPayload);
        
        // Adapt to current AuthContext interface
        const legacyPayload = {
          email: values.email,
          password: values.password,
          phoneNumber: values.phoneNumber,
          hasCompany: "yes",
          companyName: values.companyName,
          address: `${values.address1}${values.address2 ? ', ' + values.address2 : ''}, ${values.city}, ${values.state} ${values.zip}`,
          goals: [],
          interests: []
        };
        
        await register(legacyPayload);
        
        // Simulate successful registration and auto-login
        const fakeToken = "fake-jwt-token-" + Math.random().toString(36).substring(7);
        const newUser = {
          id: "user-" + Math.random().toString(36).substring(7),
          email: values.email,
          userType: 'test' as const,
          name: values.companyName
        };
        
        login(fakeToken, newUser);
        navigate("/");
      } catch (error) {
        console.error("Registration failed:", error);
      }
    },
  });

  const handleCountryCodeChange = (event: SelectChangeEvent) => {
    setCountryCode(event.target.value);
  };

  const handleNext = () => {
    if (step === 1) {
      Promise.all([
        formik.validateField('email'),
        formik.validateField('password'),
        formik.validateField('confirmPassword'),
        formik.validateField('phoneNumber')
      ]).then((results) => {
        // Check if all validations passed (no errors returned)
        const hasErrors = results.some(error => error);
        if (!hasErrors) {
          setStep(2);
        }
      });
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const renderStep1 = () => (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Email Address *
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        id="email"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        placeholder="Enter your email"
      />

      <Typography variant="subtitle1" mt={3} gutterBottom>
        Password *
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        value={formik.values.password}
        onChange={formik.handleChange}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        placeholder="Enter your password"
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

      <Typography variant="subtitle1" mt={3} gutterBottom>
        Confirm Password *
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        id="confirmPassword"
        name="confirmPassword"
        type={showPassword ? "text" : "password"}
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
        placeholder="Confirm your password"
      />

      <Typography variant="subtitle1" mt={3} gutterBottom>
        Phone Number *
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <FormControl sx={{ width: "30%" }}>
          <InputLabel id="country-code-label">Code</InputLabel>
          <Select
            labelId="country-code-label"
            value={countryCode}
            label="Code"
            onChange={handleCountryCodeChange}
          >
            {COUNTRY_CODES.map(({ code, country }) => (
              <MenuItem key={code} value={code}>
                {code} ({country})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          variant="outlined"
          id="phoneNumber"
          name="phoneNumber"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          placeholder="Enter your phone number"
        />
      </Box>
    </>
  );

  const renderStep2 = () => (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Company Name *
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        id="companyName"
        name="companyName"
        value={formik.values.companyName}
        onChange={formik.handleChange}
        error={formik.touched.companyName && Boolean(formik.errors.companyName)}
        helperText={formik.touched.companyName && formik.errors.companyName}
        placeholder="Enter your company name"
      />

      <Typography variant="subtitle1" mt={3} gutterBottom>
        Industry *
      </Typography>
      <FormControl fullWidth error={formik.touched.industry && Boolean(formik.errors.industry)}>
        <Select
          id="industry"
          name="industry"
          value={formik.values.industry}
          onChange={formik.handleChange}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select your industry
          </MenuItem>
          {INDUSTRIES.map((industry) => (
            <MenuItem key={industry} value={industry}>
              {industry}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.industry && formik.errors.industry && (
          <FormHelperText>{formik.errors.industry}</FormHelperText>
        )}
      </FormControl>

      <Typography variant="subtitle1" mt={3} gutterBottom>
        Address *
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        id="address1"
        name="address1"
        value={formik.values.address1}
        onChange={formik.handleChange}
        error={formik.touched.address1 && Boolean(formik.errors.address1)}
        helperText={formik.touched.address1 && formik.errors.address1}
        placeholder="Street address"
        sx={{ mb: 2 }}
      />
      
      <TextField
        fullWidth
        variant="outlined"
        id="address2"
        name="address2"
        value={formik.values.address2}
        onChange={formik.handleChange}
        error={formik.touched.address2 && Boolean(formik.errors.address2)}
        helperText={formik.touched.address2 && formik.errors.address2}
        placeholder="Apartment, suite, etc. (optional)"
      />

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <TextField
          variant="outlined"
          id="city"
          name="city"
          value={formik.values.city}
          onChange={formik.handleChange}
          error={formik.touched.city && Boolean(formik.errors.city)}
          helperText={formik.touched.city && formik.errors.city}
          placeholder="City"
          sx={{ flex: 1 }}
        />
        
        <FormControl sx={{ flex: 1 }} error={formik.touched.state && Boolean(formik.errors.state)}>
          <Select
            id="state"
            name="state"
            value={formik.values.state}
            onChange={formik.handleChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              State
            </MenuItem>
            {US_STATES.map(({ code, name }) => (
              <MenuItem key={code} value={code}>
                {code} - {name}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.state && formik.errors.state && (
            <FormHelperText>{formik.errors.state}</FormHelperText>
          )}
        </FormControl>
        
        <TextField
          variant="outlined"
          id="zip"
          name="zip"
          value={formik.values.zip}
          onChange={formik.handleChange}
          error={formik.touched.zip && Boolean(formik.errors.zip)}
          helperText={formik.touched.zip && formik.errors.zip}
          placeholder="ZIP"
          sx={{ width: 120 }}
        />
      </Box>
    </>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
          <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
            <Box 
              component="img" 
              src={logo} 
              alt="ReverSale" 
              sx={{ 
                width: 200, 
                height: 'auto',
                maxHeight: 120,
                filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))'
              }} 
            />
          </Box>

          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" color={step >= 1 ? '#7442BF' : 'text.secondary'}>
                Step 1: Basic Information
              </Typography>
              <Typography variant="subtitle1" color={step >= 2 ? '#7442BF' : 'text.secondary'}>
                Step 2: Company Details
              </Typography>
            </Box>
            <Box sx={{ width: '100%', height: 4, bgcolor: 'grey.200', borderRadius: 2 }}>
              <Box
                sx={{
                  width: `${((step - 1) / 1) * 100}%`,
                  height: '100%',
                  bgcolor: '#7442BF',
                  borderRadius: 2,
                  transition: 'width 0.3s ease-in-out'
                }}
              />
            </Box>
          </Box>

          <Box component="form" onSubmit={formik.handleSubmit} width="100%">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              {step > 1 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{ 
                    borderRadius: 50, 
                    px: 5, 
                    py: 1.5, 
                    borderColor: '#7442BF', 
                    color: '#7442BF',
                    '&:hover': { 
                      borderColor: '#5e3399',
                      bgcolor: 'rgba(116, 66, 191, 0.04)'
                    } 
                  }}
                >
                  Back
                </Button>
              )}
              {step < 2 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ 
                    borderRadius: 50, 
                    px: 5, 
                    py: 1.5, 
                    bgcolor: '#7442BF', 
                    '&:hover': { bgcolor: '#5e3399' } 
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ 
                    borderRadius: 50, 
                    px: 5, 
                    py: 1.5, 
                    bgcolor: '#7442BF', 
                    '&:hover': { bgcolor: '#5e3399' } 
                  }}
                >
                  Sign Up
                </Button>
              )}
            </Box>

            <Box textAlign="center" mt={3}>
              <Typography variant="body2">Already have an account?</Typography>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer", color: "#7442BF" }}
                onClick={() => navigate("/login")}
              >
                Login
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
