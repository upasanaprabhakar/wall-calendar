import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const CustomDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedLabel = options.find(opt => opt.value === value)?.label;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 rounded-xl bg-white/50 border border-white/40 text-sm text-[#4A5D53] cursor-pointer flex justify-between items-center backdrop-blur-md hover:bg-white/60 transition-all duration-300"
      >
        <span>{selectedLabel}</span>

        {/* Updated Arrow */}
        <div className="ml-2 flex items-center">
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#4A5D53]/60 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 w-full rounded-xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg z-50 overflow-hidden"
          >
            {options.map(opt => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer transition-all duration-200
                  ${value === opt.value ? 'bg-[#8A9A5B]/20 text-[#1A2F24]' : 'text-[#4A5D53]'}
                  hover:bg-[#8A9A5B]/20`}
              >
                {opt.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;