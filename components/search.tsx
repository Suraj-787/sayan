"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { useDebounce } from "@/hooks/use-debounce"

type Suggestion = {
  id: string
  title: string
  category: string
}

export function Search() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()
  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLDivElement>(null)

  // Handle clicks outside the search component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch suggestions from the API
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)

    // Fetch schemes from API with search query
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`/api/schemes?search=${encodeURIComponent(debouncedQuery)}&limit=6`)
        if (!response.ok) {
          throw new Error('Failed to fetch schemes')
        }

        const schemes = await response.json()

        // Map schemes to suggestions format
        const schemeSuggestions = schemes.map((scheme: any) => ({
          id: scheme._id,
          title: scheme.title,
          category: scheme.category
        }))

        setSuggestions(schemeSuggestions)
      } catch (error) {
        console.error('Error fetching search suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [debouncedQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/schemes?search=${encodeURIComponent(query)}`)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (id: string) => {
    router.push(`/schemes/${id}`)
    setShowSuggestions(false)
    setQuery("")
  }

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="search"
          placeholder="Search for government schemes..."
          className="w-full pl-10 pr-4 py-2 h-12 border-primary/20 focus-visible:ring-primary"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
        />
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/60" />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 bg-primary hover:bg-primary/90"
        >
          Search
        </Button>
      </form>

      {showSuggestions && query.length >= 2 && (
        <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto shadow-lg border-primary/20 animate-fadeIn">
          {isLoading ? (
            <div className="p-4 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-foreground/70">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="px-4 py-2 hover:bg-primary/5 cursor-pointer transition-colors duration-150"
                  onClick={() => handleSuggestionClick(suggestion.id)}
                >
                  <div className="font-medium text-foreground">{suggestion.title}</div>
                  <div className="text-sm text-foreground/60">{suggestion.category}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-foreground/70">No schemes found. Try a different search term.</div>
          )}
        </Card>
      )}
    </div>
  )
}

