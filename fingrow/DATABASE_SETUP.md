# Database Setup Guide

## Issue: "Invalid Request" Error During Signup

The signup error occurs because the PostgreSQL database is not running or not configured.

## Quick Fix Options

### Option 1: Use Docker (Recommended - Easiest)

1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/

2. Run this command to start PostgreSQL:
```bash
docker run --name fingrow-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=fingrow -p 5432:5432 -d postgres
```

3. Push the database schema:
```bash
npm run db:push
```

4. Seed the database:
```bash
npm run db:seed
```

### Option 2: Install PostgreSQL Locally

1. Download and install PostgreSQL from https://www.postgresql.org/download/

2. During installation, set password as "password" (or update .env file)

3. Create a database named "fingrow":
```sql
CREATE DATABASE fingrow;
```

4. Push the database schema:
```bash
npm run db:push
```

5. Seed the database:
```bash
npm run db:seed
```

### Option 3: Use a Cloud Database (Free Tier)

#### Using Neon (Recommended for development)

1. Go to https://neon.tech and create a free account

2. Create a new project

3. Copy the connection string

4. Update your `.env` file:
```
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
```

5. Push the database schema:
```bash
npm run db:push
```

6. Seed the database:
```bash
npm run db:seed
```

#### Using Supabase

1. Go to https://supabase.com and create a free account

2. Create a new project

3. Go to Settings > Database and copy the connection string

4. Update your `.env` file with the connection string

5. Push the database schema:
```bash
npm run db:push
```

6. Seed the database:
```bash
npm run db:seed
```

## Verify Database Connection

After setting up the database, verify it's working:

```bash
npx prisma studio
```

This will open Prisma Studio where you can view your database tables.

## Current Database Configuration

Your `.env` file is currently configured for:
- Host: localhost
- Port: 5432
- Database: fingrow
- User: postgres
- Password: password

## What Was Fixed in the Code

1. **Signup Form**: Now properly converts string inputs to numbers before sending to API
2. **API Validation**: Better error messages showing exactly what validation failed
3. **Error Handling**: More descriptive error messages for debugging

## Testing Without Database (Temporary)

If you want to test the UI without setting up a database, you can:

1. Comment out the database calls in the API routes
2. Return mock data instead
3. This is NOT recommended for production but useful for UI testing

## Need Help?

If you're still having issues:
1. Check if PostgreSQL is running: `pg_isready` (if installed locally)
2. Check Docker containers: `docker ps` (if using Docker)
3. Verify .env file has correct DATABASE_URL
4. Check Prisma schema: `npx prisma validate`
