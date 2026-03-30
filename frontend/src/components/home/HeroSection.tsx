import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Tag, Loader2 } from "lucide-react";
import CustomDropdown from "./CustomDropdown";
import { useEventStore } from "../../stores/useEventStore";

const CATEGORIES = [
  "Semua Kategori",
  "Music",
  "Food",
  "Sports",
  "Education",
  "Nightlife",
];

const HeroSection = () => {
  const {
    category,
    setCategory,
    location,
    setLocation,
    searchQuery,
    getAllEvents,
    isLoadingDiscovery,
  } = useEventStore();

  const [localLocation, setLocalLocation] = useState(location);
  const [isTyping, setIsTyping] = useState(false);

  const { scrollY } = useScroll();
  // Transformasi yBg sedikit dikecilkan agar parallax tidak "pecah" saat scroll cepat
  const yBg = useTransform(scrollY, [0, 500], [0, 100]);

  useEffect(() => {
    if (localLocation === location) return;

    setIsTyping(true);
    const delayDebounceFn = setTimeout(() => {
      setLocation(localLocation);
      setIsTyping(false);

      getAllEvents({
        category: category === "Semua Kategori" ? "" : category,
        location: localLocation,
        searchQuery: searchQuery,
        page: "1",
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [localLocation]);

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    getAllEvents({
      category: val === "Semua Kategori" ? "" : val,
      location: localLocation,
      searchQuery: searchQuery,
      page: "1",
    });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gray-50">
      {/* --- OPTIMIZED BACKGROUND & PARALLAX --- */}
      <motion.div
        style={{ y: yBg }}
        className="absolute inset-0 z-0 scale-110 will-change-transform"
      >
        <img
          // High-DPI Support: 2560px width, Quality 100, auto format
          src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=100&w=2560&auto=format&fit=crop"
          alt="Hero Event Background"
          className="w-full h-full object-cover"
          loading="eager"
          // @ts-ignore - fetchpriority is a newer attribute
          fetchpriority="high"
        />

        {/* Multilayer Gradient: Top untuk Navbar kontras, Bottom untuk transisi section */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/70 via-black/20 to-gray-50" />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-32 pb-20 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-[1] drop-shadow-2xl">
            Eksplorasi Event <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f05537] via-[#ff8a75] to-[#f05537] animate-gradient-x">
              Terbaik
            </span>{" "}
            Hari Ini
          </h1>
          <p className="text-lg md:text-2xl text-white/90 max-w-2xl mx-auto mb-12 font-medium drop-shadow-lg">
            Cari lokasi atau pilih kategori untuk menemukan inspirasi baru
            secara instan.
          </p>
        </motion.div>

        {/* --- FILTER BAR --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="bg-white/95 backdrop-blur-2xl p-2 rounded-[2.5rem] shadow-[0_30px_100px_-15px_rgba(0,0,0,0.4)] border border-white/20 flex flex-col md:flex-row items-center gap-1">
            <div className="flex-1 w-full flex items-center px-6 py-4 rounded-3xl hover:bg-slate-50 transition-all group">
              <MapPin
                size={22}
                className={`${isTyping ? "text-orange-400" : "text-[#f05537]"} transition-colors`}
              />
              <div className="flex flex-col items-start ml-4 w-full">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">
                  Lokasi Event
                </span>
                <input
                  type="text"
                  placeholder="Ketik kota tujuan..."
                  className="bg-transparent border-none outline-none w-full text-base font-bold text-slate-900 placeholder:text-slate-300"
                  value={localLocation}
                  onChange={(e) => setLocalLocation(e.target.value)}
                />
              </div>
              {isTyping && (
                <Loader2
                  size={18}
                  className="animate-spin text-slate-300 ml-2"
                />
              )}
            </div>

            <div className="hidden md:block w-[1px] h-10 bg-slate-100 mx-2" />

            <div className="flex-1 w-full">
              <CustomDropdown
                label="Kategori"
                placeholder="Semua Kategori"
                value={category || "Semua Kategori"}
                options={CATEGORIES}
                onChange={handleCategoryChange}
                icon={<Tag size={20} className="text-[#f05537]" />}
              />
            </div>

            <div className="hidden md:flex items-center justify-center w-14 h-14 bg-slate-50 rounded-[1.5rem] ml-1">
              {isLoadingDiscovery ? (
                <Loader2 className="text-[#f05537] animate-spin" size={24} />
              ) : (
                <div className="w-2 h-2 rounded-full bg-[#f05537] animate-pulse" />
              )}
            </div>
          </div>

          {/* Trending Tags */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
            <span className="text-white/60 text-xs font-black uppercase tracking-widest">
              Trending:
            </span>
            {["Music", "Food", "Nightlife"].map((tag) => (
              <button
                key={tag}
                onClick={() => handleCategoryChange(tag)}
                className={`px-6 py-2.5 rounded-full text-xs font-black tracking-wide transition-all backdrop-blur-md border ${
                  category === tag
                    ? "bg-[#f05537] text-white border-[#f05537] shadow-lg shadow-orange-500/20"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/30"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes gradient-x { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .animate-gradient-x { background-size: 200% 200%; animation: gradient-x 5s ease infinite; }
      `}</style>
    </section>
  );
};

export default HeroSection;
