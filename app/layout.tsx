import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChatbotProvider } from "@/components/chatbot/chatbot-provider"
import { Chatbot } from "@/components/chatbot/chatbot"
import { ChatbotFloatingButton } from "@/components/chatbot/chatbot-floating-button"
import { LanguageProvider } from "@/components/language-provider"
import { PageTransition } from "@/components/page-transition"
import { AuthProvider } from "@/hooks/useAuth"
import { ChatbotWrapper } from "@/components/chatbot/chatbot-wrapper"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sayan",
  icons: {
    icon: "icons8-workflow-24.png",
  },
  description: "Find and access government schemes with AI-powered assistance",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <LanguageProvider>
              <ChatbotProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-1">
                    <PageTransition>{children}</PageTransition>
                  </main>
                  <ChatbotWrapper />
                  <ChatbotFloatingButton />
                  <Footer />
                </div>
                <Toaster />
              </ChatbotProvider>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'