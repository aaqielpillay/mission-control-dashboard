// lib/mock-data.ts — Rich mock data for all 9 dashboard sections
import type {
  Agent,
  Task,
  StandupEntry,
  CommsMessage,
  DebtEntry,
  BankAccount,
  IncomingFund,
  Position,
  Trade,
  Signal,
  Report,
  ActivityEntry,
} from "./types";

// ── AGENTS ──────────────────────────────────────────────────────
export const AGENTS: Agent[] = [
  {
    id: "aaqiel",
    name: "Aaqiel Pillay",
    role: "CEO",
    department: "CEO",
    status: "active",
    currentTask: "Overseeing all operations",
    successRate: 100,
    lastActive: new Date().toISOString(),
    avatarInitials: "AP",
    avatarColor: "from-purple-600 to-violet-800",
    tools: [],
    enabled: true,
    customPrompt: "",
    isCEO: true,
  },
  {
    id: "athena",
    name: "Athena",
    role: "CTO",
    department: "CTO",
    status: "active",
    currentTask: "Managing Solana trading bot infrastructure",
    successRate: 94,
    lastActive: new Date().toISOString(),
    avatarInitials: "AT",
    avatarColor: "from-blue-600 to-cyan-800",
    tools: ["Hermes Agent", "Solana CLI", "Jupiter DEX", "Pump.fun"],
    enabled: true,
    customPrompt:
      "You are Athena, CTO of the Mirror Protocol. You delegate tasks to specialized agents and monitor all system health.",
  },
  {
    id: "apollo",
    name: "Apollo",
    role: "LinkedIn Growth Agent",
    department: "CMO",
    status: "active",
    currentTask: "Scheduling LinkedIn posts for this week",
    successRate: 88,
    lastActive: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    avatarInitials: "AP",
    avatarColor: "from-orange-600 to-amber-800",
    tools: ["HeyReach", "LinkedIn API", "Notion"],
    enabled: true,
    customPrompt:
      "You are Apollo, the LinkedIn Growth Agent. You create content, engage with leads, and manage DMs via HeyReach.",
  },
  {
    id: "hermes",
    name: "Hermes",
    role: "CRO",
    department: "CRO",
    status: "active",
    currentTask: "Monitoring Cross Reference Engine outputs",
    successRate: 91,
    lastActive: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    avatarInitials: "HE",
    avatarColor: "from-teal-600 to-emerald-800",
    tools: ["BOBNET API", "Cross Reference Engine", "Exit Manager"],
    enabled: true,
    customPrompt:
      "You are Hermes, CRO. You monitor signals, cross-reference opportunities, and coordinate trade execution.",
  },
  {
    id: "nova",
    name: "Nova",
    role: "COO",
    department: "COO",
    status: "idle",
    currentTask: "Processing Spartan debt elimination updates",
    successRate: 96,
    lastActive: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    avatarInitials: "NO",
    avatarColor: "from-pink-600 to-rose-800",
    tools: ["Notion", "Finance Tracker", "Standup Scheduler"],
    enabled: true,
    customPrompt:
      "You are Nova, COO. You coordinate operations, track team performance, and ensure all systems run smoothly.",
  },
  {
    id: "spartan",
    name: "Spartan",
    role: "Debt Elimination Strategist",
    department: "COO",
    status: "active",
    currentTask: "Tracking Capitec Credit + Absa Credit 2 payoff progress",
    successRate: 100,
    lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    avatarInitials: "SP",
    avatarColor: "from-red-600 to-orange-800",
    tools: ["Finance Tracker", "Notion", "Debt Sweep Engine"],
    enabled: true,
    customPrompt:
      "You are Spartan, Debt Elimination Strategist. You manage the debt sweep plan and track progress against targets.",
  },
  {
    id: "bobnet",
    name: "BOBNET Listener",
    role: "Signal Monitor",
    department: "CRO",
    status: "active",
    currentTask: "Listening on T1 + T2 BOBNET channels — AI score threshold: 25",
    successRate: 98,
    lastActive: new Date().toISOString(),
    avatarInitials: "BL",
    avatarColor: "from-yellow-600 to-amber-800",
    tools: ["BOBNET API", "Telegram", "Signal Filter"],
    enabled: true,
    customPrompt:
      "You are BOBNET Listener. You monitor T1 and T2 channels for AI-generated signals with score ≥ 25.",
  },
  {
    id: "twitter-monitor",
    name: "Twitter Monitor",
    role: "Alpha Scanner",
    department: "CRO",
    status: "idle",
    currentTask: "Scanning @Solanafloor, @whale_hunter_sol, @CryptoGodJohn",
    successRate: 85,
    lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    avatarInitials: "TM",
    avatarColor: "from-sky-600 to-blue-800",
    tools: ["Twitter API", "Whale Alert", "Alpha Filter"],
    enabled: true,
    customPrompt:
      "You are Twitter Monitor. You scan key accounts for alpha signals and relay relevant finds to Hermes.",
  },
  {
    id: "cross-ref",
    name: "Cross Reference Engine",
    role: "Multi-Source Confirmer",
    department: "CRO",
    status: "active",
    currentTask: "Waiting for signal confirmation from secondary sources",
    successRate: 92,
    lastActive: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    avatarInitials: "CR",
    avatarColor: "from-indigo-600 to-violet-800",
    tools: ["Multi-Source API", "Confirmation Engine"],
    enabled: true,
    customPrompt:
      "You are the Cross Reference Engine. When 2+ sources confirm the same signal, you apply a +30% confidence boost.",
  },
  {
    id: "exit-manager",
    name: "Exit Manager",
    role: "Trade Exit Strategist",
    department: "CTO",
    status: "active",
    currentTask: "Monitoring trailing stop on LOBSTERMODE position",
    successRate: 97,
    lastActive: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    avatarInitials: "EM",
    avatarColor: "from-green-600 to-emerald-800",
    tools: ["Jupiter API", "Trailing Stop Engine", "Exit Rules"],
    enabled: true,
    customPrompt:
      "You are the Exit Manager. You monitor positions and execute exits based on stop loss and take profit rules.",
  },
  {
    id: "trade-executor",
    name: "Trade Executor",
    role: "$5/Trade via Jupiter",
    department: "CTO",
    status: "active",
    currentTask: "Ready to execute on BOBNET signals",
    successRate: 99,
    lastActive: new Date().toISOString(),
    avatarInitials: "TE",
    avatarColor: "from-cyan-600 to-teal-800",
    tools: ["Jupiter DEX", "Solana RPC", "Priority Fee Optimizer"],
    enabled: true,
    customPrompt:
      "You are the Trade Executor. You execute trades at $5 per trade via Jupiter DEX with optimized slippage and fees.",
  },
];

