import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { InquiryStatus } from "../../backend.d";
import { InquiryStatusBadge } from "../../components/StatusBadge";
import {
  useAllInquiries,
  useUpdateInquiryStatus,
} from "../../hooks/useQueries";

export function AdminInquiries() {
  const { data: inquiries = [], isLoading } = useAllInquiries();
  const updateStatus = useUpdateInquiryStatus();
  const [search, setSearch] = useState("");

  const filtered = inquiries.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      i.serviceType.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAction = async (id: string, status: InquiryStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Inquiry marked as ${status}`);
    } catch {
      toast.error("Failed to update inquiry");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase text-foreground">
          💬 Inquiries
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {inquiries.length} total inquiries
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="input-detective pl-9"
          placeholder="Search inquiries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="inquiries.search_input"
        />
      </div>

      <Card className="detective-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div
              className="py-12 text-center text-muted-foreground"
              data-ocid="inquiries.loading_state"
            >
              Loading inquiries...
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="py-12 text-center text-muted-foreground"
              data-ocid="inquiries.empty_state"
            >
              No inquiries found
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((inq, i) => (
                <div
                  key={inq.id}
                  className="p-4 hover:bg-muted/10"
                  data-ocid={`inquiries.item.${i + 1}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-foreground font-semibold">
                          {inq.name}
                        </p>
                        <InquiryStatusBadge status={inq.status} />
                        <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-0.5 rounded uppercase">
                          {inq.serviceType}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {inq.email} &bull; {inq.phone}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {inq.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(
                          Number(inq.timestamp) / 1_000_000,
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAction(inq.id, InquiryStatus.approved)
                        }
                        disabled={inq.status === InquiryStatus.approved}
                        className="bg-green-900/40 text-green-300 hover:bg-green-900/60 text-xs"
                        data-ocid="inquiries.confirm_button"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAction(inq.id, InquiryStatus.contacted)
                        }
                        disabled={inq.status === InquiryStatus.contacted}
                        className="bg-blue-900/40 text-blue-300 hover:bg-blue-900/60 text-xs"
                        data-ocid="inquiries.secondary_button"
                      >
                        Contacted
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleAction(inq.id, InquiryStatus.rejected)
                        }
                        disabled={inq.status === InquiryStatus.rejected}
                        className="bg-red-900/40 text-red-300 hover:bg-red-900/60 text-xs"
                        data-ocid="inquiries.delete_button"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
