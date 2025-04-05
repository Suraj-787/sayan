import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChatbotProvider } from "@/components/chatbot/chatbot-provider"
import { Chatbot } from "@/components/chatbot/chatbot"
import { LanguageProvider } from "@/components/language-provider"
import { PageTransition } from "@/components/page-transition"

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
          <LanguageProvider>
            <ChatbotProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  <PageTransition>{children}</PageTransition>
                </main>
                <Chatbot />
                <Footer />
              </div>
            </ChatbotProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'