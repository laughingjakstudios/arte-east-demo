import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Types for our database
export type Database = {
  Tables: {
    films: {
      Row: {
        id: string
        title: string
        description: string
        status: 'draft' | 'published'
        created_at: string
        updated_at: string
      }
      Insert: {
        id?: string
        title: string
        description: string
        status?: 'draft' | 'published'
        created_at?: string
        updated_at?: string
      }
      Update: {
        id?: string
        title?: string
        description?: string
        status?: 'draft' | 'published'
        updated_at?: string
      }
    }
  }
} 