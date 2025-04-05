/**
 * This script initializes the MongoDB database with the required collections.
 * Run this script once before using the application with MongoDB.
 * 
 * To run: npx tsx scripts/mongoose-init.ts
 */

import dbConnect from '../lib/mongoose';
import { 
  SchemeModel, 
  FAQModel, 
  ChatModel, 
  MessageModel, 
  BookmarkModel 
} from '../lib/mongoose-models';
import { seedDatabase } from '../lib/mongoose-utils';

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await dbConnect();
    
    console.log('Creating indexes...');
    
    // Create indexes for FAQs collection
    await FAQModel.collection.createIndex({ scheme_id: 1 });
    
    // Create indexes for Messages collection
    await MessageModel.collection.createIndex({ chat_id: 1 });
    
    // Create indexes for Bookmarks collection
    await BookmarkModel.collection.createIndex({ user_id: 1 });
    await BookmarkModel.collection.createIndex({ scheme_id: 1 });
    await BookmarkModel.collection.createIndex({ user_id: 1, scheme_id: 1 }, { unique: true });
    
    console.log('Indexes created successfully');
    
    // Seed the database with initial data
    console.log('Seeding database with initial data...');
    const result = await seedDatabase();
    
    if (result) {
      console.log('✅ Database initialized and seeded successfully!');
    } else {
      console.error('❌ Failed to seed database');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

initializeDatabase(); 