// Import required
import {
    Box,
    Button,
    Container,
    MenuItem,
    Select,
    TextField,
    Typography,
    InputAdornment,
    FormControl,
    InputLabel,
    FormHelperText,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";

const measurementUnits = {
    "Body Temperature": "°F",
    "Heart Rate": "bpm",
    "Respiratory Rate": "bpm",
    "Blood Oxygen Level": "%",
    Weight: "kg",
    "Blood Pressure": "mmHg",
};

const measurementTypes = [
    "Body Temperature",
    "Heart Rate",
    "Respiratory Rate",
    "Blood Oxygen Level",
    "Blood Pressure",
    "Weight", ``
];

export default function PatientAddMeasurement() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialType =
        location.state?.measurementType || "Body Temperature";
    const initialPatientId = location.state?.patientId || "";

    const [type, setType] = useState<keyof typeof measurementUnits>(initialType);
    const [value, setValue] = useState("");
    const [systolic, setSystolic] = useState("");
    const [diastolic, setDiastolic] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [meals, setMeals] = useState("");
    const [notes, setNotes] = useState("");

    const [errors, setErrors] = useState<any>({});

    const inputStyle = {
        borderRadius: 2,
        backgroundColor: "#f5f5f5",
    };

    const validate = () => {
        const newErrors: any = {};

        if (!date) newErrors.date = "Date is required";
        if (!time) newErrors.time = "Time is required";
        if (!meals) newErrors.meals = "Meals selection is required";

        if (type === "Blood Pressure") {
            if (!systolic) newErrors.systolic = "Systolic is required";
            if (!diastolic) newErrors.diastolic = "Diastolic is required";
        } else {
            if (!value) newErrors.value = `${type} value is required`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        const token = localStorage.getItem("accessToken");
        const patientId = initialPatientId;

        // Map display type to backend type
        const backendTypeMap: Record<string, string> = {
            "Body Temperature": "temperature",
            "Heart Rate": "heartRate",
            "Respiratory Rate": "respiratoryRate",
            "Blood Oxygen Level": "oxygenLevel",
            "Blood Pressure": "bloodPressure",
            "Weight": "weight",
        };

        const backendType = backendTypeMap[type];

        let valueToSend;
        if (type === "Blood Pressure") {
            valueToSend = `Systolic: ${systolic} mmHg, Diastolic: ${diastolic} mmHg`;
        } else {
            valueToSend = `${value} ${measurementUnits[type]}`;
        }

        const payload = {
            type: backendType,
            value: valueToSend,
            readingTime: time,
            readingDate: date,
            meals,
            notes,
        };

        try {
            const response = await fetch(
                `http://localhost:2000/api/v1/doctor/patient-data/${patientId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save measurement");
            }
            navigate("/patient-dashboard");
        } catch (error) {
            console.error("Error saving measurement:", error);
            alert("Something went wrong. Please try again.");
        }
    };



    return (
        <MainLayout>
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Add Measurement
                </Typography>
                <Typography color="textSecondary" mb={3}>
                    Keep track of your health vital sign measurements
                </Typography>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Measurement Type</InputLabel>
                    <Select
                        value={type}
                        onChange={(e) => setType(e.target.value as keyof typeof measurementUnits)}
                        label="Measurement Type"
                    >
                        {measurementTypes.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {type === "Blood Pressure" ? (
                    <>
                        <Typography variant="subtitle1" sx={{ color: "#7442BF", fontWeight: "bold", mt: 2 }}>
                            {type}
                        </Typography>
                        <Box display="flex" gap={2} mt={1}>
                            <TextField
                                fullWidth
                                label="Systolic"
                                sx={inputStyle}
                                value={systolic}
                                onChange={(e) => setSystolic(e.target.value)}
                                error={!!errors.systolic}
                                helperText={errors.systolic}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">mmHg</InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Diastolic"
                                sx={inputStyle}
                                value={diastolic}
                                onChange={(e) => setDiastolic(e.target.value)}
                                error={!!errors.diastolic}
                                helperText={errors.diastolic}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">mmHg</InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="subtitle1" sx={{ color: "#7442BF", fontWeight: "bold", mt: 2 }}>
                            {type}
                        </Typography>
                        <TextField
                            fullWidth
                            label={`Enter a value.`}
                            sx={inputStyle}
                            margin="normal"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            error={!!errors.value}
                            helperText={errors.value}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {measurementUnits[type] || ""}
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </>
                )}

                <Box display="flex" gap={2} mt={2}>
                    <TextField
                        fullWidth
                        sx={inputStyle}
                        label="Reading Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        error={!!errors.date}
                        helperText={errors.date}
                    />
                    <TextField
                        fullWidth
                        sx={inputStyle}
                        label="Reading Time"
                        type="time"
                        InputLabelProps={{ shrink: true }}
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        error={!!errors.time}
                        helperText={errors.time}
                    />
                </Box>

                <FormControl fullWidth margin="normal" error={!!errors.meals}>
                    <InputLabel>Meals</InputLabel>
                    <Select
                        value={meals}
                        onChange={(e) => setMeals(e.target.value)}
                        label="Meals"
                    >
                        <MenuItem value="Before meal">Before Meal</MenuItem>
                        <MenuItem value="After meal">After Meal</MenuItem>
                        <MenuItem value="Not applicable">Not Applicable</MenuItem>
                    </Select>
                    {errors.meals && <FormHelperText>{errors.meals}</FormHelperText>}
                </FormControl>
                <Typography color="textSecondary" mt={3}>
                    Anything you would like the doctor to know?
                </Typography>
                <TextField
                    fullWidth
                    sx={inputStyle}
                    multiline
                    rows={3}
                    label="Notes"
                    placeholder="Anything you would like the doctor to know?"
                    margin="normal"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                <Box mt={3} display="flex" justifyContent="space-between">
                    <Button variant="contained" color="inherit" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Box>
            </Container>
        </MainLayout>
    );
}
