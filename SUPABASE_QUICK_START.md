# Supabase Quick Start - TL;DR Version

If you want just the essential steps without all the explanation, here's the condensed version:

## 5-Minute Setup

### 1. Create Supabase Account (2 min)
- Go to https://supabase.com
- Click "Sign Up"
- Sign up with email, GitHub, or Google
- Verify your email

### 2. Create Project (3 min)
- Click "New Project"
- **Project Name**: `Life Insurance Illustrator`
- **Password**: Create a strong password
- **Region**: Pick closest to you (e.g., `us-east-1` for US)
- Click "Create New Project"
- ⏳ Wait 2-5 minutes for creation

### 3. Get Your API Keys (1 min)
In your Supabase dashboard:
1. Left sidebar → **Settings** → **API**
2. Copy two values:
   - **Project URL** (looks like `https://abc123.supabase.co`)
   - **Anon Public** key (the long string under "anon")

### 4. Create Database Table (2 min)
1. Left sidebar → **SQL Editor**
2. Delete any existing text
3. Paste this entire code:

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

4. Click **Run** button
5. ✓ Should see green success message

### 5. Add Credentials to Your App (1 min)
1. In your project root, create file: `.env.local`
2. Add these 2 lines (replace with YOUR values from step 3):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-long-anon-key-string
```
3. Save the file
4. Restart dev server: `npm run dev`

### 6. Test It (2 min)
1. Go to http://localhost:3000
2. Click "Create Account"
3. Sign up with test email: `test@example.com`
4. Click "New Session"
5. Change some calculator values
6. Click "Save Session" → Name it → Save
7. Click "Back to Sessions"
8. ✓ You should see your saved session!

---

## Common Issues

| Problem | Solution |
|---------|----------|
| "Cannot POST /api/auth/signup" | Restart dev server: `npm run dev` |
| "Invalid API key" | Copy URL and key again from Supabase, paste into `.env.local`, restart |
| "Email already exists" | Use different test email |
| "Database connection failed" | Wait 5 mins for Supabase to fully initialize |
| Sessions not saving | Check RLS policies are ON in Supabase dashboard |
| Can't see sessions on home page | Sessions are per-user. Make sure you're logged in with same email |

---

## File Checklist

Before testing, verify these files exist:

In `/app/api/auth/`:
- ✓ `login/route.ts`
- ✓ `signup/route.ts`

In `/app/api/sessions/`:
- ✓ `route.ts`
- ✓ `[id]/route.ts`

In `/app/`:
- ✓ `home/page.tsx`

In `/components/`:
- ✓ `SessionSaver.tsx`

In `/lib/`:
- ✓ `supabase.ts`

In `/` (root):
- ✓ `.env.local` (should be created by you)

---

## Copy-Paste Your Credentials

Once you get them from Supabase, paste here temporarily, then copy into `.env.local`:

```
My Project URL:
[Paste here]

My Anon Key:
[Paste here]
```

---

## Detailed Guide

For more detailed explanations, see: **SUPABASE_DETAILED_SETUP.md**