// ── TASKS ────────────────────────────────────────────────────────
export const TASKS: Task[] = [
  {
    id: "task-1",
    title: "Deploy Mission Control to Vercel",
    description:
      "Complete the Next.js Mission Control dashboard build and deploy to Vercel. Push to GitHub and verify auto-deploy.",
    assignedAgent: "athena",
    priority: "high",
    status: "in_progress",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    subSteps: [
      { id: "s1", text: "Write SPEC.md", completed: true },
      { id: "s2", text: "Scaffold Next.js app", completed: true },
      { id: "s3", text: "Build all 9 sections", completed: true },
      { id: "s4", text: "Test SSE stream", completed: false },
      { id: "s5", text: "Deploy to Vercel", completed: false },
    ],
    activityLog: [
      {
        time: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        action: "Task created by Aaqiel",
      },
      {
        time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        action: "Sub-step 'Write SPEC.md' completed",
      },
    ],
  },
  {
    id: "task-2",
    title: "Schedule LinkedIn posts for Week 2",
    description:
      "Create and schedule Week 2 LinkedIn posts (Tue–Sat, 4pm SAST). Topics: Solana trading, Mirror Protocol, debt elimination milestones.",
    assignedAgent: "apollo",
    priority: "high",
    status: "backlog",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    subSteps: [
      { id: "s1", text: "Draft 5 post topics", completed: false },
      { id: "s2", text: "Write post copy for each", completed: false },
      { id: "s3", text: "Add visuals/captions", completed: false },
      { id: "s4", text: "Schedule via HeyReach", completed: false },
    ],
    activityLog: [],
  },
  {
    id: "task-3",
    title: "Monitor LOBSTERMODE trailing stop",
    description:
      "Watch the LOBSTERMODE position. Trailing stop armed at $0.00000012. Exit when stop triggers or take profit at +15%.",
    assignedAgent: "exit-manager",
    priority: "high",
    status: "in_progress",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    subSteps: [
      { id: "s1", text: "Monitor price action", completed: true },
      { id: "s2", text: "Check trailing stop conditions", completed: false },
      { id: "s3", text: "Execute exit if triggered", completed: false },
    ],
    activityLog: [
      {
        time: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        action: "Trailing stop armed at $0.00000012",
      },
    ],
  },
  {
    id: "task-4",
    title: "Process provident fund sweep once received",
    description:
      "When R476,261 provident fund lands (est. 4–8 weeks), execute debt sweep in order: Capitec Access → Absa PL → Absa Credit 1 → Absa Car Loan → Nedbank Credit → Naaielah.",
    assignedAgent: "spartan",
    priority: "high",
    status: "backlog",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    subSteps: [
      { id: "s1", text: "Confirm fund receipt", completed: false },
      { id: "s2", text: "Pay Capitec Access R120,880", completed: false },
      { id: "s3", text: "Pay Absa PL R134,243", completed: false },
      { id: "s4", text: "Pay Absa Credit 1 R114,943", completed: false },
      { id: "s5", text: "Pay Absa Car Loan R51,239", completed: false },
      { id: "s6", text: "Pay Nedbank Credit R7,654", completed: false },
      { id: "s7", text: "Pay Naaielah R27,000", completed: false },
    ],
    activityLog: [],
  },
  {
    id: "task-5",
    title: "Review Cross Reference Engine signals",
    description:
      "Audit Cross Reference Engine output this week. Verify +30% boost applied correctly when 2+ sources confirm.",
    assignedAgent: "hermes",
    priority: "medium",
    status: "review",
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    subSteps: [
      { id: "s1", text: "Pull this week's cross-ref signals", completed: true },
      { id: "s2", text: "Verify boost application", completed: true },
      { id: "s3", text: "Sign off on accuracy", completed: false },
    ],
    activityLog: [],
  },
  {
    id: "task-6",
    title: "Update Finance Tracker bank balances",
    description:
      "Sync latest Capitec, Absa, and Nedbank account balances. Update after all debit orders clear on the 1st.",
    assignedAgent: "nova",
    priority: "medium",
    status: "done",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    subSteps: [
      { id: "s1", text: "Log into Capitec", completed: true },
      { id: "s2", text: "Log into Absa", completed: true },
      { id: "s3", text: "Log into Nedbank", completed: true },
      { id: "s4", text: "Update all balances", completed: true },
    ],
    activityLog: [],
  },
  {
    id: "task-7",
    title: "Run daily standup — Mirror Protocol team",
    description:
      "Autonomous daily standup with all 11 agents. Generate standup report and post to Reports section.",
    assignedAgent: "athena",
    priority: "low",
    status: "backlog",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    subSteps: [
      { id: "s1", text: "Query all agents for status", completed: false },
      { id: "s2", text: "Compile yesterday + today + blockers", completed: false },
      { id: "s3", text: "File standup report", completed: false },
    ],
    activityLog: [],
  },
  {
    id: "task-8",
    title: "Scan Twitter alpha feeds",
    description:
      "Monitor @Solanafloor, @whale_hunter_sol, and @CryptoGodJohn for new alpha. Flag anything actionable to Hermes.",
    assignedAgent: "twitter-monitor",
    priority: "medium",
    status: "in_progress",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    subSteps: [
      { id: "s1", text: "Check @Solanafloor", completed: true },
      { id: "s2", text: "Check @whale_hunter_sol", completed: true },
      { id: "s3", text: "Check @CryptoGodJohn", completed: false },
    ],
    activityLog: [],
  },
];

