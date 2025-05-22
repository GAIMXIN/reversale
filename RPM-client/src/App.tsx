import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CircularProgress, Box } from "@mui/material";
import LoginScreen from "./screens/auth/login/Login"
import RegisterScreen from "./screens/auth/register/Register";
import DoctorHomeDashboard from "./screens/doctor/doctorDashboard/DoctorDashboard";
import DoctorAddPatients from "./screens/doctor/doctorAddPatient/DoctorAddPatient";
import DoctorViewPatients from "./screens/doctor/doctorViewPatients/DoctorViewPatients";
import DoctorMeasurementHistory from "./screens/doctor/doctorMeasurementHistory/DoctorMeasurementHistory";
import DoctorAddMeasurement from "./screens/doctor/doctorAddMeasurement/DoctorAddMeasurement";
import PatientDashboard from "./screens/patient/patientDashboard/PatientDashboard";
import PatientMeasurementHistory from "./screens/patient/patientMeasurementHistory/PatientMeasurementHistory";
import PatientAddMeasurement from "./screens/patient/patientAddMeasurement/PatientAddMeasurement";
import Onboarding from "./screens/onboarding/Onboarding";

function AuthenticationWrapper() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");


  useEffect(() => {
    const initialize = async () => {
      const firebaseUser = { uid: "demo-user-id" };
      const userProvider = await loadUser(firebaseUser.uid); 

      if (firebaseUser) {
        const type = (userProvider as { userType: string }).userType.toLowerCase();
        if (type === "doctor") navigate("/doctor");
        else navigate("/patient");
      } else {
        navigate("/login");
      }
      setLoading(false);
    };
    initialize();
  }, [navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }
  return null;
}

async function loadUser(uid: string): Promise<{ userType: string }> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ userType: "doctor" });
    }, 1000);
  });
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/doctor-dashboard" element={<DoctorHomeDashboard />} />
        <Route path="/doctor-addpatient" element={<DoctorAddPatients />} />
        <Route path="/doctor-view-patient/:id" element={<DoctorViewPatients />} />
        <Route
          path="/doctor-measurement-history/:patientId/:measurementType"
          element={<DoctorMeasurementHistory />}
        />
        <Route path="/doctor-add-measurement" element={<DoctorAddMeasurement />} />

         {/* Patient routes  */}
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/patient-add-measurement" element={<PatientAddMeasurement />} />
        <Route path="/patient-measurement-history/:patientId/:measurementType" element={<PatientMeasurementHistory />} />
      </Routes>
    </Router>
  );
}
