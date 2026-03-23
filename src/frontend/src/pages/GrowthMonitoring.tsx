import ChildRecordCard from "../components/ChildRecordCard";
import GrowthForm from "../components/GrowthForm";
import { dummyChildren } from "../utils/dummyData";

export default function GrowthMonitoring() {
  return (
    <div className="space-y-4">
      <h2 className="font-heading font-bold text-lg">
        Child Growth Monitoring
      </h2>

      <div className="bg-secondary/50 border border-primary/20 rounded-lg p-3">
        <p className="text-xs font-semibold text-primary">
          WHO Child Growth Standards
        </p>
        <p className="text-xs text-muted-foreground">
          BMI-for-age thresholds · MUAC screening · SAM/MAM classification
        </p>
      </div>

      <GrowthForm />

      <div>
        <h3 className="font-heading font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wide">
          Registered Children ({dummyChildren.length})
        </h3>
        <div className="space-y-2">
          {dummyChildren.map((child) => (
            <ChildRecordCard key={child.id} child={child} />
          ))}
        </div>
      </div>
    </div>
  );
}