// ── STANDUPS ─────────────────────────────────────────────────────
export const STANDUPS: StandupEntry[] = [
  {
    id: "standup-1",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    participants: ["athena", "apollo", "hermes", "nova", "spartan", "bobnet", "exit-manager", "trade-executor"],
    reports: [
      {
        agentId: "athena",
        yesterday:
          "Completed Mission Control SPEC.md. Fixed SSE stream bug in dashboard. Deployed trading bot hotfix.",
        today: "Building Mission Control Next.js app. Wiring up SSE for all 9 sections.",
        blockers: "",
        actionItems: ["Deploy dashboard to Vercel", "Verify SSE connection"],
      },
      {
        agentId: "apollo",
        yesterday: "Scheduled 5 LinkedIn posts for Week 1. 4 posts published, 1 scheduled for tomorrow.",
        today: "Drafting Week 2 content calendar. Researching Solana trading hooks for audience.",
        blockers: "Need more engagement data from HeyReach — API returning partial results.",
        actionItems: ["Follow up on HeyReach API issue", "Create 5 Week 2 post drafts"],
      },
      {
        agentId: "hermes",
        yesterday: "Monitored BOBNET T1 + T2. 3 signals caught, 2 passed AI score threshold. No trades executed.",
        today: "Review Cross Reference Engine accuracy for this week. Coordinate with Twitter Monitor.",
        blockers: "",
        actionItems: ["Audit cross-ref signals", "Check Twitter Monitor feed"],
      },
      {
        agentId: "nova",
        yesterday: "Updated Finance Tracker with latest bank balances. Filed weekly operations report.",
        today: "Process Spartan debt elimination update. Prepare next standup summary.",
        blockers: "",
        actionItems: ["Update debt tracker", "Schedule next standup"],
      },
      {
        agentId: "spartan",
        yesterday: "Tracked Capitec Access payment confirmation (R120,880 cleared).",
        today: "Monitoring remaining debts. Ready to execute sweep when provident fund arrives.",
        blockers: "Provident fund timeline uncertain — waiting on employer confirmation.",
        actionItems: ["Confirm provident fund date", "Update sweep plan timeline"],
      },
    ],
  },
  {
    id: "standup-2",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    participants: ["athena", "apollo", "hermes", "nova", "bobnet", "twitter-monitor", "cross-ref"],
    reports: [
      {
        agentId: "athena",
        yesterday:
          "Migrated dashboard to real-time SSE. Fixed Phantom Phantom confusion in bot docs.",
        today: "Continue building Mission Control sections. Test drag-and-drop on Tasks Board.",
        blockers: "",
        actionItems: ["Build Org Chart component", "Test Tasks Board drag-drop"],
      },
      {
        agentId: "apollo",
        yesterday: "Published 3 LinkedIn posts. DMs sent to 12 new leads via HeyReach.",
        today: "Review DM open rates. Engage with comments on recent posts.",
        blockers: "",
        actionItems: ["Check DM open rates", "Respond to 5+ comments"],
      },
      {
        agentId: "hermes",
        yesterday: "Caught BOBNET signal on LOBSTERMODE. Cross-referenced with Twitter — 1 additional source confirmed. 88% confidence.",
        today: "Monitor LOBSTERMODE position. Coordinate Exit Manager on trailing stop.",
        blockers: "",
        actionItems: ["Watch LOBSTERMODE", "Confirm trailing stop status"],
      },
    ],
  },
];

