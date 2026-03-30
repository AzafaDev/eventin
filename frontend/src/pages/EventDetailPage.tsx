import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  Info,
  ShieldCheck,
  Share2,
  Heart,
  ChevronLeft,
  Ticket,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { useEventStore } from "../stores/useEventStore";
import { useParams, useNavigate, Link } from "react-router-dom";

// --- UTILS ---
const formatIDR = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(price)
    .replace("Rp", "IDR ");
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const EventDetailPage = () => {
  const { isLoading, currentEvent, getEventById } = useEventStore();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getEventById(id!);
    window.scrollTo(0, 0); // Pastikan mulai dari atas saat ganti event
  }, [id]);

  const reviews = [
    {
      id: 1,
      user: "Budi Santoso",
      rating: 5,
      comment: "Gokil banget eventnya! Sound system juara.",
      date: "2026-03-20",
    },
    {
      id: 2,
      user: "Siti Aminah",
      rating: 4,
      comment: "Keren, tapi antrian masuknya agak panjang.",
      date: "2026-03-22",
    },
  ];

  const userMock = { points: 10000, hasReferralVoucher: true };

  if (isLoading || !currentEvent) return <DetailSkeleton />;

  return (
    <div className="bg-white min-h-screen pb-24 md:pb-12 overflow-x-hidden">
      {/* 1. HERO SECTION & HEADER INTEGRATION */}
      {/* z-0 agar berada di bawah Navbar (z-100) */}
      <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden z-0 bg-slate-900">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          src={currentEvent.image}
          className="w-full h-full object-cover opacity-60 md:opacity-80"
        />

        {/* Top Gradient Overlay: Agar Navbar tetap terbaca jelas */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent h-1/3" />

        {/* Bottom Gradient Overlay: Smooth transition ke konten */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />

        {/* Breadcrumbs & Navigation - Menggunakan pt-32 agar pas di bawah Navbar */}
        <div className="absolute top-0 left-0 w-full pt-32 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest mb-6"
            >
              <Link to="/" className="hover:text-[#f05537] transition-colors">
                Home
              </Link>
              <ChevronRight size={12} />
              <Link
                to="/events"
                className="hover:text-[#f05537] transition-colors"
              >
                Events
              </Link>
              <ChevronRight size={12} />
              <span className="text-white truncate max-w-[150px] md:max-w-none">
                {currentEvent.title}
              </span>
            </motion.div>

            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 p-2 pr-6 bg-white/10 backdrop-blur-xl rounded-2xl text-white hover:bg-[#f05537] transition-all border border-white/10"
            >
              <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30">
                <ChevronLeft size={20} />
              </div>
              <span className="text-sm font-bold">Kembali</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 md:-mt-48 relative z-10 flex flex-col lg:flex-row gap-8">
        {/* LEFT COLUMN: INFORMATION */}
        <div className="flex-[2] space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-50"
          >
            {/* Badge Status */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-5 py-2 bg-orange-50 text-[#f05537] rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100">
                {currentEvent.category}
              </span>
              <span
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${currentEvent.price === 0 ? "bg-green-50 text-green-600 border-green-100" : "bg-slate-50 text-slate-600 border-slate-100"}`}
              >
                {currentEvent.price === 0 ? "Free Access" : "Paid Event"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-10">
              {currentEvent.title}
            </h1>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-slate-50">
              <InfoBox
                icon={<Calendar size={20} />}
                label="Tanggal"
                value={formatDate(currentEvent.date)}
              />
              <InfoBox
                icon={<Clock size={20} />}
                label="Waktu"
                value={`${currentEvent.time} WIB`}
              />
              <InfoBox
                icon={<MapPin size={20} />}
                label="Lokasi"
                value={currentEvent.location}
              />
              <InfoBox
                icon={<Users size={20} />}
                label="Tersedia"
                value={`${currentEvent.availableSeats} Kursi`}
              />
            </div>

            {/* Description */}
            <div className="mt-12">
              <h3 className="text-2xl font-black text-slate-900 mb-6">
                Tentang Event
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed text-lg">
                {currentEvent.description ||
                  "Tidak ada deskripsi untuk event ini."}
              </p>
            </div>
          </motion.div>

          {/* Review Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <MessageCircle className="text-[#f05537]" /> Review Pengunjung
              </h3>
              <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
                <Star className="text-yellow-400 fill-yellow-400" size={20} />
                <span className="font-black text-slate-900 text-lg">4.8</span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider ml-1">
                  Rating
                </span>
              </div>
            </div>

            {reviews.length > 0 ? (
              <div className="grid gap-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-[#f05537]">
                          {rev.user[0]}
                        </div>
                        <h4 className="font-bold text-slate-900">{rev.user}</h4>
                      </div>
                      <div className="flex gap-0.5 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < rev.rating ? "currentColor" : "none"}
                            className={i < rev.rating ? "" : "text-slate-200"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-300 font-black uppercase tracking-[0.2em] text-sm">
                Belum ada review
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: STICKY CHECKOUT */}
        <aside className="flex-1 lg:max-w-sm">
          <div className="sticky top-28 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/90 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
            >
              <div className="mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                  Checkout
                </p>
                <div className="flex flex-col">
                  <span
                    className={`text-4xl font-black ${currentEvent.price === 0 ? "text-green-500" : "text-slate-900"}`}
                  >
                    {currentEvent.price === 0
                      ? "GRATIS"
                      : formatIDR(currentEvent.price)}
                  </span>
                  {currentEvent.originalPrice > currentEvent.price && (
                    <span className="text-slate-300 line-through font-bold text-sm mt-1">
                      {formatIDR(currentEvent.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Feature 2: Points & Promo Area */}
              <div className="space-y-3 mb-8">
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex items-start gap-4">
                  <div className="bg-white p-2 rounded-xl text-[#f05537] shadow-sm">
                    <Ticket size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[#f05537] uppercase tracking-wider">
                      Promo Referral
                    </p>
                    <p className="text-[11px] font-bold text-slate-700">
                      Potongan 10% Siap Digunakan
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                  <div className="bg-white p-2 rounded-xl text-slate-400 shadow-sm">
                    <Info size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Point Reward
                    </p>
                    <p className="text-[11px] font-bold text-slate-700">
                      Tersedia {formatIDR(userMock.points)} poin
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#0f172a" }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#f05537] text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-3"
              >
                {currentEvent.price === 0 ? "Daftar Sekarang" : "Beli Tiket"}
              </motion.button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-green-500" /> Secure
                Payment
              </div>
            </motion.div>

            {/* Organizer Card */}
            <div className="p-6 bg-slate-900 rounded-[2rem] text-white flex items-center gap-4 border border-slate-800">
              <div className="w-12 h-12 bg-[#f05537] rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                {currentEvent.organizer?.[0] || "A"}
              </div>
              <div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
                  Verified Promotor
                </p>
                <p className="text-sm font-bold truncate max-w-[150px]">
                  {currentEvent.organizer || "Azafa Promoters"}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const InfoBox = ({ icon, label, value }: any) => (
  <div className="flex flex-col gap-3">
    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#f05537] border border-slate-100">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
        {label}
      </p>
      <p className="text-[11px] md:text-xs font-bold text-slate-900 leading-tight">
        {value}
      </p>
    </div>
  </div>
);

const DetailSkeleton = () => (
  <div className="animate-pulse bg-white min-h-screen pt-32">
    <div className="max-w-7xl mx-auto px-4">
      <div className="h-10 bg-slate-100 rounded-xl w-48 mb-12" />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-[2] space-y-8">
          <div className="h-[500px] bg-slate-50 rounded-[2.5rem]" />
          <div className="h-[300px] bg-slate-50 rounded-[2.5rem]" />
        </div>
        <div className="flex-1 h-[400px] bg-slate-50 rounded-[2.5rem]" />
      </div>
    </div>
  </div>
);

export default EventDetailPage;
