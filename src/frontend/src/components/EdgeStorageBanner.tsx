import { Database } from "lucide-react";

export default function EdgeStorageBanner() {
  return (
    <div className="flex items-center gap-3 bg-secondary/60 border border-primary/20 rounded-lg p-3">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Database size={16} className="text-primary" />
      </div>
      <div>
        <p className="text-xs font-semibold text-primary">
          Lightweight Edge-Based Storage
        </p>
        <p className="text-xs text-muted-foreground">
          Minimal data recorded per session · Works offline
        </p>
      </div>
    </div>
  );
}
