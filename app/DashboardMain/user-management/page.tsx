import TopStats from "@/components/dashboard/TopStats";
import RecenteActivities from "@/components/User-Management/RecenteActivities";

export default function UserManagementPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-Manrope text-white">User Management</h1>

      <TopStats />

      <RecenteActivities />
    </div>
  );
}
