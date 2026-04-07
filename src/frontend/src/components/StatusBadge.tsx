import { CaseStatus, InquiryStatus, KYCStatus, Priority } from "../backend.d";

interface StatusBadgeProps {
  status: CaseStatus;
}

export function CaseStatusBadge({ status }: StatusBadgeProps) {
  if (status === CaseStatus.pending)
    return <span className="status-pending">Pending</span>;
  if (status === CaseStatus.active)
    return <span className="status-active">Active</span>;
  if (status === CaseStatus.closed)
    return <span className="status-closed">Closed</span>;
  return <span className="status-pending">{status}</span>;
}

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  if (priority === Priority.low)
    return <span className="priority-low">Low</span>;
  if (priority === Priority.medium)
    return <span className="priority-medium">Medium</span>;
  if (priority === Priority.high)
    return <span className="priority-high">High</span>;
  if (priority === Priority.urgent)
    return <span className="priority-urgent">⚡ Urgent</span>;
  return <span className="priority-low">{priority}</span>;
}

interface InquiryBadgeProps {
  status: InquiryStatus;
}

export function InquiryStatusBadge({ status }: InquiryBadgeProps) {
  const map: Record<InquiryStatus, string> = {
    [InquiryStatus.pending]: "status-pending",
    [InquiryStatus.approved]: "status-active",
    [InquiryStatus.rejected]: "status-closed",
    [InquiryStatus.contacted]: "priority-medium",
  };
  const labels: Record<InquiryStatus, string> = {
    [InquiryStatus.pending]: "Pending",
    [InquiryStatus.approved]: "Approved",
    [InquiryStatus.rejected]: "Rejected",
    [InquiryStatus.contacted]: "Contacted",
  };
  return (
    <span className={map[status] || "status-pending"}>
      {labels[status] || status}
    </span>
  );
}

interface KYCBadgeProps {
  status: KYCStatus;
}

export function KYCStatusBadge({ status }: KYCBadgeProps) {
  if (status === KYCStatus.verified)
    return <span className="status-active">✓ Verified</span>;
  if (status === KYCStatus.pending)
    return <span className="status-pending">Pending</span>;
  if (status === KYCStatus.rejected)
    return <span className="status-closed">Rejected</span>;
  return <span className="status-pending">{status}</span>;
}
