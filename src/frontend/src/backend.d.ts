import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Client {
    id: Principal;
    name: string;
    email: string;
    kycStatus: KYCStatus;
    address: string;
    phone: string;
}
export type Time = bigint;
export interface CaseNote {
    id: bigint;
    content: string;
    authorId: Principal;
    timestamp: Time;
    caseId: bigint;
}
export interface Case {
    id: bigint;
    status: CaseStatus;
    title: string;
    clientId: Principal;
    createdAt: Time;
    description: string;
    updatedAt: Time;
    priority: Priority;
    investigatorId?: Principal;
}
export interface ActivityLog {
    id: bigint;
    action: string;
    userId: Principal;
    role: UserRole;
    timestamp: Time;
    details: string;
}
export interface Staff {
    id: Principal;
    name: string;
    role: StaffRole;
    email: string;
    phone: string;
    lastActive: Time;
}
export interface Message {
    id: bigint;
    content: string;
    role: UserRole;
    timestamp: Time;
    caseId: bigint;
    senderId: Principal;
}
export interface Setting {
    key: string;
    value: string;
}
export interface Inquiry {
    id: string;
    status: InquiryStatus;
    serviceType: string;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
    phone: string;
}
export interface Media {
    id: string;
    blob?: ExternalBlob;
    fileName: string;
    fileType: string;
    category: string;
    caseId?: bigint;
    uploadedAt: Time;
    uploadedBy: Principal;
}
export interface UserProfile {
    name: string;
    role: string;
    email: string;
    phone: string;
}
export enum CaseStatus {
    closed = "closed",
    active = "active",
    pending = "pending"
}
export enum InquiryStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected",
    contacted = "contacted"
}
export enum KYCStatus {
    verified = "verified",
    pending = "pending",
    rejected = "rejected"
}
export enum Priority {
    low = "low",
    high = "high",
    urgent = "urgent",
    medium = "medium"
}
export enum StaffRole {
    admin = "admin",
    investigator = "investigator",
    analyst = "analyst"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCaseNote(caseId: bigint, content: string): Promise<void>;
    addMedia(id: string, fileName: string, fileType: string, category: string, uploadedBy: Principal, caseId: bigint | null, blob: ExternalBlob | null): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignInvestigator(caseId: bigint, investigatorId: Principal): Promise<void>;
    createCase(title: string, description: string, clientId: Principal, priority: Priority): Promise<bigint>;
    createClient(name: string, phone: string, email: string, address: string): Promise<void>;
    createInquiry(name: string, phone: string, email: string, message: string, serviceType: string): Promise<string>;
    createStaff(name: string, email: string, phone: string, role: StaffRole): Promise<void>;
    deleteMedia(id: string): Promise<void>;
    getAllCases(): Promise<Array<Case>>;
    getAllClients(): Promise<Array<Client>>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    getAllMedia(): Promise<Array<Media>>;
    getAllMessagesForCase(caseId: bigint, requesterId: Principal): Promise<Array<Message>>;
    getAllStaff(): Promise<Array<Staff>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCaseById(caseId: bigint): Promise<Case | null>;
    getCaseNotes(caseId: bigint): Promise<Array<CaseNote>>;
    getCasesByClient(clientId: Principal): Promise<Array<Case>>;
    getCasesByInvestigator(investigatorId: Principal): Promise<Array<Case>>;
    getClientById(clientId: Principal): Promise<Client | null>;
    getClientCases(clientId: Principal): Promise<Array<Case>>;
    getLogsByUser(userId: Principal): Promise<Array<ActivityLog>>;
    getMediaByCase(caseId: bigint): Promise<Array<Media>>;
    getMessagesForCase(caseId: bigint): Promise<Array<Message>>;
    getRecentLogs(limit: bigint): Promise<Array<ActivityLog>>;
    getSettingByKey(key: string): Promise<Setting | null>;
    getStaffById(staffId: Principal): Promise<Staff | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(senderId: Principal, role: UserRole, content: string, caseId: bigint): Promise<void>;
    updateCaseStatus(caseId: bigint, status: CaseStatus): Promise<void>;
    updateClient(id: Principal, name: string, phone: string, email: string, address: string, kycStatus: KYCStatus): Promise<void>;
    updateInquiryStatus(id: string, status: InquiryStatus): Promise<void>;
    updateSetting(key: string, value: string): Promise<void>;
    updateStaff(id: Principal, name: string, email: string, phone: string, role: StaffRole): Promise<void>;
}
