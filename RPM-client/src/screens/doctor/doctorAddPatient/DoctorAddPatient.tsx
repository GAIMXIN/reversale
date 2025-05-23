import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  List,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";

type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  doctor: string;
};

export default function DoctorAddPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const addPatientToDoctor = async (patientId: string) => {
    const token = localStorage.getItem("accessToken");
  
    try {
      const response = await fetch(`http://localhost:2000/api/v1/doctor/add-patient/${patientId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const result = await response.json();
  
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to add patient.");
      }
  
      // Navigate to doctor-dashboard on success
      setPatients((prev) => prev.filter((p) => p.id !== patientId));
      navigate("/doctor-dashboard");
    } catch (error) {
      console.error("Error adding patient to doctor:", error);
      alert("Failed to add patient. Please try again.");
    }
  };
  
  

  const getPatientList = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch("http://localhost:2000/api/v1/doctor/patient-list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Normalize API fields to match local state structure
      const normalized = data.data.map((p: any) => ({
        id: String(p.id),
        firstName: p.first,
        lastName: p.last,
        email: p.email,
        doctor: "", // Assume no doctor assigned yet
      }));

      return normalized;
    } catch (error) {
      console.error("Error fetching patient list:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patients = await getPatientList();
        setPatients(patients);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box bgcolor="#7442BF" color="white" p={3} borderRadius={2} mb={3}>
          <Typography variant="h5">Add Patients</Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          Available Patients
        </Typography>

        {loading ? (
          <Typography color="textSecondary">Loading...</Typography>
        ) : error ? (
          <Typography color="error">Error: {error}</Typography>
        ) : patients.length === 0 ? (
          <Typography color="textSecondary">No patients available</Typography>
        ) : (
          <List>
            {patients.map((patient) => (
              <Paper
                key={patient.id}
                sx={{
                  mb: 2,
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="subtitle1">
                    {patient.firstName} {patient.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {patient.email}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => addPatientToDoctor(patient.id)}
                >
                  Add
                </Button>
              </Paper>
            ))}
          </List>
        )}
      </Container>
    </MainLayout>
  );
}
