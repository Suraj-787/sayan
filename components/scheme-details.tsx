"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/components/language-provider"
import { FileText, Users, Gift, FileCheck, FileSpreadsheet, Calendar } from "lucide-react"

// Updated type definition for serialized MongoDB scheme
type SchemeDetailsProps = {
  scheme: {
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
}

export function SchemeDetails({ scheme }: SchemeDetailsProps) {
  const { language, translate } = useLanguage()
  const [translatedScheme, setTranslatedScheme] = useState(scheme)

  useEffect(() => {
    const translateScheme = async () => {
      if (language === "en") {
        setTranslatedScheme(scheme)
        return
      }

      const translated = {
        ...scheme,
        title: await translate(scheme.title),
        description: await translate(scheme.description),
        category: await translate(scheme.category),
        eligibility: await translate(scheme.eligibility),
        benefits: await translate(scheme.benefits),
        application_process: await translate(scheme.application_process),
        documents: await Promise.all(scheme.documents.map((doc) => translate(doc))),
        deadline: await translate(scheme.deadline),
      }

      setTranslatedScheme(translated)
    }

    translateScheme()
  }, [scheme, language, translate])

  return (
    <Card className="border border-primary/20">
      <CardHeader>
        <Badge className="w-fit mb-2 bg-primary hover:bg-primary/90">{translatedScheme.category}</Badge>
        <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          {translatedScheme.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Description
          </h3>
          <p className="text-foreground/80">{translatedScheme.description}</p>
        </div>

        <Separator className="bg-primary/10" />

        <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Eligibility
          </h3>
          <p className="text-foreground/80">{translatedScheme.eligibility}</p>
        </div>

        <Separator className="bg-primary/10" />

        <div className="animate-fadeIn" style={{ animationDelay: "0.3s" }}>
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Gift className="mr-2 h-5 w-5 text-primary" />
            Benefits
          </h3>
          <p className="text-foreground/80">{translatedScheme.benefits}</p>
        </div>

        <Separator className="bg-primary/10" />

        <div className="animate-fadeIn" style={{ animationDelay: "0.4s" }}>
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <FileCheck className="mr-2 h-5 w-5 text-primary" />
            Application Process
          </h3>
          <p className="text-foreground/80">{translatedScheme.application_process}</p>
        </div>

        <Separator className="bg-primary/10" />

        <div className="animate-fadeIn" style={{ animationDelay: "0.5s" }}>
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
            Required Documents
          </h3>
          <ul className="list-disc pl-5 space-y-1 text-foreground/80">
            {translatedScheme.documents.map((doc, index) => (
              <li key={index}>{doc}</li>
            ))}
          </ul>
        </div>

        <Separator className="bg-primary/10" />

        <div className="animate-fadeIn" style={{ animationDelay: "0.6s" }}>
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            Deadline
          </h3>
          <p className="text-foreground/80">{translatedScheme.deadline}</p>
        </div>

        <Separator className="bg-primary/10" />

        <div className="animate-fadeIn" style={{ animationDelay: "0.7s" }}>
          <h3 className="font-semibold text-lg mb-2">Official Website</h3>
          <a
            href={translatedScheme.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            {translatedScheme.website}
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

