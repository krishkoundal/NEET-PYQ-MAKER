import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  ChevronLeft, 
  Sparkles, 
  User 
} from 'lucide-react';
import api from '../api';
import loginBg from '../assets/login_bg.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setError('Please agree to the terms and conditions');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/register', formData);
      navigate(`/verify-otp?email=${formData.email}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#111821] flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden">
      <Link 
        to="/" 
        className="fixed top-8 left-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors z-50 font-bold uppercase tracking-widest"
      >
        <ChevronLeft className="w-4 h-4" /> Back
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl md:aspect-[16/9] flex flex-col md:flex-row rounded-[2rem] overflow-hidden shadow-2xl relative z-10 bg-[#1A2226]"
      >
        {/* Left Side - Image Panel */}
        <div className="hidden md:block w-1/2 relative min-h-[400px]">
          <img 
            src={loginBg} 
            alt="Welcome" 
            className="absolute inset-0 w-full h-full object-cover grayscale-[20%] brightness-75"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          
          <div className="absolute inset-0 p-12 flex flex-col items-center justify-center text-center space-y-8">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
              <Sparkles className="w-10 h-10 text-[#7ED2C1]" />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-white tracking-tight">Welcome</h2>
              <p className="text-white/80 text-sm font-medium max-w-xs mx-auto">
                Join our community of students and start your journey towards success.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-[#E78B81]" />
              <div className="w-3 h-3 rounded-full bg-[#7ED2C1]" />
              <div className="w-3 h-3 rounded-full bg-[#5B9BD5]" />
            </div>
          </div>
        </div>

        {/* Right Side - Form Panel */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center relative overflow-hidden bg-[#1D252B]">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/5 blur-[100px]" />
          
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div 
                key="signup-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10 relative z-10 w-full"
              >
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold text-[#7ED2C1]">Create Account</h1>
                  <p className="text-slate-400 text-sm font-medium">Using your basic info</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium animate-shake">
                      {error}
                    </div>
                  )}
                  <div className="relative group">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#E78B81] to-[#7ED2C1] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 group-focus-within:border-transparent transition-all">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-500 group-focus-within:text-[#E78B81] transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        name="name"
                        placeholder="Full Name" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="bg-transparent border-none text-white w-full focus:outline-none placeholder:text-slate-600 font-medium"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#E78B81] to-[#7ED2C1] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 group-focus-within:border-transparent transition-all">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-500 group-focus-within:text-[#E78B81] transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input 
                        type="email" 
                        name="email"
                        placeholder="Email address" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="bg-transparent border-none text-white w-full focus:outline-none placeholder:text-slate-600 font-medium"
                      />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#E78B81] to-[#7ED2C1] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 group-focus-within:border-transparent transition-all">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-500 group-focus-within:text-[#E78B81] transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input 
                        type="password" 
                        name="password"
                        placeholder="Create Password" 
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="bg-transparent border-none text-white w-full focus:outline-none placeholder:text-slate-600 font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative w-5 h-5">
                        <input 
                          type="checkbox" 
                          checked={agreed}
                          onChange={() => setAgreed(!agreed)}
                          className="peer sr-only"
                          required
                        />
                        <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-[#7ED2C1] peer-checked:border-[#7ED2C1] transition-all" />
                        <svg className="absolute inset-0 w-5 h-5 text-white scale-0 peer-checked:scale-100 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">I agree with <a href="#" className="text-slate-300 border-b border-white/20">terms and conditions</a></span>
                    </label>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-14 bg-gradient-to-r from-[#7ED2C1] to-[#5B9BD5] rounded-full font-black text-white px-8 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 uppercase tracking-widest text-sm shadow-lg shadow-teal-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : 'Sign Up Now'}
                    </button>
                  </div>
                </form>

                <p className="text-center text-sm text-slate-500 font-medium">
                  Already have an account? <Link to="/login" className="text-[#E78B81] font-bold hover:text-[#d67b71] transition-colors">Login</Link>
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="verification-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-10 py-4 relative z-10 w-full"
              >
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-teal-500/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-teal-500/20">
                    <CheckCircle className="w-12 h-12 text-[#7ED2C1]" />
                  </div>
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#E78B81] animate-pulse" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-white tracking-tight">Verify Your Email</h2>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                    We've sent a verification link to your email. Please click the link to activate your account.
                  </p>
                </div>

                <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-500 italic">
                  Didn't receive the email? <button className="text-[#7ED2C1] font-bold hover:underline">Resend link</button>
                </div>

                <Link to="/login" className="block w-full h-14 bg-gradient-to-r from-[#E78B81] to-[#7ED2C1] rounded-full font-black text-white flex items-center justify-center transition-all shadow-lg hover:scale-[1.02] hover:shadow-xl active:scale-95 uppercase tracking-widest text-sm">
                  Return to Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
