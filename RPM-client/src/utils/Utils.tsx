export const determineStatus = (type: string, value: string): string => {
    try {
        switch (type) {
            case "bloodPressure": {
                let systolic = 0;
                let diastolic = 0;

                if (value.includes("/")) {
                    const parts = value.split("/").map((v) => parseInt(v));
                    if (parts.length === 2) {
                        [systolic, diastolic] = parts;
                    }
                } else {
                    // Try to extract from raw string like: "Systolic: 98 mmHg, Diastolic: 90 mmHg"
                    const systolicMatch = value.match(/Systolic:\s*(\d+)\s*mmHg/i);
                    const diastolicMatch = value.match(/Diastolic:\s*(\d+)\s*mmHg/i);

                    if (systolicMatch && diastolicMatch) {
                        systolic = parseInt(systolicMatch[1]);
                        diastolic = parseInt(diastolicMatch[1]);
                    }
                }

                if (!systolic || !diastolic) return "Unknown";

                if (systolic < 90 || diastolic < 60 || systolic > 180 || diastolic > 120) return "Critical";
                if ((systolic >= 140 && systolic <= 180) || (diastolic >= 90 && diastolic <= 120)) return "Warning";
                return "Normal";
            }

            // The rest of your logic stays unchanged
            case "heartRate": {
                const bpm = parseInt(value);
                if (bpm < 40 || bpm > 150) return "Critical";
                if ((bpm >= 100 && bpm <= 150) || (bpm < 60 && bpm >= 40)) return "Warning";
                return "Normal";
            }

            case "oxygenLevel": {
                const percent = parseInt(value.replace("%", ""));
                if (percent < 85) return "Critical";
                if (percent < 95) return "Warning";
                return "Normal";
            }

            case "temperature": {
                const temp = parseFloat(value);
                if (temp < 95 || temp > 104) return "Critical";
                if (temp < 97 || temp > 100.4) return "Warning";
                return "Normal";
            }

            case "weight": {
                const wt = parseFloat(value);
                if (wt < 40 || wt <= 130) return "Warning";
                if (wt > 150) return "Critical";
                return "Normal";
            }

            default:
                return "Normal";
        }
    } catch {
        return "Unknown";
    }
};
