import React, { useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Calendar, CheckSquare, GripVertical, Trash2, Edit } from 'lucide-react';
import { ITask } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { PriorityBadge } from '../common/PriorityBadge';
import { CardPresence } from '../presence/PresenceIndicator';
import { useTaskStore } from '../../store/taskStore';
import { useSocketStore } from '../../store/socketStore';

interface TaskCardProps {
  task: ITask;
  index: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  const { openTaskModal, deleteTask } = useTaskStore();
  const { emitActivity } = useSocketStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Randomized idle float delay so cards feel weightless
  const randomDelay = useMemo(() => (index % 5) * 0.4, [index]);

  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const subtaskPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Task physics state styling
  const statePhysics = {
    todo: 'translate-y-1 hover:-translate-y-1 border-white/10',
    'in-progress': 'border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.25)] animate-pulse-glow',
    done: 'opacity-70 backdrop-blur-md border-emerald-500/30 scale-[0.98] grayscale-[20%] hover:grayscale-0 transition-all',
  };

  const handleCardClick = () => {
    emitActivity({ taskId: task.id });
    openTaskModal(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: task.status === 'in-progress' ? [0, -6, 0] : task.status === 'todo' ? [0, 4, 0] : 0,
        }}
        transition={{
          y: {
            duration: task.status === 'in-progress' ? 3.5 : 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: randomDelay,
          },
          opacity: { duration: 0.3 },
        }}
      >
        <GlassCard
          glow={task.status === 'in-progress' ? 'cyan' : task.status === 'done' ? 'none' : 'violet'}
          tilt={!isDragging}
          onClick={handleCardClick}
          className={`cursor-pointer ${statePhysics[task.status]} ${
            isDragging ? 'opacity-40 border-violet-400 scale-105 z-50 shadow-[0_0_40px_rgba(139,92,246,0.6)]' : ''
          }`}
        >
          {/* Card Top Row: Priority & Drag Grip */}
          <div className="flex items-center justify-between mb-2.5">
            <PriorityBadge priority={task.priority} />

            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleDelete}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div
                {...attributes}
                {...listeners}
                className="p-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-cyan-300 transition-colors"
                title="Drag to reorder"
              >
                <GripVertical className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Title & Description */}
          <h3 className={`font-heading text-base font-semibold mb-1 line-clamp-2 ${
            task.status === 'done' ? 'line-through text-slate-400' : 'text-white'
          }`}>
            {task.title}
          </h3>

          {task.description && (
            <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Subtasks Progress */}
          {totalSubtasks > 0 && (
            <div className="mb-3 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span className="flex items-center gap-1">
                  <CheckSquare className="w-3 h-3 text-cyan-400" />
                  Subtasks
                </span>
                <span>
                  {completedSubtasks}/{totalSubtasks} ({subtaskPercentage}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden border border-white/5">
                <div
                  style={{ width: `${subtaskPercentage}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
                />
              </div>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {task.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-violet-500/15 text-violet-300 border border-violet-500/30"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Info: Due Date & Presence */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-slate-400 font-mono">
            {task.dueDate ? (
              <span className="flex items-center gap-1.5 text-cyan-300/90">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {new Date(task.dueDate).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-1 text-slate-400 text-[11px]">
              <Edit className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>Details</span>
            </div>
          </div>

          {/* Presence Indicator */}
          <CardPresence taskId={task.id} />
        </GlassCard>
      </motion.div>
    </div>
  );
};
