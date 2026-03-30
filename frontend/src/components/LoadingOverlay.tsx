import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";

/**
 * LoadingOverlay Component
 * Memberikan feedback visual premium saat proses async (login/register) berjalan.
 * Menggunakan Glassmorphism dan Custom Spinner Tailwind.
 */
const LoadingOverlay = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
      >
        {/* Central Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white/90 backdrop-blur-lg w-full max-w-sm rounded-[2.5rem] p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/20 flex flex-col items-center text-center"
        >
          {/* Custom Spinner Container */}
          <div className="relative mb-8">
            {/* Outer Static Ring */}
            <div className="w-20 h-20 rounded-full border-[6px] border-slate-100"></div>

            {/* Inner Rotating Spinner */}
            <div
              className="absolute top-0 left-0 w-20 h-20 rounded-full border-[6px] border-transparent border-t-[#f05537] animate-spin"
              style={{ animationDuration: "0.8s" }}
            ></div>

            {/* Center Icon Decoration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#f05537] rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Typography */}
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Memproses...
          </h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed px-4">
            Mohon tunggu sebentar, kami sedang menyiapkan pengalaman spektakuler
            Anda.
          </p>

          {/* Minimalist Brand Logo */}
          <div className="mt-10 flex items-center gap-2 opacity-30 grayscale">
            <Calendar size={14} className="text-slate-900" />
            <span className="text-xs font-black tracking-tighter uppercase text-slate-900">
              Event<span className="text-[#f05537]">in</span>
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingOverlay;
