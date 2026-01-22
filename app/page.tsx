"use client"

import Link from "next/link"
import { EligibilityForm } from "@/components/eligibility-form"
import { Button } from "@/components/ui/button"
import { ArrowRight, Globe, MessageSquare, SearchIcon } from "lucide-react"
import { FeaturedSchemes } from "@/components/featured-schemes"
import { useChatbot } from "@/components/chatbot/chatbot-provider"

export default function Home() {
  const { openChatbot } = useChatbot()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 animate-slideUp">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Find Government Schemes That Work For You
              </h1>
              <p className="mx-auto max-w-[700px] text-foreground/70 md:text-xl">
                Discover and access government schemes tailored to your needs with our AI-powered platform.
              </p>
            </div>
            <div className="w-full animate-fadeIn" style={{ animationDelay: "0.2s" }}>
              <EligibilityForm />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
              <Button asChild size="lg" className="btn-hover-effect group">
                <Link href="/schemes" className="flex items-center">
                  Explore Schemes
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                AI-Powered Features
              </h2>
              <p className="mx-auto max-w-[700px] text-foreground/70 md:text-xl">
                Our platform uses advanced AI to make government schemes more accessible.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg card-hover">
                <div className="p-2 bg-primary/10 rounded-full">
                  <SearchIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Search</h3>
                <p className="text-foreground/70 text-center">
                  AI-powered search with real-time suggestions and intent detection.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg card-hover">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Real-Time Translation</h3>
                <p className="text-foreground/70 text-center">
                  Automatic language detection and translation for multilingual support.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-6 rounded-lg card-hover">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI Chatbot</h3>
                <p className="text-foreground/70 text-center">
                  Get instant answers to your questions with our intelligent chatbot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Schemes Section */}
      <section className="w-full py-12 md:py-24 bg-accent">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Featured Schemes
              </h2>
              <p className="mx-auto max-w-[700px] text-foreground/70 md:text-xl">
                Explore some of the most popular government schemes.
              </p>
            </div>
            <FeaturedSchemes />
            <Button asChild className="mt-8 btn-hover-effect group">
              <Link href="/schemes" className="flex items-center">
                View All Schemes
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Find the Right Schemes?
              </h2>
              <p className="mx-auto max-w-[700px] text-primary-foreground/90 md:text-xl">
                Start exploring government schemes tailored to your needs today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 btn-hover-effect group"
                asChild
              >
                <Link href="/schemes" className="flex items-center">
                  Explore Schemes
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 btn-hover-effect group"
                onClick={openChatbot}
              >
                <span className="flex items-center">
                  Ask AI Assistant
                  <MessageSquare className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

