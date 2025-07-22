"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function PreferencesForm() {
  const { user, updatePreferences, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state matching the enhanced filter options
  const [categories, setCategories] = useState<string[]>([]);
  const [eligibility, setEligibility] = useState<string[]>([]);
  const [schemeTypes, setSchemeTypes] = useState<string[]>([]);
  const [incomeLevel, setIncomeLevel] = useState<string>("any");
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [location, setLocation] = useState<string>("any");
  const [occupation, setOccupation] = useState<string>("");

  // Initialize form with user preferences if available
  useEffect(() => {
    if (user && user.preferences) {
      setCategories(user.preferences.categories || []);
      setEligibility(user.preferences.eligibility || []);
      setSchemeTypes(user.preferences.scheme_types || []);
      setIncomeLevel(user.preferences.income_level || "any");
      setMinAge(user.preferences.min_age ? user.preferences.min_age.toString() : "");
      setMaxAge(user.preferences.max_age ? user.preferences.max_age.toString() : "");
      setLocation(user.preferences.location || "any");
      setOccupation(user.preferences.occupation || "");
    }
  }, [user]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setCategories([...categories, category]);
    } else {
      setCategories(categories.filter((c) => c !== category));
    }
    if (error) setError(null);
  };

  const handleEligibilityChange = (eligibilityType: string, checked: boolean) => {
    if (checked) {
      setEligibility([...eligibility, eligibilityType]);
    } else {
      setEligibility(eligibility.filter((e) => e !== eligibilityType));
    }
    if (error) setError(null);
  };

  const handleSchemeTypeChange = (schemeType: string, checked: boolean) => {
    if (checked) {
      setSchemeTypes([...schemeTypes, schemeType]);
    } else {
      setSchemeTypes(schemeTypes.filter((s) => s !== schemeType));
    }
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    
    try {
      await updatePreferences({
        categories,
        eligibility,
        scheme_types: schemeTypes,
        income_level: incomeLevel !== "any" ? incomeLevel : undefined,
        min_age: minAge ? parseInt(minAge, 10) : undefined,
        max_age: maxAge ? parseInt(maxAge, 10) : undefined,
        location: location !== "any" ? location : undefined,
        occupation: occupation || undefined
      });
      
      const successMsg = "Preferences saved successfully! Redirecting...";
      setSuccess(successMsg);
      toast.success(successMsg);
      
      // Apply preferences to filters when navigating to schemes
      setTimeout(() => {
        const params = new URLSearchParams();
        
        if (categories.length > 0) {
          params.set("category", categories.join(","));
        }
        if (eligibility.length > 0) {
          params.set("eligibility", eligibility.join(","));
        }
        if (schemeTypes.length > 0) {
          params.set("scheme_types", schemeTypes.join(","));
        }
        if (incomeLevel && incomeLevel !== "any") {
          params.set("income_level", incomeLevel);
        }
        if (minAge) {
          params.set("min_age", minAge);
        }
        if (maxAge) {
          params.set("max_age", maxAge);
        }
        if (location && location !== "any") {
          params.set("location", location);
        }
        
        params.set("use_preferences", "true");
        
        const queryString = params.toString();
        router.push("/");
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.message || "Failed to save preferences. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Your Preferences</CardTitle>
        <CardDescription>
          Customize your profile to get personalized scheme recommendations. These preferences will be automatically applied as filters.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Success Alert */}
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Categories of Interest</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Traditional Categories */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-agriculture"
                  checked={categories.includes("Agriculture")}
                  onCheckedChange={(checked) => handleCategoryChange("Agriculture", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-agriculture">Agriculture</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-education"
                  checked={categories.includes("Education")}
                  onCheckedChange={(checked) => handleCategoryChange("Education", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-education">Education</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-health"
                  checked={categories.includes("Health") || categories.includes("Healthcare")}
                  onCheckedChange={(checked) => {
                    handleCategoryChange("Health", checked as boolean);
                    handleCategoryChange("Healthcare", checked as boolean);
                  }}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-health">Health & Healthcare</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-finance"
                  checked={categories.includes("Finance")}
                  onCheckedChange={(checked) => handleCategoryChange("Finance", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-finance">Finance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-housing"
                  checked={categories.includes("Housing")}
                  onCheckedChange={(checked) => handleCategoryChange("Housing", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-housing">Housing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-employment"
                  checked={categories.includes("Employment")}
                  onCheckedChange={(checked) => handleCategoryChange("Employment", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-employment">Employment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-skill-development"
                  checked={categories.includes("Skill Development")}
                  onCheckedChange={(checked) => handleCategoryChange("Skill Development", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-skill-development">Skill Development</Label>
              </div>
              
              {/* New Categories from Enhanced Filter */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-technology"
                  checked={categories.includes("Technology")}
                  onCheckedChange={(checked) => handleCategoryChange("Technology", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-technology">Technology</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-digital-infrastructure"
                  checked={categories.includes("Digital Infrastructure") || categories.includes("Digital Services")}
                  onCheckedChange={(checked) => {
                    handleCategoryChange("Digital Infrastructure", checked as boolean);
                    handleCategoryChange("Digital Services", checked as boolean);
                  }}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-digital-infrastructure">Digital Infrastructure</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-environment"
                  checked={categories.includes("Environment")}
                  onCheckedChange={(checked) => handleCategoryChange("Environment", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-environment">Environment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-transportation"
                  checked={categories.includes("Transportation")}
                  onCheckedChange={(checked) => handleCategoryChange("Transportation", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-transportation">Transportation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-infrastructure"
                  checked={categories.includes("Infrastructure")}
                  onCheckedChange={(checked) => handleCategoryChange("Infrastructure", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-infrastructure">Infrastructure</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-food-security"
                  checked={categories.includes("Food Security")}
                  onCheckedChange={(checked) => handleCategoryChange("Food Security", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-food-security">Food Security</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-regional-development"
                  checked={categories.includes("Regional Development")}
                  onCheckedChange={(checked) => handleCategoryChange("Regional Development", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-regional-development">Regional Development</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-sanitation"
                  checked={categories.includes("Sanitation")}
                  onCheckedChange={(checked) => handleCategoryChange("Sanitation", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-sanitation">Sanitation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-energy"
                  checked={categories.includes("Energy")}
                  onCheckedChange={(checked) => handleCategoryChange("Energy", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="category-energy">Energy</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Eligibility */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Eligibility</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eligibility-students"
                  checked={eligibility.includes("students")}
                  onCheckedChange={(checked) => handleEligibilityChange("students", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="eligibility-students">Students</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eligibility-farmers"
                  checked={eligibility.includes("farmers")}
                  onCheckedChange={(checked) => handleEligibilityChange("farmers", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="eligibility-farmers">Farmers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eligibility-women"
                  checked={eligibility.includes("women")}
                  onCheckedChange={(checked) => handleEligibilityChange("women", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="eligibility-women">Women</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eligibility-senior-citizens"
                  checked={eligibility.includes("senior-citizens")}
                  onCheckedChange={(checked) => handleEligibilityChange("senior-citizens", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="eligibility-senior-citizens">Senior Citizens</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eligibility-rural"
                  checked={eligibility.includes("rural")}
                  onCheckedChange={(checked) => handleEligibilityChange("rural", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="eligibility-rural">Rural Residents</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eligibility-disabled"
                  checked={eligibility.includes("disabled")}
                  onCheckedChange={(checked) => handleEligibilityChange("disabled", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="eligibility-disabled">Persons with Disabilities</Label>
              </div>
              
              {/* New eligibility categories based on enhanced filters */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eligibility-entrepreneurs"
                  checked={eligibility.includes("entrepreneurs")}
                  onCheckedChange={(checked) => handleEligibilityChange("entrepreneurs", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="eligibility-entrepreneurs">Entrepreneurs & Startups</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eligibility-government-employees"
                  checked={eligibility.includes("government-employees")}
                  onCheckedChange={(checked) => handleEligibilityChange("government-employees", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="eligibility-government-employees">Government Employees</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eligibility-street-vendors"
                  checked={eligibility.includes("street-vendors")}
                  onCheckedChange={(checked) => handleEligibilityChange("street-vendors", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="eligibility-street-vendors">Street Vendors</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eligibility-artisans"
                  checked={eligibility.includes("artisans")}
                  onCheckedChange={(checked) => handleEligibilityChange("artisans", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="eligibility-artisans">Traditional Artisans</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eligibility-youth"
                  checked={eligibility.includes("youth")}
                  onCheckedChange={(checked) => handleEligibilityChange("youth", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="eligibility-youth">Youth (15-29 years)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eligibility-self-help-groups"
                  checked={eligibility.includes("self-help-groups")}
                  onCheckedChange={(checked) => handleEligibilityChange("self-help-groups", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="eligibility-self-help-groups">Self Help Groups</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Scheme Types */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Preferred Scheme Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scheme-type-insurance"
                  checked={schemeTypes.includes("insurance")}
                  onCheckedChange={(checked) => handleSchemeTypeChange("insurance", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="scheme-type-insurance">Insurance & Coverage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scheme-type-loans"
                  checked={schemeTypes.includes("loans")}
                  onCheckedChange={(checked) => handleSchemeTypeChange("loans", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="scheme-type-loans">Loans & Credit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scheme-type-subsidies"
                  checked={schemeTypes.includes("subsidies")}
                  onCheckedChange={(checked) => handleSchemeTypeChange("subsidies", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="scheme-type-subsidies">Subsidies & Cash Benefits</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scheme-type-training"
                  checked={schemeTypes.includes("training")}
                  onCheckedChange={(checked) => handleSchemeTypeChange("training", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="scheme-type-training">Training & Skill Development</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scheme-type-infrastructure"
                  checked={schemeTypes.includes("infrastructure")}
                  onCheckedChange={(checked) => handleSchemeTypeChange("infrastructure", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="scheme-type-infrastructure">Infrastructure Development</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scheme-type-pension"
                  checked={schemeTypes.includes("pension")}
                  onCheckedChange={(checked) => handleSchemeTypeChange("pension", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="scheme-type-pension">Pension & Social Security</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scheme-type-scholarship"
                  checked={schemeTypes.includes("scholarship")}
                  onCheckedChange={(checked) => handleSchemeTypeChange("scholarship", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="scheme-type-scholarship">Scholarships & Education</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="scheme-type-healthcare"
                  checked={schemeTypes.includes("healthcare")}
                  onCheckedChange={(checked) => handleSchemeTypeChange("healthcare", checked as boolean)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="scheme-type-healthcare">Healthcare Services</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Additional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="income-level">Income Level</Label>
                <Select 
                  value={incomeLevel} 
                  onValueChange={setIncomeLevel}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="income-level">
                    <SelectValue placeholder="Select income level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Income Level</SelectItem>
                    <SelectItem value="below-poverty-line">Below Poverty Line</SelectItem>
                    <SelectItem value="low-income">Low Income</SelectItem>
                    <SelectItem value="middle-income">Middle Income</SelectItem>
                    <SelectItem value="high-income">High Income</SelectItem>
                    <SelectItem value="economically-weaker">Economically Weaker Section</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age-range">Age Range</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="min-age"
                    type="number"
                    placeholder="Min age"
                    value={minAge}
                    onChange={(e) => {
                      setMinAge(e.target.value);
                      if (error) setError(null);
                    }}
                    min="0"
                    max="120"
                    className="w-1/2"
                    disabled={isSubmitting}
                  />
                  <span>to</span>
                  <Input
                    id="max-age"
                    type="number"
                    placeholder="Max age"
                    value={maxAge}
                    onChange={(e) => {
                      setMaxAge(e.target.value);
                      if (error) setError(null);
                    }}
                    min="0"
                    max="120"
                    className="w-1/2"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location/State</Label>
                <Select 
                  value={location} 
                  onValueChange={setLocation}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any Location</SelectItem>
                    <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                    <SelectItem value="Assam">Assam</SelectItem>
                    <SelectItem value="Bihar">Bihar</SelectItem>
                    <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                    <SelectItem value="Goa">Goa</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                    <SelectItem value="Haryana">Haryana</SelectItem>
                    <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                    <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                    <SelectItem value="Kerala">Kerala</SelectItem>
                    <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Manipur">Manipur</SelectItem>
                    <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                    <SelectItem value="Mizoram">Mizoram</SelectItem>
                    <SelectItem value="Nagaland">Nagaland</SelectItem>
                    <SelectItem value="Odisha">Odisha</SelectItem>
                    <SelectItem value="Punjab">Punjab</SelectItem>
                    <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="Sikkim">Sikkim</SelectItem>
                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="Telangana">Telangana</SelectItem>
                    <SelectItem value="Tripura">Tripura</SelectItem>
                    <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                    <SelectItem value="West Bengal">West Bengal</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
                    <SelectItem value="Ladakh">Ladakh</SelectItem>
                    <SelectItem value="All India">All India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  placeholder="Enter your occupation"
                  value={occupation}
                  onChange={(e) => {
                    setOccupation(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => router.push("/")}
            disabled={isSubmitting}
          >
            Skip for Now
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving Preferences..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}