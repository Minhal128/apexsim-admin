"use client";

import { Search, Filter, Upload, MoreHorizontal, Trash2, Edit2, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import AddAdminModal from "./AddAdminModal";
import { getAdminsList, deleteAdmin, updateAdminRole } from "@/lib/adminApi";

interface Admin {
  _id: string;
  id?: string;
  name: string;
  email?: string;
  role: string;
  status: string;
  lastLogin?: string;
  createdAt?: string;
}

export default function AdminTable() {
  const [openModal, setOpenModal] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>("");
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchAdmins();
  }, [refreshKey]);

  useEffect(() => {
    filterAdmins();
  }, [searchTerm, filterRole, admins]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await getAdminsList(1, 50);
      const adminsList = data.data || data || [];
      setAdmins(Array.isArray(adminsList) ? adminsList : []);
      setError("");
    } catch (err: any) {
      console.error("Error fetching admins:", err);
      setError(err.message || "Failed to load admins");
      // Set fallback mock data for demo
      setAdmins([
        {
          _id: "1",
          name: "Tanya Hill",
          role: "Super Admin",
          status: "Active",
          lastLogin: "2/11/12 09:16 AM",
        },
        {
          _id: "2",
          name: "Georgia Young",
          role: "Moderator",
          status: "Inactive",
          lastLogin: "1/31/14 01:45 PM",
        },
        {
          _id: "3",
          name: "James Smith",
          role: "Admin",
          status: "Active",
          lastLogin: "3/02/15 11:30 AM",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterAdmins = () => {
    let filtered = admins;

    if (searchTerm) {
      filtered = filtered.filter((admin) =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (admin.email && admin.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterRole) {
      filtered = filtered.filter((admin) => admin.role === filterRole);
    }

    setFilteredAdmins(filtered);
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    setDeleteLoading(adminId);
    try {
      await deleteAdmin(adminId);
      setAdmins(admins.filter((admin) => admin._id !== adminId));
      alert("Admin deleted successfully!");
    } catch (err: any) {
      alert("Failed to delete admin: " + err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };


  return (
    <>
      <div className="w-full rounded-2xl bg-[#0E0D15] border border-[#0E0D15] p-2 sm:p-3">
        <div className="mb-4 flex flex-col gap-4 rounded-md p-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-Manrope text-white">
            Admins <span className="text-gray-400">({filteredAdmins.length})</span>
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            {error && <span className="text-red-400 text-xs">{error}</span>}
            
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 w-40 rounded-md bg-[#212027] pl-9 pr-3 text-sm text-white outline-none ring-1 ring-white/10 sm:w-56"
              />
            </div>

            {/* Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="h-9 rounded-md bg-[#212027] px-3 text-sm text-gray-300 ring-1 ring-white/10 outline-none"
            >
              <option value="">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
            </select>

            {/* Export */}
            <button className="flex h-9 items-center gap-2 rounded-md bg-[#212027] px-3 text-sm text-gray-300 ring-1 ring-white/10 hover:opacity-80">
              <Upload size={14} />
              Export
            </button>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex h-9 items-center gap-2 rounded-md bg-[#212027] px-3 text-sm text-gray-300 ring-1 ring-white/10 hover:opacity-80 disabled:opacity-50"
            >
              {loading ? <Loader size={14} className="animate-spin" /> : "↻"}
              Refresh
            </button>

            {/* Add Admin */}
            <button
              onClick={() => setOpenModal(true)}
              className="h-9 rounded-md cursor-pointer bg-[#00B595] px-4 text-sm font-Manrope text-white hover:opacity-90"
            >
              Add Admin
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading && admins.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Loader className="inline-block animate-spin mr-2" size={20} />
              Loading admins...
            </div>
          ) : (
            <table className="w-full text-sm font-Manrope">
              <thead>
                <tr className="text-left text-xs bg-[#17161E] text-gray-400">
                  <th className="px-3 py-3">Admin ID</th>
                  <th className="px-3 py-3">Admin Name</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">Role</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Last Login</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="text-gray-300">
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map((admin) => (
                    <tr
                      key={admin._id}
                      className="border-t border-white/5 hover:bg-white/5"
                    >
                      <td className="px-3 py-4">{admin._id.substring(0, 8)}</td>
                      <td className="px-3 py-4">{admin.name}</td>
                      <td className="px-3 py-4">{admin.email || "N/A"}</td>
                      <td className="px-3 py-4">
                        <span className="px-2 py-1 rounded-md text-xs bg-blue-500/20 text-blue-400">
                          {admin.role}
                        </span>
                      </td>

                      <td className="px-3 py-4">
                        <span
                          className={`px-3 py-1 rounded-md text-xs text-white ${
                            admin.status === "Active"
                              ? "bg-[#00B595]"
                              : "bg-[#FF8D28]"
                          }`}
                        >
                          {admin.status}
                        </span>
                      </td>

                      <td className="px-3 py-4 text-gray-400">{admin.lastLogin || "Never"}</td>

                      <td className="px-3 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button className="rounded-md bg-white/5 p-2 hover:bg-blue-500/20 text-blue-400">
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin._id)}
                            disabled={deleteLoading === admin._id}
                            className="rounded-md bg-white/5 p-2 hover:bg-red-500/20 text-red-400 disabled:opacity-50"
                          >
                            {deleteLoading === admin._id ? (
                              <Loader size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-3 py-8 text-center text-gray-400">
                      No admins found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      <AddAdminModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          handleRefresh();
        }}
      />
    </>
  );
}
