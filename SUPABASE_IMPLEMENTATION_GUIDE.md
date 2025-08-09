# Supabase Authentication Implementation Guide

This guide covers the complete implementation of Supabase authentication, landing page, and admin functionality for the Maia learning platform.

## 🚀 What's Been Implemented

### Core Authentication System
- ✅ Supabase client configuration (browser & server)
- ✅ Authentication middleware for route protection
- ✅ Auth context provider for global state management
- ✅ Login and signup forms with proper error handling
- ✅ Email confirmation flow
- ✅ Session persistence and refresh

### Pages & Components
- ✅ Landing page with authentication CTAs
- ✅ Login page (`/login`)
- ✅ Signup page (`/signup`)
- ✅ Admin dashboard (`/admin`)
- ✅ Auth callback handler (`/auth/callback`)

### Admin System
- ✅ Admin route guard component
- ✅ User management interface
- ✅ Role-based access control
- ✅ User role management (promote/demote admin)

## 📁 File Structure

```
lib/supabase/
  ├── client.ts           # Browser Supabase client
  └── server.ts           # Server Supabase client

components/auth/
  ├── AuthProvider.tsx    # Global auth context
  ├── LoginForm.tsx       # Login form component
  └── SignupForm.tsx      # Signup form component

components/admin/
  ├── AdminGuard.tsx      # Admin route protection
  └── UserTable.tsx       # User management table

app/
  ├── layout.tsx          # Updated with AuthProvider
  ├── page.tsx            # New landing page
  ├── login/page.tsx      # Login page
  ├── signup/page.tsx     # Signup page
  ├── admin/page.tsx      # Admin dashboard
  └── auth/callback/route.ts  # Auth callback handler

middleware.ts             # Route protection middleware
.env.local               # Environment variables
```

## 🗄️ Database Setup Required

### 1. Create Supabase Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON public.user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON public.user_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Optional: Admin settings table
CREATE TABLE public.admin_settings (
  user_id UUID REFERENCES public.user_profiles(id) PRIMARY KEY,
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can access admin settings"
  ON public.admin_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### 2. Configure Environment Variables

Update your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Configure Supabase Auth Settings

In your Supabase dashboard:

1. **Authentication > Settings**:
   - Set Site URL: `http://localhost:3000` (development)
   - Add production URL when deploying
   - Add redirect URLs: 
     - `http://localhost:3000/auth/callback`
     - `https://yourdomain.com/auth/callback` (production)

2. **Authentication > Email Templates**:
   - Customize confirmation and recovery email templates if needed

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### 2. Create Your Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key from Settings > API

### 3. Set Up Database
1. Run the SQL commands above in your Supabase SQL editor
2. Test the tables are created correctly

### 4. Configure Environment
1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials

### 5. Create First Admin User
After your first user signs up, run this SQL to make them an admin:
```sql
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

## 🛡️ Security Features

### Route Protection
- **Public routes**: Landing page, login, signup
- **Protected routes**: Dashboard (requires authentication)
- **Admin routes**: Admin panel (requires admin role)

### Row Level Security (RLS)
- Users can only read/update their own profiles
- Admins can read/update all user profiles
- Admin settings are restricted to admin users only

### Middleware Protection
- Automatic redirects for unauthenticated users
- Role-based access control for admin routes
- Session validation on every request

## 🎯 Usage Examples

### Check Authentication Status
```tsx
import { useAuth } from '@/components/auth/AuthProvider'

function MyComponent() {
  const { user, profile, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>
  
  return <div>Welcome, {profile?.full_name}!</div>
}
```

### Protect Admin Routes
```tsx
import { AdminGuard } from '@/components/admin/AdminGuard'

export default function AdminPage() {
  return (
    <AdminGuard>
      <div>Admin content here</div>
    </AdminGuard>
  )
}
```

### Sign Out
```tsx
import { useAuth } from '@/components/auth/AuthProvider'

function LogoutButton() {
  const { signOut } = useAuth()
  
  return (
    <button onClick={signOut}>
      Sign Out
    </button>
  )
}
```

## 🚦 Testing Checklist

- [ ] User can sign up with email/password
- [ ] Email confirmation works
- [ ] User can log in after confirmation
- [ ] User can access dashboard after login
- [ ] User sessions persist across browser refreshes
- [ ] Unauthenticated users are redirected to login
- [ ] Admin users can access admin panel
- [ ] Regular users cannot access admin routes
- [ ] Admin can promote/demote user roles
- [ ] User profiles are created automatically on signup
- [ ] RLS policies work correctly

## 🔄 Development Workflow

### Running the Application
```bash
npm run dev
```

### Testing Auth Flow
1. Go to `http://localhost:3000`
2. Click "Get Started" to sign up
3. Check your email for confirmation
4. Click confirmation link
5. Log in and verify dashboard access

### Creating Admin Users
1. Sign up as normal user
2. Run SQL command to promote to admin
3. Log out and log back in
4. Verify admin panel access at `/admin`

## 🚀 Production Deployment

### Before Deploying
1. Update environment variables for production
2. Add production URLs to Supabase auth settings
3. Test email delivery in production environment
4. Set up proper domain for auth callbacks

### Vercel Deployment
```bash
# Set environment variables in Vercel dashboard
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

## 📚 Additional Features to Consider

### Email Templates
- Customize welcome emails
- Password reset emails
- Role change notifications

### Social Authentication
- Google OAuth
- GitHub OAuth
- Discord OAuth

### Profile Management
- Avatar uploads
- Profile editing forms
- Password change functionality

### Admin Features
- User activity logs
- Bulk user operations
- System analytics dashboard

### Security Enhancements
- Two-factor authentication
- Session management
- Rate limiting
- Audit logs

## 🐛 Troubleshooting

### Common Issues

**1. "Invalid JWT" errors**
- Check environment variables are correct
- Verify Supabase project URL and keys
- Clear browser cookies and try again

**2. RLS Policy errors**
- Verify user_profiles table exists
- Check RLS policies are created correctly
- Ensure user has proper role assigned

**3. Redirect loops**
- Check middleware configuration
- Verify auth callback URL is correct
- Clear browser cache

**4. Email not sending**
- Check Supabase email settings
- Verify SMTP configuration
- Check spam folder

### Debug Tips
- Check browser developer tools console
- Review Supabase auth logs
- Test API endpoints directly
- Verify database table structure

## 📞 Support

For issues with this implementation:
1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check Next.js app router documentation
4. Verify all environment variables are set correctly

---

**Note**: Remember to replace placeholder values in environment variables and SQL commands with your actual Supabase project details.