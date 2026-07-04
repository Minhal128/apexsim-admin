"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import BgImg from "../../public/assets/signinbg.png";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function OTPVerificationPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      router.push("/forgotpassword");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  const handleChange = (index: number, value: string) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp: otp.join("") }),
      });
      localStorage.setItem("resetOTP", otp.join(""));
      router.push("/changepassword");
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

      <div className="relative z-20 w-full max-w-lg bg-[#202736] rounded-xl shadow-xl p-6 sm:p-8">
        <h1 className="text-white font-Manrope text-xl mb-6">OTP Verification</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-between mb-4 gap-2">
          {otp.map((value, index) => (
            <input
              key={index}
              ref={(el) => { if (el) inputsRef.current[index] = el; }}
              type="text"
              maxLength={1}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="md:w-17 md:h-16 w-12 h-12 text-center rounded-lg bg-[#2A3243] text-white text-lg font-Manrope outline-none border border-transparent focus:border-[#FFFFFF] transition-all"
            />
          ))}
        </div>

        <p className="text-sm text-[#8B8B8C] font-Manrope text-center mb-6">
          Don't receive code?{" "}
          <span className="text-[#FFF] font-Manrope cursor-pointer hover:underline" onClick={() => router.push("/forgotpassword")}>
            Resend
          </span>
        </p>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full md:mt-3 cursor-pointer font-Manrope text-sm bg-[#0055FF] text-black py-3.5 rounded-full disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}

