# Supabase Setup Checklist

Print this out or check off items as you complete them.

---

## Phase 1: Supabase Account & Project

### Create Account
- [ ] Go to https://supabase.com
- [ ] Click "Sign Up"
- [ ] Sign up (with email, GitHub, or Google)
- [ ] Verify your email address
- [ ] Log into Supabase dashboard

### Create Project
- [ ] Click "New Project"
- [ ] Enter Project Name: `Life Insurance Illustrator`
- [ ] Create Database Password: `________________` (save this!)
- [ ] Select Region: `________________`
- [ ] Click "Create New Project"
- [ ] ⏳ Wait 2-5 minutes for project creation
- [ ] Project dashboard loaded successfully

---

## Phase 2: Get Your Credentials

### Copy API Credentials
1. Go to Supabase dashboard → **Settings** → **API**

- [ ] Found "API" in Settings menu
- [ ] Located "Project API keys" section
- [ ] Found and copied **Project URL**
  - Value: `https://________________.supabase.co`
  - Saved to: `________________`

- [ ] Found and copied **Anon Public Key**
  - Value: `eyJhbGciOiJIUzI1Ni...` (copy the whole thing!)
  - Saved to: `________________`

### Verify You Have Both Values
- [ ] Project URL copied correctly (starts with `https://`)
- [ ] Anon Key copied correctly (very long string)
- [ ] Neither value has extra spaces at beginning/end
- [ ] Values saved in safe location

---

## Phase 3: Create Database Table

### Access SQL Editor
- [ ] In Supabase dashboard, found "SQL Editor" in left sidebar
- [ ] Clicked on "SQL Editor"
- [ ] Empty SQL editor is open and ready

### Execute SQL Code
- [ ] Copied entire SQL code from **SUPABASE_QUICK_START.md**
- [ ] Pasted SQL code into SQL editor
- [ ] Clicked **"Run"** button (or pressed Ctrl+Enter)
- [ ] ✓ Saw green success message

### Verify Table Creation
- [ ] Clicked "Tables" in left sidebar
- [ ] Found `calculator_sessions` table in list
- [ ] Table shows 6 columns (id, user_id, session_name, input_data, created_at, updated_at)
- [ ] Clicked on table to view its structure
- [ ] Confirmed columns match expected structure

### Verify RLS Policies
- [ ] Clicked on `calculator_sessions` table
- [ ] Went to "RLS Policies" section
- [ ] Verified 4 policies exist:
  - [ ] "Users can view their own sessions"
  - [ ] "Users can insert their own sessions"
  - [ ] "Users can update their own sessions"
  - [ ] "Users can delete their own sessions"
- [ ] All 4 policies show as **ENABLED** (toggle is ON)

---

## Phase 4: Configure Your Application

### Create Environment File
- [ ] In project root directory, created `.env.local` file
- [ ] File is at same level as `package.json` (not in a subfolder)
- [ ] File name is exactly `.env.local` (not `.env.local.example`)

### Add Credentials to .env.local
- [ ] Opened `.env.local` in code editor
- [ ] Added line: `NEXT_PUBLIC_SUPABASE_URL=`
  - [ ] Replaced with your actual Project URL (from Phase 2)
  - [ ] Example: `https://abc123def456.supabase.co`

- [ ] Added line: `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
  - [ ] Replaced with your actual Anon Key (from Phase 2)
  - [ ] Key is very long (usually 100+ characters)

- [ ] Saved the `.env.local` file (Ctrl+S)

### Verify File Format
```
Check that your .env.local looks like this (NOT the example values):

NEXT_PUBLIC_SUPABASE_URL=https://your-actual-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-long-key-string
```

- [ ] File has exactly 2 lines
- [ ] Each line has `KEY=VALUE` format
- [ ] No quotes around values
- [ ] No extra spaces or blank lines
- [ ] No commented out lines (no `#` symbols)

### Restart Development Server
- [ ] Stopped previous dev server (Ctrl+C in terminal)
- [ ] Ran `npm run dev` command
- [ ] Dev server started successfully
- [ ] Saw message: "Ready in [time]" or "Compiled in [time]"
- [ ] Application runs on http://localhost:3000

---

## Phase 5: Test Configuration

### Test Sign Up
- [ ] Opened browser to http://localhost:3000
- [ ] Automatically redirected to http://localhost:3000/login
- [ ] Login page displays with Email and Password fields
- [ ] Found "Create Account" link/button
- [ ] Clicked "Create Account"

### Create Test Account
- [ ] Email field: Entered `test@example.com` (or your test email)
- [ ] Password field: Entered `TestPassword123!` (or your test password)
- [ ] Clicked "Create Account" button
- [ ] ⏳ Waited for response (should take 2-5 seconds)

### Verify Account Creation Success
Choose one of these:

