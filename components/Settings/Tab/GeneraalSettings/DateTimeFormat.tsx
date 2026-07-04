"use client";

import { useState, useEffect } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Loader } from "lucide-react";
import { getSettings, updateSettings } from "@/lib/adminApi";

type DateTimeOption = {
  code: string;
  label: string;
};

const dateTimeOptions: DateTimeOption[] = [
  { code: "12H", label: "12-Hour Format (e.g., 02:30 PM)" },
  { code: "24H", label: "24-Hour Format (e.g., 14:30)" },
  { code: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { code: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { code: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

export default function DateTimeFormat() {
  const [selected, setSelected] = useState<string>("12H");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      if (data.dateTimeFormat) {
        setSelected(data.dateTimeFormat);
      }
      setError("");
    } catch (err: any) {
      console.error("Failed to fetch settings:", err);
      setError(err.message || "Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({ dateTimeFormat: selected });
      setSuccess("Date/Time format saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-0 md:h-screen">
      {/* TITLE */}
      <h2 className="text-lg font-Manrope mb-4">Date & Time Format</h2>

      {error && (
        <div className="p-3 rounded-md bg-red-500/10 text-red-400 text-sm mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-md bg-green-500/10 text-green-400 text-sm mb-4">
          {success}
        </div>
      )}

      {/* LIST */}
      <div className="space-y-1">
        {dateTimeOptions.map((option) => {
          const isActive = selected === option.code;

          return (
            <div
              key={option.code}
              onClick={() => setSelected(option.code)}
              className="flex items-center justify-between py-3 px-0 rounded-lg cursor-pointer transition hover:bg-white/5"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <p className="font-Manrope">{option.label}</p>
              </div>

              {/* RIGHT ICON */}
              <IoCheckmarkCircle
                className={`text-xl transition ${
                  isActive ? "text-[#0055FF]" : "text-[#2F2F34]"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* SAVE BUTTON */}
      <button 
        onClick={handleSave}
        disabled={saving}
        className="w-full mt-4 cursor-pointer font-Manrope bg-[#0055FF] hover:bg-[#0047D4] disabled:opacity-50 transition text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
      >
        {saving ? <Loader className="animate-spin" size={16} /> : null}
        Save
      </button>
    </div>
  );
}
