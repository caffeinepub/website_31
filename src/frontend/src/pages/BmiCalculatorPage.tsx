import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  Calculator,
  ChevronDown,
  ChevronUp,
  Flame,
  History,
  Scale,
  TrendingUp,
  User,
} from "lucide-react";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import type { BMIRecord } from "../backend.d";
import { useActor } from "../hooks/useActor";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
}

interface CalculationResult {
  bmi: number;
  bmiCategory: BmiCategory;
  idealWeightMin: number;
  idealWeightMax: number;
  bodyFatPercent: number;
  bodyFatCategory: string;
  bmr: number;
  tdee: number;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
}

type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useGetAllBMIRecords() {
  const { actor, isFetching } = useActor();
  return useQuery<BMIRecord[]>({
    queryKey: ["bmiRecords"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBMIRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

function useAddBMIRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      age: bigint;
      gender: string;
      heightCm: number;
      weightKg: number;
      bmi: number;
      timestamp: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addBMIRecord(
        params.name,
        params.age,
        params.gender,
        params.heightCm,
        params.weightKg,
        params.bmi,
        params.timestamp,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bmiRecords"] });
    },
  });
}

// ─── Calculations ─────────────────────────────────────────────────────────────

function calcBMI(weightKg: number, heightCm: number): number {
  const h = heightCm / 100;
  return weightKg / (h * h);
}

function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

function calcIdealWeight(heightCm: number) {
  const h2 = (heightCm / 100) ** 2;
  return { min: 18.5 * h2, max: 24.9 * h2 };
}

function calcBodyFat(bmi: number, age: number, gender: string): number {
  if (gender === "Male") {
    return 1.2 * bmi + 0.23 * age - 16.2;
  }
  return 1.2 * bmi + 0.23 * age - 5.4;
}

function getBodyFatCategory(bodyFat: number, gender: string): string {
  if (gender === "Male") {
    if (bodyFat < 8) return "Low";
    if (bodyFat < 20) return "Normal";
    if (bodyFat < 25) return "High";
    return "Obese";
  }
  if (bodyFat < 21) return "Low";
  if (bodyFat < 33) return "Normal";
  if (bodyFat < 39) return "High";
  return "Obese";
}

function calcBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "Male" ? base + 5 : base - 161;
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  Sedentary: 1.2,
  Light: 1.375,
  Moderate: 1.55,
  Active: 1.725,
  "Very Active": 1.9,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const bmiZoneColors = {
  underweight: {
    bg: "bg-blue-50 border-blue-300",
    badge: "bg-blue-100 text-blue-800 border-blue-300",
    icon: "text-blue-600",
    label: "Underweight",
    description:
      "Your BMI is below the healthy range. Consider consulting a nutritionist.",
    textColor: "text-blue-700",
  },
  normal: {
    bg: "bg-green-50 border-green-300",
    badge: "bg-green-100 text-green-800 border-green-300",
    icon: "text-green-600",
    label: "Normal Weight",
    description:
      "Your BMI is in the healthy range. Keep maintaining a balanced lifestyle!",
    textColor: "text-green-700",
  },
  overweight: {
    bg: "bg-orange-50 border-orange-300",
    badge: "bg-orange-100 text-orange-800 border-orange-300",
    icon: "text-orange-600",
    label: "Overweight",
    description:
      "Your BMI is above the healthy range. Regular exercise and diet review recommended.",
    textColor: "text-orange-700",
  },
  obese: {
    bg: "bg-red-50 border-red-400",
    badge: "bg-red-100 text-red-800 border-red-400",
    icon: "text-red-600",
    label: "Obese – Critical",
    description:
      "Your BMI indicates a high health risk. Please consult a healthcare professional immediately.",
    textColor: "text-red-700",
  },
};

function BmiProgressBar({ bmi }: { bmi: number }) {
  // Scale: 10 to 40 (30 unit range)
  const MIN = 10;
  const MAX = 40;
  const pct = Math.min(100, Math.max(0, ((bmi - MIN) / (MAX - MIN)) * 100));

  return (
    <div className="mt-4 space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground font-medium">
        <span>10</span>
        <span className="text-blue-600">18.5</span>
        <span className="text-green-600">24.9</span>
        <span className="text-orange-600">30</span>
        <span>40</span>
      </div>
      <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 via-green-400 via-50% to-red-500">
        {/* Zone markers */}
        <div className="absolute inset-0 flex">
          <div className="bg-blue-400" style={{ width: "28.33%" }} />
          <div className="bg-green-400" style={{ width: "21.67%" }} />
          <div className="bg-orange-400" style={{ width: "16.67%" }} />
          <div className="flex-1 bg-red-500" />
        </div>
        {/* Indicator */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-md rounded-full transition-all duration-700"
          style={{ left: `calc(${pct}% - 2px)` }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-medium">
        <span className="text-blue-600">Underweight</span>
        <span className="text-green-600">Normal</span>
        <span className="text-orange-600">Overweight</span>
        <span className="text-red-600">Obese</span>
      </div>
    </div>
  );
}

function RiskAlertCard({ result }: { result: CalculationResult }) {
  const zone = bmiZoneColors[result.bmiCategory];
  const isObese = result.bmiCategory === "obese";

  return (
    <Card
      data-ocid="bmi.risk_alert.card"
      className={`border-2 ${zone.bg} ${isObese ? "ring-2 ring-red-400 ring-offset-1" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-full ${isObese ? "bg-red-100" : "bg-white/60"}`}
          >
            <AlertTriangle size={22} className={zone.icon} />
          </div>
          <div>
            <CardTitle className={`text-base font-bold ${zone.textColor}`}>
              {isObese ? "⚠️ Critical Alert" : "BMI Status"}
            </CardTitle>
            <Badge
              className={`mt-0.5 border text-xs font-semibold ${zone.badge}`}
            >
              {zone.label}
            </Badge>
          </div>
          <div
            className={`ml-auto text-3xl font-extrabold font-heading ${zone.textColor}`}
          >
            {result.bmi.toFixed(1)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className={`text-sm mb-3 ${zone.textColor}`}>{zone.description}</p>
        <BmiProgressBar bmi={result.bmi} />
      </CardContent>
    </Card>
  );
}

function IdealWeightCard({ result }: { result: CalculationResult }) {
  const { idealWeightMin, idealWeightMax, weight } = result;
  const diff =
    weight < idealWeightMin
      ? `${(idealWeightMin - weight).toFixed(1)} kg below`
      : weight > idealWeightMax
        ? `${(weight - idealWeightMax).toFixed(1)} kg above`
        : null;
  const isInRange = diff === null;
  const minPct = Math.round((idealWeightMin / (weight * 1.5)) * 100);
  const maxPct = Math.round((idealWeightMax / (weight * 1.5)) * 100);
  const currentPct = Math.min(100, Math.round((weight / (weight * 1.5)) * 100));

  return (
    <Card data-ocid="bmi.ideal_weight.card" className="border border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Scale size={18} className="text-primary" />
          <CardTitle className="text-sm font-bold text-foreground">
            Ideal Weight Range
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/60 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Min Healthy</p>
            <p className="text-xl font-extrabold text-primary font-heading">
              {idealWeightMin.toFixed(1)}
              <span className="text-xs font-normal ml-1">kg</span>
            </p>
          </div>
          <div className="bg-secondary/60 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Max Healthy</p>
            <p className="text-xl font-extrabold text-primary font-heading">
              {idealWeightMax.toFixed(1)}
              <span className="text-xs font-normal ml-1">kg</span>
            </p>
          </div>
        </div>
        {/* Visual bar */}
        <div className="space-y-1">
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-green-400 rounded-full"
              style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
            />
            <div
              className="absolute top-0 bottom-0 w-2 h-2 my-auto rounded-full bg-primary-foreground border-2 border-primary shadow"
              style={{ left: `calc(${currentPct}% - 4px)`, top: "2px" }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{idealWeightMin.toFixed(0)} kg</span>
            <span className="font-medium text-foreground">
              You: {weight.toFixed(1)} kg
            </span>
            <span>{idealWeightMax.toFixed(0)} kg</span>
          </div>
        </div>
        {isInRange ? (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <span className="text-green-600 text-sm">✓</span>
            <p className="text-xs text-green-700 font-medium">
              You are within the healthy weight range
            </p>
          </div>
        ) : (
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${
              weight < idealWeightMin
                ? "bg-blue-50 border-blue-200"
                : "bg-orange-50 border-orange-200"
            }`}
          >
            {weight < idealWeightMin ? (
              <ChevronDown size={14} className="text-blue-600 shrink-0" />
            ) : (
              <ChevronUp size={14} className="text-orange-600 shrink-0" />
            )}
            <p
              className={`text-xs font-medium ${
                weight < idealWeightMin ? "text-blue-700" : "text-orange-700"
              }`}
            >
              You are {diff} the healthy range
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BodyFatCard({ result }: { result: CalculationResult }) {
  const { bodyFatPercent, bodyFatCategory, gender } = result;
  const catColors: Record<string, string> = {
    Low: "text-blue-700 bg-blue-50 border-blue-200",
    Normal: "text-green-700 bg-green-50 border-green-200",
    High: "text-orange-700 bg-orange-50 border-orange-200",
    Obese: "text-red-700 bg-red-50 border-red-200",
  };
  const progressPct = Math.min(100, Math.max(0, bodyFatPercent));

  return (
    <Card data-ocid="bmi.body_fat.card" className="border border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-primary" />
          <CardTitle className="text-sm font-bold text-foreground">
            Body Fat Estimate
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-end gap-3">
          <p className="text-4xl font-extrabold font-heading text-foreground">
            {bodyFatPercent.toFixed(1)}
            <span className="text-lg font-normal ml-0.5">%</span>
          </p>
          <Badge
            className={`mb-1 border text-xs font-semibold ${catColors[bodyFatCategory] ?? ""}`}
          >
            {bodyFatCategory}
          </Badge>
        </div>
        <div className="space-y-1">
          <Progress value={progressPct} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Body fat percentage estimate based on BMI & age
          </p>
        </div>
        <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
          {(gender === "Male"
            ? [
                { label: "Low", range: "<8%", color: "text-blue-600" },
                { label: "Normal", range: "8–19%", color: "text-green-600" },
                { label: "High", range: "20–24%", color: "text-orange-600" },
                { label: "Obese", range: "25%+", color: "text-red-600" },
              ]
            : [
                { label: "Low", range: "<21%", color: "text-blue-600" },
                { label: "Normal", range: "21–32%", color: "text-green-600" },
                { label: "High", range: "33–38%", color: "text-orange-600" },
                { label: "Obese", range: "39%+", color: "text-red-600" },
              ]
          ).map((cat) => (
            <div
              key={cat.label}
              className={`rounded p-1 bg-muted ${cat.label === bodyFatCategory ? "ring-1 ring-current" : ""} ${cat.color}`}
            >
              <div className="font-semibold">{cat.label}</div>
              <div className="text-muted-foreground font-normal">
                {cat.range}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CalorieNeedsCard({ result }: { result: CalculationResult }) {
  const { bmr, tdee } = result;

  return (
    <Card data-ocid="bmi.calorie_needs.card" className="border border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-primary" />
          <CardTitle className="text-sm font-bold text-foreground">
            Daily Calorie Needs
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-secondary/60 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">BMR (Base)</p>
            <p className="text-xl font-extrabold text-foreground font-heading">
              {Math.round(bmr)}
              <span className="text-xs font-normal ml-1">kcal</span>
            </p>
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">TDEE (Active)</p>
            <p className="text-xl font-extrabold text-primary font-heading">
              {Math.round(tdee)}
              <span className="text-xs font-normal ml-1">kcal</span>
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            {
              label: "Weight Loss",
              cal: Math.round(tdee * 0.8),
              color: "bg-blue-100 text-blue-700",
            },
            {
              label: "Maintenance",
              cal: Math.round(tdee),
              color: "bg-green-100 text-green-700",
            },
            {
              label: "Weight Gain",
              cal: Math.round(tdee * 1.15),
              color: "bg-orange-100 text-orange-700",
            },
          ].map((goal) => (
            <div
              key={goal.label}
              className={`flex justify-between items-center rounded-lg px-3 py-1.5 ${goal.color}`}
            >
              <span className="text-xs font-medium">{goal.label}</span>
              <span className="text-sm font-bold">{goal.cal} kcal/day</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          TDEE = BMR × activity multiplier (Mifflin-St Jeor equation)
        </p>
      </CardContent>
    </Card>
  );
}

const chartConfig = {
  bmi: {
    label: "BMI",
    color: "oklch(0.48 0.13 145)",
  },
} satisfies ChartConfig;

function TrendChartCard({ records }: { records: BMIRecord[] }) {
  const sorted = [...records].sort(
    (a, b) => Number(a.timestamp) - Number(b.timestamp),
  );
  const chartData = sorted.map((r) => ({
    date: formatShortDate(r.timestamp),
    bmi: Number(r.bmi.toFixed(2)),
  }));

  return (
    <Card data-ocid="bmi.trend_chart.card" className="border border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-primary" />
          <CardTitle className="text-sm font-bold text-foreground">
            BMI Trend Over Time
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length < 2 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
            <TrendingUp size={32} className="text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              Add more entries to see your BMI trend
            </p>
            <p className="text-xs text-muted-foreground/70">
              {chartData.length === 0
                ? "No entries yet"
                : "Need at least 2 entries for a chart"}
            </p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[180px] w-full">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.88 0.01 250 / 0.5)"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                width={35}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="bmi"
                stroke="oklch(0.48 0.13 145)"
                strokeWidth={2.5}
                dot={{ fill: "oklch(0.48 0.13 145)", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              {/* Reference lines for BMI zones */}
              <CartesianGrid
                strokeDasharray="6 0"
                stroke="oklch(0.6 0.16 145 / 0.3)"
                horizontal={true}
                vertical={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

function HistoryLogCard({ records }: { records: BMIRecord[] }) {
  const sorted = [...records].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  );

  return (
    <Card data-ocid="bmi.history_log.card" className="border border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <History size={18} className="text-primary" />
          <CardTitle className="text-sm font-bold text-foreground">
            BMI History Log
          </CardTitle>
          {sorted.length > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {sorted.length} {sorted.length === 1 ? "record" : "records"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {sorted.length === 0 ? (
          <div
            data-ocid="bmi.history_log.empty_state"
            className="flex flex-col items-center justify-center py-8 gap-2 text-center px-4"
          >
            <History size={32} className="text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">
              No BMI records yet. Submit your first calculation above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="text-xs py-2">Name</TableHead>
                  <TableHead className="text-xs py-2 text-center">
                    Age
                  </TableHead>
                  <TableHead className="text-xs py-2 text-center">
                    Gender
                  </TableHead>
                  <TableHead className="text-xs py-2 text-center">
                    Ht(cm)
                  </TableHead>
                  <TableHead className="text-xs py-2 text-center">
                    Wt(kg)
                  </TableHead>
                  <TableHead className="text-xs py-2 text-center">
                    BMI
                  </TableHead>
                  <TableHead className="text-xs py-2 text-center">
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((record, idx) => {
                  const prevRecord = sorted[idx + 1];
                  const delta =
                    prevRecord != null ? record.bmi - prevRecord.bmi : null;
                  const ocidIndex = idx + 1;

                  return (
                    <TableRow
                      key={`${record.timestamp}-${idx}`}
                      data-ocid={`bmi.history_log.row.${ocidIndex}`}
                      className="text-xs"
                    >
                      <TableCell className="py-2 font-medium max-w-[80px] truncate">
                        {record.name}
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        {Number(record.age)}
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1 py-0 ${
                            record.gender === "Male"
                              ? "border-blue-300 text-blue-700"
                              : "border-pink-300 text-pink-700"
                          }`}
                        >
                          {record.gender === "Male" ? "M" : "F"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        {record.heightCm}
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        {record.weightKg.toFixed(1)}
                      </TableCell>
                      <TableCell className="py-2 text-center font-semibold">
                        <span
                          className={`inline-flex items-center gap-0.5 ${
                            record.bmi < 18.5
                              ? "text-blue-700"
                              : record.bmi < 25
                                ? "text-green-700"
                                : record.bmi < 30
                                  ? "text-orange-700"
                                  : "text-red-700"
                          }`}
                        >
                          {record.bmi.toFixed(1)}
                          {delta !== null && (
                            <span
                              className={`text-[9px] ml-0.5 ${
                                delta < 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {delta < 0 ? "▼" : "▲"}
                              {Math.abs(delta).toFixed(1)}
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 text-center text-muted-foreground">
                        {formatTimestamp(record.timestamp)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const defaultForm: FormState = {
  name: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  activityLevel: "",
};

export default function BmiCalculatorPage() {
  const { actor } = useActor();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: records = [] } = useGetAllBMIRecords();
  const addBMIRecord = useAddBMIRecord();

  function setField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const age = Number(form.age);
    const height = Number(form.height);
    const weight = Number(form.weight);

    if (
      !form.name.trim() ||
      !form.gender ||
      !form.activityLevel ||
      age < 1 ||
      age > 120 ||
      height < 50 ||
      height > 300 ||
      weight < 1 ||
      weight > 500
    ) {
      toast.error("Please fill in all fields with valid values.");
      return;
    }

    setIsSubmitting(true);
    try {
      const bmi = calcBMI(weight, height);
      const { min: idealWeightMin, max: idealWeightMax } =
        calcIdealWeight(height);
      const bodyFatPercent = calcBodyFat(bmi, age, form.gender);
      const bodyFatCategory = getBodyFatCategory(bodyFatPercent, form.gender);
      const bmr = calcBMR(weight, height, age, form.gender);
      const multiplier = ACTIVITY_MULTIPLIERS[form.activityLevel] ?? 1.2;
      const tdee = bmr * multiplier;

      // Save to backend
      const timestamp = actor
        ? await actor.getNowTimestamp()
        : BigInt(Date.now() * 1_000_000);

      await addBMIRecord.mutateAsync({
        name: form.name.trim(),
        age: BigInt(age),
        gender: form.gender,
        heightCm: height,
        weightKg: weight,
        bmi,
        timestamp,
      });

      setResult({
        bmi,
        bmiCategory: getBmiCategory(bmi),
        idealWeightMin,
        idealWeightMax,
        bodyFatPercent,
        bodyFatCategory,
        bmr,
        tdee,
        name: form.name.trim(),
        age,
        gender: form.gender,
        height,
        weight,
      });

      toast.success("BMI calculated and saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save record. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5 pb-4">
      <h2 className="font-heading font-bold text-lg">BMI Calculator</h2>

      {/* Input Form Card */}
      <Card className="border border-border">
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Age row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="bmi-name" className="text-xs font-semibold">
                  Full Name
                </Label>
                <Input
                  id="bmi-name"
                  data-ocid="bmi.name.input"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="text-sm h-9"
                  autoComplete="name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bmi-age" className="text-xs font-semibold">
                  Age (years)
                </Label>
                <Input
                  id="bmi-age"
                  data-ocid="bmi.age.input"
                  type="number"
                  min={1}
                  max={120}
                  value={form.age}
                  onChange={(e) => setField("age", e.target.value)}
                  placeholder="e.g. 28"
                  className="text-sm h-9"
                />
              </div>
            </div>

            {/* Gender & Activity row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="bmi-gender" className="text-xs font-semibold">
                  Gender
                </Label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => setField("gender", v)}
                >
                  <SelectTrigger
                    id="bmi-gender"
                    data-ocid="bmi.gender.select"
                    className="text-sm h-9"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bmi-activity" className="text-xs font-semibold">
                  Activity Level
                </Label>
                <Select
                  value={form.activityLevel}
                  onValueChange={(v) => setField("activityLevel", v)}
                >
                  <SelectTrigger
                    id="bmi-activity"
                    data-ocid="bmi.activity.select"
                    className="text-sm h-9"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedentary">Sedentary</SelectItem>
                    <SelectItem value="Light">Light</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Very Active">Very Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Height & Weight row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="bmi-height" className="text-xs font-semibold">
                  Height (cm)
                </Label>
                <Input
                  id="bmi-height"
                  data-ocid="bmi.height.input"
                  type="number"
                  min={50}
                  max={300}
                  value={form.height}
                  onChange={(e) => setField("height", e.target.value)}
                  placeholder="e.g. 165"
                  className="text-sm h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bmi-weight" className="text-xs font-semibold">
                  Weight (kg)
                </Label>
                <Input
                  id="bmi-weight"
                  data-ocid="bmi.weight.input"
                  type="number"
                  min={1}
                  max={500}
                  step="0.1"
                  value={form.weight}
                  onChange={(e) => setField("weight", e.target.value)}
                  placeholder="e.g. 62"
                  className="text-sm h-9"
                />
              </div>
            </div>

            <Button
              type="submit"
              data-ocid="bmi.calculate.submit_button"
              disabled={isSubmitting}
              className="w-full h-10 text-sm font-semibold"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                  Calculating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Calculator size={16} />
                  Calculate BMI & Health Metrics
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results section */}
      {result && (
        <div className="space-y-3 animate-slide-up">
          <h3 className="font-heading font-bold text-sm text-foreground px-0.5">
            Results for {result.name}
          </h3>
          <RiskAlertCard result={result} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <IdealWeightCard result={result} />
            <BodyFatCard result={result} />
          </div>
          <CalorieNeedsCard result={result} />
        </div>
      )}

      {/* Chart & History – always visible */}
      <TrendChartCard records={records} />
      <HistoryLogCard records={records} />
    </div>
  );
}
