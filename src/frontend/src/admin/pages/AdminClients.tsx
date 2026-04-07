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
import type { Principal } from "@icp-sdk/core/principal";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { KYCStatus } from "../../backend.d";
import { KYCStatusBadge } from "../../components/StatusBadge";
import {
  useAllClients,
  useCreateClient,
  useUpdateClient,
} from "../../hooks/useQueries";

export function AdminClients() {
  const { data: clients = [], isLoading } = useAllClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    kycStatus: KYCStatus.pending,
  });

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClient.mutateAsync(form);
      toast.success("Client added!");
      setForm({ name: "", phone: "", email: "", address: "" });
      setOpen(false);
    } catch {
      toast.error("Failed to add client");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id.toString() === editForm.id);
    if (!client) return;
    try {
      await updateClient.mutateAsync({
        id: client.id as Principal,
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        address: editForm.address,
        kycStatus: editForm.kycStatus,
      });
      toast.success("Client updated!");
      setEditOpen(false);
    } catch {
      toast.error("Failed to update client");
    }
  };

  const openEdit = (c: (typeof clients)[0]) => {
    setEditForm({
      id: c.id.toString(),
      name: c.name,
      phone: c.phone,
      email: c.email,
      address: c.address,
      kycStatus: c.kycStatus,
    });
    setEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-foreground">
            👥 Client Database
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {clients.length} registered clients
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-primary-foreground hover:bg-accent text-xs uppercase tracking-wider font-bold"
              data-ocid="clients.open_modal_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent
            className="bg-card border-border"
            data-ocid="clients.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display uppercase">
                Add New Client
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                className="input-detective"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                data-ocid="clients.input"
              />
              <Input
                className="input-detective"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                data-ocid="clients.input"
              />
              <Input
                className="input-detective"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                data-ocid="clients.input"
              />
              <Input
                className="input-detective"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
                data-ocid="clients.input"
              />
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                  data-ocid="clients.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createClient.isPending}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-accent"
                  data-ocid="clients.submit_button"
                >
                  {createClient.isPending ? "Adding..." : "Add Client"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent
          className="bg-card border-border"
          data-ocid="clients.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display uppercase">
              Edit Client
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              className="input-detective"
              placeholder="Name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              required
              data-ocid="clients.input"
            />
            <Input
              className="input-detective"
              placeholder="Phone"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
              required
              data-ocid="clients.input"
            />
            <Input
              className="input-detective"
              type="email"
              placeholder="Email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              required
              data-ocid="clients.input"
            />
            <Input
              className="input-detective"
              placeholder="Address"
              value={editForm.address}
              onChange={(e) =>
                setEditForm({ ...editForm, address: e.target.value })
              }
              required
              data-ocid="clients.input"
            />
            <Select
              value={editForm.kycStatus}
              onValueChange={(v) =>
                setEditForm({ ...editForm, kycStatus: v as KYCStatus })
              }
            >
              <SelectTrigger
                className="input-detective"
                data-ocid="clients.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={KYCStatus.pending}>KYC Pending</SelectItem>
                <SelectItem value={KYCStatus.verified}>KYC Verified</SelectItem>
                <SelectItem value={KYCStatus.rejected}>KYC Rejected</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="flex-1"
                data-ocid="clients.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateClient.isPending}
                className="flex-1 bg-primary text-primary-foreground hover:bg-accent"
                data-ocid="clients.save_button"
              >
                {updateClient.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="input-detective pl-9"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="clients.search_input"
        />
      </div>

      <Card className="detective-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div
              className="py-12 text-center text-muted-foreground"
              data-ocid="clients.loading_state"
            >
              Loading clients...
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="py-12 text-center text-muted-foreground"
              data-ocid="clients.empty_state"
            >
              No clients found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="clients.table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                      Contact
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                      KYC
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr
                      key={c.id.toString()}
                      className="border-b border-border/50 hover:bg-muted/20"
                      data-ocid={`clients.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <p className="text-foreground font-semibold">
                          {c.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {c.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                        {c.phone}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <KYCStatusBadge status={c.kycStatus} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(c)}
                          className="text-primary hover:text-accent text-xs"
                          data-ocid="clients.edit_button"
                        >
                          Edit
                        </Button>
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
