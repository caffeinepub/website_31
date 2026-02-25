/**
 * Local TypeScript types and dummy data for pregnant women records.
 * Used as fallback/seed data when backend is empty.
 */

export type RiskLevelLocal = 'normal' | 'moderate' | 'high';
export type TrimesterLocal = 1 | 2 | 3;

export interface PregnantWomanVisit {
  visitDate: string; // ISO date string
  weight: number;    // kg
  bloodPressure: number; // systolic mmHg
  hemoglobin: number;    // g/dL
  notes: string;
}

export interface PregnantWoman {
  id: string;
  name: string;
  age: number;
  husbandName: string;
  address: string;
  phoneNumber: string;
  lmpDate: string;   // ISO date string
  eddDate: string;   // ISO date string
  gestationalAge: number; // weeks
  weight: number;    // kg
  hemoglobinLevel: number; // g/dL
  bloodPressure: number;   // systolic mmHg
  trimester: TrimesterLocal;
  riskLevel: RiskLevelLocal;
  visitHistory: PregnantWomanVisit[];
}

export const dummyPregnantWomen: PregnantWoman[] = [
  {
    id: 'PW001',
    name: 'Sunita Devi',
    age: 24,
    husbandName: 'Ramesh Devi',
    address: 'Village Rampur, Ward 3, Dist. Varanasi',
    phoneNumber: '9876501001',
    lmpDate: '2025-08-10',
    eddDate: '2026-05-17',
    gestationalAge: 28,
    weight: 58.5,
    hemoglobinLevel: 10.2,
    bloodPressure: 118,
    trimester: 3,
    riskLevel: 'normal',
    visitHistory: [
      {
        visitDate: '2025-09-15',
        weight: 54.0,
        bloodPressure: 112,
        hemoglobin: 10.8,
        notes: 'First ANC visit. Iron-folic acid tablets prescribed.',
      },
      {
        visitDate: '2025-11-10',
        weight: 56.2,
        bloodPressure: 115,
        hemoglobin: 10.5,
        notes: 'Second ANC visit. Mild anaemia noted. Dietary counselling given.',
      },
      {
        visitDate: '2026-01-20',
        weight: 58.5,
        bloodPressure: 118,
        hemoglobin: 10.2,
        notes: 'Third ANC visit. Baby movements felt. Referred to PHC for USG.',
      },
    ],
  },
  {
    id: 'PW002',
    name: 'Meena Kumari',
    age: 28,
    husbandName: 'Suresh Kumari',
    address: 'Mohalla Shivpuri, Near Temple, Dist. Lucknow',
    phoneNumber: '9876501002',
    lmpDate: '2025-11-05',
    eddDate: '2026-08-12',
    gestationalAge: 16,
    weight: 52.0,
    hemoglobinLevel: 9.4,
    bloodPressure: 122,
    trimester: 2,
    riskLevel: 'moderate',
    visitHistory: [
      {
        visitDate: '2025-12-01',
        weight: 50.5,
        bloodPressure: 118,
        hemoglobin: 9.8,
        notes: 'First ANC visit. Haemoglobin low. Iron supplements started.',
      },
      {
        visitDate: '2026-02-05',
        weight: 52.0,
        bloodPressure: 122,
        hemoglobin: 9.4,
        notes: 'Haemoglobin still below 10. Referred to CHC for further evaluation.',
      },
    ],
  },
  {
    id: 'PW003',
    name: 'Kavita Singh',
    age: 32,
    husbandName: 'Ajay Singh',
    address: 'Plot 12, Sector 4, Dist. Agra',
    phoneNumber: '9876501003',
    lmpDate: '2026-01-15',
    eddDate: '2026-10-22',
    gestationalAge: 6,
    weight: 61.0,
    hemoglobinLevel: 11.5,
    bloodPressure: 116,
    trimester: 1,
    riskLevel: 'normal',
    visitHistory: [
      {
        visitDate: '2026-02-10',
        weight: 61.0,
        bloodPressure: 116,
        hemoglobin: 11.5,
        notes: 'First ANC visit. Pregnancy confirmed. Folic acid started.',
      },
      {
        visitDate: '2026-02-20',
        weight: 61.2,
        bloodPressure: 114,
        hemoglobin: 11.6,
        notes: 'Follow-up. No complaints. Advised rest and nutrition.',
      },
    ],
  },
  {
    id: 'PW004',
    name: 'Radha Yadav',
    age: 22,
    husbandName: 'Mohan Yadav',
    address: 'Gram Panchayat Nandpur, Dist. Gorakhpur',
    phoneNumber: '9876501004',
    lmpDate: '2025-06-20',
    eddDate: '2026-03-27',
    gestationalAge: 36,
    weight: 55.0,
    hemoglobinLevel: 8.2,
    bloodPressure: 138,
    trimester: 3,
    riskLevel: 'high',
    visitHistory: [
      {
        visitDate: '2025-08-01',
        weight: 48.5,
        bloodPressure: 120,
        hemoglobin: 9.5,
        notes: 'First ANC. Underweight. Nutritional support initiated.',
      },
      {
        visitDate: '2025-10-15',
        weight: 51.0,
        bloodPressure: 128,
        hemoglobin: 8.8,
        notes: 'BP slightly elevated. Referred to PHC. Haemoglobin declining.',
      },
      {
        visitDate: '2025-12-20',
        weight: 53.2,
        bloodPressure: 135,
        hemoglobin: 8.4,
        notes: 'High risk. BP elevated. Severe anaemia. Referred to district hospital.',
      },
      {
        visitDate: '2026-02-10',
        weight: 55.0,
        bloodPressure: 138,
        hemoglobin: 8.2,
        notes: 'Continued high risk. Hospital delivery advised. Emergency contact noted.',
      },
    ],
  },
  {
    id: 'PW005',
    name: 'Geeta Mishra',
    age: 26,
    husbandName: 'Rakesh Mishra',
    address: 'Colony Shanti Nagar, Dist. Kanpur',
    phoneNumber: '9876501005',
    lmpDate: '2025-09-25',
    eddDate: '2026-07-02',
    gestationalAge: 22,
    weight: 57.8,
    hemoglobinLevel: 10.8,
    bloodPressure: 120,
    trimester: 2,
    riskLevel: 'moderate',
    visitHistory: [
      {
        visitDate: '2025-11-01',
        weight: 55.0,
        bloodPressure: 116,
        hemoglobin: 11.2,
        notes: 'First ANC. Normal findings. Iron-folic acid prescribed.',
      },
      {
        visitDate: '2026-01-15',
        weight: 57.8,
        bloodPressure: 120,
        hemoglobin: 10.8,
        notes: 'Haemoglobin slightly low. Dietary counselling. Calcium supplements added.',
      },
    ],
  },
  {
    id: 'PW006',
    name: 'Anita Verma',
    age: 30,
    husbandName: 'Vijay Verma',
    address: 'House 45, Indira Nagar, Dist. Allahabad',
    phoneNumber: '9876501006',
    lmpDate: '2025-07-01',
    eddDate: '2026-04-07',
    gestationalAge: 34,
    weight: 63.5,
    hemoglobinLevel: 11.8,
    bloodPressure: 114,
    trimester: 3,
    riskLevel: 'normal',
    visitHistory: [
      {
        visitDate: '2025-08-20',
        weight: 58.0,
        bloodPressure: 110,
        hemoglobin: 12.2,
        notes: 'First ANC. All parameters normal. Vitamins prescribed.',
      },
      {
        visitDate: '2025-11-05',
        weight: 61.0,
        bloodPressure: 112,
        hemoglobin: 12.0,
        notes: 'Second ANC. Good weight gain. Foetal movements normal.',
      },
      {
        visitDate: '2026-02-01',
        weight: 63.5,
        bloodPressure: 114,
        hemoglobin: 11.8,
        notes: 'Third ANC. Delivery plan discussed. Referred to PHC for delivery.',
      },
    ],
  },
];
