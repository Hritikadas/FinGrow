# FinGrow - AI-Powered Micro-Investment System

**Automate. Invest. Grow. Repeat.**

FinGrow is a production-ready AI-powered micro-investment platform built with Next.js 14, TypeScript, Prisma, and TailwindCSS.

## Features

### Core Features
- **User Authentication** - Secure signup/login with JWT
- **Smart Spending Analysis** - AI-powered expense categorization and insights
- **Liquidity Prediction** - Predict available funds for next 3 months
- **Automated Investment Rules**
  - Round-Up Rule (₹42 → ₹50, invest ₹8)
  - Percentage of Income (5%-20%)
  - End-of-Month Sweep (invest surplus)
- **Investment Bundles**
  - Safe Bundle (7% return, low risk)
  - Balanced Bundle (10% return, moderate risk)
  - Growth Bundle (14% return, high risk)
- **Investment Simulator** - Project returns over time
- **Investment History** - Track all investments and returns
- **AI Chatbot** - English + Hindi support

### Extra Features
- **Goal-Based Planning** - Set and track financial goals
- **Smart Notifications** - Alerts and behavioral nudges
- **Savings Streak Tracker** - Gamification
- **Multi-language Support** - English + Hindi

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS, Custom Neumorphic Design
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts
- **Authentication**: JWT

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone <repo-url>
cd fingrow
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/fingrow"
NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"
```

4. Set up the database
```bash
npm run db:push
npm run db:seed
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
fingrow/
├── src/
│   ├── app/                    # Next.js 14 app directory
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard page
│   │   ├── bundles/           # Investment bundles
│   │   ├── simulation/        # Simulator
│   │   ├── history/           # Investment history
│   │   ├── chatbot/           # AI chatbot
│   │   └── settings/          # User settings
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   └── Navbar.tsx        # Navigation
│   ├── lib/                   # Core utilities
│   │   ├── ai/               # AI engines
│   │   │   ├── SpendingAnalyzer.ts
│   │   │   ├── LiquidityPredictor.ts
│   │   │   ├── MicroInvestmentAllocator.ts
│   │   │   ├── RiskProfiler.ts
│   │   │   ├── BundleOptimizer.ts
│   │   │   └── SimulationEngine.ts
│   │   ├── auth.ts           # Authentication
│   │   ├── prisma.ts         # Database client
│   │   └── utils.ts          # Utilities
│   ├── types/                 # TypeScript types
│   └── data/                  # Seed data
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed script
└── public/                    # Static assets
```

## AI Engines

### 1. SpendingAnalyzer
Analyzes transaction history to identify:
- Category-wise breakdown
- Recurring expenses
- Spending trends
- Top expense categories

### 2. LiquidityPredictor
Predicts available surplus funds for next 3 months with confidence scores

### 3. MicroInvestmentAllocator
Calculates investment amounts based on active rules:
- Round-up calculations
- Percentage-based investments
- End-of-month sweep

### 4. RiskProfiler
Determines user risk profile based on:
- Age
- Income-to-expense ratio
- Investment horizon
- Recommends suitable bundle

### 5. BundleOptimizer
Optimizes asset allocation based on risk tolerance

### 6. SimulationEngine
Projects investment growth with compound interest calculations

## Database Schema

- **User** - User profiles and settings
- **Transaction** - Income and expense records
- **InvestmentHistory** - All investments
- **AIRule** - Auto-investment rules
- **Bundle** - Investment bundle definitions
- **Goal** - Financial goals
- **Notification** - User notifications
- **ChatMessage** - Chatbot history
- **Streak** - Savings/investment streaks

## API Routes

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

## Building for Production

```bash
npm run build
npm start
```

## License

MIT
