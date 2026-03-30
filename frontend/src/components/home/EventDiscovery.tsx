import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  SearchX,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useEventStore } from "../../stores/useEventStore";
import { Link } from "react-router-dom";

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

const EventCardSkeleton = () => (
  <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden flex flex-col h-full animate-pulse">
    <div className="aspect-video bg-slate-200" />
    <div className="p-8 space-y-4">
      <div className="h-6 bg-slate-200 rounded-lg w-3/4" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 rounded-md w-1/2" />
        <div className="h-4 bg-slate-100 rounded-md w-1/3" />
        <div className="h-4 bg-slate-100 rounded-md w-1/4" />
      </div>
      <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
        <div className="h-8 bg-slate-200 rounded-lg w-24" />
        <div className="h-12 w-12 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  </div>
);

const EventDiscovery = ({ data }: { data: any }) => {
  const { getAllEvents, searchQuery, category, location, isLoadingDiscovery } =
    useEventStore();

  // 1. Debugging: Pantau State dari Store & Status Loading
  console.group("🔍 [EventDiscovery - Store State]");
  console.log("Loading Status:", isLoadingDiscovery);
  console.log("Current Filters:", { category, location, searchQuery });
  console.groupEnd();

  // 2. Debugging: Pantau Data yang masuk dari Props (HomePage)
  console.group("📦 [EventDiscovery - Received Data]");
  console.log("Full Data Object:", data);
  console.groupEnd();

  if (isLoadingDiscovery) {
    console.log("⏳ [EventDiscovery] Render State: LOADING SKELETON");
    return (
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 animate-pulse">
            <div className="space-y-4">
              <div className="h-3 bg-slate-100 rounded w-24" />
              <div className="h-10 bg-slate-200 rounded-xl w-64" />
            </div>
            <div className="h-12 bg-slate-50 rounded-2xl w-48" />
          </div>

          {/* Grid Skeleton (Sesuai kolom laptop kamu yaitu 4) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[...Array(8)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // SESUAIKAN DESTRUCTURING DENGAN HOMEPAGE
  // Di HomePage kamu kirim: { currentEvents, currentPage, totalPages, totalEvents }
  const {
    currentEvents = [],
    currentPage = 1,
    totalPages = 1,
    totalEvents = 0,
  } = data;

  console.group("🎨 [EventDiscovery - Render Logic]");
  console.log("Events count:", currentEvents.length);
  console.log("Pagination:", { currentPage, totalPages, totalEvents });
  console.groupEnd();
  // Empty State: Jika array event kosong
  if (currentEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-50 p-12 rounded-[3.5rem] mb-8 text-slate-200"
        >
          <SearchX size={80} />
        </motion.div>
        <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
          Ups! Event Tidak Ditemukan
        </h3>
        <p className="text-slate-500 max-w-sm font-medium leading-relaxed px-4">
          Coba ganti kata kunci atau reset filter untuk menemukan event lainnya.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#f05537] font-black uppercase tracking-[0.2em] text-[10px]">
              <div className="w-8 h-[2px] bg-[#f05537]" />
              Event Terpopuler
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              Temukan{" "}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#f05537] to-orange-400">
                Inspirasi
              </span>{" "}
              Baru
            </h2>
          </div>
          <div className="px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-slate-500">
            Total <span className="text-slate-900">{totalEvents}</span> Event
            Spektakuler
          </div>
        </div>

        {/* Grid Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
        >
          {currentEvents.map((event: any, index: number) => (
            <Link to={`/${event.id}`} key={event.id || index}>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -10 }}
                className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full"
              >
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-5 left-5">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-[#f05537]">
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-[#f05537] transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-slate-500 text-xs font-semibold">
                      <Calendar size={16} className="text-[#f05537]" />{" "}
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-xs font-semibold">
                      <MapPin size={16} className="text-[#f05537]" />{" "}
                      {event.location}
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 text-xs font-semibold">
                      <Users size={16} className="text-[#f05537]" />{" "}
                      {event.availableSeats} Kursi
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase mb-1">
                        Mulai Dari
                      </span>
                      <span
                        className={`text-xl font-black ${event.price === 0 ? "text-green-500" : "text-slate-900"}`}
                      >
                        {event.price === 0 ? "GRATIS" : formatIDR(event.price)}
                      </span>
                    </div>
                    <button className="w-12 h-12 bg-slate-900 text-white rounded-2xl group-hover:bg-[#f05537] flex items-center justify-center transition-all shadow-lg">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Pagination Section */}
        <div className="mt-20 flex justify-center items-center gap-4">
          <button
            onClick={() => {
              console.log(
                "◀️ [Pagination] Fetching Previous Page:",
                currentPage - 1,
              );
              getAllEvents({
                category,
                location,
                searchQuery,
                page: (currentPage - 1).toString(),
              });
            }}
            disabled={currentPage === 1}
            className="p-4 bg-white border border-slate-100 rounded-2xl disabled:opacity-20 hover:text-[#f05537] transition-all"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${
                  currentPage === i + 1
                    ? "bg-[#f05537] text-white shadow-lg shadow-orange-200"
                    : "bg-white text-slate-400 border border-slate-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              console.log(
                "◀️ [Pagination] Fetching Previous Page:",
                currentPage - 1,
              );
              getAllEvents({
                category,
                location,
                searchQuery,
                page: (currentPage + 1).toString(),
              });
            }}
            className="p-4 bg-white border border-slate-100 rounded-2xl disabled:opacity-20 hover:text-[#f05537] transition-all"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventDiscovery;
