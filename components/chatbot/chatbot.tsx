"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Mic, MicOff, Maximize2, Minimize2, Globe } from "lucide-react"
import { useChatbot } from "@/components/chatbot/chatbot-provider"
import { useLanguage } from "@/components/language-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Chatbot() {
  const { 
    isOpen, 
    closeChatbot, 
    messages, 
    isLoading, 
    sendMessage, 
    isRecording, 
    toggleRecording 
  } = useChatbot()
  
  const { language, setLanguage, translate } = useLanguage()
  const [input, setInput] = useState("")
  const [isMaximized, setIsMaximized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Debug log when messages change
  useEffect(() => {
    console.log("Messages updated in Chatbot component:", messages.map(m => ({id: m.id, role: m.role})));
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!messagesEndRef.current) return;
    
    // Use requestAnimationFrame for smoother performance
    const scrollToBottom = () => {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    };
    
    scrollToBottom();
  }, [messages]);
  
  // Memoize language items to prevent re-renders
  const languageItems = useMemo(() => [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "ta", name: "தமிழ் (Tamil)" },
    { code: "bn", name: "বাংলা (Bengali)" }
  ], []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    console.log("Submitting message:", input);
    const userInput = input;
    
    // Clear input field immediately for better UX
    setInput("");
    
    try {
      // Call the sendMessage function from the context
      await sendMessage(userInput);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  if (!isOpen) return null;

  // Get the most recent messages if there are too many
  const displayMessages = messages.length > 50 
    ? messages.slice(messages.length - 50) 
    : messages;

  // Log rendering of each message for debugging
  const renderMessage = (message: any) => {
    const isUser = message.role === "user";
    console.log(`Rendering message: ${message.id}, role: ${message.role}, content: ${message.content.substring(0, 20)}...`);
    
    return (
      <div key={message.id} className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-2`}>
        <div
          className={`flex items-start space-x-2 max-w-[85%] ${
            isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
          }`}
        >
          <Avatar className="h-8 w-8 shrink-0">
            {!isUser ? (
              <>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
              </>
            ) : (
              <>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
              </>
            )}
          </Avatar>
          <div
            className={`rounded-lg px-4 py-2 ${
              isUser
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-accent text-accent-foreground"
            } shadow-sm`}
          >
            <p className="text-sm whitespace-pre-line break-words">{message.content}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isMaximized 
        ? "inset-0 p-4 bg-background/90 backdrop-blur-sm flex items-center justify-center" 
        : "bottom-4 right-4 w-full max-w-md"
    }`}>
      <Card className={`shadow-xl border border-primary/20 animate-fadeIn ${
        isMaximized ? "w-full max-w-4xl h-[80vh]" : "w-full"
      }`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-primary/5">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <CardTitle className="text-lg">AI Assistant</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center mr-1">
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center border-primary/20 hover:bg-primary/10"
                onClick={() => {
                  document.getElementById('language-dropdown-trigger')?.click();
                }}
              >
                <Globe className="h-4 w-4 mr-1" />
                {language === 'en' ? 'English' : 
                 language === 'hi' ? 'हिन्दी' :
                 language === 'ta' ? 'தமிழ்' :
                 language === 'bn' ? 'বাংলা' : 'Language'}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    id="language-dropdown-trigger"
                    variant="ghost" 
                    size="icon" 
                    className="h-0 w-0 p-0 m-0 overflow-hidden"
                  >
                    <span className="sr-only">Language</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languageItems.map((item) => (
                    <DropdownMenuItem 
                      key={item.code}
                      onClick={() => setLanguage(item.code)}
                      className={language === item.code ? "bg-primary/10 text-primary font-medium" : ""}
                    >
                      {item.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMaximize}
              aria-label={isMaximized ? "Minimize chatbot" : "Maximize chatbot"}
              className="hover:bg-primary/10 text-foreground"
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeChatbot}
              aria-label="Close chatbot"
              className="hover:bg-primary/10 text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4" ref={scrollAreaRef}>
          <ScrollArea className={`${isMaximized ? "h-[calc(80vh-8rem)]" : "h-[350px]"} pr-4 overflow-y-auto`}>
            <div className="flex flex-col space-y-2">
              {displayMessages.map((message) => renderMessage(message))}
              {isLoading && (
                <div className="flex justify-start mb-2">
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                      <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-4 py-2 bg-accent text-accent-foreground max-w-[75%]">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={toggleRecording}
              className={`rounded-full border-primary ${isRecording ? "bg-primary/10 text-primary" : "text-primary hover:bg-primary/10"}`}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border-primary/20 focus-visible:ring-primary"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="rounded-full bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          <div className="w-full flex justify-center mt-1">
            <div className="flex flex-wrap gap-1 text-xs text-muted-foreground justify-center">
              <span className="flex items-center">
                <Globe className="h-3 w-3 mr-1 text-primary/70" />
                Language:
              </span>
              {languageItems.map((item) => (
                <button 
                  key={item.code}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    language === item.code 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-primary/5 hover:text-primary"
                  }`}
                  onClick={() => setLanguage(item.code)}
                  type="button"
                >
                  {item.code === 'en' ? 'English' : 
                   item.code === 'hi' ? 'हिन्दी' :
                   item.code === 'ta' ? 'தமிழ்' :
                   item.code === 'bn' ? 'বাংলা' : item.name}
                </button>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

