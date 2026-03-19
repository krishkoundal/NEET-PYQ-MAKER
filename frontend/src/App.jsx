import React, { useState, useEffect, useMemo } from 'react';
import api from './api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Settings, 
  FileText, 
  Download, 
  CheckCircle, 
  Info, 
  ChevronRight,
  ChevronLeft,
  Database,
  Award,
  Clock,
  Search,
  Filter,
  Zap,
  Sparkles
} from 'lucide-react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

// Import New Components
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import VerifyOTP from './components/VerifyOTP';
import ProtectedRoute from './components/ProtectedRoute';
import UserAvatar from './components/UserAvatar';

// API base is handled by api.js

// Generator Component (Existing App Logic)
const Generator = () => {
  const [step, setStep] = useState(1);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [config, setConfig] = useState({
    count: 80,
    difficulty: '',
    years: []
  });
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [pdfStatus, setPdfStatus] = useState({ loading: false, data: null });

  useEffect(() => {
    api.get('/subjects').then(res => setSubjects(res.data));
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      api.get(`/chapters?subject=${selectedSubject}`).then(res => {
        setChapters(res.data);
        setSelectedChapters([]);
      });
    }
  }, [selectedSubject]);

  const filteredChapters = useMemo(() => {
    return chapters.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [chapters, searchTerm]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStep(4);
    try {
      const res = await api.post('/generate-paper', {
        subject: selectedSubject,
        chapters: selectedChapters,
        ...config
      });
      setGeneratedQuestions(res.data);
      setPdfStatus({ loading: false, data: null });
    } catch (err) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  const handleGeneratePDF = async () => {
    setPdfStatus({ ...pdfStatus, loading: true });
    try {
      const res = await api.post('/generate-pdf', {
        questions: generatedQuestions,
        metadata: { subject: selectedSubject, chapters: selectedChapters }
      });
      setPdfStatus({ loading: false, data: res.data });
    } catch (err) {
      console.error(err);
      setPdfStatus({ loading: false, data: null });
    }
  };

  const toggleChapter = (chapter) => {
    setSelectedChapters(prev => 
      prev.includes(chapter) ? prev.filter(c => c !== chapter) : [...prev, chapter]
    );
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 selection:bg-sky-500/30 overflow-x-hidden pt-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-sky-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/5 blur-[150px] rounded-full" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-black tracking-tighter">NEET<span className="text-sky-500">PYQ</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <div className={`flex items-center gap-2 text-sm font-bold transition-colors ${step >= 1 ? 'text-sky-400' : 'text-slate-600'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? 'border-sky-400 bg-sky-400/10' : 'border-slate-800'}`}>1</span>
              Subject
            </div>
            <div className="w-8 h-px bg-slate-800" />
            <div className={`flex items-center gap-2 text-sm font-bold transition-colors ${step >= 2 ? 'text-sky-400' : 'text-slate-600'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? 'border-sky-400 bg-sky-400/10' : 'border-slate-800'}`}>2</span>
              Chapters
            </div>
            <div className="w-8 h-px bg-slate-800" />
            <div className={`flex items-center gap-2 text-sm font-bold transition-colors ${step >= 3 ? 'text-sky-400' : 'text-slate-600'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 3 ? 'border-sky-400 bg-sky-400/10' : 'border-slate-800'}`}>3</span>
              Config
            </div>
            <div className="w-8 h-px bg-slate-800" />
            <div className={`flex items-center gap-2 text-sm font-bold transition-colors ${step >= 4 ? 'text-sky-400' : 'text-slate-600'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 4 ? 'border-sky-400 bg-sky-400/10' : 'border-slate-800'}`}>4</span>
              Review
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold hover:bg-white/10 transition-all">
              <Award className="w-4 h-4 text-sky-400" /> Professional 2025 Edition
            </button>
            <UserAvatar />
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-12">
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black">Choose your <span className="text-sky-500">Battlefield</span></h2>
                <p className="text-slate-400 text-lg">Select the subject you want to master today.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { name: 'Physics', icon: Zap, color: 'from-amber-400 to-orange-600', desc: 'Mechanics, Optics, Thermodynamics & more.' },
                  { name: 'Chemistry', icon: FlaskConical, color: 'from-emerald-400 to-cyan-600', desc: 'Organic, Inorganic & Physical Chemistry.' },
                  { name: 'Biology', icon: Heart, color: 'from-rose-400 to-pink-600', desc: 'Zoology, Botany & Human Physiology.' }
                ].map((s) => {
                  const Icon = s.icon || BookOpen;
                  return (
                    <button key={s.name} onClick={() => { setSelectedSubject(s.name); setStep(2); }} className="group relative p-1 rounded-[2rem] bg-slate-900/50 border border-slate-800 transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-95">
                      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity rounded-[2rem] overflow-hidden">
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-50 bg-gradient-to-br ${s.color}`} />
                      </div>
                      <div className="relative p-8 text-left space-y-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform`}>
                          <Icon className="text-white w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-bold">{s.name}</h3>
                          <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                          Select Subject <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold mb-4 uppercase tracking-tighter">
                    <ChevronLeft className="w-4 h-4" /> Back to Subject
                  </button>
                  <h2 className="text-4xl font-black">{selectedSubject} <span className="text-sky-500">Chapters</span></h2>
                  <p className="text-slate-400">Search and select the specific chapters.</p>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input type="text" placeholder="Search chapters..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all shadow-inner" />
                </div>
              </div>
              <div className="p-2 rounded-[2.5rem] bg-slate-900/30 border border-slate-800 backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[500px] overflow-y-auto p-4 custom-scrollbar">
                  {filteredChapters.map(c => (
                    <button key={c} onClick={() => toggleChapter(c)} className={`flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-medium transition-all group ${selectedChapters.includes(c) ? 'bg-sky-500/20 border border-sky-500/50 text-sky-300 shadow-lg shadow-sky-500/10' : 'bg-slate-950/40 border border-slate-800/50 text-slate-400 hover:border-slate-700 hover:bg-slate-950/60'}`}>
                      <span className="truncate">{c}</span>
                      {selectedChapters.includes(c) ? <CheckCircle className="w-5 h-5 text-sky-400 flex-shrink-0" /> : <div className="w-5 h-5 rounded-full border border-slate-800 group-hover:border-slate-700 flex-shrink-0 transition-colors" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{selectedChapters.length} Chapters Selected</div>
                <button disabled={selectedChapters.length === 0} onClick={() => setStep(3)} className="px-10 py-5 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl font-bold text-white shadow-xl shadow-sky-500/20 hover:shadow-sky-500/30 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-3">
                  Configure Paper <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="max-w-4xl mx-auto space-y-12">
               <div className="text-center space-y-4">
                <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-tighter mb-4">
                  <ChevronLeft className="w-4 h-4" /> Back to Chapters
                </button>
                <h2 className="text-4xl font-black">Final <span className="text-sky-500">Fine-Tuning</span></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800 shadow-2xl relative overflow-hidden">
                    <label className="flex items-center gap-3 text-sm font-bold text-sky-400 mb-6 uppercase tracking-widest"><Clock className="w-4 h-4" /> Select Years</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013].map(yr => (
                        <button key={yr} onClick={() => { const yrs = config.years.includes(yr) ? config.years.filter(y => y !== yr) : [...config.years, yr]; setConfig({...config, years: yrs}); }} className={`py-3 rounded-xl text-xs font-bold border transition-all ${config.years.includes(yr) ? 'bg-sky-500/20 border-sky-500/50 text-sky-300' : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-700'}`}>{yr}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800 shadow-2xl">
                    <div className="space-y-8">
                      <div>
                        <label className="flex items-center gap-3 text-sm font-bold text-sky-400 mb-4 uppercase tracking-widest"><BookOpen className="w-4 h-4" /> Question Count</label>
                        <div className="grid grid-cols-3 gap-3">
                          {[10, 30, 50, 80, 90, 180].map(n => (
                            <button key={n} onClick={() => setConfig({...config, count: n})} className={`py-4 rounded-xl font-bold border transition-all ${config.count === n ? 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-700'}`}>{n}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-3 text-sm font-bold text-sky-400 mb-4 uppercase tracking-widest"><Award className="w-4 h-4" /> Difficulty Level</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                            <button key={d} onClick={() => setConfig({...config, difficulty: d === 'All' ? '' : d})} className={`py-4 rounded-xl font-bold border transition-all ${(d === 'All' && config.difficulty === '') || (d !== 'All' && config.difficulty === d) ? 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-950/30 border-slate-800 text-slate-500 hover:border-slate-700'}`}>{d}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button disabled={isGenerating} onClick={handleGenerate} className="w-full group relative flex items-center justify-center gap-3 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl font-black text-white shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95 transition-all disabled:opacity-50 text-xl font-black">{isGenerating ? 'Generating...' : 'Assemble Final Paper'}</button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10">
               <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 rounded-[2.5rem] bg-slate-900/60 border border-slate-800 backdrop-blur-2xl shadow-2xl">
                 <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-inner"><CheckCircle className="w-10 h-10 text-emerald-400" /></div>
                    <div><h2 className="text-3xl font-black">Paper <span className="text-emerald-400">Ready</span></h2><p className="text-slate-400 font-medium">{generatedQuestions.length} Questions Compiled</p></div>
                 </div>
                 <div className="flex flex-wrap gap-4">
                    <button onClick={() => setStep(3)} className="px-6 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl font-bold transition-all text-sm">Re-Configure</button>
                    <button onClick={() => setShowAnswers(!showAnswers)} className={`flex items-center gap-3 px-8 py-4 ${showAnswers ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-300'} border border-slate-700 rounded-2xl font-bold transition-all text-sm`}>
                      {showAnswers ? <CheckCircle className="w-5 h-5" /> : <BookOpen className="w-5 h-5 text-sky-400" />}
                      {showAnswers ? 'Hide Answers' : 'Show Answers'}
                    </button>
                    {generatedQuestions.length > 0 && !pdfStatus.data && (
                      <button disabled={pdfStatus.loading} onClick={handleGeneratePDF} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 text-white rounded-2xl font-black hover:scale-[1.02] transition-all disabled:opacity-50">{pdfStatus.loading ? <Clock className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}Export to PDF</button>
                    )}
                    {pdfStatus.data && (
                      <div className="flex gap-4">
                        <a href={`${api.defaults.baseURL}/download-pdf/${pdfStatus.data.paperId}`} className="flex items-center gap-3 px-8 py-4 bg-sky-500 shadow-lg shadow-sky-500/20 text-white rounded-2xl font-black hover:scale-[1.02] transition-all"><Download className="w-5 h-5" /> Download Paper</a>
                        <a href={`${api.defaults.baseURL}/download-pdf/${pdfStatus.data.keyId}`} className="flex items-center gap-3 px-8 py-4 bg-slate-950 border border-slate-800 text-slate-300 rounded-2xl font-bold hover:bg-slate-900 transition-all">Answer Key</a>
                      </div>
                    )}
                 </div>
              </div>
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {generatedQuestions.map((q, i) => (
                    <motion.div key={q._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-10 rounded-[2rem] bg-slate-900/40 border border-slate-800/50 hover:border-sky-500/30 transition-all group">
                      <div className="flex items-start gap-6 mb-8">
                         <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-sky-400 shadow-inner text-lg">{i + 1}</span>
                         <div className="space-y-4">
                            <div className="flex items-center gap-3">
                               <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/20">NEET {q.year}</span>
                               <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{q.difficulty}</span>
                            </div>
                            <p className="text-xl md:text-2xl font-bold leading-relaxed">{q.question}</p>
                            {q.imageUrl && (
                               <div className="mt-4 p-4 bg-white rounded-xl shadow-inner max-w-2xl">
                                  <img src={q.imageUrl} alt="Question Diagram" className="max-h-[300px] object-contain mx-auto" />
                                </div>
                            )}
                         </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-0 md:ml-18">
                        {[{ label: 'A', value: q.optionA }, { label: 'B', value: q.optionB }, { label: 'C', value: q.optionC }, { label: 'D', value: q.optionD }].map((opt) => (
                          <div key={opt.label} className={`p-5 rounded-2xl border transition-all flex items-center gap-4 ${(showAnswers && q.correctAnswer === opt.label) ? 'bg-sky-500/20 border-sky-500/50 text-sky-200' : 'bg-slate-950/30 border-slate-800/50 text-slate-400'}`}>
                             <span className={`flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center font-black ${(showAnswers && q.correctAnswer === opt.label) ? 'bg-sky-500 border-sky-400 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>{opt.label}</span>
                             <span className="text-lg font-medium">{opt.value}</span>
                          </div>
                        ))}
                      </div>
                      {showAnswers && q.explanation && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-8 rounded-2xl bg-sky-500/5 border border-sky-500/20 space-y-3 ml-0 md:ml-18">
                           <div className="flex items-center gap-2 text-sky-400 text-xs font-black uppercase tracking-widest">
                              <Info className="w-4 h-4" /> Explanation
                           </div>
                           <p className="text-slate-300 leading-relaxed italic">{q.explanation}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; border: 2px solid #0f172a; }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
      `}</style>
    </div>
  );
};

// FlaskConical & Heart icons
const FlaskConical = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.5"/><path d="M14 2v7.5"/><path d="M4.7 22h14.6c1.2 0 2.1-1.2 1.5-2.3L15.3 11V3c0-1.1-.9-2-2-2h-2.6c-1.1 0-2 .9-2 2v8L3.2 19.7c-.6 1.1.3 2.3 1.5 2.3z"/><path d="M7.7 15h8.6"/></svg>
);
const Heart = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.54 4.04 3 5.5L12 21z"/></svg>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route 
          path="/app" 
          element={
            <ProtectedRoute>
              <Generator />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
