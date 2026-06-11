import React, { useState } from "react";
import { Task, Case } from "../types";
import { 
  Plus, 
  Trash2, 
  CheckSquare, 
  Square, 
  Calendar, 
  Briefcase, 
  X,
  PlusCircle,
  FileCheck2
} from "lucide-react";

interface TasksViewProps {
  tasks: Task[];
  cases: Case[];
  onAddTask: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "ownerId" | "caseTitle">) => Promise<void>;
  onToggleTask: (id: string, currentStatus: "pending" | "completed") => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
}

export default function TasksView({ tasks, cases, onAddTask, onToggleTask, onDeleteTask }: TasksViewProps) {
  const [filter, setFilter] = useState("all");
  const [isAdding, setIsAdding] = useState(false);

  // New task forms inputs
  const [newCaseId, setNewCaseId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredTasks = tasks.filter(t => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-rose-50 text-rose-700 border border-rose-100";
      case "medium": return "bg-amber-50 text-amber-700 border border-amber-100";
      default: return "bg-slate-50 text-slate-600 border border-slate-200";
    }
  };

  const handleToggle = async (id: string, current: "pending" | "completed") => {
    const nextStatus = current === "pending" ? "completed" : "pending";
    await onToggleTask(id, nextStatus);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Confirm task deletion: Are you sure you want to remove this schedule item from the firm checklist?")) {
      await onDeleteTask(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseId || !newTitle || !newDueDate) return;

    try {
      setIsSubmitting(true);
      await onAddTask({
        caseId: newCaseId,
        title: newTitle,
        dueDate: newDueDate,
        priority: newPriority,
        status: "pending"
      });

      // Reset
      setNewCaseId("");
      setNewTitle("");
      setNewDueDate("");
      setNewPriority("medium");
      setIsAdding(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6" id="litigation-tasks">
      {/* Header section with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">Litigation Deadlines & Task Boards</h2>
          <p className="text-slate-500 text-xs mt-1">Configure filings compliance, allocate briefs drafting timelines, and track deposition goals.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 transition-colors duration-150 shadow-xs cursor-pointer w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Add Compliance Task
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Toggle tabs and filters header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex bg-slate-50 rounded-xl p-1 border border-slate-200 text-xs gap-1 font-sans w-full max-w-xs">
            {[
              { value: "all", label: "All Tasks" },
              { value: "pending", label: "Pending" },
              { value: "completed", label: "Completed" }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex-1 text-center py-2 rounded-lg font-bold transition-all cursor-pointer ${
                  filter === tab.value 
                    ? "bg-blue-600 text-white shadow-xs" 
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-bold">
            Open Actions Checklist: <span className="text-blue-600 font-extrabold">{tasks.filter(t => t.status === "pending").length}</span>
          </div>
        </div>

        {/* Task listings loop card layouts */}
        <div className="space-y-3 font-sans text-xs">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === "completed";
            return (
              <div 
                key={task.id}
                className={`flex items-start sm:items-center justify-between p-4 border rounded-xl gap-4 transition-all ${
                  isCompleted 
                    ? "bg-slate-50/70 border-slate-200/60 opacity-65" 
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Check / Uncheck box selector */}
                  <button
                    onClick={() => handleToggle(task.id, task.status)}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer shrink-0 mt-0.5"
                    title={isCompleted ? "Mark Pending" : "Mark Completed"}
                  >
                    {isCompleted ? (
                      <CheckSquare className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0 pr-2">
                    <h4 className={`text-sm font-bold text-slate-800 leading-tight ${isCompleted ? "line-through text-slate-400 font-medium" : ""}`}>
                      {task.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-505">
                      <span className="flex items-center gap-1 text-slate-600">
                        <Briefcase className="h-3 w-3 shrink-0 text-slate-400" /> {task.caseTitle}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-slate-500">
                        <Calendar className="h-3 w-3 shrink-0 text-amber-600" /> Due: {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 shrink-0 self-center">
                  <span className={`text-[9px] font-bold uppercase py-0.5 px-2 rounded-md ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Erase"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-205 rounded-xl">
              <FileCheck2 className="h-10 w-10 text-slate-400 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-800">No Tasks Listed</h4>
              <p className="text-xs text-slate-550 mt-1 max-w-sm mx-auto">
                No compliance or client filing task items matches your selected tab filter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Slide Modal - Add task */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4 text-slate-900">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-blue-600" /> Allocate Compliance Deadline
              </h3>
              <button 
                onClick={() => setIsAdding(false)} 
                className="p-1.5 hover:bg-slate-100 hover:text-slate-800 text-slate-400 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Tied Case Docket File *</label>
                <select
                  required
                  value={newCaseId}
                  onChange={(e) => setNewCaseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs cursor-pointer"
                >
                  <option value="">Select case matter...</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.clientName})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Task Title / Filing Action *</label>
                <input
                  type="text"
                  required
                  placeholder="Schedule deposition meeting, draft responses..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Filing Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Filing Priority *</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs cursor-pointer"
                  >
                    <option value="low font-sans">Low priority</option>
                    <option value="medium font-sans">Medium priority</option>
                    <option value="high font-sans">High priority (Filing deadline)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg px-4 py-2 font-bold transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg px-4 py-2 font-bold transition-colors cursor-pointer text-xs shadow-xs"
                >
                  {isSubmitting ? "Allocating task..." : "Allocate task deadline"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
