# Mirror Protocol — Mission Control
## AI Team Management Dashboard

---

## 1. Concept & Vision

Mission Control is the command center for Aaqiel Pillay's autonomous AI team. It provides a real-time, at-a-glance view of all 11 agents — their status, tasks, communications, finances, and portfolio. The aesthetic is dark, industrial, and precise: a SpaceX launchpad meets a Bloomberg terminal. Every pixel communicates control and clarity. Data is always live via SSE — no stale dashboards.

---

## 2. Design Language

### Aesthetic Direction
Industrial dark mode — Linear/Raycast/SpaceX quality. Pure black backgrounds, razor-thin borders, monospaced data, uppercase section headers. Feels like monitoring a live operation.

### Color Palette
```
--bg-primary:     #0a0a0f   (deepest black)
--bg-secondary:   #111118   (card backgrounds)
--bg-card:        #1a1a2e   (elevated surfaces)
--border:         #2d2d44   (borders)
--text-primary:   #e2e8f0   (main text)
--text-secondary: #94a3b8   (secondary text)
--text-muted:     #64748b   (muted/disabled)
--accent:         #8b5cf6   (purple — primary accent)
--accent-hover:   #7c3aed   (purple hover)
--green:          #4ade80   (success/active)
--yellow:         #fbbf24   (warning/medium)
--red:            #f87171   (error/high priority)
--blue:           #60a5fa   (low priority/info)
```

### Typography
- **Font:** Inter (Google Fonts) — weights 400, 500, 600, 700
- **Headings:** Uppercase, letter-spacing: 0.1em, font-weight 700
- **Body:** 0.875rem (14px), font-weight 400
- **Mono:** JetBrains Mono — for addresses, hashes, numbers

### Spatial System
- Card padding: 1.25rem
- Card border-radius: 12px
- Grid gap: 1rem
- Sidebar width: 260px (collapsed: 64px)

### Motion Philosophy
- Page transitions: Framer Motion fade + slide, 0.3s
- Card entrance: fadeIn 0.3s ease-out, staggered 50ms
- Drag-and-drop: spring physics via @dnd-kit
- Status dots: pulse animation 2s infinite
- New data rows: slideIn from top

### Visual Assets
- Icons: Lucide React
- Avatars: Initials on gradient backgrounds
- Status dots: 8px circles with pulse animation

---

## 3. Layout & Structure

### Desktop (≥1024px)
```
┌─────────────────────────────────────────────────┐
│ SIDEBAR (260px) │ HEADER (full width, 56px)    │
│                 ├─────────────────────────────────┤
│  [Nav Items]    │ MAIN CONTENT (scrollable)     │
│                 │                                 │
│                 │                                 │
└─────────────────┴─────────────────────────────────┘
```

### Mobile (<768px)
```
┌───────────────────────────┐
│ HEADER (full width)       │
├───────────────────────────┤
│ MAIN CONTENT (scrollable) │
│                           │
├───────────────────────────┤
│ BOTTOM NAV (56px, fixed)  │
└───────────────────────────┘
```

### Sidebar Navigation (9 items)
1. 📊 Dashboard
2. 🏢 Org Chart
3. ✅ Tasks Board
4. 📅 Standups
5. 💬 Boardroom
6. 💰 Finance Tracker
7. 📈 Investments
8. ⚙️ Agent Config
9. 📋 Reports

---

## 4. Features & Interactions

### 4.1 Dashboard (Home)
**11 Live Metrics (top grid):**
1. Active Agents — X of 11, green dot when running
2. Tasks Completed Today — integer counter
3. Tasks In Progress — integer counter
4. Signals Caught — BOBNET signals today
5. Reports Filed — agent reports today
6. Open Positions — active trades
7. Meetings Held — standups completed
8. Pending Review — tasks in Review column
9. SOL Balance — live from trading bot
10. LinkedIn Posts Sent — Apollo's posts today
11. Alerts / Warnings — agents needing attention

**Agent Status Cards (grid of 11):**
- Avatar (initials)
- Name + Role
- Status dot (active/idle/offline)
- Current task (truncated, one line)
- Task success rate (all-time %)
- Last active time

**Activity Feed (right/bottom panel):**
- Real-time scrolling log
- Format: [HH:MM:SS] AGENT: action description
- Color-coded: green=info, yellow=warning, red=error
- Last 50 entries, auto-scroll to latest

### 4.2 Org Chart
- CEO (Aaqiel Pillay) at top center
- Two rows below: CTO, CMO | CRO, COO
- Third row: Specialist agents (Spartan, BOBNET Listener, Twitter Monitor, Cross Reference Engine, Exit Manager, Trade Executor)
- Connecting lines between nodes (SVG or CSS)
- Per node: avatar, name, role, status dot, current task (truncated)
- Hover: expand slightly, show full task name
- Click: opens agent detail modal

### 4.3 Tasks Board (Kanban)
**4 Columns:** Backlog → In Progress → Review → Done

**Task Card:**
- Task title (bold)
- Assigned agent avatar + name
- Priority badge: HIGH (red), MEDIUM (amber), LOW (blue)
- Due date (if set)
- Sub-step progress indicator: "3/5 sub-steps"
- Click to expand

**Drag-and-Drop:**
- Drag between columns
- Spring animation on drop
- Column count updates on drop
- Persists to localStorage

**Task Detail (expanded):**
- Full task title + description
- Assigned agent
- Priority (editable)
- Due date (editable)
- Status (editable via drag or dropdown)
- Sub-steps list with checkboxes
- Add/remove sub-steps
- Activity log for that task

