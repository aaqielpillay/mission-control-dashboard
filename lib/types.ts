// lib/types.ts — Shared TypeScript types for Mission Control

export type AgentStatus = "active" | "idle" | "offline";
export type Priority = "high" | "medium" | "low";
export type TaskStatus = "backlog" | "in_progress" | "review" | "done";
export type DebtStatus = "paid" | "in_progress" | "planned" | "overdue";
export type ReportType =
  | "daily_standup"
  | "trade_confirmation"
  | "signal_alert"
  | "linkedin_report"
  | "debt_elimination"
  | "risk_audit"
  | "twitter_alpha"
  | "cross_reference";

export interface Agent {
  id: string;
  name: string;
  role: string;
  department: "CTO" | "CMO" | "CRO" | "COO" | "specialist" | "CEO";
  status: AgentStatus;
  currentTask: string;
  successRate: number;
  lastActive: string; // ISO timestamp
  avatarInitials: string;
  avatarColor: string;
  tools: string[];
  enabled: boolean;
  customPrompt: string;
  isCEO?: boolean;
}

export interface SubStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedAgent: string; // agent id
  priority: Priority;
  status: TaskStatus;
  dueDate?: string; // ISO date
  createdAt: string;
  subSteps: SubStep[];
  activityLog: { time: string; action: string }[];
}

export interface StandupEntry {
  id: string;
  date: string; // ISO date
  participants: string[]; // agent ids
  reports: {
    agentId: string;
    yesterday: string;
    today: string;
    blockers: string;
    actionItems: string[];
  }[];
}

export interface CommsMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string; // ISO timestamp
  read: boolean;
}

export interface DebtEntry {
  id: string;
  name: string;
  amount: number;
  balance: number;
  interestRate?: number;
  status: DebtStatus;
  bank: string;
  dueDate?: string;
  order: number; // sweep order
}

export interface BankAccount {
  id: string;
  name: string;
  bank: string;
  balance: number;
  type: "checking" | "savings" | "credit";
}

export interface IncomingFund {
  id: string;
  name: string;
  amount: number;
  expectedDate?: string;
  available: boolean;
}

export interface Position {
  id: string;
  token: string;
  mint: string;
  entryPrice: number;
  currentPrice: number;
  size: number;
  pnl: number;
  pnlPercent: number;
  status: "open" | "closed";
  entryTime: string;
}

export interface Trade {
  id: string;
  token: string;
  side: "buy" | "sell";
  amount: number;
  price: number;
  pnl: number;
  timestamp: string;
}

export interface Signal {
  id: string;
  source: "BOBNET T1" | "BOBNET T2";
  token: string;
  mint: string;
  aiScore: number;
  direction: "buy" | "sell";
  confidence: number;
  timestamp: string;
  executed: boolean;
}

export interface Report {
  id: string;
  type: ReportType;
  authorId: string;
  date: string;
  preview: string;
  content: string;
  actionItems: string[];
}

export interface ActivityEntry {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: string;
}

export interface DashboardMetrics {
  activeAgents: number;
  tasksCompletedToday: number;
  tasksInProgress: number;
  signalsCaught: number;
  reportsFiled: number;
  openPositions: number;
  meetingsHeld: number;
  pendingReview: number;
  solBalance: number;
  linkedinPostsSent: number;
  alerts: number;
}

export interface SSEPayload {
  type:
    | "init"
    | "tick"
    | "signal"
    | "trade"
    | "position_update"
    | "agent_update"
    | "comms"
    | "activity";
  data: unknown;
  timestamp: string;
  id?: number;
}
