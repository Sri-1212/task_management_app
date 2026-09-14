import React from 'react';
import { Search, Filter, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { useTaskStore } from '../../store/taskStore';
import { TaskPriority, TaskStatus } from '../../types';

export const FilterToolbar: React.FC = () => {
  const { filters, setFilters } = useTaskStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ status: e.target.value as TaskStatus | 'all' });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ priority: e.target.value as TaskPriority | 'all' });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ sort: e.target.value as any });
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      tag: '',
      search: '',
      sort: 'createdAt',
    });
  };

  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.tag !== '' ||
    filters.search !== '';

  const activeFilterCount = [
    filters.status !== 'all',
    filters.priority !== 'all',
    filters.tag !== '',
    filters.search !== '',
  ].filter(Boolean).length;

  return (
    <div className="glass-panel rounded-2xl p-3 border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
        <input
          type="text"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Filter tasks by title or tag..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 transition-all font-mono"
        />
        {filters.search && (
          <button
            onClick={() => setFilters({ search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Select Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
          <Filter className="w-3.5 h-3.5 text-violet-400" />
          {activeFilterCount > 0 && (
            <span className="min-w-4 h-4 px-1 rounded-full bg-violet-500/25 text-violet-200 text-[10px] font-bold leading-4 text-center">
              {activeFilterCount}
            </span>
          )}
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-mono"
          >
            <option value="all" className="bg-[#05050a] text-white">All Statuses</option>
            <option value="todo" className="bg-[#05050a] text-white">To-Do</option>
            <option value="in-progress" className="bg-[#05050a] text-white">In Progress</option>
            <option value="done" className="bg-[#05050a] text-white">Done</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
          <Sparkles className="w-3.5 h-3.5 text-magenta-400" />
          <select
            value={filters.priority}
            onChange={handlePriorityChange}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-mono"
          >
            <option value="all" className="bg-[#05050a] text-white">All Priorities</option>
            <option value="high" className="bg-[#05050a] text-white">High Priority</option>
            <option value="medium" className="bg-[#05050a] text-white">Medium Priority</option>
            <option value="low" className="bg-[#05050a] text-white">Low Priority</option>
          </select>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={filters.sort}
            onChange={handleSortChange}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-mono"
          >
            <option value="createdAt" className="bg-[#05050a] text-white">Sort: Created Date</option>
            <option value="dueDate" className="bg-[#05050a] text-white">Sort: Due Date</option>
            <option value="priority" className="bg-[#05050a] text-white">Sort: Priority</option>
          </select>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30 text-xs font-mono transition-all flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
