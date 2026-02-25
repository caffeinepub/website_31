import type { NutritionalStatus } from '../utils/dummyData';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface GrowthAlertBannerProps {
  status: NutritionalStatus;
  childName: string;
}

export default function GrowthAlertBanner({ status, childName }: GrowthAlertBannerProps) {
  if (status === 'normal') return null;

  const isSevere = status === 'severe';

  return (
    <div
      className={`flex items-start gap-3 rounded-lg p-4 border animate-fade-in ${
        isSevere
          ? 'bg-status-red-bg border-status-red/30'
          : 'bg-status-yellow-bg border-status-yellow/30'
      }`}
    >
      {isSevere ? (
        <AlertCircle className="text-status-red mt-0.5 shrink-0" size={20} />
      ) : (
        <AlertTriangle className="text-status-yellow mt-0.5 shrink-0" size={20} />
      )}
      <div>
        <p className={`font-semibold text-sm ${isSevere ? 'text-status-red' : 'text-status-yellow'}`}>
          {isSevere ? '⚠ Severe Acute Malnutrition (SAM) Detected' : '⚠ Moderate Acute Malnutrition (MAM) Detected'}
        </p>
        <p className="text-sm text-foreground/80 mt-0.5">
          {isSevere
            ? `${childName} requires immediate referral to NRC/CMAM program. Contact health supervisor.`
            : `${childName} needs supplementary nutrition support. Enroll in TPDS/SNP program.`}
        </p>
      </div>
    </div>
  );
}
