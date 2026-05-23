<p align="center">
  <img src="https://img.shields.io/badge/SmartExpense-Intelligent%20Finance%20Tracker-6366f1?style=for-the-badge&logo=cashapp&logoColor=white" alt="SmartExpense" />
</p>

<h1 align="center">💰 SmartExpense</h1>

<p align="center">
  <strong>An intelligent, full-stack expense tracker with AI-powered insights, beautiful charts, and smart budgeting.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Chart.js-v4-FF6384?style=flat-square&logo=chartdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

---

## ✨ Features

### 🔐 Authentication
- Secure user registration & login with **JWT** tokens
- Password hashing with **bcrypt**
- Protected routes with automatic token refresh

### 💸 Expense Management
- Full **CRUD** operations for expenses
- **AI auto-categorization** — leave the category empty and the AI engine detects it from the title
- Search & filter by category, date range, and keywords
- Recurring expense tracking (weekly, monthly, yearly)
- **CSV export** for all your expense data

### 💵 Income Tracking
- Record income from multiple sources (Salary, Freelance, Investments, etc.)
- Source-based summary cards with totals

### 📊 Budget Management
- Set monthly spending limits
- Animated **SVG progress ring** with color-coded status
- Per-category spending breakdown with progress bars
- Budget warnings when approaching or exceeding limits

### 📈 Dashboard
- Financial overview with stat cards (Balance, Income, Expenses, Categories)
- **Pie Chart** — Category spending breakdown
- **Bar Chart** — Monthly spending trends
- **Line Chart** — Income vs Expenses over time
- Recent expenses list

### 🤖 AI-Powered Insights
- **Smart auto-categorization** using keyword matching (Food, Transport, Shopping, Bills, etc.)
- **Period-over-period comparison** — month-over-month and week-over-week spending analysis
- **Anomaly detection** using z-score statistical analysis to flag unusual expenses
- **Category distribution analysis** with percentage breakdowns
- **Actionable insights** — spending alerts, savings tips, and trend warnings

### 🎨 Premium UI/UX
- **Glassmorphic design** with backdrop blur and semi-transparent cards
- **Dark/Light mode** toggle with system preference detection
- Smooth micro-animations and transitions
- Fully **responsive** — mobile, tablet, and desktop
- Inter font from Google Fonts
- Indigo-to-violet gradient accents

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 5, React Router v6 |
| **Styling** | Tailwind CSS v3, PostCSS, custom glassmorphism utilities |
| **Charts** | Chart.js 4 via react-chartjs-2 |
| **Icons** | react-icons (Heroicons v2) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JSON Web Tokens (JWT) + bcryptjs |
| **Validation** | express-validator |
| **AI Engine** | Rule-based (no API key needed) — swappable with OpenAI |
| **Dev Tools** | Concurrently, dotenv, nodemon |

---

## 📁 Project Structure

```
smartexpense/
├── client/                        # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Charts/            # PieChart, BarChart, LineChart
│   │   │   ├── BudgetCard.jsx     # Animated SVG progress ring
│   │   │   ├── ExpenseForm.jsx    # Add/edit expense modal
│   │   │   ├── IncomeForm.jsx     # Add income modal
│   │   │   ├── InsightCard.jsx    # AI insight display card
│   │   │   ├── Layout.jsx         # Sidebar + content wrapper
│   │   │   ├── Notification.jsx   # Toast notifications
│   │   │   ├── ProtectedRoute.jsx # Auth guard
│   │   │   └── Sidebar.jsx        # Navigation sidebar
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # Auth state management
│   │   │   └── ThemeContext.jsx   # Dark/light mode
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      # Financial overview + charts
│   │   │   ├── Expenses.jsx       # Expense list + CRUD
│   │   │   ├── Income.jsx         # Income entries
│   │   │   ├── Budget.jsx         # Budget management
│   │   │   ├── Reports.jsx        # AI analysis page
│   │   │   ├── Login.jsx          # Login form
│   │   │   └── Register.jsx       # Registration form
│   │   ├── services/              # API calls + CSV export
│   │   ├── App.jsx                # Route configuration
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Tailwind + custom utilities
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                        # Express backend
│   ├── controllers/               # Route handlers
│   │   ├── authController.js      # Register, login
│   │   ├── expenseController.js   # Expense CRUD + filters
│   │   ├── incomeController.js    # Income CRUD
│   │   ├── budgetController.js    # Budget get/set
│   │   └── aiController.js        # AI analysis endpoint
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js, Expense.js, Income.js, Budget.js
│   ├── routes/                    # Express route definitions
│   ├── middleware/auth.js         # JWT verification
│   ├── services/aiService.js     # AI engine (rule-based)
│   ├── server.js                  # App entry point
│   └── package.json
├── render.yaml                    # Render.com deployment config
├── package.json                   # Root workspace scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** — either local install or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)

### Installation

```bash
# Clone the repository
git clone https://github.com/Ronith-A/smartexpense.git
cd smartexpense

