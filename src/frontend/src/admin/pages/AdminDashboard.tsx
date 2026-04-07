import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle,
  Clock,
  FolderOpen,
  MessageSquare,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { CaseStatus, InquiryStatus } from "../../backend.d";
import {
  useAllCases,
  useAllClients,
  useAllInquiries,
  useAllStaff,
} from "../../hooks/useQueries";

export function AdminDashboard() {
  const { data: cases = [] } = useAllCases();
  const { data: clients = [] } = useAllClients();
  const { data: staff = [] } = useAllStaff();
  const { data: inquiries = [] } = useAllInquiries();

  const activeCases = cases.filter(
    (c) => c.status === CaseStatus.active,
  ).length;
  const pendingCases = cases.filter(
    (c) => c.status === CaseStatus.pending,
  ).length;
  const openInquiries = inquiries.filter(
    (i) => i.status === InquiryStatus.pending,
  ).length;

  const stats = [
    {
      label: "Total Cases",
      value: cases.length,
      icon: FolderOpen,
      color: "text-primary",
      link: "/admin/cases",
    },
    {
      label: "Active Cases",
      value: activeCases,
      icon: TrendingUp,
      color: "text-green-400",
      link: "/admin/cases",
    },
    {
      label: "Pending Cases",
      value: pendingCases,
      icon: Clock,
      color: "text-yellow-400",
      link: "/admin/cases",
    },
    {
      label: "Total Clients",
      value: clients.length,
      icon: Users,
      color: "text-blue-400",
      link: "/admin/clients",
    },
    {
      label: "Staff Members",
      value: staff.length,
      icon: UserCog,
      color: "text-purple-400",
      link: "/admin/staff",
    },
    {
      label: "Open Inquiries",
      value: openInquiries,
      icon: MessageSquare,
      color: "text-orange-400",
      link: "/admin/inquiries",
    },
    {
      label: "Closed Cases",
      value: cases.filter((c) => c.status === CaseStatus.closed).length,
      icon: CheckCircle,
      color: "text-gray-400",
      link: "/admin/cases",
    },
    {
      label: "Total Inquiries",
      value: inquiries.length,
      icon: MessageSquare,
      color: "text-primary",
      link: "/admin/inquiries",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase text-foreground">
          🕵️ Agency Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time overview of all operations
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Link to={stat.link}>
              <Card
                className="detective-card hover:border-primary/40 hover:shadow-glow-sm transition-all duration-200 cursor-pointer"
                data-ocid="admin.card"
              >
                <CardContent className="pt-5 pb-4 px-5">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span
                      className={`text-2xl font-bold font-display ${stat.color}`}
                    >
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Cases */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Recent Cases
          </h2>
          <Link
            to="/admin/cases"
            className="text-primary text-xs font-semibold hover:underline"
          >
            View All
          </Link>
        </div>
        <Card className="detective-card">
          <CardContent className="p-0">
            {cases.slice(0, 5).length === 0 ? (
              <div
                className="py-8 text-center text-muted-foreground text-sm"
                data-ocid="admin.empty_state"
              >
                No cases found
              </div>
            ) : (
              <table className="w-full text-sm">
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
                  </tr>
                </thead>
                <tbody>
                  {cases.slice(0, 5).map((c, i) => (
                    <tr
                      key={c.id.toString()}
                      className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                      data-ocid={`admin.cases.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 text-primary font-mono text-xs">
                        #{c.id.toString()}
                      </td>
                      <td className="px-4 py-3 text-foreground font-semibold">
                        <Link
                          to="/admin/cases/$id"
                          params={{ id: c.id.toString() }}
                          className="hover:text-primary transition-colors"
                        >
                          {c.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                            c.status === CaseStatus.active
                              ? "bg-green-900/30 text-green-400"
                              : c.status === CaseStatus.pending
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-gray-700/30 text-gray-400"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground uppercase">
                          {c.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Recent Inquiries
          </h2>
          <Link
            to="/admin/inquiries"
            className="text-primary text-xs font-semibold hover:underline"
          >
            View All
          </Link>
        </div>
        <Card className="detective-card">
          <CardContent className="p-0">
            {inquiries.slice(0, 4).length === 0 ? (
              <div
                className="py-8 text-center text-muted-foreground text-sm"
                data-ocid="admin.empty_state"
              >
                No inquiries yet
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                      Service
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.slice(0, 4).map((inq, i) => (
                    <tr
                      key={inq.id}
                      className="border-b border-border/50 hover:bg-muted/20"
                      data-ocid={`admin.inquiries.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 text-foreground font-semibold">
                        {inq.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                        {inq.serviceType}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                            inq.status === InquiryStatus.pending
                              ? "bg-yellow-900/30 text-yellow-400"
                              : inq.status === InquiryStatus.approved
                                ? "bg-green-900/30 text-green-400"
                                : "bg-gray-700/30 text-gray-400"
                          }`}
                        >
                          {inq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
