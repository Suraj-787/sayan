import { SchemeFilters } from "@/components/scheme-filters"
import { SchemeList } from "@/components/scheme-list"
import { Search } from "@/components/search"

export default function SchemesPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Government Schemes</h1>
          <p className="text-gray-500 md:text-lg">
            Browse and search for government schemes across various categories.
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <Search />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <SchemeFilters />
          </div>
          <div className="md:col-span-3">
            <SchemeList />
          </div>
        </div>
      </div>
    </div>
  )
}

