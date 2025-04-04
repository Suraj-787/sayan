"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, Check, Loader2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useEffect, useState } from "react"

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "te", name: "తెలుగు (Telugu)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "mr", name: "मराठी (Marathi)" },
]

export function LanguageSelector() {
  const { language, setLanguage, isLoading } = useLanguage()
  const [open, setOpen] = useState(false)
  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0]

  // Close dropdown when language changes
  useEffect(() => {
    if (isLoading === false) {
      setOpen(false)
    }
  }, [isLoading])

  const handleLanguageChange = (code: string) => {
    if (code !== language) {
      setLanguage(code)
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 gap-1 border-primary/20 hover:bg-primary/10 hover:text-primary relative"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span className="hidden md:inline-flex font-medium">
            {currentLanguage.name.split(" ")[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center justify-between ${
              language === lang.code 
                ? "bg-primary/10 text-primary font-medium" 
                : "hover:bg-slate-100"
            }`}
            disabled={isLoading}
          >
            <span>{lang.name}</span>
            {language === lang.code && (isLoading ? <Loader2 className="h-3 w-3 ml-2 animate-spin" /> : <Check className="h-4 w-4 ml-2" />)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

