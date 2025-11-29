# Supabase Setup Guide

This document explains how to set up Supabase for the Premium Finance Illustrator application.

## Overview

The application now includes user authentication and session management using Supabase. Users can:
- Sign up with an email and password
- Log in to their account
- Save multiple calculator sessions with custom names
- Load previous sessions to continue working
- Delete sessions they no longer need

## Prerequisites

1. A Supabase account at https://supabase.com
2. Create a new Supabase project

## Step 1: Create Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New project"
3. Fill in the project name: "Life Insurance Illustrator"
4. Set a strong database password
5. Select your region (closest to your users)
6. Click "Create new project"
7. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Supabase Credentials

1. In your Supabase project, go to **Settings > API**
2. Copy these values:
   - **Project URL** - This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** - This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Do NOT share these keys publicly, but the anon key is safe for client-side use

## Step 3: Create Database Tables

In your Supabase project:

### 1. Create calculator_sessions table

1. Go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the following SQL:

```sql
CREATE TABLE calculator_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_name VARCHAR(255) NOT NULL,
  input_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_sessions_unique UNIQUE(user_id, session_name)
);

-- Create index for faster queries
CREATE INDEX idx_calculator_sessions_user_id ON calculator_sessions(user_id);
CREATE INDEX idx_calculator_sessions_updated_at ON calculator_sessions(updated_at);

-- Enable RLS (Row Level Security)
ALTER TABLE calculator_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Users can only see their own sessions
CREATE POLICY "Users can view their own sessions" ON calculator_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Create RLS policy: Users can insert their own sessions
CREATE POLICY "Users can insert their own sessions" ON calculator_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can update their own sessions
CREATE POLICY "Users can update their own sessions" ON calculator_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policy: Users can delete their own sessions
CREATE POLICY "Users can delete their own sessions" ON calculator_sessions
  FOR DELETE USING (auth.uid() = user_id);
```

4. Click **Run** to execute the SQL
5. You should see a success message

## Step 4: Configure Environment Variables

1. In your project root, create a `.env.local` file
2. Add the following lines with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with the credentials from Step 2.

3. **DO NOT commit this file to Git** - it contains sensitive information

## Step 5: Test the Application

1. Make sure your development server is running:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000 in your browser
3. You should be redirected to the login page
4. Click "Create Account" to sign up with a test email and password
5. After signing up, you'll be taken to the home page (which will be empty since you have no sessions)
6. Click "New Session" to start using the calculator
7. Make some changes to the calculator inputs
8. Click "Save Session" to save your work to the database

## Architecture

### Authentication Flow

1. User enters email and password on login page
2. Request sent to `/api/auth/login` or `/api/auth/signup`
3. Supabase authenticates the user
4. User ID and email stored in session storage
5. User is redirected to `/home` page

### Session Management Flow

1. User creates new session or loads existing one
2. Calculator inputs are stored in session storage (client-side)
3. When user clicks "Save Session", data is sent to `/api/sessions`
4. API route validates user ID and saves to Supabase database
5. Session ID stored in session storage for future updates
6. Subsequent saves update the same session record

### Database Queries

- **Create Session**: `POST /api/sessions`
- **Get All Sessions**: `GET /api/sessions?userId={userId}`
- **Update Session**: `PUT /api/sessions`
- **Delete Session**: `DELETE /api/sessions/{sessionId}`

## Field Definitions

### Login Page Fields

**Email**
- Your unique email address used to create your account and log in to the calculator

**Password**
- A secure password of your choice. Keep it confidential. You will use this password to access your account and saved sessions

## Troubleshooting

### "Connection refused" or "Cannot connect to database"
- Check that your `.env.local` file has the correct Supabase URL and API key
- Make sure you're using the `NEXT_PUBLIC_` prefix for environment variables
- Restart your development server after changing `.env.local`

### "User creation failed" or "Email already registered"
- Make sure you're using a valid email address
- If the email is already registered, try logging in instead of signing up

### Sessions not saving
- Check browser console for error messages
- Verify that Row Level Security (RLS) policies are enabled on the table
- Confirm that the `calculator_sessions` table was created successfully

### Can't see saved sessions on home page
- Make sure you're logged in with the same email address
- Check that the browser's session storage hasn't been cleared
- Verify that the database has the correct RLS policies applied

## Security Considerations

1. **API Keys**: The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is intentionally public and safe to expose in client-side code. Supabase uses Row Level Security (RLS) to ensure users can only access their own data.

2. **Row Level Security**: All database operations are protected by RLS policies that verify the requesting user owns the data.

3. **Session Storage**: User data is stored in browser session storage, which is cleared when the browser tab is closed.

4. **Password Security**: Passwords are hashed by Supabase using industry-standard algorithms.

## Deploying to Production

When deploying to Vercel or another hosting platform:

1. Add environment variables to your hosting platform:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. Do NOT add `.env.local` to Git - add it to `.gitignore` if not already there

3. Test the deployment thoroughly with test accounts

## Support

For Supabase documentation, visit: https://supabase.com/docs
