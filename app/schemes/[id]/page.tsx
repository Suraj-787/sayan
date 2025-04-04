import { SchemeDetails } from "@/components/scheme-details"
import { SchemeFAQ } from "@/components/scheme-faq"
import { SchemeActions } from "@/components/scheme-actions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getSchemeById, getFAQsForScheme } from "@/lib/supabase-utils"

// Define a type for scheme data
type Scheme = {
  id: string
  title: string
  description: string
  category: string
  eligibility: string
  benefits: string
  application_process: string
  documents: string[]
  deadline: string
  website: string
}

// Get scheme data from Supabase
async function getSchemeData(id: string): Promise<Scheme | null> {
  try {
    const scheme = await getSchemeById(id)
    
    if (!scheme) {
      return null
    }
    
    return {
      id: scheme.id,
      title: scheme.title,
      description: scheme.description,
      category: scheme.category,
      eligibility: scheme.eligibility,
      benefits: scheme.benefits,
      application_process: scheme.application_process,
      documents: scheme.documents,
      deadline: scheme.deadline,
      website: scheme.website,
    }
  } catch (error) {
    console.error(`Error fetching scheme with ID ${id}:`, error)
    
    // Fallback to mock data for development
    return {
      id,
      title: "PM Kisan Samman Nidhi Yojana",
      description: "Financial assistance to farmer families across the country",
      category: "Agriculture",
      eligibility: "All landholding farmer families with cultivable land",
      benefits: "₹6,000 per year in three equal installments",
      application_process: "Apply online through the official PM-KISAN portal or visit your nearest Common Service Centre",
      documents: ["Aadhaar Card", "Land Records", "Bank Account Details"],
      deadline: "Ongoing scheme with quarterly payments",
      website: "https://pmkisan.gov.in/",
    }
  }
}

export default async function SchemeDetailsPage({ params }: { params: { id: string } }) {
  const scheme = await getSchemeData(params.id)
  
  if (!scheme) {
    // Handle scheme not found
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col space-y-8">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/schemes">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Schemes
              </Link>
            </Button>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Scheme Not Found</h1>
              <p className="text-gray-500 md:text-lg">The scheme you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-8">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/schemes">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Schemes
            </Link>
          </Button>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{scheme.title}</h1>
            <p className="text-gray-500 md:text-lg">{scheme.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SchemeDetails scheme={scheme} />
            <SchemeFAQ schemeId={params.id} className="mt-8" />
          </div>
          <div className="lg:col-span-1">
            <SchemeActions scheme={scheme} />
          </div>
        </div>
      </div>
    </div>
  )
}

