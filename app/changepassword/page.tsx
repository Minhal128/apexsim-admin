"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import BgImg from "../../public/assets/signinbg.png";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    const storedOtp = localStorage.getItem("resetOTP");
    if (!storedEmail || !storedOtp) {
      router.push("/forgotpassword");
    } else {
      setEmail(storedEmail);
      setOtp(storedOtp);
    }
  }, [router]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, otp, newPassword }),
      });
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOTP");
      router.push("/signin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex bg-[#0B1220] items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src={BgImg} alt="Dots background" fill priority className="object-cover" />
      </div>
      <div className="absolute inset-0 z-10 bg-black/40"></div>

      <div className="relative z-20 w-full max-w-lg bg-[#202736] rounded-xl shadow-xl p-6 sm:p-8">
        <p className="text-center text-white font-Manrope text-2xl mb-4">APEXSIM</p>
        <h1 className="text-white font-Manrope text-lg text-left">Change Password</h1>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <form onSubmit={handleConfirm}>
          <div className="relative mt-4">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full bg-[#2A3243] font-Manrope text-sm text-white placeholder-[#8CA1C2] rounded-full px-5 py-4.5 pr-12 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8CA1C2]"
            >
              {showNewPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          <div className="relative mt-3">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-[#2A3243] font-Manrope text-sm text-white placeholder-[#8CA1C2] rounded-full px-5 py-4.5 pr-12 outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8CA1C2]"
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 cursor-pointer font-Manrope bg-[#0055FF] text-black font-medium py-3.5 rounded-full transition disabled:opacity-50"
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>
        </form>
      </div>
    </div>
  );
}