// ── COMMS (BOARDROOM) ────────────────────────────────────────────
export const COMMS: CommsMessage[] = [
  {
    id: "comm-1",
    senderId: "athena",
    recipientId: "apollo",
    content:
      "Hey Apollo — can you schedule those Week 2 LinkedIn posts for Tue–Sat at 4pm SAST? Topics should cover Solana trading, Mirror Protocol growth, and debt elimination milestones.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: true,
  },
  {
    id: "comm-2",
    senderId: "apollo",
    recipientId: "athena",
    content:
      "On it. Week 2 topics drafted: 1) Why I switched to Solana, 2) Mirror Protocol monthly update, 3) Debt sweep progress (R463k cleared!), 4) Lessons from 6 months of AI agents, 5) What's next for Mirror Protocol.",
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    read: true,
  },
  {
    id: "comm-3",
    senderId: "hermes",
    recipientId: "cross-ref",
    content:
      "BOBNET T1 just flagged $BABYTROLL at AI score 32, confidence 78%. Need second source confirmation before I route to Exit Manager.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: true,
  },
  {
    id: "comm-4",
    senderId: "cross-ref",
    recipientId: "hermes",
    content:
      "Confirmed. Twitter Monitor flagged $BABYTROLL 4 minutes ago. 2 sources active — applying +30% boost. Confidence now 100%. Safe to execute.",
    timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    read: true,
  },
  {
    id: "comm-5",
    senderId: "hermes",
    recipientId: "trade-executor",
    content:
      "EXECUTE: $BABYTROLL, $5, BUY. Confidence: 100% (BOBNET T1 AI32 + Twitter confirmed). Route via Jupiter.",
    timestamp: new Date(Date.now() - 1000 * 60 * 27).toISOString(),
    read: true,
  },
  {
    id: "comm-6",
    senderId: "trade-executor",
    recipientId: "hermes",
    content:
      "EXECUTED: Bought $BABYTROLL at $0.00000089. Amount: 5,617.98 tokens. Fee: 0.000005 SOL. TX: 2YmHLgDybe6kBa4hkY1epHA3LE91tPXjWEE3Af3aTTXUvPb4qNyaVu2mLmtvCGCk2jFjzNYxYKM9okmV6SwJ1LHd",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    read: true,
  },
  {
    id: "comm-7",
    senderId: "exit-manager",
    recipientId: "hermes",
    content:
      "Position opened. Trailing stop armed at entry price $0.00000089. Monitoring for +10% move to activate trail.",
    timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
    read: true,
  },
  {
    id: "comm-8",
    senderId: "spartan",
    recipientId: "nova",
    content:
      "Debt sweep update: 6 of 6 accounts cleared. Capitec Access R120,880, Absa PL R134,243, Absa Credit 1 R114,943, Absa Car Loan R51,239, Nedbank Credit R7,654, Naaielah R27,000 — all PAID. Remaining: Capitec Credit R49,020 + Absa Credit 2 R69,994.",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    read: true,
  },
  {
    id: "comm-9",
    senderId: "bobnet",
    recipientId: "hermes",
    content:
      "SIGNAL: T2 channel — $LOBSTERMODE, AI Score 29, Confidence 67%. Direction: BUY. Waiting for T1 confirmation or cross-ref.",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    read: false,
  },
  {
    id: "comm-10",
    senderId: "twitter-monitor",
    recipientId: "hermes",
    content:
      "@CryptoGodJohn just posted about $LOBSTERMODE — mentioned bullish setup on the 4H. Not a direct call but aligned with BOBNET T2 signal. Routing to Cross Ref for confirmation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    read: false,
  },
];

