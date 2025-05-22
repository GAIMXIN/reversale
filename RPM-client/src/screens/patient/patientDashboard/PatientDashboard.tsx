import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";

export default function PatientDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialPatient = location.state?.patient;
  const [patientData, setPatientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;
  const userFirstName = user ? JSON.parse(user).firstName : null;
  const userLastName = user ? JSON.parse(user).lastName : null;
  console.log("User:", user);
  console.log("User ID:", userId);

  const fetchPatientData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:2000/api/v1/doctor/patient-data/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch patient data");
      const result = await response.json();
      setMeasurements(result.data || []);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [userId]);

  const measurementFields = [
    { label: "Blood Pressure", key: "bloodPressure", unit: "(mmHg)" },
    { label: "Heart Rate", key: "heartRate", unit: "(bpm)" },
    { label: "Oxygen Level", key: "oxygenLevel", unit: "(%)" },
    { label: "Temperature", key: "temperature", unit: "(°F)" },
    { label: "Weight", key: "weight", unit: "(kg)" },
  ];

  const getLatestMeasurement = (typeKey: string) => {
    const filtered = measurements
      .filter((m) => m.type === typeKey)
      .sort(
        (a, b) => new Date(b.readingTime).getTime() - new Date(a.readingTime).getTime()
      );
    return filtered[0];
  };


  const measurementRoutes: Record<string, string> = {
    "Blood Pressure": "bloodPressure",
    "Heart Rate": "heartRate",
    "Oxygen Level": "oxygenLevel",
    "Temperature": "temperature",
    "Weight": "weight",
  };

  const patientName = initialPatient
    ? `${initialPatient.first} ${initialPatient.last}`
    : patientData
      ? `${patientData.firstName || ""} ${patientData.lastName || ""}`
      : "Patient";

  const formatBloodPressureValue = (value: string) => {
    try {
      // Try JSON-parsed value
      const parsed = JSON.parse(value);
      if (parsed.systolic && parsed.diastolic) {
        const systolic = parsed.systolic.replace(" mmHg", "").trim();
        const diastolic = parsed.diastolic.replace(" mmHg", "").trim();
        return `${systolic}/${diastolic} (mmHg)`;
      }
    } catch {
      // Not JSON — handle string format
      const systolicMatch = value.match(/Systolic:\s*(\d+)\s*mmHg/i);
      const diastolicMatch = value.match(/Diastolic:\s*(\d+)\s*mmHg/i);
      if (systolicMatch && diastolicMatch) {
        return `${systolicMatch[1]}/${diastolicMatch[1]} (mmHg)`;
      }
      // Already in proper format like "120/80"
      if (value.includes("/")) return `${value.trim()} (mmHg)`;
    }

    return "N/A";
  };



  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          bgcolor="#1976d2"
          color="white"
          p={2}
          borderRadius={2}
          mb={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography variant="h5">Hello {userFirstName}{" "}{userLastName}</Typography>
            <Typography fontWeight="bold" variant="h6">
              How are you feeling right now?
            </Typography>
          </Box>
        </Box>

        <Typography variant="h4" gutterBottom>
          Measurements
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          measurementFields.map(({ label, key, unit }) => {
            const latest = getLatestMeasurement(key);
            const value = latest?.value;
            const time = latest?.readingTime;

            const item = {
              type: label,
              value: value || "N/A",
              unit,
              time: time || new Date().toISOString(),
            };

            const route = measurementRoutes[label];

            return (
              <Card
                key={label}
                sx={{ mb: 2, cursor: "pointer" }}
                onClick={() => {
                  if (route) {
                    navigate(`/patient-measurement-history/${userId}/${route}`, {
                      state: {
                        measurementType: key,
                        measurementData: item,
                      },
                    });
                  }
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography sx={{ color: "black", fontSize: 25 }}>{label}</Typography>
                    <Typography variant="body1" color="textSecondary">
                      Last Reading - {""}
                      {time
                        ? `${new Date(time).toLocaleDateString()} ${new Date(time).toLocaleTimeString()}`
                        : "N/A"}
                    </Typography>
                    <Typography sx={{ color: "blue", fontSize: 22 }}>
                      {/* {value ? `${value}` : `N/A ${unit}`} */}
                      {key === "bloodPressure"
                        ? formatBloodPressureValue(item.value)
                        : `${item.value} ${ ""}`}
                    </Typography>
                  </Box>
                  <IconButton>
                    <ChevronRightIcon />
                  </IconButton>
                </CardContent>
              </Card>
            );
          })
        )}


          {/* <Typography variant="h6" mt={4} gutterBottom>
            Assessments
          </Typography> */}
        {(patientData?.assessments || []).map((item: any) => (
          <Card key={item.date} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body2" color="textSecondary">
                {item.date}
              </Typography>
              <Typography variant="subtitle1">{item.type}</Typography>
              <Box mt={1}>
                <Chip
                  label={item.status}
                  color={item.statusColor || "default"}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Container>
    </MainLayout>
  );
}
