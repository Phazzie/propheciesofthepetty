VITE_SUPABASE_URL=https://dyhoeduhhilzixlaahmc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5aG9lZHVoaGlseml4bGFhaG1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxMjQxODgsImV4cCI6MjA1NDcwMDE4OH0.Nbg-_F_Q3fWxAcUEtwfbdq6OjGxvHOWo24F-CUdt7TA

import { supabase } from './supabase'

export async function testConnection() {
  try {
    const { data, error } = await supabase.from('cards').select('count')
    if (error) throw error
    console.log('Supabase connection successful:', data)
    return true
  } catch (error) {
    console.error('Supabase connection error:', error)
    return false
  }
}