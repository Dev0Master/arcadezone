# Supabase Setup Guide for ArcadeZone

## 📋 Prerequisites
- A Supabase account (free at https://supabase.com)
- Your project repository ready

## 🚀 Quick Setup Steps

### 1. Create a Supabase Project
1. Go to https://supabase.com
2. Click "Sign Up" and create an account
3. Click "New Project"
4. Choose your organization
5. Enter project name: `arcadezone`
6. Set a strong database password
7. Select a region closest to your users
8. Click "Create new project"

### 2. Get Your Credentials
1. Wait for the project to be created (2-3 minutes)
2. Go to Settings → API
3. Copy these values:
   - **Project URL** (looks like `https://your-project-id.supabase.co`)
   - **anon/public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Set Up Database
1. Go to the SQL Editor (left sidebar)
2. Click "New query"
3. Copy the entire contents of `database-schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute
6. Wait for all tables to be created

### 4. Configure Environment Variables
Create/update `.env.local` in your project root:

```bash
# Replace with your actual credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Update Admin Policy (Important!)
The database schema includes an admin check based on email. Update this:

1. In SQL Editor, run:
```sql
-- Replace with your actual admin email
DROP POLICY IF EXISTS "Admins can view all reviews" ON reviews;

CREATE POLICY "Admins can view all reviews" ON reviews
  FOR SELECT USING (
    auth.uid() = (
      SELECT id FROM auth.users
      WHERE email = 'your-email@example.com'
    )
  );
```

Or for simplicity during development, you can skip RLS policies entirely:
```sql
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE ratings DISABLE ROW LEVEL SECURITY;
```

### 6. Create Admin User (Optional)
If you don't have an admin user, run in SQL Editor:
```sql
-- This creates admin/admin123 (password is hashed)
INSERT INTO admin_users (username, password) VALUES
('admin', '$2a$10$K2Y.EzVqsQCNC/FCkmI6j.VtQ8DqEqQjQqAqfV9J8QnWqNxQp7jxq');
```

### 7. Test Your Setup
1. Run your development server:
```bash
npm run dev
```

2. Visit http://localhost:3000
3. Try accessing http://localhost:3000/login
4. Login with: `admin` / `admin123`

## 🔧 Common Issues & Solutions

### Build Error: "Invalid supabaseUrl"
- Make sure your `.env.local` has the correct URL (starts with `https://`)
- Check for extra spaces or quotes
- Ensure the file is in the project root

### CORS Errors
- In Supabase, go to Settings → API
- Under "Additional Configuration", add:
  - `http://localhost:3000` (for development)
  - `https://your-domain.com` (for production)

### Permission Denied Errors
- Ensure RLS policies are set correctly
- Or disable RLS for development:
```sql
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
```

### Reviews Not Showing
- Check if reviews are approved in the database
- Visit `/admin/reviews` to approve pending reviews

## 📊 Verify Your Database
Run this query in SQL Editor to check everything is set up:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check categories
SELECT * FROM categories ORDER BY name;

-- Check sample data
SELECT COUNT(*) as game_count FROM games;
SELECT COUNT(*) as review_count FROM reviews;
SELECT COUNT(*) as category_count FROM categories;
```

## 🎯 Next Steps

1. **Add Games**: Visit `/admin/games/new` to add games
2. **Create Reviews**: Test the review system on game detail pages
3. **Approve Reviews**: Visit `/admin/reviews` to moderate
4. **Customize**: Add your own categories and game data

## 🛠️ Production Considerations

For production deployment:

1. **Use Supabase Auth** instead of email-based admin checks
2. **Enable RLS policies** properly
3. **Set up environment variables** in your hosting provider
4. **Configure CORS** for your production domain
5. **Set up row level security** for user data if needed

## 📞 Support

If you run into issues:
1. Check the Supabase documentation: https://supabase.com/docs
2. Verify your SQL was executed successfully
3. Check your environment variables are correct
4. Ensure your database connection is working

Happy coding! 🎮