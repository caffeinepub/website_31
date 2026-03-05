import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { useState } from "react";
import type { ChildRecord } from "../utils/dummyData";
import { hasWeightStagnation } from "../utils/dummyData";
import GrowthAlertBanner from "./GrowthAlertBanner";
import NutritionalStatusBadge from "./NutritionalStatusBadge";
import StagnationWarning from "./StagnationWarning";
import WeightTrendChart from "./WeightTrendChart";

interface ChildRecordCardProps {
  child: ChildRecord;
}

export default function ChildRecordCard({ child }: ChildRecordCardProps) {
  const [expanded, setExpanded] = useState(false);
  const stagnation = hasWeightStagnation(child.visitHistory);

  return (
    <Card className="shadow-card overflow-hidden">
      <CardContent className="p-0">
        {/* Card Header Row */}
        <button
          type="button"
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors"
          onClick={() => setExpanded((e) => !e)}
        >
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
            <User size={18} className="text-secondary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">{child.name}</span>
              <span className="text-xs text-muted-foreground">{child.id}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs text-muted-foreground">
                {child.ageMonths}m · {child.gender}
              </span>
              <NutritionalStatusBadge status={child.status} size="sm" />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold">{child.bmi}</p>
            <p className="text-xs text-muted-foreground">BMI</p>
          </div>
          <div className="text-muted-foreground ml-1">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {/* Expanded Details */}
        {expanded && (
          <div className="px-4 pb-4 space-y-3 border-t border-border animate-fade-in">
            <div className="grid grid-cols-3 gap-2 pt-3">
              <div className="bg-muted rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground">Height</p>
                <p className="font-semibold text-sm">{child.height} cm</p>
              </div>
              <div className="bg-muted rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground">Weight</p>
                <p className="font-semibold text-sm">{child.weight} kg</p>
              </div>
              <div className="bg-muted rounded-lg p-2 text-center">
                <p className="text-xs text-muted-foreground">MUAC</p>
                <p className="font-semibold text-sm">
                  {child.muac ? `${child.muac} cm` : "—"}
                </p>
              </div>
            </div>

            <WeightTrendChart
              visitHistory={child.visitHistory}
              childName={child.name}
            />

            {stagnation && <StagnationWarning childName={child.name} />}
            {child.status !== "normal" && (
              <GrowthAlertBanner status={child.status} childName={child.name} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
