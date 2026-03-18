import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Sparkles, 
  ChevronRight, 
  Zap, 
  BookOpen, 
  Award,
  Users,
  Star,
  PlayCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import UserAvatar from './UserAvatar';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const isAuthenticated = !!localStorage.getItem('token');

  const partners = [
    { name: 'HubSpot', logo: 'https://cdn.worldvectorlogo.com/logos/hubspot.svg' },
    { name: 'Loom', logo: 'https://cdn.worldvectorlogo.com/logos/loom-1.svg' },
    { name: 'GitLab', logo: 'https://cdn.worldvectorlogo.com/logos/gitlab.svg' },
    { name: 'LiveChat', logo: 'https://cdn.worldvectorlogo.com/logos/livechat-2.svg' },
    { name: 'Monday.com', logo: 'https://cdn.worldvectorlogo.com/logos/monday-1.svg' }
  ];

  const popularSubjects = [
    { name: 'Physics', mcqs: '180+', rating: 4.8, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800' },
    { name: 'Chemistry', mcqs: '150+', rating: 4.9, image: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&q=80&w=800' },
    { name: 'Biology', mcqs: '200+', rating: 5.0, image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800' }
  ];

  const handleExplore = (target = '/app') => {
    if (isAuthenticated) {
      navigate(target);
    } else {
      navigate('/login');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleExplore('/app');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0821] text-white selection:bg-purple-500/30 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0821]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter">Neet<span className="text-purple-500"> pyq maker</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {['Home', 'About', 'Course', 'Blog', 'Contact'].map(link => (
              <a key={link} href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{link}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/app" className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-bold transition-all shadow-lg shadow-purple-500/20">Dashboard</Link>
                <UserAvatar />
              </div>
            ) : (
              <>
                <Link to="/login" className="px-6 py-2 text-sm font-medium hover:text-purple-400 transition-colors">Login</Link>
                <Link to="/signup" className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-bold transition-all shadow-lg shadow-purple-500/20">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[0%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/10 blur-[150px] rounded-full" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h1 className="text-6xl lg:text-7xl font-bold leading-[1.1]">
              Best courses <span className="text-white/60 font-serif italic">are</span> <br />
              waiting to enrich <br />
              your skill <span className="text-purple-500">+++</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
              Provides you with the latest online learning system and material that help your knowledge growing.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-md group">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects (e.g. Physics)" 
                className="w-full h-16 bg-white rounded-full pl-14 pr-32 text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-base shadow-2xl"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-8 bg-purple-600 hover:bg-purple-700 rounded-full text-sm font-bold transition-all">
                Explore
              </button>
            </form>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-[500px] h-[550px] bg-[#1A1230] rounded-b-full border-t-[1px] border-white/10 p-4 pt-12 overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent" />
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
                alt="Student" 
                className="w-full h-full object-cover rounded-b-full opacity-60 mix-blend-luminosity"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
              </div>
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-10 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl"
              >
                <Award className="w-8 h-8 text-yellow-500" />
              </motion.div>
              <div className="absolute bottom-10 left-10 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-purple-500">
                   <img src="https://i.pravatar.cc/150?u=1" alt="avatar" />
                </div>
                <div>
                   <p className="text-xs font-bold leading-tight">Master Neet pyqs</p>
                   <p className="text-[10px] text-slate-400">Join now</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners section */}
      <section className="py-20 border-y border-white/5 bg-[#0F0821]/50 backdrop-blur-sm relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center gap-12">
               <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.3em]">Our Course Partners</p>
               <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
                 {partners.map(p => (
                    <img key={p.name} src={p.logo} alt={p.name} className="h-6 lg:h-8 hover:scale-110 transition-transform cursor-pointer" />
                 ))}
               </div>
            </div>
         </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold">Popular <span className="text-purple-500">Courses</span></h2>
              <p className="text-slate-400 text-lg">Most used subjects by NEET aspirants this year.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularSubjects.map((s, i) => (
              <motion.div 
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 bg-[#1A1230] rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 px-4 py-1.5 bg-purple-600/90 backdrop-blur-md rounded-lg text-xs font-bold tracking-wider">
                    BEST SELLER
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {s.mcqs} MCQs</span>
                    <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {s.rating} (2.5k)</span>
                  </div>
                  <h3 className="text-2xl font-bold group-hover:text-purple-400 transition-colors">NEET {s.name} Mastery</h3>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                        <PlayCircle className="w-4 h-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Course</p>
                        <p className="text-xs font-bold">Full Preparation</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleExplore()}
                      className="p-3 bg-purple-600/10 hover:bg-purple-600 rounded-xl transition-all group/btn"
                    >
                      <ChevronRight className="w-5 h-5 text-purple-500 group-hover/btn:text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center pt-8">
             <button 
                onClick={() => handleExplore()}
                className="px-10 py-4 bg-purple-600 hover:bg-purple-700 rounded-full font-bold transition-all shadow-xl shadow-purple-500/20"
              >
                Explore All Courses
             </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-slate-400">
           <div className="space-y-6">
              <div className="flex items-center gap-2 text-white">
                <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center font-bold">N</div>
                <span className="text-lg font-bold uppercase tracking-tighter">Neet<span className="text-purple-500"> pyq maker</span></span>
              </div>
              <p className="text-sm leading-relaxed">Top-tier practice papers and analytics for NEET aspirants worldwide.</p>
           </div>
           {['Platform', 'Resources', 'Company'].map(title => (
             <div key={title} className="space-y-4">
                <h4 className="text-white font-bold">{title}</h4>
                <div className="flex flex-col gap-2 text-sm">
                   <a href="#" className="hover:text-white transition-colors">Overview</a>
                   <a href="#" className="hover:text-white transition-colors">Features</a>
                   <a href="#" className="hover:text-white transition-colors">Solutions</a>
                </div>
             </div>
           ))}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
