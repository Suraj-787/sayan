"use client"

import { useState, useEffect } from "react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge" 
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/language-provider"
import { translate } from "../lib/translation-utils"

type Scheme = {
  id: string
  title: string
  description: string
  category: string
  isFeatured?: boolean
}

// Sample featured schemes data for demonstration
const sampleFeaturedSchemes: Scheme[] = [
  {
    id: "scheme1",
    title: "Education Scholarship",
    description: "Financial support for students pursuing higher education",
    category: "Education",
    isFeatured: true
  },
  {
    id: "scheme2",
    title: "Healthcare Benefits",
    description: "Medical assistance program for families",
    category: "Healthcare",
    isFeatured: true
  },
  {
    id: "scheme3",
    title: "Rural Development",
    description: "Infrastructure and employment opportunities in rural areas",
    category: "Development",
    isFeatured: true
  }
];

export function FeaturedSchemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { language } = useLanguage();

  // Create a translations object
  const translations: Record<string, Record<string, string>> = {
    en: {
      "Education": "Education",
      "Healthcare": "Healthcare",
      "Development": "Development",
      "Education Scholarship": "Education Scholarship",
      "Healthcare Benefits": "Healthcare Benefits",
      "Rural Development": "Rural Development",
      "Financial support for students pursuing higher education": "Financial support for students pursuing higher education",
      "Medical assistance program for families": "Medical assistance program for families",
      "Infrastructure and employment opportunities in rural areas": "Infrastructure and employment opportunities in rural areas",
      "Learn More": "Learn More"
    },
    hi: {
      "Education": "शिक्षा",
      "Healthcare": "स्वास्थ्य सेवा",
      "Development": "विकास",
      "Education Scholarship": "शिक्षा छात्रवृत्ति",
      "Healthcare Benefits": "स्वास्थ्य लाभ",
      "Rural Development": "ग्रामीण विकास",
      "Financial support for students pursuing higher education": "उच्च शिक्षा प्राप्त करने वाले छात्रों के लिए वित्तीय सहायता",
      "Medical assistance program for families": "परिवारों के लिए चिकित्सा सहायता कार्यक्रम",
      "Infrastructure and employment opportunities in rural areas": "ग्रामीण क्षेत्रों में बुनियादी ढांचा और रोजगार के अवसर",
      "Learn More": "और अधिक जानें"
    },
    ta: {
      "Education": "கல்வி",
      "Healthcare": "சுகாதாரம்",
      "Development": "வளர்ச்சி",
      "Education Scholarship": "கல்வி உதவித்தொகை",
      "Healthcare Benefits": "சுகாதார நலன்கள்",
      "Rural Development": "ஊரக வளர்ச்சி",
      "Financial support for students pursuing higher education": "உயர்கல்வி பயிலும் மாணவர்களுக்கான நிதி உதவி",
      "Medical assistance program for families": "குடும்பங்களுக்கான மருத்துவ உதவித் திட்டம்",
      "Infrastructure and employment opportunities in rural areas": "கிராமப்புற பகுதிகளில் உள்கட்டமைப்பு மற்றும் வேலைவாய்ப்புகள்",
      "Learn More": "மேலும் அறிக"
    },
    te: {
      "Education": "విద్య",
      "Healthcare": "ఆరోగ్య సంరక్షణ",
      "Development": "అభివృద్ధి",
      "Education Scholarship": "విద్యా ఉపకారవేతనం",
      "Healthcare Benefits": "ఆరోగ్య ప్రయోజనాలు",
      "Rural Development": "గ్రామీణ అభివృద్ధి",
      "Financial support for students pursuing higher education": "ఉన్నత విద్యను అభ్యసిస్తున్న విద్యార్థులకు ఆర్థిక సహాయం",
      "Medical assistance program for families": "కుటుంబాలకు వైద్య సహాయ కార్యక్రమం",
      "Infrastructure and employment opportunities in rural areas": "గ్రామీణ ప్రాంతాల్లో మౌలిక సదుపాయాలు మరియు ఉద్యోగ అవకాశాలు",
      "Learn More": "మరింత తెలుసుకోండి"
    },
    bn: {
      "Education": "শিক্ষা",
      "Healthcare": "স্বাস্থ্যসেবা",
      "Development": "উন্নয়ন",
      "Education Scholarship": "শিক্ষা বৃত্তি",
      "Healthcare Benefits": "স্বাস্থ্যসেবা সুবিধা",
      "Rural Development": "গ্রামীণ উন্নয়ন",
      "Financial support for students pursuing higher education": "উচ্চ শিক্ষার জন্য শিক্ষার্থীদের আর্থিক সহায়তা",
      "Medical assistance program for families": "পরিবারগুলির জন্য চিকিৎসা সহায়তা প্রোগ্রাম",
      "Infrastructure and employment opportunities in rural areas": "গ্রামীণ এলাকায় অবকাঠামো এবং কর্মসংস্থানের সুযোগ",
      "Learn More": "আরও জানুন"
    },
    mr: {
      "Education": "शिक्षण",
      "Healthcare": "आरोग्य सेवा",
      "Development": "विकास",
      "Education Scholarship": "शिक्षण शिष्यवृत्ती",
      "Healthcare Benefits": "आरोग्य लाभ",
      "Rural Development": "ग्रामीण विकास",
      "Financial support for students pursuing higher education": "उच्च शिक्षण घेणाऱ्या विद्यार्थ्यांसाठी आर्थिक मदत",
      "Medical assistance program for families": "कुटुंबांसाठी वैद्यकीय सहाय्य कार्यक्रम",
      "Infrastructure and employment opportunities in rural areas": "ग्रामीण भागात पायाभूत सुविधा आणि रोजगाराच्या संधी",
      "Learn More": "अधिक जाणून घ्या"
    }
  };

  // Helper function to get translated text
  const getTranslatedText = (text: string): string => {
    if (language === "en" || !translations[language]) {
      return text;
    }
    return translations[language][text] || text;
  };

  useEffect(() => {
    const fetchSchemes = async () => {
      setIsLoading(true);
      try {
        // Use the sample featured schemes data
        setSchemes(sampleFeaturedSchemes);
      } catch (error) {
        console.error("Error fetching schemes:", error);
        setSchemes(sampleFeaturedSchemes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  useEffect(() => {
    // This effect runs when language changes
    if (language === "en") {
      // Reset to original schemes for English
      setSchemes([...sampleFeaturedSchemes]);
      return;
    }

    // Create new array with translated content
    const translatedSchemes = sampleFeaturedSchemes.map(scheme => ({
      ...scheme,
      title: getTranslatedText(scheme.title),
      description: getTranslatedText(scheme.description),
      category: getTranslatedText(scheme.category)
    }));
    
    setSchemes(translatedSchemes);
  }, [language]);

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
          key={scheme.id} 
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
              <Link href={`/schemes/${scheme.id}`} className="flex items-center justify-center">
                {getTranslatedText("Learn More")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}