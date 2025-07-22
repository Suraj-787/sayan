"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useChatbot } from "@/components/chatbot/chatbot-provider"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function ChatbotFloatingButton() {
  const { openChatbot, isOpen } = useChatbot()
  const pathname = usePathname()
  const [visible, setVisible] = useState(true)
  
  // Hide the floating button on the chatbot page or when chatbot is open
  useEffect(() => {
    const isChatbotPage = pathname.includes('/chatbot')
    setVisible(!isChatbotPage && !isOpen)
  }, [pathname, isOpen])
  
  if (!visible) return null
  
  return (
    <div className="fixed bottom-6 right-6 z-40 animate-fadeIn">
      <Button
        size="lg"
        onClick={openChatbot}
        className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 flex items-center justify-center"
        aria-label="Open AI Assistant"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  )
} 