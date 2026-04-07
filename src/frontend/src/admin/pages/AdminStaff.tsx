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
import { StaffRole } from "../../backend.d";
import {
  useAllStaff,
  useCreateStaff,
  useUpdateStaff,
} from "../../hooks/useQueries";

export function AdminStaff() {
  const { data: staff = [], isLoading } = useAllStaff();
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: StaffRole.investigator,
  });
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: StaffRole.investigator,
  });

  const filtered = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStaff.mutateAsync(form);
      toast.success("Staff member added!");
      setForm({ name: "", email: "", phone: "", role: StaffRole.investigator });
      setOpen(false);
    } catch {
      toast.error("Failed to add staff");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const member = staff.find((s) => s.id.toString() === editForm.id);
    if (!member) return;
    try {
      await updateStaff.mutateAsync({
        id: member.id as Principal,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        role: editForm.role,
      });
      toast.success("Staff updated!");
      setEditOpen(false);
    } catch {
      toast.error("Failed to update staff");
    }
  };

  const openEdit = (s: (typeof staff)[0]) => {
    setEditForm({
      id: s.id.toString(),
      name: s.name,
      email: s.email,
      phone: s.phone,
      role: s.role,
    });
    setEditOpen(true);
  };

  const roleColors: Record<StaffRole, string> = {
    [StaffRole.admin]: "bg-primary/20 text-primary border-primary/30",
    [StaffRole.investigator]: "bg-blue-900/30 text-blue-400 border-blue-700/30",
    [StaffRole.analyst]:
      "bg-purple-900/30 text-purple-400 border-purple-700/30",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase text-foreground">
            👤 Staff Directory
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {staff.length} team members
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary text-primary-foreground hover:bg-accent text-xs uppercase tracking-wider font-bold"
              data-ocid="staff.open_modal_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent
            className="bg-card border-border"
            data-ocid="staff.dialog"
          >
            <DialogHeader>
              <DialogTitle className="font-display uppercase">
                Add Staff Member
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                className="input-detective"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                data-ocid="staff.input"
              />
              <Input
                className="input-detective"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                data-ocid="staff.input"
              />
              <Input
                className="input-detective"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                data-ocid="staff.input"
              />
              <Select
                value={form.role}
                onValueChange={(v) =>
                  setForm({ ...form, role: v as StaffRole })
                }
              >
                <SelectTrigger
                  className="input-detective"
                  data-ocid="staff.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={StaffRole.investigator}>
                    Investigator
                  </SelectItem>
                  <SelectItem value={StaffRole.analyst}>Analyst</SelectItem>
                  <SelectItem value={StaffRole.admin}>Admin</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                  data-ocid="staff.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createStaff.isPending}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-accent"
                  data-ocid="staff.submit_button"
                >
                  {createStaff.isPending ? "Adding..." : "Add Member"}
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
          data-ocid="staff.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display uppercase">
              Edit Staff Member
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
              data-ocid="staff.input"
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
              data-ocid="staff.input"
            />
            <Input
              className="input-detective"
              placeholder="Phone"
              value={editForm.phone}
              onChange={(e) =>
                setEditForm({ ...editForm, phone: e.target.value })
              }
              required
              data-ocid="staff.input"
            />
            <Select
              value={editForm.role}
              onValueChange={(v) =>
                setEditForm({ ...editForm, role: v as StaffRole })
              }
            >
              <SelectTrigger
                className="input-detective"
                data-ocid="staff.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={StaffRole.investigator}>
                  Investigator
                </SelectItem>
                <SelectItem value={StaffRole.analyst}>Analyst</SelectItem>
                <SelectItem value={StaffRole.admin}>Admin</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="flex-1"
                data-ocid="staff.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateStaff.isPending}
                className="flex-1 bg-primary text-primary-foreground hover:bg-accent"
                data-ocid="staff.save_button"
              >
                {updateStaff.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          className="input-detective pl-9"
          placeholder="Search staff..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-ocid="staff.search_input"
        />
      </div>

      <Card className="detective-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div
              className="py-12 text-center text-muted-foreground"
              data-ocid="staff.loading_state"
            >
              Loading staff...
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="py-12 text-center text-muted-foreground"
              data-ocid="staff.empty_state"
            >
              No staff found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="staff.table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                      Contact
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Role
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                      Last Active
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => (
                    <tr
                      key={s.id.toString()}
                      className="border-b border-border/50 hover:bg-muted/20"
                      data-ocid={`staff.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <p className="text-foreground font-semibold">
                          {s.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {s.email}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">
                        {s.phone}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded border text-xs font-semibold uppercase ${roleColors[s.role]}`}
                        >
                          {s.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                        {new Date(
                          Number(s.lastActive) / 1_000_000,
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(s)}
                          className="text-primary hover:text-accent text-xs"
                          data-ocid="staff.edit_button"
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
