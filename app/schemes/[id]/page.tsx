import { notFound } from 'next/navigation'
import { getSchemeById, getFAQsForScheme } from '@/lib/mongoose-utils'
import { SchemeDetails } from '@/components/scheme-details'
import { SchemeFAQ } from '@/components/scheme-faq'
import { SchemeActions } from '@/components/scheme-actions'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface SchemePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SchemePage({ params }: SchemePageProps) {
  // Properly await the params object to satisfy Next.js requirements
  const { id } = await params;
  
  // Get scheme details using Mongoose utils
  const scheme = await getSchemeById(id);
  
  if (!scheme) {
    notFound();
  }
  
  // Serialize the MongoDB document to plain object to avoid "Objects with toJSON methods are not supported" error
  const serializedScheme = {
    ...scheme,
    _id: (scheme._id as any).toString(),
    created_at: scheme.created_at instanceof Date ? scheme.created_at.toISOString() : scheme.created_at,
  };
  
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
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{serializedScheme.title}</h1>
            <p className="text-gray-500 md:text-lg">{serializedScheme.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SchemeDetails scheme={serializedScheme} />
            <SchemeFAQ schemeId={serializedScheme._id} className="mt-8" />
          </div>
          <div className="lg:col-span-1">
            <SchemeActions scheme={serializedScheme} />
          </div>
        </div>
      </div>
    </div>
  )
}

