"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type LanguageContextType = {
  language: string
  setLanguage: (language: string) => void
  translate: (text: string) => Promise<string>
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Simple mock translations for demonstration purposes
const mockTranslations: Record<string, Record<string, string>> = {
  "hi": { // Hindi
    "Frequently Asked Questions": "अक्सर पूछे जाने वाले प्रश्न",
    "PM Kisan Samman Nidhi Yojana": "पीएम किसान सम्मान निधि योजना",
    "Agriculture": "कृषि",
    "Financial assistance to farmer families across the country": "देश भर के किसान परिवारों को वित्तीय सहायता",
    "Pradhan Mantri Awas Yojana": "प्रधानमंत्री आवास योजना",
    "Housing": "आवास",
    "Housing for all by 2022 through financial assistance for house construction": "2022 तक सभी के लिए घर निर्माण के लिए वित्तीय सहायता के माध्यम से आवास",
    "Pradhan Mantri Jan Dhan Yojana": "प्रधानमंत्री जन धन योजना",
    "Finance": "वित्त",
    "Financial inclusion program to ensure access to financial services": "वित्तीय सेवाओं तक पहुंच सुनिश्चित करने के लिए वित्तीय समावेशन कार्यक्रम",
    "Learn More": "और जानें",
    "Who is eligible for PM Kisan Samman Nidhi Yojana?": "पीएम किसान सम्मान निधि योजना के लिए कौन पात्र है?",
    "All landholding farmer families with cultivable land are eligible for this scheme. However, certain categories like institutional landholders, farmer families with one or more members as government employees, income tax payers, etc. are excluded.": "कृषि योग्य भूमि वाले सभी भूमिधारक किसान परिवार इस योजना के लिए पात्र हैं। हालांकि, संस्थागत भूमिधारकों, सरकारी कर्मचारियों के रूप में एक या अधिक सदस्यों वाले किसान परिवारों, आयकर दाताओं आदि जैसी कुछ श्रेणियों को बाहर रखा गया है।"
  },
  "ta": { // Tamil
    "Frequently Asked Questions": "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    "PM Kisan Samman Nidhi Yojana": "பிஎம் கிசான் சம்மான் நிதி யோஜனா",
    "Agriculture": "விவசாயம்",
    "Financial assistance to farmer families across the country": "நாடு முழுவதும் உள்ள விவசாயக் குடும்பங்களுக்கு நிதி உதவி",
    "Pradhan Mantri Awas Yojana": "பிரதமர் ஆவாஸ் யோஜனா",
    "Housing": "வீட்டுவசதி",
    "Housing for all by 2022 through financial assistance for house construction": "2022க்குள் வீடு கட்டுவதற்கான நிதி உதவி மூலம் அனைவருக்கும் வீடு",
    "Pradhan Mantri Jan Dhan Yojana": "பிரதமர் ஜன் தன் யோஜனா",
    "Finance": "நிதி",
    "Financial inclusion program to ensure access to financial services": "நிதிச் சேவைகளுக்கான அணுகலை உறுதிசெய்யும் நிதிச் சேர்க்கை திட்டம்",
    "Learn More": "மேலும் அறிக"
  },
  "bn": { // Bengali
    "Frequently Asked Questions": "সচরাচর জিজ্ঞাসিত প্রশ্নাবলী",
    "PM Kisan Samman Nidhi Yojana": "পিএম কিষাণ সম্মান নিধি যোজনা",
    "Agriculture": "কৃষি",
    "Financial assistance to farmer families across the country": "দেশজুড়ে কৃষক পরিবারগুলিকে আর্থিক সহায়তা",
    "Pradhan Mantri Awas Yojana": "প্রধানমন্ত্রী আবাস যোজনা",
    "Housing": "আবাসন",
    "Housing for all by 2022 through financial assistance for house construction": "বাড়ি নির্মাণের জন্য আর্থিক সহায়তার মাধ্যমে 2022 সালের মধ্যে সবার জন্য আবাসন",
    "Pradhan Mantri Jan Dhan Yojana": "প্রধানমন্ত্রী জন ধন যোজনা",
    "Finance": "অর্থ",
    "Financial inclusion program to ensure access to financial services": "আর্থিক পরিষেবাগুলিতে অ্যাক্সেস নিশ্চিত করার জন্য আর্থিক অন্তর্ভুক্তি প্রোগ্রাম",
    "Learn More": "আরও জানুন",
    "Who is eligible for PM Kisan Samman Nidhi Yojana?": "পিএম কিষাণ সম্মান নিধি যোজনার জন্য কে যোগ্য?",
    "How much financial assistance is provided under PM Kisan?": "পিএম কিষাণের অধীনে কত আর্থিক সহায়তা প্রদান করা হয়?",
    "Under PM Kisan, eligible farmer families receive ₹6,000 per year in three equal installments of ₹2,000 each, every four months.": "পিএম কিষাণের অধীনে, যোগ্য কৃষক পরিবারগুলি প্রতি চার মাসে ₹2,000 করে তিনটি সমান কিস্তিতে বছরে ₹6,000 পায়।"
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState("en")
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize on client side only to avoid hydration errors
  useEffect(() => {
    setIsClient(true)
    const savedLanguage = localStorage.getItem('preferredLanguage')
    if (savedLanguage) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // Wrapper function to set language and store in localStorage
  const setLanguage = (newLanguage: string) => {
    setIsLoading(true)
    setLanguageState(newLanguage)
    if (isClient) {
      localStorage.setItem('preferredLanguage', newLanguage)
    }
    // Hide loading state after a brief delay to allow components to translate
    setTimeout(() => setIsLoading(false), 500)
  }

  // Mock translation function
  const translate = async (text: string): Promise<string> => {
    if (language === "en") return text

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Return mock translation if available, otherwise return original text
    if (mockTranslations[language]?.[text]) {
      return mockTranslations[language][text]
    }
    
    // If no translation exists, prefix with language code to show it would be translated
    return `[${language}] ${text}`
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

