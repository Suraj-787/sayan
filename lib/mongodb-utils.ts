import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';
import { schemes, faqs } from './seed-data';
import { Scheme, FAQ, Chat, Message, Bookmark, Collections } from './mongodb-models';
import 'cross-fetch/polyfill';

// Database connection helper
async function getCollection(collection: string) {
  const client = await clientPromise;
  const db = client.db();
  return db.collection(collection);
}

// Convert string ID to ObjectId
function toObjectId(id: string): ObjectId {
  try {
    return new ObjectId(id);
  } catch (error) {
    console.error(`Invalid ObjectId: ${id}`);
    throw new Error(`Invalid ObjectId: ${id}`);
  }
}

// Seed database with initial data
export async function seedDatabase() {
  try {
    // Insert schemes
    const schemesCollection = await getCollection(Collections.SCHEMES);
    
    for (const scheme of schemes) {
      try {
        const schemeWithDate = {
          ...scheme,
          created_at: new Date(scheme.created_at)
        };
        
        // Use MongoDB upsert
        await schemesCollection.updateOne(
          { _id: scheme.id },
          { $set: schemeWithDate },
          { upsert: true }
        );
        
        console.log(`Inserted scheme: ${scheme.title}`);
      } catch (err) {
        console.error(`Failed to insert scheme ${scheme.title}:`, err);
      }
    }

    // Insert FAQs
    const faqsCollection = await getCollection(Collections.FAQS);
    
    for (const faq of faqs) {
      try {
        const faqWithDate = {
          ...faq,
          created_at: new Date()
        };
        
        // Use MongoDB upsert
        await faqsCollection.updateOne(
          { _id: faq.id },
          { $set: faqWithDate },
          { upsert: true }
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
export async function getAllSchemes(): Promise<Scheme[]> {
  try {
    const collection = await getCollection(Collections.SCHEMES);
    const schemes = await collection
      .find({})
      .sort({ created_at: -1 })
      .toArray();
    
    return schemes as Scheme[];
  } catch (error) {
    console.error('Error fetching schemes:', error);
    return [];
  }
}

// Get scheme by ID
export async function getSchemeById(id: string): Promise<Scheme | null> {
  try {
    const collection = await getCollection(Collections.SCHEMES);
    const scheme = await collection.findOne({ _id: id });
    
    return scheme as Scheme | null;
  } catch (error) {
    console.error(`Error fetching scheme with ID ${id}:`, error);
    return null;
  }
}

// Create a new chat session
export async function createChat(userId?: string): Promise<Chat | null> {
  try {
    const collection = await getCollection(Collections.CHATS);
    const chat = {
      user_id: userId || null,
      created_at: new Date()
    };
    
    const result = await collection.insertOne(chat);
    
    if (result.acknowledged) {
      return {
        _id: result.insertedId.toString(),
        ...chat
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error creating chat:', error);
    return null;
  }
}

// Get chat by ID
export async function getChatById(chatId: string): Promise<Chat | null> {
  try {
    const collection = await getCollection(Collections.CHATS);
    const chat = await collection.findOne({ _id: toObjectId(chatId) });
    
    return chat as Chat | null;
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
): Promise<Message | null> {
  try {
    const collection = await getCollection(Collections.MESSAGES);
    const message = {
      chat_id: chatId,
      role,
      content,
      created_at: new Date()
    };
    
    const result = await collection.insertOne(message);
    
    if (result.acknowledged) {
      return {
        _id: result.insertedId.toString(),
        ...message
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error adding message to chat:', error);
    return null;
  }
}

// Get messages for a chat
export async function getMessagesForChat(chatId: string): Promise<Message[]> {
  try {
    const collection = await getCollection(Collections.MESSAGES);
    const messages = await collection
      .find({ chat_id: chatId })
      .sort({ created_at: 1 })
      .toArray();
    
    return messages as Message[];
  } catch (error) {
    console.error(`Error fetching messages for chat with ID ${chatId}:`, error);
    return [];
  }
}

// Create a bookmark
export async function createBookmark(
  userId: string, 
  schemeId: string
): Promise<Bookmark | null> {
  try {
    const collection = await getCollection(Collections.BOOKMARKS);
    const bookmark = {
      user_id: userId,
      scheme_id: schemeId,
      created_at: new Date()
    };
    
    const result = await collection.insertOne(bookmark);
    
    if (result.acknowledged) {
      return {
        _id: result.insertedId.toString(),
        ...bookmark
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return null;
  }
}

// Delete a bookmark
export async function deleteBookmark(userId: string, schemeId: string): Promise<boolean> {
  try {
    const collection = await getCollection(Collections.BOOKMARKS);
    const result = await collection.deleteOne({ 
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
    const collection = await getCollection(Collections.BOOKMARKS);
    const bookmark = await collection.findOne({ 
      user_id: userId, 
      scheme_id: schemeId 
    });
    
    return !!bookmark;
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
}

// Get all bookmarks for a user
export async function getUserBookmarks(userId: string): Promise<Scheme[]> {
  try {
    const bookmarksCollection = await getCollection(Collections.BOOKMARKS);
    const schemesCollection = await getCollection(Collections.SCHEMES);
    
    const bookmarks = await bookmarksCollection
      .find({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray();
    
    // Get the scheme details for each bookmark
    const schemes = [];
    for (const bookmark of bookmarks) {
      const scheme = await schemesCollection.findOne({ _id: bookmark.scheme_id });
      if (scheme) {
        schemes.push(scheme);
      }
    }
    
    return schemes as Scheme[];
  } catch (error) {
    console.error(`Error fetching bookmarks for user with ID ${userId}:`, error);
    return [];
  }
} 