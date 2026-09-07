import React, { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  closestCorners,
} from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Layers } from 'lucide-react';
import { useTaskStore } from '../store/taskStore';
import { BoardColumn } from '../components/board/BoardColumn';
import { FilterToolbar } from '../components/board/FilterToolbar';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { TaskCard } from '../components/board/TaskCard';
import { ITask, TaskStatus } from '../types';
import { Button } from '../components/common/Button';

export const BoardPage: React.FC = () => {
  const { tasks, isLoading, fetchTasks, updateTaskStatus, openTaskModal } = useTaskStore();
  const [activeTask, setActiveTask] = useState<ITask | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Configure Dnd-Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const targetColumnId = over.id as TaskStatus;

    // Check if dropping onto a column or another card
    const isColumn = ['todo', 'in-progress', 'done'].includes(targetColumnId);
    let newStatus: TaskStatus = isColumn ? targetColumnId : 'todo';

    if (!isColumn) {
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    const currentTask = tasks.find((t) => t.id === taskId);
    if (currentTask && currentTask.status !== newStatus) {
      updateTaskStatus(taskId, newStatus);
    }
  };

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  return (
    <div className="space-y-6 pb-24 lg:pb-12">
      {/* Board Header Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Zero-Gravity Kanban Matrix</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-white tracking-tight">
            COMMAND BOARD
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl glass-panel border-white/10 text-xs font-mono">
            <Layers className="w-4 h-4 text-violet-400" />
            <span className="text-slate-300">Total Active Tasks:</span>
            <span className="font-bold text-white">{tasks.length}</span>
          </div>

          <Button
            onClick={() => openTaskModal('create')}
            icon={<Plus className="w-4 h-4" />}
          >
            Launch Task
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <FilterToolbar />

      {/* Kanban Drag-and-Drop Matrix */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((col) => (
            <div key={col} className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            <BoardColumn id="todo" title="TO-DO PROTOCOLS" tasks={todoTasks} />
            <BoardColumn id="in-progress" title="IN-PROGRESS MATRIX" tasks={inProgressTasks} />
            <BoardColumn id="done" title="COMPLETED & LAUNCHED" tasks={doneTasks} />
          </div>

          {/* Floating Drag Overlay */}
          <DragOverlay>
            {activeTask ? (
              <div className="transform rotate-3 scale-105 shadow-[0_0_50px_rgba(139,92,246,0.8)] rounded-2xl">
                <TaskCard task={activeTask} index={0} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};