// ── FINANCE ──────────────────────────────────────────────────────
export const INCOMING_FUNDS: IncomingFund[] = [
  {
    id: "fund-1",
    name: "Provident Fund",
    amount: 476261,
    expectedDate: undefined,
    available: false,
  },
  {
    id: "fund-2",
    name: "Immediate Available",
    amount: 17500,
    available: true,
  },
];

export const DEBTS: DebtEntry[] = [
  {
    id: "debt-1",
    name: "Capitec Access",
    amount: 120880,
    balance: 0,
    status: "paid",
    bank: "Capitec",
    order: 1,
  },
  {
    id: "debt-2",
    name: "Absa Personal Loan",
    amount: 134243,
    balance: 0,
    status: "paid",
    bank: "Absa",
    order: 2,
  },
  {
    id: "debt-3",
    name: "Absa Credit 1",
    amount: 114943,
    balance: 0,
    status: "paid",
    bank: "Absa",
    order: 3,
  },
  {
    id: "debt-4",
    name: "Absa Car Loan",
    amount: 51239,
    balance: 0,
    status: "paid",
    bank: "Absa",
    order: 4,
  },
  {
    id: "debt-5",
    name: "Nedbank Credit",
    amount: 7654,
    balance: 0,
    status: "paid",
    bank: "Nedbank",
    order: 5,
  },
  {
    id: "debt-6",
    name: "Naaielah",
    amount: 27000,
    balance: 0,
    status: "paid",
    bank: "Other",
    order: 6,
  },
  {
    id: "debt-7",
    name: "Capitec Credit",
    amount: 49020,
    balance: 49020,
    interestRate: 18.9,
    status: "planned",
    bank: "Capitec",
    order: 7,
  },
  {
    id: "debt-8",
    name: "Absa Credit 2",
    amount: 69994,
    balance: 69994,
    interestRate: 22.4,
    status: "planned",
    bank: "Absa",
    order: 8,
  },
];

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: "bank-1",
    name: "Salary Account",
    bank: "Capitec",
    balance: 12450,
    type: "checking",
  },
  {
    id: "bank-2",
    name: "Savings Account",
    bank: "Capitec",
    balance: 3210,
    type: "savings",
  },
  {
    id: "bank-3",
    name: "Credit Card",
    bank: "Absa",
    balance: -2840,
    type: "credit",
  },
  {
    id: "bank-4",
    name: "Business Account",
    bank: "Nedbank",
    balance: 5670,
    type: "checking",
  },
];

