"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

export function SchemeFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get initial filter values from URL
  const initialCategory = searchParams.get("category")?.split(",") || []
  const initialEligibility = searchParams.get("eligibility") || "all"

  const [categories, setCategories] = useState<string[]>(initialCategory)
  const [eligibility, setEligibility] = useState<string>(initialEligibility)

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setCategories([...categories, category])
    } else {
      setCategories(categories.filter((c) => c !== category))
    }
  }

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams)

    if (categories.length > 0) {
      params.set("category", categories.join(","))
    } else {
      params.delete("category")
    }

    if (eligibility !== "all") {
      params.set("eligibility", eligibility)
    } else {
      params.delete("eligibility")
    }

    router.push(`/schemes?${params.toString()}`)
  }

  const handleResetFilters = () => {
    setCategories([])
    setEligibility("all")
    router.push("/schemes")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Categories</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-education"
                checked={categories.includes("education")}
                onCheckedChange={(checked) => handleCategoryChange("education", checked as boolean)}
              />
              <Label htmlFor="category-education">Education</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-health"
                checked={categories.includes("health")}
                onCheckedChange={(checked) => handleCategoryChange("health", checked as boolean)}
              />
              <Label htmlFor="category-health">Health</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-agriculture"
                checked={categories.includes("agriculture")}
                onCheckedChange={(checked) => handleCategoryChange("agriculture", checked as boolean)}
              />
              <Label htmlFor="category-agriculture">Agriculture</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-finance"
                checked={categories.includes("finance")}
                onCheckedChange={(checked) => handleCategoryChange("finance", checked as boolean)}
              />
              <Label htmlFor="category-finance">Finance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-housing"
                checked={categories.includes("housing")}
                onCheckedChange={(checked) => handleCategoryChange("housing", checked as boolean)}
              />
              <Label htmlFor="category-housing">Housing</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Eligibility</h3>
          <RadioGroup value={eligibility} onValueChange={setEligibility}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="eligibility-all" />
              <Label htmlFor="eligibility-all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="students" id="eligibility-students" />
              <Label htmlFor="eligibility-students">Students</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="farmers" id="eligibility-farmers" />
              <Label htmlFor="eligibility-farmers">Farmers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="women" id="eligibility-women" />
              <Label htmlFor="eligibility-women">Women</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="senior-citizens" id="eligibility-senior" />
              <Label htmlFor="eligibility-senior">Senior Citizens</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex flex-col space-y-2 pt-4">
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={handleResetFilters}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

