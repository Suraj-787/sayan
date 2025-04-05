"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { MessageSquare, Moon, Sun, Menu, X, User, LogOut } from "lucide-react"
import { useChatbot } from "@/components/chatbot/chatbot-provider"
import { usePathname } from "next/navigation"
import { useTheme } from "@/components/theme-provider"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Header() {
  const { toggleChatbot } = useChatbot()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur-lg bg-opacity-80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
              {/* Add Logo */}
              <img
                src="/icons8-workflow-24.png" // Replace with the actual path to your logo
                alt="Logo"
                className="h-8 w-8 mr-2" // Adjust height and width as needed
              />
          
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
          {user && (
            <Link
              href="/preferences"
              className={`text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 ${
                pathname === "/preferences"
                  ? "text-primary after:bg-primary after:w-full"
                  : "text-foreground/70 hover:text-foreground after:bg-primary"
              }`}
            >
              My Preferences
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          

         

          <Button
            variant="outline"
            size="icon"
            onClick={toggleChatbot}
            aria-label="Open AI Assistant"
            className="rounded-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          {/* User Authentication */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/preferences">Preferences</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary">
                <Link href="/register">Sign up</Link>
              </Button>
            </div>
          )}

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
            
            {/* Mobile Auth Links */}
            {user ? (
              <>
                <Link
                  href="/preferences"
                  className={`text-sm font-medium p-2 rounded-md ${
                    pathname === "/preferences"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Preferences
                </Link>
                <button
                  className="text-sm font-medium p-2 rounded-md text-destructive hover:bg-destructive/10 text-left"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium p-2 rounded-md bg-primary text-primary-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

