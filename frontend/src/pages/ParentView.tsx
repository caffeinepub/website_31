import { useState } from 'react';
import ChildSummaryCard from '../components/ChildSummaryCard';
import NutritionTips from '../components/NutritionTips';
import SMSAlertButton from '../components/SMSAlertButton';
import { dummyChildren } from '../utils/dummyData';
import { getAttendanceForChild } from '../utils/attendanceData';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users } from 'lucide-react';

export default function ParentView() {
  const [selectedChildId, setSelectedChildId] = useState(dummyChildren[0].id);
  const child = dummyChildren.find(c => c.id === selectedChildId) ?? dummyChildren[0];
  const attendance = getAttendanceForChild(child.id);

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Users size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg">Parent Dashboard</h2>
          <p className="text-xs text-muted-foreground">Child health summary for parents</p>
        </div>
      </div>

      {/* Child Selector */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
            Select Child
          </label>
          <Select value={selectedChildId} onValueChange={setSelectedChildId}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent>
              {dummyChildren.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Child Summary */}
      <ChildSummaryCard child={child} attendance={attendance} />

      {/* Nutrition Tips */}
      <div>
        <h3 className="font-heading font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wide">
          Nutrition Guidance
        </h3>
        <NutritionTips status={child.status} />
      </div>

      {/* SMS Alert */}
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

      {/* ICDS Info */}
      <div className="bg-secondary/40 border border-primary/20 rounded-lg p-3">
        <p className="text-xs font-semibold text-primary mb-1">ICDS Programme Information</p>
        <p className="text-xs text-muted-foreground">
          Integrated Child Development Services (ICDS) provides nutrition, health, and education services to children under 6 years and pregnant/lactating mothers.
        </p>
      </div>
    </div>
  );
}
