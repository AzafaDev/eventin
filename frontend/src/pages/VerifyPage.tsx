import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Send,
  Calendar,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

import { useAuthStore } from "../stores/useAuthStore";
import LoadingOverlay from "../components/LoadingOverlay";

const VerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const { verifyEmail, isLoading, isVerified, resendEmail } = useAuthStore();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // --- OTP Logic ---
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value.substring(element.value.length - 1);
    setOtp(newOtp);

    // Auto focus next
    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const data = e.clipboardData.getData("text").slice(0, 6); // Ambil 6 karakter pertama
    if (!/^\d+$/.test(data)) return; // Pastikan hanya angka

    const newOtp = [...otp];
    data.split("").forEach((char, index) => {
      newOtp[index] = char;
      // Set value ke input secara manual agar terlihat
      if (inputRefs.current[index]) {
        inputRefs.current[index]!.value = char;
      }
    });
    setOtp(newOtp);

    // Fokus ke kotak terakhir setelah paste
    inputRefs.current[Math.min(data.length, 5)]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // --- Handlers ---
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("");
    if (!email || token.length < 6)
      return toast.error("Lengkapi email dan kode verifikasi");

    try {
      await verifyEmail(email, token);
    } catch (error: any) {
      toast.error(error.message || "Kode tidak valid");
    }
  };

  const handleResend = async () => {
    if (!email) return toast.error("Masukkan email terlebih dahulu");
    try {
      await resendEmail(email);
      setCountdown(300);
      toast.success("Kode baru telah dikirim ke email Anda");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen flex selection:bg-orange-100 font-sans bg-white">
      {isLoading && <LoadingOverlay />}

      {/* --- LEFT SIDE: BRANDING (Consistent with Register) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#f05537] overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-black rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 text-white max-w-md text-center"
        >
          <div className="bg-white/20 backdrop-blur-md p-6 w-fit rounded-[2rem] mb-8 border border-white/30 shadow-2xl mx-auto">
            <ShieldCheck className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-5xl font-black mb-6 leading-tight tracking-tight">
            Langkah Terakhir <br />
            <span className="text-black/20 italic">Menuju Spektakuler.</span>
          </h1>
          <p className="text-xl text-white/80 font-light leading-relaxed">
            Keamanan akun Anda adalah prioritas kami. Masukkan kode unik untuk
            mengaktifkan akses penuh.
          </p>
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 pt-32 lg:pt-20">
        <AnimatePresence mode="wait">
          {!isVerified ? (
            <motion.div
              key="verify-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 sm:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100"
            >
              <div className="flex flex-col items-center text-center mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <Calendar className="text-[#f05537] w-6 h-6" />
                  <span className="text-xl font-black tracking-tighter uppercase text-slate-900">
                    Event<span className="text-[#f05537]">in</span>
                  </span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                  Verifikasi <span className="text-[#f05537]">Akun Anda</span>
                </h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Kami telah mengirimkan 6 digit kode unik ke email Anda.
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-8">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Konfirmasi Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#f05537] transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="anda@email.com"
                      className="w-full pl-11 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-[#f05537]/30 transition-all outline-none font-semibold text-sm"
                    />
                  </div>
                </div>

                {/* OTP Digital Inputs */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Kode Verifikasi 6-Digit
                  </label>
                  <div className="flex justify-between gap-2 sm:gap-3">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        value={data}
                        onPaste={index === 0 ? handlePaste : undefined}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-full h-12 sm:h-14 text-center text-xl font-black text-[#f05537] bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-[#f05537]/30 transition-all outline-none"
                        maxLength={1}
                      />
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(240, 85, 55, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4.5 bg-[#f05537] text-white font-black uppercase tracking-[0.15em] rounded-2xl shadow-xl shadow-[#f05537]/20 flex items-center justify-center gap-3"
                >
                  Verifikasi Sekarang
                  <Send size={18} />
                </motion.button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-4">
                <button
                  onClick={handleResend}
                  disabled={countdown > 0}
                  className="text-xs font-bold text-slate-400 hover:text-[#f05537] flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                >
                  <RefreshCw
                    size={14}
                    className={countdown > 0 ? "animate-spin" : ""}
                  />
                  {countdown > 0
                    ? `Kirim ulang dalam ${countdown}s`
                    : "Tidak menerima kode? Kirim ulang"}
                </button>
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all"
                >
                  <ArrowLeft size={12} /> Kembali ke Pendaftaran
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Success State */
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md text-center p-12 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100"
            >
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">
                Verifikasi Berhasil!
              </h2>
              <p className="text-slate-500 mb-10 font-medium">
                Akun Anda telah aktif. Sekarang Anda bisa menjelajahi berbagai
                event spektakuler di Eventin.
              </p>
              <button
                onClick={() => navigate("/")}
                className="w-full py-4.5 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all"
              >
                Mulai Menjelajah
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VerifyPage;
