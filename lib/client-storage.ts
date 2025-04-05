// Types for chat messages and chat data
export interface IMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  originalContent?: string;
}

export interface IChat {
  id: string;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Initialize local storage
export function initStorage() {
  // Check if localStorage is available
  if (typeof window === 'undefined') return;

  // Initialize chats if they don't exist
  if (!localStorage.getItem('chats')) {
    localStorage.setItem('chats', JSON.stringify([]));
  }

  // Initialize schemes if they don't exist
  if (!localStorage.getItem('schemes')) {
    localStorage.setItem('schemes', JSON.stringify([]));
  }
}

// Get all chats
export function getChats(): IChat[] {
  if (typeof window === 'undefined') return [];
  
  const chatsString = localStorage.getItem('chats');
  if (!chatsString) return [];
  
  try {
    return JSON.parse(chatsString);
  } catch (error) {
    console.error('Error parsing chats from localStorage:', error);
    return [];
  }
}

// Get a specific chat by ID
export function getChatById(chatId: string): IChat | null {
  const chats = getChats();
  return chats.find(chat => chat.id === chatId) || null;
}

// Create a new chat
export function createChat(title: string = 'New Chat'): IChat {
  const chats = getChats();
  
  const newChat: IChat = {
    id: Date.now().toString(),
    title,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  localStorage.setItem('chats', JSON.stringify([...chats, newChat]));
  return newChat;
}

// Update chat
export function updateChat(updatedChat: IChat): void {
  const chats = getChats();
  const chatIndex = chats.findIndex(chat => chat.id === updatedChat.id);
  
  if (chatIndex === -1) return;
  
  updatedChat.updatedAt = new Date();
  chats[chatIndex] = updatedChat;
  
  localStorage.setItem('chats', JSON.stringify(chats));
}

// Delete chat
export function deleteChat(chatId: string): void {
  const chats = getChats();
  const filteredChats = chats.filter(chat => chat.id !== chatId);
  localStorage.setItem('chats', JSON.stringify(filteredChats));
}

// Add message to chat
export function addMessageToChat(chatId: string, message: IMessage): IChat | null {
  const chats = getChats();
  const chatIndex = chats.findIndex(chat => chat.id === chatId);
  
  if (chatIndex === -1) return null;
  
  const updatedChat = { 
    ...chats[chatIndex],
    messages: [...chats[chatIndex].messages, message],
    updatedAt: new Date()
  };
  
  chats[chatIndex] = updatedChat;
  localStorage.setItem('chats', JSON.stringify(chats));
  
  return updatedChat;
}

// Get messages for a chat
export function getMessagesForChat(chatId: string): IMessage[] {
  const chat = getChatById(chatId);
  return chat ? chat.messages : [];
} 