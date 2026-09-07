import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, Mail, ArrowLeft, Send } from 'lucide-react';
import { api } from '../lib/axios';
import { useToast } from '../components/common/HolographicToast';
import { Button } from '../components/common/Button';
import { CosmicBackground } from '../components/layout/CosmicBackground';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mockToken, setMockToken] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMockToken(res.data.mockResetToken || 'dev-token-xyz');
      showToast('Reset Token Dispatched', 'Password reset instructions sent', 'info');
    } catch (err: any) {
      showToast('Error', err.response?.data?.error || 'Failed to process request', 'error');
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
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="font-heading text-xl font-bold text-white">RECOVER ACCESS KEY</h1>
            <p className="text-xs text-slate-300 font-mono mt-1">
              Enter your registered terminal email to dispatch reset token
            </p>
          </div>

          {mockToken ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono text-emerald-300 space-y-2">
                <p className="font-bold">✓ RESET TOKEN GENERATED (DEV SIMULATION)</p>
                <p className="break-all bg-black/40 p-2 rounded border border-emerald-500/20 text-white">
                  Token: {mockToken}
                </p>
                <p className="text-[11px] text-slate-300">
                  In production, this is emailed. Click below to proceed with password reset.
                </p>
              </div>

              <Link to={`/reset-password/${mockToken}`}>
                <Button className="w-full">PROCEED TO RESET PASSWORD</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="commander@taskverse.io"
                    className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                icon={<Send className="w-4 h-4" />}
              >
                DISPATCH RESET TOKEN
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
