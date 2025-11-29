# Detailed Supabase Setup Guide - Step by Step

This is a beginner-friendly guide for setting up Supabase for the first time.

## What is Supabase?

Supabase is a Backend-as-a-Service (BaaS) platform that provides:
- **Database**: PostgreSQL database in the cloud
- **Authentication**: User sign-up and login management
- **API**: Automatic REST and GraphQL APIs
- **Security**: Row Level Security (RLS) to protect data

Think of it as a database server that you don't have to maintain - Supabase handles all the infrastructure.

---

## Part 1: Create Your Supabase Account

### Step 1.1: Visit Supabase Website

1. Open your web browser
2. Go to **https://supabase.com**
3. You should see a landing page with a "Start Your Project" or similar button

### Step 1.2: Sign Up or Log In

1. Click the **"Sign Up"** button (usually in the top right)
2. You have several options:
   - **Sign up with GitHub** (recommended if you have a GitHub account)
   - **Sign up with Google**
   - **Sign up with email** (create username and password)

For this guide, we'll use **Sign Up with Email**:

1. Click **"Sign Up"** or **"Create Account"**
2. Enter your email address: `scottgault83@example.com` (or your actual email)
3. Create a password (remember this password!)
4. Click **"Sign Up"** or **"Create Account"**
5. Check your email for a verification link and click it
6. You'll be taken to your Supabase dashboard

---

## Part 2: Create a Supabase Project

### Step 2.1: Create a New Project

Once you're logged into Supabase:

1. You should see a dashboard or a button to create a new project
2. Click **"New Project"** or **"Create a new project"** button
3. This opens a form with several fields to fill out

### Step 2.2: Fill in Project Details

**Project Name**
- Enter: `Life Insurance Illustrator`
- This is just a label for you to identify this project

**Database Password**
- Create a strong password (this is different from your Supabase login password)
- This protects your database
- Example: `MySecurePassword123!@#`
- **Save this password somewhere safe** - you might need it later

**Region**
- This is the geographic location where your database will be hosted
- Click the dropdown and select the region closest to you
- If you're in the US, choose a US region (e.g., `us-east-1`)
- If you're in Europe, choose a EU region

**Organization** (if applicable)
- You can skip this or select your personal organization

### Step 2.3: Create the Project

1. Review your settings one more time:
   - Project Name: Life Insurance Illustrator
   - Database Password: [your strong password]
   - Region: [selected region]

2. Click **"Create New Project"** button

3. **Wait**: Supabase will now create your project. This takes 2-5 minutes. You'll see a loading screen with a spinning indicator.

4. Once complete, you'll see your project dashboard

---

## Part 3: Get Your API Credentials

These are the keys you need to add to your `.env.local` file.

### Step 3.1: Navigate to Project Settings

1. In your Supabase dashboard, look for the left sidebar
2. Click on **"Settings"** at the bottom of the sidebar (usually shows a gear icon ⚙️)

### Step 3.2: Find Your Project URL and API Keys

1. In the Settings menu, click on **"API"** (should be near the top)
2. You'll see a section called **"Project API keys"** or similar

3. Look for these two values:

   **Value #1: Project URL**
   - Label: `Project URL`, `API URL`, or `Supabase URL`
   - Looks like: `https://your-project-ref.supabase.co`
   - **Copy this value** - you'll need it for `NEXT_PUBLIC_SUPABASE_URL`

   **Value #2: Anon Public Key**
   - Label: `anon` or `Anon Public` or `public`
   - Looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long)
   - **Copy this value** - you'll need it for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Important**: There's also a "service_role" key - do NOT use this one. Stick with the "anon" key.

### Step 3.3: Save These Values

Open a text editor and save these two values temporarily:

```
Project URL: https://your-project-ref.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

You'll add them to your `.env.local` file later.

---

## Part 4: Create Database Tables

This is where we set up the structure for storing your calculator sessions.

### Step 4.1: Access the SQL Editor

1. In your Supabase dashboard left sidebar, look for **"SQL Editor"** (should show a `</>` icon)
2. Click on **"SQL Editor"**
3. You should see a blank area to write SQL commands

### Step 4.2: Create the Database Table

1. In the SQL Editor, you'll see a large text area
2. **Delete any existing text** in this area
3. **Copy and paste** the entire SQL code below:

```sql
-- Create calculator_sessions table
CREATE TABLE calculator_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_name VARCHAR(255) NOT NULL,
  input_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT user_sessions_unique UNIQUE(user_id, session_name)
);

