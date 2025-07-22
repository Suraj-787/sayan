"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useLanguage } from "@/components/language-provider"
import { Globe } from "lucide-react"
import { getFAQsForScheme } from "@/lib/mongoose-utils"

type SchemeFAQProps = {
  schemeId: string
  className?: string
}

type FAQ = {
  _id: string
  question: string
  answer: string
}

export function SchemeFAQ({ schemeId, className = "" }: SchemeFAQProps) {
  const { language, translate } = useLanguage()
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [faqTitle, setFaqTitle] = useState<string>("Frequently Asked Questions")
  const [isTranslated, setIsTranslated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFAQs = async () => {
      setIsLoading(true)
      
      try {
        // Fetch FAQs from MongoDB
        const faqData = await getFAQsForScheme(schemeId)
        
        if (!faqData || faqData.length === 0) {
          setFaqs([])
          setIsLoading(false)
          return
        }
        
        // Map to the format we need
        const formattedFAQs = faqData.map(faq => ({
          _id: (faq._id as any).toString(),
          question: faq.question,
          answer: faq.answer
        }))
        
        // Update state
        setFaqs(formattedFAQs)
      } catch (error) {
        console.error(`Error fetching FAQs for scheme ${schemeId}:`, error)
        setFaqs([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchFAQs()
  }, [schemeId])

  useEffect(() => {
    const translateFAQs = async () => {
      // Skip if still loading or no FAQs
      if (isLoading || faqs.length === 0) return
      
      // Translate the title regardless of language
      const translatedTitle = await translate("Frequently Asked Questions")
      setFaqTitle(translatedTitle)

      // Set translation status
      setIsTranslated(language !== "en")

      if (language === "en") {
        return
      }

      // Translate FAQs if needed
      const translatedFAQs = await Promise.all(
        faqs.map(async (faq) => ({
          _id: faq._id,
          question: await translate(faq.question),
          answer: await translate(faq.answer),
        })),
      )

      setFaqs(translatedFAQs)
    }

    translateFAQs()
  }, [faqs, language, translate, isLoading])

  if (isLoading) {
    return (
      <Card className={`${className} border border-primary/20 animate-pulse`}>
        <CardHeader className="bg-primary/5">
          <div className="h-6 w-48 bg-primary/10 rounded"></div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="h-10 bg-primary/5 rounded"></div>
          <div className="h-10 bg-primary/5 rounded"></div>
          <div className="h-10 bg-primary/5 rounded"></div>
        </CardContent>
      </Card>
    )
  }

  if (faqs.length === 0) {
    return null
  }

  return (
    <Card className={`${className} border border-primary/20 animate-fadeIn transition-all duration-300`} style={{ animationDelay: "0.3s" }}>
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="bg-primary h-2 w-2 rounded-full mr-2"></span>
            {faqTitle}
          </div>
          {isTranslated && (
            <div className="flex items-center text-xs text-primary/80 bg-primary/10 px-2 py-1 rounded-full">
              <Globe className="h-3 w-3 mr-1" />
              <span>Translated</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq._id} value={`item-${index}`} className="border-primary/10">
              <AccordionTrigger className="text-foreground hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/80 leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

