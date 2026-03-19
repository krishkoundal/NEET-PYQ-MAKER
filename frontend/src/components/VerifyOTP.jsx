import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Sparkles, 
  ChevronLeft, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';
import api from '../api';

const VerifyOTP = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email') || '';
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState('');
    const [timer, setTimer] = useState(0);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!email) {
            navigate('/signup');
        }
    }, [email, navigate]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        const data = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(data)) return;
        
        const newOtp = [...otp];
        data.split('').forEach((char, idx) => {
            if (idx < 6) newOtp[idx] = char;
        });
        setOtp(newOtp);
        
        // Focus the last filled input or the first empty one
        const nextIdx = Math.min(data.length, 5);
        inputRefs.current[nextIdx].focus();
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/verify-otp', {
                email,
                otp: otpValue
            });
            // Show success and redirect
            setResendMessage('Email verified successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        
        setResendLoading(true);
        setError('');
        setResendMessage('');
        try {
            await api.post('/auth/resend-otp', { email });
            setResendMessage('A new code has been sent to your email.');
            setTimer(60); // 1 minute cooldown
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#111821] flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden">
            <Link 
                to="/signup" 
                className="fixed top-8 left-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors z-50 font-bold uppercase tracking-widest"
            >
                <ChevronLeft className="w-4 h-4" /> Back to Signup
            </Link>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-10 md:p-12 rounded-[2rem] bg-[#1A2226] border border-white/5 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7ED2C1]/5 blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 blur-[100px]" />

                <div className="relative z-10 text-center space-y-8">
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 backdrop-blur-md relative">
                            <ShieldCheck className="w-10 h-10 text-[#7ED2C1]" />
                            <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-[#E78B81] animate-pulse" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Two-Step Verification</h1>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            We've sent a 6-digit code to <span className="text-white font-bold">{email}</span>. Please enter it below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}
                        
                        {resendMessage && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl text-[#7ED2C1] text-sm font-medium"
                            >
                                {resendMessage}
                            </motion.div>
                        )}

                        <div className="flex justify-between gap-2" onPaste={handlePaste}>
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-black bg-white/5 border border-white/10 rounded-2xl text-[#7ED2C1] focus:bg-white/10 focus:border-[#7ED2C1]/50 focus:outline-none transition-all"
                                />
                            ))}
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || otp.some(d => !d)}
                            className="w-full h-14 bg-gradient-to-r from-[#7ED2C1] to-[#5B9BD5] rounded-full font-black text-white transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 uppercase tracking-widest text-sm shadow-lg shadow-teal-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Code'}
                        </button>
                    </form>

                    <div className="pt-4 space-y-4">
                        <p className="text-slate-500 text-xs font-medium">
                            Didn't receive the code?
                        </p>
                        <button 
                            onClick={handleResend}
                            disabled={resendLoading || timer > 0}
                            className="inline-flex items-center gap-2 text-[#E78B81] font-bold hover:text-[#d67b71] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {resendLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className={`w-4 h-4 ${timer > 0 ? '' : 'group-hover:rotate-180 transition-transform duration-500'}`} />}
                            {timer > 0 ? `Resend code in ${timer}s` : 'Resend Code Now'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyOTP;
