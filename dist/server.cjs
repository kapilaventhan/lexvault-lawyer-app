var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);
var import_adm_zip = __toESM(require("adm-zip"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");

// server/db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var DB_FILE = import_path.default.join(process.cwd(), "db.json");
var initialData = {
  clients: [
    {
      id: "cli_1",
      name: "Devendra Sharma",
      email: "devendra.sharma@nexustech.co.in",
      phone: "+91 98100 23456",
      company: "Nexus Telecom Solutions India Pvt. Ltd.",
      address: "Plot No. 472, Sector 5, Hitec City, Hyderabad, Telangana - 500081",
      notes: "Ongoing advisory on venture financing and Indian Company Law compliance. Preparing for Series B. Highly responsive client.",
      createdAt: (/* @__PURE__ */ new Date("2026-01-15T09:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-01-15T09:00:00Z")).toISOString(),
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
      createdAt: (/* @__PURE__ */ new Date("2026-02-10T10:30:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-02-10T10:30:00Z")).toISOString(),
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
      createdAt: (/* @__PURE__ */ new Date("2026-03-05T14:15:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-03-05T14:15:00Z")).toISOString(),
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
      billingRate: 35e3,
      createdAt: (/* @__PURE__ */ new Date("2026-01-18T11:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-05-12T16:00:00Z")).toISOString(),
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
      billingRate: 45e4,
      createdAt: (/* @__PURE__ */ new Date("2026-02-12T09:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-04-03T10:20:00Z")).toISOString(),
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
      billingRate: 15e5,
      createdAt: (/* @__PURE__ */ new Date("2026-03-08T15:30:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-03-08T15:30:00Z")).toISOString(),
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
      nextHearingDate: void 0,
      billingType: "Hourly",
      billingRate: 4e4,
      createdAt: (/* @__PURE__ */ new Date("2025-10-10T10:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-03-01T17:00:00Z")).toISOString(),
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
      amount: 145e4,
      status: "paid",
      dueDate: "2026-04-30",
      description: "Pre-trial preparation: written statements, documentary discovery files submission, and expert consultant reviews.",
      createdAt: (/* @__PURE__ */ new Date("2026-04-01T10:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-04-20T16:30:00Z")).toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "bill_2",
      caseId: "case_1",
      caseTitle: "Nexus Telecom vs. Horizon AI Software Intellectual Property Dispute",
      clientId: "cli_1",
      clientName: "Devendra Sharma",
      amount: 675e3,
      status: "unpaid",
      dueDate: "2026-06-25",
      description: "Drafting of response to Horizon's motion for summary judgment and claim construction replication briefing.",
      createdAt: (/* @__PURE__ */ new Date("2026-05-20T11:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-05-20T11:00:00Z")).toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "bill_3",
      caseId: "case_2",
      caseTitle: "Apex Commercial Lease Breach & Subtenant Eviction",
      clientId: "cli_2",
      clientName: "Indira Sen",
      amount: 45e4,
      status: "overdue",
      dueDate: "2026-05-15",
      description: "Flat fee retainer for lease violation formal filing in Mumbai City Civil Court, court appearance fee, and draft eviction notices.",
      createdAt: (/* @__PURE__ */ new Date("2026-04-10T09:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-04-10T09:00:00Z")).toISOString(),
      ownerId: "lawyer_1"
    },
    {
      id: "bill_4",
      caseId: "case_4",
      caseTitle: "State of Maharashtra v. Rajesh Mehta & Ors.",
      clientId: "cli_2",
      clientName: "Indira Sen",
      amount: 21e5,
      status: "paid",
      dueDate: "2026-03-15",
      description: "Criminal defense representation, compounding agreement finalization, and formal closing administrative logs.",
      createdAt: (/* @__PURE__ */ new Date("2026-03-01T09:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-03-10T14:45:00Z")).toISOString(),
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
      createdAt: (/* @__PURE__ */ new Date("2026-05-10T10:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-05-10T10:00:00Z")).toISOString(),
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
      createdAt: (/* @__PURE__ */ new Date("2026-05-12T09:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-05-12T09:00:00Z")).toISOString(),
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
      createdAt: (/* @__PURE__ */ new Date("2026-05-15T14:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-05-15T14:00:00Z")).toISOString(),
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
      createdAt: (/* @__PURE__ */ new Date("2026-05-20T16:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-05-20T16:00:00Z")).toISOString(),
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
      createdAt: (/* @__PURE__ */ new Date("2026-05-01T10:00:00Z")).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date("2026-05-28T16:00:00Z")).toISOString(),
      ownerId: "lawyer_1"
    }
  ]
};
function readDb() {
  try {
    if (!import_fs.default.existsSync(DB_FILE)) {
      import_fs.default.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), "utf-8");
      return initialData;
    }
    const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed parsing database, using initial data", error);
    return initialData;
  }
}
function writeDb(data) {
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed writing to database file", error);
  }
}
var dbClients = {
  list: () => readDb().clients,
  get: (id) => readDb().clients.find((c) => c.id === id),
  create: (clientData) => {
    const db = readDb();
    const newClient = {
      ...clientData,
      id: `cli_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.clients.push(newClient);
    writeDb(db);
    return newClient;
  },
  update: (id, clientData) => {
    const db = readDb();
    const idx = db.clients.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Client not found");
    const updated = {
      ...db.clients[idx],
      ...clientData,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.clients[idx] = updated;
    writeDb(db);
    return updated;
  },
  delete: (id) => {
    const db = readDb();
    db.clients = db.clients.filter((c) => c.id !== id);
    db.cases = db.cases.filter((c) => c.clientId !== id);
    db.billing = db.billing.filter((b) => b.clientId !== id);
    writeDb(db);
  }
};
var dbCases = {
  list: () => readDb().cases,
  get: (id) => readDb().cases.find((c) => c.id === id),
  create: (caseData) => {
    const db = readDb();
    const newCase = {
      ...caseData,
      id: `case_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.cases.push(newCase);
    writeDb(db);
    return newCase;
  },
  update: (id, caseData) => {
    const db = readDb();
    const idx = db.cases.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Case not found");
    const updated = {
      ...db.cases[idx],
      ...caseData,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.cases[idx] = updated;
    writeDb(db);
    return updated;
  },
  delete: (id) => {
    const db = readDb();
    db.cases = db.cases.filter((c) => c.id !== id);
    db.billing = db.billing.filter((b) => b.caseId !== id);
    db.tasks = db.tasks.filter((t) => t.caseId !== id);
    writeDb(db);
  }
};
var dbBilling = {
  list: () => readDb().billing,
  create: (billingData) => {
    const db = readDb();
    const newBill = {
      ...billingData,
      id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.billing.push(newBill);
    writeDb(db);
    return newBill;
  },
  updateStatus: (id, status) => {
    const db = readDb();
    const idx = db.billing.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error("Invoice not found");
    const updated = {
      ...db.billing[idx],
      status,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.billing[idx] = updated;
    writeDb(db);
    return updated;
  },
  delete: (id) => {
    const db = readDb();
    db.billing = db.billing.filter((b) => b.id !== id);
    writeDb(db);
  }
};
var dbTasks = {
  list: () => readDb().tasks,
  create: (taskData) => {
    const db = readDb();
    const newTask = {
      ...taskData,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.tasks.push(newTask);
    writeDb(db);
    return newTask;
  },
  updateStatus: (id, status) => {
    const db = readDb();
    const idx = db.tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Task not found");
    const updated = {
      ...db.tasks[idx],
      status,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.tasks[idx] = updated;
    writeDb(db);
    return updated;
  },
  delete: (id) => {
    const db = readDb();
    db.tasks = db.tasks.filter((t) => t.id !== id);
    writeDb(db);
  }
};
var dbCustomStatutory = {
  list: () => {
    const db = readDb();
    return db.customStatutorySections || [];
  },
  create: (item) => {
    const db = readDb();
    if (!db.customStatutorySections) {
      db.customStatutorySections = [];
    }
    const newItem = {
      ...item,
      id: `custom-sec-${Date.now()}`
    };
    db.customStatutorySections.push(newItem);
    writeDb(db);
    return newItem;
  },
  delete: (id) => {
    const db = readDb();
    if (db.customStatutorySections) {
      db.customStatutorySections = db.customStatutorySections.filter((x) => x.id !== id);
      writeDb(db);
    }
  }
};
var dbCustomCases = {
  list: () => {
    const db = readDb();
    return db.customCaseLaws || [];
  },
  create: (item) => {
    const db = readDb();
    if (!db.customCaseLaws) {
      db.customCaseLaws = [];
    }
    const newItem = {
      ...item,
      id: `custom-case-${Date.now()}`
    };
    db.customCaseLaws.push(newItem);
    writeDb(db);
    return newItem;
  },
  delete: (id) => {
    const db = readDb();
    if (db.customCaseLaws) {
      db.customCaseLaws = db.customCaseLaws.filter((x) => x.id !== id);
      writeDb(db);
    }
  }
};
var dbCachedStatutory = {
  list: () => {
    const db = readDb();
    return db.cachedStatutorySections || [];
  },
  create: (item) => {
    const db = readDb();
    if (!db.cachedStatutorySections) {
      db.cachedStatutorySections = [];
    }
    const existing = db.cachedStatutorySections.find(
      (x) => x.actName.toLowerCase() === item.actName.toLowerCase() && x.sectionNumber.toLowerCase() === item.sectionNumber.toLowerCase()
    );
    if (existing) return existing;
    const newItem = {
      ...item,
      id: `cached-sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    db.cachedStatutorySections.push(newItem);
    writeDb(db);
    return newItem;
  }
};
var dbCachedCases = {
  list: () => {
    const db = readDb();
    return db.cachedCaseLaws || [];
  },
  create: (item) => {
    const db = readDb();
    if (!db.cachedCaseLaws) {
      db.cachedCaseLaws = [];
    }
    const existing = db.cachedCaseLaws.find(
      (x) => x.caseName.toLowerCase() === item.caseName.toLowerCase() || item.citation && x.citation.toLowerCase() === item.citation.toLowerCase()
    );
    if (existing) return existing;
    const newItem = {
      ...item,
      id: `cached-case-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    db.cachedCaseLaws.push(newItem);
    writeDb(db);
    return newItem;
  }
};

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
app.get("/api/download-zip", (req, res) => {
  try {
    const zip = new import_adm_zip.default();
    const foldersToInclude = ["src", "server", "assets"];
    const filesToInclude = [
      "package.json",
      "tsconfig.json",
      "vite.config.ts",
      "index.html",
      "server.ts",
      ".env.example",
      "metadata.json",
      "README.md",
      "db.json",
      ".gitignore",
      "firebase-blueprint.json"
    ];
    foldersToInclude.forEach((folder) => {
      const folderPath = import_path2.default.join(process.cwd(), folder);
      if (import_fs2.default.existsSync(folderPath)) {
        zip.addLocalFolder(folderPath, folder);
      }
    });
    filesToInclude.forEach((file) => {
      const filePath = import_path2.default.join(process.cwd(), file);
      if (import_fs2.default.existsSync(filePath)) {
        zip.addLocalFile(filePath);
      }
    });
    const zipBuffer = zip.toBuffer();
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=DocketLegal_Codebase_Workspace.zip");
    res.send(zipBuffer);
  } catch (err) {
    console.error("ZIP packaging fault:", err);
    res.status(500).json({ error: "Could not successfully compile and stream codebase ZIP ledger archive." });
  }
});
var aiClient = null;
function getAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is not defined. AI legal assistants will run in sandbox demo mode.");
      return null;
    }
    aiClient = new import_genai.GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
app.get("/api/clients", (req, res) => {
  try {
    const list = dbClients.list();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to list clients" });
  }
});
app.post("/api/clients", (req, res) => {
  try {
    const { name, email, phone, company, address, notes } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are required fields" });
    }
    const created = dbClients.create({
      name,
      email,
      phone: phone || "",
      company: company || "",
      address: address || "",
      notes: notes || "",
      ownerId: "lawyer_1"
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: "Failed to create client" });
  }
});
app.put("/api/clients/:id", (req, res) => {
  try {
    const updated = dbClients.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update client" });
  }
});
app.delete("/api/clients/:id", (req, res) => {
  try {
    dbClients.delete(req.params.id);
    res.json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete client" });
  }
});
app.get("/api/cases", (req, res) => {
  try {
    const list = dbCases.list();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to list cases" });
  }
});
app.post("/api/cases", (req, res) => {
  try {
    const {
      caseNumber,
      title,
      clientId,
      status,
      practiceArea,
      court,
      judge,
      description,
      oppositionName,
      oppositionLawyer,
      nextHearingDate,
      billingType,
      billingRate
    } = req.body;
    if (!caseNumber || !title || !clientId || !status || !practiceArea) {
      return res.status(400).json({ error: "Missing required case fields" });
    }
    const client = dbClients.get(clientId);
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }
    const created = dbCases.create({
      caseNumber,
      title,
      clientId,
      clientName: client.name,
      status,
      practiceArea,
      court: court || "County Court",
      judge: judge || "",
      description: description || "",
      oppositionName: oppositionName || "",
      oppositionLawyer: oppositionLawyer || "",
      nextHearingDate: nextHearingDate || void 0,
      billingType,
      billingRate: billingRate ? Number(billingRate) : void 0,
      ownerId: "lawyer_1"
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: "Failed to create case file" });
  }
});
app.put("/api/cases/:id", (req, res) => {
  try {
    const updated = dbCases.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update case file" });
  }
});
app.delete("/api/cases/:id", (req, res) => {
  try {
    dbCases.delete(req.params.id);
    res.json({ success: true, message: "Case file deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete case file" });
  }
});
app.get("/api/billing", (req, res) => {
  try {
    const list = dbBilling.list();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to list billing invoices" });
  }
});
app.post("/api/billing", (req, res) => {
  try {
    const { caseId, amount, status, dueDate, description } = req.body;
    if (!caseId || !amount || !status || !dueDate) {
      return res.status(400).json({ error: "Missing required billing invoice fields" });
    }
    const matchedCase = dbCases.get(caseId);
    if (!matchedCase) {
      return res.status(404).json({ error: "Case file not found" });
    }
    const created = dbBilling.create({
      caseId,
      caseTitle: matchedCase.title,
      clientId: matchedCase.clientId,
      clientName: matchedCase.clientName,
      amount: Number(amount),
      status,
      dueDate,
      description: description || "",
      ownerId: "lawyer_1"
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: "Failed to create invoice" });
  }
});
app.put("/api/billing/:id/status", (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });
    const updated = dbBilling.updateStatus(req.params.id, status);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update invoice status" });
  }
});
app.delete("/api/billing/:id", (req, res) => {
  try {
    dbBilling.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete invoice" });
  }
});
app.get("/api/tasks", (req, res) => {
  try {
    const list = dbTasks.list();
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Failed to list tasks" });
  }
});
app.post("/api/tasks", (req, res) => {
  try {
    const { caseId, title, dueDate, priority } = req.body;
    if (!caseId || !title || !dueDate || !priority) {
      return res.status(400).json({ error: "Missing task details" });
    }
    const matchedCase = dbCases.get(caseId);
    if (!matchedCase) {
      return res.status(404).json({ error: "Case not found" });
    }
    const created = dbTasks.create({
      caseId,
      caseTitle: matchedCase.title,
      title,
      dueDate,
      status: "pending",
      priority,
      ownerId: "lawyer_1"
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task deadline" });
  }
});
app.put("/api/tasks/:id/status", (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });
    const updated = dbTasks.updateStatus(req.params.id, status);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task state" });
  }
});
app.delete("/api/tasks/:id", (req, res) => {
  try {
    dbTasks.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});
app.post("/api/ai/summarize", async (req, res) => {
  const { caseId } = req.body;
  if (!caseId) {
    return res.status(400).json({ error: "caseId is required" });
  }
  const legalCase = dbCases.get(caseId);
  if (!legalCase) {
    return res.status(404).json({ error: "Case not found" });
  }
  const client = dbClients.get(legalCase.clientId);
  const ai = getAI();
  if (!ai) {
    const mockSummary = `### **CONFIDENTIAL LEGAL BRIEF SUMMARY** (Demo Sandbox Mode)

**Case Number**: ${legalCase.caseNumber}
**Case Title**: ${legalCase.title}
**Court/Panel**: ${legalCase.court}
**Client Context**: ${client ? client.name : legalCase.clientName} (${client?.company || "Individual"})

---

#### **1. EXECUTIVE SUMMARY**
This case involves a core ${legalCase.practiceArea} matter regarding: *"${legalCase.description.slice(0, 100)}..."*. Currently tracking as status **${legalCase.status.toUpperCase()}**.

#### **2. KEY LEGAL CHALLENGES & DISPUTES**
*   **Procedural Merits**: Establishing legal standing in the scheduled hearing before ${legalCase.judge || "the Assigned Judge"}.
*   **Opposition Standing**: Reviewing assertions from opposition lawyer **${legalCase.oppositionLawyer || "Unknown Council"}** representing **${legalCase.oppositionName || "Unknown party"}**.
*   **Evidentiary Constraints**: Collecting detailed documents, correspondence logs, and engineer reports to defend prime assertions.

#### **3. STRATEGIC LITIGATION PLAN**
1.  **Discovery Check**: Ensure all client discovery depositions represent clear timelines avoiding gaps in prior art disclosures.
2.  **Mitigation Strategy**: Prepare structured response petitions 10 days prior to the hearing date of **${legalCase.nextHearingDate || "TBD"}**.
3.  **Billing Protection**: Monitor hourly billing logs to maintain regular invoice cycles avoiding contingency disputes.

*Note: Configure a real GEMINI_API_KEY inside Settings > Secrets to unlock production AI reasoning.*`;
    return res.json({ summary: mockSummary, isSandboxMode: true });
  }
  try {
    const prompt = `You are an elite corporate and litigation legal expert in the Indian Legal System. Create a highly detailed, professional, structured "Legal Case Brief and Case Strategy" for the following files:

CASE DETAILS:
- Case Number: ${legalCase.caseNumber}
- Practice Area: ${legalCase.practiceArea}
- Court: ${legalCase.court}
- Presiding Judge: ${legalCase.judge || "Not assigned"}
- Case Title: ${legalCase.title}
- Description: ${legalCase.description}

OPPOSITION INVOLVED:
- Opposing Party: ${legalCase.oppositionName || "Unknown"}
- Opposing Council: ${legalCase.oppositionLawyer || "Unknown"}

CLIENT DETAILS:
- Name: ${client?.name || legalCase.clientName}
- Company: ${client?.company || "Individual"}
- Client Notes: ${client?.notes || "None"}

Please structure your output using clean Markdown under the Indian Legal Framework (referencing Acts like Companies Act 2013, Indian Contract Act 1872, Code of Civil Procedure, BNS/IPC, etc.) with the following exact headers:
1. ### **CONFIDENTIAL LEGAL BRIEF SUMMARY**
2. #### **1. CASE OVERVIEW & CRITICAL CLAIMS** (Highlight structural disputes, core rights violated, legal sections involved, and monetary stakes in INR)
3. #### **2. OPPOSITION ANALYSIS & DEFENSE RISKS** (Analyze opposition's likely strategy, counter-arguments, and weak points in client's files)
4. #### **3. LITIGATION STRATEGY & NEXT STEPS** (List 3 clear actionable next steps to advance the client's interests in Indian High Courts/District Courts)
5. #### **4. AI EVIDENCE & DISCOVERY CHECKLIST** (Provide a checklist of specific documents, certificates of service, and filings the advocate must request immediately)`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional National Law School (NLSIU) educated Senior Advocate, senior Indian legal advisor, and litigator in High Courts and the Supreme Court of India. Write in an objective, authoritative, dense legal tone under the Indian Legal System."
      }
    });
    res.json({ summary: response.text, isSandboxMode: false });
  } catch (error) {
    console.error("Gemini case summarizer error: ", error);
    res.status(500).json({ error: "Failed to generate AI case summary: " + (error instanceof Error ? error.message : String(error)) });
  }
});
app.post("/api/ai/draft-document", async (req, res) => {
  const { caseId, docType } = req.body;
  if (!caseId || !docType) {
    return res.status(400).json({ error: "caseId and docType are required" });
  }
  const legalCase = dbCases.get(caseId);
  if (!legalCase) {
    return res.status(404).json({ error: "Case not found" });
  }
  const client = dbClients.get(legalCase.clientId);
  const ai = getAI();
  if (!ai) {
    const mockDraft = `### **DEMO DRAFT: ${docType.toUpperCase()}** (Demo Sandbox Mode)

**PREPARED BY**: Law Offices of ${client?.ownerId || "Staff Attorney"}
**FOR THE MATTER OF**: ${legalCase.title}
**DATE**: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}

---

#### **NOTICE OF INTENT & FORMAL DISCLOSURE**

TO: **${legalCase.oppositionName || "Opposing Party"}**
RE: Case File Ref: ${legalCase.caseNumber}

Please be advised that this document serves as a preliminary draft representation of our ${docType} relative to the active matter regarding **${legalCase.title}** pending in **${legalCase.court}**.

1. **Assertion of Rights**: Our client, **${client?.name || legalCase.clientName}**, retains all common law, regulatory, and patent/civil privileges under current Jurisdictional statutes.
2. **Breaches Identified**: We cite the ongoing dispute concerning: *"${legalCase.description.slice(0, 150)}..."*
3. **Formal Demand**: We request that your counsel **${legalCase.oppositionLawyer || "Opposing Council"}** initiate immediate conference logs or present formal responses within fourteen (14) operational business days.

*This draft is produced in Sandbox mode. Enable the GEMINI_API_KEY secret to generate precise, legally cited contracts, motion templates, or formal notification letters.*`;
    return res.json({ draft: mockDraft, isSandboxMode: true });
  }
  try {
    const prompt = `You are an elite Indian corporate lawyer, Senior Advocate, and expert legal draftsman under the laws of India. Draft professional legal documents for the following case files:

DOCUMENT REQUEST:
- Document Type: ${docType} (e.g. "Cease & Desist Letter/Legal Notice", "Formal Legal Demand Notice", "Advocate Engagement Retainer Vakalatnama", "Application for Extension of Time/Adjournment")

CASE INVOLVED:
- Title: ${legalCase.title}
- Court: ${legalCase.court}
- Matter Ref: ${legalCase.caseNumber}
- Details: ${legalCase.description}

CLIENT INVOLVED:
- Client: ${client?.name || legalCase.clientName}
- Company: ${client?.company || "Individual"}
- Address: ${client?.address || "On File"}

OPPOSITION:
- Adversary: ${legalCase.oppositionName || "Opposing Party"}
- Attorney: ${legalCase.oppositionLawyer || "Opposing Counsel"}

Draft a full, professional Advocate-grade Indian legal document/notice template. It must:
- Use formal Indian legal terminology (e.g. 'Noticee', 'Advocate on Record', reference correct acts, currency in INR \u20B9, Lakhs, Crores, under specific sections of the Indian Contract Act, CPC, Companies Act, BNS, or Constitution of India as relevant).
- Use brackets for place-markers, standard recitals, and standard Indian legal boilerplate.
- Represent an absolute masterclass in legal drafting. Focus heavily on layout structure, section headings, and precision. Do not summarize or abbreviate. Give the full document. Use Markdown.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite, senior Indian Advocate or Solicitor drafting legally formal court documents, legal notices, or corporate agreements in the Republic of India."
      }
    });
    res.json({ draft: response.text, isSandboxMode: false });
  } catch (error) {
    console.error("Gemini document drafter error: ", error);
    res.status(500).json({ error: "Failed to draft legal document: " + (error instanceof Error ? error.message : String(error)) });
  }
});
app.post("/api/ai/recommend-laws", async (req, res) => {
  const { category, caseTitle, caseDescription, customSituation } = req.body;
  if (!category) {
    return res.status(400).json({ error: "category is required" });
  }
  const ai = getAI();
  if (!ai) {
    const mockAdvice = `### **AI PRECEDENT RECOMMENDATIONS & STATUTORY SEARCH** (Demo Sandbox Mode)

**Primary Legal Category**: ${category} Law
${caseTitle ? `**Tied Matter File**: *${caseTitle}*` : ""}

---

#### **1. SUGGESTED STATUTORY ACTS & SECTIONS**
Based on ${category} Law parameters, our analytical models focus on the following core acts:
*   **Primary Act**: Local Consolidated Codified Statutes relative to **${category} Law**.
*   **Key Statutory Section**: Section 43 or Section 101 of the relevant general statutes.
*   **Legal Action Scope**: Authorizes civil or penal enforcement metrics under proper jurisdictional service of process.

#### **2. LANDMARK PRECEDENTS & CRITICAL GUIDELINES**
Under classic jurisprudence relevant to this matter:
1.  **Supreme Court Standards**: The leading precedent mandates that standard commercial and civil transactions are governed by the *doctrine of good faith and bilateral disclosure*.
2.  **Appellate Guidelines**: A secondary appellate court ruling outlines that *unilateral withdrawal of consent or arbitrary breach of notice periods* is strictly barred and generates actionable claims for civil damages under general breach acts.

#### **3. LITIGATION STRATEGY & DISCOVERY ADVICE**
*   **Strategic Precedent Focus**: Collect all correspondence logs, notice letters, and business receipts showing bilateral intent.
*   **Secondary Precedents**: Review and cite related rulings showing safe-harbor exceptions or statutory exclusions applicable to this specific fact scenario.

*Note: Configure a real GEMINI_API_KEY inside Settings > Secrets to unlock production AI reasoning.*`;
    return res.json({ recommendation: mockAdvice, isSandboxMode: true });
  }
  try {
    const prompt = `You are an elite legal research expert and Supreme Court of India Senior Advocate. Suggest relevant Indian case laws, statutory sections, and key precedent guidelines for the following fact scenario:

LEGAL CATEGORY: ${category}
${caseTitle ? `CASE MATTER TITLE: ${caseTitle}` : ""}
${caseDescription ? `CASE MATTER DETAILS: ${caseDescription}` : ""}
${customSituation ? `USER SCENARIO / QUESTION: ${customSituation}` : ""}

Please perform a dense, realistic, and highly authoritative analysis based strictly on the Indian legal framework. Provide:
1. ### **AI PRECEDENT RECOMMENDATIONS & STATUTORY SEARCH**
2. #### **1. APPLICABLE INDIAN ACTS AND STATUTORY SECTIONS** (Include exact sections, paragraph highlights, and regulatory scopes e.g. BNS/IPC, CPC, CrPC/BNSS, Patents Act, Family Acts, Companies Act 2013)
3. #### **2. LANDMARK INDIAN JUDGMENTS & RATIO DECIDENDI** (Recommend 1-2 leading real-world landmark Indian judgments containing Court name, Citation e.g. AIR, SCC, SCR, and detailed Case Summaries)
4. #### **3. KEY LEGAL PRINCIPLES & RATIO DECIDENDI** (Explain the key legal principles or ratios established by those judgments)
5. #### **4. LITIGATION STRATEGY & PROCEDURAL NEXT STEPS** (Provide 3 practical recommendations for the advocate to counsel the client or build the docket under Indian code/procedure)

Please write your output in structured Markdown, avoiding conversational meta-commentary. Focus on providing extremely dense legal reasoning.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite legal advisor and Indian legal research specialist. Write in an authoritative, objective, legally rigorous style citing real Indian Acts, statutory provisions, and landmark Supreme Court of India/High Court precedents."
      }
    });
    res.json({ recommendation: response.text, isSandboxMode: false });
  } catch (error) {
    console.error("Gemini legal recommendation engine error: ", error);
    res.status(500).json({ error: "Failed to generate legal recommendation: " + (error instanceof Error ? error.message : String(error)) });
  }
});
app.get("/api/research/custom-statutory", (req, res) => {
  try {
    res.json(dbCustomStatutory.list());
  } catch (err) {
    res.status(500).json({ error: "Failed to list custom statutory sections" });
  }
});
app.post("/api/research/custom-statutory", (req, res) => {
  try {
    const item = dbCustomStatutory.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to register custom statutory section" });
  }
});
app.delete("/api/research/custom-statutory/:id", (req, res) => {
  try {
    dbCustomStatutory.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete custom statutory section" });
  }
});
app.get("/api/research/custom-cases", (req, res) => {
  try {
    res.json(dbCustomCases.list());
  } catch (err) {
    res.status(500).json({ error: "Failed to list custom case laws" });
  }
});
app.post("/api/research/custom-cases", (req, res) => {
  try {
    const item = dbCustomCases.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to log custom case law" });
  }
});
app.delete("/api/research/custom-cases/:id", (req, res) => {
  try {
    dbCustomCases.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete custom case law" });
  }
});
function toRoman(num) {
  const roman = {
    M: 1e3,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1
  };
  let str = "";
  for (const i of Object.keys(roman)) {
    const q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }
  return str || "I";
}
function getActsForCategory(category) {
  const acts = {
    Family: ["The Hindu Marriage Act, 1955", "The Special Marriage Act, 1954", "The Hindu Succession Act, 1956", "The Indian Succession Act, 1925"],
    Criminal: ["Bharatiya Nyaya Sanhita, 2023 (BNS)", "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)", "Bharatiya Sakshya Adhiniyam, 2023 (BSA)", "Code of Criminal Procedure, 1973 (CrPC)"],
    Civil: ["Code of Civil Procedure, 1908 (CPC)", "The Specific Relief Act, 1963", "The Indian Contract Act, 1872"],
    Property: ["The Transfer of Property Act, 1882", "The Indian Registration Act, 1908", "The Land Acquisition Act, 2013"],
    Corporate: ["The Companies Act, 2013", "The Insolvency and Bankruptcy Code, 2016 (IBC)", "The Partnership Act, 1932"],
    Consumer: ["The Consumer Protection Act, 2019", "The Sale of Goods Act, 1930"],
    Labor: ["The Industrial Relations Code, 2020", "The Code on Wages, 2019", "The Occupational Safety, Health and Working Conditions Code, 2020"],
    Tax: ["The Income Tax Act, 1961", "The Central Goods and Services Tax Act, 2017 (CGST)", "The Integrated Goods and Services Tax Act, 2017"],
    "Intellectual Property": ["The Patents Act, 1970", "The Trade Marks Act, 1999", "The Copyright Act, 1957"],
    Cyber: ["The Information Technology Act, 2000", "The Digital Personal Data Protection Act, 2023 (DPDP)"],
    Constitutional: ["The Constitution of India, 1950"],
    Banking: ["The Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act, 2002 (SARFAESI)", "The Banking Regulation Act, 1949", "The Negotiable Instruments Act, 1881"],
    Arbitration: ["The Arbitration and Conciliation Act, 1996"],
    Environmental: ["The National Green Tribunal Act, 2010 (NGT)", "The Environment (Protection) Act, 1986", "The Forest (Conservation) Act, 1980"],
    "Real Estate": ["The Real Estate (Regulation and Development) Act, 2016 (RERA)"],
    Insurance: ["The Insurance Regulatory and Development Authority Act, 1999 (IRDAI)", "The Insurance Act, 1938"],
    Telecom: ["The Telecommunications Act, 2023", "The Telecom Regulatory Authority of India Act, 1997 (TRAI)"],
    Competition: ["The Competition Act, 2002"],
    Securities: ["The Securities and Exchange Board of India Act, 1992 (SEBI)"]
  };
  return acts[category] || ["The General Statutes of India Consolidation, 2024"];
}
function filterSections(list, filters) {
  return list.filter((sec) => {
    if (filters.category && sec.category && sec.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }
    if (filters.sectionNumber && sec.sectionNumber && !sec.sectionNumber.toLowerCase().includes(filters.sectionNumber.toLowerCase())) {
      return false;
    }
    if (filters.searchTerm) {
      const s = filters.searchTerm.toLowerCase();
      const matchAct = sec.actName?.toLowerCase().includes(s);
      const matchTitle = sec.title?.toLowerCase().includes(s);
      const matchSec = sec.sectionNumber?.toLowerCase().includes(s);
      const matchDesc = sec.description?.toLowerCase().includes(s);
      if (!matchAct && !matchTitle && !matchSec && !matchDesc) {
        return false;
      }
    }
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      const matchDesc = sec.description?.toLowerCase().includes(kw);
      const matchTitle = sec.title?.toLowerCase().includes(kw);
      const matchKeywords = sec.keyKeywords?.some((k) => k.toLowerCase().includes(kw));
      if (!matchDesc && !matchTitle && !matchKeywords) {
        return false;
      }
    }
    return true;
  });
}
function filterCases(list, filters) {
  return list.filter((c) => {
    if (filters.category && c.category && c.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }
    if (filters.court && c.court && !c.court.toLowerCase().includes(filters.court.toLowerCase())) {
      return false;
    }
    if (filters.citation && c.citation && !c.citation.toLowerCase().includes(filters.citation.toLowerCase())) {
      return false;
    }
    if (filters.year && c.judgmentDate && !c.judgmentDate.toLowerCase().includes(filters.year.toLowerCase())) {
      return false;
    }
    if (filters.judgeName && c.judgeName && !c.judgeName.toLowerCase().includes(filters.judgeName.toLowerCase())) {
      return false;
    }
    if (filters.searchTerm) {
      const s = filters.searchTerm.toLowerCase();
      const matchName = c.caseName?.toLowerCase().includes(s);
      const matchCit = c.citation?.toLowerCase().includes(s);
      const matchCourt = c.court?.toLowerCase().includes(s);
      const matchSum = c.summary?.toLowerCase().includes(s);
      if (!matchName && !matchCit && !matchCourt && !matchSum) {
        return false;
      }
    }
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      const matchSum = c.summary?.toLowerCase().includes(kw);
      const matchPrinciples = c.keyPrinciples?.some((p) => p.toLowerCase().includes(kw));
      if (!matchSum && !matchPrinciples) {
        return false;
      }
    }
    return true;
  });
}
app.post("/api/research/search-repository", async (req, res) => {
  const { category, searchTerm, sectionNumber, court, citation, year, judgeName, keyword } = req.body;
  const ai = getAI();
  if (!ai) {
    const allCustomSec = dbCustomStatutory.list();
    const allCachedSec = dbCachedStatutory.list();
    const allCustomCases = dbCustomCases.list();
    const allCachedCases = dbCachedCases.list();
    const matchedCustomSec = filterSections(allCustomSec, { category, searchTerm, sectionNumber, keyword });
    const matchedCachedSec = filterSections(allCachedSec, { category, searchTerm, sectionNumber, keyword });
    const matchedCustomCases = filterCases(allCustomCases, { category, searchTerm, court, citation, year, judgeName, keyword });
    const matchedCachedCases = filterCases(allCachedCases, { category, searchTerm, court, citation, year, judgeName, keyword });
    let finalSections = [...matchedCustomSec, ...matchedCachedSec];
    let finalCases = [...matchedCustomCases, ...matchedCachedCases];
    if (finalSections.length < 3 || finalCases.length < 3) {
      const activeCategory = category || "Corporate";
      const actsForCat = getActsForCategory(activeCategory);
      const chosenAct = actsForCat[Math.floor(Math.random() * actsForCat.length)] || "The Unified Codified Act, 2024";
      const secNo = sectionNumber || `Section ${Math.floor(Math.random() * 320) + 1}`;
      const secTitle = searchTerm ? `Provision relating to ${searchTerm}` : `Detailed statutory guidelines on ${activeCategory} practice code`;
      const generatedSec = dbCachedStatutory.create({
        actName: chosenAct,
        chapterName: `Chapter ${toRoman(Math.floor(Math.random() * 12) + 1)} - General and Special Practice Provisions`,
        sectionNumber: secNo,
        title: secTitle,
        description: `This detailed statutory section regulates general legal procedures, rights, and standard liabilities relative to ${searchTerm || activeCategory} legal disputes in India. Sub-section (1) establishes that every affected entity or citizen has the absolute right to direct representation. Sub-section (2) provides that any violations entail legal compensation or penalties specified by rules.`,
        explanationsProvisos: `Provided that nothing in this clause shall apply to actions taken in good faith or as authorized by public administrators of the Indian Union. Explanation: For the purpose of this section, regulatory compliance is governed under central rules.`,
        amendmentsNotifications: "Amended by the Consolidated Legal Amendments Act, 2023 with effect from August 15, 2023, expanding regulatory fines. Notification No. REG-441/2026: Directs that digital filings are fully verified legally.",
        keyKeywords: ["statutory", "audit", activeCategory.toLowerCase(), searchTerm?.toLowerCase() || "legal"],
        category: activeCategory
      });
      finalSections.push(generatedSec);
      const partyA = searchTerm ? searchTerm : "Consolidated Solutions Corp.";
      const partyB = "Union of India and Others";
      const caseName = `${partyA} v. ${partyB}`;
      const citNo = citation || `AIR ${year || 2024} SC ${Math.floor(Math.random() * 900) + 100}`;
      const courtName = court || "Supreme Court of India";
      const judgeNameVal = judgeName || "Justice D.Y. Chandrachud";
      const generatedCase = dbCachedCases.create({
        caseName,
        citation: citNo,
        court: courtName,
        judgmentDate: `${year || 2024}-03-12`,
        judgeName: judgeNameVal,
        summary: `This landmark judicial decision from the ${courtName} addresses the deep procedural disputes on ${searchTerm || activeCategory}. The petitioning party ${partyA} entered appeals challenging executive show-cause notices which were issued without traditional opportunity. The Court, led by ${judgeNameVal}, examined the doctrine of constitutional reasonableness, holding that failure to serve standard notice violates Article 14 rules. The appeal was allowed, and all impugned administrative demands were set aside.`,
        keyPrinciples: [
          `Procedural reasonableness is an essential safeguard of administrative actions under ${activeCategory} practice.`,
          "Arbitrary unilateral declarations violate constitutional guarantees of equity and fairness.",
          `Provisions of ${chosenAct} must be interpreted harmoniously with civil procedure rules.`
        ],
        applicableSections: [`${chosenAct} - ${secNo}`],
        relatedPrecedents: ["Shreya Singhal v. Union of India (2015)", "Kesavananda Bharati v. State of Kerala (1973)"],
        category: activeCategory,
        isLandmark: true,
        recentUpdate: "Adopted as a major precedent by High Courts nationwide in subsequent commercial matters."
      });
      finalCases.push(generatedCase);
    }
    return res.json({
      statutorySections: finalSections.slice(0, 8),
      caseLaws: finalCases.slice(0, 8),
      isSandboxMode: true,
      message: "Sandbox Pre-loaded Cache Engine active. Enter any category, section, judge, citation, or Year to automatically generate and persist highly realistic legal dossiers! Note: To query the live dynamic AI, configure a GEMINI_API_KEY in Secrets."
    });
  }
  try {
    const filterParts = [];
    if (category) filterParts.push(`Category: ${category}`);
    if (searchTerm) filterParts.push(`Search Term / Keywords: ${searchTerm}`);
    if (sectionNumber) filterParts.push(`Section/Rule Number: ${sectionNumber}`);
    if (court) filterParts.push(`Presiding Court Venue: ${court}`);
    if (citation) filterParts.push(`Citation Number: ${citation}`);
    if (year) filterParts.push(`Judgment Year: ${year}`);
    if (judgeName) filterParts.push(`Presiding Judge: ${judgeName}`);
    if (keyword) filterParts.push(`General Keyword: ${keyword}`);
    const prompt = `You are a high-performance Indian Legal Research Search API. 
The user is requesting legal research data from the absolute complete repository of ALL Central and State Indian Acts, Rules, Amendments, notifications, and Landmark Supreme Court / High Court Judgments.

Provide records matching the following user filters:
${filterParts.length > 0 ? filterParts.join("\n") : "General legal queries (Provide the most popular and comprehensive Indian statutory sections and landmark judgments across categories like Constitutional, BNS, Companies Act, RERA, GST, Cyber, and Labour codes)"}

Return a list of:
1. Statutory sections matching the keyword/section number/category. For each, display exact act names (e.g. "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)", "The Real Estate (Regulation and Development) Act, 2016", "The Central Goods and Services Tax Act, 2017"), chapters, section numbers, full verbatim-style high-fidelity text or extremely detailed description with explanation/provisos/notifications and amendments where applicable.
2. Case laws / Judgments (including landmark precedents as well as recent judgments representing SC, HC, or active tribunals) matching. Include citation (e.g. AIR, SCC), court venue, exact judgment date, presiding judge name, executive facts summary, key legal principles/ratios, and applicable sections.

Ensure ALL of your returned data represents REAL active or historical legal references of the Indian Republic. Do not limit the numbers artificially, but provide up to 5 rich sections and 5 rich cases that are highly relevant.

Return the result STRICTLY as a JSON object matching this schema:
{
  "statutorySections": [
    {
      "actName": "Name of Indian Statute (e.g., Bharatiya Sakshya Adhiniyam, 2023)",
      "chapterName": "e.g., Chapter II - On Relevancy of Facts",
      "sectionNumber": "e.g., Section 22",
      "title": "Title of the statutory provision",
      "description": "Verification of terms, full provisos, notifications and descriptive explanation",
      "keyKeywords": ["list", "of", "keywords"],
      "category": "e.g., Criminal or Family or Real Estate"
    }
  ],
  "caseLaws": [
    {
      "caseName": "e.g., Shreya Singhal v. Union of India",
      "citation": "AIR 2015 SC 1523",
      "court": "Supreme Court of India",
      "judgmentDate": "2015-03-24",
      "judgeName": "Justice J. Chelameswar",
      "summary": "Full detailed facts of the dispute regarding section 66A of the IT Act, arguments raised, and why it was struck down.",
      "keyPrinciples": ["Details on freedom of speech on the internet", "Striking down of unconstitutional vague restrictions"],
      "applicableSections": ["Information Technology Act, 2000 - Section 66A"],
      "relatedPrecedents": ["Romesh Thappar v. State of Madras (1950)"],
      "category": "Cyber or Constitutional",
      "isLandmark": true,
      "recentUpdate": "Subsequent amendments to data protection rules"
    }
  ]
}

Write ONLY the raw JSON object, no markdown code blocks or wrapper markers.`;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: import_genai.Type.OBJECT,
          properties: {
            statutorySections: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  actName: { type: import_genai.Type.STRING },
                  chapterName: { type: import_genai.Type.STRING },
                  sectionNumber: { type: import_genai.Type.STRING },
                  title: { type: import_genai.Type.STRING },
                  description: { type: import_genai.Type.STRING },
                  keyKeywords: {
                    type: import_genai.Type.ARRAY,
                    items: { type: import_genai.Type.STRING }
                  },
                  category: { type: import_genai.Type.STRING }
                },
                required: ["actName", "sectionNumber", "title", "description", "keyKeywords", "category"]
              }
            },
            caseLaws: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  caseName: { type: import_genai.Type.STRING },
                  citation: { type: import_genai.Type.STRING },
                  court: { type: import_genai.Type.STRING },
                  judgmentDate: { type: import_genai.Type.STRING },
                  judgeName: { type: import_genai.Type.STRING },
                  summary: { type: import_genai.Type.STRING },
                  keyPrinciples: {
                    type: import_genai.Type.ARRAY,
                    items: { type: import_genai.Type.STRING }
                  },
                  applicableSections: {
                    type: import_genai.Type.ARRAY,
                    items: { type: import_genai.Type.STRING }
                  },
                  relatedPrecedents: {
                    type: import_genai.Type.ARRAY,
                    items: { type: import_genai.Type.STRING }
                  },
                  category: { type: import_genai.Type.STRING },
                  isLandmark: { type: import_genai.Type.BOOLEAN },
                  recentUpdate: { type: import_genai.Type.STRING }
                },
                required: ["caseName", "citation", "court", "judgmentDate", "summary", "keyPrinciples", "applicableSections", "relatedPrecedents", "category", "isLandmark"]
              }
            }
          },
          required: ["statutorySections", "caseLaws"]
        }
      }
    });
    const result = JSON.parse(response.text || "{}");
    const savedSectionsList = [];
    const savedCasesList = [];
    if (result.statutorySections && Array.isArray(result.statutorySections)) {
      for (const sec of result.statutorySections) {
        const itemCreated = dbCachedStatutory.create({
          actName: sec.actName,
          sectionNumber: sec.sectionNumber,
          title: sec.title,
          description: sec.description,
          keyKeywords: sec.keyKeywords || [],
          category: sec.category || category || "Other",
          chapterName: sec.chapterName || "",
          explanationsProvisos: sec.description,
          amendmentsNotifications: "Unified central registry index"
        });
        savedSectionsList.push(itemCreated);
      }
    }
    if (result.caseLaws && Array.isArray(result.caseLaws)) {
      for (const c of result.caseLaws) {
        const itemCreated = dbCachedCases.create({
          caseName: c.caseName,
          citation: c.citation,
          court: c.court,
          judgmentDate: c.judgmentDate,
          summary: c.summary,
          keyPrinciples: c.keyPrinciples || [],
          applicableSections: c.applicableSections || [],
          relatedPrecedents: c.relatedPrecedents || [],
          category: c.category || category || "Other",
          isLandmark: c.isLandmark !== void 0 ? c.isLandmark : true,
          recentUpdate: c.recentUpdate || "",
          judgeName: c.judgeName || ""
        });
        savedCasesList.push(itemCreated);
      }
    }
    res.json({
      statutorySections: savedSectionsList.length > 0 ? savedSectionsList : result.statutorySections,
      caseLaws: savedCasesList.length > 0 ? savedCasesList : result.caseLaws,
      isSandboxMode: false
    });
  } catch (error) {
    console.error("Gemini legal repository search error: ", error);
    res.status(500).json({ error: "Failed to query complete legal repository: " + (error instanceof Error ? error.message : String(error)) });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware mounted.");
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
    console.log("Serving static production files from dist folder.");
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully activated and listening on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
