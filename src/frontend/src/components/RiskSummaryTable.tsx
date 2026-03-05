import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import type { ChildRecord } from "../utils/dummyData";
import NutritionalStatusBadge from "./NutritionalStatusBadge";

interface RiskSummaryTableProps {
  records: ChildRecord[];
}

export default function RiskSummaryTable({ records }: RiskSummaryTableProps) {
  const sorted = [...records].sort((a, b) => {
    const order = { severe: 0, moderate: 1, normal: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <h3 className="font-heading font-semibold text-sm mb-3">
          Risk Summary – All Children
        </h3>
        <div className="space-y-2">
          {sorted.map((child) => (
            <div
              key={child.id}
              className="flex items-center gap-3 py-2 border-b border-border last:border-0"
            >
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <User size={14} className="text-secondary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{child.name}</p>
                <p className="text-xs text-muted-foreground">
                  {child.ageMonths}m · BMI {child.bmi}
                </p>
              </div>
              <NutritionalStatusBadge status={child.status} size="sm" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
