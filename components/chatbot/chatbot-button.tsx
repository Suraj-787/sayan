"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useChatbot } from "@/components/chatbot/chatbot-provider"

type ChatbotButtonProps = {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showLabel?: boolean
  label?: string
}

export function ChatbotButton({
  variant = "outline",
  size = "icon",
  className = "",
  showLabel = false,
  label = "AI Assistant"
}: ChatbotButtonProps) {
  const { openChatbot } = useChatbot()

  return (
    <Button
      variant={variant}
      size={size === "icon" && !showLabel ? "icon" : size}
      onClick={openChatbot}
      className={`${className} ${size === "icon" && !showLabel ? "rounded-full" : ""}`}
      aria-label="Open AI Assistant"
    >
      <MessageSquare className={`h-5 w-5 ${showLabel ? "mr-2" : ""}`} />
      {showLabel && <span>{label}</span>}
    </Button>
  )
} 