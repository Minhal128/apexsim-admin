"use client";
import { useState } from "react";
import Image from "next/image";
import BgImg from "../../public/assets/signinbg.png";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      localStorage.setItem("resetEmail", email);
      router.push("/otpverification");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0B1220] w-full flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0">
        <Image src={BgImg} alt="Background" fill priority className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-20 w-full max-w-lg bg-[#202736] rounded-xl shadow-xl p-6 md:p-8">
        <h1 className="text-white font-Manrope text-xl">Reset Password</h1>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="relative mt-6 flex gap-6 border-b border-white/10">
          {["email", "phone"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "email" | "phone")}
              className={`relative pb-3 text-sm font-Manrope transition ${activeTab === tab ? "text-white" : "text-white/50"}`}
            >
              {tab === "email" ? "Email Address" : "Phone Number"}
              {activeTab === tab && <span className="absolute left-0 -bottom-px h-0.5 w-full bg-white rounded-full" />}
            </button>
          ))}
        </div>

        <form onSubmit={handleProceed} className="mt-6">
          {activeTab === "email" ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full rounded-full bg-[#2A3243] px-5 py-4 text-sm font-Manrope text-white outline-none placeholder-[#8CA1C2]"
              required
            />
          ) : (
            <p className="text-white/50 text-sm py-4">Phone reset coming soon...</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-5 cursor-pointer font-Manrope text-sm bg-[#0055FF] text-black py-3.5 rounded-full disabled:opacity-50"
          >
            {loading ? "Processing..." : "Proceed"}
          </button>
        </form>
      </div>
    </div>
  );
}

