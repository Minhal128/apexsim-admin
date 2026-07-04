export default function OperationalQueues() {
  return (
    <div className="rounded-xl bg-[#0E0D15] py-6 px-4">
      {/* Header */}
      <h2 className="mb-4 text-lg font-Manrope text-[#828A92]">
        Operational Queues
      </h2>

      <div className="space-y-3">
        {/* Row 1 */}
        <div className="flex items-center justify-between rounded-lg bg-[#18171F] px-4 py-3">
          <div className="flex items-center md:gap-2 gap-1">
            <p className="md:text-sm text-xs text-[#C2C9CF] font-Manrope">
              Pending KYC Approvals
            </p>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#22202C] text-xs text-[#0055FF]">
              3
            </span>
          </div>

          <button className="rounded-md bg-[#0055FF] font-Manroper px-3 py-2 cursor-pointer text-xs text-white">
            Review
          </button>
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-between rounded-lg bg-[#18171F] px-4 py-3">
          <div className="flex items-center md:gap-2 gap-1">
            <p className="md:text-sm text-xs text-[#C2C9CF] font-Manrope">
              Pending Withdrawals
            </p>
            <span className="flex h-5 w-5 items-cente font-Manroper justify-center rounded-full bg-[#22202C] text-xs text-[#0055FF]">
              5
            </span>
          </div>

          <button className="rounded-md font-Manrope bg-[#0055FF] px-3 py-2 cursor-pointer text-xs text-white">
            Review
          </button>
        </div>

        {/* Row 3 */}
        <div className="flex items-center justify-between rounded-lg bg-[#18171F] px-4 py-3">
          <div className="flex items-center md:gap-2 gap-1">
            <p className="md:text-sm text-xs text-[#C2C9CF] font-Manrope">
              Flagged Suspicious Deposits
            </p>
            <span className="flex h-5 w-5 items-center font-Manrope justify-center rounded-full bg-[#22202C] text-xs text-red-800">
              2
            </span>
          </div>

          <button className="rounded-md bg-[#0055FF] font-Manrope px-3 py-2 cursor-pointer text-xs text-white">
            Investigate
          </button>
        </div>
      </div>
    </div>
  );
}
