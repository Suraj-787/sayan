import mongoose, { Document, Schema } from 'mongoose';

// Interface types for TypeScript
export interface IScheme extends Document {
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

export interface IFAQ extends Document {
  scheme_id: Schema.Types.ObjectId | string;
  question: string;
  answer: string;
  created_at: Date;
}

export interface IChat extends Document {
  user_id?: string;
  created_at: Date;
}

export interface IMessage extends Document {
  chat_id: Schema.Types.ObjectId | string;
  role: 'user' | 'assistant';
  content: string;
  created_at: Date;
}

export interface IBookmark extends Document {
  user_id: string;
  scheme_id: Schema.Types.ObjectId | string;
  created_at: Date;
}

// User interface for authentication and preferences
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  preferences: {
    categories: string[];
    eligibility: string[];
    income_level?: string;
    min_age?: number;
    max_age?: number;
    location?: string;
    occupation?: string;
  };
  created_at: Date;
}

// Scheme Schema
const SchemeSchema = new Schema<IScheme>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  eligibility: { type: String, required: true },
  benefits: { type: String, required: true },
  application_process: { type: String, required: true },
  documents: { type: [String], required: true },
  deadline: { type: String, required: true },
  website: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// FAQ Schema
const FAQSchema = new Schema<IFAQ>({
  scheme_id: { type: Schema.Types.ObjectId, ref: 'Scheme', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// Chat Schema
const ChatSchema = new Schema<IChat>({
  user_id: { type: String },
  created_at: { type: Date, default: Date.now }
});

// Message Schema
const MessageSchema = new Schema<IMessage>({
  chat_id: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

// Bookmark Schema
const BookmarkSchema = new Schema<IBookmark>({
  user_id: { type: String, required: true },
  scheme_id: { type: Schema.Types.ObjectId, ref: 'Scheme', required: true },
  created_at: { type: Date, default: Date.now }
});

// User Schema
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  preferences: {
    categories: { type: [String], default: [] },
    eligibility: { type: [String], default: [] },
    income_level: { type: String },
    min_age: { type: Number },
    max_age: { type: Number },
    location: { type: String },
    occupation: { type: String },
  },
  created_at: { type: Date, default: Date.now }
});

// Create models safely
// Check if mongoose.models exists to prevent "Cannot read properties of undefined" error
const models = mongoose.models || {};

export const SchemeModel = (models.Scheme as mongoose.Model<IScheme>) || 
  mongoose.model<IScheme>('Scheme', SchemeSchema);
  
export const FAQModel = (models.FAQ as mongoose.Model<IFAQ>) || 
  mongoose.model<IFAQ>('FAQ', FAQSchema);
  
export const ChatModel = (models.Chat as mongoose.Model<IChat>) || 
  mongoose.model<IChat>('Chat', ChatSchema);
  
export const MessageModel = (models.Message as mongoose.Model<IMessage>) || 
  mongoose.model<IMessage>('Message', MessageSchema);
  
export const BookmarkModel = (models.Bookmark as mongoose.Model<IBookmark>) || 
  mongoose.model<IBookmark>('Bookmark', BookmarkSchema); 

export const UserModel = (models.User as mongoose.Model<IUser>) || 
  mongoose.model<IUser>('User', UserSchema); 