"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { generateChatResponse } from "@/lib/gemini"
import { useLanguage } from "@/components/language-provider"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  originalContent?: string // Store original content for translation purposes
}

type ScrapedScheme = {
  title: string
  source: string
  url: string
  description?: string
  eligibility?: string
  benefits?: string
  application_process?: string
}

type ChatbotContextType = {
  isOpen: boolean
  toggleChatbot: () => void
  openChatbot: () => void
  closeChatbot: () => void
  messages: Message[]
  isLoading: boolean
  sendMessage: (content: string) => Promise<void>
  isRecording: boolean
  toggleRecording: () => void
  isSearching: boolean
  searchSchemes: (query: string, options?: any) => Promise<void>
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
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

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

  // Function to search for schemes online
  const searchSchemes = async (query: string, options?: any) => {
    try {
      setIsSearching(true)
      
      // Add a loading message
      const loadingMessageId = `loading-${Date.now()}`
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: loadingMessageId,
          content: "Searching online for more information about government schemes...",
          role: "assistant",
          timestamp: new Date(),
        }
      ])
      
      // Make API call to web-search endpoint
      const response = await fetch('/api/web-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, options }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to search for schemes')
      }
      
      const data = await response.json()
      const { schemes } = data
      
      // Remove the loading message
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== loadingMessageId)
      )
      
      if (!schemes || schemes.length === 0) {
        // No schemes found
        const noResultsMessage: Message = {
          id: `no-results-${Date.now()}`,
          content: "I couldn't find any specific government schemes matching your criteria. Please try a different search or provide more details about what you're looking for.",
          role: "assistant",
          timestamp: new Date(),
        }
        
        setMessages(prevMessages => [...prevMessages, noResultsMessage])
      } else {
        // Format the schemes found into a message
        const schemesContent = schemes.map((scheme: ScrapedScheme) => {
          return `• ${scheme.title}\n   Source: ${scheme.source}\n   ${scheme.description ? `Description: ${scheme.description}\n   ` : ''}${scheme.eligibility ? `Eligibility: ${scheme.eligibility}\n   ` : ''}${scheme.url ? `More info: ${scheme.url}` : ''}`
        }).join('\n\n')
        
        const resultsMessage: Message = {
          id: `results-${Date.now()}`,
          content: `I found the following schemes that might be relevant:\n\n${schemesContent}\n\nWould you like more details about any of these schemes?`,
          role: "assistant",
          timestamp: new Date(),
          originalContent: `I found the following schemes that might be relevant:\n\n${schemesContent}\n\nWould you like more details about any of these schemes?`,
        }
        
        setMessages(prevMessages => [...prevMessages, resultsMessage])
      }
    } catch (error) {
      console.error('Error searching for schemes:', error)
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "Sorry, I encountered an error while searching for schemes. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      }
      
      setMessages(prevMessages => [
        ...prevMessages.filter(msg => !msg.id.startsWith('loading-')), // Remove any loading messages
        errorMessage
      ])
    } finally {
      setIsSearching(false)
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

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

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
      
      // Update UI immediately with user message
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
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
      
      // Check if response suggests web search
      if (aiResponse.includes("Would you like me to search for more information online about")) {
        // Extract what to search for
        const searchMatch = aiResponse.match(/search for more information online about \[(.*?)\]/)
        
        if (searchMatch && searchMatch[1]) {
          const searchQuery = searchMatch[1]
          
          // Create bot message object for UI
          const botMessageId = `bot-${Date.now()}`
          const botMessage: Message = {
            id: botMessageId,
            content: aiResponse,
            originalContent: aiResponse, // Store original for translation
            role: "assistant",
            timestamp: new Date(),
          }
          
          // First add the bot message suggesting the search
          setMessages(prevMessages => [...prevMessages, botMessage])
          
          // Wait a bit before starting the search to let the user read the message
          setTimeout(() => {
            searchSchemes(searchQuery)
          }, 1000)
          
          setIsLoading(false)
          return
        }
      }
      
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
  }, [messages])

  const contextValue: ChatbotContextType = {
    isOpen,
    toggleChatbot,
    openChatbot,
    closeChatbot,
    messages,
    isLoading,
    sendMessage,
    isRecording,
    toggleRecording,
    isSearching,
    searchSchemes,
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

