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