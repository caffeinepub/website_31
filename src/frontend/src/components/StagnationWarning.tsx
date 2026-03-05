import { TrendingDown } from "lucide-react";

interface StagnationWarningProps {
  childName: string;
}

export default function StagnationWarning({
  childName,
}: StagnationWarningProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg p-4 bg-status-yellow-bg border border-status-yellow/30 animate-fade-in">
      <TrendingDown className="text-status-yellow mt-0.5 shrink-0" size={20} />
      <div>
        <p className="font-semibold text-sm text-status-yellow">
          Growth Stagnation Detected
        </p>
        <p className="text-sm text-foreground/80 mt-0.5">
          {childName}'s weight has not increased over the last 3 monthly visits.
          Immediate nutritional counseling recommended.
        </p>
      </div>
    </div>
  );
}
