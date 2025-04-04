"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type ThemeContextType = {
  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  attribute,
  defaultTheme = "system",
  children,
}: {
  attribute: string
  defaultTheme?: "system" | "light" | "dark"
  children: ReactNode
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

