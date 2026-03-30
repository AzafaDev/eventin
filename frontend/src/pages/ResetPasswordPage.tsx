import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  LinkIcon,
  Loader2,
  Lock,
  ShieldAlert,
  LayoutDashboard,
} from "lucide-react";

import { useAuthStore } from "../stores/useAuthStore";
import { resetPasswordSchema } from "../schemas/auth";

// --- Types ---
type PageStatus = "checking" | "valid" | "invalid" | "success";

/**
 * ResetPasswordPage
 * Refactored for modularity, Glassmorphism design, and improved UX.
 */
const ResetPasswordPage: React.FC = () => {
  const { token } = useParams();
  const { validateTokenResetPassword, resetPassword, isLoading, setIsOpen } =
    useAuthStore();
  const [pageStatus, setPageStatus] = useState<PageStatus>("checking");

  // --- Initial Token Verification ---
  useEffect(() => {
    const verifyToken = async () => {
      try {
        await validateTokenResetPassword(token as string);
        setPageStatus("valid");
      } catch (error: any) {
        setPageStatus("invalid");
        toast.error(error.message || "Token tidak valid");
      }
    };
    verifyToken();
  }, [token, validateTokenResetPassword]);

  // --- Submit Handler ---
  const handleResetSubmit = async (password: string) => {
    try {
      await resetPassword(password, token as string);
      setPageStatus("success");
    } catch (error: any) {
      toast.error(error.message || "Gagal memperbarui password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-[100px] pb-12 px-4 selection:bg-orange-100 relative overflow-hidden font-sans">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-100/40 via-slate-50 to-slate-100 pointer-events-none" />

      <div
        className={`relative w-full max-w-[480px] bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(15,23,42,0.1)] border border-white p-8 sm:p-12 z-10 transition-all duration-700
        ${pageStatus === "invalid" ? "animate-shake border-red-100" : "animate-in fade-in zoom-in slide-in-from-bottom-8"}`}
      >
        {pageStatus === "checking" && <LoadingState />}
        {pageStatus === "invalid" && (
          <InvalidTokenState onOpenRequest={() => setIsOpen(true)} />
        )}
        {pageStatus === "valid" && (
          <ResetForm onSubmit={handleResetSubmit} isLoading={isLoading} />
        )}
        {pageStatus === "success" && (
          <SuccessState onLogin={() => setIsOpen(true)} />
        )}
      </div>

      <div className="fixed bottom-8 text-center w-full pointer-events-none opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">
          Secure Reset • Eventin
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-10px); }
          80% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

// --- Sub-Components (Ditempatkan di luar agar stabil) ---

const LoadingState = () => (
  <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
    <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
      Memvalidasi Link...
    </p>
  </div>
);

const InvalidTokenState = ({
  onOpenRequest,
}: {
  onOpenRequest: () => void;
}) => (
  <div className="text-center animate-in fade-in slide-in-from-top-4 duration-700">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 text-red-500 rounded-3xl mb-8 shadow-inner relative group transition-transform hover:scale-110">
      <LinkIcon size={36} className="-rotate-45" />
      <ShieldAlert size={20} className="absolute -top-2 -right-2 fill-white" />
    </div>
    <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic mb-4">
      Link Kadaluwarsa
    </h1>
    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-10 px-4">
      Link pemulihan ini sudah tidak berlaku atau sudah digunakan. Silakan
      ajukan permintaan reset baru.
    </p>
    <div className="space-y-4">
      <button
        onClick={onOpenRequest}
        className="w-full py-4.5 bg-orange-600 text-white font-black uppercase tracking-widest rounded-2xl text-[11px] hover:bg-slate-900 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-2"
      >
        Minta Link Baru
      </button>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-600 transition-colors py-2"
      >
        <ArrowLeft size={14} /> Kembali ke Login
      </Link>
    </div>
  </div>
);

/**
 * InputField dipisah ke luar agar tidak kehilangan focus saat mengetik
 */
interface InputFieldProps {
  label: string;
  name: string;
  show: boolean;
  setShow: (val: boolean) => void;
  placeholder: string;
  formik: any;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  show,
  setShow,
  placeholder,
  formik,
}) => {
  const hasError = formik.touched[name] && formik.errors[name];

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
        {label}
      </label>
      <div className="relative group">
        <Lock
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
            hasError
              ? "text-red-400"
              : "text-slate-400 group-focus-within:text-orange-500"
          }`}
        />
        <input
          type={show ? "text" : "password"}
          {...formik.getFieldProps(name)}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-4 bg-slate-50/50 border ${
            hasError
              ? "border-red-200 bg-red-50/30"
              : "border-slate-100 group-hover:border-slate-200"
          } rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-200 focus:bg-white transition-all duration-300`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {hasError && (
        <p className="text-[9px] text-red-500 font-bold ml-1 tracking-wider uppercase italic">
          {formik.errors[name]}
        </p>
      )}
    </div>
  );
};

const ResetForm = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: (p: string) => void;
  isLoading: boolean;
}) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: { password: "", confirmPassword: "" },
    validationSchema: resetPasswordSchema,
    onSubmit: (values) => onSubmit(values.password),
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Lock size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
          Reset Password
        </h1>
        <p className="text-xs text-slate-400 font-medium mt-2">
          Amankan kembali akun Eventin Anda.
        </p>
      </div>

      <InputField
        label="Password Baru"
        name="password"
        show={showPass}
        setShow={setShowPass}
        placeholder="Minimal 8 karakter"
        formik={formik}
      />

      <InputField
        label="Konfirmasi Password"
        name="confirmPassword"
        show={showConfirm}
        setShow={setShowConfirm}
        placeholder="Ulangi password"
        formik={formik}
      />

      <button
        type="submit"
        disabled={isLoading || !formik.isValid}
        className="w-full py-4.5 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl text-[11px] hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          "Perbarui Password"
        )}
      </button>
    </form>
  );
};

const SuccessState = ({ onLogin }: { onLogin: () => void }) => (
  <div className="text-center py-4 animate-in zoom-in slide-in-from-bottom-4 duration-700">
    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
      <CheckCircle2 size={40} />
    </div>
    <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic mb-3">
      Password Diperbarui!
    </h2>
    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-10 px-4">
      Selesai! Akun Anda sudah aman kembali. Silakan login menggunakan password
      baru Anda.
    </p>
    <button
      onClick={onLogin}
      className="w-full py-4.5 bg-orange-600 text-white font-black uppercase tracking-widest rounded-2xl text-[11px] hover:bg-slate-900 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3"
    >
      <LayoutDashboard size={16} />
      Kembali ke Login
    </button>
  </div>
);

export default ResetPasswordPage;
