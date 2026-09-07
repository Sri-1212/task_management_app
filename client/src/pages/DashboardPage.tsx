import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTaskStore } from '../store/taskStore';
import { GlassCard } from '../components/common/GlassCard';

export const DashboardPage: React.FC = () => {
  const { tasks, fetchTasks } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in-progress').length;
  const todoCount = tasks.filter((t) => t.status === 'todo').length;

  const completionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const highPriorityCount = tasks.filter((t) => t.priority === 'high').length;
  const medPriorityCount = tasks.filter((t) => t.priority === 'medium').length;
  const lowPriorityCount = tasks.filter((t) => t.priority === 'low').length;

  // Chart data
  const statusPieData = [
    { name: 'Completed', value: doneCount, color: '#10b981' },
    { name: 'In Progress', value: inProgressCount, color: '#22d3ee' },
    { name: 'To-Do', value: todoCount, color: '#8b5cf6' },
  ];

  const priorityBarData = [
    { priority: 'High', count: highPriorityCount, fill: '#f43f5e' },
    { priority: 'Medium', count: medPriorityCount, fill: '#f59e0b' },
    { priority: 'Low', count: lowPriorityCount, fill: '#10b981' },
  ];

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      {/* Dashboard Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Real-time Analytics Matrix</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white tracking-tight">
          COMMAND DASHBOARD
        </h1>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard glow="cyan" className="space-y-2">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-mono font-semibold uppercase">Total Protocols</span>
            <PieChartIcon className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-white">{total}</div>
          <div className="text-xs font-mono text-slate-400">Active tasks in matrix</div>
        </GlassCard>

        <GlassCard glow="violet" className="space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-mono font-semibold uppercase">Completed & Launched</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-emerald-300">{doneCount}</div>
          <div className="text-xs font-mono text-slate-400">{completionRate}% total efficiency</div>
        </GlassCard>

        <GlassCard glow="cyan" className="space-y-2">
          <div className="flex items-center justify-between text-cyan-300">
            <span className="text-xs font-mono font-semibold uppercase">In-Progress Drift</span>
            <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div className="text-3xl font-extrabold font-heading text-cyan-300">{inProgressCount}</div>
          <div className="text-xs font-mono text-slate-400">Active execution threads</div>
        </GlassCard>

        <GlassCard glow="magenta" className="space-y-2">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-mono font-semibold uppercase">High Priority Alert</span>
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>
          <div className="text-3xl font-extrabold font-heading text-rose-300">{highPriorityCount}</div>
          <div className="text-xs font-mono text-slate-400">Critical priority tasks</div>
        </GlassCard>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <GlassCard glow="violet" className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-violet-400" />
              STATUS DISTRIBUTION
            </h3>
            <span className="text-xs font-mono text-cyan-400">{completionRate}% Completed</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {total === 0 ? (
              <div className="text-center text-slate-500 text-xs font-mono">NO DATA AVAILABLE</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#05050a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a14',
                      borderColor: 'rgba(139, 92, 246, 0.4)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs font-mono">
            {statusPieData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Priority Breakdown Bar Chart */}
        <GlassCard glow="cyan" className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              PRIORITY BREAKDOWN
            </h3>
            <span className="text-xs font-mono text-rose-400">{highPriorityCount} High Priority</span>
          </div>

          <div className="h-64 w-full">
            {total === 0 ? (
              <div className="text-center py-24 text-slate-500 text-xs font-mono">NO DATA AVAILABLE</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityBarData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="priority" stroke="#94a3b8" fontSize={12} fontStyle="monospace" />
                  <YAxis stroke="#94a3b8" fontSize={12} fontStyle="monospace" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0a14',
                      borderColor: 'rgba(34, 211, 238, 0.4)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {priorityBarData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
