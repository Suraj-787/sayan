"use client"

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { useState, useEffect } from "react"
import { getAllSchemes } from "@/lib/supabase-utils"

type Scheme = {
  id: string
  title: string
  description: string
  category: string
}

export function FeaturedSchemes() {
  const { language, translate } = useLanguage()
  const [schemes, setSchemes] = useState<Scheme[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch schemes from Supabase
  useEffect(() => {
    const fetchSchemes = async () => {
      setIsLoading(true)
      
      try {
        const schemesData = await getAllSchemes()
        
        if (schemesData && schemesData.length > 0) {
          // Take first 3 schemes for featured display
          const featuredSchemes = schemesData.slice(0, 3).map(scheme => ({
            id: scheme.id,
            title: scheme.title,
            description: scheme.description,
            category: scheme.category
          }))
          
          setSchemes(featuredSchemes)
        } else {
          // Fallback to empty array
          setSchemes([])
        }
      } catch (error) {
        console.error('Error fetching schemes:', error)
        setSchemes([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSchemes()
  }, [])

  // Translate scheme content when language changes
  useEffect(() => {
    const translateSchemes = async () => {
      if (language === "en" || schemes.length === 0) {
        return
      }

      const translatedSchemes = await Promise.all(
        schemes.map(async (scheme) => ({
          ...scheme,
          title: await translate(scheme.title),
          description: await translate(scheme.description),
          category: await translate(scheme.category),
        })),
      )

      setSchemes(translatedSchemes)
    }

    translateSchemes()
  }, [language, translate, schemes.length])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {[1, 2, 3].map((index) => (
          <Card key={index} className="flex flex-col h-full animate-pulse">
            <CardHeader>
              <div className="w-24 h-6 bg-primary/10 rounded mb-2"></div>
              <div className="h-6 w-full bg-primary/10 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-primary/5 rounded"></div>
            </CardHeader>
            <CardFooter className="mt-auto pt-4">
              <div className="w-full h-10 bg-primary/10 rounded"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (schemes.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-foreground/70">No schemes available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
      {schemes.map((scheme, index) => (
        <Card
          key={scheme.id}
          className="flex flex-col h-full card-hover border border-transparent hover:border-primary/20"
          style={{ animationDelay: `${index * 0.1}s` }}
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
              <Link href={`/schemes/${scheme.id}`} className="flex items-center justify-center">
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