**If successful:**
- [ ] Redirected to http://localhost:3000/home
- [ ] Home page displays
- [ ] See message: "You don't have any saved sessions yet"
- [ ] See "New Session" button
- [ ] ✅ SUCCESS! Account creation works!

**If error:**
- [ ] Error message displayed
- [ ] Error message says: `________________`
- [ ] Review troubleshooting section in SUPABASE_DETAILED_SETUP.md

---

## Phase 6: Test Session Saving

### Create a Session
- [ ] On home page, clicked "New Session" button
- [ ] Redirected to calculator page (http://localhost:3000/)
- [ ] Calculator page displays with inputs and table
- [ ] See "Save Session" button at the top

### Save Session Data
- [ ] Made a change in calculator (e.g., changed Death Benefit value)
- [ ] Clicked "Save Session" button
- [ ] Modal/input appeared asking for session name
- [ ] Entered session name: `Test Session 1`
- [ ] Clicked "Save" button
- [ ] ⏳ Waited for save to complete (1-2 seconds)
- [ ] ✓ Saw success message: "Session saved successfully!"

### Verify Session Appears
- [ ] Clicked "Back to Sessions" button
- [ ] Redirected to home page
- [ ] See table with saved sessions
- [ ] Session appears with:
  - [ ] Name: "Test Session 1"
  - [ ] Creation date and time
  - [ ] Update date and time
  - [ ] Preview showing Death Benefit and other parameters
  - [ ] "Load Session" button
  - [ ] Delete button (trash icon)

---

## Phase 7: Test Session Loading

### Load a Session
- [ ] On home page, saw saved session
- [ ] Clicked "Load Session" button for your test session
- [ ] Redirected to calculator page
- [ ] Calculator shows the data you saved previously

### Verify Data
- [ ] Check that values match what you saved
- [ ] Death Benefit should be the modified value
- [ ] All other parameters preserved
- [ ] Session ID stored (you can verify in browser DevTools if interested)

---

## Phase 8: Test Session Deletion

### Delete a Session
- [ ] Return to home page (click "Back to Sessions")
- [ ] See your test session in the list
- [ ] Clicked delete button (trash icon) on test session
- [ ] Browser shows confirmation: "Are you sure you want to delete this session?"
- [ ] Clicked "OK" or "Yes" to confirm
- [ ] ⏳ Waited for deletion (1-2 seconds)

### Verify Deletion
- [ ] Session no longer appears in the sessions list
- [ ] Home page now shows: "You don't have any saved sessions yet"
- [ ] "New Session" button is available again

---

## Final Verification

### Everything Working?
- [ ] Account creation works
- [ ] Session saving works
- [ ] Session loading works
- [ ] Session deletion works
- [ ] No error messages appearing
- [ ] Application runs smoothly

### ✅ SETUP COMPLETE!

You're ready to use the Premium Finance Illustrator with full user authentication and session management!

---

## Common Issues Reference

If something doesn't work, check these:

### Issue: Redirected to login immediately
- [ ] Check that `.env.local` exists in project root
- [ ] Check that credentials are correct (no typos, no extra spaces)
- [ ] Restart dev server with `npm run dev`

### Issue: Sign up button shows error
- [ ] Check browser console (F12 → Console tab) for error message
- [ ] If "Cannot POST /api/auth/signup", restart dev server
- [ ] If "Invalid API key", verify credentials in `.env.local`

### Issue: Sessions won't save
- [ ] Check Supabase dashboard → Settings → API
  - [ ] Verify your URL and key match `.env.local`
- [ ] Check RLS policies in Supabase:
  - [ ] Go to Tables → calculator_sessions
  - [ ] Click "RLS Policies"
  - [ ] Verify all 4 policies are ENABLED (toggle ON)

### Issue: Can't see saved sessions
- [ ] Sessions are per-user
- [ ] Make sure you're logged in with the email you signed up with
- [ ] Check browser DevTools (F12) → Application → Session Storage
  - [ ] Look for `userId` entry
  - [ ] If missing, you might not be logged in

---

## Need Help?

1. Check the error message displayed in the application
2. Open browser console (F12 → Console tab) and look for red error messages
3. Review relevant section in **SUPABASE_DETAILED_SETUP.md**
4. Check Supabase status: https://status.supabase.com
5. Visit Supabase documentation: https://supabase.com/docs

---

## Save This Checklist

Keep this file as reference. You've completed:
- ✅ Phase 1: Account & Project Setup
- ✅ Phase 2: API Credentials
- ✅ Phase 3: Database Setup
- ✅ Phase 4: Application Configuration
- ✅ Phase 5: Testing Sign Up
- ✅ Phase 6: Testing Session Saving
- ✅ Phase 7: Testing Session Loading
- ✅ Phase 8: Testing Session Deletion

**Congratulations! Your Supabase setup is complete!** 🎉
