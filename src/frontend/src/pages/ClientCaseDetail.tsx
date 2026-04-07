import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import { useParams } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend.d";
import { CaseStatusBadge, PriorityBadge } from "../components/StatusBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCaseById,
  useCaseMessages,
  useCaseNotes,
  useSendMessage,
} from "../hooks/useQueries";

export function ClientCaseDetail() {
  const { id } = useParams({ from: "/clientPortal/case/$id" });
  const caseId = BigInt(id);
  const { data: caseData } = useCaseById(caseId);
  const { data: notes = [] } = useCaseNotes(caseId);
  const { data: messages = [] } = useCaseMessages(caseId);
  const sendMessage = useSendMessage();
  const { identity } = useInternetIdentity();
  const [chatMsg, setChatMsg] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim() || !identity) return;
    try {
      await sendMessage.mutateAsync({
        senderId: identity.getPrincipal() as unknown as Principal,
        role: UserRole.user,
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
    <div className="space-y-6 max-w-3xl">
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

      <Card className="detective-card">
        <CardContent className="pt-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Case Details
          </h3>
          <p className="text-sm text-foreground">{caseData.description}</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-muted/20 rounded p-2">
              <p className="text-muted-foreground">Opened</p>
              <p className="text-foreground font-semibold">
                {new Date(
                  Number(caseData.createdAt) / 1_000_000,
                ).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-muted/20 rounded p-2">
              <p className="text-muted-foreground">Last Updated</p>
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
      {notes.length > 0 && (
        <Card className="detective-card">
          <CardContent className="pt-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Investigator Notes
            </h3>
            <div className="space-y-3">
              {notes.map((note, i) => (
                <div
                  key={note.id.toString()}
                  className="bg-muted/20 rounded p-3 border-l-2 border-primary"
                  data-ocid={`portal_case.item.${i + 1}`}
                >
                  <p className="text-xs text-muted-foreground mb-1">
                    {new Date(
                      Number(note.timestamp) / 1_000_000,
                    ).toLocaleString()}
                  </p>
                  <p className="text-sm text-foreground">{note.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat */}
      <Card className="detective-card">
        <CardContent className="pt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Chat with Investigator
          </h3>
          <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
            {messages.length === 0 ? (
              <p
                className="text-sm text-muted-foreground"
                data-ocid="portal_case.empty_state"
              >
                No messages yet. Send a message to your investigator.
              </p>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={msg.id.toString()}
                  className={`rounded p-3 text-sm ${msg.role === UserRole.user ? "bg-primary/10 border border-primary/20 ml-8" : "bg-muted/20 mr-8"}`}
                  data-ocid={`portal_case.item.${i + 1}`}
                >
                  <p className="text-[10px] text-muted-foreground mb-1 uppercase font-semibold">
                    {msg.role === UserRole.user ? "You" : "Investigator"}
                  </p>
                  <p className="text-foreground">{msg.content}</p>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSend} className="flex gap-2">
            <Textarea
              className="input-detective resize-none text-sm flex-1"
              rows={2}
              placeholder="Message your investigator..."
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              data-ocid="portal_case.textarea"
            />
            <Button
              type="submit"
              disabled={sendMessage.isPending}
              className="bg-primary text-primary-foreground hover:bg-accent self-end"
              data-ocid="portal_case.submit_button"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
