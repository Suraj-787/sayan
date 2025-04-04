import { supabase } from './supabase';
import { schemes, faqs } from './seed-data';
import 'cross-fetch/polyfill';

// Seed database with initial data
export async function seedDatabase() {
  try {
    // Insert schemes
    for (const scheme of schemes) {
      try {
        const { error } = await supabase
          .from('schemes')
          .upsert(scheme, { onConflict: 'id' });
        
        if (error) {
          console.error('Error inserting scheme:', error);
        } else {
          console.log(`Inserted scheme: ${scheme.title}`);
        }
      } catch (err) {
        console.error(`Failed to insert scheme ${scheme.title}:`, err);
      }
    }

    // Insert FAQs
    for (const faq of faqs) {
      try {
        const { error } = await supabase
          .from('faqs')
          .upsert(faq, { onConflict: 'id' });
        
        if (error) {
          console.error('Error inserting FAQ:', error);
        } else {
          console.log(`Inserted FAQ: ${faq.question.substring(0, 30)}...`);
        }
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
export async function getAllSchemes() {
  try {
    const { data, error } = await supabase
      .from('schemes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching schemes:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching schemes:', error);
    return [];
  }
}

// Get scheme by ID
export async function getSchemeById(id: string) {
  try {
    const { data, error } = await supabase
      .from('schemes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching scheme with ID ${id}:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching scheme with ID ${id}:`, error);
    return null;
  }
}

// Get FAQs for a scheme
export async function getFAQsForScheme(schemeId: string) {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('scheme_id', schemeId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error(`Error fetching FAQs for scheme with ID ${schemeId}:`, error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching FAQs for scheme with ID ${schemeId}:`, error);
    return [];
  }
}

// Create a new chat session
export async function createChat(userId?: string) {
  try {
    const { data, error } = await supabase
      .from('chats')
      .insert([{ user_id: userId || null }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating chat:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating chat:', error);
    return null;
  }
}

// Get chat by ID
export async function getChatById(chatId: string) {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', chatId)
      .single();
    
    if (error) {
      console.error(`Error fetching chat with ID ${chatId}:`, error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching chat with ID ${chatId}:`, error);
    return null;
  }
}

// Add a message to a chat
export async function addMessageToChat(chatId: string, role: 'user' | 'assistant', content: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        chat_id: chatId,
        role,
        content
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding message to chat:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error adding message to chat:', error);
    return null;
  }
}

// Get messages for a chat
export async function getMessagesForChat(chatId: string) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error(`Error fetching messages for chat with ID ${chatId}:`, error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching messages for chat with ID ${chatId}:`, error);
    return [];
  }
}

// Create a bookmark
export async function createBookmark(userId: string, schemeId: string) {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{
        user_id: userId,
        scheme_id: schemeId
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating bookmark:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return null;
  }
}

// Delete a bookmark
export async function deleteBookmark(userId: string, schemeId: string) {
  try {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .match({ user_id: userId, scheme_id: schemeId });
    
    if (error) {
      console.error('Error deleting bookmark:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return false;
  }
}

// Check if a scheme is bookmarked by a user
export async function isSchemeBookmarked(userId: string, schemeId: string) {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .match({ user_id: userId, scheme_id: schemeId });
    
    if (error) {
      console.error('Error checking bookmark:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
}

// Get all bookmarks for a user
export async function getUserBookmarks(userId: string) {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('scheme_id, schemes(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching bookmarks for user with ID ${userId}:`, error);
      return [];
    }
    
    return data.map(item => item.schemes);
  } catch (error) {
    console.error(`Error fetching bookmarks for user with ID ${userId}:`, error);
    return [];
  }
}

// Search schemes by keyword
export async function searchSchemes(query: string) {
  try {
    const { data, error } = await supabase
      .from('schemes')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,eligibility.ilike.%${query}%,benefits.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error searching schemes:', error);
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error searching schemes:', error);
    return [];
  }
} 