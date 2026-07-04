import TopStats from "@/components/dashboard/TopStats";
import AdminTable from "@/components/RolePermission/AdminTable";

export default function RolesPermissionsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-Manrope text-white">Roles & Permissions</h1>

      <TopStats />

      <AdminTable />
    </div>
  );
}
