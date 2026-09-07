import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Camera, Save, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/common/HolographicToast';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, avatar });
      showToast('Profile Saved', 'Commander profile parameters updated', 'success');
    } catch (err: any) {
      showToast('Update Failed', err.message, 'error');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 lg:pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Personnel Profile Matrix</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white tracking-tight">
          COMMANDER PROFILE
        </h1>
      </div>

      <GlassCard glow="violet" className="p-8 space-y-6">
        {/* Avatar Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-violet-600 via-cyan-400 to-magenta-500 p-1 shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              <div className="w-full h-full bg-[#05050a] rounded-[22px] overflow-hidden flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-violet-300" />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="font-heading text-xl font-bold text-white">{user.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-violet-500/20 text-cyan-300 border border-violet-500/30">
                {user.role}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">{user.email}</p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Officer Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Avatar Image URL
            </label>
            <div className="relative">
              <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-white/5 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Assigned Terminal Email (Read-Only)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-400 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" isLoading={isLoading} icon={<Save className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
