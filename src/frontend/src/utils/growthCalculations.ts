import type { NutritionalStatus } from "./dummyData";

export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Number.parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}

/**
 * WHO-based nutritional status classification for children under 5
 * Uses BMI-for-age approximations:
 * - Severe Acute Malnutrition (SAM): BMI < 13.0 (approx <-3 SD)
 * - Moderate Acute Malnutrition (MAM): BMI 13.0–14.9 (approx -3 to -2 SD)
 * - Normal: BMI >= 15.0
 *
 * MUAC thresholds (if provided):
 * - SAM: MUAC < 11.5 cm
 * - MAM: MUAC 11.5–12.4 cm
 * - Normal: MUAC >= 12.5 cm
 */
export function classifyNutritionalStatus(
  bmi: number,
  ageMonths: number,
  muac?: number,
): NutritionalStatus {
  // MUAC takes priority if provided
  if (muac !== undefined) {
    if (muac < 11.5) return "severe";
    if (muac < 12.5) return "moderate";
  }

  // Age-adjusted BMI thresholds (simplified WHO approximations)
  let severeThreshold = 13.0;
  let moderateThreshold = 15.0;

  if (ageMonths <= 12) {
    severeThreshold = 14.0;
    moderateThreshold = 16.0;
  } else if (ageMonths <= 24) {
    severeThreshold = 13.5;
    moderateThreshold = 15.5;
  } else if (ageMonths <= 36) {
    severeThreshold = 13.0;
    moderateThreshold = 15.0;
  } else {
    severeThreshold = 12.5;
    moderateThreshold = 14.5;
  }

  if (bmi < severeThreshold) return "severe";
  if (bmi < moderateThreshold) return "moderate";
  return "normal";
}

export function getStatusLabel(status: NutritionalStatus): string {
  switch (status) {
    case "normal":
      return "Normal";
    case "moderate":
      return "Moderate Risk (MAM)";
    case "severe":
      return "Severe Risk (SAM)";
  }
}

export function getStatusColor(
  status: NutritionalStatus,
): "green" | "yellow" | "red" {
  switch (status) {
    case "normal":
      return "green";
    case "moderate":
      return "yellow";
    case "severe":
      return "red";
  }
}
