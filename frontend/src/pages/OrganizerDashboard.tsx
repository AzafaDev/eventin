import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  Users,
  TrendingUp,
  Plus,
  MoreHorizontal,
  Calendar,
  ArrowUpRight,
  Edit3,
  Trash2,
  Eye,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- DUMMY DATA ---
const STATS = [
  {
    label: "Total Events",
    value: "12",
    icon: <Calendar size={20} />,
    trend: "+2",
  },
  {
    label: "Tickets Sold",
    value: "1,240",
    icon: <Ticket size={20} />,
    trend: "+12%",
  },
  {
    label: "Revenue (IDR)",
    value: "45.2M",
    icon: <TrendingUp size={20} />,
    trend: "+8.4%",
  },
  {
    label: "Active Referral",
    value: "84",
    icon: <Users size={20} />,
    trend: "+15",
  },
];

const GRAPH_DATA = {
  Daily: [
    { name: "Mon", sales: 400 },
    { name: "Tue", sales: 300 },
    { name: "Wed", sales: 600 },
    { name: "Thu", sales: 800 },
    { name: "Fri", sales: 700 },
    { name: "Sat", sales: 900 },
    { name: "Sun", sales: 1100 },
  ],
  Monthly: [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 2780 },
    { name: "May", sales: 1890 },
    { name: "Jun", sales: 2390 },
  ],
  Yearly: [
    { name: "2024", sales: 45000 },
    { name: "2025", sales: 52000 },
    { name: "2026", sales: 68000 },
  ],
};

const DUMMY_EVENTS = [
  {
    id: "1",
    title: "Event Spektakuler Ke-1",
    price: 0,
    date: "2026-04-30",
    location: "Jakarta",
    availableSeats: 50,
    category: "Music",
    status: "Published",
    image:
      "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F928717573%2F92877393397%2F1%2Foriginal.20250106-171926?crop=focalpoint&fit=crop&h=230&w=460&auto=format%2Ccompress&q=75&sharp=10&fp-x=5e-07&fp-y=5e-07&s=26fb9b3e1b8f3416a1e2c2337e6a3e37",
  },
  {
    id: "2",
    title: "Tech Conference 2026",
    price: 150000,
    date: "2026-05-15",
    location: "Bandung",
    availableSeats: 200,
    category: "Education",
    status: "Draft",
    image:
      "https://images.unsplash.com/photo-1540575861501-7c0351a77039?auto=format&fit=crop&w=460&h=230",
  },
];

const OrganizerDashboard = () => {
  const [range, setRange] = useState<"Daily" | "Monthly" | "Yearly">("Monthly");

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-20">
      {/* --- SOLUSI NABRAK: DARK HEADER SECTION --- 
          pt-32 memastikan konten tidak tertutup Navbar. 
          bg-slate-900 memberikan kontras sempurna untuk teks putih Navbar kamu.
      */}
      <div className="bg-slate-900 pt-32 pb-48 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Dekorasi Oranye khas Eventin agar tidak terlalu sepi */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f05537]/10 blur-[100px] rounded-full -mr-32 -mt-32" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-[#f05537]/20 text-[#f05537] text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-[#f05537]/30">
                  Organizer Panel
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                Organizer <span className="text-[#f05537]">Dashboard</span>
              </h1>
              <p className="text-slate-400 mt-2 font-medium md:text-lg">
                Manage your events and track performance at a glance.
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 bg-[#f05537] text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-orange-500/30 hover:bg-white hover:text-slate-900 transition-all text-sm uppercase tracking-wider self-start md:self-center"
            >
              <Plus size={22} strokeWidth={3} />
              <span>Create Event</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* --- CONTENT SECTION: FLOATING OVER DARK HEADER --- 
          -mt-24 membuat konten "naik" sedikit ke area gelap agar terlihat modern.
      */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        {/* --- STATS CARDS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-7 rounded-[2.5rem] border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-xl transition-all group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3.5 bg-slate-50 rounded-2xl text-[#f05537] group-hover:bg-[#f05537] group-hover:text-white transition-colors">
                  {stat.icon}
                </div>
                <span className="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <ArrowUpRight size={12} /> {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h3 className="text-3xl font-black text-slate-900">
                  {stat.value}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- ANALYTICS SECTION --- */}
        <div className="bg-white p-6 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Sales Analytics
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">
                Ticket Revenue Trend
              </p>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl self-start">
              {["Daily", "Monthly", "Yearly"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r as any)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${
                    range === r
                      ? "bg-white text-[#f05537] shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GRAPH_DATA[range]}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f05537" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f05537" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "24px",
                    border: "none",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    padding: "16px",
                  }}
                  itemStyle={{ color: "#f05537", fontWeight: 900 }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#f05537"
                  strokeWidth={5}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- EVENT LIST --- */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Active Events
            </h3>
            <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
              <MoreHorizontal size={20} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Event Detail
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Pricing
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Capacity
                  </th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {DUMMY_EVENTS.map((event) => (
                  <tr
                    key={event.id}
                    className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <img
                          src={event.image}
                          alt=""
                          className="w-16 h-16 rounded-[1.25rem] object-cover shadow-sm group-hover:scale-110 transition-transform duration-300"
                        />
                        <div>
                          <p className="font-black text-slate-900 text-lg leading-tight">
                            {event.title}
                          </p>
                          <p className="text-[10px] text-[#f05537] font-black mt-1 uppercase tracking-widest">
                            {event.category} • {event.date}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-sm font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                        {event.price === 0
                          ? "FREE"
                          : `IDR ${event.price.toLocaleString()}`}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                          {event.availableSeats} Left
                        </span>
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#f05537] w-[60%]" />
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center justify-end gap-3">
                        <ActionButton
                          icon={<Eye size={18} />}
                          color="hover:text-blue-600"
                        />
                        <ActionButton
                          icon={<Edit3 size={18} />}
                          color="hover:text-orange-600"
                        />
                        <ActionButton
                          icon={<Trash2 size={18} />}
                          color="hover:text-red-600"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({
  icon,
  color,
}: {
  icon: React.ReactNode;
  color: string;
}) => (
  <button
    className={`p-3 rounded-2xl bg-slate-50 text-slate-400 transition-all ${color} hover:bg-white hover:shadow-xl`}
  >
    {icon}
  </button>
);

export default OrganizerDashboard;
