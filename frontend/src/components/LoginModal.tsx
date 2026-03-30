import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Mail,
  X,
  Loader2,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/useAuthStore";

const LoginModal = () => {
  const navigate = useNavigate();
  const { isOpen, setIsOpen, login, isLoading, forgotPassword } =
    useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Persistent Countdown Logic
  useEffect(() => {
    let timer: number;
    const checkTimer = () => {
      const lastClick = localStorage.getItem("lastForgotPasswordClick");
      if (!lastClick) return;
      const cooldownPeriod = 5 * 60 * 1000;
      const timeLeft = cooldownPeriod - (Date.now() - parseInt(lastClick));
      if (timeLeft > 0) {
        setCountdown(Math.ceil(timeLeft / 1000));
        timer = window.setInterval(() => {
          setCountdown((prev) =>
            prev <= 1 ? (clearInterval(timer), 0) : prev - 1,
          );
        }, 1000);
      }
    };
    if (isOpen) checkTimer();
    return () => clearInterval(timer);
  }, [isOpen]);

  const handleForgotPassword = async () => {
    if (countdown > 0 || isLoading) return;
    if (!email) return toast.error("Masukkan email Anda terlebih dahulu");
    try {
      await forgotPassword(email);
      localStorage.setItem("lastForgotPasswordClick", Date.now().toString());
      setCountdown(300);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengirim link reset");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      setEmail("");
      setPassword("");
      setIsOpen(false);
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Kredensial tidak valid");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoading && setIsOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white/80 backdrop-blur-xl w-full max-w-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition-all z-10"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="p-8 sm:p-10">
              {/* Brand Branding */}
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-[#f05537] p-2 rounded-xl shadow-lg shadow-orange-500/20">
                  <Calendar className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-black tracking-tighter uppercase text-slate-900">
                  Event<span className="text-[#f05537]">in</span>
                </span>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                  Selamat Datang{" "}
                  <span className="text-[#f05537]">Kembali!</span>
                </h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Log in ke akun Eventin-mu untuk akses tiket dan event seru.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  label="Alamat Email"
                  type="email"
                  placeholder="anda@email.com"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  disabled={isLoading}
                  icon={<Mail size={18} />}
                />

                <div className="space-y-1">
                  <InputField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    disabled={isLoading}
                    icon={<Lock size={18} />}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-[#f05537] transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    }
                  />
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      disabled={isLoading || countdown > 0}
                      onClick={handleForgotPassword}
                      className={`text-[11px] font-bold transition-all px-1 ${
                        countdown > 0
                          ? "text-slate-300 cursor-not-allowed"
                          : "text-[#f05537] hover:underline"
                      }`}
                    >
                      {countdown > 0
                        ? `Tunggu ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, "0")}`
                        : "Lupa Password?"}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 15px 30px rgba(240, 85, 55, 0.25)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="w-full py-4 bg-[#f05537] text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all disabled:bg-slate-300 disabled:shadow-none mt-4"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin opacity-70" />
                  ) : (
                    <>
                      <span>Masuk Sekarang</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>

              {/* Footer Links */}
              <div className="mt-8 pt-6 border-t border-slate-100/50 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  Belum punya akun?{" "}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/register");
                    }}
                    className="text-[#f05537] font-black hover:underline ml-1"
                  >
                    Daftar Sekarang
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/** --- Internal Input Component --- **/
const InputField = ({ label, icon, rightElement, ...props }: any) => (
  <div className="group">
    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1 transition-colors group-focus-within:text-[#f05537]">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f05537] transition-all">
        {icon}
      </div>
      <input
        {...props}
        className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-[#f05537]/30 transition-all font-semibold text-sm placeholder:text-slate-300"
      />
      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  </div>
);

export default LoginModal;
