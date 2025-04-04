import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import 'cross-fetch/polyfill' // Fix for fetch failed errors in Node.js environment

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey) 