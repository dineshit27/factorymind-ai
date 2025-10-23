# Supabase Setup Guide

## 🔧 Connecting to Your Supabase Workspace

### Step 1: Get Your Project Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Navigate to your organization and select your workspace
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Step 2: Create Environment File

Create a `.env` file in the project root with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Service Role Key (for server-side operations)
# VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Set Up Database Schema

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL to create all tables and policies

### Step 4: Configure Authentication

1. Go to **Authentication** → **Settings**
2. Configure your **Site URL**: `http://localhost:8080`
3. Add **Redirect URLs**: `http://localhost:8080/**`
4. Enable **Email** authentication
5. Configure **Google OAuth** if desired

### Step 5: Test the Connection

1. Start the development server: `npm run dev`
2. Visit `http://localhost:8080`
3. Go to the About page to see the connection test
4. Try signing up/signing in

## 🗄️ Database Schema

The project includes a comprehensive database schema with:

- **profiles** - User profiles
- **water_usage** - Water consumption tracking
- **devices** - Smart water devices
- **water_goals** - User goals and targets
- **achievements** - User achievements
- **notifications** - System notifications

All tables include Row Level Security (RLS) policies for data protection.

## 🔐 Authentication Features

- Email/Password authentication
- Google OAuth
- Guest mode
- User profile management
- Password reset functionality

## 📊 Next Steps

After setting up the environment variables and database schema:

1. Test the authentication flow
2. Try adding water usage data
3. Set up water goals
4. Test the device management features
