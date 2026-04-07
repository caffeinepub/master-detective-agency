import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ExternalBlob } from "../backend";
import type {
  ActivityLog,
  Case,
  CaseNote,
  CaseStatus,
  Client,
  Inquiry,
  InquiryStatus,
  KYCStatus,
  Media,
  Message,
  Priority,
  Setting,
  Staff,
  StaffRole,
  UserProfile,
  UserRole,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── Auth ───────────────────────────────────────────────────────────────
export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useCallerRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return "guest" as UserRole;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["userProfile"] }),
  });
}

// ─── Cases ──────────────────────────────────────────────────────────────
export function useAllCases() {
  const { actor, isFetching } = useActor();
  return useQuery<Case[]>({
    queryKey: ["cases"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCases();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCaseById(caseId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Case | null>({
    queryKey: ["case", caseId?.toString()],
    queryFn: async () => {
      if (!actor || caseId === null) return null;
      return actor.getCaseById(caseId);
    },
    enabled: !!actor && !isFetching && caseId !== null,
  });
}

export function useCasesByClient(clientId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Case[]>({
    queryKey: ["clientCases", clientId?.toString()],
    queryFn: async () => {
      if (!actor || !clientId) return [];
      return actor.getCasesByClient(clientId);
    },
    enabled: !!actor && !isFetching && !!clientId,
  });
}

export function useCreateCase() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      clientId: Principal;
      priority: Priority;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCase(
        data.title,
        data.description,
        data.clientId,
        data.priority,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cases"] }),
  });
}

export function useUpdateCaseStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { caseId: bigint; status: CaseStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCaseStatus(data.caseId, data.status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cases"] });
      qc.invalidateQueries({ queryKey: ["case"] });
    },
  });
}

export function useAssignInvestigator() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { caseId: bigint; investigatorId: Principal }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignInvestigator(data.caseId, data.investigatorId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cases"] }),
  });
}

export function useCaseNotes(caseId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<CaseNote[]>({
    queryKey: ["caseNotes", caseId?.toString()],
    queryFn: async () => {
      if (!actor || caseId === null) return [];
      return actor.getCaseNotes(caseId);
    },
    enabled: !!actor && !isFetching && caseId !== null,
  });
}

export function useAddCaseNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { caseId: bigint; content: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addCaseNote(data.caseId, data.content);
    },
    onSuccess: (_, variables) =>
      qc.invalidateQueries({
        queryKey: ["caseNotes", variables.caseId.toString()],
      }),
  });
}

// ─── Clients ────────────────────────────────────────────────────────────
export function useAllClients() {
  const { actor, isFetching } = useActor();
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateClient() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      email: string;
      address: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createClient(
        data.name,
        data.phone,
        data.email,
        data.address,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useUpdateClient() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: Principal;
      name: string;
      phone: string;
      email: string;
      address: string;
      kycStatus: KYCStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateClient(
        data.id,
        data.name,
        data.phone,
        data.email,
        data.address,
        data.kycStatus,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

// ─── Staff ──────────────────────────────────────────────────────────────
export function useAllStaff() {
  const { actor, isFetching } = useActor();
  return useQuery<Staff[]>({
    queryKey: ["staff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStaff();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateStaff() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone: string;
      role: StaffRole;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createStaff(data.name, data.email, data.phone, data.role);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useUpdateStaff() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: Principal;
      name: string;
      email: string;
      phone: string;
      role: StaffRole;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateStaff(
        data.id,
        data.name,
        data.email,
        data.phone,
        data.role,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

// ─── Inquiries ──────────────────────────────────────────────────────────
export function useAllInquiries() {
  const { actor, isFetching } = useActor();
  return useQuery<Inquiry[]>({
    queryKey: ["inquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateInquiry() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      phone: string;
      email: string;
      message: string;
      serviceType: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createInquiry(
        data.name,
        data.phone,
        data.email,
        data.message,
        data.serviceType,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inquiries"] }),
  });
}

export function useUpdateInquiryStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string; status: InquiryStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateInquiryStatus(data.id, data.status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inquiries"] }),
  });
}

// ─── Media ──────────────────────────────────────────────────────────────
export function useAllMedia() {
  const { actor, isFetching } = useActor();
  return useQuery<Media[]>({
    queryKey: ["media"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMedia();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMedia() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: string;
      fileName: string;
      fileType: string;
      category: string;
      uploadedBy: Principal;
      caseId: bigint | null;
      blob: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addMedia(
        data.id,
        data.fileName,
        data.fileType,
        data.category,
        data.uploadedBy,
        data.caseId,
        data.blob,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}

export function useDeleteMedia() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteMedia(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}

// ─── Settings ───────────────────────────────────────────────────────────
export function useSettingByKey(key: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Setting | null>({
    queryKey: ["setting", key],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSettingByKey(key);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateSetting() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { key: string; value: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSetting(data.key, data.value);
    },
    onSuccess: (_, variables) =>
      qc.invalidateQueries({ queryKey: ["setting", variables.key] }),
  });
}

// ─── Logs ───────────────────────────────────────────────────────────────
export function useRecentLogs(limit = 50n) {
  const { actor, isFetching } = useActor();
  return useQuery<ActivityLog[]>({
    queryKey: ["logs", limit.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRecentLogs(limit);
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Messages ───────────────────────────────────────────────────────────
export function useCaseMessages(caseId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ["messages", caseId?.toString()],
    queryFn: async () => {
      if (!actor || caseId === null) return [];
      return actor.getMessagesForCase(caseId);
    },
    enabled: !!actor && !isFetching && caseId !== null,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      senderId: Principal;
      role: UserRole;
      content: string;
      caseId: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendMessage(
        data.senderId,
        data.role,
        data.content,
        data.caseId,
      );
    },
    onSuccess: (_, variables) =>
      qc.invalidateQueries({
        queryKey: ["messages", variables.caseId.toString()],
      }),
  });
}
