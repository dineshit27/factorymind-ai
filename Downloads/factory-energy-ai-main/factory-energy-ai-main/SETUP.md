# FactoryMind AI - Authentication & Backend Setup Guide

## Prerequisites
- Node.js 18+ installed
- A Supabase account (or Lovable Cloud enabled)
- Git installed

## Step 1: Install Dependencies

First, install the required npm packages:

```bash
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase JavaScript client
- All existing dependencies

## Step 2: Set Up Supabase Project

### Option A: Using Lovable Cloud (Recommended)
1. Enable Lovable Cloud in your project dashboard
2. Your Supabase credentials will be automatically configured
3. Skip to Step 3

### Option B: Using Your Own Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to finish setting up
4. Go to Project Settings → API
5. Copy your `Project URL` and `anon/public` key

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Open `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Never commit `.env` file to version control!

## Step 4: Set Up Database Tables

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `database/setup.sql`
4. Click "Run" to execute the SQL

This will create:
- `diagnoses` table - Stores machine diagnosis data
- `calibrations` table - Stores monthly bill calibrations
- Row Level Security (RLS) policies - Ensures users can only access their own data
- Indexes for better query performance

## Step 5: Enable Email Authentication

1. In Supabase dashboard, go to Authentication → Providers
2. Enable "Email" provider
3. Configure email templates (optional):
   - Go to Authentication → Email Templates
   - Customize confirmation and password reset emails

## Step 6: Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Features Enabled

### 🔐 Authentication
- **Sign Up**: New users can create accounts with email/password
- **Sign In**: Existing users can log in
- **Sign Out**: Users can log out from navbar
- **Password Reset**: Users can request password reset emails
- **Protected Routes**: Dashboard, Diagnosis, Results, and Calibration pages require authentication

### 📊 Backend Integration
- **Save Diagnoses**: All diagnosis data is saved to the database
- **View History**: Users can see their past diagnoses in the dashboard
- **Calibrations**: Monthly bill calibrations are stored per user
- **User Profiles**: Basic profile management

### 🔒 Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure authentication with Supabase Auth
- Environment variables for sensitive data

## Project Structure

```
src/
├── contexts/
│   ├── AuthContext.tsx          # Authentication state management
│   └── DiagnosisContext.tsx     # Diagnosis data management
├── lib/
│   ├── supabase.ts              # Supabase client configuration
│   ├── api.ts                   # API functions for backend
│   └── calculations.ts          # Energy calculation utilities
├── pages/
│   └── Login.tsx                # Login/signup page with real auth
└── components/
    └── Navbar.tsx               # Shows user state, sign out button

database/
└── setup.sql                    # Database schema and policies
```

## API Usage Examples

### Save a Diagnosis
```typescript
import { diagnosisAPI } from '@/lib/api';

await diagnosisAPI.saveDiagnosis({
  factoryName: "My Factory",
  machineData: { /* ... */ },
  diagnosis: { /* ... */ },
  energyLoss: { /* ... */ },
  roiOptions: { /* ... */ }
});
```

### Get User's Diagnoses
```typescript
import { diagnosisAPI } from '@/lib/api';

const diagnoses = await diagnosisAPI.getDiagnoses();
```

### Save Calibration
```typescript
import { calibrationAPI } from '@/lib/api';

await calibrationAPI.saveCalibration({
  predictedBill: 35000,
  actualBill: 32000,
  month: "2026-02"
});
```

## Using Authentication in Components

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, signOut } = useAuth();
  
  return (
    <div>
      {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}
```

## Troubleshooting

### "Invalid API key" error
- Check that your `.env` file has the correct Supabase URL and anon key
- Make sure environment variable names start with `VITE_`
- Restart the dev server after changing `.env`

### "relation does not exist" error
- Make sure you ran the `database/setup.sql` script in Supabase
- Check that you're connected to the correct Supabase project

### Authentication not working
- Verify email provider is enabled in Supabase dashboard
- Check browser console for error messages
- Ensure `.env` variables are set correctly

### Users can't sign up
- Check Supabase dashboard → Authentication → Users
- Look for any rate limiting or email confirmation requirements
- Verify SMTP settings if using custom email

## Next Steps

1. **Customize Email Templates**: Go to Supabase → Authentication → Email Templates
2. **Add More Tables**: Extend `database/setup.sql` with additional tables
3. **Implement Data Sync**: Update DiagnosisPage to save data automatically
4. **Add Analytics**: Track user engagement and feature usage
5. **Deploy**: Deploy to production when ready

## Support

For issues with:
- **Lovable Cloud**: Contact Lovable support
- **Supabase**: Check [Supabase documentation](https://supabase.com/docs)
- **This Application**: Check the code comments and console logs

---

**Security Reminder**: Never commit `.env` files or expose API keys publicly!