// ── INVESTMENTS ──────────────────────────────────────────────────
export const POSITIONS: Position[] = [
  {
    id: "pos-1",
    token: "BABYTROLL",
    mint: "6qdzMx4c9rL2X3Ns3SwZ8uEo4zReDPjdXpAEmpo7pump",
    entryPrice: 0.00000089,
    currentPrice: 0.00000095,
    size: 5617.98,
    pnl: 0.000337,
    pnlPercent: 6.74,
    status: "open",
    entryTime: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
];

export const TRADES: Trade[] = [
  {
    id: "trade-1",
    token: "BABYTROLL",
    side: "buy",
    amount: 5617.98,
    price: 0.00000089,
    pnl: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: "trade-2",
    token: "LOBSTERMODE",
    side: "sell",
    amount: 266777,
    price: 0.00000016,
    pnl: 0.000096,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
  },
  {
    id: "trade-3",
    token: "LOBSTERMODE",
    side: "buy",
    amount: 138053,
    price: 0.00000017,
    pnl: 0,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
];

export const SIGNALS: Signal[] = [
  {
    id: "sig-1",
    source: "BOBNET T2",
    token: "LOBSTERMODE",
    mint: "529nZVeyV4R3DAHAUXZP8tzBtTNdGkp33C7Vj95wpump",
    aiScore: 29,
    direction: "buy",
    confidence: 67,
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    executed: false,
  },
  {
    id: "sig-2",
    source: "BOBNET T1",
    token: "BABYTROLL",
    mint: "6qdzMx4c9rL2X3Ns3SwZ8uEo4zReDPjdXpAEmpo7pump",
    aiScore: 32,
    direction: "buy",
    confidence: 78,
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    executed: true,
  },
  {
    id: "sig-3",
    source: "BOBNET T2",
    token: "PEPE",
    mint: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYgWzqC",
    aiScore: 18,
    direction: "buy",
    confidence: 41,
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    executed: false,
  },
  {
    id: "sig-4",
    source: "BOBNET T1",
    token: "FLOKI",
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    aiScore: 41,
    direction: "buy",
    confidence: 88,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    executed: true,
  },
];

// ── REPORTS ──────────────────────────────────────────────────────
export const REPORTS: Report[] = [
  {
    id: "report-1",
    type: "daily_standup",
    authorId: "athena",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    preview: "Mirror Protocol daily standup — 8 agents participated. Key: Mission Control v2 in progress.",
    content:
      "Daily standup held with 8 agents. Athena is building the new Mission Control dashboard. Apollo completed Week 1 LinkedIn posts. Hermes caught 3 BOBNET signals, 2 passed AI threshold. Spartan confirmed 6 of 6 debts cleared in sweep. Nova is processing Spartan updates. No major blockers.",
    actionItems: [
      "Deploy Mission Control to Vercel",
      "Create Week 2 LinkedIn content calendar",
      "Audit Cross Reference Engine accuracy",
    ],
  },
  {
    id: "report-2",
    type: "trade_confirmation",
    authorId: "trade-executor",
    date: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    preview: "BUY BABYTROLL — 5,617.98 tokens @ $0.00000089. Fee: 0.000005 SOL. TX confirmed on-chain.",
    content:
      "Trade Executed: BUY BABYTROLL\n\nAmount: 5,617.98 tokens\nEntry Price: $0.00000089\nUSD Value: ~$0.005\nFee: 0.000005 SOL\nPriority Fee: 0.00015 SOL\nTX: 2YmHLgDybe6kBa4hkY1epHA3LE91tPXjWEE3Af3aTTXUvPb4qNyaVu2mLmtvCGCk2jFjzNYxYKM9okmV6SwJ1LHd\nStatus: CONFIRMED\n\nTrailing stop armed by Exit Manager at entry price.",
    actionItems: ["Monitor trailing stop", "Check at +10% for trail activation"],
  },
  {
    id: "report-3",
    type: "signal_alert",
    authorId: "bobnet",
    date: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    preview: "BOBNET T2: LOBSTERMODE — AI Score 29, Confidence 67%, Direction BUY. Not executed (awaiting T1 or cross-ref).",
    content:
      "Signal Alert\n\nSource: BOBNET T2\nToken: LOBSTERMODE\nMint: 529nZVeyV4R3DAHAUXZP8tzBtTNdGkp33C7Vj95wpump\nAI Score: 29 (threshold: 25 ✓)\nConfidence: 67%\nDirection: BUY\nTimestamp: just now\nStatus: PENDING — awaiting second source or T1 confirmation",
    actionItems: ["Route to Cross Reference Engine", "Await Twitter Monitor confirmation"],
  },
  {
    id: "report-4",
    type: "linkedin_report",
    authorId: "apollo",
    date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    preview: "Week 1 LinkedIn: 4 posts published, 3 scheduled. 47 DMs sent, 12 opened, 3 replied.",
    content:
      "LinkedIn Weekly Report — Week 1\n\nPosts Published: 4\nPosts Scheduled: 1 (Sat)\nTotal Reach: 2,847 impressions\nEngagements: 143\nProfile Visits: 89\n\nDM Campaign:\nSent: 47\nOpened: 12\nReplied: 3\n\nTop Performing Post: 'Why I built an AI team to manage my trading + debt' — 312 impressions, 28 engagements.\n\nNext Week Focus: More Solana trading content, debt elimination milestone posts.",
    actionItems: [
      "Draft Week 2 content calendar",
      "Respond to 3 DM replies",
      "Create visual assets for milestone post",
    ],
  },
  {
    id: "report-5",
    type: "debt_elimination",
    authorId: "spartan",
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    preview: "Debt sweep Phase 1 complete. R463,959 cleared across 6 accounts. Remaining: R119,014.",
    content:
      "Debt Elimination Update — Phase 1 Complete ✓\n\nTotal Cleared: R463,959\nAccounts Paid: 6 of 8\n\nPaid:\n1. Capitec Access — R120,880 ✓\n2. Absa Personal Loan — R134,243 ✓\n3. Absa Credit 1 — R114,943 ✓\n4. Absa Car Loan — R51,239 ✓\n5. Nedbank Credit — R7,654 ✓\n6. Naaielah — R27,000 ✓\n\nRemaining:\n7. Capitec Credit — R49,020 (planned)\n8. Absa Credit 2 — R69,994 (planned)\n\nNext Target: When provident fund lands (R476,261), sweep both remaining accounts. Estimated timeline: 4–8 weeks.",
    actionItems: [
      "Confirm provident fund date",
      "Update Finance Tracker",
      "Monitor Capitec Credit + Absa Credit 2 balances",
    ],
  },
  {
    id: "report-6",
    type: "cross_reference",
    authorId: "cross-ref",
    date: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    preview: "$BABYTROLL confirmed by 2 sources — BOBNET T1 (AI32) + Twitter Monitor. +30% boost applied. Confidence: 100%.",
    content:
      "Cross Reference Report\n\nToken: BABYTROLL\n\nSource 1: BOBNET T1\n- AI Score: 32\n- Confidence: 78%\n- Timestamp: 4 min ago\n\nSource 2: Twitter Monitor (@Solanafloor)\n- Signal: Bullish mention\n- Alignment: Confirmed\n- Timestamp: 2 min ago\n\nBoost Applied: +30%\nFinal Confidence: 100%\n\nRecommendation: EXECUTE\nStatus: Routed to Hermes → Trade Executor\nTrade: BUY $5 via Jupiter",
    actionItems: ["Execute trade", "Monitor position post-entry"],
  },
];

// ── ACTIVITY FEED ────────────────────────────────────────────────
export const ACTIVITY: ActivityEntry[] = [
  {
    id: "act-1",
    agentId: "athena",
    agentName: "Athena",
    action: "Task 'Deploy Mission Control to Vercel' moved to In Progress",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
  },
  {
    id: "act-2",
    agentId: "trade-executor",
    agentName: "Trade Executor",
    action: "BUY BABYTROLL — 5,617.98 tokens @ $0.00000089 — TX confirmed",
    type: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: "act-3",
    agentId: "exit-manager",
    agentName: "Exit Manager",
    action: "Trailing stop armed on BABYTROLL @ $0.00000089",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
  },
  {
    id: "act-4",
    agentId: "bobnet",
    agentName: "BOBNET Listener",
    action: "Signal caught: LOBSTERMODE — AI Score 29 — PENDING",
    type: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: "act-5",
    agentId: "cross-ref",
    agentName: "Cross Reference Engine",
    action: "$BABYTROLL confirmed by 2 sources — +30% boost applied",
    type: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
  },
  {
    id: "act-6",
    agentId: "spartan",
    agentName: "Spartan",
    action: "Debt sweep Phase 1 complete — R463,959 cleared across 6 accounts",
    type: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "act-7",
    agentId: "apollo",
    agentName: "Apollo",
    action: "Week 1 LinkedIn report filed — 4 posts, 47 DMs, 12 opens",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "act-8",
    agentId: "twitter-monitor",
    agentName: "Twitter Monitor",
    action: "@CryptoGodJohn flagged $LOBSTERMODE — routed to Cross Ref",
    type: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
];
