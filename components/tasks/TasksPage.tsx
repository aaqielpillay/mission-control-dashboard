"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { PriorityBadge } from "@/components/shared/Badges";
import AgentAvatar from "@/components/shared/AgentAvatar";
import { AGENTS, TASKS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { Task, TaskStatus } from "@/lib/types";

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "backlog", label: "Backlog", color: "text-txt-muted" },
  { id: "in_progress", label: "In Progress", color: "text-status-blue" },
  { id: "review", label: "Review", color: "text-status-yellow" },
  { id: "done", label: "Done", color: "text-status-green" },
];

function TaskCard({
  task,
  isExpanded,
  onToggle,
}: {
  task: Task;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const agent = AGENTS.find((a) => a.id === task.assignedAgent);
  const completedSubSteps = task.subSteps.filter((s) => s.completed).length;

  return (
    <div ref={setNodeRef} style={style}>
      <div className="card p-3 space-y-2">
        <div className="flex items-start gap-2">
          <button
            {...attributes}
            {...listeners}
            className="mt-0.5 text-txt-muted hover:text-txt-secondary cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={14} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <PriorityBadge priority={task.priority} />
              {task.dueDate && (
                <span className="text-[10px] text-txt-muted">{formatDate(task.dueDate)}</span>
              )}
            </div>
            <button className="w-full text-left" onClick={onToggle}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-txt-primary mt-1 leading-snug">{task.title}</p>
                <ChevronDown size={14} className={`text-txt-muted flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pl-6">
          {agent && (
            <div className="flex items-center gap-1.5">
              <AgentAvatar initials={agent.avatarInitials} color={agent.avatarColor} size="sm" />
              <span className="text-[10px] text-txt-secondary">{agent.name}</span>
            </div>
          )}
          {task.subSteps.length > 0 && (
            <span className="text-[10px] text-txt-muted">
              {completedSubSteps}/{task.subSteps.length} sub-steps
            </span>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 pt-2 border-t border-border/50 overflow-hidden"
            >
              <p className="text-xs text-txt-secondary leading-relaxed">{task.description}</p>
              {task.subSteps.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-txt-muted uppercase">Sub-steps</span>
                  {task.subSteps.map((step) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${step.completed ? "bg-status-green border-status-green" : "border-border"}`}>
                        {step.completed && <span className="text-[8px] text-black">✓</span>}
                      </div>
                      <span className={`text-xs ${step.completed ? "line-through text-txt-muted" : "text-txt-secondary"}`}>
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Column({ column, tasks, expandedTask, onToggleExpand }: {
  column: (typeof COLUMNS)[0];
  tasks: Task[];
  expandedTask: string;
  onToggleExpand: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3 min-w-[260px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${column.color.replace("text-", "bg-")}`} />
          <span className="text-sm font-bold uppercase tracking-widest text-txt-muted">{column.label}</span>
        </div>
        <span className="text-xs font-mono text-txt-muted bg-bg-secondary px-2 py-0.5 rounded-full">{tasks.length}</span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isExpanded={expandedTask === task.id}
              onToggle={() => onToggleExpand(expandedTask === task.id ? "" : task.id)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState(TASKS);
  const [expandedTask, setExpandedTask] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overTask = tasks.find((t) => t.id === over.id);
    const targetStatus: TaskStatus = overTask ? overTask.status : (over.id as TaskStatus);

    if (COLUMNS.some((c) => c.id === targetStatus)) {
      setTasks((prev) =>
        prev.map((t) => t.id === active.id ? { ...t, status: targetStatus } : t)
      );
    }
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-txt-primary">Tasks Board</h1>
          <p className="text-sm text-txt-muted mt-1">Drag tasks between columns — sub-steps visible on expand</p>
        </div>
        <button className="btn btn-primary text-xs">
          <Plus size={14} /> New Task
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e: DragStartEvent) => setActiveId(e.active.id as string)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              column={col}
              tasks={tasks.filter((t) => t.status === col.id)}
              expandedTask={expandedTask}
              onToggleExpand={setExpandedTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="card p-3 opacity-90 rotate-2 shadow-2xl">
              <p className="text-sm font-medium text-txt-primary">{activeTask.title}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </motion.div>
  );
}
