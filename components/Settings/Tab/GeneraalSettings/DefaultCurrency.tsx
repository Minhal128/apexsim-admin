"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Loader } from "lucide-react";
import { getSettings, updateSettings } from "@/lib/adminApi";

type Currency = {
  code: string;
  name: string;
  flag: string;
};

const currencies: Currency[] = [
  {
    code: "USD",
    name: "US",
    flag: "/assets/us.png",
  },
  {
    code: "GBP",
    name: "GBP",
    flag: "/assets/gb.png",
  },
  {
    code: "EUR",
    name: "EUR",
    flag: "/assets/eu.png",
  },
  {
    code: "CHF",
    name: "CHF",
    flag: "/assets/ch.png",
  },
  {
    code: "JPY",
    name: "JPY",
    flag: "/assets/jp.png",
  },
];

export default function DefaultCurrency() {
  const [selected, setSelected] = useState<string>("USD");
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
      if (data.defaultCurrency) {
        setSelected(data.defaultCurrency);
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
      await updateSettings({ defaultCurrency: selected });
      setSuccess("Currency saved successfully!");
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
    <div className="space-y-0">
      {/* TITLE */}
      <h2 className="text-lg font-Manrope">Default Currency</h2>

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
        {currencies.map((currency) => {
          const isActive = selected === currency.code;

          return (
            <div
              key={currency.code}
              onClick={() => setSelected(currency.code)}
              className="flex items-center justify-between py-3 rounded-lg cursor-pointer hover:bg-white/5"
            >
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-sm bg-gray-500 flex items-center justify-center text-xs font-bold">
                  {currency.code.substring(0, 1)}
                </div>

                <div>
                    <p className="font-Manrope">{currency.name}</p>
                    <span className="text-xs text-gray-400">{currency.code}</span>
                </div>
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
