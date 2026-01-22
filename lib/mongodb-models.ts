// MongoDB models corresponding to our data schema

// Scheme model
export interface Scheme {
  _id?: string;
  title: string;
  description: string;
  category: string;
  eligibility: string;
  benefits: string;
  application_process: string;
  documents: string[];
  deadline: string;
  website: string;
  created_at: Date;

  // New filtering fields for enhanced scheme discovery
  gender?: string[];  // ["Male", "Female", "Transgender", "All"]
  min_age?: number;  // Minimum age requirement
  max_age?: number;  // Maximum age requirement
  state?: string[];  // Indian states or ["All India"]
  residence_area?: string[];  // ["Rural", "Urban", "Both"]
  social_category?: string[];  // ["SC", "ST", "OBC", "General", "PVTG", "DNT", "All"]
  differently_abled?: string;  // "Yes", "No", "Both"
  disability_percentage?: string[];  // ["<40%", "40-59%", "60-79%", "80%+", "Any"]
  minority?: string;  // "Yes", "No", "Both"
  student?: string;  // "Yes", "No", "Both"
  bpl?: string;  // "Yes", "No", "Both" (Below Poverty Line)

  // Additional metadata
  ministry?: string;  // Ministry/Department managing the scheme
  scheme_type?: string;  // "Central", "State", "Central Sector", "Centrally Sponsored"
  tags?: string[];  // Additional searchable tags
}

// FAQ model
export interface FAQ {
  _id?: string;
  scheme_id: string;
  question: string;
  answer: string;
  created_at: Date;
}

// Chat model
export interface Chat {
  _id?: string;
  user_id?: string;
  created_at: Date;
}

// Message model
export interface Message {
  _id?: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: Date;
}

// Bookmark model
export interface Bookmark {
  _id?: string;
  user_id: string;
  scheme_id: string;
  created_at: Date;
}

// Database collection names
export const Collections = {
  SCHEMES: 'schemes',
  FAQS: 'faqs',
  CHATS: 'chats',
  MESSAGES: 'messages',
  BOOKMARKS: 'bookmarks'
}; 