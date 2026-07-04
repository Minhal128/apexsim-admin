"use client";

import { useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { apiRequest } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddUserModal({ open, onClose }: Props) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await apiRequest("/admin/users", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
        }),
      });
      setSuccess(`User created! Default password: ApexUser@123`);
      setFormData({ name: "", email: "", phone: "" });
      setTimeout(() => {
        setSuccess("");
        onClose();
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center mx-5 md:mx-0 justify-center bg-black/60">
      <div className="w-full max-w-md rounded-2xl bg-[#0A0A10] p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-Manrope text-white">Add New User</h2>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <IoMdCloseCircle className="cursor-pointer" size={18} />
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-3 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-3 bg-green-500/10 px-3 py-2 rounded-lg">{success}</p>}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-Manrope text-gray-400">
              Full name
            </label>
            <input
              type="text"
              placeholder="E.g James Bond"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-10 w-full rounded-md font-Manrope border border-[#202026] px-3 text-sm text-white placeholder-gray-500 outline-none ring-1 ring-white/10 focus:ring-white/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-Manrope text-gray-400">
              Email Address
            </label>
            <input
              type="email"
              placeholder="E.g james@gmail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-10 w-full rounded-md font-Manrope border border-[#202026] px-3 text-sm text-white placeholder-gray-500 outline-none ring-1 ring-white/10 focus:ring-white/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-Manrope text-gray-400">
              Phone number
            </label>
            <input
              type="text"
              placeholder="E.g +13254758"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-10 w-full rounded-md font-Manrope border border-[#202026] px-3 text-sm text-white placeholder-gray-500 outline-none ring-1 ring-white/10 focus:ring-white/20"
            />
          </div>
        </div>

        {/* Action */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={loading || !formData.name || !formData.email}
            className="h-10 w-full rounded-md cursor-pointer bg-[#0055FF] text-sm font-Manrope text-white disabled:opacity-50 transition"
          >
            {loading ? "Creating..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
