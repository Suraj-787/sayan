export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      schemes: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          eligibility: string
          benefits: string
          application_process: string
          documents: string[]
          deadline: string
          website: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          eligibility: string
          benefits: string
          application_process: string
          documents: string[]
          deadline: string
          website: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          eligibility?: string
          benefits?: string
          application_process?: string
          documents?: string[]
          deadline?: string
          website?: string
          created_at?: string
        }
      }
      faqs: {
        Row: {
          id: string
          scheme_id: string
          question: string
          answer: string
          created_at: string
        }
        Insert: {
          id?: string
          scheme_id: string
          question: string
          answer: string
          created_at?: string
        }
        Update: {
          id?: string
          scheme_id?: string
          question?: string
          answer?: string
          created_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          scheme_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scheme_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          scheme_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 