import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

interface Props {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (val: string) => void;
  icon: React.ReactNode;
}

const CustomDropdown = ({
  label,
  value,
  placeholder,
  options,
  onChange,
  icon,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Logic Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl transition-all duration-300 hover:bg-gray-50 
        ${isOpen ? "ring-2 ring-[#f05537]/20 bg-gray-50" : ""}`}
      >
        <div className="flex items-center overflow-hidden">
          <span
            className={`${isOpen || value ? "text-[#f05537]" : "text-gray-400"} mr-3 transition-colors`}
          >
            {icon}
          </span>
          <span
            className={`text-sm font-semibold truncate ${value ? "text-gray-800" : "text-gray-400"}`}
          >
            {value || placeholder}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={16} className="text-gray-400" />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute z-50 w-full mt-2 bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            <div className="p-2 max-h-60 overflow-y-auto">
              {/* Option: Default/Semua */}
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-500 rounded-xl hover:bg-orange-50 hover:text-[#f05537] transition-all"
              >
                Semua {placeholder}
                {!value && <Check size={14} />}
              </button>

              <div className="h-[1px] bg-gray-100 my-1" />

              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-orange-50 hover:text-[#f05537] transition-all"
                >
                  {opt}
                  {value === opt && (
                    <Check size={14} className="text-[#f05537]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