-- Create indexes for faster queries
CREATE INDEX idx_calculator_sessions_user_id ON calculator_sessions(user_id);
CREATE INDEX idx_calculator_sessions_updated_at ON calculator_sessions(updated_at);

-- Enable Row Level Security (RLS)
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

### Step 4.3: Execute the SQL

1. After pasting the code, look for a **"Run"** button or **"Execute"** button (usually in the top right or bottom right of the SQL editor)
2. Click **"Run"** or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)
3. **Wait a moment** for the query to execute

### Step 4.4: Verify Success

1. You should see a green success message like:
   - ✓ Success
   - Query executed successfully
   - Or similar

2. If you see an error message in red, something went wrong. Common issues:
   - **Typo in SQL**: Re-copy the entire SQL code
   - **RLS not available**: Try disabling RLS first, then run the policies
   - **Permission denied**: Make sure you're using the correct Supabase account

3. If successful, you're done with SQL! The table is now created.

### Step 4.5: Verify Table Creation (Optional)

To double-check the table was created:

1. In the left sidebar, click **"Tables"** (should show a database icon)
2. You should see **`calculator_sessions`** listed
3. Click on it to see the columns you just created

---

## Part 5: Configure Your Application

Now you'll add the Supabase credentials to your application.

### Step 5.1: Create .env.local File

1. Open your project folder in your code editor (where you have the Premium Finance Illustrator code)
2. In the project root directory, create a new file named: `.env.local`
   - This file goes in the root, not in any subfolder
   - It should be at the same level as `package.json`

### Step 5.2: Add Your Credentials

1. Open the `.env.local` file you just created
2. Type (or paste) the following:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Replace the values:
   - Replace `https://your-project-ref.supabase.co` with your actual **Project URL** from Step 3.3
   - Replace the long string with your actual **Anon Key** from Step 3.3

4. Example (with real values):
```
NEXT_PUBLIC_SUPABASE_URL=https://abc123def456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyAiYWxnIjogIkhTMjU2IiB9
```

5. **Save the file** (Ctrl+S or Cmd+S)

### Step 5.3: Restart Your Development Server

1. If your development server is running, stop it:
   - Press `Ctrl+C` in your terminal

2. Start it again:
   ```bash
   npm run dev
   ```

3. The environment variables are now loaded

---

## Part 6: Test Your Configuration

Let's make sure everything is working!

### Step 6.1: Start the Application

1. If you haven't already, start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to: **http://localhost:3000**

3. You should be **redirected to the login page** (`http://localhost:3000/login`)

### Step 6.2: Create a Test Account

1. On the login page, click **"Create Account"**

2. Fill in the form:
   - **Email**: `test@example.com` (or any email)
   - **Password**: `TestPassword123!` (use a strong password)

3. Click **"Create Account"**

4. **Wait for response** (takes a moment while Supabase creates the account)

5. You should see one of these:
   - Success: Redirected to `/home` page
   - Error: Error message displayed

### Step 6.3: If You See an Error

Common errors and solutions:

**Error: "Cannot POST /api/auth/signup"**
- The API endpoint isn't working
- Check that all files in `/app/api/auth/` were created correctly
- Restart your dev server

**Error: "Invalid API key" or "Missing credentials"**
- Your `.env.local` file wasn't loaded
- Stop and restart your dev server
- Check the Project URL and Anon Key are copied correctly (no extra spaces)

**Error: "Email already exists"**
- You already signed up with this email
- Use a different email address for testing

**Error: "Database connection failed"**
- Supabase may still be initializing (wait a few minutes)
- Check your Project URL is correct
- Verify the `calculator_sessions` table was created

### Step 6.4: Successful Sign Up

If you see the `/home` page with a message like "You don't have any saved sessions yet":
- ✅ Your Supabase connection is working!
- ✅ Your database is set up correctly!
- ✅ Authentication is functioning!

### Step 6.5: Test Saving a Session

1. Click **"New Session"** button on the home page

2. You should be directed to the calculator (`/`) page

3. You'll see a **"Save Session"** button at the top

4. Make some changes to the inputs (change a number, adjust rates, etc.)

5. Click **"Save Session"**

6. Enter a session name like: `Test Session 1`

7. Click **"Save"** button

8. You should see a success message: "Session saved successfully!"

9. Click **"Back to Sessions"** button

10. You should now see your saved session listed on the home page with:
    - Session name: "Test Session 1"
    - Creation and update dates
    - Quick preview of the parameters

### Step 6.6: Test Loading a Session

1. Click **"Load Session"** on your test session

2. You should be taken back to the calculator page

3. Click **"Back to Sessions"** again

4. Verify your session still appears

