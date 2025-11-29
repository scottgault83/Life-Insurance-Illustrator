# Fix "Internal Server Error" on Login - Step by Step

You're getting "Internal server error" when trying to sign up. This guide will help you identify and fix the specific cause.

---

## Step 1: Restart Your Development Server

The code has been updated with better error messages. You need to restart your dev server to load the changes.

1. **Stop the dev server**:
   - Find the terminal running `npm run dev`
   - Press `Ctrl+C` to stop it
   - Wait for it to fully stop

2. **Start the dev server again**:
   ```bash
   npm run dev
   ```

3. **Wait for the server to be ready**:
   - You should see: "Ready in [time]" or "Compiled successfully"

---

## Step 2: Test Again and Get the New Error Message

Now that the dev server is restarted, try signing up again:

1. Go to http://localhost:3000
2. You should see the login page
3. Enter:
   - Email: `test@example.com`
   - Password: `TestPassword123!`
4. Click "Create Account"

Now you should get a **MORE SPECIFIC ERROR MESSAGE** instead of just "Internal server error".

**Copy this error message and tell me what it says.**

Examples of what it might be:
- "Cannot find module '@supabase/supabase-js'"
- "NEXT_PUBLIC_SUPABASE_URL is not set"
- "User creation failed - no user data returned"
- "Invalid API key provided"
- "Connection refused"
- Something else?

---

## Step 3: Check Your Terminal for Server Logs

While you're testing, look at your terminal running `npm run dev`:

1. You should see console logs appearing
2. Look for lines that say: `Signup error: ...` or `Login error: ...`
3. Copy what comes after "error:"
4. This is the actual error from the server

**Tell me what the server logs show.**

---

## Step 4: Most Likely Issue - Missing Calculator Sessions Table

This is the most common cause of "Internal server error" when authentication works but immediately fails.

### Did you create the `calculator_sessions` table?

If you haven't, do this now:

1. Go to https://supabase.com
2. Log into your project: `zhamiohqedunljftheig`
3. Click **SQL Editor** in left sidebar
4. Click **New Query**
5. Copy this entire SQL code:

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

6. Click **Run**
7. Wait for green success message
8. Then try signing up again

---

## Step 5: Check Supabase Project Status

Go to https://supabase.com and check:

1. ✅ Is your project visible in the left sidebar?
2. ✅ Is it showing status "Active"? (not "Paused" or "Error")
3. ✅ Can you access the database?

If it says "Paused":
- Click the three-dot menu next to your project
- Select "Resume project"
- Wait 2-3 minutes for it to restart

---

## Step 6: Verify Your Supabase Credentials Are Correct

Let me verify your credentials are correct. Your `.env.local` shows:

```
NEXT_PUBLIC_SUPABASE_URL=https://zhamiohqedunljftheig.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Check these match your Supabase project:**

1. Go to https://supabase.com
2. Go to your project dashboard
3. Click **Settings** → **API**
4. Verify:
   - Your Project URL matches the URL in `.env.local`
   - Your Anon Public key matches the key in `.env.local`

**If they don't match:**
1. Copy the correct values from Supabase
2. Update your `.env.local` file
3. Save it
4. Restart dev server: `npm run dev`
5. Try signing up again

---

## Step 7: Check Browser Developer Tools

1. Open your browser
2. Press `F12` key
3. Click the **"Console"** tab
4. Try signing up again
5. Look for any red error messages in the console
6. Copy these messages

**Examples of useful console errors:**
```
POST http://localhost:3000/api/auth/signup 500 (Internal Server Error)
Failed to parse URL from https://undefined.supabase.co
```

---

## Step 8: What the Error Messages Mean

Here are common error messages and what to do about them:

### "NEXT_PUBLIC_SUPABASE_URL is not set" or "cannot read property 'split' of undefined"
**Cause**: Environment variables not loaded

**Fix**:
1. Verify `.env.local` exists in project root
2. Verify it has both lines (URL and KEY)
3. Stop and restart dev server
4. Check that dev server says "Ready in..."

### "Invalid API key provided"
**Cause**: Anon key is wrong or doesn't match this project

**Fix**:
1. Go to Supabase dashboard
2. Settings → API
3. Copy the "anon" key again
4. Paste into `.env.local`
5. Restart dev server

### "User creation failed - no user data returned"
**Cause**: Supabase account creation succeeded but returned no user object

**Fix**:
1. Check that your email is valid format (has @ symbol)
2. Try with different email
3. Check Supabase project status (not paused)

### "Connection refused" or "ECONNREFUSED"
**Cause**: Cannot connect to Supabase servers

**Fix**:
1. Check your internet connection
2. Check Supabase project status
3. Try again in 30 seconds
4. Visit https://status.supabase.com to check if Supabase is having issues

### "User already exists"
**Cause**: You already signed up with this email

**Fix**:
1. Use a different email
2. Or click "Sign In" instead of "Create Account"

---

## What to Tell Me

Once you restart the dev server and try signing up again, please tell me:

1. **The new error message displayed on the login screen** (instead of "Internal server error")
2. **What your server terminal shows** when you get the error
3. **Any red errors in browser console** (Press F12 → Console)
4. **If you've created the calculator_sessions table** (yes/no)

With this information, I can pinpoint the exact issue and fix it.

---

## Quick Checklist

Before testing again:

- [ ] Dev server restarted (Ctrl+C, then npm run dev)
- [ ] Dev server shows "Ready in..." message
- [ ] You're using a new email (test@example.com)
- [ ] You're using a strong password (TestPassword123!)
- [ ] Browser is at http://localhost:3000
- [ ] You're about to click "Create Account" not "Sign In"

Then after testing:

- [ ] You got a NEW error message (more specific than "Internal server error")
- [ ] You checked the server terminal for error logs
- [ ] You checked browser console for red errors
- [ ] You verified the calculator_sessions table exists
- [ ] You verified Supabase project is "Active"

---

## Next Actions

1. **Restart dev server** (`npm run dev`)
2. **Try signing up again** with test@example.com
3. **Tell me the new error message** you see
4. I'll pinpoint the issue and provide a fix

The improved error messages will make it much easier to diagnose the problem!
