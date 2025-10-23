# 🚀 Complete Backend Setup Guide

This guide will help you set up the complete Supabase backend for the AquaWatt water management system.

## 📋 **Prerequisites**

1. **Supabase Account**: You already have this set up
2. **Project URL**: `https://wbkmlltglyqnszlkzeot.supabase.co`
3. **Database Access**: Your Supabase dashboard

## 🗄️ **Step 1: Set Up Database Schema**

### **1.1 Run the Complete Schema**

1. Go to your Supabase dashboard: `https://supabase.com/dashboard/project/wbkmlltglyqnszlkzeot`
2. Navigate to **SQL Editor**
3. Copy the **entire contents** of `supabase/schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** to execute the schema

### **1.2 Verify Tables Created**

After running the schema, you should see these tables in **Table Editor**:
- ✅ `profiles` - User profiles
- ✅ `water_usage` - Water consumption tracking
- ✅ `devices` - Smart water devices
- ✅ `water_goals` - User goals and targets
- ✅ `achievements` - User achievements
- ✅ `notifications` - System notifications
- ✅ `billing` - Billing records
- ✅ `water_rates` - Dynamic pricing
- ✅ `analytics_cache` - Performance optimization
- ✅ `system_settings` - User preferences
- ✅ `water_quality` - Water quality metrics

## 🔐 **Step 2: Configure Authentication**

### **2.1 Authentication Settings**

1. Go to **Authentication** → **Settings**
2. Configure these settings:
   - **Site URL**: `http://localhost:8080`
   - **Redirect URLs**: `http://localhost:8080/**`
   - **Enable email confirmations**: ✅ ON
   - **Enable email change confirmations**: ✅ ON

### **2.2 Email Templates**

1. Go to **Authentication** → **Email Templates**
2. Update **Confirm signup** template:
   ```html
   <h2>Confirm your signup</h2>
   <p>Follow this link to confirm your user:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
   <p>Or copy and paste this link in your browser:</p>
   <p>{{ .ConfirmationURL }}</p>
   ```

3. Update **Reset password** template:
   ```html
   <h2>Reset your password</h2>
   <p>Follow this link to reset your password:</p>
   <p><a href="{{ .ConfirmationURL }}">Reset password</a></p>
   <p>Or copy and paste this link in your browser:</p>
   <p>{{ .ConfirmationURL }}</p>
   ```

### **2.3 SMTP Configuration (Optional but Recommended)**

For reliable email delivery, set up Gmail SMTP:

1. Go to **Authentication** → **Settings** → **SMTP Settings**
2. Configure:
   - **Host**: `smtp.gmail.com`
   - **Port**: `587`
   - **Username**: Your Gmail address
   - **Password**: Gmail app password (not regular password)
   - **Sender email**: Your Gmail address
   - **Sender name**: AquaWatt

## 🧪 **Step 3: Test the Backend**

### **3.1 Start the Application**

```bash
cd "C:\Users\dinesh\Downloads\waterlight-harmony-07-main (2)\waterlight-harmony-07-main"
npm run dev
```

### **3.2 Test Connection**

1. Visit `http://localhost:8080/about`
2. Check the **Supabase Connection Test**:
   - Database Connection: ✅ connected
   - Authentication: No user signed in (normal)

### **3.3 Test Authentication**

1. Click **Sign In** button (top-right)
2. Try **Sign Up** with a test email
3. Check your email for confirmation link
4. Sign in and verify authentication works

### **3.4 Seed Sample Data**

1. On the About page, find **Data Setup** component
2. Click **"Seed Sample Data"** button
3. This will create:
   - 4 smart water devices
   - 30 days of usage data
   - Water goals and targets
   - Billing information
   - Sample notifications

## 🎯 **Step 4: Explore Features**

After seeding data, you can test all features:

### **Dashboard** (`/dashboard`)
- Real-time water usage statistics
- Device status monitoring
- Goal progress tracking

### **Analytics** (`/analytics`)
- Usage trends and patterns
- Cost analysis
- Efficiency scoring
- Historical data visualization

### **Devices** (`/devices`)
- Smart device management
- Add/edit/delete devices
- Device status monitoring
- Location tracking

### **Billing** (`/billing`)
- Monthly billing generation
- Rate management
- Payment tracking
- Cost projections

### **Profile** (`/profile`)
- User profile management
- Settings and preferences
- Account information

## 🔧 **Backend Features**

### **Database Functions**
- `get_water_usage_stats()` - Analytics calculations
- `calculate_billing_amount()` - Dynamic pricing
- `generate_monthly_billing()` - Automated billing

### **Row Level Security (RLS)**
- All tables have RLS policies
- Users can only access their own data
- Secure data isolation

### **Real-time Features**
- Live usage tracking
- Instant notifications
- Real-time analytics updates

### **Performance Optimization**
- Analytics caching
- Optimized queries
- Efficient data structures

## 🚨 **Troubleshooting**

### **Database Connection Issues**
- Check your Supabase URL and API key
- Verify the schema was run successfully
- Check browser console for errors

### **Authentication Issues**
- Verify email settings in Supabase
- Check SMTP configuration
- Ensure redirect URLs are correct

### **Data Issues**
- Use the Data Setup component to seed data
- Check RLS policies if data access fails
- Verify user is properly authenticated

## 📊 **Sample Data Structure**

The seeded data includes:
- **Devices**: 4 smart water meters/sensors
- **Usage**: 30 days of realistic water consumption
- **Goals**: Daily and monthly targets
- **Billing**: Tiered pricing structure
- **Notifications**: System alerts and achievements

## 🎉 **You're All Set!**

Your AquaWatt water management system now has a fully functional backend with:
- ✅ Complete database schema
- ✅ User authentication
- ✅ Real-time data processing
- ✅ Analytics and reporting
- ✅ Billing and cost tracking
- ✅ Device management
- ✅ Notification system

Start exploring the features and managing your water consumption! 💧
