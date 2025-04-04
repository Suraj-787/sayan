"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { MessageSquare, Moon, Sun, Menu, X } from "lucide-react"
import { useChatbot } from "@/components/chatbot/chatbot-provider"
import { usePathname } from "next/navigation"
import { useTheme } from "@/components/theme-provider"
import { useState } from "react"

export function Header() {
  const { toggleChatbot } = useChatbot()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur-lg bg-opacity-80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Sayan
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href="/"
            className={`text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 ${
              pathname === "/"
                ? "text-primary after:bg-primary after:w-full"
                : "text-foreground/70 hover:text-foreground after:bg-primary"
            }`}
          >
            Home
          </Link>
          <Link
            href="/schemes"
            className={`text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 ${
              pathname.startsWith("/schemes")
                ? "text-primary after:bg-primary after:w-full"
                : "text-foreground/70 hover:text-foreground after:bg-primary"
            }`}
          >
            Schemes
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 ${
              pathname === "/about"
                ? "text-primary after:bg-primary after:w-full"
                : "text-foreground/70 hover:text-foreground after:bg-primary"
            }`}
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSelector />

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-full"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-5 w-5 transition-transform hover:-rotate-45" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleChatbot}
            aria-label="Open AI Assistant"
            className="rounded-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b animate-fadeIn">
          <nav className="container flex flex-col py-4 px-4 space-y-4">
            <Link
              href="/"
              className={`text-sm font-medium p-2 rounded-md ${
                pathname === "/"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/schemes"
              className={`text-sm font-medium p-2 rounded-md ${
                pathname.startsWith("/schemes")
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Schemes
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium p-2 rounded-md ${
                pathname === "/about"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:text-foreground hover:bg-accent"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

