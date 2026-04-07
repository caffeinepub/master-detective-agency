import { Card, CardContent } from "@/components/ui/card";
import { UserRole } from "../../backend.d";
import { useRecentLogs } from "../../hooks/useQueries";

export function AdminLogs() {
  const { data: logs = [], isLoading } = useRecentLogs(50n);

  const roleColors: Record<string, string> = {
    [UserRole.admin]: "text-primary",
    [UserRole.user]: "text-blue-400",
    [UserRole.guest]: "text-muted-foreground",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase text-foreground">
          📄 Activity Logs
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Last {logs.length} activities
        </p>
      </div>

      <Card className="detective-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div
              className="py-12 text-center text-muted-foreground"
              data-ocid="logs.loading_state"
            >
              Loading logs...
            </div>
          ) : logs.length === 0 ? (
            <div
              className="py-12 text-center text-muted-foreground"
              data-ocid="logs.empty_state"
            >
              No activity logs yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-ocid="logs.table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Timestamp
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Action
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                      Role
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                      User
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr
                      key={log.id.toString()}
                      className="border-b border-border/50 hover:bg-muted/10"
                      data-ocid={`logs.item.${i + 1}`}
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                        {new Date(
                          Number(log.timestamp) / 1_000_000,
                        ).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-foreground font-semibold text-xs">
                        {log.action}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span
                          className={`text-xs font-semibold uppercase ${roleColors[log.role] || "text-muted-foreground"}`}
                        >
                          {log.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono hidden md:table-cell">
                        {log.userId.toString().slice(0, 12)}...
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell max-w-xs truncate">
                        {log.details}
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
