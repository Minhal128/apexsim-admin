"use client";

import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdCloseCircle } from "react-icons/io";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AddAdminModal({ open, onClose }: Props) {
  const [roleOpen, setRoleOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Select Role");

  if (!open) return null;

  const roles = ["Super Admin", "Admin", "Moderator"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-90 md:w-120 rounded-xl bg-[#0A0A10] p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <IoMdCloseCircle className="cursor-pointer" size={18} />
        </button>

        <h2 className="mb-4 font-Manrope text-lg font-Manrope text-white">
          Add New Admin
        </h2>

        <p className="mb-3 text-sm font-Manrope text-gray-400">
          Basic Information
        </p>

        <div className="space-y-3">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-Manrope text-gray-400">Name</label>
            <input
              type="text"
              placeholder="Add Name"
              className="w-full rounded-md font-Manrope border border-[#202026] p-3 text-sm text-white outline-none ring-1 ring-white/10"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-Manrope text-gray-400">Email</label>
            <input
              type="email"
              placeholder="Add Email"
              className="w-full rounded-md  font-Manrope border border-[#202026] p-3 text-sm text-white outline-none ring-1 ring-white/10"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-Manrope text-gray-400">
              Password
            </label>
            <input
              type="password"
              placeholder="Add Password"
              className="w-full rounded-md font-Manrope border border-[#202026] p-3 text-sm text-white outline-none ring-1 ring-white/10"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-Manrope text-gray-400">Role</label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleOpen(!roleOpen)}
                className="flex w-full font-Manrope items-center justify-between rounded-md border border-[#202026] p-3 text-sm text-white ring-1 ring-white/10"
              >
                <span
                  className={
                    selectedRole === "Select Role"
                      ? "text-gray-400"
                      : "text-white"
                  }
                >
                  {selectedRole}
                </span>
                <IoMdArrowDropdown size={16} />
              </button>

              {roleOpen && (
                <div className="absolute z-10 font-Manrope mt-1 w-full rounded-md bg-[#212027] ring-1 ring-white/10">
                  {roles.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setSelectedRole(role);
                        setRoleOpen(false);
                      }}
                      className={`w-full px-3 py-2 font-Manrope text-left text-sm hover:bg-white/10 ${
                        selectedRole === role
                          ? "bg-white/10 text-[#00B595]"
                          : "text-gray-300"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button className="w-full rounded-md font-Manrope bg-[#0055FF] py-3 text-sm font-Manrope text-white">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
