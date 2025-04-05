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

// Seed database with initial data
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