export type NutritionalStatus = "normal" | "moderate" | "severe";

export interface VisitRecord {
  date: string;
  weight: number;
  height: number;
  muac?: number;
}

export interface ChildRecord {
  id: string;
  name: string;
  ageMonths: number;
  gender: "Male" | "Female";
  height: number;
  weight: number;
  muac?: number;
  bmi: number;
  status: NutritionalStatus;
  parentName: string;
  parentPhone: string;
  visitHistory: VisitRecord[];
}

export const dummyChildren: ChildRecord[] = [
  {
    id: "C001",
    name: "Aarav Sharma",
    ageMonths: 24,
    gender: "Male",
    height: 86,
    weight: 12.5,
    muac: 14.2,
    bmi: 16.9,
    status: "normal",
    parentName: "Sunita Sharma",
    parentPhone: "9876543210",
    visitHistory: [
      { date: "2025-11-15", weight: 11.8, height: 83 },
      { date: "2025-12-15", weight: 12.1, height: 84.5 },
      { date: "2026-01-15", weight: 12.5, height: 86 },
    ],
  },
  {
    id: "C002",
    name: "Priya Patel",
    ageMonths: 18,
    gender: "Female",
    height: 78,
    weight: 8.2,
    muac: 12.1,
    bmi: 13.5,
    status: "moderate",
    parentName: "Rekha Patel",
    parentPhone: "9765432109",
    visitHistory: [
      { date: "2025-11-15", weight: 8.0, height: 76 },
      { date: "2025-12-15", weight: 8.1, height: 77 },
      { date: "2026-01-15", weight: 8.2, height: 78 },
    ],
  },
  {
    id: "C003",
    name: "Ravi Kumar",
    ageMonths: 36,
    gender: "Male",
    height: 90,
    weight: 10.5,
    muac: 11.0,
    bmi: 12.9,
    status: "severe",
    parentName: "Meena Kumar",
    parentPhone: "9654321098",
    visitHistory: [
      { date: "2025-11-15", weight: 10.5, height: 88 },
      { date: "2025-12-15", weight: 10.5, height: 89 },
      { date: "2026-01-15", weight: 10.5, height: 90 },
    ],
  },
  {
    id: "C004",
    name: "Ananya Singh",
    ageMonths: 30,
    gender: "Female",
    height: 88,
    weight: 13.0,
    muac: 15.0,
    bmi: 16.8,
    status: "normal",
    parentName: "Kavita Singh",
    parentPhone: "9543210987",
    visitHistory: [
      { date: "2025-11-15", weight: 12.2, height: 85 },
      { date: "2025-12-15", weight: 12.6, height: 86.5 },
      { date: "2026-01-15", weight: 13.0, height: 88 },
    ],
  },
  {
    id: "C005",
    name: "Mohan Yadav",
    ageMonths: 12,
    gender: "Male",
    height: 72,
    weight: 7.8,
    muac: 12.8,
    bmi: 15.0,
    status: "moderate",
    parentName: "Geeta Yadav",
    parentPhone: "9432109876",
    visitHistory: [
      { date: "2025-11-15", weight: 7.5, height: 70 },
      { date: "2025-12-15", weight: 7.6, height: 71 },
      { date: "2026-01-15", weight: 7.8, height: 72 },
    ],
  },
  {
    id: "C006",
    name: "Lakshmi Devi",
    ageMonths: 48,
    gender: "Female",
    height: 98,
    weight: 13.2,
    muac: 11.5,
    bmi: 13.8,
    status: "severe",
    parentName: "Radha Devi",
    parentPhone: "9321098765",
    visitHistory: [
      { date: "2025-11-15", weight: 13.2, height: 96 },
      { date: "2025-12-15", weight: 13.2, height: 97 },
      { date: "2026-01-15", weight: 13.2, height: 98 },
    ],
  },
  {
    id: "C007",
    name: "Arjun Mishra",
    ageMonths: 42,
    gender: "Male",
    height: 100,
    weight: 16.5,
    muac: 16.0,
    bmi: 16.5,
    status: "normal",
    parentName: "Sita Mishra",
    parentPhone: "9210987654",
    visitHistory: [
      { date: "2025-11-15", weight: 15.8, height: 97 },
      { date: "2025-12-15", weight: 16.1, height: 98.5 },
      { date: "2026-01-15", weight: 16.5, height: 100 },
    ],
  },
];

export function hasWeightStagnation(visitHistory: VisitRecord[]): boolean {
  if (visitHistory.length < 3) return false;
  const last3 = visitHistory.slice(-3);
  return (
    last3[0].weight >= last3[1].weight &&
    last3[1].weight >= last3[2].weight &&
    last3[0].weight === last3[2].weight
  );
}
