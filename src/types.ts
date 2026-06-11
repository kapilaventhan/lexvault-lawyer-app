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
