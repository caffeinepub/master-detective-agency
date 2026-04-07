import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import { useParams } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CaseStatus } from "../../backend.d";
import { UserRole } from "../../backend.d";
import { CaseStatusBadge, PriorityBadge } from "../../components/StatusBadge";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useAddCaseNote,
  useAllStaff,
  useAssignInvestigator,
  useCaseById,
  useCaseMessages,
  useCaseNotes,
  useSendMessage,
  useUpdateCaseStatus,
} from "../../hooks/useQueries";

export function AdminCaseDetail() {
  const { id } = useParams({ from: "/admin/cases/$id" });
  const caseId = BigInt(id);
  const { data: caseData } = useCaseById(caseId);
  const { data: notes = [] } = useCaseNotes(caseId);
  const { data: messages = [] } = useCaseMessages(caseId);
  const { data: staff = [] } = useAllStaff();
  const addNote = useAddCaseNote();
  const updateStatus = useUpdateCaseStatus();
  const assignInvestigator = useAssignInvestigator();
  const sendMessage = useSendMessage();
  const { identity } = useInternetIdentity();

  const [noteContent, setNoteContent] = useState("");
  const [chatMsg, setChatMsg] = useState("");
  const [newStatus, setNewStatus] = useState<CaseStatus | "">("");
  const [selectedInvestigator, setSelectedInvestigator] = useState("");

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    try {
      await addNote.mutateAsync({ caseId, content: noteContent });
      setNoteContent("");
      toast.success("Note added");
    } catch {
      toast.error("Failed to add note");
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    try {
      await updateStatus.mutateAsync({ caseId, status: newStatus });
      toast.success("Status updated");
      setNewStatus("");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleAssign = async () => {
    if (!selectedInvestigator) return;
    const inv = staff.find((s) => s.id.toString() === selectedInvestigator);
    if (!inv) return;
    try {
      await assignInvestigator.mutateAsync({
        caseId,
        investigatorId: inv.id as Principal,
      });
      toast.success("Investigator assigned");
      setSelectedInvestigator("");
    } catch {
      toast.error("Failed to assign investigator");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim() || !identity) return;
    try {
      await sendMessage.mutateAsync({
        senderId: identity.getPrincipal() as unknown as Principal,
        role: UserRole.admin,
        content: chatMsg,
        caseId,
      });
      setChatMsg("");
    } catch {
      toast.error("Failed to send message");
    }
  };

  if (!caseData) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading case...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-primary text-xs font-bold uppercase tracking-wider">
            Case #{caseData.id.toString()}
          </p>
          <h1 className="font-display text-2xl font-bold uppercase text-foreground mt-1">
            {caseData.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <CaseStatusBadge status={caseData.status} />
          <PriorityBadge priority={caseData.priority} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="detective-card">
            <CardContent className="pt-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Description
              </h3>
              <p className="text-sm text-foreground">{caseData.description}</p>
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="bg-muted/20 rounded p-2">
                  <p className="text-muted-foreground">Created</p>
                  <p className="text-foreground font-semibold">
                    {new Date(
                      Number(caseData.createdAt) / 1_000_000,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-muted/20 rounded p-2">
                  <p className="text-muted-foreground">Updated</p>
                  <p className="text-foreground font-semibold">
                    {new Date(
                      Number(caseData.updatedAt) / 1_000_000,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="detective-card">
            <CardContent className="pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Case Notes
              </h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {notes.length === 0 ? (
                  <p
                    className="text-sm text-muted-foreground"
                    data-ocid="case_detail.empty_state"
                  >
                    No notes yet
                  </p>
                ) : (
                  notes.map((note, i) => (
                    <div
                      key={note.id.toString()}
                      className="bg-muted/20 rounded p-3 border-l-2 border-primary"
                      data-ocid={`case_detail.item.${i + 1}`}
                    >
                      <p className="text-xs text-muted-foreground mb-1">
                        {new Date(
                          Number(note.timestamp) / 1_000_000,
                        ).toLocaleString()}
                      </p>
                      <p className="text-sm text-foreground">{note.content}</p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleAddNote} className="flex gap-2">
                <Textarea
                  className="input-detective resize-none text-sm flex-1"
                  rows={2}
                  placeholder="Add a note..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  data-ocid="case_detail.textarea"
                />
                <Button
                  type="submit"
                  disabled={addNote.isPending}
                  className="bg-primary text-primary-foreground hover:bg-accent self-end"
                  data-ocid="case_detail.submit_button"
                >
                  Add
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Chat */}
          <Card className="detective-card">
            <CardContent className="pt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Case Chat
              </h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No messages yet
                  </p>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={msg.id.toString()}
                      className={`rounded p-3 text-sm ${msg.role === UserRole.admin ? "bg-primary/10 border border-primary/20 ml-8" : "bg-muted/20 mr-8"}`}
                      data-ocid={`case_detail.item.${i + 1}`}
                    >
                      <p className="text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                        {msg.role}
                      </p>
                      <p className="text-foreground">{msg.content}</p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Textarea
                  className="input-detective resize-none text-sm flex-1"
                  rows={2}
                  placeholder="Type message..."
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  data-ocid="case_detail.textarea"
                />
                <Button
                  type="submit"
                  disabled={sendMessage.isPending}
                  className="bg-primary text-primary-foreground hover:bg-accent self-end"
                  data-ocid="case_detail.submit_button"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Update Status */}
          <Card className="detective-card">
            <CardContent className="pt-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Update Status
              </h3>
              <Select
                value={newStatus}
                onValueChange={(v) => setNewStatus(v as CaseStatus)}
              >
                <SelectTrigger
                  className="input-detective"
                  data-ocid="case_detail.select"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CaseStatus.pending}>Pending</SelectItem>
                  <SelectItem value={CaseStatus.active}>Active</SelectItem>
                  <SelectItem value={CaseStatus.closed}>Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleStatusUpdate}
                disabled={!newStatus || updateStatus.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-accent text-xs"
                data-ocid="case_detail.save_button"
              >
                Update Status
              </Button>
            </CardContent>
          </Card>

          {/* Assign Investigator */}
          <Card className="detective-card">
            <CardContent className="pt-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Assign Investigator
              </h3>
              <Select
                value={selectedInvestigator}
                onValueChange={setSelectedInvestigator}
              >
                <SelectTrigger
                  className="input-detective"
                  data-ocid="case_detail.select"
                >
                  <SelectValue placeholder="Select investigator" />
                </SelectTrigger>
                <SelectContent>
                  {staff.map((s) => (
                    <SelectItem key={s.id.toString()} value={s.id.toString()}>
                      {s.name} — {s.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAssign}
                disabled={!selectedInvestigator || assignInvestigator.isPending}
                className="w-full bg-primary text-primary-foreground hover:bg-accent text-xs"
                data-ocid="case_detail.save_button"
              >
                Assign
              </Button>
              {caseData.investigatorId && (
                <p className="text-xs text-muted-foreground">
                  Current: {caseData.investigatorId.toString().slice(0, 15)}...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
