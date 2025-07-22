import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Assistant - Sayan",
  description: "Chat with our AI assistant to find information about government schemes"
}

export default function ChatbotLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="bg-background">
      {children}
    </section>
  )
} 