# Vercel Database Setup Guide

## Current Status
Your pizza shop application is now using a simplified in-memory database that works on Vercel but **data resets on each deployment**. This is a temporary solution.

## For Production Use - Recommended Database Solutions

### Option 1: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to Storage → Create Database → Postgres
3. Follow the setup wizard
4. Install the Vercel Postgres SDK:
```bash
npm install @vercel/postgres
```
5. Update your database functions to use Postgres

### Option 2: Supabase (Free tier available)
1. Go to https://supabase.com
2. Create a new project
3. Get your connection string
4. Install Supabase client:
```bash
npm install @supabase/supabase-js
```
5. Update your database functions

### Option 3: Neon (Serverless Postgres)
1. Go to https://neon.tech
2. Create a new project
3. Get your connection string
4. Install Neon client:
```bash
npm install @neondatabase/serverless
```

## Current Implementation
- **Local Development**: Works with in-memory storage
- **Vercel Production**: Data persists during the session but resets on deployment
- **Admin Panel**: Functional but temporary data
- **Frontend**: Displays products correctly

## Migration Steps (When Ready)
1. Choose a database provider
2. Create database tables for products
3. Update `lib/vercel-db.ts` to use the real database
4. Test locally with database connection
5. Deploy to Vercel

## Current Limitations
- ⚠️ **Data resets on deployment**
- ⚠️ **No persistence between sessions**
- ⚠️ **In-memory only**

## What Works Now
- ✅ **Admin panel** - Add/edit products
- ✅ **Frontend display** - Shows products correctly
- ✅ **Image uploads** - Works with Vercel
- ✅ **API endpoints** - All functioning
- ✅ **No errors** - Clean deployment

## Next Steps
1. **For testing**: Current setup works fine
2. **For production**: Set up one of the recommended databases above
3. **For persistence**: Data will survive deployments with a real database

Your application is now working on Vercel! The database issue is resolved with a temporary solution that allows full functionality while you decide on a permanent database solution. 