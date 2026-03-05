import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface VisitHistoryRecordView {
    weight: number;
    visitDate: bigint;
    bloodPressure: bigint;
    hemoglobin: number;
    notes: string;
}
export interface PregnancyRecordView {
    age: bigint;
    weight: number;
    trimester: bigint;
    eddDate: bigint;
    visitHistory: Array<VisitHistoryRecordView>;
    name: string;
    bloodPressure: bigint;
    husbandName: string;
    address: string;
    phoneNumber: string;
    lmpDate: bigint;
    gestationalAge: bigint;
    riskLevel: RiskLevel;
    hemoglobinLevel: number;
}
export interface VisitHistoryRecord {
    weight: number;
    visitDate: bigint;
    bloodPressure: bigint;
    hemoglobin: number;
    notes: string;
}
export interface BMIRecord {
    age: bigint;
    bmi: number;
    heightCm: number;
    name: string;
    weightKg: number;
    gender: string;
    timestamp: bigint;
}
export interface UserProfile {
    name: string;
}
export enum RiskLevel {
    normal = "normal",
    high = "high",
    moderate = "moderate"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBMIRecord(name: string, age: bigint, gender: string, heightCm: number, weightKg: number, bmi: number, timestamp: bigint): Promise<void>;
    addPregnancyRecord(name: string, age: bigint, husbandName: string, address: string, phoneNumber: string, lmpDate: bigint, eddDate: bigint, gestationalAge: bigint, weight: number, hemoglobinLevel: number, bloodPressure: bigint, trimester: bigint, riskLevel: RiskLevel, initialVisit: VisitHistoryRecord): Promise<void>;
    addVisit(phoneNumber: string, newVisit: VisitHistoryRecord): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllBMIRecords(): Promise<Array<BMIRecord>>;
    getAllPregnancyRecords(): Promise<Array<PregnancyRecordView>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getIndex(numberOfEntries: bigint): Promise<bigint>;
    getLatestBMIRecords(count: bigint): Promise<Array<BMIRecord>>;
    getNowTimestamp(): Promise<bigint>;
    getPregnanciesByRiskLevel(riskLevel: RiskLevel): Promise<Array<PregnancyRecordView>>;
    getPregnancyByPhoneNumber(phoneNumber: string): Promise<PregnancyRecordView | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
