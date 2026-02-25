import type { NutritionalStatus } from '../utils/dummyData';
import { Leaf, AlertTriangle, AlertCircle } from 'lucide-react';

interface NutritionTipsProps {
  status: NutritionalStatus;
}

const tips: Record<NutritionalStatus, { title: string; items: string[]; icon: typeof Leaf }> = {
  normal: {
    title: 'Maintain Healthy Growth',
    icon: Leaf,
    items: [
      'Continue breastfeeding if under 2 years',
      'Offer diverse foods: cereals, pulses, vegetables, fruits',
      'Ensure 3 meals + 2 healthy snacks daily',
      'Maintain regular deworming schedule',
      'Keep up with immunization schedule',
    ],
  },
  moderate: {
    title: 'Supplementary Nutrition Needed',
    icon: AlertTriangle,
    items: [
      'Enroll in Supplementary Nutrition Programme (SNP)',
      'Increase calorie-dense foods: peanuts, eggs, milk',
      'Add energy-dense snacks between meals',
      'Visit AWC daily for supplementary feeding',
      'Monitor weight every 2 weeks',
      'Consult ASHA worker for home-based care',
    ],
  },
  severe: {
    title: 'Urgent Medical Attention Required',
    icon: AlertCircle,
    items: [
      'Immediate referral to Nutrition Rehabilitation Centre (NRC)',
      'Therapeutic feeding with RUTF (Ready-to-Use Therapeutic Food)',
      'Medical evaluation for infections/complications',
      'Intensive counseling for mother/caregiver',
      'Daily monitoring by AWW and ASHA',
      'Contact district health officer immediately',
    ],
  },
};

export default function NutritionTips({ status }: NutritionTipsProps) {
  const { title, items, icon: Icon } = tips[status];

  const colorClasses = {
    normal: 'bg-status-green-bg border-status-green/30 text-status-green',
    moderate: 'bg-status-yellow-bg border-status-yellow/30 text-status-yellow',
    severe: 'bg-status-red-bg border-status-red/30 text-status-red',
  };

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[status]}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} />
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      <ul className="space-y-1.5">
        {items.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-current shrink-0" />
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
