# 🚗 Event Operations Studio

**Mission Control for Event Logistics & Carpool Coordination**

An intelligent event operations dashboard that transforms chaotic event signup management into a streamlined, real-time coordination experience. Built during IrvineHacks 2026.

---

## 🎯 Inspiration

I faced a painful problem organizing events: **manually assigning hundreds of participants to carpool drivers** is tedious, error-prone, and wastes time. I wanted to build a command center where I could:
- See all participants and drivers at a glance
- Drag-and-drop riders into car seats in seconds
- Use voice commands ("Alex in John's car") for instant reassignment
- Get AI suggestions for optimal assignments
- Sync data directly from Google Sheets

Result: 20+ minutes of manual work condensed into seconds with safety constraints intact.

---

## 🚀 What I Built

A full-stack web app that combines real-time carpool visualization, drag-and-drop assignment, voice control, and AI insights into one dashboard.

### Key Features

#### 🗺️ **Real-Time Carpool Dashboard**
- Visual car layouts with drag-and-drop seat assignment
- Auto-enforced capacity constraints
- Self-driver tracking and waitlist management
- One-click auto-assignment for unassigned riders

#### 🎤 **Voice Command Control**
- Natural language commands ("Move Alex to John's car", "Alex is confirmed")
- AI-powered parsing with intent recognition
- Instant execution and full audit trail

#### 👥 **Participant Management**
- Real-time status tracking with role-based filtering
- Preferred ride partners, notes, and preferences
- Check-in and no-show tracking

#### 📊 **Dashboard & Insights**
- Live event statistics and AI-generated insights
- Approval workflows for capacity review and notes

#### 📋 **Google Sheets Integration**
- Import and real-time sync directly from sheets
- Single source of truth for participant data

#### 🔍 **Filtering & Search**
- Filter by role, officer status, and event status
- Search by name/email with multi-column sorting

---

## 🛠️ Tech Stack

### **Frontend & Framework**
- **Next.js 16** (React 19) – Full-stack framework with server components
- **TypeScript** – Type-safe development
- **Tailwind CSS 4** – Rapid UI development
- **Lucide React** – Icon library

### **State Management & Real-Time Updates**
- **Event Store pattern** – Custom centralized state management
- Real-time data synchronization across all views

### **Drag-and-Drop**
- **@dnd-kit** – Modern headless drag-and-drop library

### **Database**
- **SQLite** (better-sqlite3) – Lightweight, serverless
- **Drizzle ORM** – Type-safe queries with migrations

### **Data Visualization**
- **Recharts** – React charting library

### **External APIs & Services**
- **Google Sheets API** – Data import and sync
- **Web Speech API** – Voice recognition
- **Custom command parser** – AI-powered interpretation

### **UI Components**
- Custom badge, button, card, input, switch, tabs, tooltip
- TypeScript + Tailwind CSS

### **Development**
- **ESLint** – Code quality
- **Drizzle Kit** – Schema management

---

## 🏗️ Architecture & Implementation

### Database Schema

Two core tables:

1. **`participant_state`** – Personal info, roles, assignments, status, preferences, approvals
2. **`cars`** – Driver vehicles with capacity and occupancy

### Component Architecture (Domain-Driven)

```
components/
├── carpool/           # Drag-and-drop car visualization
├── participants/      # Participant management & display
├── dashboard/         # Summary and insights
├── sheets/            # Google Sheets integration
├── shared/            # Common UI patterns
└── ui/                # Reusable UI components
```

### Voice Command Pipeline

Capture → Transcribe → Parse (AI intent extraction) → Execute (database update) → Log & Broadcast to clients

### Real-Time Data Flow

Google Sheets/database → EventStore → components subscribe → drag-and-drop API updates → broadcast to all clients

---

## 📚 What I Learned

### **1. Drag-and-Drop Complexity**
Native HTML5 drag-and-drop was unintuitive for touch and complex layouts. Switching to `@dnd-kit` showed me the value of specialized libraries. Lesson: don't reinvent the wheel.

### **2. Real-Time State Sync**
Syncing across components without race conditions required: single source of truth, optimistic UI updates with rollback, and event-driven broadcasting.

### **3. Voice Command Ambiguity**
Natural language is messy. "Move Alex to John" has multiple interpretations. I built a resolution engine with fuzzy matching, disambiguation prompts, and learning from corrections.

---

## 🚧 Challenges & Solutions

| Challenge | Why It Mattered | My Solution |
|-----------|-----------------|--------------|
| **Solo project** | Teammates didn't get off the waitlist, so I had to handle all frontend, backend, and design alone | Focused on core features, prioritized ruthlessly, leveraged existing libraries to maximize impact |
| **Late start** | Didn't start coding until 4pm Saturday | Built fast with Next.js scaffolding and familiar tech stack; focused on MVP first |
| **Handling concurrent updates** | Multiple people using the dashboard simultaneously could cause conflicts | Implemented optimistic updates with server-side conflict resolution; used version numbers for data consistency |
| **Voice command accuracy** | Misheard commands could assign riders to wrong cars | Built fuzzy matching, confirmation prompts, and command preview before execution |
| **Google Sheets sync lag** | Real-time sync caused excessive API calls (Google rate limits) | Implemented smart debouncing (batch updates every 5 seconds) + polling fallback |
| **Visual clarity with many cars** | Dashboard becomes cluttered with 50+ cars visible | Implemented car grouping, filtering, and scrollable car lanes |

---

##  Project Structure

```
src/
├── app/                  # Next.js app directory
│   ├── api/             # API routes (carpool, participants, voice, sheets)
│   ├── sheet/           # Individual sheet view pages
│   ├── page.tsx         # Dashboard home page
│   └── layout.tsx       # Root layout
├── components/          # React components (organized by domain)
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and business logic
│   ├── db/             # Database schema and access
│   ├── aiInsights.ts   # AI insight generation
│   ├── carpoolOptimizer.ts  # Auto-assignment algorithm
│   ├── googleSheets.ts # Google Sheets API integration
│   └── ...
├── types/               # TypeScript type definitions
└── (styling & config files)
```

---

## 🔮 Future Features

- **AI Survey Analysis** – Parse preference surveys to automatically detect compatible ride partners
- **Mobile App** – React Native companion for real-time mobile operations
- **SMS Notifications** – Twilio integration to notify participants of car assignments
- **Predictive Analytics** – ML model to forecast no-shows and optimize assignments proactively
- **Multi-Event Management** – Manage multiple concurrent events from single dashboard
- **Driver Fatigue Tracking** – Monitor drive times for safety compliance
- **Cost Splitting** – Built-in carpool cost calculator and Venmo integration

---

## 🤝 Contributing

Feedback and improvements welcome! Open issues or submit PRs.

---

## 📜 License

This project is open source and available under the MIT License.

---

## 🏆 Hackathon Notes

**Event:** IrvineHacks 2026  
**Focus:** Real-time collaboration, voice interfaces, AI command parsing  
**Key Achievement:** Turning 20+ minutes of manual work into seconds of voice commands and drag-and-drop.

Built to solve a real problem I faced organizing events.
