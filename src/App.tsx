import React, { useState, useEffect } from "react";
import { Client, Case, Billing, Task } from "./types";
import DashboardView from "./components/DashboardView";
import ClientsView from "./components/ClientsView";
import CasesView from "./components/CasesView";
import BillingView from "./components/BillingView";
import TasksView from "./components/TasksView";
import ResearchView from "./components/ResearchView";

import { 
  Scale, 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CreditCard, 
  CheckSquare, 
  Menu, 
  X,
  Plus,
  Compass,
  Building2,
  CalendarDays,
  FileText,
  Download
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [targetCaseId, setTargetCaseId] = useState<string | null>(null);

  // Core Data States
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [billing, setBilling] = useState<Billing[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // App Loading State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Responsive mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic codebase ZIP download state
  const [isDownloadingCode, setIsDownloadingCode] = useState(false);

  // Download entire codebase ZIP handler
  const handleDownloadCodebase = () => {
    setIsDownloadingCode(true);
    try {
      const link = document.createElement("a");
      link.href = "/api/download-zip";
      link.setAttribute("download", "DocketLegal_Codebase_Workspace.zip");
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);
    } catch (err) {
      console.error("Codebase download failed:", err);
    } finally {
      setTimeout(() => setIsDownloadingCode(false), 2000);
    }
  };

  // 1. Fetch data from backend on mount
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      
      const [cliRes, caseRes, billRes, taskRes] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/cases"),
        fetch("/api/billing"),
        fetch("/api/tasks")
      ]);

      if (!cliRes.ok || !caseRes.ok || !billRes.ok || !taskRes.ok) {
        throw new Error("Unable to synchronize firm files from litigation databases.");
      }

      const [cliData, caseData, billData, taskData] = await Promise.all([
        cliRes.json(),
        caseRes.json(),
        billRes.json(),
        taskRes.json()
      ]);

      setClients(cliData);
      setCases(caseData);
      setBilling(billData);
      setTasks(taskData);
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Database synchronization connection timed out.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Tab Navigation helpers with item reference pass
  const handleNavigate = (tab: string, itemRef?: string) => {
    setActiveTab(tab);
    if (itemRef) {
      setTargetCaseId(itemRef);
    } else {
      setTargetCaseId(null);
    }
    setMobileMenuOpen(false);
  };

  // 3. CRUD operation handlers dispatching to full-stack Express
  const handleAddClient = async (cliPayload: Omit<Client, "id" | "createdAt" | "updatedAt" | "ownerId">) => {
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliPayload)
    });
    if (!res.ok) throw new Error("Onboarding failed");
    await fetchData();
  };

  const handleDeleteClient = async (id: string) => {
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Removal failed");
    await fetchData();
  };

  const handleAddCase = async (casePayload: Omit<Case, "id" | "createdAt" | "updatedAt" | "ownerId" | "clientName">) => {
    const res = await fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(casePayload)
    });
    if (!res.ok) throw new Error("Filing docket failed");
    await fetchData();
  };

  const handleDeleteCase = async (id: string) => {
    const res = await fetch(`/api/cases/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erase failed");
    await fetchData();
  };

  const handleAddInvoice = async (billPayload: any) => {
    const res = await fetch("/api/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(billPayload)
    });
    if (!res.ok) throw new Error("Failed to issue invoice to bookkeeping ledger");
    await fetchData();
  };

  const handleUpdateInvoiceStatus = async (id: string, status: "paid" | "unpaid" | "overdue") => {
    const res = await fetch(`/api/billing/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to post transaction update to ledgers");
    await fetchData();
  };

  const handleDeleteInvoice = async (id: string) => {
    const res = await fetch(`/api/billing/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Removal failed");
    await fetchData();
  };

  const handleAddTask = async (taskPayload: any) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskPayload)
    });
    if (!res.ok) throw new Error("Failed to record task deadline compliance");
    await fetchData();
  };

  const handleToggleTask = async (id: string, status: "pending" | "completed") => {
    const res = await fetch(`/api/tasks/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to toggle task checklist");
    await fetchData();
  };

  const handleDeleteTask = async (id: string) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Filing checklist deletion failed");
    await fetchData();
  };

  // Navigations Links List
  const navLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "clients", label: "Clients Directory", icon: Users },
    { id: "cases", label: "Case Dossiers", icon: Briefcase },
    { id: "tasks", label: "Litigation Tasks", icon: CheckSquare },
    { id: "billing", label: "Financial Ledger", icon: CreditCard },
    { id: "research", label: "Case Laws & Sections", icon: Compass }
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col md:flex-row antialiased font-sans flex-1" id="advocate-portal">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0F172A] border-b md:border-b-0 md:border-r border-slate-800 shrink-0 z-20 flex flex-col justify-between shadow-xl">
        <div className="flex flex-col">
          {/* Brand header branding */}
          <div className="p-6 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-white leading-tight uppercase font-mono">DossierLegal</h1>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Consolidated Portal</span>
              </div>
            </div>
            
            {/* Mobile menu triggers */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Navigation Links Links */}
          <nav className={`p-4 space-y-1 md:block ${mobileMenuOpen ? "block" : "hidden"}`}>
            {navLinks.map((link) => {
              const IconComp = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive 
                      ? "bg-blue-600/10 border border-blue-600/20 text-blue-400" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent"
                  }`}
                >
                  <IconComp className={`h-4.5 w-4.5 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                  {link.label}
                </button>
              );
            })}

            {/* Download Codebase Mobile Trigger */}
            <button
              onClick={handleDownloadCodebase}
              disabled={isDownloadingCode}
              className="w-full flex md:hidden items-center gap-3 px-3.5 py-2.5 mt-4 text-xs font-bold text-slate-100 bg-blue-600 hover:bg-blue-500 rounded-xl tracking-wide transition-all cursor-pointer shadow-md"
            >
              <Download className={`h-4.5 w-4.5 ${isDownloadingCode ? "animate-bounce" : ""}`} />
              {isDownloadingCode ? "Bundling ZIP..." : "Download Code ZIP"}
            </button>
          </nav>
        </div>

        {/* Codebase Export Section (Desktop) */}
        <div className="p-4 border-t border-slate-800/65 hidden md:block">
          <button
            onClick={handleDownloadCodebase}
            disabled={isDownloadingCode}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wide rounded-xl shadow-md transition-all cursor-pointer border border-blue-500/20 disabled:opacity-75"
          >
            <Download className={`h-4 w-4 ${isDownloadingCode ? "animate-spin" : ""}`} />
            {isDownloadingCode ? "Compiling ZIP Code..." : "Download Workspace ZIP"}
          </button>
        </div>

        {/* Lawyer identity card */}
        <div className="p-4 border-t border-slate-850 hidden md:block">
          <div className="bg-[#1E293B] border border-slate-700/60 rounded-xl p-3.5 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center font-mono text-xs uppercase shadow-sm">
              LA
            </div>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-white block truncate leading-tight">Lead Advocate</span>
              <span className="text-[10px] text-slate-500 block truncate uppercase tracking-widest font-bold font-mono">Bar ID: 25GEFPAZ</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main workspaces panel */}
      <main className="flex-1 min-h-0 overflow-y-auto bg-[#F1F5F9] p-4 sm:p-6 lg:p-8 relative">
        {/* Connection status warning */}
        {errorMsg && (
          <div className="mb-6 bg-rose-500/15 border border-rose-500/30 rounded-xl p-4 flex justify-between items-center text-xs text-rose-800">
            <span>{errorMsg}</span>
            <button onClick={fetchData} className="font-bold underline uppercase tracking-wider text-[10px] cursor-pointer hover:text-rose-950">Retry Connection</button>
          </div>
        )}

        {/* Spinner Loader overlay */}
        {isLoading ? (
          <div className="absolute inset-0 bg-[#F1F5F9]/85 backdrop-blur-xs flex flex-col items-center justify-center z-10 font-sans">
            <div className="h-10 w-10 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-slate-600 text-xs font-semibold mt-4">Retrieving litigation archives & trust dockets...</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === "dashboard" && (
              <DashboardView 
                clients={clients} 
                cases={cases} 
                billing={billing} 
                tasks={tasks}
                onNavigate={handleNavigate}
              />
            )}
            
            {activeTab === "clients" && (
              <ClientsView 
                clients={clients}
                cases={cases} 
                onAddClient={handleAddClient}
                onDeleteClient={handleDeleteClient}
              />
            )}

            {activeTab === "cases" && (
              <CasesView 
                cases={cases}
                clients={clients}
                onAddCase={handleAddCase}
                onDeleteCase={handleDeleteCase}
                initialSelectedCaseId={targetCaseId}
              />
            )}

            {activeTab === "billing" && (
              <BillingView 
                billing={billing}
                cases={cases}
                onAddInvoice={handleAddInvoice}
                onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
                onDeleteInvoice={handleDeleteInvoice}
              />
            )}

            {activeTab === "tasks" && (
              <TasksView 
                tasks={tasks}
                cases={cases}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            )}

            {activeTab === "research" && (
              <ResearchView 
                cases={cases}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
