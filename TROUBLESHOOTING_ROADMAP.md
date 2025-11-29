# Troubleshooting Roadmap - Internal Server Error

## The Problem
You're getting **"Internal server error"** when trying to sign up.

## The Solution

### Step 1: Update Your Code ✅ DONE
I've updated the API routes to provide better error messages. The changes have been committed and pushed to GitHub.

**What changed:**
- API routes now return specific error messages instead of generic "Internal server error"
- Added error logging to help debug issues
- Added data validation checks

### Step 2: Restart Your Dev Server 🔄 YOU DO THIS NOW

1. **Find your terminal running `npm run dev`**
2. **Press `Ctrl+C` to stop it**
3. **Run: `npm run dev`**
4. **Wait for "Ready in..." message**

This loads the updated code with better error messages.

### Step 3: Test Sign Up Again 🧪 YOU DO THIS NEXT

1. Go to http://localhost:3000
2. Click "Create Account"
3. Enter:
   - Email: `test@example.com`
   - Password: `TestPassword123!`
4. Click "Create Account"
5. **Look at the error message**

You should now get a **MORE SPECIFIC ERROR** like:
- "NEXT_PUBLIC_SUPABASE_URL is not set"
- "Invalid API key"
- "User creation failed - no user data returned"
- Something else specific

### Step 4: Check Terminal and Console 📋 YOU DO THIS

**Check your terminal running npm run dev:**
- Look for line that says: `Signup error: ...`
- Copy what comes after

**Check browser console:**
- Press F12
- Click "Console" tab
- Look for red errors
- Copy them

### Step 5: Tell Me The New Error 📝 YOU DO THIS

**Reply with:**
1. The error message that appears in the app
2. What the terminal shows for "Signup error: ..."
3. Any red errors in browser console
4. Confirm if you've created the `calculator_sessions` table in Supabase (yes/no)

---

## Most Likely Issues & Quick Fixes

### Issue #1: Missing Calculator Sessions Table
**Symptom**: You get an error about the table or authentication fails after "Internal server error"

**Quick Fix**:
1. Go to https://supabase.com
2. Your project: `zhamiohqedunljftheig`
3. Click SQL Editor
4. Paste the CREATE TABLE code from FIX_INTERNAL_SERVER_ERROR.md
5. Click Run
6. Try signing up again

### Issue #2: Environment Variables Not Loaded
**Symptom**: Error says "URL is not set" or "undefined"

**Quick Fix**:
1. Stop dev server (Ctrl+C)
2. Run: `npm run dev`
3. Wait for "Ready in..."
4. Try signing up again

### Issue #3: Wrong Supabase Credentials
**Symptom**: Error says "Invalid API key"

**Quick Fix**:
1. Go to https://supabase.com
2. Go to your project settings
3. Copy the URL and Anon Key again
4. Update `.env.local`
5. Stop and restart dev server
6. Try signing up again

### Issue #4: Supabase Project Paused
**Symptom**: Connection errors, timeouts

**Quick Fix**:
1. Go to https://supabase.com
2. Check if project shows "Paused"
3. If yes, click menu and "Resume project"
4. Wait 2-3 minutes
5. Try signing up again

---

## What To Do Right Now

1. ✅ **Code is updated** (already done)

2. 🔄 **Restart dev server**:
   ```bash
   npm run dev
   ```

3. 🧪 **Test sign up again**:
   - Go to http://localhost:3000
   - Click "Create Account"
   - Use: test@example.com / TestPassword123!

4. 📝 **Tell me the new error message**

That's it! With the specific error message, I can provide an exact fix.

---

## Document Reference

For more details, see:
- **FIX_INTERNAL_SERVER_ERROR.md** - Detailed troubleshooting steps
- **DEBUG_LOGIN_ERROR.md** - Browser console debugging guide
- **SUPABASE_SETUP_CHECKLIST.md** - Verify Supabase setup is complete

---

## Timeline

1. **Now**: Restart dev server (2 minutes)
2. **Next**: Test sign up (1 minute)
3. **Then**: Tell me the error (30 seconds)
4. **Finally**: I'll send you the fix

Total time to resolution: ~10 minutes

---

## Quick Status Check

Before proceeding, verify:

- [ ] `.env.local` file exists and has URL and key
- [ ] Dev server is running (or you're about to restart it)
- [ ] You can access http://localhost:3000 in browser
- [ ] You're connected to internet

All good? Restart dev server and try signing up again!
