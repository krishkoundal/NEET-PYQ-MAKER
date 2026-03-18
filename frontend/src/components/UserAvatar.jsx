import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const name = user.name || 'User';
  const email = user.email || 'Email';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload(); // Force reload to clear all states
  };

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
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg group-hover:scale-105 transition-transform">
          {initials || <User className="w-4 h-4" />}
        </div>
        <span className="text-xs font-bold text-slate-300 hidden sm:block">{name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-64 bg-[#1A1230] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl z-[100] overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 bg-white/5">
              <p className="text-xs font-black text-purple-400 uppercase tracking-widest mb-1">Account</p>
              <p className="text-sm font-bold text-white truncate">{name}</p>
              <p className="text-[10px] text-slate-400 truncate">{email}</p>
            </div>
            
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all group">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center group-hover:border-purple-500/30">
                  <User className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
                </div>
                Profile Settings
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all group">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center group-hover:border-purple-500/30">
                  <Settings className="w-4 h-4 text-slate-500 group-hover:text-purple-400" />
                </div>
                Preferences
              </button>
            </div>

            <div className="p-2 border-t border-white/5 bg-white/5">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserAvatar;
