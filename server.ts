import express from "express";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { dbClients, dbCases, dbBilling, dbTasks, dbCustomStatutory, dbCustomCases, dbCachedStatutory, dbCachedCases } from "./server/db.js";

// Initialize express app
const app = express();
const PORT = 3000;

app.use(express.json());

// Codebase Export ZIP generator
app.get("/api/download-zip", (req, res) => {
  try {
    const zip = new AdmZip();
    
    // Folder paths to bundle recursively
    const foldersToInclude = ["src", "server", "assets"];
    
    // Key files to bundle at root
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

    foldersToInclude.forEach(folder => {
      const folderPath = path.join(process.cwd(), folder);
      if (fs.existsSync(folderPath)) {
        zip.addLocalFolder(folderPath, folder);
      }
    });

    filesToInclude.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
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

// Initialize AI Client lazily & gracefully
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("GEMINI_API_KEY is not defined. AI legal assistants will run in sandbox demo mode.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ==========================================
// API ROUTES
// ==========================================

// Client Management APIs
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

// Case Management APIs
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
      nextHearingDate: nextHearingDate || undefined,
      billingType,
      billingRate: billingRate ? Number(billingRate) : undefined,
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

// Finance / Billing APIs
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

// Tasks / Schedules APIs
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

// ==========================================
// GEMINI INTELLIGENT LAWYER ENDPOINTS
// ==========================================

// 1. AI Legal Brief Case Summarizer
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
    // Sandbox Sandbox fallbacks if API Key is not set up
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

// 2. Legal Document Template Drafter
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
**DATE**: ${new Date().toLocaleDateString()}

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
- Use formal Indian legal terminology (e.g. 'Noticee', 'Advocate on Record', reference correct acts, currency in INR ₹, Lakhs, Crores, under specific sections of the Indian Contract Act, CPC, Companies Act, BNS, or Constitution of India as relevant).
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

// 3. AI Legal Precedent Recommendation Engine
app.post("/api/ai/recommend-laws", async (req, res) => {
  const { category, caseTitle, caseDescription, customSituation } = req.body;
  if (!category) {
    return res.status(400).json({ error: "category is required" });
  }

  const ai = getAI();
  if (!ai) {
    // Sandbox fallbacks if the key is missing
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


// ==========================================
// CUSTOM LEGAL INDEXING / SEARCH REPOSITORY WORKFLOWS
// ==========================================

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

// --- HELPER UTILITIES FOR OFFLINE JURISPRUDENCE GENERATOR ---
function toRoman(num: number): string {
  const roman: { [key: string]: number } = {
    M: 1000, CM: 900, D: 500, CD: 400,
    C: 100, XC: 90, L: 50, XL: 40,
    X: 10, IX: 9, V: 5, IV: 4, I: 1
  };
  let str = "";
  for (const i of Object.keys(roman)) {
    const q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }
  return str || "I";
}

function getActsForCategory(category: string): string[] {
  const acts: { [key: string]: string[] } = {
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

function filterSections(list: any[], filters: any) {
  return list.filter(sec => {
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
      const matchKeywords = sec.keyKeywords?.some((k: string) => k.toLowerCase().includes(kw));
      if (!matchDesc && !matchTitle && !matchKeywords) {
        return false;
      }
    }
    return true;
  });
}

function filterCases(list: any[], filters: any) {
  return list.filter(c => {
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
      const matchPrinciples = c.keyPrinciples?.some((p: string) => p.toLowerCase().includes(kw));
      if (!matchSum && !matchPrinciples) {
        return false;
      }
    }
    return true;
  });
}

// --- AI-POWERED SCALABLE INDIAN LEGAL KNOWLEDGE REPOSITORY ---
app.post("/api/research/search-repository", async (req, res) => {
  const { category, searchTerm, sectionNumber, court, citation, year, judgeName, keyword } = req.body;
  const ai = getAI();

  if (!ai) {
    // 1. Gather all custom user records and cached records from the local db
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

    // 2. Fallback procedural generator to dynamically seed/persist rich mock data in sandbox mode!
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
          type: Type.OBJECT,
          properties: {
            statutorySections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  actName: { type: Type.STRING },
                  chapterName: { type: Type.STRING },
                  sectionNumber: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  keyKeywords: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  category: { type: Type.STRING }
                },
                required: ["actName", "sectionNumber", "title", "description", "keyKeywords", "category"]
              }
            },
            caseLaws: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  caseName: { type: Type.STRING },
                  citation: { type: Type.STRING },
                  court: { type: Type.STRING },
                  judgmentDate: { type: Type.STRING },
                  judgeName: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  keyPrinciples: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  applicableSections: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  relatedPrecedents: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  category: { type: Type.STRING },
                  isLandmark: { type: Type.BOOLEAN },
                  recentUpdate: { type: Type.STRING }
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

    // Persist and Auto-Index GEMINI dynamic outputs persistently into local db.json cache!
    const savedSectionsList: any[] = [];
    const savedCasesList: any[] = [];

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
          isLandmark: c.isLandmark !== undefined ? c.isLandmark : true,
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


// ==========================================
// VITE CLIENT / STATIC FILES MIDDLEWARE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server middleware mounted.");
  } else {
    // Production mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production files from dist folder.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully activated and listening on port ${PORT}`);
  });
}

startServer();
