import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { determineStatus } from "../../../utils/Utils";

const getStatusColor = (status: string) => {
    switch (status) {
        case "Critical":
            return "error";
        case "Warning":
            return "warning";
        default:
            return "success";
    }
};

export default function PatientMeasurementHistory() {
    const { patientId, measurementType } = useParams();
    console.log("Measurement Type:", measurementType);
    const navigate = useNavigate();
    const location = useLocation();
    const currentMeasurementType =
        location.state?.measurementType || measurementType || "";

    const [measurements, setMeasurements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    console.log("Patient ID:", patientId);

    const fetchMeasurements = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch(
                `http://localhost:2000/api/v1/doctor/patient-data/${measurementType}/${patientId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) throw new Error("Failed to fetch measurements");
            const result = await response.json();
            setMeasurements(result.data || []);
        } catch (error) {
            console.error("Error fetching measurements:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeasurements();
    }, [patientId, measurementType]);

    const title = measurementType?.replace("-", " ") || "";

    const formatBloodPressureValue = (value: string) => {
        try {
            // Try parsing as JSON first
            const parsed = JSON.parse(value);
            if (parsed.systolic && parsed.diastolic) {
                return `${parsed.systolic.replace(" mmHg", "")}/${parsed.diastolic.replace(" mmHg", "")}`;
            }
        } catch (err) {
            // If not JSON, handle manually
            const systolicMatch = value.match(/Systolic:\s*(\d+)\s*mmHg/i);
            const diastolicMatch = value.match(/Diastolic:\s*(\d+)\s*mmHg/i);
            if (systolicMatch && diastolicMatch) {
                return `${systolicMatch[1]}/${diastolicMatch[1]}`;
            }

            // Fallback: assume already in proper format like "120/80"
            if (value.includes("/")) return value;
        }

        return "N/A";
    };


    return (
        <MainLayout>
            <Box p={2}>
                <Box display="flex" alignItems="center" mb={2}>
                    <ArrowBackIcon
                        onClick={() => navigate(-1)}
                        sx={{ cursor: "pointer", mr: 1 }}
                    />
                    <Typography variant="h5" fontWeight="bold">
                        {title.charAt(0).toUpperCase() + title.slice(1)}
                    </Typography>
                </Box>

                <Typography color="text.secondary" mb={2} variant="h4">
                    Measurement History
                </Typography>

                {loading ? (
                    <Typography>Loading...</Typography>
                ) : measurements.length > 0 ? (
                    measurements.map((item, idx) => {
                        const date = new Date(item.readingTime);
                        const status = determineStatus(measurementType || "", item.value);
                        const color = getStatusColor(status);

                        let displayValue = (
                            <Typography variant="h6" fontWeight="bold">
                                {item.value} {item.unit}
                            </Typography>
                        );

                        if ((measurementType || "").toLowerCase() === "bloodpressure") {
                            // Try parsing blood pressure value
                            let systolic = "";
                            let diastolic = "";

                            try {
                                const parsed = JSON.parse(item.value);
                                systolic = parsed.systolic || "";
                                diastolic = parsed.diastolic || "";
                            } catch {
                                const systolicMatch = item.value.match(/Systolic:\s*(\d+)\s*mmHg/i);
                                const diastolicMatch = item.value.match(/Diastolic:\s*(\d+)\s*mmHg/i);
                                if (systolicMatch) systolic = `${systolicMatch[1]} mmHg`;
                                if (diastolicMatch) diastolic = `${diastolicMatch[1]} mmHg`;
                            }

                            displayValue = (
                                <Box display="flex" gap={4} mt={1} mb={1}>
                                    <Box textAlign="center">
                                        <Typography variant="h6" color="text.secondary">
                                            Systolic
                                        </Typography>
                                        <Typography fontWeight="bold">{systolic}</Typography>
                                    </Box>
                                    <Box textAlign="center">
                                        <Typography variant="h6" color="text.secondary">
                                            Diastolic
                                        </Typography>
                                        <Typography fontWeight="bold">{diastolic}</Typography>
                                    </Box>
                                </Box>
                            );

                        }

                        return (
                            <Card key={idx} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="h6" color="text.secondary">
                                            {date.toLocaleDateString()} &nbsp; {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                        <Chip
                                            label={status}
                                            color={color}
                                            variant="outlined"
                                            sx={{ fontSize: "0.9rem", height: 35, width: 100 }}
                                        />
                                    </Box>
                                    <Typography mt={1} variant="h6" fontWeight="bold">
                                        Reading:
                                    </Typography>
                                    {displayValue}
                                    
                                </CardContent>
                            </Card>
                        );
                    })
                ) : (
                    <Typography>No readings found.</Typography>
                )}


                <Box
                    sx={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        zIndex: 1000,
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => {
                            navigate("/patient-add-measurement", {
                                state: { measurementType, patientId },
                            });
                        }}
                        sx={{ bgcolor: '#7442BF', borderColor: '#7442BF', '&:hover': { bgcolor: '#5e3399' } }}
                    >
                        Add Measurement
                    </Button>
                </Box>
            </Box>
        </MainLayout>
    );
}
