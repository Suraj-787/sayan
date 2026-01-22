"use client"

import React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User } from "lucide-react"
import { useChatbot } from "@/components/chatbot/chatbot-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ChatbotFullPage() {
    const {
        messages,
        isLoading,
        sendMessage,
        isRecording,
        toggleRecording
    } = useChatbot()

    const [input, setInput] = useState("")
    const [userHasScrolled, setUserHasScrolled] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const lastMessageCountRef = useRef(0)

    // Simple scroll detection
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (!target) return;

        const { scrollTop, scrollHeight, clientHeight } = target;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 5;

        if (!isAtBottom) {
            setUserHasScrolled(true);
        } else if (isAtBottom && userHasScrolled) {
            setUserHasScrolled(false);
        }
    }, [userHasScrolled]);

    // Scroll to bottom function
    const scrollToBottom = useCallback(() => {
        if (!scrollAreaRef.current) return;

        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: "smooth"
        });
    }, []);

    // Auto-scroll for new messages
    useEffect(() => {
        if (messages.length > lastMessageCountRef.current && !userHasScrolled) {
            setTimeout(scrollToBottom, 100);
        }

        lastMessageCountRef.current = messages.length;
    }, [messages.length, userHasScrolled, scrollToBottom]);

    // Handle message submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userInput = input;
        setInput("");
        setUserHasScrolled(false);

        setTimeout(() => {
            if (scrollAreaRef.current) {
                scrollAreaRef.current.scrollTo({
                    top: scrollAreaRef.current.scrollHeight,
                    behavior: "smooth"
                });
            }
        }, 50);

        try {
            await sendMessage(userInput);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const displayMessages = messages.length > 50
        ? messages.slice(messages.length - 50)
        : messages;

    const renderMessage = (message: any) => {
        const isUser = message.role === "user";

        return (
            <div key={message.id} className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}>
                <div
                    className={`flex items-start space-x-3 max-w-[85%] ${isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
                        }`}
                >
                    <Avatar className="h-10 w-10 shrink-0">
                        {!isUser ? (
                            <>
                                <AvatarImage src="/ai-avatar.svg" alt="AI Assistant" />
                                <AvatarFallback className="bg-primary/20 text-primary">
                                    <Bot className="h-5 w-5" />
                                </AvatarFallback>
                            </>
                        ) : (
                            <>
                                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                                <AvatarFallback className="bg-secondary text-secondary-foreground">
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </>
                        )}
                    </Avatar>
                    <div
                        className={`rounded-lg px-4 py-3 ${isUser
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
        <div className="w-full h-full flex flex-col bg-background">
            {/* Header */}
            <div className="flex-shrink-0 border-b bg-card">
                <div className="container max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                            <h1 className="text-2xl font-bold">AI Assistant</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-hidden">
                <div className="container max-w-5xl mx-auto h-full px-4">
                    <div
                        ref={scrollAreaRef}
                        className="h-full overflow-y-auto scrollbar-thin py-6"
                        onScroll={handleScroll}
                    >
                        <div className="flex flex-col space-y-2">
                            {displayMessages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <Bot className="h-16 w-16 text-primary/30 mb-4" />
                                    <h2 className="text-xl font-semibold mb-2">Welcome to AI Assistant</h2>
                                    <p className="text-muted-foreground max-w-md">
                                        Ask me anything about government schemes, eligibility, application processes, and more!
                                    </p>
                                </div>
                            )}
                            {displayMessages.map((message) => renderMessage(message))}
                            {isLoading && (
                                <div className="flex justify-start mb-4">
                                    <div className="flex items-start space-x-3">
                                        <Avatar className="h-10 w-10 shrink-0">
                                            <AvatarImage src="/ai-avatar.svg" alt="AI Assistant" />
                                            <AvatarFallback className="bg-primary/20 text-primary">
                                                <Bot className="h-5 w-5" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="rounded-lg px-4 py-3 bg-accent text-accent-foreground">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} aria-hidden="true" className="h-1" />
                        </div>
                    </div>

                    {/* Scroll to bottom button */}
                    {userHasScrolled && (
                        <div className="absolute bottom-32 right-8 z-10">
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
                </div>
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 border-t bg-card">
                <div className="container max-w-5xl mx-auto px-4 py-4">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
                        <Input
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 border-primary/20 focus-visible:ring-primary h-12"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || isLoading}
                            className="rounded-full bg-primary hover:bg-primary/90 h-12 w-12"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
