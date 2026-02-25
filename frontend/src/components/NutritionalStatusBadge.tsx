import type { NutritionalStatus } from '../utils/dummyData';
import { getStatusLabel } from '../utils/growthCalculations';

interface NutritionalStatusBadgeProps {
  status: NutritionalStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function NutritionalStatusBadge({ status, size = 'md' }: NutritionalStatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const colorClasses = {
    normal: 'bg-status-green-bg text-status-green border border-status-green/30',
    moderate: 'bg-status-yellow-bg text-status-yellow border border-status-yellow/30',
    severe: 'bg-status-red-bg text-status-red border border-status-red/30',
  };

  const dotColors = {
    normal: 'bg-status-green',
    moderate: 'bg-status-yellow',
    severe: 'bg-status-red',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]} ${colorClasses[status]}`}>
      <span className={`w-2 h-2 rounded-full ${dotColors[status]}`} />
      {getStatusLabel(status)}
    </span>
  );
}
