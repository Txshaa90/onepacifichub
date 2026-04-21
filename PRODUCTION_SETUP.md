# 🚀 Production Setup Guide

## Overview

This guide covers the production-ready setup for onepacifichub.com with Supabase authentication and Vercel deployment.

---

## ✅ What's Implemented

- **Unified Authentication**: Both login and registration use Supabase
- **No Local Fallback**: Production-ready, single source of truth
- **JWT Tokens**: Secure session management via Supabase
- **Auto-refresh**: Sessions automatically renewed
- **Password Security**: Passwords hashed by Supabase (never stored locally)

---

## 🔧 Prerequisites

1. **Supabase Account**: [supabase.com](https://supabase.com)
2. **Vercel Account**: [vercel.com](https://vercel.com)
3. **GitHub Repository**: Already set up ✅

---

## 📋 Step-by-Step Setup

### 1. Create Supabase Project (5 minutes)

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Organization**: Create or select existing
   - **Name**: `onepacifichub`
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
4. Click **"Create new project"**
5. Wait ~2 minutes for provisioning

---

### 2. Configure Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Ensure **Email** is enabled (should be by default)
3. **For Testing**: Disable email confirmation
   - Go to **Authentication** → **Settings**
   - Scroll to **"Email Confirmations"**
   - **Uncheck** "Enable email confirmations"
   - Click **Save**
4. **For Production**: Keep email confirmations enabled

---

### 3. Get API Credentials

1. In Supabase dashboard, click **Settings** (gear icon)
2. Click **API** in sidebar
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Under "Project API keys"

**⚠️ Important**: 
- The `anon` key is safe to expose in frontend
- Never use the `service_role` key in frontend code

---

### 4. Local Development Setup

1. **Copy environment template**:
   ```bash
   cp .env.example .env
   ```

2. **Add your Supabase credentials** to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Restart dev server**:
   ```bash
   npm run dev
   ```

4. **Test authentication**:
   - Go to `/register`
   - Create test account
   - Try logging in at `/login`

---

### 5. Vercel Deployment

#### A. Connect Repository

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository: `Txshaa90/onepacifichub.com`
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### B. Add Environment Variables

**⚠️ CRITICAL**: Add these in Vercel before deploying

1. In Vercel project settings, go to **Settings** → **Environment Variables**
2. Add both variables:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://your-project-id.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

3. Set for: **Production**, **Preview**, and **Development**
4. Click **Save**

#### C. Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2 minutes)
3. Test your production site

---

### 6. Configure Supabase Site URL

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your production domain:
   ```
   https://onepacifichub.com
   ```
3. Add **Redirect URLs**:
   ```
   https://onepacifichub.com/**
   https://onepacifichub.vercel.app/**
   ```
4. Click **Save**

---

## 🔐 Security Checklist

### ✅ Password Security

- ✅ Passwords hashed by Supabase (bcrypt)
- ✅ Never stored in localStorage
- ✅ Never logged or exposed
- ✅ Minimum 8 characters enforced

### ✅ Token Security

- ✅ JWT tokens with expiration
- ✅ Auto-refresh before expiry
- ✅ Stored in localStorage (XSS-safe if no eval)
- ✅ Cleared on logout

### ✅ API Security

- ✅ Using `anon` key (not `service_role`)
- ✅ Row Level Security ready
- ✅ Rate limiting enabled by Supabase

---

## 🛡️ Enable Row Level Security (RLS)

Protect user data with database policies:

### 1. Create Profiles Table

In Supabase **SQL Editor**, run:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 2. Verify RLS is Working

```sql
-- Test as authenticated user
SELECT * FROM profiles WHERE id = auth.uid();  -- ✅ Works

-- Test accessing other user's data
SELECT * FROM profiles WHERE id != auth.uid(); -- ❌ Returns nothing
```

---

## 📊 User Management

### View Users

1. Go to **Authentication** → **Users**
2. See all registered users
3. Actions available:
   - View user details
   - Manually verify email
   - Delete user
   - Ban user

### User Metadata

Stored automatically on registration:
- `firstName`
- `lastName`
- `email`
- `id` (UUID)

Access in your app:
```javascript
const { user } = useAuth()
console.log(user.firstName, user.lastName, user.email)
```

---

## 🎨 Customize Email Templates

### 1. Confirmation Email

1. Go to **Authentication** → **Email Templates**
2. Click **"Confirm signup"**
3. Customize HTML template
4. Use variables: `{{ .ConfirmationURL }}`, `{{ .SiteURL }}`

### 2. Password reset (OTP flow)

The app uses **custom Edge Functions** (`send-reset-otp`, `verify-reset-otp`, `reset-password`), not Supabase’s magic-link reset. Configure and deploy those functions; optional Supabase **“Reset password”** email template is unused for this flow.

---

## 🚨 Troubleshooting

### "Authentication not configured" Error

**Cause**: Environment variables not set

**Solution**:
1. Check `.env` file exists locally
2. Verify Vercel environment variables are set
3. Restart dev server after adding `.env`

### "Invalid login credentials" Error

**Possible causes**:
1. Wrong email/password
2. Email not verified (if verification enabled)
3. User doesn't exist

**Solution**:
- Check Supabase dashboard → Authentication → Users
- Manually verify email if needed
- Try password reset

### Users Can't Register

**Cause**: Email confirmations enabled but emails not configured

**Solution**:
1. Go to **Authentication** → **Settings**
2. Disable "Enable email confirmations" for testing
3. Or configure SMTP settings for production

### Vercel Build Fails

**Cause**: Missing environment variables

**Solution**:
1. Verify both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
2. Check they're set for all environments (Production, Preview, Development)
3. Redeploy after adding variables

---

## 📈 Monitoring & Analytics

### Supabase Dashboard

Monitor in real-time:
- **Auth**: Active users, signups, logins
- **Database**: Query performance
- **API**: Request volume, errors
- **Logs**: Real-time logs

### Set Up Alerts

1. Go to **Settings** → **Notifications**
2. Configure alerts for:
   - High error rates
   - Unusual login patterns
   - Database performance issues

---

## 🔄 Backup & Recovery

### Automatic Backups

- **Free tier**: Daily backups (7-day retention)
- **Pro tier**: Point-in-time recovery

### Manual Backup

```bash
# Export users (via Supabase dashboard)
Authentication → Users → Export
```

---

## 🎯 Production Checklist

Before going live:

- [ ] Supabase project created
- [ ] Email authentication configured
- [ ] API credentials copied
- [ ] `.env` file created locally
- [ ] Local testing completed
- [ ] Vercel environment variables added
- [ ] Production deployment successful
- [ ] Supabase Site URL configured
- [ ] Row Level Security enabled
- [ ] Email templates customized
- [ ] Test user registration
- [ ] Test user login
- [ ] Test password reset
- [ ] Test logout
- [ ] Monitor dashboard for errors

---

## 🌐 Domain Configuration

### Custom Domain (onepacifichub.com)

1. In Vercel, go to **Settings** → **Domains**
2. Add your domain: `onepacifichub.com`
3. Configure DNS records as shown
4. Update Supabase Site URL to match

---

## 💰 Pricing

### Supabase Free Tier

- 50,000 monthly active users
- 500 MB database space
- 1 GB file storage
- 2 GB bandwidth

**Perfect for starting out!**

### When to Upgrade

Consider Pro ($25/month) when:
- Need more than 50k MAU
- Want point-in-time recovery
- Need priority support
- Require custom SMTP

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Vercel Deployment](https://vercel.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)

---

## 🎉 You're Production Ready!

Your authentication system is now:
- ✅ Secure
- ✅ Scalable
- ✅ Production-tested
- ✅ Ready for real users

**Next Steps**: Focus on your e-commerce features and Shopify integration!
