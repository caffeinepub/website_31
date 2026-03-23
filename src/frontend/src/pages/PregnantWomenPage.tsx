import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  Filter,
  Heart,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import PregnantWomanCard, {
  toCardData,
  localToCardData,
} from "../components/PregnantWomanCard";
import PregnantWomanRegistrationForm from "../components/PregnantWomanRegistrationForm";
import { useGetAllPregnancyRecords } from "../hooks/useQueries";
import { dummyPregnantWomen } from "../utils/pregnantWomenData";
import type {
  RiskLevelLocal,
  TrimesterLocal,
} from "../utils/pregnantWomenData";

type TrimesterFilter = "all" | "1" | "2" | "3";
type RiskFilter = "all" | RiskLevelLocal;

export default function PregnantWomenPage() {
  const [registerOpen, setRegisterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [trimesterFilter, setTrimesterFilter] =
    useState<TrimesterFilter>("all");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");

  const {
    data: backendRecords,
    isLoading,
    refetch,
  } = useGetAllPregnancyRecords();

  // Use backend data if available, otherwise fall back to dummy data
  const allCards = useMemo(() => {
    if (backendRecords && backendRecords.length > 0) {
      return backendRecords.map(toCardData);
    }
    return dummyPregnantWomen.map(localToCardData);
  }, [backendRecords]);

  // Summary stats
  const stats = useMemo(() => {
    const total = allCards.length;
    const byTrimester = { 1: 0, 2: 0, 3: 0 };
    const byRisk = { normal: 0, moderate: 0, high: 0 };
    for (const c of allCards) {
      byTrimester[c.trimester] = (byTrimester[c.trimester] || 0) + 1;
      byRisk[c.riskLevel] = (byRisk[c.riskLevel] || 0) + 1;
    }
    return { total, byTrimester, byRisk };
  }, [allCards]);

  // Filtered list
  const filtered = useMemo(() => {
    return allCards.filter((c) => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phoneNumber.includes(search);
      const matchTrimester =
        trimesterFilter === "all" ||
        c.trimester === Number.parseInt(trimesterFilter, 10);
      const matchRisk = riskFilter === "all" || c.riskLevel === riskFilter;
      return matchSearch && matchTrimester && matchRisk;
    });
  }, [allCards, search, trimesterFilter, riskFilter]);

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg">Pregnant Women</h2>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => setRegisterOpen(true)}
        >
          <PlusCircle size={14} />
          Register
        </Button>
      </div>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {["s1", "s2", "s3", "s4"].map((k) => (
            <Skeleton key={k} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {/* Total */}
          <div className="bg-card border border-border rounded-xl p-3 shadow-card col-span-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center shrink-0">
              <Users size={18} className="text-pink-500" />
            </div>
            <div>
              <p className="text-2xl font-bold font-heading">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Registered</p>
            </div>
            <div className="ml-auto flex gap-3 text-center">
              <div>
                <p className="text-sm font-bold text-blue-600">
                  {stats.byTrimester[1]}
                </p>
                <p className="text-xs text-muted-foreground">1st Tri</p>
              </div>
              <div>
                <p className="text-sm font-bold text-purple-600">
                  {stats.byTrimester[2]}
                </p>
                <p className="text-xs text-muted-foreground">2nd Tri</p>
              </div>
              <div>
                <p className="text-sm font-bold text-orange-600">
                  {stats.byTrimester[3]}
                </p>
                <p className="text-xs text-muted-foreground">3rd Tri</p>
              </div>
            </div>
          </div>

          {/* Normal */}
          <div className="bg-status-green-bg border border-status-green/20 rounded-xl p-3 shadow-card flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-status-green/10 flex items-center justify-center shrink-0">
              <ShieldCheck size={16} className="text-status-green" />
            </div>
            <div>
              <p className="text-xl font-bold font-heading text-status-green">
                {stats.byRisk.normal}
              </p>
              <p className="text-xs text-status-green/80">Normal</p>
            </div>
          </div>

          {/* Moderate */}
          <div className="bg-status-yellow-bg border border-status-yellow/20 rounded-xl p-3 shadow-card flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-status-yellow/10 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-status-yellow" />
            </div>
            <div>
              <p className="text-xl font-bold font-heading text-status-yellow">
                {stats.byRisk.moderate}
              </p>
              <p className="text-xs text-status-yellow/80">Moderate Risk</p>
            </div>
          </div>

          {/* High Risk */}
          <div className="bg-status-red-bg border border-status-red/20 rounded-xl p-3 shadow-card col-span-2 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-status-red/10 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} className="text-status-red" />
            </div>
            <div>
              <p className="text-xl font-bold font-heading text-status-red">
                {stats.byRisk.high}
              </p>
              <p className="text-xs text-status-red/80">
                High Risk — Immediate Attention
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="space-y-2">
        <Input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm"
        />
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            <Filter size={12} />
            Filter:
          </div>
          <Select
            value={trimesterFilter}
            onValueChange={(v) => setTrimesterFilter(v as TrimesterFilter)}
          >
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue placeholder="Trimester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trimesters</SelectItem>
              <SelectItem value="1">1st Trimester</SelectItem>
              <SelectItem value="2">2nd Trimester</SelectItem>
              <SelectItem value="3">3rd Trimester</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={riskFilter}
            onValueChange={(v) => setRiskFilter(v as RiskFilter)}
          >
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="moderate">Moderate Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Records List */}
      <div>
        <h3 className="font-heading font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wide">
          Registered Women ({filtered.length})
        </h3>
        {isLoading ? (
          <div className="space-y-2">
            {["r1", "r2", "r3"].map((k) => (
              <Skeleton key={k} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Heart size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No records found</p>
            {(search || trimesterFilter !== "all" || riskFilter !== "all") && (
              <p className="text-xs mt-1">Try adjusting your filters</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((card) => (
              <PregnantWomanCard
                key={card.phoneNumber}
                data={card}
                onVisitAdded={() => refetch()}
              />
            ))}
          </div>
        )}
      </div>

      {/* Registration Dialog */}
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register Pregnant Woman</DialogTitle>
          </DialogHeader>
          <PregnantWomanRegistrationForm
            onSuccess={() => {
              setRegisterOpen(false);
              refetch();
            }}
            onCancel={() => setRegisterOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
