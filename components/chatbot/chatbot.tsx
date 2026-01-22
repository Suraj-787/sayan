"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X, Send, Maximize2, Minimize2, Bot, User } from "lucide-react"
import { useChatbot } from "@/components/chatbot/chatbot-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

  const [input, setInput] = useState("")
  const [isMaximized, setIsMaximized] = useState(false)
  const [userHasScrolled, setUserHasScrolled] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const lastMessageCountRef = useRef(0)

  // Debug information
  useEffect(() => {
    console.log("[Chatbot] Component mounted", { pathname: window.location.pathname });
    console.log("[Chatbot] Initial isOpen state:", isOpen);

    return () => {
      console.log("[Chatbot] Component unmounted", { pathname: window.location.pathname });
    };
  }, []);

  // Debug when isOpen changes
  useEffect(() => {
    console.log("[Chatbot] isOpen changed to:", isOpen, { pathname: window.location.pathname });
    // Reset scroll state when chatbot opens
    if (isOpen) {
      setUserHasScrolled(false);
      lastMessageCountRef.current = messages.length;
    }
  }, [isOpen, messages.length]);

  // Simple scroll detection - only track if user manually scrolled up
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (!target) return;

    const { scrollTop, scrollHeight, clientHeight } = target;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 5;

    // If user is not at bottom, they have scrolled up
    if (!isAtBottom) {
      setUserHasScrolled(true);
      console.log("User scrolled up - auto-scroll disabled");
    } else if (isAtBottom && userHasScrolled) {
      setUserHasScrolled(false);
      console.log("User scrolled back to bottom - auto-scroll enabled");
    }
  }, [userHasScrolled]);

  // Simple scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (!scrollAreaRef.current || !isOpen) return;

    scrollAreaRef.current.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [isOpen]);

  // Only auto-scroll when chatbot opens or new messages arrive (and user hasn't scrolled)
  useEffect(() => {
    if (!isOpen) return;

    // Auto-scroll when chatbot first opens
    if (messages.length > 0 && lastMessageCountRef.current === 0) {
      console.log("Chatbot opened - scrolling to bottom");
      setTimeout(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: "auto"
          });
        }
      }, 100);
    }

    // Auto-scroll for new messages only if user hasn't manually scrolled up
    else if (messages.length > lastMessageCountRef.current && !userHasScrolled) {
      console.log("New message arrived - scrolling to bottom");
      setTimeout(scrollToBottom, 100);
    }

    lastMessageCountRef.current = messages.length;
  }, [isOpen, messages.length, userHasScrolled, scrollToBottom]);



  // Handle auto-scroll when user submits a message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userInput = input;

    // Clear input field immediately for better UX
    setInput("");

    // Reset scroll state when user sends a message - they want to see the response
    setUserHasScrolled(false);

    // Force scroll to bottom after sending
    setTimeout(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
          top: scrollAreaRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    }, 50);

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

  const renderMessage = (message: any) => {
    const isUser = message.role === "user";

    return (
      <div key={message.id} className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-2`}>
        <div
          className={`flex items-start space-x-2 max-w-[85%] ${isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
            }`}
        >
          <Avatar className="h-8 w-8 shrink-0">
            {!isUser ? (
              <>
                <AvatarImage src="/ai-avatar.svg" alt="AI Assistant" />
                <AvatarFallback className="bg-primary/20 text-primary">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </>
            ) : (
              <>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </>
            )}
          </Avatar>
          <div
            className={`rounded-lg px-4 py-2 ${isUser
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
    <div className={`fixed z-50 transition-all duration-300 ${isMaximized
      ? "inset-0 p-4 bg-background/90 backdrop-blur-sm flex items-center justify-center"
      : "bottom-4 right-4 w-full max-w-md"
      }`}>
      <Card className={`shadow-xl border border-primary/20 animate-fadeIn ${isMaximized ? "w-full max-w-4xl h-[80vh]" : "w-full max-h-[85vh]"
        }`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-primary/5">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <CardTitle className="text-lg">AI Assistant</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMaximized(!isMaximized)}
              className="h-8 w-8 rounded-full hover:bg-primary/10"
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeChatbot}
              className="h-8 w-8 rounded-full hover:bg-primary/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 overflow-hidden">
          <div
            ref={scrollAreaRef}
            className={`${isMaximized ? "h-[calc(80vh-10rem)]" : "h-[340px]"} overflow-y-auto overflow-x-hidden scrollbar-thin`}
            onScroll={handleScroll}
          >
            <div className="flex flex-col space-y-2 px-1 pb-2" id="messages-container">
              {displayMessages.map((message) => renderMessage(message))}
              {isLoading && (
                <div className="flex justify-start mb-2">
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src="/ai-avatar.svg" alt="AI Assistant" />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
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
              {/* This empty div serves as our scroll target */}
              <div ref={messagesEndRef} aria-hidden="true" className="h-1" />
            </div>
          </div>

          {/* Scroll to bottom button - shows when user scrolled up */}
          {userHasScrolled && (
            <div className="absolute bottom-24 right-4 z-10">
              <Button
                size="sm"
                onClick={() => {
                  setUserHasScrolled(false);
                  if (scrollAreaRef.current) {
                    scrollAreaRef.current.scrollTo({
                      top: scrollAreaRef.current.scrollHeight,
                      behavior: "smooth"
                    });
                  }
                }}
                className="rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                ↓ New messages
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border-primary/20 focus-visible:ring-primary"
              disabled={isLoading}
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
        </CardFooter>
      </Card>
    </div>
  )
}

