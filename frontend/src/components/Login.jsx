import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Loader2, 
  Chrome, 
  Facebook, 
  Twitter, 
  ChevronLeft 
} from 'lucide-react';
import api from '../api';
import loginBg from '../assets/login_bg.png';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/app');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
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
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center relative overflow-hidden h-full">
          <div className="absolute top-0 left-0 w-32 h-32 bg-teal-500/5 blur-[100px]" />
          
          <div className="space-y-10 relative z-10 w-full">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-[#E78B81]">Member Login</h1>
              <p className="text-slate-400 text-sm">Please fill in your basic info</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium animate-shake">
                  {error}
                </div>
              )}
              <div className="relative group">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#7ED2C1] to-[#5B9BD5] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 group-focus-within:border-transparent transition-all">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-500 group-focus-within:text-[#7ED2C1] transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-transparent border-none text-white w-full focus:outline-none placeholder:text-slate-600 font-medium"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-[#7ED2C1] to-[#5B9BD5] scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500" />
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 group-focus-within:border-transparent transition-all">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-slate-500 group-focus-within:text-[#7ED2C1] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Password" 
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-transparent border-none text-white w-full focus:outline-none placeholder:text-slate-600 font-medium"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-[#E78B81] to-[#7ED2C1] rounded-full font-black text-white px-8 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 uppercase tracking-widest text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
                </button>
              </div>

              <div className="text-center">
                <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors italic">Forgot Password?</a>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Branding/Social */}
        <div className="w-full md:w-1/2 relative min-h-[400px]">
          <img 
            src={loginBg} 
            alt="Sign Up Background" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          
          <div className="absolute inset-0 p-12 flex flex-col items-center justify-center text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-white tracking-tight">Sign Up</h2>
              <p className="text-white/80 text-sm font-medium">Using your social media account</p>
            </div>

            <div className="flex items-center gap-6">
              {[
                { icon: Chrome, name: 'Gmail', color: 'bg-[#EA4335]/20 hover:bg-[#EA4335]/40' },
                { icon: Facebook, name: 'Facebook', color: 'bg-[#1877F2]/20 hover:bg-[#1877F2]/40' },
                { icon: Twitter, name: 'Twitter', color: 'bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/40' }
              ].map((social) => (
                <div key={social.name} className="flex flex-col items-center gap-3">
                  <button className={`w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all ${social.color} hover:scale-110 active:scale-95 group`}>
                    <social.icon className="w-6 h-6 transition-transform group-hover:rotate-12" />
                  </button>
                  <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{social.name}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6 flex flex-col items-center w-full max-w-xs">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative w-5 h-5">
                  <input 
                    type="checkbox" 
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-[#E78B81] peer-checked:border-[#E78B81] transition-all" />
                  <svg className="absolute inset-0 w-5 h-5 text-white scale-0 peer-checked:scale-100 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <span className="text-[10px] text-white/60 font-medium">By signing up I agree with <a href="#" className="text-white border-b border-white/20">terms and conditions</a></span>
              </label>

              <Link to="/signup" className="text-xs font-bold text-white hover:text-[#7ED2C1] transition-colors border-b border-white/40 pb-1">Create account</Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
