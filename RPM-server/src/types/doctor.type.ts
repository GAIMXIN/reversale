export type AddPatientVitalsInput = {
  type: 'bloodPressure' | 'heartRate' | 'oxygenLevel' | 'temperature' | 'weight';
  value: string;
  readingTime: string; // Format: "HH:mm"
  readingDate: string; // Format: "YYYY-MM-DD"
  meals: 'Before meal' | 'After meal' | 'Not applicable';
  notes?: string;
};

export type VitalType = 'bloodPressure' | 'heartRate' | 'oxygenLevel' | 'temperature' | 'weight';
