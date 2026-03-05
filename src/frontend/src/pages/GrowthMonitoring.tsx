import { Activity } from "lucide-react";
import ChildRecordCard from "../components/ChildRecordCard";
import GrowthForm from "../components/GrowthForm";
import { dummyChildren } from "../utils/dummyData";

export default function GrowthMonitoring() {
  return (
    <div className="space-y-4 animate-slide-up">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Activity size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-lg">
            Child Growth Monitoring
          </h2>
          <p className="text-xs text-muted-foreground">
            WHO-based nutritional assessment
          </p>
        </div>
      </div>

      {/* WHO Reference Banner */}
      <div className="bg-secondary/50 border border-primary/20 rounded-lg p-3 flex items-start gap-2">
        <img
          src="/assets/generated/growth-icon.dim_128x128.png"
          alt=""
          className="w-8 h-8 rounded object-cover shrink-0"
        />
        <div>
          <p className="text-xs font-semibold text-primary">
            WHO Child Growth Standards
          </p>
          <p className="text-xs text-muted-foreground">
            BMI-for-age thresholds · MUAC screening · SAM/MAM classification
          </p>
        </div>
      </div>

      {/* Growth Form */}
      <GrowthForm />

      {/* Existing Records */}
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
