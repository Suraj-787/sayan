"use client"

import { usePathname } from "next/navigation"
import { Chatbot } from "@/components/chatbot/chatbot"

export function ChatbotWrapper() {
  const pathname = usePathname()
  
  // Don't render the Chatbot on the /chatbot page to avoid duplicates
  if (pathname.includes('/chatbot')) {
    return null
  }
  
  return <Chatbot />
} 