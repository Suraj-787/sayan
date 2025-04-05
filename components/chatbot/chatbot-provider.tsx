"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { createChat, addMessageToChat, getMessagesForChat } from "@/lib/mongoose-utils"
import { generateChatResponse } from "@/lib/gemini"
import { useLanguage } from "@/components/language-provider"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  originalContent?: string // Store original content for translation purposes
}

type ChatbotContextType = {
  isOpen: boolean
  toggleChatbot: () => void
  openChatbot: () => void
  closeChatbot: () => void
  messages: Message[]
  isLoading: boolean
  sendMessage: (content: string) => Promise<void>
  chatId: string | null
  isRecording: boolean
  toggleRecording: () => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const { language, translate } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "👋 Hello! I'm your AI assistant specialized in Indian government schemes. I can help you:\n\n• Find schemes you're eligible for\n• Explain application processes\n• Provide information on benefits and deadlines\n• Guide you through documentation requirements\n\nHow may I assist you today?",
      role: "assistant",
      timestamp: new Date(),
      originalContent: "👋 Hello! I'm your AI assistant specialized in Indian government schemes. I can help you:\n\n• Find schemes you're eligible for\n• Explain application processes\n• Provide information on benefits and deadlines\n• Guide you through documentation requirements\n\nHow may I assist you today?",
    },
  ])
  const [chatId, setChatId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  // Translate welcome message when language changes
  useEffect(() => {
    const translateWelcomeMessage = async () => {
      if (language === "en" || !messages.length) return;
      
      // Only translate the welcome message
      try {
        const translatedWelcome = await translate(messages[0].originalContent || messages[0].content);
        
        setMessages(prev => [
          {
            ...prev[0],
            content: translatedWelcome
          },
          ...prev.slice(1)
        ]);
      } catch (error) {
        console.error("Error translating welcome message:", error);
      }
    };
    
    translateWelcomeMessage();
  }, [language, translate]);

  const toggleChatbot = () => setIsOpen(!isOpen)
  const openChatbot = () => setIsOpen(true)
  const closeChatbot = () => setIsOpen(false)
  
  const toggleRecording = () => {
    setIsRecording(!isRecording)

    if (!isRecording) {
      // In a real app, this would use a speech-to-text service
      // For now, we'll just simulate it
      setTimeout(() => {
        setIsRecording(false)
        // This is just a mock implementation
        sendMessage("How do I check my eligibility for government schemes?")
      }, 2000)
    }
  }

  // Translate messages when language changes
  useEffect(() => {
    // Skip if not open or no messages
    if (!isOpen || messages.length === 0) return;
    
    // Only translate existing message content, not new API responses
    const timeoutId = setTimeout(async () => {
      try {
        if (language === "en") {
          // If language is English, revert to original content
          setMessages(prevMessages => 
            prevMessages.map(msg => ({
              ...msg,
              content: msg.originalContent || msg.content
            }))
          );
          return;
        }
  
        // Batch all translations into one state update
        const translatedMessages = await Promise.all(
          messages.map(async (msg) => {
            // Store original content if not already stored
            const originalContent = msg.originalContent || msg.content;
            
            // Skip translation if content is empty or very short
            if (!originalContent || originalContent.length < 2) {
              return { ...msg, originalContent };
            }
            
            // Translate the content
            const translatedContent = await translate(originalContent);
            
            return {
              ...msg,
              content: translatedContent,
              originalContent
            };
          })
        );
        
        // Single state update with all translations
        setMessages(translatedMessages);
      } catch (error) {
        console.error("Error translating messages:", error);
      }
    }, 300); // 300ms debounce
    
    // Cleanup timeout
    return () => clearTimeout(timeoutId);
  }, [language, isOpen, messages, translate]);

  // Initialize chat on first open
  useEffect(() => {
    const initializeChat = async () => {
      // Only run if isOpen is true and we don't have a chatId yet
      if (isOpen && !chatId) {
        setIsLoading(true); // Indicate loading during initialization
        try {
          // 1. Attempt to create or retrieve a chat session ID
          const chat = await createChat(); // Assuming createChat handles finding existing/creating new
          if (!chat || !chat._id) {
             console.error("Failed to create or retrieve chat session.");
             setIsLoading(false);
             return;
          }
          const currentChatId = chat._id.toString();
          setChatId(currentChatId);

          // 2. Load existing messages for this chat
          const existingMessages = await getMessagesForChat(currentChatId);

          // 3. Determine the initial messages for the UI state
          let initialMessagesState: Message[];
          
          // Get appropriate welcome message based on language
          let welcomeMessageContent = "👋 Hello! I'm your AI assistant specialized in Indian government schemes. I can help you:\n\n• Find schemes you're eligible for\n• Explain application processes\n• Provide information on benefits and deadlines\n• Guide you through documentation requirements\n\nHow may I assist you today?";
          
          // If language is not English, translate welcome message
          if (language !== "en") {
            try {
              welcomeMessageContent = await translate(welcomeMessageContent);
            } catch (error) {
              console.error("Error translating welcome message:", error);
            }
          }
          
          if (existingMessages && existingMessages.length > 0) {
             // If history exists, map it to the Message type for UI
             initialMessagesState = [
                // Prepend the static welcome message for UI consistency
                { 
                  id: "welcome", 
                  content: welcomeMessageContent, 
                  role: "assistant", 
                  timestamp: new Date(),
                  originalContent: "👋 Hello! I'm your AI assistant specialized in Indian government schemes. I can help you:\n\n• Find schemes you're eligible for\n• Explain application processes\n• Provide information on benefits and deadlines\n• Guide you through documentation requirements\n\nHow may I assist you today?"
                }, 
                ...existingMessages.map(msg => ({
                  id: msg._id?.toString() || `msg-${Date.now()}-${Math.random()}`,
                  content: msg.content,
                  originalContent: msg.content,
                  role: msg.role as ('user' | 'assistant'), // Assert type from DB
                  timestamp: new Date(msg.created_at)
                }))
             ];
          } else {
             // If no history exists, start with only the welcome message
             initialMessagesState = [
                { 
                  id: "welcome", 
                  content: welcomeMessageContent, 
                  originalContent: "👋 Hello! I'm your AI assistant specialized in Indian government schemes. I can help you:\n\n• Find schemes you're eligible for\n• Explain application processes\n• Provide information on benefits and deadlines\n• Guide you through documentation requirements\n\nHow may I assist you today?",
                  role: "assistant", 
                  timestamp: new Date() 
                }
             ];
             // Add the welcome message to the DB only if it's a truly new chat
             await addMessageToChat(currentChatId, "assistant", welcomeMessageContent);
          }

          // 4. Set the UI state
          setMessages(initialMessagesState);

        } catch (error) {
          console.error("Error initializing chat:", error);
          // Optionally set an error state for the UI
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeChat();
  // Remove 'messages' from dependencies to avoid re-running on message state changes
  }, [isOpen, chatId, language, translate]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !chatId) return

    try {
      setIsLoading(true)

      // Prepare the new user message object with a unique ID
      const userMessageId = `user-${Date.now()}`
      const userMessage: Message = {
        id: userMessageId,
        content,
        originalContent: content, // Store original content for translation
        role: "user",
        timestamp: new Date(),
      }
      
      console.log("Adding user message with ID:", userMessageId);
      
      // Update UI immediately with user message - important to use a function to get latest state
      setMessages(prevMessages => {
        console.log("Previous messages count:", prevMessages.length);
        return [...prevMessages, userMessage];
      });
      
      // Add user message to database
      const savedUserMessage = await addMessageToChat(chatId, "user", content)
      if (!savedUserMessage) {
        console.error("Failed to save user message to database");
      }

      // Prepare messages for AI context - use only content, not IDs or timestamps
      const conversationHistory = messages
        .filter(msg => msg.id !== "welcome") // Exclude welcome message
        .map(msg => ({
          role: msg.role,
          content: msg.originalContent || msg.content,
        }))
        .concat({ role: "user", content }); // Add current message
      
      // Generate AI response
      const aiResponse = await generateChatResponse(conversationHistory, content)
      
      // Create bot message object for UI
      const botMessageId = `bot-${Date.now()}`
      const botMessage: Message = {
        id: botMessageId,
        content: aiResponse,
        originalContent: aiResponse, // Store original for translation
        role: "assistant",
        timestamp: new Date(),
      }
      
      // Add bot message to UI
      setMessages(prevMessages => [...prevMessages, botMessage])
      
      // Add bot message to database
      const savedBotMessage = await addMessageToChat(chatId, "assistant", aiResponse)
      if (!savedBotMessage) {
        console.error("Failed to save bot message to database");
      }
    } catch (error) {
      console.error("Error sending message:", error)
      
      // Show error message
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: `error-${Date.now()}`,
          content: "Sorry, there was an error processing your request. Please try again.",
          role: "assistant",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [chatId, messages])

  const contextValue: ChatbotContextType = {
    isOpen,
    toggleChatbot,
    openChatbot,
    closeChatbot,
    messages,
    isLoading,
    sendMessage,
    chatId,
    isRecording,
    toggleRecording,
  }

  return (
    <ChatbotContext.Provider value={contextValue}>
      {children}
    </ChatbotContext.Provider>
  )
}

export function useChatbot() {
  const context = useContext(ChatbotContext)
  
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider")
  }
  
  return context
}

