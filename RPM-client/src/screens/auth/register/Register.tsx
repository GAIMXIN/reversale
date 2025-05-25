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
  Chip,
  Stack,
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
  hasCompany: string;
  companyName: string;
  address: string;
  goals: string[];
  interests: string[];
}

const GOALS = [
  "Increase Sales",
  "Improve Customer Service",
  "Expand Market Reach",
  "Optimize Operations",
  "Enhance Product Quality",
  "Reduce Costs",
  "Build Brand Awareness",
  "Develop New Products",
];

const INTERESTS = [
  "E-commerce",
  "Retail",
  "Manufacturing",
  "Healthcare",
  "Technology",
  "Finance",
  "Education",
  "Real Estate",
  "Food & Beverage",
  "Fashion",
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
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+86");
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
    hasCompany: Yup.string()
      .required("Please select whether you have a company"),
    companyName: Yup.string()
      .when("hasCompany", {
        is: "yes",
        then: (schema) => schema.required("Company name is required"),
      }),
    address: Yup.string()
      .when("hasCompany", {
        is: "yes",
        then: (schema) => schema.required("Company address is required"),
      }),
    goals: Yup.array()
      .min(1, "Please select at least one goal")
      .required("Please select your goals"),
    interests: Yup.array()
      .min(1, "Please select at least one interest")
      .required("Please select your interests"),
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      hasCompany: "",
      companyName: "",
      address: "",
      goals: [],
      interests: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await register({
          email: values.email,
          password: values.password,
          phoneNumber: values.phoneNumber,
          hasCompany: values.hasCompany,
          companyName: values.hasCompany === 'yes' ? values.companyName : undefined,
          address: values.hasCompany === 'yes' ? values.address : undefined,
          goals: values.goals,
          interests: values.interests
        });
        navigate("/login");
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
      ]).then(() => {
        if (!formik.errors.email && !formik.errors.password && 
            !formik.errors.confirmPassword && !formik.errors.phoneNumber) {
          setStep(2);
        }
      });
    } else if (step === 2) {
      const validations = [formik.validateField('hasCompany')];
      if (formik.values.hasCompany === 'yes') {
        validations.push(formik.validateField('companyName'));
        validations.push(formik.validateField('address'));
      }
      Promise.all(validations).then(() => {
        if (!formik.errors.hasCompany && !formik.errors.companyName && !formik.errors.address) {
          setStep(3);
        }
      });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
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
        Do you have a company? *
      </Typography>
      <FormControl fullWidth error={formik.touched.hasCompany && Boolean(formik.errors.hasCompany)}>
        <Select
          id="hasCompany"
          name="hasCompany"
          value={formik.values.hasCompany}
          onChange={formik.handleChange}
        >
          <MenuItem value="yes">Yes</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
        {formik.touched.hasCompany && formik.errors.hasCompany && (
          <FormHelperText>{formik.errors.hasCompany}</FormHelperText>
        )}
      </FormControl>

      {formik.values.hasCompany === "yes" && (
        <>
          <Typography variant="subtitle1" mt={3} gutterBottom>
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
            Company Address *
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            id="address"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
            placeholder="Enter your company address"
            multiline
            rows={3}
          />
        </>
      )}
    </>
  );

  const renderStep3 = () => (
    <>
      <Typography variant="subtitle1" gutterBottom>
        What are your goals and needs? *
      </Typography>
      <FormControl fullWidth error={formik.touched.goals && Boolean(formik.errors.goals)}>
        <Select
          multiple
          id="goals"
          name="goals"
          value={formik.values.goals}
          onChange={formik.handleChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {GOALS.map((goal) => (
            <MenuItem key={goal} value={goal}>
              {goal}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.goals && formik.errors.goals && (
          <FormHelperText>{formik.errors.goals}</FormHelperText>
        )}
      </FormControl>

      <Typography variant="subtitle1" mt={3} gutterBottom>
        What are you interested in? *
      </Typography>
      <FormControl fullWidth error={formik.touched.interests && Boolean(formik.errors.interests)}>
        <Select
          multiple
          id="interests"
          name="interests"
          value={formik.values.interests}
          onChange={formik.handleChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {INTERESTS.map((interest) => (
            <MenuItem key={interest} value={interest}>
              {interest}
            </MenuItem>
          ))}
        </Select>
        {formik.touched.interests && formik.errors.interests && (
          <FormHelperText>{formik.errors.interests}</FormHelperText>
        )}
      </FormControl>

      <Typography variant="subtitle1" mt={3} gutterBottom>
        Custom Goals (Optional)
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter your custom goals (press Enter to add)"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const input = e.target as HTMLInputElement;
            if (input.value.trim()) {
              const newGoals = [...formik.values.goals, input.value.trim()];
              formik.setFieldValue('goals', newGoals);
              input.value = '';
            }
          }
        }}
      />

      <Typography variant="subtitle1" mt={3} gutterBottom>
        Custom Interests (Optional)
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter your custom interests (press Enter to add)"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const input = e.target as HTMLInputElement;
            if (input.value.trim()) {
              const newInterests = [...formik.values.interests, input.value.trim()];
              formik.setFieldValue('interests', newInterests);
              input.value = '';
            }
          }
        }}
      />
    </>
  );

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

          <Box sx={{ width: '100%', mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" color={step >= 1 ? '#7442BF' : 'text.secondary'}>
                Step 1: Basic Information
              </Typography>
              <Typography variant="subtitle1" color={step >= 2 ? '#7442BF' : 'text.secondary'}>
                Step 2: Company Details
              </Typography>
              <Typography variant="subtitle1" color={step >= 3 ? '#7442BF' : 'text.secondary'}>
                Step 3: Goals & Interests
              </Typography>
            </Box>
            <Box sx={{ width: '100%', height: 4, bgcolor: 'grey.200', borderRadius: 2 }}>
              <Box
                sx={{
                  width: `${((step - 1) / 2) * 100}%`,
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
            {step === 3 && renderStep3()}

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
              {step < 3 ? (
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
                  Register
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
