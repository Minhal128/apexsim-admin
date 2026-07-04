"use client";

import Image from "next/image";
import { useState } from "react";
import { IoBookmarks } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";
import { Loader } from "lucide-react";

export interface UserType {
  tx?: string;
  recipient: string;
  email: string;
  assets: string[];
  amount: string;
  time: string;
  status: string;
  _id?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  user: UserType | null;
  assetIcons: Record<string, string>;
}

export default function TransactionDetailModal({
  open,
  onClose,
  user,
  assetIcons,
}: Props) {
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleApprove = async () => {
    if (!user?._id) return;
    setActionLoading(true);
    try {
      // Call approve API
      alert("Transaction approved!");
      onClose();
    } catch (err) {
      alert("Failed to approve transaction");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!user?._id) return;
    if (!feedback.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    setActionLoading(true);
    try {
      // Call reject API
      alert("Transaction rejected!");
      onClose();
    } catch (err) {
      alert("Failed to reject transaction");
    } finally {
      setActionLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-105 bg-[#0A0A10] text-white z-50
        transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-base font-Manrope">Transaction Details</h2>
          <button onClick={onClose}>
            <IoMdCloseCircle className="h-5 w-5 cursor-pointer text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-2 space-y-2 overflow-y-auto h-[calc(100%-64px)]">
          {/* Transaction Summary */}
          <div className="rounded-md border border-[#202026] p-4 space-y-3">
            <h3 className="text-sm font-Manrope text-gray-200">
              Transaction summary
            </h3>

            <DetailRow label="Amount" value={user.amount} bold />
            <DetailRow label="Date & Time" value={user.time} />
            <DetailRow label="Submission ID" value="Passport" />
            <DetailRow label="User" value="ID: 4557575" />
            <DetailRow label="Recipient name" value={user.recipient} />
            <DetailRow label="Network" value={user.assets?.[0] || "BTC"} />

            <DetailRow label="From Address" value={user.tx || "0x..."} copy />
            <DetailRow label="To Address" value={user.tx || "0x..."} copy />

            <DetailRow
              label="Blockchain Tx Hash"
              value={user.tx || "0x..."}
              button="View on explorer"
            />
          </div>

          {/* System Logs */}
          <div className="rounded-md border border-[#202026] p-4 space-y-3">
            <h3 className="text-sm font-Manrope text-gray-200">System Logs</h3>

            <LogItem title="Initiated by user" time="0XAb5...8e21" />
            <LogItem title="Blockchain confirmations" time="09:19 AM. 12/12" />
            <LogItem
              title="Flagged for manual review by the system"
              time="09:19 AM. 12/12"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="flex-1 font-Manrope rounded-lg cursor-pointer bg-[#0055FF] py-3 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {actionLoading ? <Loader className="animate-spin" size={16} /> : null}
              Approve
            </button>
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="flex-1 font-Manrope rounded-lg cursor-pointer bg-[#1F1F26] py-2 text-sm text-gray-300 hover:bg-[#2A3042] disabled:opacity-50"
            >
              Reject
            </button>
          </div>

          {/* Feedback */}
          <div className="rounded-md border border-[#202026] p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-200">
              Rejection reason (required if rejecting)
            </h3>

            <textarea
              placeholder="Write rejection reason..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full rounded-lg border border-[#202026] p-3 text-sm text-white placeholder-gray-500 outline-none resize-none focus:border-blue-500"
              rows={3}
            />
          </div>
        </div>
      </div>
    </>
  );
}

/* Helper Components */

function DetailRow({
  label,
  value,
  bold,
  copy,
  button,
}: {
  label: string;
  value: string;
  bold?: boolean;
  copy?: boolean;
  button?: string;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-[#828A92] text-sm font-Manrope">{label}</span>

      <div className="flex items-center font-Manrope gap-2">
        <span
          className={`${bold ? "font-Manrope text-sm" : "text-gray-200 font-Manrope"}`}
        >
          {value}
        </span>

        {copy && (
          <button className="text-gray-400 cursor-pointer hover:text-white text-xs">
            <IoBookmarks />
          </button>
        )}

        {button && (
          <button className="rounded-md border font-Manrope cursor-pointer bg-[#212027] border-white/10 px-2 py-1 text-xs text-gray-300 hover:bg-white/10">
            {button}
          </button>
        )}
      </div>
    </div>
  );
}

function LogItem({ title, time }: { title: string; time: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
      <div>
        <p className="text-sm font-Manrope text-gray-200">{title}</p>
        <p className="text-xs font-Manrope text-gray-500">{time}</p>
      </div>
    </div>
  );
}
