# ARTE EAST CMS Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://vsbrhhhtqqbpgsbyszpz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzYnJoaGh0cXFicGdzYnlzenB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NjEyNTEsImV4cCI6MjA2NTIzNzI1MX0.ODjBE0lF3MwyQM6uEAqmYHgL5gpBVjLL9kvZWSu-sbU

# Google OAuth (for future authentication setup)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Next Auth (for future authentication setup)
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret
```

## Supabase Database Setup

Run the following SQL in your Supabase SQL editor to create the films table:

```sql
-- Create films table
CREATE TABLE films (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_films_updated_at BEFORE UPDATE ON films
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE films ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - we'll add auth later)
CREATE POLICY "Allow all operations for now" ON films
    FOR ALL USING (true);
```

## Development

1. Install dependencies: `npm install`
2. Set up environment variables in `.env.local`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Next Steps

This setup provides:
- ✅ Next.js with TypeScript
- ✅ Tailwind CSS styling
- ✅ Supabase client configuration
- ✅ Basic project structure
- ✅ Type definitions

Coming next:
- Google Authentication
- Film CRUD operations
- Admin interface
- Inline editing capabilities 