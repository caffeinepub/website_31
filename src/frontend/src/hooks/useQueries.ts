import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  PregnancyRecordView,
  RiskLevel,
  VisitHistoryRecord,
} from "../backend";
import { useActor } from "./useActor";

// ─── Pregnancy Records ────────────────────────────────────────────────────────

export function useGetAllPregnancyRecords() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PregnancyRecordView[]>({
    queryKey: ["pregnancyRecords"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPregnancyRecords();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddPregnancyRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      name: string;
      age: bigint;
      husbandName: string;
      address: string;
      phoneNumber: string;
      lmpDate: bigint;
      eddDate: bigint;
      gestationalAge: bigint;
      weight: number;
      hemoglobinLevel: number;
      bloodPressure: bigint;
      trimester: bigint;
      riskLevel: RiskLevel;
      initialVisit: VisitHistoryRecord;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addPregnancyRecord(
        params.name,
        params.age,
        params.husbandName,
        params.address,
        params.phoneNumber,
        params.lmpDate,
        params.eddDate,
        params.gestationalAge,
        params.weight,
        params.hemoglobinLevel,
        params.bloodPressure,
        params.trimester,
        params.riskLevel,
        params.initialVisit,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pregnancyRecords"] });
    },
  });
}

export function useAddVisit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      phoneNumber: string;
      newVisit: VisitHistoryRecord;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addVisit(params.phoneNumber, params.newVisit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pregnancyRecords"] });
    },
  });
}
