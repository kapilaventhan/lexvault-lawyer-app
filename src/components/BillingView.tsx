import React, { useState } from "react";
import { Billing, Case } from "../types";
import { 
  Plus, 
  IndianRupee, 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Trash2, 
  X,
  Receipt,
  Download,
  Check
} from "lucide-react";

interface BillingViewProps {
  billing: Billing[];
  cases: Case[];
  onAddInvoice: (billingData: Omit<Billing, "id" | "createdAt" | "updatedAt" | "ownerId" | "clientName" | "caseTitle" | "clientId">) => Promise<void>;
  onUpdateInvoiceStatus: (id: string, status: "paid" | "unpaid" | "overdue") => Promise<void>;
  onDeleteInvoice: (id: string) => Promise<void>;
}

export default function BillingView({ billing, cases, onAddInvoice, onUpdateInvoiceStatus, onDeleteInvoice }: BillingViewProps) {
  const [filter, setFilter] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [downloadedInvoiceId, setDownloadedInvoiceId] = useState<string | null>(null);

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

  const handleDownloadInvoice = (bill: Billing) => {
    const textContent = `======================================================================
DOCKETLEGAL CONSOLIDATED TRUST FINANCIAL LEDGER
Invoice issued on: ${bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
Status: ${bill.status.toUpperCase()}
======================================================================

CLIENT NAME:         ${bill.clientName || "N/A"}
CASE INVOLVED:       ${bill.caseTitle || "N/A"}
FEE TOTAL AGREEMENT: ₹${bill.amount.toLocaleString("en-IN")}
TERM DUE DATE:       ${bill.dueDate}

----------------------------------------------------------------------
BILLABLE STATEMENT OF SERVICES RENDERED & PARTICULARS:
----------------------------------------------------------------------
${bill.description || "Unified litigation research advice and administrative courthouse filings support."}

----------------------------------------------------------------------
SYSTEM SECURITY COMPLIANCE:
----------------------------------------------------------------------
Payment must be cleared by due date to prevent deposition timeline issues.
Refer to specific legal Retainer engagement for client billing details.

======================================================================
DocketLegal Portal. System accounting audit trail ledger. Confidential.
======================================================================`;

    try {
      const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const element = document.createElement("a");
      element.setAttribute("href", url);
      element.setAttribute("download", `Invoice_${bill.id.substr(0, 8)}.txt`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      setTimeout(() => {
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      }, 100);

      setDownloadedInvoiceId(bill.id);
      setTimeout(() => setDownloadedInvoiceId(null), 2500);
    } catch (err) {
      // clip fallback
      fallbackCopyText(textContent);
      setDownloadedInvoiceId(bill.id);
      setTimeout(() => setDownloadedInvoiceId(null), 2500);
    }
  };
  
  // New invoice state
  const [newCaseId, setNewCaseId] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newStatus, setNewStatus] = useState<"paid" | "unpaid" | "overdue">("unpaid");
  const [newDueDate, setNewDueDate] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats Calculations
  const collectedTotal = billing.filter(b => b.status === "paid").reduce((sum, item) => sum + item.amount, 0);
  const outstandingTotal = billing.filter(b => b.status === "unpaid").reduce((sum, item) => sum + item.amount, 0);
  const overdueTotal = billing.filter(b => b.status === "overdue").reduce((sum, item) => sum + item.amount, 0);

  const filteredBills = billing.filter(b => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseId || !newAmount || !newDueDate) return;

    try {
      setIsSubmitting(true);
      await onAddInvoice({
        caseId: newCaseId,
        amount: Number(newAmount),
        status: newStatus,
        dueDate: newDueDate,
        description: newDescription
      });

      // Reset
      setNewCaseId("");
      setNewAmount("");
      setNewStatus("unpaid");
      setNewDueDate("");
      setNewDescription("");
      setIsAdding(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, stat: "paid" | "unpaid" | "overdue") => {
    await onUpdateInvoiceStatus(id, stat);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice record from current bookkeeping ledger?")) {
      await onDeleteInvoice(id);
    }
  };

  return (
    <div className="space-y-6" id="billing-management">
      {/* Header section with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 font-sans">Financial Accounting Ledger</h2>
          <p className="text-slate-500 text-xs mt-1">Audit trust accounts, track retainer invoices, and administer collections dockets.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 transition-colors duration-150 shadow-xs cursor-pointer w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Issue New Invoice
        </button>
      </div>

      {/* Financial KPIs Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Collections */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider font-mono">Retainer Fees Collected</span>
            <h4 className="text-2xl font-extrabold text-slate-900 font-sans">₹{collectedTotal.toLocaleString("en-IN")}</h4>
            <p className="text-[10px] text-slate-500">Total credited trust funds settled.</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Outstanding */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider font-mono">Pending Accounts Receivable</span>
            <h4 className="text-2xl font-extrabold text-slate-900 font-sans">₹{outstandingTotal.toLocaleString("en-IN")}</h4>
            <p className="text-[10px] text-slate-500">Active invoices awaiting retainer clearance.</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl shrink-0">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-rose-650 font-bold uppercase tracking-wider font-mono">Overdue AR Debt Balance</span>
            <h4 className="text-2xl font-extrabold text-slate-900 font-sans">₹{overdueTotal.toLocaleString("en-IN")}</h4>
            <p className="text-[10px] text-slate-500">Overdue bills requiring collection advice.</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Ledger filters and Table lists */}
      <div className="bg-white border border-slate-205 rounded-2xl overflow-hidden p-6 shadow-xs space-y-4">
        {/* Row Filter tabs */}
        <div className="flex bg-slate-50 rounded-xl p-1 w-full max-w-sm border border-slate-200 text-xs gap-1 font-sans">
          {[
            { value: "all", label: "Full Ledger" },
            { value: "paid", label: "Paid" },
            { value: "unpaid", label: "Unpaid" },
            { value: "overdue", label: "Overdue" }
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

        {/* ledger grid/list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 font-sans border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400">
                <th className="py-3 px-4 font-bold uppercase tracking-wider font-mono text-[9px]">Client / Case</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider font-mono text-[9px]">Particulars Description</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider font-mono text-[9px]">Agreement Total</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider font-mono text-[9px]">Term Due Date</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider font-mono text-[9px]">Ledger Status</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider font-mono text-[9px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 leading-normal">
              {filteredBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-55/40 transition-colors">
                  <td className="py-4 px-4 space-y-1 max-w-[200px]">
                    <span className="font-bold text-slate-900 block text-sm truncate">{bill.clientName}</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 truncate" title={bill.caseTitle}>
                      <Briefcase className="h-3.5 w-3.5 shrink-0 text-slate-400" /> {bill.caseTitle}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 max-w-[220px] truncate leading-snug" title={bill.description}>
                    {bill.description || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-slate-900 font-extrabold font-mono text-sm">
                    ₹{bill.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-500">
                    {bill.dueDate}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={bill.status}
                      onChange={(e) => handleUpdateStatus(bill.id, e.target.value as any)}
                      className={`text-[9.5px] font-extrabold uppercase tracking-wider border rounded-lg p-1.5 focus:outline-none focus:ring-0 cursor-pointer ${
                        bill.status === "paid" ? "bg-emerald-50 text-emerald-700 border-emerald-250" :
                        bill.status === "unpaid" ? "bg-amber-50 text-amber-700 border-amber-250" :
                        "bg-rose-50 text-rose-700 border-rose-250"
                      }`}
                    >
                      <option value="paid" className="bg-white text-slate-900">PAID</option>
                      <option value="unpaid" className="bg-white text-slate-900">UNPAID</option>
                      <option value="overdue" className="bg-white text-slate-900">OVERDUE</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleDownloadInvoice(bill)}
                      className={`p-1.5 border rounded-lg transition-colors cursor-pointer ${
                        downloadedInvoiceId === bill.id
                          ? "bg-emerald-50 text-emerald-600 border-emerald-205 animate-pulse"
                          : "text-slate-400 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border-slate-100 border"
                      }`}
                      title={downloadedInvoiceId === bill.id ? "Downloaded & Copied" : "Download Ledger Receipt"}
                    >
                      {downloadedInvoiceId === bill.id ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(bill.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="De-register"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredBills.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-slate-400 italic">
                    No matching accounting ledgers recorded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice slide popup */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-205 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4 text-slate-900">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-blue-600" /> Issue Invoice / Trust Bill
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
                <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Case Matter File *</label>
                <select
                  required
                  value={newCaseId}
                  onChange={(e) => setNewCaseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs cursor-pointer"
                >
                  <option value="">Select case docket...</option>
                  {cases.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.clientName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Billing Amount (₹ INR) *</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                      type="number"
                      required
                      placeholder="50000"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 pl-8 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Invoice Term Due Date *</label>
                  <input
                    type="date"
                    required
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Initial Ledger Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs cursor-pointer"
                >
                  <option value="unpaid text-slate-900">Unpaid / Awaiting clearance</option>
                  <option value="paid text-slate-900 font-bold">Paid / Prefunded trust credit</option>
                  <option value="overdue text-slate-900">Overdue / Past balance</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-705 font-bold uppercase tracking-wider text-[10px]">Itemized Ledger Particulars & Description</label>
                <textarea
                  rows={3}
                  placeholder="Preparing brief, corporate bylaws drafting fee, depositions discover, courthouse filing expenses..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder-Slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans leading-relaxed text-xs"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
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
                  {isSubmitting ? "Issuing invoice..." : "Issue invoice Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
