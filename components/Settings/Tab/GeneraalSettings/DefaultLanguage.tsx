"use client";

import { useState, useEffect } from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Loader } from "lucide-react";
import { getSettings, updateSettings } from "@/lib/adminApi";

type Language = {
  code: string;
  name: string;
};

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "ar", name: "Arabic" },
];

export default function DefaultLanguage() {
  const [selected, setSelected] = useState<string>("en");
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
      if (data.defaultLanguage) {
        setSelected(data.defaultLanguage);
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
      await updateSettings({ defaultLanguage: selected });
      setSuccess("Language saved successfully!");
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
      <h2 className="text-lg font-Manrope">Default Language</h2>

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
        {languages.map((language) => {
          const isActive = selected === language.code;

          return (
            <div
              key={language.code}
              onClick={() => setSelected(language.code)}
              className="flex items-center justify-between py-3 rounded-lg cursor-pointer hover:bg-white/5"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <p className="font-Manrope">{language.name}</p>
              </div>

              {/* RIGHT ICON (COLOR CHANGE ONLY) */}
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
        className="w-full mt-2 cursor-pointer font-Manrope bg-[#0055FF] hover:bg-[#0047D4] disabled:opacity-50 transition text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
      >
        {saving ? <Loader className="animate-spin" size={16} /> : null}
        Save
      </button>
    </div>
  );
}
