import { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Ticket,
  X,
} from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setIsOpen, user, logout } = useAuthStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isAuthPage = pathname === "/register" || pathname === "/verify-email";
  const firstName = useMemo(
    () => user?.fullName?.split(" ")[0] || "User",
    [user],
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) console.log("Debounced Search Query:", searchQuery);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    closeMenu();
    navigate("/");
  };

  // Dynamic Styles berdasarkan scroll
  const navTextClass =
    isScrolled || isMenuOpen ? "text-slate-900" : "text-white";
  const searchBgClass =
    isScrolled || isMenuOpen
      ? "bg-slate-100"
      : "bg-white/10 backdrop-blur-md border-white/20";
  const navBgClass =
    isScrolled || isMenuOpen
      ? "bg-white/90 backdrop-blur-lg shadow-lg border-b border-slate-200/50 py-3"
      : "bg-transparent py-5";

  if (isAuthPage)
    return (
      <nav className="fixed w-full z-[100] bg-white border-b border-slate-100 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-[#f05537] p-2 rounded-xl shadow-lg shadow-[#f05537]/20">
              <Calendar className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">
              Event<span className="text-[#f05537]">in</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 hidden sm:inline">
              Sudah punya akun?
            </span>
            <button
              onClick={() => setIsOpen(true)}
              className="text-sm font-bold text-[#f05537] hover:underline"
            >
              Log In
            </button>
          </div>
        </div>
      </nav>
    );
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed w-full z-[100] transition-all duration-500 ease-in-out ${navBgClass}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* LEFT: Brand & Search */}
          <div className="flex items-center flex-1">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-2 group shrink-0"
            >
              <div className="bg-[#f05537] p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-[#f05537]/20">
                <Calendar className="text-white w-5 h-5" />
              </div>
              <span
                className={`text-2xl font-black tracking-tighter uppercase transition-colors duration-500 ${navTextClass}`}
              >
                Event<span className="text-[#f05537]">in</span>
              </span>
            </Link>

            {/* Premium Desktop Search Bar */}
            <div className="hidden lg:flex ml-10 flex-1 max-w-sm relative group">
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isScrolled ? "text-slate-400" : "text-white/60"} group-focus-within:text-[#f05537]`}
              />
              <input
                type="text"
                placeholder="Cari event seru..."
                className={`w-full pl-11 pr-4 py-2.5 rounded-full text-sm transition-all border duration-300
    focus:outline-none focus:ring-4 focus:ring-[#f05537]/10 
    ${
      isScrolled
        ? "bg-slate-100 border-transparent focus:bg-white focus:border-[#f05537]/30 text-slate-800"
        : "bg-white/10 backdrop-blur-md border-white/20 focus:bg-white/20 focus:border-white/40 text-white placeholder:text-white/50"
    }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* RIGHT: Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/events"
              className={`text-sm font-bold transition-colors hover:text-[#f05537] ${navTextClass}`}
            >
              Explore
            </Link>

            <div
              className={`w-px h-6 transition-colors duration-500 ${isScrolled ? "bg-slate-200" : "bg-white/20"}`}
            />

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to={user.role === "organizer" ? "/dashboard" : "/orders"}
                  className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all group ${isScrolled ? "hover:bg-orange-50" : "hover:bg-white/10"}`}
                >
                  <div
                    className={`p-2 rounded-full transition-colors shadow-sm ${isScrolled ? "bg-slate-100 group-hover:bg-white" : "bg-white/20 group-hover:bg-white/40"}`}
                  >
                    {user.role === "organizer" ? (
                      <LayoutDashboard size={16} className={navTextClass} />
                    ) : (
                      <Ticket size={16} className={navTextClass} />
                    )}
                  </div>
                  <span className={`text-sm font-bold ${navTextClass}`}>
                    Hi, {firstName}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsOpen(true)}
                  className={`text-sm font-bold transition-colors hover:text-[#f05537] ${navTextClass}`}
                >
                  Log In
                </button>
                {!isAuthPage && (
                  <Link
                    to="/register"
                    className="bg-[#f05537] text-white px-7 py-2.5 rounded-full text-sm font-extrabold hover:bg-[#d43d21] hover:scale-105 hover:shadow-[0_10px_20px_rgba(240,85,55,0.4)] active:scale-95 transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* MOBILE: Toggle Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-xl transition-all ${isMenuOpen ? "bg-orange-50 text-[#f05537]" : navTextClass}`}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE: Dropdown Overlay dengan AnimatePresence */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-2xl border-b border-slate-100 shadow-2xl"
          >
            <MobileMenuContent
              user={user}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onClose={closeMenu}
              onLogout={handleLogout}
              onLogin={() => {
                setIsOpen(true);
                closeMenu();
              }}
              isAuthPage={isAuthPage}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Sub-komponen tetap dipisahkan agar rapi
const MobileMenuContent = ({
  user,
  searchQuery,
  setSearchQuery,
  onClose,
  onLogout,
  onLogin,
  isAuthPage,
}: any) => (
  <div className="p-6 space-y-6">
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Cari event..."
        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f05537]/20"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>

    {user && (
      <div className="flex items-center gap-4 p-5 bg-orange-50 rounded-2xl border border-orange-100">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#f05537] shadow-sm font-bold">
          {user.fullName[0]}
        </div>
        <div>
          <p className="font-black text-slate-900 leading-none mb-1">
            {user.fullName}
          </p>
          <p className="text-[10px] font-bold text-[#f05537] uppercase tracking-widest">
            {user.role}
          </p>
        </div>
      </div>
    )}

    <nav className="space-y-1">
      <Link
        to="/events"
        onClick={onClose}
        className="flex items-center justify-between p-4 hover:bg-orange-50 rounded-2xl transition-all group"
      >
        <div className="flex items-center gap-4 text-slate-800 font-bold group-hover:text-[#f05537]">
          <Globe size={20} /> Explore Events
        </div>
      </Link>
      {user && (
        <Link
          to={user.role === "organizer" ? "/dashboard" : "/orders"}
          onClick={onClose}
          className="flex items-center justify-between p-4 hover:bg-orange-50 rounded-2xl transition-all group"
        >
          <div className="flex items-center gap-4 text-slate-800 font-bold group-hover:text-[#f05537]">
            {user.role === "organizer" ? (
              <LayoutDashboard size={20} />
            ) : (
              <Ticket size={20} />
            )}
            {user.role === "organizer" ? "Organizer Dashboard" : "My Tickets"}
          </div>
        </Link>
      )}
    </nav>

    <div className="flex flex-col gap-3 pt-2">
      {user ? (
        <button
          onClick={onLogout}
          className="w-full py-4 rounded-2xl font-bold text-red-600 bg-red-50 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <LogOut size={18} /> Sign Out
        </button>
      ) : (
        <>
          <button
            onClick={onLogin}
            className="w-full py-4 rounded-2xl font-bold text-slate-700 bg-slate-100 transition-all active:scale-95"
          >
            Log In
          </button>
          {!isAuthPage && (
            <Link
              to="/register"
              onClick={onClose}
              className="w-full py-4 rounded-2xl font-bold text-white bg-[#f05537] text-center shadow-lg shadow-orange-100 transition-all active:scale-95"
            >
              Create Account
            </Link>
          )}
        </>
      )}
    </div>
  </div>
);

export default Navbar;
