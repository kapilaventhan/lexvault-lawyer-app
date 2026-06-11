import React, { useState, useEffect } from "react";
import { Case, Client } from "../types";
import Markdown from "react-markdown";
import { 
  Search, 
  Plus, 
  Briefcase, 
  Scale, 
  Calendar, 
  User, 
  Cpu, 
  FileText, 
  Copy, 
  Check, 
  Trash2, 
  X, 
  Clock, 
  CheckSquare, 
  Info,
  IndianRupee,
  ChevronDown,
  Loader2,
  Download
} from "lucide-react";

interface CasesViewProps {
  cases: Case[];
  clients: Client[];
  onAddCase: (caseData: Omit<Case, "id" | "createdAt" | "updatedAt" | "ownerId" | "clientName">) => Promise<void>;
  onDeleteCase: (id: string) => Promise<void>;
  initialSelectedCaseId?: string | null;
}

export default function CasesView({ cases, clients, onAddCase, onDeleteCase, initialSelectedCaseId }: CasesViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  
  // Selected Case
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  // If initial case ID passed from Dashboard hearing list, auto select it on load
  useEffect(() => {
    if (initialSelectedCaseId) {
      const match = cases.find(c => c.id === initialSelectedCaseId);
      if (match) setSelectedCase(match);
    } else if (cases.length > 0 && !selectedCase) {
      setSelectedCase(cases[0]);
    }
  }, [initialSelectedCaseId, cases]);

  // Modals / Overlays
  const [isAdding, setIsAdding] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [downloadedBrief, setDownloadedBrief] = useState(false);
  const [downloadedDraft, setDownloadedDraft] = useState(false);

  // AI states
  const [aiBrief, setAiBrief] = useState<string | null>(null);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("Cease & Desist Letter");
  const [aiDraft, setAiDraft] = useState<string | null>(null);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);

  // New Case Inputs
  const [newCaseNumber, setNewCaseNumber] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newClientId, setNewClientId] = useState("");
  const [newStatus, setNewStatus] = useState<"active" | "pending" | "closed" | "appealed">("active");
  const [newPracticeArea, setNewPracticeArea] = useState<"Corporate" | "Criminal" | "Family" | "Intellectual Property" | "Labor" | "Real Estate" | "Other">("Corporate");
  const [newCourt, setNewCourt] = useState("");
  const [newJudge, setNewJudge] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newOppositionName, setNewOppositionName] = useState("");
  const [newOppositionLawyer, setNewOppositionLawyer] = useState("");
  const [newNextHearingDate, setNewNextHearingDate] = useState("");
  const [newBillingType, setNewBillingType] = useState<"Hourly" | "Flat Fee" | "Contingency">("Hourly");
  const [newBillingRate, setNewBillingRate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter cases index
  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.court.toLowerCase().includes(search.toLowerCase()) ||
      c.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesArea = areaFilter === "all" || c.practiceArea === areaFilter;

    return matchesSearch && matchesStatus && matchesArea;
  });

  // Calculate Brief & Draft
  const handleGenerateBrief = async (caseId: string) => {
    try {
      setIsGeneratingBrief(true);
      setAiBrief(null);
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId })
      });
      const data = await res.json();
      if (res.ok) {
        setAiBrief(data.summary);
      } else {
        setAiBrief(`### ERROR GENERATING BRIEF\n\n${data.error || "Please verify your integration backend connection."}`);
      }
    } catch (error) {
      setAiBrief(`### SYSTEM CONNECTION FAULT\n\nFailed to establish client connection with full-stack Express server endpoints.`);
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const handleGenerateDraft = async (caseId: string, docType: string) => {
    try {
      setIsGeneratingDraft(true);
      setAiDraft(null);
      const res = await fetch("/api/ai/draft-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, docType })
      });
      const data = await res.json();
      if (res.ok) {
        setAiDraft(data.draft);
      } else {
        setAiDraft(`### ERROR DRAFTING DOCUMENT\n\n${data.error || "Check backend Express logs."}`);
      }
    } catch (error) {
      setAiDraft(`### PIPELINE ERROR\n\nFailed to dispatch prompt headers to server.`);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
    document.body.removeChild(textArea);
  };

  const handleCopyText = (text: string, isBrief: boolean) => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      } else {
        fallbackCopyText(text);
      }
    } catch (e) {
      fallbackCopyText(text);
    }

    if (isBrief) {
      setCopiedBrief(true);
      setTimeout(() => setCopiedBrief(false), 2000);
    } else {
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2000);
    }
  };

  const handleDownloadText = (text: string, filename: string, isBrief: boolean) => {
    try {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const element = document.createElement("a");
      element.setAttribute("href", url);
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      setTimeout(() => {
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      }, 100);

      if (isBrief) {
        setDownloadedBrief(true);
        setTimeout(() => setDownloadedBrief(false), 2000);
      } else {
        setDownloadedDraft(true);
        setTimeout(() => setDownloadedDraft(false), 2000);
      }
    } catch (err) {
      console.error("Download failed, using copy fallback:", err);
      // Fallback copy to clipboard in case block/sandbox
      handleCopyText(text, isBrief);
      if (isBrief) {
        setDownloadedBrief(true);
        setTimeout(() => setDownloadedBrief(false), 2000);
      } else {
        setDownloadedDraft(true);
        setTimeout(() => setDownloadedDraft(false), 2000);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseNumber.trim() || !newTitle.trim() || !newClientId) return;

    try {
      setIsSubmitting(true);
      await onAddCase({
        caseNumber: newCaseNumber,
        title: newTitle,
        clientId: newClientId,
        status: newStatus,
        practiceArea: newPracticeArea,
        court: newCourt || "N/A",
        judge: newJudge,
        description: newDescription,
        oppositionName: newOppositionName,
        oppositionLawyer: newOppositionLawyer,
        nextHearingDate: newNextHearingDate || undefined,
        billingType: newBillingType,
        billingRate: newBillingRate ? Number(newBillingRate) : undefined
      });

      // Reset
      setNewCaseNumber("");
      setNewTitle("");
      setNewClientId("");
      setNewCourt("");
      setNewJudge("");
      setNewDescription("");
      setNewOppositionName("");
      setNewOppositionLawyer("");
      setNewNextHearingDate("");
      setNewBillingRate("");
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Verify litigation files: Are you sure you want to permanently erase this case dossier and its associated accounting?")) {
      await onDeleteCase(id);
      setSelectedCase(null);
    }
  };

  // Switch Selected Case cleans up previous AI drafts
  const handleCaseSelect = (item: Case) => {
    setSelectedCase(item);
    setAiBrief(null);
    setAiDraft(null);
  };

  return (
    <div className="space-y-6" id="cases-workspace">
      {/* Header section with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Litigation & Matter Dockets</h2>
          <p className="text-slate-500 text-sm mt-1">Manage corporate agreements, criminal representations, and dynamic court diaries.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 transition-colors duration-150 shadow-md shadow-blue-600/10 cursor-pointer w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Create Case Docket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Case Index Side panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Filters */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3 shadow-xs">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by Title, Ref, Court..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-250 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            {/* Select categories */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Status</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-550 border border-slate-200 rounded-lg p-1.5 text-slate-700 focus:outline-none text-xs"
                >
                  <option value="all">Unfiltered Docs</option>
                  <option value="active">Active Matters</option>
                  <option value="pending">Pending Cases</option>
                  <option value="closed">Completed Cases</option>
                  <option value="appealed">Appealed Cases</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Practice Field</span>
                <select 
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="w-full bg-slate-550 border border-slate-200 rounded-lg p-1.5 text-slate-700 focus:outline-none text-xs"
                >
                  <option value="all">All Fields</option>
                  <option value="Corporate">Corporate law</option>
                  <option value="Criminal">Criminal</option>
                  <option value="Family">Family Law</option>
                  <option value="Intellectual Property">Patent & IP</option>
                  <option value="Labor">Employment</option>
                  <option value="Real Estate">Property</option>
                  <option value="Other">Miscellaneous</option>
                </select>
              </div>
            </div>
          </div>

          {/* List index cards */}
          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
            {filteredCases.map(item => {
              const currSelected = selectedCase?.id === item.id;
              return (
                <div 
                  key={item.id}
                  onClick={() => handleCaseSelect(item)}
                  className={`border hover:bg-slate-50 hover:border-slate-300 transition-all rounded-xl p-3.5 cursor-pointer flex flex-col font-sans relative shadow-sm ${
                    currSelected 
                      ? "bg-blue-50/55 border-blue-600 ring-1 ring-blue-600/30" 
                      : "bg-white border-slate-200 text-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[9px] font-mono font-bold uppercase text-blue-600 tracking-wider">
                      {item.caseNumber}
                    </span>
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.status === "active" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                      item.status === "pending" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                      item.status === "appealed" ? "bg-red-50 text-red-700 border border-red-100" :
                      "bg-slate-100 text-slate-650"
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-1.5 line-clamp-1 leading-normal" title={item.title}>
                    {item.title}
                  </h4>

                  <div className="flex items-center gap-1.5 mt-3 text-[10px] text-slate-500">
                    <User className="h-3 w-3 shrink-0 text-slate-400" />
                    <span className="truncate">Client: <span className="font-semibold text-slate-800">{item.clientName}</span></span>
                  </div>

                  {item.nextHearingDate && (
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-amber-700 font-mono font-semibold">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span>Hearing: {item.nextHearingDate}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredCases.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-xs font-medium bg-white rounded-xl border border-dashed border-slate-200">
                No legal files matched your filter query.
              </div>
            )}
          </div>
        </div>

        {/* Selected Dossier details + AI legal suite */}
        <div className="lg:col-span-8 space-y-6">
          {selectedCase ? (
            <div className="space-y-6">
              {/* Central Details Card Container */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
                {/* ID Header card */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider">{selectedCase.caseNumber}</span>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">{selectedCase.title}</h3>
                    <p className="text-xs text-slate-500">Practice Area: <b className="text-slate-800">{selectedCase.practiceArea}</b></p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold block rounded-lg px-2.5 py-1 bg-slate-100 text-slate-700 font-mono">
                      Ref: {selectedCase.billingType} (₹{(selectedCase.billingRate || 0).toLocaleString("en-IN")})
                    </span>
                    <button
                      onClick={() => handleDelete(selectedCase.id)}
                      className="p-2 text-slate-500 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                      title="Erase Dossier"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Core Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-normal font-sans">
                  {/* Case Details */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block font-bold">Client representative</span>
                      <p className="font-bold text-slate-900 text-sm">{selectedCase.clientName}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block font-bold">Litigator Trial Court</span>
                      <p className="text-slate-800 font-medium">{selectedCase.court}</p>
                    </div>

                    {selectedCase.judge && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block font-bold">Presiding Trial Judge</span>
                        <p className="text-slate-800 font-serif italic text-sm">{selectedCase.judge}</p>
                      </div>
                    )}
                  </div>

                  {/* Opponent Details */}
                  <div className="bg-slate-50 border border-slate-250 p-4 rounded-xl space-y-3.5">
                    <h5 className="text-[10px] text-amber-700 font-mono uppercase tracking-wider font-bold flex items-center gap-1">
                      <Info className="h-3.5 w-3.5 text-amber-600" /> Opposing Party Counsel
                    </h5>
                    
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-505 block">Adversary Party</span>
                      <p className="font-bold text-slate-800">{selectedCase.oppositionName || "Unknown party"}</p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-505 block">Lead Opposition Litigator</span>
                      <p className="font-bold text-slate-700 font-mono">{selectedCase.oppositionLawyer || "Unknown"}</p>
                    </div>
                  </div>
                </div>

                {/* Long description text box */}
                <div className="space-y-2 border-t border-slate-100 pt-4 text-xs font-sans">
                  <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block font-bold">Case Synopsis & Dispute Particulars</span>
                  <p className="text-slate-705 leading-relaxed bg-slate-50 border border-slate-150 p-4 rounded-xl leading-relaxed whitespace-pre-wrap">{selectedCase.description}</p>
                </div>
              </div>

              {/* Gemini AI Intelligence panel suite */}
              <div className="bg-white border border-blue-200 rounded-2xl relative overflow-hidden p-6 space-y-6 shadow-xs ring-1 ring-blue-50/50">
                <div className="absolute top-0 right-0 p-3 text-blue-600/5">
                  <Cpu className="h-20 w-20" />
                </div>

                <div className="flex items-center gap-2 relative">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-[0_0_10px_2px_rgba(37,99,235,0.4)]"></span>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-blue-700 font-mono">Gemini Legal AI Assistant</h4>
                </div>

                {/* Sub Action Tabs divider */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative items-start font-sans">
                  {/* Action 1: Brief Generator */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Scale className="h-4 w-4 text-slate-500" /> Executive Case Brief Summarizer
                      </h5>
                      <p className="text-slate-500 text-[11px] leading-snug">
                        Use Gemini to summarize long dispute narratives, outline legal hurdles, and recommend next defense maneuvers.
                      </p>
                    </div>

                    <button
                      onClick={() => handleGenerateBrief(selectedCase.id)}
                      disabled={isGeneratingBrief}
                      className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isGeneratingBrief ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Drafting brief details...
                        </>
                      ) : "Generate Litigation Brief Summary"}
                    </button>
                  </div>

                  {/* Action 2: Document templates writer */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-slate-500" /> Legal Document Template Drafter
                      </h5>
                      <p className="text-slate-500 text-[11px] leading-snug">
                        Generate comprehensive retainers, notices, letters, or motions tailored with client names, dates, and court credentials.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={selectedDocType}
                        onChange={(e) => setSelectedDocType(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-[11px] text-slate-700 focus:outline-none shrink-0 cursor-pointer"
                      >
                        <option>Cease & Desist Letter</option>
                        <option>Formal Demand Letter</option>
                        <option>Engagement Retainer</option>
                        <option>Motion to Extend Discovery</option>
                      </select>

                      <button
                        onClick={() => handleGenerateDraft(selectedCase.id, selectedDocType)}
                        disabled={isGeneratingDraft}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2 px-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                      >
                        {isGeneratingDraft ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Compiling document...
                          </>
                        ) : "Draft Document"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Results Output Container */}
                {(aiBrief || aiDraft) && (
                  <div className="border-t border-slate-100 pt-5 space-y-4 relative font-sans leading-relaxed">
                    {/* Render Case Brief */}
                    {aiBrief && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-blue-50/60 p-3 rounded-t-xl border-l-4 border-blue-600 border border-slate-100">
                          <span className="text-[10px] text-blue-800 font-bold uppercase tracking-wider font-mono">Litigation Brief Output Ledger</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleCopyText(aiBrief, true)}
                              className="text-[11px] text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer font-bold"
                            >
                              {copiedBrief ? (
                                <><Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!</>
                              ) : (
                                <><Copy className="h-3.5 w-3.5" /> Copy Brief</>
                              )}
                            </button>
                            <button
                              onClick={() => handleDownloadText(aiBrief, `${selectedCase.caseNumber || "Case"}_Brief.txt`, true)}
                              className="text-[11px] text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer font-bold"
                            >
                              {downloadedBrief ? (
                                <><Check className="h-3.5 w-3.5 text-emerald-600" /> Downloaded!</>
                              ) : (
                                <><Download className="h-3.5 w-3.5" /> Download Brief</>
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="prose prose-slate max-w-none text-xs text-slate-700 bg-slate-50 border border-slate-200 p-5 rounded-b-xl overflow-x-auto max-h-[40vh] overflow-y-auto leading-relaxed markdown-container font-sans">
                          <Markdown>{aiBrief}</Markdown>
                        </div>
                      </div>
                    )}

                    {/* Render Document Draft */}
                    {aiDraft && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-amber-50/60 p-3 rounded-t-xl border-l-4 border-amber-500 border border-slate-100">
                          <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider font-mono">Generated Template: {selectedDocType}</span>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleCopyText(aiDraft, false)}
                              className="text-[11px] text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer font-bold"
                            >
                              {copiedDraft ? (
                                <><Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!</>
                              ) : (
                                <><Copy className="h-3.5 w-3.5" /> Copy Template</>
                              )}
                            </button>
                            <button
                              onClick={() => handleDownloadText(aiDraft, `${selectedCase.caseNumber || "Case"}_${selectedDocType.replace(/\s+/g, "_")}.txt`, false)}
                              className="text-[11px] text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer font-bold"
                            >
                              {downloadedDraft ? (
                                <><Check className="h-3.5 w-3.5 text-emerald-600" /> Downloaded!</>
                              ) : (
                                <><Download className="h-3.5 w-3.5" /> Download Template</>
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="prose prose-slate max-w-none text-xs text-slate-700 bg-slate-50 border border-slate-200 p-5 rounded-b-xl overflow-x-auto max-h-[40vh] overflow-y-auto leading-relaxed font-serif markdown-container">
                          <Markdown>{aiDraft}</Markdown>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center text-xs text-slate-500 font-medium shadow-xs">
              Select or register an active matter case dossier from the left index panel to inspect litigation summaries, hearings, and utilize Gemini Legal AI.
            </div>
          )}
        </div>
      </div>

      {/* Slide overlay - Add Case Form */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" /> Create Corporate/Litigation case file
              </h3>
              <button 
                onClick={() => setIsAdding(false)} 
                className="p-1.5 hover:bg-slate-100 hover:text-slate-805 text-slate-400 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Case Reference Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="SF-2026-CV-9812"
                    value={newCaseNumber}
                    onChange={(e) => setNewCaseNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Litigation Title / Matter Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nexus Tech vs Horizon AI Software Patent Dispute"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Associate Retained Client *</label>
                  <select
                    required
                    value={newClientId}
                    onChange={(e) => setNewClientId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs cursor-pointer"
                  >
                    <option value="">Select client...</option>
                    {clients.map(cli => (
                      <option key={cli.id} value={cli.id}>{cli.name} ({cli.company || "Individual"})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Practice Area *</label>
                  <select
                    value={newPracticeArea}
                    onChange={(e) => setNewPracticeArea(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs cursor-pointer"
                  >
                    <option value="Corporate">Corporate Law</option>
                    <option value="Criminal">Criminal Law</option>
                    <option value="Family">Family Law</option>
                    <option value="Intellectual Property">Patent & IP</option>
                    <option value="Labor">Employment</option>
                    <option value="Real Estate">Property Law</option>
                    <option value="Other">Miscellaneous</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Litigation Status *</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-955 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                    <option value="appealed">Appealed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Presiding Trial Court Location</label>
                  <input
                    type="text"
                    placeholder="Bombay High Court, Fort, Mumbai"
                    value={newCourt}
                    onChange={(e) => setNewCourt(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Assigned Trial Judge Name</label>
                  <input
                    type="text"
                    placeholder="Hon'ble Justice G.S. Patel"
                    value={newJudge}
                    onChange={(e) => setNewJudge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-serif italic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Opposition Party Name</label>
                  <input
                    type="text"
                    placeholder="Horizon Artificial Intelligence Pvt. Ltd."
                    value={newOppositionName}
                    onChange={(e) => setNewOppositionName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Lead Opposition litigator</label>
                  <input
                    type="text"
                    placeholder="Senior Advocate Harish Salve"
                    value={newOppositionLawyer}
                    onChange={(e) => setNewOppositionLawyer(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Next Hearing Date</label>
                  <input
                    type="date"
                    value={newNextHearingDate}
                    onChange={(e) => setNewNextHearingDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Billing Retainer Agreement</label>
                  <select
                    value={newBillingType}
                    onChange={(e) => setNewBillingType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs cursor-pointer font-sans"
                  >
                    <option value="Hourly">Hourly rate</option>
                    <option value="Flat Fee">Flat Fee Agreement</option>
                    <option value="Contingency">Contingency Settlement</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Agreement Rate (₹ Amount)</label>
                  <input
                    type="number"
                    placeholder="35000"
                    value={newBillingRate}
                    onChange={(e) => setNewBillingRate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Case Synopsis & Technical Dispute Particulars</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Insert rich details of the dispute, breach contracts cited, events timelines, claims or damages demanded. This synopsis is analyzed to customize AI litigation summaries."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-950 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans leading-relaxed text-xs"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-105">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-slate-100 hover:bg-slate-205 text-slate-800 rounded-lg px-4 py-2 font-bold transition-colors cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg px-4 py-2 font-bold transition-colors cursor-pointer text-xs shadow-xs"
                >
                  {isSubmitting ? "Generating Dossier..." : "Onboard Case Folder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
