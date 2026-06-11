import fs from "fs";
import path from "path";

// Define Data Types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  clientId: string;
  clientName: string;
  status: "active" | "pending" | "closed" | "appealed";
  practiceArea: "Corporate" | "Criminal" | "Family" | "Intellectual Property" | "Labor" | "Real Estate" | "Other";
  court: string;
  judge?: string;
  description: string;
  oppositionName?: string;
  oppositionLawyer?: string;
  nextHearingDate?: string;
  billingType: "Hourly" | "Flat Fee" | "Contingency";
  billingRate?: number;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface Billing {
  id: string;
  caseId: string;
  caseTitle: string;
  clientId: string;
  clientName: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue";
  dueDate: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface Task {
  id: string;
  caseId: string;
  caseTitle: string;
  title: string;
  dueDate: string;
  status: "pending" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface StatutorySection {
  id: string;
  actName: string;
  sectionNumber: string;
  title: string;
  description: string;
  keyKeywords: string[];
  category: string;
  chapterName?: string;
  explanationsProvisos?: string;
  amendmentsNotifications?: string;
  schedules?: string;
}

export interface CaseLaw {
  id: string;
  caseName: string;
  citation: string;
  court: string;
  judgmentDate: string;
  summary: string;
  keyPrinciples: string[];
  applicableSections: string[];
  relatedPrecedents: string[];
  category: string;
  isLandmark: boolean;
  recentUpdate?: string;
  judgeName?: string;
}

interface DatabaseSchema {
  clients: Client[];
  cases: Case[];
  billing: Billing[];
  tasks: Task[];
  customStatutorySections?: StatutorySection[];
  customCaseLaws?: CaseLaw[];
  cachedStatutorySections?: StatutorySection[];
  cachedCaseLaws?: CaseLaw[];
}

const DB_FILE = path.join(process.cwd(), "db.json");

// Intial Rich Pre-populated Legal Data
const initialData: DatabaseSchema = {
  clients: [
    {
      id: "cli_1",
      name: "Devendra Sharma",
      email: "devendra.sharma@nexustech.co.in",
      phone: "+91 98100 23456",
      company: "Nexus Telecom Solutions India Pvt. Ltd.",
      address: "Plot No. 472, Sector 5, Hitec City, Hyderabad, Telangana - 500081",
      notes: "Ongoing advisory on venture financing and Indian Company Law compliance. Preparing for Series B. Highly responsive client.",
      createdAt: new Date("2026-01-15T09:00:00Z").toISOString(),
      updatedAt: new Date("2026-01-15T09:00:00Z").toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "cli_2",
      name: "Indira Sen",
      email: "indira.sen@apexrealty.in",
      phone: "+91 97412 87654",
      company: "Apex Commercial Realty Pvt. Ltd.",
      address: "Shree Heights, Flat No. 1098, M.G. Road, Bandra West, Mumbai, Maharashtra - 400050",
      notes: "Lease violation dispute regarding commercial retail space at Bandra West. Needs defense under CPC and local Rent Control Acts.",
      createdAt: new Date("2026-02-10T10:30:00Z").toISOString(),
      updatedAt: new Date("2026-02-10T10:30:00Z").toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "cli_3",
      name: "Anish Gupta",
      email: "legal@anishgupta-ventures.in",
      phone: "+91 91234 56789",
      company: "AG Capital Holdings Limited",
      address: "88, Nariman Point, Marine Drive, Mumbai, Maharashtra - 400021",
      notes: "Corporate governance advisory under SEBI guidelines. Preferred billing terms: monthly retainer + flat fee per NCLT filing.",
      createdAt: new Date("2026-03-05T14:15:00Z").toISOString(),
      updatedAt: new Date("2026-03-05T14:15:00Z").toISOString(),
      ownerId: "lawyer_1"
    }
  ],
  cases: [
    {
      id: "case_1",
      caseNumber: "MH-25-ICA-9812",
      title: "Nexus Telecom vs. Horizon AI Software Intellectual Property Dispute",
      clientId: "cli_1",
      clientName: "Devendra Sharma",
      status: "active",
      practiceArea: "Intellectual Property",
      court: "Bombay High Court",
      judge: "Hon'ble Justice G.S. Patel",
      description: "Patent infringement action under Section 64 of the Patents Act, 1970 against Horizon Inc. regarding neural network rendering patents. Horizon claims prior art from 2023. Our engineering reports indicate clear structural derivative code in Horizon's production models. Seeking permanent injunction and damages.",
      oppositionName: "Horizon Artificial Intelligence Pvt. Ltd.",
      oppositionLawyer: "Senior Advocate Harish Salve, Shardul Amarchand Mangaldas",
      nextHearingDate: "2026-07-22",
      billingType: "Hourly",
      billingRate: 35000,
      createdAt: new Date("2026-01-18T11:00:00Z").toISOString(),
      updatedAt: new Date("2026-05-12T16:00:00Z").toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "case_2",
      caseNumber: "MH-50-CS-1093",
      title: "Apex Commercial Lease Breach & Subtenant Eviction",
      clientId: "cli_2",
      clientName: "Indira Sen",
      status: "active",
      practiceArea: "Real Estate",
      court: "City Civil Court, Dindoshi, Mumbai",
      judge: "Hon'ble Judge R.V. Sawant",
      description: "Lease breach action under Section 108 of the Transfer of Property Act, 1882 for unauthorized sub-letting of commercial premises at Bandra West. The sub-tenant is running a hazardous material storage service in breach of Section 12-C of the prime lease agreement. Demanding immediate cure or vacant possession.",
      oppositionName: "Bandra Retailers Syndicate & Subtenants",
      oppositionLawyer: "Advocate Rohit Patil, Patil Chambers",
      nextHearingDate: "2026-06-28",
      billingType: "Flat Fee",
      billingRate: 450000,
      createdAt: new Date("2026-02-12T09:00:00Z").toISOString(),
      updatedAt: new Date("2026-04-03T10:20:00Z").toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "case_3",
      caseNumber: "DEL-NCLT-4820",
      title: "SEBI Compliance Advisory & NCLT Reorganization",
      clientId: "cli_3",
      clientName: "Anish Gupta",
      status: "pending",
      practiceArea: "Corporate",
      court: "National Company Law Tribunal (NCLT), New Delhi Bench",
      judge: "Hon'ble President Ramalingam Sudhakar",
      description: "Advising AG Corporate Holdings on regulatory compliance following SEBI's updated Insider Trading regulations. Drafting customized fiduciary duty compliance protocols under Companies Act, 2013 and reorganizing board audit committee bylaws to safeguard stakeholder representation.",
      oppositionName: "Registrar of Companies (RoC), Delhi",
      oppositionLawyer: "Additional Solicitor General of India",
      nextHearingDate: "2026-08-05",
      billingType: "Contingency",
      billingRate: 1500000,
      createdAt: new Date("2026-03-08T15:30:00Z").toISOString(),
      updatedAt: new Date("2026-03-08T15:30:00Z").toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "case_4",
      caseNumber: "DEL-CR-3104",
      title: "State of Maharashtra v. Rajesh Mehta & Ors.",
      clientId: "cli_2",
      clientName: "Indira Sen",
      status: "closed",
      practiceArea: "Criminal",
      court: "Sessions Court, Fort, Mumbai",
      judge: "Hon'ble Judge S.K. Kotwal",
      description: "Defense of director Rajesh Mehta on charges of felony insider trading and criminal breach of trust under the Indian Penal Code / Bharatiya Nyaya Sanhita (BNS), relative to Apex stock price changes during late 2025. Resulted in a negotiated compounding of offense and administrative penalty. Closed successfully with no imprisonment.",
      oppositionName: "State of Maharashtra represented by Special Public Prosecutor",
      oppositionLawyer: "Advocate General of Maharashtra",
      nextHearingDate: undefined,
      billingType: "Hourly",
      billingRate: 40000,
      createdAt: new Date("2025-10-10T10:00:00Z").toISOString(),
      updatedAt: new Date("2026-03-01T17:00:00Z").toISOString(),
      ownerId: "lawyer_1"
    }
  ],
  billing: [
    {
      id: "bill_1",
      caseId: "case_1",
      caseTitle: "Nexus Telecom vs. Horizon AI Software Intellectual Property Dispute",
      clientId: "cli_1",
      clientName: "Devendra Sharma",
      amount: 1450000,
      status: "paid",
      dueDate: "2026-04-30",
      description: "Pre-trial preparation: written statements, documentary discovery files submission, and expert consultant reviews.",
      createdAt: new Date("2026-04-01T10:00:00Z").toISOString(),
      updatedAt: new Date("2026-04-20T16:30:00Z").toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "bill_2",
      caseId: "case_1",
      caseTitle: "Nexus Telecom vs. Horizon AI Software Intellectual Property Dispute",
      clientId: "cli_1",
      clientName: "Devendra Sharma",
      amount: 675000,
      status: "unpaid",
      dueDate: "2026-06-25",
      description: "Drafting of response to Horizon's motion for summary judgment and claim construction replication briefing.",
      createdAt: new Date("2026-05-20T11:00:00Z").toISOString(),
      updatedAt: new Date("2026-05-20T11:00:00Z").toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "bill_3",
      caseId: "case_2",
      caseTitle: "Apex Commercial Lease Breach & Subtenant Eviction",
      clientId: "cli_2",
      clientName: "Indira Sen",
      amount: 450000,
      status: "overdue",
      dueDate: "2026-05-15",
      description: "Flat fee retainer for lease violation formal filing in Mumbai City Civil Court, court appearance fee, and draft eviction notices.",
      createdAt: new Date("2026-04-10T09:00:00Z").toISOString(),
      updatedAt: new Date("2026-04-10T09:00:00Z").toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "bill_4",
      caseId: "case_4",
      caseTitle: "State of Maharashtra v. Rajesh Mehta & Ors.",
      clientId: "cli_2",
      clientName: "Indira Sen",
      amount: 2100000,
      status: "paid",
      dueDate: "2026-03-15",
      description: "Criminal defense representation, compounding agreement finalization, and formal closing administrative logs.",
      createdAt: new Date("2026-03-01T09:00:00Z").toISOString(),
      updatedAt: new Date("2026-03-10T14:45:00Z").toISOString(),
      ownerId: "lawyer_1"
    }
  ],
  tasks: [
    {
      id: "task_1",
      caseId: "case_1",
      caseTitle: "Nexus Telecom vs. Horizon AI Software Intellectual Property Dispute",
      title: "Submit Neural Network Code expert reports to Bombay High Court Civil registry",
      dueDate: "2026-06-15",
      status: "pending",
      priority: "high",
      createdAt: new Date("2026-05-10T10:00:00Z").toISOString(),
      updatedAt: new Date("2026-05-10T10:00:00Z").toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "task_2",
      caseId: "case_2",
      caseTitle: "Apex Commercial Lease Breach & Subtenant Eviction",
      title: "File proof of service of Eviction Notice on commercial sub-tenants under Rent Control Act",
      dueDate: "2026-06-12",
      status: "pending",
      priority: "high",
      createdAt: new Date("2026-05-12T09:00:00Z").toISOString(),
      updatedAt: new Date("2026-05-12T09:00:00Z").toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "task_3",
      caseId: "case_1",
      caseTitle: "Nexus Telecom vs. Horizon AI Software Intellectual Property Dispute",
      title: "Prepare Devendra Sharma (client) deposition speaking points for Chief Examination",
      dueDate: "2026-06-22",
      status: "pending",
      priority: "medium",
      createdAt: new Date("2026-05-15T14:00:00Z").toISOString(),
      updatedAt: new Date("2026-05-15T14:00:00Z").toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "task_4",
      caseId: "case_3",
      caseTitle: "SEBI Compliance Advisory & NCLT Reorganization",
      title: "Draft Board Audit Committee bylaws revision markup under Companies Act, 2013",
      dueDate: "2026-07-01",
      status: "pending",
      priority: "low",
      createdAt: new Date("2026-05-20T16:00:00Z").toISOString(),
      updatedAt: new Date("2026-05-20T16:00:00Z").toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "task_5",
      caseId: "case_2",
      caseTitle: "Apex Commercial Lease Breach & Subtenant Eviction",
      title: "Complete site physical inspection & take photos of unauthorized sub-leased structures",
      dueDate: "2026-05-28",
      status: "completed",
      priority: "high",
      createdAt: new Date("2026-05-01T10:00:00Z").toISOString(),
      updatedAt: new Date("2026-05-28T16:00:00Z").toISOString(),
      ownerId: "lawyer_1"
    }
  ]
};

// Helper functions for low-cost native JSON file DB
function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed parsing database, using initial data", error);
    return initialData;
  }
}

function writeDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed writing to database file", error);
  }
}

// Clients Data Management Methods
export const dbClients = {
  list: (): Client[] => readDb().clients,
  get: (id: string): Client | undefined => readDb().clients.find(c => c.id === id),
  create: (clientData: Omit<Client, "id" | "createdAt" | "updatedAt">): Client => {
    const db = readDb();
    const newClient: Client = {
      ...clientData,
      id: `cli_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.clients.push(newClient);
    writeDb(db);
    return newClient;
  },
  update: (id: string, clientData: Partial<Omit<Client, "id" | "createdAt" | "ownerId">>): Client => {
    const db = readDb();
    const idx = db.clients.findIndex(c => c.id === id);
    if (idx === -1) throw new Error("Client not found");
    const updated: Client = {
      ...db.clients[idx],
      ...clientData,
      updatedAt: new Date().toISOString()
    };
    db.clients[idx] = updated;
    writeDb(db);
    return updated;
  },
  delete: (id: string) => {
    const db = readDb();
    db.clients = db.clients.filter(c => c.id !== id);
    // Cascade delete cases? Let's keep them but alert, or delete them
    db.cases = db.cases.filter(c => c.clientId !== id);
    db.billing = db.billing.filter(b => b.clientId !== id);
    writeDb(db);
  }
};

// Cases Data Management Methods
export const dbCases = {
  list: (): Case[] => readDb().cases,
  get: (id: string): Case | undefined => readDb().cases.find(c => c.id === id),
  create: (caseData: Omit<Case, "id" | "createdAt" | "updatedAt">): Case => {
    const db = readDb();
    const newCase: Case = {
      ...caseData,
      id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.cases.push(newCase);
    writeDb(db);
    return newCase;
  },
  update: (id: string, caseData: Partial<Omit<Case, "id" | "createdAt" | "ownerId">>): Case => {
    const db = readDb();
    const idx = db.cases.findIndex(c => c.id === id);
    if (idx === -1) throw new Error("Case not found");
    const updated: Case = {
      ...db.cases[idx],
      ...caseData,
      updatedAt: new Date().toISOString()
    };
    db.cases[idx] = updated;
    writeDb(db);
    return updated;
  },
  delete: (id: string) => {
    const db = readDb();
    db.cases = db.cases.filter(c => c.id !== id);
    db.billing = db.billing.filter(b => b.caseId !== id);
    db.tasks = db.tasks.filter(t => t.caseId !== id);
    writeDb(db);
  }
};

// Billing Data Management Methods
export const dbBilling = {
  list: (): Billing[] => readDb().billing,
  create: (billingData: Omit<Billing, "id" | "createdAt" | "updatedAt">): Billing => {
    const db = readDb();
    const newBill: Billing = {
      ...billingData,
      id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.billing.push(newBill);
    writeDb(db);
    return newBill;
  },
  updateStatus: (id: string, status: "paid" | "unpaid" | "overdue"): Billing => {
    const db = readDb();
    const idx = db.billing.findIndex(b => b.id === id);
    if (idx === -1) throw new Error("Invoice not found");
    const updated: Billing = {
      ...db.billing[idx],
      status,
      updatedAt: new Date().toISOString()
    };
    db.billing[idx] = updated;
    writeDb(db);
    return updated;
  },
  delete: (id: string) => {
    const db = readDb();
    db.billing = db.billing.filter(b => b.id !== id);
    writeDb(db);
  }
};

// Tasks Data Management Methods
export const dbTasks = {
  list: (): Task[] => readDb().tasks,
  create: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">): Task => {
    const db = readDb();
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.tasks.push(newTask);
    writeDb(db);
    return newTask;
  },
  updateStatus: (id: string, status: "pending" | "completed"): Task => {
    const db = readDb();
    const idx = db.tasks.findIndex(t => t.id === id);
    if (idx === -1) throw new Error("Task not found");
    const updated: Task = {
      ...db.tasks[idx],
      status,
      updatedAt: new Date().toISOString()
    };
    db.tasks[idx] = updated;
    writeDb(db);
    return updated;
  },
  delete: (id: string) => {
    const db = readDb();
    db.tasks = db.tasks.filter(t => t.id !== id);
    writeDb(db);
  }
};

// Custom Statutory Sections Data Management Methods
export const dbCustomStatutory = {
  list: (): StatutorySection[] => {
    const db = readDb();
    return db.customStatutorySections || [];
  },
  create: (item: Omit<StatutorySection, "id">): StatutorySection => {
    const db = readDb();
    if (!db.customStatutorySections) {
      db.customStatutorySections = [];
    }
    const newItem: StatutorySection = {
      ...item,
      id: `custom-sec-${Date.now()}`
    };
    db.customStatutorySections.push(newItem);
    writeDb(db);
    return newItem;
  },
  delete: (id: string) => {
    const db = readDb();
    if (db.customStatutorySections) {
      db.customStatutorySections = db.customStatutorySections.filter(x => x.id !== id);
      writeDb(db);
    }
  }
};

// Custom Case Laws Data Management Methods
export const dbCustomCases = {
  list: (): CaseLaw[] => {
    const db = readDb();
    return db.customCaseLaws || [];
  },
  create: (item: Omit<CaseLaw, "id">): CaseLaw => {
    const db = readDb();
    if (!db.customCaseLaws) {
      db.customCaseLaws = [];
    }
    const newItem: CaseLaw = {
      ...item,
      id: `custom-case-${Date.now()}`
    };
    db.customCaseLaws.push(newItem);
    writeDb(db);
    return newItem;
  },
  delete: (id: string) => {
    const db = readDb();
    if (db.customCaseLaws) {
      db.customCaseLaws = db.customCaseLaws.filter(x => x.id !== id);
      writeDb(db);
    }
  }
};

// Cached Statutory Cache Data Management Methods
export const dbCachedStatutory = {
  list: (): StatutorySection[] => {
    const db = readDb();
    return db.cachedStatutorySections || [];
  },
  create: (item: Omit<StatutorySection, "id">): StatutorySection => {
    const db = readDb();
    if (!db.cachedStatutorySections) {
      db.cachedStatutorySections = [];
    }
    const existing = db.cachedStatutorySections.find(
      x => x.actName.toLowerCase() === item.actName.toLowerCase() && 
           x.sectionNumber.toLowerCase() === item.sectionNumber.toLowerCase()
    );
    if (existing) return existing;

    const newItem: StatutorySection = {
      ...item,
      id: `cached-sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    db.cachedStatutorySections.push(newItem);
    writeDb(db);
    return newItem;
  }
};

// Cached Cases Cache Data Management Methods
export const dbCachedCases = {
  list: (): CaseLaw[] => {
    const db = readDb();
    return db.cachedCaseLaws || [];
  },
  create: (item: Omit<CaseLaw, "id">): CaseLaw => {
    const db = readDb();
    if (!db.cachedCaseLaws) {
      db.cachedCaseLaws = [];
    }
    const existing = db.cachedCaseLaws.find(
      x => x.caseName.toLowerCase() === item.caseName.toLowerCase() || 
           (item.citation && x.citation.toLowerCase() === item.citation.toLowerCase())
    );
    if (existing) return existing;

    const newItem: CaseLaw = {
      ...item,
      id: `cached-case-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    db.cachedCaseLaws.push(newItem);
    writeDb(db);
    return newItem;
  }
};
