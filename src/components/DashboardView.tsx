import React from "react";
import { Case, Client, Billing, Task } from "../types";
import { 
  Briefcase, 
  Users, 
  Clock, 
  IndianRupee, 
  Calendar, 
  ArrowUpRight, 
  TrendingUp, 
  CheckCircle,
  FileText,
  AlertTriangle
} from "lucide-react";

interface DashboardProps {
  clients: Client[];
  cases: Case[];
  billing: Billing[];
  tasks: Task[];
  onNavigate: (tab: string, itemRef?: string) => void;
}

export default function DashboardView({ clients, cases, billing, tasks, onNavigate }: DashboardProps) {
  // 1. Data statistics Calculations
  const activeCases = cases.filter(c => c.status === "active");
  const pendingCases = cases.filter(c => c.status === "pending");
  const completedTasks = tasks.filter(t => t.status === "completed");
  const pendingTasks = tasks.filter(t => t.status === "pending");

  // Revenue collection math
  const totalInvoiced = billing.reduce((sum, item) => sum + item.amount, 0);
  const paidInvoiced = billing.filter(b => b.status === "paid").reduce((sum, item) => sum + item.amount, 0);
  const unpaidInvoiced = billing.filter(b => b.status === "unpaid").reduce((sum, item) => sum + item.amount, 0);
  const overdueInvoiced = billing.filter(b => b.status === "overdue").reduce((sum, item) => sum + item.amount, 0);

  // Practice area stats for visuals
  const practiceAreaCounts: Record<string, number> = {};
  cases.forEach(c => {
    practiceAreaCounts[c.practiceArea] = (practiceAreaCounts[c.practiceArea] || 0) + 1;
  });

  const practiceAreasList = Object.entries(practiceAreaCounts)
    .map(([area, count]) => ({
      name: area,
      count,
      percentage: Math.round((count / cases.length) * 100) || 0
    }))
    .sort((a, b) => b.count - a.count);

  // Active hearing schedules
  const upcomingHearings = cases
    .filter(c => c.nextHearingDate && new Date(c.nextHearingDate) >= new Date())
    .map(c => ({
      caseId: c.id,
      caseNumber: c.caseNumber,
      title: c.title,
      date: c.nextHearingDate!,
      court: c.court,
      judge: c.judge || "Not Assigned"
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // High priority task list
  const activeHighPriorityTasks = tasks
    .filter(t => t.status === "pending" && t.priority === "high")
    .slice(0, 3);

  // Custom visual theme color map for practice areas
  const getAreaColor = (area: string) => {
    switch (area) {
      case "Corporate": return "bg-indigo-600";
      case "Criminal": return "bg-rose-600";
      case "Family": return "bg-teal-600";
      case "Intellectual Property": return "bg-violet-600";
      case "Labor": return "bg-amber-600";
      case "Real Estate": return "bg-emerald-600";
      default: return "bg-slate-500";
    }
  };

  return (
    <div className="space-y-6" id="lawyer-dashboard">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
            Firm Dashboard & Overview
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            General practice metrics, caseload portfolios, and consolidated attorney operations.
          </p>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 gap-6 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
            <span>Database Synced</span>
          </div>
          <div className="border-l border-slate-200"></div>
          <div>Client Load: <span className="text-slate-900 font-bold">{clients.length}</span></div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Cases Portfolios */}
        <div 
          onClick={() => onNavigate("cases")}
          className="bg-white border border-slate-200 hover:border-blue-500/50 transition-all rounded-2xl p-5 cursor-pointer relative overflow-hidden group shadow-xs hover:shadow-md"
          id="stat-cases"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Active Caseload</span>
              <h3 className="text-3xl font-extrabold text-slate-950 font-sans">{activeCases.length}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5">
            <span className="font-semibold text-blue-600">{pendingCases.length}</span> more case files awaiting formal filing.
          </p>
        </div>

        {/* Global Client Logs */}
        <div 
          onClick={() => onNavigate("clients")}
          className="bg-white border border-slate-200 hover:border-emerald-500/50 transition-all rounded-2xl p-5 cursor-pointer relative overflow-hidden group shadow-xs hover:shadow-md"
          id="stat-clients"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Retained Clients</span>
              <h3 className="text-3xl font-extrabold text-slate-950 font-sans">{clients.length}</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5">
            <span className="font-semibold text-emerald-600 font-mono">100%</span> active retention & advisory logs maintained.
          </p>
        </div>

        {/* Pending Deadlines */}
        <div 
          onClick={() => onNavigate("tasks")}
          className="bg-white border border-slate-200 hover:border-amber-500/50 transition-all rounded-2xl p-5 cursor-pointer relative overflow-hidden group shadow-xs hover:shadow-md"
          id="stat-deadlines"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Open Tasks</span>
              <h3 className="text-3xl font-extrabold text-slate-950 font-sans">{pendingTasks.length}</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5">
            <span className="font-semibold text-amber-600">{completedTasks.length}</span> items successfully resolved this quarter.
          </p>
        </div>

        {/* Unpaid legal billing invoice volumes */}
        <div 
          onClick={() => onNavigate("billing")}
          className="bg-white border border-slate-200 hover:border-red-500/50 transition-all rounded-2xl p-5 cursor-pointer relative overflow-hidden group shadow-xs hover:shadow-md"
          id="stat-billing"
        >
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Uncollected Fees</span>
              <h3 className="text-3xl font-extrabold text-slate-950 font-sans">
                ₹{(unpaidInvoiced + overdueInvoiced).toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:scale-105 transition-transform">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <p className="text-xs text-red-600 mt-4 flex items-center gap-1.5 font-medium">
            <span className="font-semibold font-mono bg-red-50 px-1 py-0.5 rounded text-red-600">
              ₹{overdueInvoiced.toLocaleString("en-IN")}
            </span> in overdue statuses needing collections.
          </p>
        </div>
      </div>

      {/* Main Content Sections: Caseload portfolio & Hearing Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Practice Areas / Portfolio Breakout */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-sans">Caseload distribution by Practice Area</h3>
                <p className="text-xs text-slate-500">Comprehensive breakout of corporate counsel cases and federal crimes.</p>
              </div>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </div>

            <div className="space-y-4 my-4">
              {practiceAreasList.map((area) => (
                <div key={area.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${getAreaColor(area.name).replace('bg-indigo', 'bg-blue')}`}></span>
                      {area.name}
                    </span>
                    <span className="text-slate-500 font-medium">{area.count} {area.count > 1 ? "cases" : "case"} ({area.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getAreaColor(area.name).replace('bg-indigo', 'bg-blue')} transition-all duration-500`}
                      style={{ width: `${area.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {practiceAreasList.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  No active/pending case files registered yet.
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center">
            <div className="text-xs text-slate-500 font-medium">
              Total Managed Cases Portfolio: <span className="text-slate-900 font-bold">{cases.length}</span>
            </div>
            <button 
              onClick={() => onNavigate("cases")}
              className="text-blue-600 hover:text-blue-750 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              Manage portfolio <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic calendar - Upcoming Court Hearings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-4 text-amber-600">
              <Calendar className="h-4 w-4" />
              <h3 className="text-lg font-bold text-slate-900">Court Hearing Docket</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-sans leading-relaxed">
              Upcoming hearings and federal motion deadlines compiled from trial court schedules.
            </p>

            <div className="space-y-3">
              {upcomingHearings.map((doc, i) => (
                <div 
                  key={doc.caseId} 
                  onClick={() => onNavigate("cases", doc.caseId)}
                  className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 hover:border-amber-500/40 transition-colors p-3.5 rounded-xl cursor-pointer block"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate max-w-[140px]" title={doc.title}>
                      {doc.title}
                    </h4>
                    <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-mono py-0.5 px-2 rounded-md font-semibold">
                      {new Date(doc.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 truncate font-mono">
                    Ref: {doc.caseNumber}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-sans">
                    <span className="font-semibold text-slate-600">Trial Court:</span> {doc.court}
                  </p>
                </div>
              ))}

              {upcomingHearings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 opacity-70">
                  <CheckCircle className="h-6 w-6 text-emerald-500 mb-2" />
                  <p className="text-xs text-slate-500 font-medium">No imminent hearings scheduled.</p>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-4">
            <button 
              onClick={() => onNavigate("cases")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              View litigation calendars
            </button>
          </div>
        </div>
      </div>

      {/* Immediate Attention: Overdue Receivables & Critical Action tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Out-of-balance Invoices */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-red-600 font-sans font-bold text-sm">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Outstanding Retainers ({billing.filter(b => b.status !== "paid").length})</span>
            </div>
            <button 
              onClick={() => onNavigate("billing")}
              className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Invoice settings
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {billing.filter(b => b.status !== "paid").slice(0, 3).map((bill) => (
              <div key={bill.id} className="py-2.5 flex justify-between items-center text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">{bill.clientName}</div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[200px]" title={bill.caseTitle}>
                    {bill.caseTitle}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-bold text-slate-900">₹{bill.amount.toLocaleString("en-IN")}</div>
                  <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    bill.status === "overdue" ? "bg-red-50 text-red-700 border border-red-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    {bill.status.toUpperCase()} (due {bill.dueDate})
                  </span>
                </div>
              </div>
            ))}
            {billing.filter(b => b.status !== "paid").length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400 font-medium">
                All outstanding ledgers are fully collected. Beautiful!
              </div>
            )}
          </div>
        </div>

        {/* Task Priorities Checklist */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-blue-600 font-sans font-bold text-sm">
              <FileText className="h-4 w-4" />
              <span>High-Priority Action Tasks ({activeHighPriorityTasks.length})</span>
            </div>
            <button 
              onClick={() => onNavigate("tasks")}
              className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Task manager
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {activeHighPriorityTasks.map((t) => (
              <div key={t.id} className="py-2.5 flex justify-between items-center text-xs">
                <div className="space-y-0.5 pr-2">
                  <div className="font-semibold text-slate-900">{t.title}</div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[220px]" title={t.caseTitle}>
                    RefCase: {t.caseTitle}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block font-mono">due {t.dueDate}</span>
                  <span className="inline-block text-[9px] bg-red-50 text-red-700 border border-red-100 font-bold px-1.5 py-0.5 rounded mt-1">
                    HIGH PRIORITY
                  </span>
                </div>
              </div>
            ))}
            {tasks.filter(t => t.status === "pending" && t.priority === "high").length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400 font-medium">
                No outstanding urgent tasks requiring immediate attention.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
