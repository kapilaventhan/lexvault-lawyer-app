import React, { useState } from "react";
import { Client, Case } from "../types";
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Briefcase, 
  MapPin, 
  Building2, 
  X, 
  Trash2,
  ChevronRight,
  UserCheck
} from "lucide-react";

interface ClientsViewProps {
  clients: Client[];
  cases: Case[];
  onAddClient: (client: Omit<Client, "id" | "createdAt" | "updatedAt" | "ownerId">) => Promise<void>;
  onDeleteClient: (id: string) => Promise<void>;
}

export default function ClientsView({ clients, cases, onAddClient, onDeleteClient }: ClientsViewProps) {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Show / Hide Add Client Form Modal
  const [isAdding, setIsAdding] = useState(false);
  
  // New Client Form inputs
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter clients
  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(search.toLowerCase())) ||
      c.phone.includes(search);
    return matchesSearch;
  });

  const getClientCases = (clientId: string) => {
    return cases.filter(c => c.clientId === clientId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddClient({
        name: newName,
        email: newEmail,
        phone: newPhone,
        company: newCompany,
        address: newAddress,
        notes: newNotes
      });
      // Reset inputs
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewCompany("");
      setNewAddress("");
      setNewNotes("");
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this client? This will delete all cases and billing linked to this record!")) {
      await onDeleteClient(id);
      if (selectedClient?.id === id) {
        setSelectedClient(null);
      }
    }
  };

  return (
    <div className="space-y-6" id="clients-view-panel">
      {/* Header section with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">Retained Client Directory</h2>
          <p className="text-slate-500 text-sm mt-1">Directory of individuals, commercial retainers, and associated litigation records.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 transition-colors duration-150 shadow-md shadow-blue-600/10 cursor-pointer w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Enroll New Client
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Clients Directory Index */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search Box bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
            <input
              type="text"
              placeholder="Search clients by name, companies, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans shadow-xs"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {filteredClients.map((client) => {
                const clientCases = getClientCases(client.id);
                const isSelected = selectedClient?.id === client.id;
                
                return (
                  <div 
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`p-4 hover:bg-slate-50 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                      isSelected ? "bg-blue-50/50 border-l-4 border-blue-600 pl-3.5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0 font-sans">
                        {client.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">{client.name}</h4>
                          {client.company && (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium truncate max-w-[120px]">
                              {client.company}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3 shrink-0 text-slate-400" /> {client.email}</span>
                          <span className="flex items-center gap-1"><Phone className="h-3 w-3 shrink-0 text-slate-400" /> {client.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] text-slate-500 block font-sans">Active Matters</span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 py-0.5 px-2 rounded-full mt-1">
                          <Briefcase className="h-3 w-3" /> {clientCases.length}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-405" />
                    </div>
                  </div>
                );
              })}

              {filteredClients.length === 0 && (
                <div className="text-center py-16 px-4">
                  <UserCheck className="h-9 w-9 text-slate-300 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-slate-800">No Clients Found</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto font-medium">
                    Try adjusting your keyword filter, or click "Enroll New Client" to append a legal partner to directories.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Client File View Panel */}
        <div className="lg:col-span-1">
          {selectedClient ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 relative sticky top-6 shadow-xs">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 truncate leading-tight">{selectedClient.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 font-mono">ID: {selectedClient.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDelete(selectedClient.id)}
                    className="p-2 text-slate-500 hover:text-red-600 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Delete Client"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => setSelectedClient(null)}
                    className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-lg transition-colors lg:hidden cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Company & Details Profile */}
              <div className="space-y-4 border-t border-slate-100 pt-4 text-xs font-sans">
                {selectedClient.company && (
                  <div className="flex items-start gap-2.5">
                    <Building2 className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Associated Company</span>
                      <span className="text-slate-800 mt-0.5 block font-semibold">{selectedClient.company}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Email Address</span>
                    <a href={`mailto:${selectedClient.email}`} className="text-blue-600 hover:underline mt-0.5 block font-semibold">{selectedClient.email}</a>
                  </div>
                </div>

                {selectedClient.phone && (
                  <div className="flex items-start gap-2.5">
                    <Phone className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Primary Phone Line</span>
                      <span className="text-slate-800 mt-0.5 block font-mono font-medium">{selectedClient.phone}</span>
                    </div>
                  </div>
                )}

                {selectedClient.address && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-mono tracking-wider">Retained Physical Address</span>
                      <span className="text-slate-700 mt-0.5 block leading-relaxed font-medium">{selectedClient.address}</span>
                    </div>
                  </div>
                )}

                {selectedClient.notes && (
                  <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl mt-2">
                    <span className="text-[10px] text-blue-700 block font-mono uppercase tracking-wider mb-1 font-bold">Special Attorney Notes</span>
                    <p className="text-slate-700 leading-relaxed text-xs">{selectedClient.notes}</p>
                  </div>
                )}
              </div>

              {/* Associated historical legal matters */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider block font-bold">Associated Cases ({getClientCases(selectedClient.id).length})</span>
                <div className="space-y-2">
                  {getClientCases(selectedClient.id).map(c => (
                    <div key={c.id} className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-lg flex justify-between items-center text-xs">
                      <div className="min-w-0 pr-2">
                        <span className="text-[10px] text-slate-500 block font-mono">{c.caseNumber}</span>
                        <h5 className="font-semibold text-slate-800 mt-0.5 truncate">{c.title}</h5>
                      </div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                        c.status === "active" ? "bg-blue-50 text-blue-700 border border-blue-105" :
                        c.status === "pending" ? "bg-amber-50 text-amber-700 border border-amber-105" :
                        c.status === "appealed" ? "bg-red-50 text-red-700 border border-red-105" :
                        "bg-slate-100 text-slate-600 border border-slate-205"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                  {getClientCases(selectedClient.id).length === 0 && (
                    <p className="text-[11px] text-slate-500 italic py-1">No case files associated under this directory file yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 sticky top-6 font-medium shadow-xs">
              Select or check any entry from the Directory to load full retained profiles, address credentials, and associated cases dockets.
            </div>
          )}
        </div>
      </div>

      {/* Enroll Client slide over / modal overlay */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600" /> Enroll Retained client File
              </h3>
              <button 
                onClick={() => setIsAdding(false)} 
                className="p-1.5 hover:bg-slate-100 hover:text-slate-800 text-slate-400 rounded-lg cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">Client Representative Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Indira Sen"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">Contact Email address *</label>
                  <input
                    type="email"
                    required
                    placeholder="indira@apexrealty.in"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">Representative Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 97412 87654"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">Company / Corporation Name</label>
                  <input
                    type="text"
                    placeholder="Apex Commercial Realty Pvt. Ltd."
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">Corporate Physical/Legal Address</label>
                <input
                  type="text"
                  placeholder="Shree Heights, Flat No. 1098, M.G. Road, Bandra West, Mumbai, Maharashtra - 400050"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 font-bold uppercase tracking-wider text-[10px]">General Attorney Onboarding Notes</label>
                <textarea
                  rows={3}
                  placeholder="Insert notes regarding billing schedule, dispute overview, client corporate structure, timelines..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans leading-relaxed"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="bg-slate-105 hover:bg-slate-200 text-slate-800 rounded-lg px-4 py-2 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg px-4 py-2 font-bold transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Enrolling client..." : "Onboard client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
