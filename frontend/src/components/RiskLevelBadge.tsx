import type { RiskLevelLocal } from '../utils/pregnantWomenData';

interface RiskLevelBadgeProps {
  riskLevel: RiskLevelLocal;
  size?: 'sm' | 'md' | 'lg';
}

const riskConfig: Record<RiskLevelLocal, { label: string; colorClass: string; dotClass: string }> = {
  normal: {
    label: 'Normal',
    colorClass: 'bg-status-green-bg text-status-green border border-status-green/30',
    dotClass: 'bg-status-green',
  },
  moderate: {
    label: 'Moderate Risk',
    colorClass: 'bg-status-yellow-bg text-status-yellow border border-status-yellow/30',
    dotClass: 'bg-status-yellow',
  },
  high: {
    label: 'High Risk',
    colorClass: 'bg-status-red-bg text-status-red border border-status-red/30',
    dotClass: 'bg-status-red',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export function getRiskLevelColor(riskLevel: RiskLevelLocal): string {
  return riskConfig[riskLevel].colorClass;
}

export function getRiskLevelDotColor(riskLevel: RiskLevelLocal): string {
  return riskConfig[riskLevel].dotClass;
}

export default function RiskLevelBadge({ riskLevel, size = 'md' }: RiskLevelBadgeProps) {
  const config = riskConfig[riskLevel];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]} ${config.colorClass}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}
