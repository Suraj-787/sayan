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
  schemeTypes: string[]
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

  // Helper function to check if user has any meaningful preferences
  const hasUserPreferences = (user: any) => {
    if (!user?.preferences) return false;

    const prefs = user.preferences;
    return (
      (prefs.categories && prefs.categories.length > 0) ||
      (prefs.eligibility && prefs.eligibility.length > 0) ||
      (prefs.scheme_types && prefs.scheme_types.length > 0) ||
      (prefs.income_level && prefs.income_level !== "any") ||
      prefs.min_age ||
      prefs.max_age ||
      (prefs.location && prefs.location !== "any") ||
      prefs.occupation
    );
  };

  // Get initial filter values from URL
  const initialCategory = searchParams.get("category")?.split(",") || []
  const initialEligibility = searchParams.get("eligibility")?.split(",") || []
  const initialSchemeTypes = searchParams.get("scheme_types")?.split(",") || []
  const initialIncomeLevel = searchParams.get("income_level") || "any"
  const initialMinAge = searchParams.get("min_age") || ""
  const initialMaxAge = searchParams.get("max_age") || ""
  const initialLocation = searchParams.get("location") || "any"
  const initialUsePreferences = searchParams.get("use_preferences") === "true"

  const [categories, setCategories] = useState<string[]>(initialCategory)
  const [eligibility, setEligibility] = useState<string[]>(initialEligibility)
  const [schemeTypes, setSchemeTypes] = useState<string[]>(initialSchemeTypes)
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
          !searchParams.has("scheme_types") &&
          !searchParams.has("income_level") &&
          !searchParams.has("min_age") &&
          !searchParams.has("max_age") &&
          !searchParams.has("location");

        if (noUrlFilters || savedPrefs.usePreferences) {
          setCategories(savedPrefs.categories);
          setEligibility(savedPrefs.eligibility);
          setSchemeTypes(savedPrefs.schemeTypes || []);
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
              savedPrefs.schemeTypes || [],
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
        schemeTypes,
        incomeLevel,
        minAge,
        maxAge,
        location,
        usePreferences
      };

      saveFilterPreferences(user.id, currentPrefs);
    }
  }, [categories, eligibility, schemeTypes, incomeLevel, minAge, maxAge, location, usePreferences, user, filtersLoaded]);

  // Apply user preferences when toggled
  useEffect(() => {
    if (usePreferences && user?.preferences && hasUserPreferences(user)) {
      // Apply user preferences when toggle is ON
      const prefCategories = user.preferences.categories || []
      const prefEligibility = user.preferences.eligibility || []
      const prefSchemeTypes = user.preferences.scheme_types || []
      const prefIncomeLevel = user.preferences.income_level || "any"
      const prefMinAge = user.preferences.min_age ? user.preferences.min_age.toString() : ""
      const prefMaxAge = user.preferences.max_age ? user.preferences.max_age.toString() : ""
      const prefLocation = user.preferences.location || "any"

      setCategories(prefCategories)
      setEligibility(prefEligibility)
      setSchemeTypes(prefSchemeTypes)
      setIncomeLevel(prefIncomeLevel)
      setMinAge(prefMinAge)
      setMaxAge(prefMaxAge)
      setLocation(prefLocation)

      // Apply filters to URL immediately
      applyFiltersToUrl(
        prefCategories,
        prefEligibility,
        prefSchemeTypes,
        prefIncomeLevel,
        prefMinAge,
        prefMaxAge,
        prefLocation,
        true
      );
    } else if (!usePreferences && filtersLoaded) {
      // Clear all filters when toggle is OFF
      setCategories([])
      setEligibility([])
      setSchemeTypes([])
      setIncomeLevel("any")
      setMinAge("")
      setMaxAge("")
      setLocation("any")

      // Apply cleared filters to URL
      applyFiltersToUrl(
        [],
        [],
        [],
        "any",
        "",
        "",
        "any",
        false
      );
    }
  }, [usePreferences, user, filtersLoaded])

  // Auto-disable toggle if user has no preferences
  useEffect(() => {
    if (user && !hasUserPreferences(user) && usePreferences) {
      setUsePreferences(false);
    }
  }, [user, usePreferences])

  // Auto-apply filters when any filter changes
  useEffect(() => {
    // Only auto-apply if filters have been loaded and we're not in the initial load
    if (filtersLoaded) {
      applyFiltersToUrl(
        categories,
        eligibility,
        schemeTypes,
        incomeLevel,
        minAge,
        maxAge,
        location,
        usePreferences
      );
    }
  }, [categories, eligibility, schemeTypes, incomeLevel, minAge, maxAge, location])

  const handleSchemeTypeChange = (schemeType: string, checked: boolean) => {
    if (checked) {
      setSchemeTypes([...schemeTypes, schemeType])
    } else {
      setSchemeTypes(schemeTypes.filter((s) => s !== schemeType))
    }
  }

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
    schemeTypes: string[],
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

    if (schemeTypes.length > 0) {
      params.set("scheme_types", schemeTypes.join(","))
    } else {
      params.delete("scheme_types")
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

  // Removed handleApplyFilters - filters now apply automatically

  const handleResetFilters = () => {
    setCategories([])
    setEligibility([])
    setSchemeTypes([])
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
        schemeTypes: [],
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
              disabled={!hasUserPreferences(user)}
            />
            <Label htmlFor="use-preferences" className={!hasUserPreferences(user) ? "text-gray-400" : ""}>
              Use my preferences
              {!hasUserPreferences(user) && " (No preferences saved)"}
              {usePreferences && hasUserPreferences(user) && " ✓"}
            </Label>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Categories</h3>
          <div className="space-y-2">
            {/* Traditional Categories */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-agriculture"
                checked={categories.includes("Agriculture")}
                onCheckedChange={(checked) => handleCategoryChange("Agriculture", checked as boolean)}
              />
              <Label htmlFor="category-agriculture">Agriculture</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-education"
                checked={categories.includes("Education")}
                onCheckedChange={(checked) => handleCategoryChange("Education", checked as boolean)}
              />
              <Label htmlFor="category-education">Education</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-health"
                checked={categories.includes("Health") || categories.includes("Healthcare")}
                onCheckedChange={(checked) => {
                  handleCategoryChange("Health", checked as boolean)
                  handleCategoryChange("Healthcare", checked as boolean)
                }}
              />
              <Label htmlFor="category-health">Health & Healthcare</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-finance"
                checked={categories.includes("Finance")}
                onCheckedChange={(checked) => handleCategoryChange("Finance", checked as boolean)}
              />
              <Label htmlFor="category-finance">Finance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-housing"
                checked={categories.includes("Housing")}
                onCheckedChange={(checked) => handleCategoryChange("Housing", checked as boolean)}
              />
              <Label htmlFor="category-housing">Housing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-employment"
                checked={categories.includes("Employment")}
                onCheckedChange={(checked) => handleCategoryChange("Employment", checked as boolean)}
              />
              <Label htmlFor="category-employment">Employment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-skill-development"
                checked={categories.includes("Skill Development")}
                onCheckedChange={(checked) => handleCategoryChange("Skill Development", checked as boolean)}
              />
              <Label htmlFor="category-skill-development">Skill Development</Label>
            </div>

            {/* New Categories from PDF */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-technology"
                checked={categories.includes("Technology")}
                onCheckedChange={(checked) => handleCategoryChange("Technology", checked as boolean)}
              />
              <Label htmlFor="category-technology">Technology</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-digital-infrastructure"
                checked={categories.includes("Digital Infrastructure") || categories.includes("Digital Services")}
                onCheckedChange={(checked) => {
                  handleCategoryChange("Digital Infrastructure", checked as boolean)
                  handleCategoryChange("Digital Services", checked as boolean)
                }}
              />
              <Label htmlFor="category-digital-infrastructure">Digital Infrastructure</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-environment"
                checked={categories.includes("Environment")}
                onCheckedChange={(checked) => handleCategoryChange("Environment", checked as boolean)}
              />
              <Label htmlFor="category-environment">Environment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-transportation"
                checked={categories.includes("Transportation")}
                onCheckedChange={(checked) => handleCategoryChange("Transportation", checked as boolean)}
              />
              <Label htmlFor="category-transportation">Transportation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-infrastructure"
                checked={categories.includes("Infrastructure")}
                onCheckedChange={(checked) => handleCategoryChange("Infrastructure", checked as boolean)}
              />
              <Label htmlFor="category-infrastructure">Infrastructure</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-food-security"
                checked={categories.includes("Food Security")}
                onCheckedChange={(checked) => handleCategoryChange("Food Security", checked as boolean)}
              />
              <Label htmlFor="category-food-security">Food Security</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-regional-development"
                checked={categories.includes("Regional Development")}
                onCheckedChange={(checked) => handleCategoryChange("Regional Development", checked as boolean)}
              />
              <Label htmlFor="category-regional-development">Regional Development</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-sanitation"
                checked={categories.includes("Sanitation")}
                onCheckedChange={(checked) => handleCategoryChange("Sanitation", checked as boolean)}
              />
              <Label htmlFor="category-sanitation">Sanitation</Label>
            </div>

            {/* Legacy Categories for backwards compatibility */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-energy"
                checked={categories.includes("Energy")}
                onCheckedChange={(checked) => handleCategoryChange("Energy", checked as boolean)}
              />
              <Label htmlFor="category-energy">Energy</Label>
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

            {/* New eligibility categories based on added schemes */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eligibility-entrepreneurs"
                checked={eligibility.includes("entrepreneurs")}
                onCheckedChange={(checked) => handleEligibilityChange("entrepreneurs", checked as boolean)}
              />
              <Label htmlFor="eligibility-entrepreneurs">Entrepreneurs & Startups</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eligibility-government-employees"
                checked={eligibility.includes("government-employees")}
                onCheckedChange={(checked) => handleEligibilityChange("government-employees", checked as boolean)}
              />
              <Label htmlFor="eligibility-government-employees">Government Employees</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eligibility-street-vendors"
                checked={eligibility.includes("street-vendors")}
                onCheckedChange={(checked) => handleEligibilityChange("street-vendors", checked as boolean)}
              />
              <Label htmlFor="eligibility-street-vendors">Street Vendors</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eligibility-artisans"
                checked={eligibility.includes("artisans")}
                onCheckedChange={(checked) => handleEligibilityChange("artisans", checked as boolean)}
              />
              <Label htmlFor="eligibility-artisans">Traditional Artisans</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eligibility-youth"
                checked={eligibility.includes("youth")}
                onCheckedChange={(checked) => handleEligibilityChange("youth", checked as boolean)}
              />
              <Label htmlFor="eligibility-youth">Youth (15-29 years)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="eligibility-self-help-groups"
                checked={eligibility.includes("self-help-groups")}
                onCheckedChange={(checked) => handleEligibilityChange("self-help-groups", checked as boolean)}
              />
              <Label htmlFor="eligibility-self-help-groups">Self Help Groups</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-medium">Scheme Type</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scheme-type-insurance"
                checked={schemeTypes.includes("insurance")}
                onCheckedChange={(checked) => handleSchemeTypeChange("insurance", checked as boolean)}
              />
              <Label htmlFor="scheme-type-insurance">Insurance & Coverage</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scheme-type-loans"
                checked={schemeTypes.includes("loans")}
                onCheckedChange={(checked) => handleSchemeTypeChange("loans", checked as boolean)}
              />
              <Label htmlFor="scheme-type-loans">Loans & Credit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scheme-type-subsidies"
                checked={schemeTypes.includes("subsidies")}
                onCheckedChange={(checked) => handleSchemeTypeChange("subsidies", checked as boolean)}
              />
              <Label htmlFor="scheme-type-subsidies">Subsidies & Cash Benefits</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scheme-type-training"
                checked={schemeTypes.includes("training")}
                onCheckedChange={(checked) => handleSchemeTypeChange("training", checked as boolean)}
              />
              <Label htmlFor="scheme-type-training">Training & Skill Development</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scheme-type-infrastructure"
                checked={schemeTypes.includes("infrastructure")}
                onCheckedChange={(checked) => handleSchemeTypeChange("infrastructure", checked as boolean)}
              />
              <Label htmlFor="scheme-type-infrastructure">Infrastructure Development</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scheme-type-pension"
                checked={schemeTypes.includes("pension")}
                onCheckedChange={(checked) => handleSchemeTypeChange("pension", checked as boolean)}
              />
              <Label htmlFor="scheme-type-pension">Pension & Social Security</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scheme-type-scholarship"
                checked={schemeTypes.includes("scholarship")}
                onCheckedChange={(checked) => handleSchemeTypeChange("scholarship", checked as boolean)}
              />
              <Label htmlFor="scheme-type-scholarship">Scholarships & Education Aid</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="scheme-type-technology"
                checked={schemeTypes.includes("technology")}
                onCheckedChange={(checked) => handleSchemeTypeChange("technology", checked as boolean)}
              />
              <Label htmlFor="scheme-type-technology">Technology & Innovation</Label>
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
                  <SelectItem value="below-poverty-line">Below Poverty Line (BPL)</SelectItem>
                  <SelectItem value="economically-weaker">Economically Weaker Section (EWS)</SelectItem>
                  <SelectItem value="low-income">Low Income (up to ₹2.5 lakhs)</SelectItem>
                  <SelectItem value="lower-middle">Lower Middle Income (₹2.5-6 lakhs)</SelectItem>
                  <SelectItem value="middle-income">Middle Income (₹6-18 lakhs)</SelectItem>
                  <SelectItem value="higher-middle">Higher Middle Income (₹18+ lakhs)</SelectItem>
                  <SelectItem value="no-income-limit">No Income Limit</SelectItem>
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
                  <SelectItem value="national">National (All India)</SelectItem>

                  {/* Union Territories */}
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="puducherry">Puducherry</SelectItem>
                  <SelectItem value="chandigarh">Chandigarh</SelectItem>

                  {/* Major States */}
                  <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                  <SelectItem value="bihar">Bihar</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                  <SelectItem value="himachal-pradesh">Himachal Pradesh</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="kerala">Kerala</SelectItem>
                  <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="odisha">Odisha</SelectItem>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="rajasthan">Rajasthan</SelectItem>
                  <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="telangana">Telangana</SelectItem>
                  <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="west-bengal">West Bengal</SelectItem>

                  {/* North Eastern States */}
                  <SelectItem value="north-east">North Eastern Region</SelectItem>
                  <SelectItem value="assam">Assam</SelectItem>
                  <SelectItem value="arunachal-pradesh">Arunachal Pradesh</SelectItem>
                  <SelectItem value="manipur">Manipur</SelectItem>
                  <SelectItem value="meghalaya">Meghalaya</SelectItem>
                  <SelectItem value="mizoram">Mizoram</SelectItem>
                  <SelectItem value="nagaland">Nagaland</SelectItem>
                  <SelectItem value="tripura">Tripura</SelectItem>
                  <SelectItem value="sikkim">Sikkim</SelectItem>

                  {/* Special Categories */}
                  <SelectItem value="rural-areas">Rural Areas</SelectItem>
                  <SelectItem value="urban-areas">Urban Areas</SelectItem>
                  <SelectItem value="tribal-areas">Tribal Areas</SelectItem>
                  <SelectItem value="coastal-areas">Coastal Areas</SelectItem>
                  <SelectItem value="aspirational-districts">Aspirational Districts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button variant="outline" onClick={handleResetFilters} className="w-full">
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

