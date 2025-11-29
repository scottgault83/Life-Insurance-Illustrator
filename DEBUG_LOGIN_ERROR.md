# Debug Login Error - Diagnostic Guide

Use this guide to identify and fix the login error you're experiencing.

## Step 1: Verify Your .env.local

Your `.env.local` file is CORRECT ✅

```
NEXT_PUBLIC_SUPABASE_URL=https://zhamiohqedunljftheig.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoYW1pb2hxZWR1bmxqZnRoZWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTE2MDksImV4cCI6MjA3OTk2NzYwOX0.YxHUFrLpjuJyODVCP1DRyUMCwt2h8qak28SfmeYOUWY
```

✅ URL starts with `https://`
✅ Anon key is present and long
✅ Both variables are in correct format

**Your .env.local is NOT the problem.**

---

## Step 2: Check Your Supabase Project Status

Go to https://supabase.com and check:

1. ✅ Is your project `zhamiohqedunljftheig` visible?
2. ✅ Is the project status showing as "Active"?
3. ✅ Can you access the Supabase dashboard?

If the project shows as "Paused" or "Error", that could be the issue.

---

## Step 3: Verify `calculator_sessions` Table

In your Supabase dashboard:

1. Click **Tables** in left sidebar
2. Look for `calculator_sessions` table
3. Click on it
4. Verify it exists and shows columns

**Did you complete the SQL setup from SUPABASE_SETUP_CHECKLIST.md?**
- [ ] Yes, I ran the SQL code
- [ ] No, I haven't run the SQL code yet

If you haven't run the SQL yet, **go do that first** before testing login.

---

## Step 4: Get the Error Message Details

This is CRITICAL for debugging. Please provide:

### 4A. The Exact Error Text
When you try to sign up or log in, what does the error message say exactly?

Copy it here:
```
[Paste the error message here]
```

### 4B. Check Browser Console

1. Open your browser
2. Press `F12` key to open Developer Tools
3. Click the **"Console"** tab
4. Look for RED error messages
5. Copy any red errors and paste them here:

```
[Paste console errors here]
```

### 4C. Check Network Tab (Advanced)

1. Open Developer Tools (F12)
2. Click **"Network"** tab
3. Try to sign up or log in
4. Look for red/failed requests to:
   - `/api/auth/signup`
   - `/api/auth/login`
5. Click on the failed request
6. Go to **"Response"** tab
7. Copy the error response:

```
[Paste network response here]
```

---

## Step 5: Common Error Scenarios

### Scenario A: "Invalid API Key" or "API key not found"

**Problem**: `.env.local` not loaded by development server

**Solution**:
1. Stop dev server: `Ctrl+C`
2. Run: `npm run dev`
3. Wait for "Ready in..." message
4. Try logging in again

### Scenario B: "Invalid email or password"

**Problem**: Account doesn't exist

**Solution**:
1. Click **"Create Account"**
2. Use a NEW email you haven't tried before
3. Use password: `TestPassword123!`
4. Click "Create Account"
5. Wait 3-5 seconds for response

### Scenario C: "CORS error" or "Fetch failed"

**Problem**: Supabase project or database issue

**Solution**:
1. Go to Supabase dashboard
2. Check if project is "Active"
3. Check if database is running
4. Verify API URL in `.env.local` matches Supabase project URL

### Scenario D: "Cannot POST /api/auth/signup"

**Problem**: API route not found

**Solution**:
1. Verify files exist:
   - `/app/api/auth/signup/route.ts` ✓
   - `/app/api/auth/login/route.ts` ✓
2. Stop and restart dev server
3. Check build output for errors

### Scenario E: "User already exists"

**Problem**: You already signed up with this email

**Solution**:
1. Use a different email address
2. Or try logging in instead of creating account

---

## Step 6: Verify Database Table

If you haven't created the `calculator_sessions` table, the application might fail silently.

**Did you run this SQL code?**

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

CREATE INDEX idx_calculator_sessions_user_id ON calculator_sessions(user_id);
CREATE INDEX idx_calculator_sessions_updated_at ON calculator_sessions(updated_at);

ALTER TABLE calculator_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions" ON calculator_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON calculator_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON calculator_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON calculator_sessions
  FOR DELETE USING (auth.uid() = user_id);
```

If no, please:
1. Go to Supabase dashboard
2. Click **SQL Editor**
3. Copy and paste the SQL code above
4. Click **Run**
5. Wait for success message

---

## Step 7: Files That Are Correct

These files have been verified and are correct:

✅ **`.env.local`**
- Contains correct Supabase URL
- Contains correct Anon Key
- Format is correct

✅ **`lib/supabase.ts`**
- Correctly imports Supabase
- Correctly reads environment variables
- Correctly creates Supabase client

✅ **`app/api/auth/signup/route.ts`**
- API route syntax correct
- Supabase auth code correct
- Error handling correct

✅ **`app/api/auth/login/route.ts`**
- API route syntax correct
- Supabase auth code correct
- Cookie setting correct

✅ **`app/login/page.tsx`**
- Form syntax correct
- API calls correct
- UI correct

✅ **Application Build**
- Compiles without errors
- No TypeScript errors
- No syntax errors

---

## What to Do Now

1. **Tell me the exact error message** you see on the login screen
2. **Open browser console** (F12 → Console) and copy any red errors
3. **Check Supabase dashboard** to verify:
   - Project exists and is Active
   - `calculator_sessions` table exists
   - RLS policies are enabled

Once you provide the error message, I can pinpoint the exact issue and fix it.

---

## Quick Checklist

- [ ] `.env.local` exists in project root (verified ✓)
- [ ] `.env.local` has correct URL and key (verified ✓)
- [ ] Dev server restarted after .env.local creation
- [ ] Supabase project is "Active"
- [ ] `calculator_sessions` table created (SQL run)
- [ ] RLS policies enabled on table
- [ ] Tried signing up with NEW email
- [ ] Checked browser console for errors
- [ ] Checked Network tab for failed requests

Once you've checked these, provide the error message and I'll fix it!
