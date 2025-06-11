import { supabase } from './supabase'
import type { Film } from '@/types'

// Test database connection
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('films')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Connection test failed:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true, count: data }
  } catch (error) {
    console.error('Connection test failed:', error)
    return { success: false, error: 'Failed to connect to database' }
  }
}

// Get all films
export async function getFilms(): Promise<{ data: Film[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('films')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching films:', error)
      return { data: null, error: error.message }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error fetching films:', error)
    return { data: null, error: 'Failed to fetch films' }
  }
}

// Get a single film by ID
export async function getFilm(id: string): Promise<{ data: Film | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('films')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching film:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching film:', error)
    return { data: null, error: 'Failed to fetch film' }
  }
}

// Create a new film
export async function createFilm(film: Omit<Film, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Film | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('films')
      .insert([film])
      .select()
      .single()

    if (error) {
      console.error('Error creating film:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error creating film:', error)
    return { data: null, error: 'Failed to create film' }
  }
}

// Update a film
export async function updateFilm(id: string, updates: Partial<Omit<Film, 'id' | 'created_at' | 'updated_at'>>): Promise<{ data: Film | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('films')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating film:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error updating film:', error)
    return { data: null, error: 'Failed to update film' }
  }
}

// Delete a film
export async function deleteFilm(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('films')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting film:', error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting film:', error)
    return { success: false, error: 'Failed to delete film' }
  }
}

// Content types for homepage editing
export interface Content {
  id: string
  key: string
  content: string
  created_at: string
  updated_at: string
}

// Content CRUD operations
export async function getContent(key: string): Promise<Content | null> {
  try {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('key', key)
      .single()

    if (error) {
      // If table doesn't exist or other error, return null silently
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.warn('Content table not found. Please run the content_table.sql script.')
        return null
      }
      console.error('Error fetching content:', error)
      return null
    }

    return data
  } catch (err) {
    console.warn('Content table not available:', err)
    return null
  }
}

export async function getAllContent(): Promise<Content[]> {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .order('key')

  if (error) {
    console.error('Error fetching all content:', error)
    return []
  }

  return data || []
}

export async function updateContent(key: string, content: string): Promise<Content | null> {
  try {
    // First try to update existing content
    const { data: updateData, error: updateError } = await supabase
      .from('content')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('key', key)
      .select()
      .single()

    if (updateData) {
      return updateData
    }

    // If no rows were updated (content doesn't exist), insert new content
    if (updateError?.code === 'PGRST116') {
      const { data: insertData, error: insertError } = await supabase
        .from('content')
        .insert({
          key,
          content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting content:', insertError)
        return null
      }

      return insertData
    }

    if (updateError) {
      if (updateError.code === '42P01' || updateError.message.includes('does not exist')) {
        console.warn('Content table not found. Please run the content_table.sql script.')
        return null
      }
      console.error('Error updating content:', updateError)
      return null
    }

    return null
  } catch (err) {
    console.warn('Content table not available:', err)
    return null
  }
} 