"use client";

export default function TransactionFee() {
  return (
    <div className="space-y-0">
      {/* Title */}
      <div>
        <h3 className="text-sm mb-3 font-Manrope text-white">Transaction Fee</h3>
      </div>

      {/* Inputs */}
      <div className="space-y-2">
        {/* Minimum Fee */}
        <div className="space-y-3">
          <label className="text-xs text-gray-400 font-Manrope">
            Deposit
          </label>
          <input
            type="text"
            placeholder="Enter minimum fee"
            className="w-full border font-Manrope border-[#2F2F34] rounded-lg px-3 py-3 text-sm text-white outline-none"
          />
        </div>

        {/* Maximum Fee */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400 font-Manrope">
            Withdrawal
          </label>
          <input
            type="text"
            placeholder="Enter maximum fee"
            className="w-full border font-Manrope border-[#2F2F34] rounded-lg px-3 py-3 text-sm text-white outline-none"
          />
        </div>
      </div>

      {/* Button */}
      <div className="pt-2">
        <button className="w-full mt-3 font-Manrope bg-blue-600 cursor-pointer transition rounded-lg py-3 text-sm font-Manrope">
          Save Changes
        </button>
      </div>
    </div>
  );
}
