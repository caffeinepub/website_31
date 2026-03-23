import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import ChildSummaryCard from "../components/ChildSummaryCard";
import NutritionTips from "../components/NutritionTips";
import SMSAlertButton from "../components/SMSAlertButton";
import { getAttendanceForChild } from "../utils/attendanceData";
import { dummyChildren } from "../utils/dummyData";

export default function ParentView() {
  const [selectedChildId, setSelectedChildId] = useState(dummyChildren[0].id);
  const child =
    dummyChildren.find((c) => c.id === selectedChildId) ?? dummyChildren[0];
  const attendance = getAttendanceForChild(child.id);

  return (
    <div className="space-y-4">
      <h2 className="font-heading font-bold text-lg">Parent Dashboard</h2>

      <Card>
        <CardContent className="p-4">
          <label
            htmlFor="child-select"
            className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2"
          >
            Select Child
          </label>
          <Select value={selectedChildId} onValueChange={setSelectedChildId}>
            <SelectTrigger id="child-select" className="h-11">
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent>
              {dummyChildren.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <ChildSummaryCard child={child} attendance={attendance} />

      <div>
        <h3 className="font-heading font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wide">
          Nutrition Guidance
        </h3>
        <NutritionTips status={child.status} />
      </div>

      <div>
        <h3 className="font-heading font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wide">
          Parent Communication
        </h3>
        <SMSAlertButton
          childName={child.name}
          parentName={child.parentName}
          parentPhone={child.parentPhone}
        />
      </div>

      <div className="bg-secondary/40 border border-primary/20 rounded-lg p-3">
        <p className="text-xs font-semibold text-primary mb-1">
          ICDS Programme Information
        </p>
        <p className="text-xs text-muted-foreground">
          Integrated Child Development Services (ICDS) provides nutrition,
          health, and education services to children under 6 years and
          pregnant/lactating mothers.
        </p>
      </div>
    </div>
  );
}