### 4.4 Standups
**Entry per standup session:**
- Date + time
- Participating agents (badges)
- Per agent section:
  - "Yesterday" — what they completed
  - "Today" — what they're working on
  - "Blockers" — if any (red highlight)
  - "Action Items" — generated tasks

**List view:** chronological, newest first
**Filter:** by date range or agent

### 4.5 Boardroom (Inter-Agent Comms)
**Live chat feed:**
- Sender avatar + name
- Department badge (CTO/CMO/CRO/COO)
- Timestamp (HH:MM:SS)
- Direction: "TO: [Recipient]" or "FROM: [Sender]"
- Message content (markdown rendered)
- Auto-scroll to latest
- Filter by agent or department
- SSE-driven — new messages slide in

### 4.6 Finance Tracker
**Top section — Incoming Funds:**
- Provident Fund: R476,261 (arriving in 4-8 weeks)
- Immediate: R17,500 (available now)

**Debt Sweep Waterfall (ordered):**
1. Capitec Access: R120,880 — PAID ✓
2. Absa PL: R134,243 — PAID ✓
3. Absa Credit 1: R114,943 — PAID ✓
4. Absa Car Loan: R51,239 — PAID ✓
5. Nedbank Credit: R7,654 — PAID ✓
6. Naaielah: R27,000 — PAID ✓
7. Remaining: Capitec Credit R49,020 + Absa Credit 2 R69,994

**Bank Balances:**
- Capitec
- Absa
- Nedbank

**Progress bar:** "X% of debt cleared"
**Status per debt:** PLANNED / IN PROGRESS / PAID / OVERDUE

### 4.7 Investments
**Top row:**
- SOL Balance (live)
- Total Portfolio Value USD / SOL (live)
- SOL Price from Binance (live)

**Open Positions table:**
| Token | Entry Price | Current Price | Size | P&L | P&L % | Status |
Real-time updates via SSE

**Recent Trades table:**
| Time | Token | Side | Amount | Price | P&L |
Last 10 trades

**Active Signals feed:**
- BOBNET badge (T1/T2)
- Token + mint (truncated)
- AI Score (≥25 = green, <25 = red)
- Direction: BUY/SELL
- Confidence %
- Timestamp
- Executed: YES ✓ / SKIPPED ✗

### 4.8 Agent Config
**Per agent card:**
- Avatar + Name
- Role title (editable)
- Department badge
- Status: active/idle/offline (read)
- Tools access list (read)
- Current prompt/instructions (editable textarea)
- Active/Enabled toggle (editable)

**Agents:**
- Athena (CTO)
- Apollo (CMO)
- Hermes (CRO)
- Nova (COO)
- Spartan
- BOBNET Listener
- Twitter Monitor
- Cross Reference Engine
- Exit Manager
- Trade Executor

### 4.9 Reports
**8 Report Types with color badges:**
1. Daily Standup — #60a5fa (blue)
2. Trade Confirmation — #4ade80 (green)
3. Signal Alert — #fbbf24 (yellow)
4. LinkedIn Report — #8b5cf6 (purple)
5. Debt Elimination Update — #f87171 (red)
6. Risk Audit — #fb923c (orange)
7. Twitter Alpha — #22d3ee (cyan)
8. Cross-Reference — #a78bfa (light purple)

**List view:**
- Date
- Report type badge
- Author agent
- 1-line preview (first line of content)
- Expandable: full content + action items

---

## 5. Component Inventory

### Shared
- `MetricCard` — number, label, trend indicator, icon
- `AgentAvatar` — initials, gradient bg, status dot overlay
- `StatusBadge` — colored dot + text (active/idle/offline)
- `PriorityBadge` — HIGH/MEDIUM/LOW with colors
- `DepartmentBadge` — colored badge per department
- `ReportTypeBadge` — colored badge per report type
- `Sidebar` — collapsible, icon + label, active state
- `MobileNav` — bottom tab bar
- `Header` — clock (UTC + SAST), connection status, SOL price

### States
- Default, hover (border glow), active (accent border), disabled (muted)
- Loading: skeleton shimmer
- Empty: illustrated empty state with action button
- Error: red border + error message

---

## 6. Technical Approach

### Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS variables
- **Animation:** Framer Motion
- **Drag-and-drop:** @dnd-kit/core + @dnd-kit/sortable
- **Icons:** Lucide React
- **Persistence:** localStorage (client-side)
- **Real-time:** SSE at `/api/mission-control/stream`

### Data Flow
```
Bot API (localhost:8787/data)
  → data-service polls every 1s
  → SSE stream at /api/mission-control/stream
  → Dashboard subscribes via EventSource
  → Components update selectively
  → localStorage persists user edits
```

### API Routes
- `GET /api/mission-control/stream` — SSE, proxies to bot + generates mock events for demo
- `GET /api/bot-state` — returns bot config (stop loss, take profit, etc.)

### localStorage Keys
- `mc_tasks` — kanban tasks
- `mc_standups` — standup entries
- `mc_comms` — boardroom messages
- `mc_finance` — debt entries + bank balances
- `mc_agent_config` — agent prompts + toggles
- `mc_reports` — filed reports
- `mc_activity` — activity feed

### Mock Data Pre-loaded
All 9 sections ship with rich mock data so the dashboard looks populated immediately. Real data wires in via SSE as agents are built.
