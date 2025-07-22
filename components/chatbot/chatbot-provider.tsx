"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback, useRef } from "react"
import { generateChatResponse } from "@/lib/gemini"
import { useLanguage } from "@/components/language-provider"
import { speechToText, detectLanguageFromSpeech } from "@/lib/sarvam"

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
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

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

  // Enhanced toggle function with console logs
  const toggleChatbot = useCallback(() => {
    console.log("[ChatbotProvider] Toggling chatbot from", isOpen, "to", !isOpen);
    setIsOpen((prev) => !prev);
  }, [isOpen]);
  
  // Enhanced open function with console logs
  const openChatbot = useCallback(() => {
    console.log("[ChatbotProvider] Opening chatbot");
    setIsOpen(true);
  }, []);
  
  // Enhanced close function with console logs
  const closeChatbot = useCallback(() => {
    console.log("[ChatbotProvider] Closing chatbot");
    setIsOpen(false);
    
    // Stop recording if active when closing
    if (isRecording && mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);
  
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

  const toggleRecording = useCallback(async () => {
    if (isRecording) {
      // Stop recording
      console.log("[ChatbotProvider] Stopping recording");
      setIsRecording(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    try {
      // Start recording
      console.log("[ChatbotProvider] Starting recording");
      setIsRecording(true);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Create new MediaRecorder instance with suitable options for Sarvam
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Add event listeners
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });
      
      mediaRecorder.addEventListener('stop', async () => {
        try {
          console.log("[ChatbotProvider] Processing recorded audio");
          setIsLoading(true);
          
          // Create audio blob from chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          audioChunksRef.current = []; // Clear chunks after using them
          
          if (audioBlob.size <= 100) {
            throw new Error("Audio recording too short or empty");
          }
          
          // Try to detect language
          let detectedLanguage;
          try {
            detectedLanguage = await detectLanguageFromSpeech(audioBlob);
            console.log("[ChatbotProvider] Detected language:", detectedLanguage);
          } catch (error) {
            console.error('Error detecting language:', error);
            // Default to current UI language if detection fails
            detectedLanguage = language === 'en' ? 'en-IN' : 
                              language === 'hi' ? 'hi-IN' : 
                              language === 'ta' ? 'ta-IN' : 
                              language === 'bn' ? 'bn-IN' : 'hi-IN';
            console.log("[ChatbotProvider] Falling back to language:", detectedLanguage);
          }
          
          // Convert speech to text using detected or fallback language
          const transcript = await speechToText(audioBlob, detectedLanguage);
          console.log("[ChatbotProvider] Transcript:", transcript);
          
          if (transcript && transcript.trim()) {
            // Ensure chatbot is open when sending voice message
            if (!isOpen) {
              setIsOpen(true);
            }
            await sendMessage(transcript);
          } else {
            console.log("[ChatbotProvider] Empty transcript, not sending message");
            setMessages(prev => [
              ...prev, 
              {
                id: `error-${Date.now()}`,
                content: "I couldn't detect any speech. Please try again or type your message.",
                role: "assistant",
                timestamp: new Date()
              }
            ]);
          }
          
          // Stop tracks to release microphone
          stream.getTracks().forEach(track => track.stop());
        } catch (error) {
          console.error('Error processing speech:', error);
          setMessages(prev => [
            ...prev, 
            {
              id: `error-${Date.now()}`,
              content: "Sorry, I couldn't understand that. Please try again or type your message.",
              role: "assistant",
              timestamp: new Date()
            }
          ]);
        } finally {
          setIsLoading(false);
          setIsRecording(false);
        }
      });
      
      // Start recording with smaller time slices for better responsiveness
      mediaRecorder.start(250);
      
      // Automatically stop after 10 seconds if not stopped manually
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          console.log("[ChatbotProvider] Auto-stopping recording after 10 seconds");
          mediaRecorderRef.current.stop();
        }
      }, 10000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      setMessages(prev => [
        ...prev, 
        {
          id: `error-${Date.now()}`,
          content: "I couldn't access your microphone. Please check your browser permissions and try again.",
          role: "assistant",
          timestamp: new Date()
        }
      ]);
    }
  }, [isRecording, sendMessage, isOpen, setMessages]);

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

