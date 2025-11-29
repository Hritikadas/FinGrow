# FinGrow Setup Instructions

## Quick Start Guide

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Database Setup

#### Option A: Using Local PostgreSQL
1. Install PostgreSQL on your system
2. Create a database:
```sql
CREATE DATABASE fingrow;
```

3. Update `.env` file with your database credentials:
```
DATABASE_URL="postgresql://username:password@localhost:5432/fingrow"
```

#### Option B: Using Docker
```bash
docker run --name fingrow-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=fingrow -p 5432:5432 -d postgres
```

### Step 3: Initialize Database
```bash
# Push schema to database
npm run db:push

# Seed initial data (bundles)
npm run db:seed
```

### Step 4: Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Default Test Data

After seeding, you'll have 3 investment bundles:
- Safe Bundle (7% return)
- Balanced Bundle (10% return)
- Growth Bundle (14% return)

## Creating Your First User

1. Go to http://localhost:3000
2. Click "Get Started Free"
3. Fill in the signup form:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
   - Monthly Income: 50000
   - Monthly Expenses: 30000
4. Click "Sign Up"

## Testing Features

### 1. Dashboard
- View overview of investments
- See AI insights
- Quick actions

### 2. Investment Bundles
- Browse 3 pre-configured bundles
- View allocation charts
- See expected returns

### 3. Simulation
- Enter monthly investment amount
- Select duration (6, 12, 24, 36 months)
- Choose bundle type
- View projected returns with chart

### 4. Settings
- Toggle auto-investment rules:
  - Round-Up Rule
  - Percentage of Income (adjustable)
  - End-of-Month Sweep
- Change language (English/Hindi)

### 5. AI Chatbot
- Ask questions about investments
- Get recommendations
- Bilingual support (English + Hindi)

### 6. History
- View all investment records
- Track returns
- Monitor performance

## Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Update `.env` with production values:
```
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="strong-random-secret"
JWT_SECRET="strong-random-jwt-secret"
NEXTAUTH_URL="https://yourdomain.com"
```

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Other Platforms
The app is a standard Next.js application and can be deployed to:
- Vercel
- Netlify
- AWS
- Google Cloud
- Azure
- DigitalOcean

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Port Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

## API Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/transactions` - Get user transactions
- `POST /api/transactions` - Create transaction
- `GET /api/analysis` - Get spending analysis
- `GET /api/bundles` - Get investment bundles
- `GET /api/goals` - Get user goals
- `POST /api/goals` - Create new goal

## Tech Stack Details

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Auth**: JWT

## Support

For issues or questions, please check:
1. README.md for general information
2. This file for setup instructions
3. Code comments for implementation details
