"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

// Define a type for filter preferences
type FilterPreferences = {
  categories: string[]
  eligibility: string[]
  incomeLevel: string
  minAge: string
  maxAge: string
  location: string
  usePreferences: boolean
}

// Helper function to save filter preferences to localStorage
const saveFilterPreferences = (userId: string, preferences: FilterPreferences) => {
  if (typeof window === 'undefined') return;
  
  try {
    const storageKey = `sayan_filters_${userId}`;
    localStorage.setItem(storageKey, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving filter preferences:', error);
  }
};

// Helper function to load filter preferences from localStorage
const loadFilterPreferences = (userId: string): FilterPreferences | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const storageKey = `sayan_filters_${userId}`;
    const storedPrefs = localStorage.getItem(storageKey);
    return storedPrefs ? JSON.parse(storedPrefs) : null;
  } catch (error) {
    console.error('Error loading filter preferences:', error);
    return null;
  }
};

export function SchemeFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  // Get initial filter values from URL
  const initialCategory = searchParams.get("category")?.split(",") || []
  const initialEligibility = searchParams.get("eligibility")?.split(",") || []
  const initialIncomeLevel = searchParams.get("income_level") || "any"
  const initialMinAge = searchParams.get("min_age") || ""
  const initialMaxAge = searchParams.get("max_age") || ""
  const initialLocation = searchParams.get("location") || "any"
  const initialUsePreferences = searchParams.get("use_preferences") === "true"

  const [categories, setCategories] = useState<string[]>(initialCategory)
  const [eligibility, setEligibility] = useState<string[]>(initialEligibility)
  const [incomeLevel, setIncomeLevel] = useState<string>(initialIncomeLevel)
  const [minAge, setMinAge] = useState<string>(initialMinAge)
  const [maxAge, setMaxAge] = useState<string>(initialMaxAge)
  const [location, setLocation] = useState<string>(initialLocation)
  const [usePreferences, setUsePreferences] = useState<boolean>(initialUsePreferences)
  const [filtersLoaded, setFiltersLoaded] = useState<boolean>(false)

  // Load saved filter preferences when user logs in
  useEffect(() => {
    if (user && !filtersLoaded) {
      const savedPrefs = loadFilterPreferences(user.id);
      
      if (savedPrefs) {
        // Only update if there are no URL parameters or if using preferences
        const noUrlFilters = !searchParams.has("category") && 
                            !searchParams.has("eligibility") && 
                            !searchParams.has("income_level") && 
                            !searchParams.has("min_age") && 
                            !searchParams.has("max_age") && 
                            !searchParams.has("location");
        
        if (noUrlFilters || savedPrefs.usePreferences) {
          setCategories(savedPrefs.categories);
          setEligibility(savedPrefs.eligibility);
          setIncomeLevel(savedPrefs.incomeLevel);
          setMinAge(savedPrefs.minAge);
          setMaxAge(savedPrefs.maxAge);
          setLocation(savedPrefs.location);
          setUsePreferences(savedPrefs.usePreferences);
          
          // Apply filters immediately when loading from localStorage
          if (noUrlFilters) {
            applyFiltersToUrl(
              savedPrefs.categories,
              savedPrefs.eligibility,
              savedPrefs.incomeLevel,
              savedPrefs.minAge,
              savedPrefs.maxAge,
              savedPrefs.location,
              savedPrefs.usePreferences
            );
          }
        }
      }
      
      setFiltersLoaded(true);
    }
  }, [user, filtersLoaded, searchParams]);

  // Save filter preferences when they change
  useEffect(() => {
    if (user && filtersLoaded) {
      const currentPrefs: FilterPreferences = {
        categories,
        eligibility,
        incomeLevel,
        minAge,
        maxAge,
        location,
        usePreferences
      };
      
      saveFilterPreferences(user.id, currentPrefs);
    }
  }, [categories, eligibility, incomeLevel, minAge, maxAge, location, usePreferences, user, filtersLoaded]);

  // Apply user preferences when toggled
  useEffect(() => {
    if (usePreferences && user?.preferences) {
      setCategories(user.preferences.categories || [])
      setEligibility(user.preferences.eligibility || [])
      setIncomeLevel(user.preferences.income_level || "any")
      setMinAge(user.preferences.min_age ? user.preferences.min_age.toString() : "")
      setMaxAge(user.preferences.max_age ? user.preferences.max_age.toString() : "")
      setLocation(user.preferences.location || "any")
    }
  }, [usePreferences, user])

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setCategories([...categories, category])
    } else {
      setCategories(categories.filter((c) => c !== category))
    }
  }

  const handleEligibilityChange = (eligibilityType: string, checked: boolean) => {
    if (checked) {
      setEligibility([...eligibility, eligibilityType])
    } else {
      setEligibility(eligibility.filter((e) => e !== eligibilityType))
    }
  }

  // Helper function to apply filters to URL
  const applyFiltersToUrl = (
    cats: string[],
    elig: string[],
    income: string,
    min: string,
    max: string,
    loc: string,
    usePrefs: boolean
  ) => {
    const params = new URLSearchParams(searchParams)

    if (cats.length > 0) {
      params.set("category", cats.join(","))
    } else {
      params.delete("category")
    }

    if (elig.length > 0) {
      params.set("eligibility", elig.join(","))
    } else {
      params.delete("eligibility")
    }

    if (income && income !== "any") {
      params.set("income_level", income)
    } else {
      params.delete("income_level")
    }

    if (min) {
      params.set("min_age", min)
    } else {
      params.delete("min_age")
    }

    if (max) {
      params.set("max_age", max)
    } else {
      params.delete("max_age")
    }

    if (loc && loc !== "any") {
      params.set("location", loc)
    } else {
      params.delete("location")
    }

    params.set("use_preferences", usePrefs.toString())

    router.push(`/schemes?${params.toString()}`)
  }

  const handleApplyFilters = () => {
    applyFiltersToUrl(
      categories,
      eligibility,
      incomeLevel,
      minAge,
      maxAge,
      location,
      usePreferences
    );
  }

  const handleResetFilters = () => {
    setCategories([])
    setEligibility([])
    setIncomeLevel("any")
    setMinAge("")
    setMaxAge("")
    setLocation("any")
    setUsePreferences(false)
    router.push("/schemes")
    
    // Also clear saved preferences if user is logged in
    if (user) {
      const emptyPrefs: FilterPreferences = {
        categories: [],
        eligibility: [],
        incomeLevel: "any",
        minAge: "",
        maxAge: "",
        location: "any",
        usePreferences: false
      }
      saveFilterPreferences(user.id, emptyPrefs)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
        {user && (
          <div className="flex items-center space-x-2 mt-2">
            <Switch
              id="use-preferences"
              checked={usePreferences}
              onCheckedChange={setUsePreferences}
            />
            <Label htmlFor="use-preferences">Use my preferences</Label>
          </div>
        )}
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-employment"
                checked={categories.includes("employment")}
                onCheckedChange={(checked) => handleCategoryChange("employment", checked as boolean)}
              />
              <Label htmlFor="category-employment">Employment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-skill-development"
                checked={categories.includes("skill-development")}
                onCheckedChange={(checked) => handleCategoryChange("skill-development", checked as boolean)}
              />
              <Label htmlFor="category-skill-development">Skill Development</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Eligibility</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eligibility-students"
                checked={eligibility.includes("students")}
                onCheckedChange={(checked) => handleEligibilityChange("students", checked as boolean)}
              />
              <Label htmlFor="eligibility-students">Students</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eligibility-farmers"
                checked={eligibility.includes("farmers")}
                onCheckedChange={(checked) => handleEligibilityChange("farmers", checked as boolean)}
              />
              <Label htmlFor="eligibility-farmers">Farmers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eligibility-women"
                checked={eligibility.includes("women")}
                onCheckedChange={(checked) => handleEligibilityChange("women", checked as boolean)}
              />
              <Label htmlFor="eligibility-women">Women</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eligibility-senior-citizens"
                checked={eligibility.includes("senior-citizens")}
                onCheckedChange={(checked) => handleEligibilityChange("senior-citizens", checked as boolean)}
              />
              <Label htmlFor="eligibility-senior-citizens">Senior Citizens</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eligibility-rural"
                checked={eligibility.includes("rural")}
                onCheckedChange={(checked) => handleEligibilityChange("rural", checked as boolean)}
              />
              <Label htmlFor="eligibility-rural">Rural Residents</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eligibility-disabled"
                checked={eligibility.includes("disabled")}
                onCheckedChange={(checked) => handleEligibilityChange("disabled", checked as boolean)}
              />
              <Label htmlFor="eligibility-disabled">Persons with Disabilities</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Additional Filters</h3>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="income-level">Income Level</Label>
              <Select value={incomeLevel} onValueChange={setIncomeLevel}>
                <SelectTrigger id="income-level">
                  <SelectValue placeholder="Any income level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any income level</SelectItem>
                  <SelectItem value="below-poverty-line">Below Poverty Line</SelectItem>
                  <SelectItem value="low-income">Low Income</SelectItem>
                  <SelectItem value="middle-income">Middle Income</SelectItem>
                  <SelectItem value="high-income">High Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age-filter">Age Range</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="min-age-filter"
                  type="number"
                  placeholder="Min age"
                  value={minAge}
                  onChange={(e) => setMinAge(e.target.value)}
                  min="0"
                  max="120"
                  className="w-1/2"
                />
                <span>to</span>
                <Input
                  id="max-age-filter"
                  type="number"
                  placeholder="Max age"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  min="0"
                  max="120"
                  className="w-1/2"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location/State</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Any location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any location</SelectItem>
                  <SelectItem value="national">National</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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

