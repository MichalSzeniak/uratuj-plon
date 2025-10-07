import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { data: pending } = await supabase
        .from("listings")
        .select("id", { count: "exact" })
        .eq("status", "pending");

      const { data: active } = await supabase
        .from("listings")
        .select("id", { count: "exact" })
        .eq("status", "active");

      const { data: guest } = await supabase
        .from("listings")
        .select("id", { count: "exact" })
        .eq("is_guest_listing", true);

      return {
        pending: pending?.length || 0,
        active: active?.length || 0,
        guest: guest?.length || 0,
        total: (pending?.length || 0) + (active?.length || 0),
      };
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Oczekujące"
        value={stats?.pending || 0}
        icon={<AlertTriangle className="h-6 w-6" />}
        color="amber"
      />
      <StatCard
        title="Aktywne"
        value={stats?.active || 0}
        icon={<CheckCircle className="h-6 w-6" />}
        color="green"
      />
      <StatCard
        title="Goście"
        value={stats?.guest || 0}
        icon={<User className="h-6 w-6" />}
        color="blue"
      />
      <StatCard
        title="Razem"
        value={stats?.total || 0}
        icon={<BarChart3 className="h-6 w-6" />}
        color="gray"
      />
    </div>
  );
}
