# Quick Fix for "Invalid Request" Error

## The Problem
The signup form shows "Invalid request" because the PostgreSQL database is not running.

## Fastest Solution (Using Docker)

### Step 1: Install Docker
Download from: https://www.docker.com/products/docker-desktop/

### Step 2: Start PostgreSQL Container
Open a terminal and run:
```bash
docker run --name fingrow-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=fingrow -p 5432:5432 -d postgres
```

### Step 3: Setup Database Schema
```bash
npm run db:push
```

### Step 4: Seed Initial Data
```bash
npm run db:seed
```

### Step 5: Test Signup
1. Go to http://localhost:3000
2. Click "Get Started Free"
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Monthly Income: 50000
   - Monthly Expenses: 30000
4. Click "Sign Up"

## What I Fixed in the Code

### 1. Signup Form (`src/app/signup/page.tsx`)
- ✅ Now properly converts income/expenses to numbers
- ✅ Validates inputs before sending to API
- ✅ Shows helpful error messages
- ✅ Displays database connection hints

### 2. API Route (`src/app/api/auth/signup/route.ts`)
- ✅ Better validation error messages
- ✅ Shows exactly which field failed validation
- ✅ Improved error logging

### 3. Error Handling
- ✅ More descriptive error messages
- ✅ Validation happens on both client and server
- ✅ Helpful hints when database is not connected

## Alternative: Use Cloud Database (No Installation)

### Using Neon (Free, 5 seconds setup)

1. Go to https://neon.tech
2. Sign up (free)
3. Create a project
4. Copy the connection string
5. Update `.env`:
```
DATABASE_URL="your-connection-string-here"
```
6. Run:
```bash
npm run db:push
npm run db:seed
```

## Verify It's Working

After database setup, you should see:
- ✅ Signup form accepts your data
- ✅ Redirects to dashboard
- ✅ Shows welcome message with your name

## Still Having Issues?

Check the browser console (F12) for detailed error messages. The improved error handling will show you exactly what's wrong.
