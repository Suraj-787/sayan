"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/components/language-provider"

// Define a type for serialized schemes from the API
interface SerializedScheme {
  _id: string;
  title: string;
  description: string;
  category: string;
  eligibility: string;
  benefits: string;
  application_process: string;
  documents: string[];
  deadline: string;
  website: string;
  created_at: string;
}

export function SchemeList() {
  const searchParams = useSearchParams()
  const { language, translate } = useLanguage()
  const [schemes, setSchemes] = useState<SerializedScheme[]>([])
  const [loading, setLoading] = useState(true)

  // Fix: Use a ref to track if this is the first render
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Only run this effect once on mount and when searchParams or language changes
    if (
      !initialized ||
      searchParams.toString() !== prevSearchParamsRef.current ||
      language !== prevLanguageRef.current
    ) {
      fetchSchemes()
      setInitialized(true)
    }
  }, [searchParams, language])

  // Use refs to store previous values
  const prevSearchParamsRef = useRef(searchParams.toString())
  const prevLanguageRef = useRef(language)

  const fetchSchemes = async () => {
    setLoading(true)

    // Update refs with current values
    prevSearchParamsRef.current = searchParams.toString()
    prevLanguageRef.current = language

    try {
      // Fetch schemes from the server
      const response = await fetch('/api/schemes');
      if (!response.ok) {
        throw new Error('Failed to fetch schemes');
      }
      
      let fetchedSchemes: SerializedScheme[] = await response.json();
      
      // Get filter parameters
      const categoryParam = searchParams.get("category")
      const eligibilityParam = searchParams.get("eligibility")
      const searchParam = searchParams.get("search")
  
      // Filter schemes based on URL parameters
      if (categoryParam) {
        const categories = categoryParam.split(",")
        fetchedSchemes = fetchedSchemes.filter((scheme) => 
          categories.includes(scheme.category.toLowerCase())
        )
      }
  
      if (eligibilityParam && eligibilityParam !== "all") {
        // This assumes eligibility field contains keywords like "farmers", "students", etc.
        const eligibilityLower = eligibilityParam.toLowerCase()
        fetchedSchemes = fetchedSchemes.filter(
          (scheme) => scheme.eligibility.toLowerCase().includes(eligibilityLower)
        )
      }
  
      if (searchParam) {
        const searchLower = searchParam.toLowerCase()
        fetchedSchemes = fetchedSchemes.filter(
          (scheme) =>
            scheme.title.toLowerCase().includes(searchLower) ||
            scheme.description.toLowerCase().includes(searchLower) ||
            scheme.category.toLowerCase().includes(searchLower),
        )
      }
  
      // Translate if needed
      if (language !== "en") {
        const translatedSchemes = await Promise.all(
          fetchedSchemes.map(async (scheme) => ({
            ...scheme,
            title: await translate(scheme.title),
            description: await translate(scheme.description),
            category: await translate(scheme.category),
          })),
        )
        setSchemes(translatedSchemes)
      } else {
        setSchemes(fetchedSchemes)
      }
    } catch (error) {
      console.error('Error fetching schemes:', error);
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="flex flex-col h-full animate-pulse">
            <CardHeader>
              <div className="w-20 h-6 bg-slate-200 rounded mb-2"></div>
              <div className="w-full h-6 bg-slate-200 rounded"></div>
              <div className="w-3/4 h-4 bg-slate-200 rounded mt-2"></div>
            </CardHeader>
            <CardFooter className="mt-auto pt-4">
              <div className="w-full h-10 bg-slate-200 rounded"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (schemes.length === 0) {
    return (
      <Card className="h-64">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <h3 className="text-lg font-medium">No schemes found</h3>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search terms</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {schemes.map((scheme) => (
        <Card
          key={scheme._id}
          className="flex flex-col h-full card-hover border border-transparent hover:border-primary/20"
        >
          <CardHeader>
            <Badge className="w-fit mb-2 bg-primary hover:bg-primary/90">{scheme.category}</Badge>
            <CardTitle className="group">
              <span className="bg-gradient-to-r from-primary to-primary bg-[length:0%_2px] bg-no-repeat bg-bottom group-hover:bg-[length:100%_2px] transition-all duration-500">
                {scheme.title}
              </span>
            </CardTitle>
            <CardDescription>{scheme.description}</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto pt-4">
            <Button asChild variant="outline" className="w-full btn-hover-effect group">
              <Link href={`/schemes/${scheme._id}`} className="flex items-center justify-center">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

