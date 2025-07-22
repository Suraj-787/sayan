"use client"

import { useEffect } from "react"
import { Chatbot } from "@/components/chatbot/chatbot"
import { useChatbot } from "@/components/chatbot/chatbot-provider"

export default function ChatbotPage() {
  const { openChatbot } = useChatbot()
  
  // Open the chatbot automatically when this page loads
  useEffect(() => {
    openChatbot()
  }, [openChatbot])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-8">
      <div className="w-full max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          AI Assistant
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Get help with government schemes and programs through our AI-powered assistant.
        </p>
        <div className="text-sm text-muted-foreground">
          <p>If the chatbot doesn't appear, please check your browser settings or try refreshing the page.</p>
        </div>
      </div>
      
      {/* The chatbot component - this is the only place it should render on this page */}
      <Chatbot />
    </div>
  )
} 