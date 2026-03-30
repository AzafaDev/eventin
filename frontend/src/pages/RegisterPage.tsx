import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Ticket,
  User,
  ArrowRight,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

import { RegisterSchema } from "../schemas/auth";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "../stores/useAuthStore";
import LoadingOverlay from "../components/LoadingOverlay";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const { setUser, setIsLoading, isLoading } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      referrerCode: "",
      role: "customer",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.post("/auth/register", values);
        setUser(response.data.data);
        navigate("/verify-email");
        toast.success(`Selamat datang, ${response.data.data.fullName}!`);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Pendaftaran gagal");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex selection:bg-orange-100 font-sans bg-white">
      {isLoading && <LoadingOverlay />}

      {/* --- LEFT SIDE: BRANDING & ART --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#f05537] overflow-hidden items-center justify-center p-12">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-black rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-white max-w-md"
        >
          <div className="bg-white/20 backdrop-blur-md p-3 w-fit rounded-2xl mb-8 border border-white/30 shadow-xl">
            <Ticket className="w-10 h-10 rotate-12" />
          </div>
          <h1 className="text-5xl font-black mb-6 leading-[1.1] tracking-tight">
            Akses <span className="text-black/20 italic">10.000+</span> <br />
            Event Spektakuler.
          </h1>
          <p className="text-xl text-white/80 font-light mb-10 leading-relaxed">
            Dapatkan tiket konser, workshop, dan festival favoritmu lebih cepat
            dengan Eventin.
          </p>

          <div className="space-y-4">
            {[
              "Tiket Eksklusif",
              "Promo Referral 10%",
              "Dashboard Organizer",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-white/10 w-fit px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span className="text-sm font-bold">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Floating Decorative Element */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 opacity-30"
        >
          <Calendar size={200} className="text-white" />
        </motion.div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 pt-32 lg:pt-20 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">
              Ayo <span className="text-[#f05537]">Bergabung!</span>
            </h2>
            <p className="text-slate-500 font-medium">
              Buat akun Eventin-mu untuk mulai mencari dan membuat pengalaman
              spektakuler.
            </p>
          </div>

          <form className="space-y-5" onSubmit={formik.handleSubmit}>
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <RoleCard
                active={formik.values.role === "customer"}
                onClick={() => formik.setFieldValue("role", "customer")}
                icon={<User />}
                label="Customer"
              />
              <RoleCard
                active={formik.values.role === "organizer"}
                onClick={() => formik.setFieldValue("role", "organizer")}
                icon={<Ticket />}
                label="Organizer"
              />
            </div>

            <FormInputField
              name="fullName"
              label="Nama Lengkap"
              placeholder="Masukkan nama sesuai ID"
              icon={<User size={18} />}
              formik={formik}
            />

            <FormInputField
              name="email"
              label="Alamat Email"
              type="email"
              placeholder="anda@email.com"
              icon={<Mail size={18} />}
              formik={formik}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInputField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                icon={<Lock size={18} />}
                formik={formik}
                onToggleVisibility={() => setShowPassword(!showPassword)}
                isPasswordVisible={showPassword}
                hasToggle
              />
              <FormInputField
                name="confirmPassword"
                label="Konfirmasi"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={18} />}
                formik={formik}
              />
            </div>

            {/* Referral Toggle UI */}
            <div className="py-2">
              <button
                type="button"
                onClick={() => setShowReferral(!showReferral)}
                className="text-xs font-bold text-slate-400 hover:text-[#f05537] flex items-center gap-1 transition-colors"
              >
                {showReferral ? "Batal gunakan kode?" : "Punya kode referral?"}
                <ChevronRight
                  className={`w-3 h-3 transition-transform ${showReferral ? "rotate-90" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showReferral && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3">
                      <FormInputField
                        name="referrerCode"
                        placeholder="KODE123"
                        formik={formik}
                        className="font-black text-[#f05537] uppercase tracking-[0.2em]"
                      />
                      <p className="text-[10px] text-slate-400 mt-1 italic">
                        Masukkan kode dari teman untuk dapat diskon 10%!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(240, 85, 55, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full py-4.5 bg-[#f05537] text-white font-black uppercase tracking-[0.15em] rounded-2xl shadow-xl shadow-[#f05537]/20 flex items-center justify-center gap-3 disabled:bg-slate-300"
            >
              {formik.isSubmitting ? "Mendaftarkan..." : "Buat Akun Sekarang"}
              <ArrowRight size={20} />
            </motion.button>
          </form>

          <p className="text-center text-[10px] text-slate-400 mt-8 leading-relaxed">
            Dengan mendaftar, Anda menyetujui{" "}
            <span className="underline">Syarat & Ketentuan</span> serta{" "}
            <span className="underline">Kebijakan Privasi</span> Eventin.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// --- Helpers tetap menggunakan gaya premium ---
const FormInputField = ({
  label,
  name,
  formik,
  icon,
  hasToggle,
  onToggleVisibility,
  isPasswordVisible,
  className,
  ...props
}: any) => {
  const isInvalid = formik.touched[name] && formik.errors[name];
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isInvalid ? "text-red-400" : "text-slate-400 group-focus-within:text-[#f05537]"}`}
        >
          {icon}
        </div>
        <input
          {...formik.getFieldProps(name)}
          {...props}
          className={`w-full pl-11 pr-11 py-3.5 bg-slate-50 border rounded-2xl transition-all outline-none font-semibold text-sm ${
            isInvalid
              ? "border-red-200 bg-red-50 text-red-900"
              : "border-slate-100 focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-[#f05537]/30"
          } ${className}`}
        />
        {hasToggle && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#f05537]"
          >
            {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {isInvalid && (
        <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
          <AlertCircle size={10} /> {formik.errors[name]}
        </p>
      )}
    </div>
  );
};

const RoleCard = ({ active, onClick, icon, label }: any) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 flex-1 ${
      active
        ? "border-[#f05537] bg-orange-50 shadow-md shadow-[#f05537]/10"
        : "border-slate-100 bg-white hover:border-orange-100"
    }`}
  >
    <div
      className={`p-2 rounded-xl ${active ? "bg-[#f05537] text-white" : "bg-slate-100 text-slate-400"}`}
    >
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <span
      className={`text-[10px] font-black uppercase tracking-widest ${active ? "text-[#f05537]" : "text-slate-500"}`}
    >
      {label}
    </span>
  </div>
);

export default RegisterPage;
