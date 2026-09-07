import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/common/HolographicToast';
import { Button } from '../components/common/Button';
import { CosmicBackground } from '../components/layout/CosmicBackground';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      showToast('Authentication Granted', 'Welcome back to TaskVerse Command', 'success');
      navigate('/');
    } catch (err: any) {
      showToast('Authentication Failed', err.message, 'error');
    }
  };

  const handleDemoLogin = async () => {
    try {
      await login({ email: 'demo@taskverse.io', password: 'TaskVerse2026!' });
      showToast('Demo Command Access', 'Logged in as Commander Nova', 'success');
      navigate('/');
    } catch (err: any) {
      showToast('Login Failed', err.message, 'error');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <CosmicBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-panel p-8 rounded-3xl border border-violet-500/30 shadow-[0_0_60px_rgba(139,92,246,0.3)] backdrop-blur-3xl bg-space-900/80">
          {/* Header Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-0.5 shadow-[0_0_30px_rgba(139,92,246,0.6)] mb-4">
              <div className="w-full h-full bg-[#05050a] rounded-[14px] flex items-center justify-center">
                <Zap className="w-7 h-7 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <h1 className="font-heading text-2xl font-bold text-white tracking-tight">
              TASKVERSE COMMAND
            </h1>
            <p className="text-xs text-cyan-400/90 font-mono mt-1">
              Zero-Gravity Task Management Portal
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Terminal Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="commander@taskverse.io"
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 font-mono transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                  Access Key (Password)
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-mono text-cyan-400 hover:underline"
                >
                  Forgot Key?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 font-mono transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              AUTHENTICATE ACCESS
            </Button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <button
              onClick={handleDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl glass-panel border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              <UserCheck className="w-4 h-4 text-cyan-400" />
              1-CLICK DEMO COMMANDER LOGIN
            </button>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 font-bold hover:underline font-mono">
              Register New Personnel
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
