"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" 
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
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

export function FeaturedSchemes() {
  const [schemes, setSchemes] = useState<SerializedScheme[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { language } = useLanguage();

  // Local translation function
  const translateText = async (text: string, lang: string): Promise<string> => {
    // In a real app, you would call a translation API here
    // For now, we'll just return the original text
    return text;
  };

  useEffect(() => {
    const fetchSchemes = async () => {
      setIsLoading(true);
      try {
        // Fetch schemes from the API
        const response = await fetch('/api/schemes');
        if (!response.ok) {
          throw new Error('Failed to fetch schemes');
        }
        
        const allSchemes: SerializedScheme[] = await response.json();
        
        // Get only the first 3 schemes for featured display
        const featuredSchemes = allSchemes.slice(0, 3);
        setSchemes(featuredSchemes);
      } catch (error) {
        console.error("Error fetching schemes:", error);
        setSchemes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  useEffect(() => {
    // This effect runs when language changes
    if (schemes.length === 0 || language === "en") {
      return;
    }

    const translateSchemes = async () => {
      // Translate schemes when language changes
      const translatedSchemes = await Promise.all(
        schemes.map(async (scheme) => ({
          ...scheme,
          title: await translateText(scheme.title, language),
          description: await translateText(scheme.description, language),
          category: await translateText(scheme.category, language)
        }))
      );
      
      setSchemes(translatedSchemes);
    };

    translateSchemes();
  }, [language, schemes.length]);

  if (isLoading) {
    return (
      <div className="flex gap-6 w-full">
        {[1, 2, 3].map((index) => (
          <Card key={index} className="flex-1 flex flex-col h-64 animate-pulse">
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
    );
  }

  return (
    <div className="flex gap-6 w-full">
      {schemes.map((scheme) => (
        <Card 
          key={scheme._id} 
          className="flex-1 flex flex-col h-64 card-hover border border-transparent hover:border-primary/20"
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
                {language === "en" ? "Learn More" : 
                  language === "hi" ? "और अधिक जानें" :
                  language === "ta" ? "மேலும் அறிக" :
                  language === "te" ? "మరింత తెలుసుకోండి" :
                  language === "bn" ? "আরও জানুন" :
                  language === "mr" ? "अधिक जाणून घ्या" : "Learn More"}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}