---

## Part 7: Understanding What You Just Created

### The Table Structure

Your `calculator_sessions` table has these columns:

| Column | Type | Purpose |
|--------|------|---------|
| `id` | UUID | Unique identifier for each session (auto-generated) |
| `user_id` | UUID | Links session to the user who created it |
| `session_name` | Text | The name you give to the session |
| `input_data` | JSON | The calculator settings saved (all the parameters) |
| `created_at` | Timestamp | When the session was first created |
| `updated_at` | Timestamp | When the session was last modified |

### Row Level Security (RLS)

The policies you created ensure:
- Users can **only see their own sessions**
- Users can **only modify their own sessions**
- Users can **only delete their own sessions**

This means even if someone got your API key, they still can't see other users' data.

### How It Works

1. User signs up → Supabase creates a user record with a unique ID
2. User saves a session → App sends calculator data with their user ID
3. User's next session → App loads only sessions with their user ID
4. User deletes session → Only they can delete their own sessions

---

## Troubleshooting

### Problem: "Connection refused" when trying to sign up

**Solution:**
- Check your `.env.local` file exists in the root directory
- Verify the Project URL doesn't have typos
- Restart your dev server with `npm run dev`
- Check the browser console (F12 → Console tab) for error messages

### Problem: Sessions aren't saving

**Solution:**
- Go to Supabase dashboard → Tables → `calculator_sessions`
- Check that the table exists and has columns
- Go to `calculator_sessions` → RLS Policies
- Verify all 4 policies are enabled (toggles on the right should be ON)

### Problem: Can create account but can't see sessions

**Solution:**
- Sessions are stored per user
- Make sure you're logged in with the same email you signed up with
- Check browser session storage hasn't been cleared
- Open DevTools (F12) → Application → Session Storage → Verify `userId` is stored

### Problem: "Invalid API key" error

**Solution:**
- Go back to Supabase → Settings → API
- Copy the Project URL again (use the copy button, don't type it)
- Copy the Anon Key again
- Paste into `.env.local` (make sure no extra spaces)
- Restart dev server

### Problem: SQL execution failed

**Solution:**
- If the error mentions "table already exists", the table was created successfully. You can ignore this.
- If other errors, try copying the SQL code again carefully
- You can click "New Query" to create a fresh SQL editor window
- Try breaking the code into smaller pieces and running each part separately

---

## Important Security Notes

### Never Commit `.env.local` to Git

The `.env.local` file contains your API keys and should NOT be uploaded to GitHub:

1. Your `.env.local` should already be in `.gitignore` (a file that tells Git to ignore it)
2. You can verify this by checking if `.gitignore` contains `.env.local`
3. When you push to GitHub, `.env.local` will NOT be included (this is good!)

### The "anon" Key is Safe to Expose

- The Anon Key (used by the client) is designed to be public
- It has limited permissions (can only access through RLS policies)
- Users can't do anything unauthorized because of Row Level Security
- The Service Role key (NOT the anon key) would be dangerous to expose

### On Vercel (Production)

When you deploy to Vercel:
1. Add environment variables in Vercel project settings
2. Go to Vercel dashboard → Your project → Settings → Environment Variables
3. Add:
   - Key: `NEXT_PUBLIC_SUPABASE_URL`, Value: `https://your-project.supabase.co`
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Value: `your-anon-key`
4. Redeploy your project

---

## Next Steps

Once your Supabase is configured and working:

1. **Test thoroughly** with different sessions
2. **Try deleting** a session to verify it works
3. **Sign up with different emails** to test multi-user functionality
4. **Export your data** from Supabase if needed (found in Settings)
5. **Set up monitoring** (optional - Supabase dashboard shows usage)

---

## Getting Help

If you get stuck:

1. **Check the error message carefully** - it usually tells you what's wrong
2. **Look at the browser console** - Press F12, go to Console tab
3. **Check Supabase documentation**: https://supabase.com/docs
4. **Check Supabase status**: https://status.supabase.com (might be down for maintenance)

---

## Quick Reference

**Project Setup Checklist:**

- [ ] Created Supabase account
- [ ] Created project "Life Insurance Illustrator"
- [ ] Saved database password
- [ ] Copied Project URL
- [ ] Copied Anon Key
- [ ] Created `.env.local` file in project root
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` to `.env.local`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`
- [ ] Ran SQL to create `calculator_sessions` table
- [ ] Verified RLS policies are enabled
- [ ] Restarted dev server
- [ ] Tested account creation
- [ ] Tested session saving
- [ ] Tested session loading

Once all items are checked, you're ready to use the application!
