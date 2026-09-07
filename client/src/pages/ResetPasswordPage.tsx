import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/axios';
import { useToast } from '../components/common/HolographicToast';
import { Button } from '../components/common/Button';
import { CosmicBackground } from '../components/layout/CosmicBackground';

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Mismatch Error', 'Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { newPassword });
      showToast('Key Updated', 'Password successfully reset! Please login.', 'success');
      navigate('/login');
    } catch (err: any) {
      showToast('Reset Failed', err.response?.data?.error || 'Token expired or invalid', 'error');
    } finally {
      setIsLoading(false);
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
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-300 border border-violet-400/40 mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="font-heading text-xl font-bold text-white">SET NEW ACCESS KEY</h1>
            <p className="text-xs text-slate-300 font-mono mt-1">
              Enter your new secure password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                New Access Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm New Access Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              UPDATE ACCESS KEY
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs text-slate-400 hover:text-cyan-300 font-mono">
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
