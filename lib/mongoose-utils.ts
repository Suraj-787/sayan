import mongoose from 'mongoose';
import dbConnect from './mongoose';
import { schemes, faqs } from './seed-data';
import { 
  SchemeModel, 
  FAQModel, 
  ChatModel, 
  MessageModel, 
  BookmarkModel,
  IScheme,
  IFAQ,
  IChat,
  IMessage,
  IBookmark
} from './mongoose-models';
import 'cross-fetch/polyfill';

// Helper to convert string ID to ObjectId or check if it's a valid ObjectId
function isValidObjectId(id: string): boolean {
  try {
    return mongoose.Types.ObjectId.isValid(id);
  } catch (error) {
    return false;
  }
}

// Helper to convert string ID to ObjectId
function toObjectId(id: string): mongoose.Types.ObjectId {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (error) {
    console.error(`Invalid ObjectId: ${id}`);
    throw new Error(`Invalid ObjectId: ${id}`);
  }
}

interface SchemeFilters {
  categories?: string[];
  eligibility?: string[];
  scheme_types?: string[];
  income_level?: string;
  min_age?: number;
  max_age?: number;
  location?: string;
}

// Get schemes with filtering
export async function getFilteredSchemes(filters: SchemeFilters = {}): Promise<IScheme[]> {
  try {
    await dbConnect();
    
    const query: any = {};
    const andConditions: any[] = [];
    
    // Add category filter
    if (filters.categories && filters.categories.length > 0) {
      andConditions.push({
        category: { 
          $regex: new RegExp(filters.categories.join('|'), 'i') 
        }
      });
    }
    
    // Add scheme types filter
    if (filters.scheme_types && filters.scheme_types.length > 0) {
      const schemeTypeRegex = new RegExp(filters.scheme_types.join('|'), 'i');
      andConditions.push({
        $or: [
          { title: { $regex: schemeTypeRegex } },
          { description: { $regex: schemeTypeRegex } },
          { eligibility: { $regex: schemeTypeRegex } }
        ]
      });
    }
    
    // Add eligibility filter
    if (filters.eligibility && filters.eligibility.length > 0) {
      andConditions.push({
        eligibility: { 
          $regex: new RegExp(filters.eligibility.join('|'), 'i') 
        }
      });
    }

    // Add income level filter
    if (filters.income_level && filters.income_level !== 'any') {
      andConditions.push({
        eligibility: { 
          $regex: new RegExp(filters.income_level, 'i') 
        }
      });
    }

    // Add age range filter
    if (filters.min_age !== undefined || filters.max_age !== undefined) {
      const ageConditions = [];
      
      // Handle min age
      if (filters.min_age !== undefined) {
        ageConditions.push(
          { eligibility: { $regex: new RegExp(`\\babove ${filters.min_age}\\b`, 'i') } },
          { eligibility: { $regex: new RegExp(`\\bover ${filters.min_age}\\b`, 'i') } },
          { eligibility: { $regex: new RegExp(`\\bfrom ${filters.min_age}\\b`, 'i') } },
          { eligibility: { $regex: new RegExp(`\\baged ${filters.min_age}\\b`, 'i') } }
        );
        
        // Handle age ranges in eligibility text (e.g., "18-35 years")
        for (let i = Math.max(0, filters.min_age - 5); i <= filters.min_age; i += 5) {
          const upperBound = i + 5;
          ageConditions.push({ eligibility: { $regex: new RegExp(`\\b${i}-${upperBound}\\b`, 'i') } });
          
          // Also look for common ranges
          for (let j = upperBound + 5; j <= upperBound + 20; j += 5) {
            ageConditions.push({ eligibility: { $regex: new RegExp(`\\b${i}-${j}\\b`, 'i') } });
          }
        }
      }
      
      // Handle max age
      if (filters.max_age !== undefined) {
        ageConditions.push(
          { eligibility: { $regex: new RegExp(`\\bbelow ${filters.max_age}\\b`, 'i') } },
          { eligibility: { $regex: new RegExp(`\\bunder ${filters.max_age}\\b`, 'i') } },
          { eligibility: { $regex: new RegExp(`\\bup to ${filters.max_age}\\b`, 'i') } }
        );
        
        // Handle age ranges in eligibility text
        for (let i = Math.max(0, filters.max_age - 20); i <= filters.max_age; i += 5) {
          const upperBound = Math.min(i + 5, filters.max_age);
          ageConditions.push({ eligibility: { $regex: new RegExp(`\\b${i}-${upperBound}\\b`, 'i') } });
        }
      }
      
      // If both min and max age are provided, also match specific ages in the range
      if (filters.min_age !== undefined && filters.max_age !== undefined) {
        for (let age = filters.min_age; age <= filters.max_age; age++) {
          ageConditions.push({ eligibility: { $regex: new RegExp(`\\b${age}\\b`, 'i') } });
        }
      }
      
      if (ageConditions.length > 0) {
        andConditions.push({ $or: ageConditions });
      }
    }
    
    // Add location filter
    if (filters.location && filters.location !== 'any') {
      const locationRegex = new RegExp(filters.location, 'i');
      andConditions.push({
        $or: [
          { title: { $regex: locationRegex } },
          { description: { $regex: locationRegex } },
          { eligibility: { $regex: locationRegex } }
        ]
      });
    }
    
    // Build final query
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }
    
    // Get schemes matching the filters
    const schemes = await SchemeModel.find(query)
      .sort({ created_at: -1 })
      .lean();
    
    return schemes;
  } catch (error) {
    console.error('Error fetching filtered schemes:', error);
    return [];
  }
}// Seed database with initial data
export async function seedDatabase() {
  try {
    await dbConnect();
    
    // Insert schemes
    for (const scheme of schemes) {
      try {
        const schemeData = {
          ...scheme,
          _id: scheme.id, // Use the provided ObjectId string
          created_at: new Date(scheme.created_at)
        };
        
        // Omit id as _id is used in MongoDB
        delete (schemeData as any).id;
        
        // Use Mongoose create for insertion
        await SchemeModel.findOneAndUpdate(
          { _id: scheme.id },
          schemeData,
          { upsert: true, new: true }
        );
        
        console.log(`Inserted scheme: ${scheme.title}`);
      } catch (err) {
        console.error(`Failed to insert scheme ${scheme.title}:`, err);
      }
    }

    // Insert FAQs
    for (const faq of faqs) {
      try {
        const faqData = {
          ...faq,
          _id: faq.id, // Use the provided ObjectId string
          created_at: new Date(faq.created_at)
        };
        
        // Omit id as _id is used in MongoDB
        delete (faqData as any).id;
        
        // Use Mongoose create for insertion
        await FAQModel.findOneAndUpdate(
          { _id: faq.id },
          faqData,
          { upsert: true, new: true }
        );
        
        console.log(`Inserted FAQ: ${faq.question.substring(0, 30)}...`);
      } catch (err) {
        console.error(`Failed to insert FAQ ${faq.question.substring(0, 30)}...`, err);
      }
    }

    console.log('Database seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
}

// Get all schemes
export async function getAllSchemes(): Promise<IScheme[]> {
  try {
    await dbConnect();
    const schemes = await SchemeModel.find()
      .sort({ created_at: -1 })
      .lean();
    
    return schemes;
  } catch (error) {
    console.error('Error fetching schemes:', error);
    return [];
  }
}

// Get scheme by ID
export async function getSchemeById(id: string): Promise<IScheme | null> {
  try {
    await dbConnect();
    
    // If ID is a valid ObjectId, use findById
    if (isValidObjectId(id)) {
      return await SchemeModel.findById(id).lean();
    }
    
    // If not a valid ObjectId, try to find by numeric ID (for legacy support)
    // Search in title or other fields if needed
    const numericId = parseInt(id);
    if (!isNaN(numericId)) {
      // This assumes you might have schemes with titles containing their old numeric IDs
      // Adjust this query based on your data structure
      const schemes = await SchemeModel.find({
        $or: [
          { title: { $regex: new RegExp(`^PM Kisan ${numericId}`) } },
          { title: { $regex: new RegExp(`^Pradhan Mantri ${numericId}`) } }
        ]
      }).limit(1).lean();
      
      return schemes.length > 0 ? schemes[0] : null;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching scheme with ID ${id}:`, error);
    return null;
  }
}

// Get FAQs for a specific scheme
export async function getFAQsForScheme(schemeId: string): Promise<IFAQ[]> {
  try {
    await dbConnect();
    
    // If schemeId is a valid ObjectId, use it directly
    if (isValidObjectId(schemeId)) {
      const faqs = await FAQModel.find({ scheme_id: schemeId })
        .sort({ created_at: 1 })
        .lean();
      return faqs;
    }
    
    // For non-ObjectId scheme IDs, we need to handle it specially
    // First find the scheme, then use its _id to query FAQs
    const scheme = await getSchemeById(schemeId);
    if (!scheme) {
      return [];
    }
    
    const faqs = await FAQModel.find({ scheme_id: scheme._id })
      .sort({ created_at: 1 })
      .lean();
    
    return faqs;
  } catch (error) {
    console.error(`Error fetching FAQs for scheme with ID ${schemeId}:`, error);
    return [];
  }
}

// Create a new chat session
export async function createChat(userId?: string): Promise<IChat | null> {
  try {
    await dbConnect();
    const chat = new ChatModel({
      user_id: userId || null,
      created_at: new Date()
    });
    
    await chat.save();
    return chat;
  } catch (error) {
    console.error('Error creating chat:', error);
    return null;
  }
}

// Get chat by ID
export async function getChatById(chatId: string): Promise<IChat | null> {
  try {
    await dbConnect();
    const chat = await ChatModel.findById(chatId).lean();
    return chat;
  } catch (error) {
    console.error(`Error fetching chat with ID ${chatId}:`, error);
    return null;
  }
}

// Add a message to a chat
export async function addMessageToChat(
  chatId: string, 
  role: 'user' | 'assistant', 
  content: string
): Promise<IMessage | null> {
  try {
    await dbConnect();
    const message = new MessageModel({
      chat_id: chatId,
      role,
      content,
      created_at: new Date()
    });
    
    await message.save();
    return message;
  } catch (error) {
    console.error('Error adding message to chat:', error);
    return null;
  }
}

// Get messages for a chat
export async function getMessagesForChat(chatId: string): Promise<IMessage[]> {
  try {
    await dbConnect();
    const messages = await MessageModel.find({ chat_id: chatId })
      .sort({ created_at: 1 })
      .lean();
    
    return messages;
  } catch (error) {
    console.error(`Error fetching messages for chat with ID ${chatId}:`, error);
    return [];
  }
}

// Create a bookmark
export async function createBookmark(
  userId: string, 
  schemeId: string
): Promise<IBookmark | null> {
  try {
    await dbConnect();
    const bookmark = new BookmarkModel({
      user_id: userId,
      scheme_id: schemeId,
      created_at: new Date()
    });
    
    await bookmark.save();
    return bookmark;
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return null;
  }
}

// Delete a bookmark
export async function deleteBookmark(userId: string, schemeId: string): Promise<boolean> {
  try {
    await dbConnect();
    const result = await BookmarkModel.deleteOne({ 
      user_id: userId, 
      scheme_id: schemeId 
    });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return false;
  }
}

// Check if a scheme is bookmarked by a user
export async function isSchemeBookmarked(userId: string, schemeId: string): Promise<boolean> {
  try {
    await dbConnect();
    const bookmark = await BookmarkModel.findOne({ 
      user_id: userId, 
      scheme_id: schemeId 
    }).lean();
    
    return !!bookmark;
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
}

// Get all bookmarks for a user
export async function getUserBookmarks(userId: string): Promise<IScheme[]> {
  try {
    await dbConnect();
    
    // Find all bookmarks
    const bookmarks = await BookmarkModel.find({ user_id: userId })
      .sort({ created_at: -1 })
      .lean();
    
    // Get scheme details for each bookmark
    const schemeIds = bookmarks.map(bookmark => bookmark.scheme_id);
    const schemes = await SchemeModel.find({
      _id: { $in: schemeIds }
    }).lean();
    
    return schemes;
  } catch (error) {
    console.error(`Error fetching bookmarks for user with ID ${userId}:`, error);
    return [];
  }
}

// Get all FAQs
export async function getAllFAQs(): Promise<IFAQ[]> {
  try {
    await dbConnect();
    const faqs = await FAQModel.find()
      .sort({ created_at: -1 })
      .lean();
    
    return faqs;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
} 