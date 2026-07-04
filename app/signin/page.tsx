"use client";

import { useState } from "react";
import Image from "next/image";
import BgImg from "../../public/assets/signinbg.png";
import ReactCountryFlag from "react-country-flag";
import { MdArrowDropDown } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

const countries = [
  { name: "United States", code: "+1", iso: "US" },
  { name: "United Kingdom", code: "+44", iso: "GB" },
  { name: "Pakistan", code: "+92", iso: "PK" },
  { name: "India", code: "+91", iso: "IN" },
];

export default function SignInPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(countries[0]);
  const [formData, setFormData] = useState({ email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/admin/login", {
        method: "POST",
        body: JSON.stringify({
          identifier: activeTab === "email" ? formData.email : `${selected.code}${formData.phone}`,
          password: formData.password,
        }),
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/DashboardMain/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={BgImg}
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Black Overlay */}
      <div className="absolute inset-0 z-10 bg-black/40"></div>

      {/* Card */}
      <div className="relative z-20 w-full max-w-lg bg-[#202736] rounded-xl shadow-xl p-6 sm:p-8">
        {/* Heading */}
        <h1 className="text-white font-Manrope text-xl md:text-2xl">APEXSIM</h1>

        <p className="text-white font-Manrope text-lg mt-1">
          Login to your admin account
        </p>

        {error && <p className="text-red-500 text-sm mt-3 bg-red-500/10 px-4 py-2 rounded-lg">{error}</p>}

        {/* Tabs */}
        <div className="flex bg-[#2B3343] rounded-full mt-6 p-1">
          <button
            onClick={() => setActiveTab("email")}
            className={`w-1/2 py-3 rounded-full cursor-pointer font-Manrope text-sm transition ${activeTab === "email"
                ? "bg-[#3A445A] text-white"
                : "text-[#8CA1C2]"
              }`}
          >
            Email Address
          </button>

          <button
            onClick={() => setActiveTab("phone")}
            className={`w-1/2 py-3 rounded-full cursor-pointer font-Manrope text-sm transition ${activeTab === "phone"
                ? "bg-[#3C465A] text-white"
                : "text-[#8CA1C2]"
              }`}
          >
            Phone number
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email / Phone */}
          <div className="mt-5">
            {activeTab === "email" ? (
              <input
                type="email"
                placeholder="Please enter your email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-[#2A3243] text-sm font-Manrope text-white placeholder-[#8CA1C2] rounded-full px-5 py-4.5 outline-none"
              />
            ) : (
              <div className="relative">
                <div className="flex items-center rounded-full bg-[#2A3243] px-4 py-4.5">
                  <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-1 font-Manrope"
                  >
                    <ReactCountryFlag
                      svg
                      countryCode={selected.iso}
                      style={{ width: "1.25em", height: "1.25em" }}
                    />
                    <span className="text-sm text-white">{selected.code}</span>
                    <MdArrowDropDown className="text-[#8CA1C2]" size={18} />
                  </button>

                  <div className="h-6 w-px bg-slate-600 mx-2" />

                  <input
                    type="text"
                    placeholder="000 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1 bg-transparent text-sm font-Manrope text-white outline-none placeholder-[#8CA1C2]"
                  />
                </div>

                {open && (
                  <div className="absolute top-16 left-0 w-56 bg-[#1F2937] border border-slate-700 rounded-xl shadow-lg z-50">
                    {countries.map((c) => (
                      <div
                        key={c.iso}
                        onClick={() => {
                          setSelected(c);
                          setOpen(false);
                        }}
                        className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-800 text-sm text-white"
                      >
                        <ReactCountryFlag
                          svg
                          countryCode={c.iso}
                          style={{ width: "1.25em", height: "1.25em" }}
                        />
                        <span>{c.name}</span>
                        <span className="ml-auto text-slate-400">{c.code}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="relative mt-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full bg-[#2A3243] text-sm font-Manrope text-white placeholder-[#8CA1C2] rounded-full px-5 py-4.5 pr-12 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8CA1C2]"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 cursor-pointer font-Manrope bg-[#0055FF] text-black font-medium py-3.5 rounded-full disabled:opacity-50 transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Forgot */}
        <Link href="/forgotpassword">
          <p className="text-white font-Manrope text-sm mt-4 cursor-pointer hover:text-gray-300 text-center">
            Forgot password
          </p>
        </Link>
      </div>
    </div>
  );
}