# Install all dependencies (root + server + client)
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### Configuration

Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smartexpense
JWT_SECRET=your_super_secret_key_here
```

> **💡 Tip:** If you don't have MongoDB installed locally, the app will automatically use an **in-memory database** for development (data won't persist across restarts).

### Running

```bash
# Start both frontend and backend concurrently
npm run dev

# Or run separately:
npm run server   # Backend on http://localhost:5000
npm run client   # Frontend on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Reference

All endpoints (except auth) require a `Bearer` token in the `Authorization` header.

### Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | `{ name, email, password }` | Register a new user |
| `POST` | `/api/auth/login` | `{ email, password }` | Login, returns JWT |

### Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/expenses?category=Food&search=coffee&startDate=2024-01-01&endDate=2024-12-31` | List with filters |
| `POST` | `/api/expenses` | Create expense (auto-categorizes if no category) |
| `PUT` | `/api/expenses/:id` | Update expense |
| `DELETE` | `/api/expenses/:id` | Delete expense |

### Income

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/income` | List all income entries |
| `POST` | `/api/income` | Create income entry |

### Budget

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/budget` | Get current month's budget |
| `POST` | `/api/budget` | Set/update monthly budget |

### AI Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/analyze` | Full AI analysis (insights, anomalies, summary, comparison) |
| `POST` | `/api/ai/analyze` `{ type: "categorize", title: "..." }` | Auto-categorize a title |

---

## 🌐 Deployment (Free)

### One-Click Deploy to Render

This repo includes a `render.yaml` for easy deployment:

1. **Database** — Create a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
2. **Hosting** — Deploy to [Render.com](https://render.com):

| Setting | Value |
|---------|-------|
| Build Command | `cd client && npm install && npm run build && cd ../server && npm install` |
| Start Command | `cd server && node server.js` |
| Environment | `NODE_ENV=production`, `JWT_SECRET=<generate>`, `MONGO_URI=<atlas-uri>` |

---

## 🤖 AI Engine Details

The AI engine uses **rule-based intelligence** (no API key required):

- **Auto-categorization** — Matches expense titles against 100+ keywords across 10 categories
- **Anomaly Detection** — Uses z-score analysis (>2σ from mean) to flag unusual spending
- **Trend Analysis** — Compares month-over-month and week-over-week spending
- **Smart Insights** — Generates actionable recommendations based on spending patterns

> **Upgrade Path:** Replace `server/services/aiService.js` with OpenAI API calls to get GPT-powered insights. The controller interface stays the same.

---

## 🎨 Design System

| Element | Specification |
|---------|--------------|
| **Primary** | Indigo-to-violet gradient (`#6366f1` → `#8b5cf6`) |
| **Success** | Emerald `#10b981` |
| **Danger** | Rose `#f43f5e` |
| **Warning** | Amber `#f59e0b` |
| **Font** | Inter (300–800 weights) |
| **Cards** | Glassmorphism — `backdrop-blur-xl` + semi-transparent bg |
| **Animations** | fade-in, slide-up, scale-in, pulse-slow |
| **Dark mode** | Slate-900 base with subtle card surfaces |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Ronith-A">Ronith</a>
</p>
