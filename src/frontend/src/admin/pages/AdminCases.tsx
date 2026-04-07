import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import { Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CaseStatus, Priority } from "../../backend.d";
import { CaseStatusBadge, PriorityBadge } from "../../components/StatusBadge";
import {
  useAllCases,
  useAllClients,
  useCreateCase,
} from "../../hooks/useQueries";

export function AdminCases() {
  const { data: cases = [], isLoading } = useAllCases();
  const { data: clients = [] } = useAllClients();
  const createCase = useCreateCase();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    clientId: "",
    priority: Priority.medium,
  });

  const filtered = cases.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId) return toast.error("Please select a client");
    try {
      const client = clients.find((c) => c.id.toString() === form.clientId);
      if (!client) return toast.error("Client not found");
      await createCase.mutateAsync({
        title: form.title,
        description: form.description,
        clientId: client.id as Principal,
        priority: form.priority,
      });
      toast.success("Case created successfully!");
      setForm({
        title: "",
        description: "",
        clientId: "",
        priority: Priority.medium,
      });
      setOpen(false);
    } catch {
      toast.error("Failed to create case");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-foreground">
            📁 Case Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {cases.length} total cases
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-primary-foreground hover:bg-accent text-xs uppercase tracking-wider font-bold"
              data-ocid="cases.open_modal_button"
            >
              <Plus className="w-4 h-4 mr-1" /> New Case
            </Button>
          </DialogTrigger>
          <DialogContent
            className="bg-card border-border"
            data-ocid="cases.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display uppercase">
                Create New Case
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Case Title
                </p>
                <Input
                  className="input-detective"
                  placeholder="Case title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  data-ocid="cases.input"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Description
                </p>
                <Textarea
                  className="input-detective resize-none"
                  rows={3}
                  placeholder="Case description..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  data-ocid="cases.textarea"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Client
                </p>
                <Select
                  value={form.clientId}
                  onValueChange={(v) => setForm({ ...form, clientId: v })}
                >
                  <SelectTrigger
                    className="input-detective"
                    data-ocid="cases.select"
                  >
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id.toString()} value={c.id.toString()}>
                        {c.name} — {c.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Priority
                </p>
                <Select
                  value={form.priority}
                  onValueChange={(v) =>
                    setForm({ ...form, priority: v as Priority })
                  }
                >
                  <SelectTrigger
                    className="input-detective"
                    data-ocid="cases.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Priority.low}>Low</SelectItem>
                    <SelectItem value={Priority.medium}>Medium</SelectItem>
                    <SelectItem value={Priority.high}>High</SelectItem>
                    <SelectItem value={Priority.urgent}>Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                  data-ocid="cases.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createCase.isPending}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-accent"
                  data-ocid="cases.submit_button"
                >
                  {createCase.isPending ? "Creating..." : "Create Case"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="input-detective pl-9"
            placeholder="Search cases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="cases.search_input"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className="input-detective w-full sm:w-40"
            data-ocid="cases.select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={CaseStatus.pending}>Pending</SelectItem>
            <SelectItem value={CaseStatus.active}>Active</SelectItem>
            <SelectItem value={CaseStatus.closed}>Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="detective-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div
              className="py-12 text-center text-muted-foreground"
              data-ocid="cases.loading_state"
            >
              Loading cases...
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="py-12 text-center text-muted-foreground"
              data-ocid="cases.empty_state"
            >
              No cases found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="cases.table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      ID
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Title
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                      Priority
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                      Created
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr
                      key={c.id.toString()}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      data-ocid={`cases.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 text-primary font-mono text-xs">
                        #{c.id.toString()}
                      </td>
                      <td className="px-4 py-3 text-foreground font-semibold">
                        {c.title}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <CaseStatusBadge status={c.status} />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                        {new Date(
                          Number(c.createdAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to="/admin/cases/$id"
                          params={{ id: c.id.toString() }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-accent text-xs"
                          >
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
