"use client";

import { useState, useRef } from "react";
import { RiSettings6Line } from "react-icons/ri";
import { FiUploadCloud } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";

const Toggle = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) => (
  <div
    onClick={onChange}
    className={`w-8 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${
      enabled ? "bg-[#0055FF]" : "bg-gray-600"
    }`}
  >
    <div
      className={`bg-white w-3 h-3 rounded-full shadow-md transform transition ${
        enabled ? "translate-x-3" : "translate-x-0"
      }`}
    />
  </div>
);

const SettingItem = ({
  title,
  enabled,
  onToggle,
}: {
  title: string;
  enabled: boolean;
  onToggle: () => void;
}) => (
  <div className="flex items-center gap-3 py-2">
    <Toggle enabled={enabled} onChange={onToggle} />
    <span className="text-sm font-Manrope">{title}</span>
  </div>
);

export default function Customization() {
  /* Logo */
  const lightInputRef = useRef<HTMLInputElement>(null);
  const darkInputRef = useRef<HTMLInputElement>(null);

  const [lightLogo, setLightLogo] = useState<string | null>(null);
  const [darkLogo, setDarkLogo] = useState<string | null>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "light" | "dark",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    type === "light" ? setLightLogo(url) : setDarkLogo(url);
  };

  const [usd, setUsd] = useState(true);
  const [eur, setEur] = useState(true);
  const [cad, setCad] = useState(true);
  const [gbp, setGbp] = useState(true);

  const [english, setEnglish] = useState(true);
  const [french, setFrench] = useState(true);
  const [german, setGerman] = useState(true);
  const [polish, setPolish] = useState(true);
  const [spanish, setSpanish] = useState(true);
  const [swedish, setSwedish] = useState(true);

  const languages = [
    "English",
    "French",
    "German",
    "Polish",
    "Spanish",
    "Swedish",
  ];
  const [defaultLanguage, setDefaultLanguage] = useState("English");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [portfolio, setPortfolio] = useState(true);
  const [crypto, setCrypto] = useState(true);
  const [referrals, setReferrals] = useState(true);
  const [activities, setActivities] = useState(true);

  return (
    <div className="w-full min-h-screen bg-[#0E0D15] text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2">
          <RiSettings6Line />
          <h2 className="text-sm font-Manrope">Customization</h2>
        </div>

        {/* Card */}
        <div className="bg-[#12111A] border border-[#1F1E2A] rounded-xl p-4 sm:p-6 space-y-8">
          {/* Logo */}
          <div className="space-y-3">
            <h3 className="text-sm font-Manrope">Logo</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Light Logo */}
              <div className="space-y-2">
                <div
                  onClick={() => lightInputRef.current?.click()}
                  className="h-16 rounded-lg bg-[#1A1925] flex items-center justify-center cursor-pointer hover:bg-[#222136] transition"
                >
                  {lightLogo ? (
                    <img
                      src={lightLogo}
                      alt="Light logo"
                      className="h-10 object-contain"
                    />
                  ) : (
                    <FiUploadCloud className="text-xl text-gray-400" />
                  )}
                </div>
                <p className="text-xs text-gray-400 font-Manrope">
                  Light mode logo
                </p>
                <input
                  ref={lightInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleImageUpload(e, "light")}
                />
              </div>

              {/* Dark Logo */}
              <div className="space-y-2">
                <div
                  onClick={() => darkInputRef.current?.click()}
                  className="h-16 rounded-lg bg-[#1A1925] flex items-center justify-center cursor-pointer hover:bg-[#222136] transition"
                >
                  {darkLogo ? (
                    <img
                      src={darkLogo}
                      alt="Dark logo"
                      className="h-10 object-contain"
                    />
                  ) : (
                    <FiUploadCloud className="text-xl text-gray-400" />
                  )}
                </div>
                <p className="text-xs text-gray-400 font-Manrope">
                  Dark mode logo
                </p>
                <input
                  ref={darkInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleImageUpload(e, "dark")}
                />
              </div>
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-3">
            <h3 className="text-sm font-Manrope">Currency</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <SettingItem
                title="USD"
                enabled={usd}
                onToggle={() => setUsd(!usd)}
              />
              <SettingItem
                title="EUR"
                enabled={eur}
                onToggle={() => setEur(!eur)}
              />
              <SettingItem
                title="CAD"
                enabled={cad}
                onToggle={() => setCad(!cad)}
              />
              <SettingItem
                title="GBP"
                enabled={gbp}
                onToggle={() => setGbp(!gbp)}
              />
            </div>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <h3 className="text-sm font-Manrope">Language</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <SettingItem
                title="English"
                enabled={english}
                onToggle={() => setEnglish(!english)}
              />
              <SettingItem
                title="French"
                enabled={french}
                onToggle={() => setFrench(!french)}
              />
              <SettingItem
                title="German"
                enabled={german}
                onToggle={() => setGerman(!german)}
              />
              <SettingItem
                title="Polish"
                enabled={polish}
                onToggle={() => setPolish(!polish)}
              />
              <SettingItem
                title="Spanish"
                enabled={spanish}
                onToggle={() => setSpanish(!spanish)}
              />
              <SettingItem
                title="Swedish"
                enabled={swedish}
                onToggle={() => setSwedish(!swedish)}
              />
            </div>

            <div className="mt-3 relative">
              <label className="text-xs text-gray-400 font-Manrope mb-1 block">
                Default Language
              </label>
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full bg-[#1A1925] border border-[#2B2A38] rounded-lg p-2 flex justify-between items-center cursor-pointer text-white font-Manrope"
              >
                {defaultLanguage}
                <IoMdArrowDropdown className="text-lg" />
              </div>

              {dropdownOpen && (
                <ul className="absolute top-full left-0 w-full mt-1 bg-[#1A1925] border border-[#2B2A38] rounded-lg max-h-48 overflow-y-auto z-10">
                  {languages.map((lang) => (
                    <li
                      key={lang}
                      onClick={() => {
                        setDefaultLanguage(lang);
                        setDropdownOpen(false);
                      }}
                      className={`p-2 cursor-pointer hover:bg-[#222136] ${
                        defaultLanguage === lang
                          ? "bg-[#0055FF] text-white"
                          : ""
                      }`}
                    >
                      {lang}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-Manrope">Homepage widgets</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <SettingItem
                title="Portfolio"
                enabled={portfolio}
                onToggle={() => setPortfolio(!portfolio)}
              />
              <SettingItem
                title="Crypto prices"
                enabled={crypto}
                onToggle={() => setCrypto(!crypto)}
              />
              <SettingItem
                title="Referrals"
                enabled={referrals}
                onToggle={() => setReferrals(!referrals)}
              />
              <SettingItem
                title="Recent activities"
                enabled={activities}
                onToggle={() => setActivities(!activities)}
              />
            </div>
          </div>

          {/* Save Button */}
          <button className="w-full mt-4 bg-[#0055FF] cursor-pointer py-3 rounded-lg text-sm font-Manrope hover:opacity-90 transition">
            Save settings
          </button>
        </div>
      </div>
    </div>
  );
}
