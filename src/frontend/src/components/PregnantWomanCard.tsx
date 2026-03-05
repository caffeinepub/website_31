import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Phone,
  PlusCircle,
  User,
} from "lucide-react";
import { useState } from "react";
import type { PregnancyRecordView } from "../backend";
import { nanoTimestampToDate } from "../utils/gestationalCalculations";
import type { PregnantWoman } from "../utils/pregnantWomenData";
import AddVisitForm from "./AddVisitForm";
import RiskLevelBadge from "./RiskLevelBadge";

// Unified type that works with both local dummy data and backend data
type CardData = {
  name: string;
  age: number;
  husbandName: string;
  address: string;
  phoneNumber: string;
  gestationalAge: number;
  trimester: 1 | 2 | 3;
  riskLevel: "normal" | "moderate" | "high";
  eddDate: string; // formatted date string
  weight: number;
  hemoglobinLevel: number;
  bloodPressure: number;
  visitHistory: {
    visitDate: string;
    weight: number;
    bloodPressure: number;
    hemoglobin: number;
    notes: string;
  }[];
};

interface PregnantWomanCardProps {
  data: CardData;
  onVisitAdded?: () => void;
}

function trimesterLabel(t: 1 | 2 | 3): string {
  return t === 1
    ? "1st Trimester"
    : t === 2
      ? "2nd Trimester"
      : "3rd Trimester";
}

function trimesterColor(t: 1 | 2 | 3): string {
  if (t === 1) return "bg-blue-50 text-blue-700 border border-blue-200";
  if (t === 2) return "bg-purple-50 text-purple-700 border border-purple-200";
  return "bg-orange-50 text-orange-700 border border-orange-200";
}

export function toCardData(record: PregnancyRecordView): CardData {
  const edd = nanoTimestampToDate(record.eddDate);
  const riskMap: Record<string, "normal" | "moderate" | "high"> = {
    normal: "normal",
    moderate: "moderate",
    high: "high",
  };
  return {
    name: record.name,
    age: Number(record.age),
    husbandName: record.husbandName,
    address: record.address,
    phoneNumber: record.phoneNumber,
    gestationalAge: Number(record.gestationalAge),
    trimester: (Number(record.trimester) as 1 | 2 | 3) || 1,
    riskLevel: riskMap[record.riskLevel] ?? "normal",
    eddDate: edd.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    weight: record.weight,
    hemoglobinLevel: record.hemoglobinLevel,
    bloodPressure: Number(record.bloodPressure),
    visitHistory: record.visitHistory.map((v) => ({
      visitDate: nanoTimestampToDate(v.visitDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      weight: v.weight,
      bloodPressure: Number(v.bloodPressure),
      hemoglobin: v.hemoglobin,
      notes: v.notes,
    })),
  };
}

export function localToCardData(pw: PregnantWoman): CardData {
  const edd = new Date(pw.eddDate);
  return {
    name: pw.name,
    age: pw.age,
    husbandName: pw.husbandName,
    address: pw.address,
    phoneNumber: pw.phoneNumber,
    gestationalAge: pw.gestationalAge,
    trimester: pw.trimester,
    riskLevel: pw.riskLevel,
    eddDate: edd.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    weight: pw.weight,
    hemoglobinLevel: pw.hemoglobinLevel,
    bloodPressure: pw.bloodPressure,
    visitHistory: pw.visitHistory.map((v) => ({
      visitDate: new Date(v.visitDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      weight: v.weight,
      bloodPressure: v.bloodPressure,
      hemoglobin: v.hemoglobin,
      notes: v.notes,
    })),
  };
}

export default function PregnantWomanCard({
  data,
  onVisitAdded,
}: PregnantWomanCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [addVisitOpen, setAddVisitOpen] = useState(false);

  return (
    <>
      <Card className="shadow-card overflow-hidden">
        <CardContent className="p-0">
          {/* Collapsed Header */}
          <button
            type="button"
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors"
            onClick={() => setExpanded((e) => !e)}
          >
            <div className="w-10 h-10 rounded-full bg-pink-50 border border-pink-200 flex items-center justify-center shrink-0">
              <User size={18} className="text-pink-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">{data.name}</span>
                <span className="text-xs text-muted-foreground">
                  Age {data.age}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span
                  className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${trimesterColor(data.trimester)}`}
                >
                  {trimesterLabel(data.trimester)}
                </span>
                <RiskLevelBadge riskLevel={data.riskLevel} size="sm" />
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">EDD</p>
              <p className="text-xs font-semibold">{data.eddDate}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {data.gestationalAge}w
              </p>
            </div>
            <div className="text-muted-foreground ml-1">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>

          {/* Expanded Details */}
          {expanded && (
            <div className="px-4 pb-4 space-y-3 border-t border-border animate-fade-in">
              {/* Contact & Address */}
              <div className="pt-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone size={12} />
                  <span>{data.phoneNumber}</span>
                  <span className="mx-1">·</span>
                  <span>H/o {data.husbandName}</span>
                </div>
                <p className="text-xs text-muted-foreground">{data.address}</p>
              </div>

              {/* Latest Vitals */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-muted rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="font-semibold text-sm">{data.weight} kg</p>
                </div>
                <div className="bg-muted rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground">BP (sys)</p>
                  <p className="font-semibold text-sm">
                    {data.bloodPressure} mmHg
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground">Hb</p>
                  <p className="font-semibold text-sm">
                    {data.hemoglobinLevel} g/dL
                  </p>
                </div>
              </div>

              {/* Visit History */}
              {data.visitHistory.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Visit History ({data.visitHistory.length})
                  </p>
                  <div className="space-y-2">
                    {[...data.visitHistory].reverse().map((visit) => (
                      <div
                        key={visit.visitDate}
                        className="bg-muted/50 rounded-lg p-3 border border-border/60"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <Calendar
                            size={12}
                            className="text-muted-foreground"
                          />
                          <span className="text-xs font-medium">
                            {visit.visitDate}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-1">
                          <div>
                            <p className="text-xs text-muted-foreground">Wt</p>
                            <p className="text-xs font-semibold">
                              {visit.weight} kg
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">BP</p>
                            <p className="text-xs font-semibold">
                              {visit.bloodPressure} mmHg
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Hb</p>
                            <p className="text-xs font-semibold">
                              {visit.hemoglobin} g/dL
                            </p>
                          </div>
                        </div>
                        {visit.notes && (
                          <p className="text-xs text-muted-foreground italic">
                            {visit.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Visit Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 border-primary/40 text-primary hover:bg-primary/5"
                onClick={(e) => {
                  e.stopPropagation();
                  setAddVisitOpen(true);
                }}
              >
                <PlusCircle size={14} />
                Add Visit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Visit Dialog */}
      <Dialog open={addVisitOpen} onOpenChange={setAddVisitOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Record Visit — {data.name}</DialogTitle>
          </DialogHeader>
          <AddVisitForm
            phoneNumber={data.phoneNumber}
            onSuccess={() => {
              setAddVisitOpen(false);
              onVisitAdded?.();
            }}
            onCancel={() => setAddVisitOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
