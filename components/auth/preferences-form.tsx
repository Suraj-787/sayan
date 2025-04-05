"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PreferencesForm() {
  const { user, updatePreferences, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Category preferences
  const [categories, setCategories] = useState<string[]>([]);
  const [eligibility, setEligibility] = useState<string[]>([]);
  const [incomeLevel, setIncomeLevel] = useState<string>("none");
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [occupation, setOccupation] = useState<string>("");

  // Initialize form with user preferences if available
  useEffect(() => {
    if (user && user.preferences) {
      setCategories(user.preferences.categories || []);
      setEligibility(user.preferences.eligibility || []);
      setIncomeLevel(user.preferences.income_level || "none");
      setMinAge(user.preferences.min_age ? user.preferences.min_age.toString() : "");
      setMaxAge(user.preferences.max_age ? user.preferences.max_age.toString() : "");
      setLocation(user.preferences.location || "");
      setOccupation(user.preferences.occupation || "");
    }
  }, [user]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setCategories([...categories, category]);
    } else {
      setCategories(categories.filter((c) => c !== category));
    }
  };

  const handleEligibilityChange = (eligibilityType: string, checked: boolean) => {
    if (checked) {
      setEligibility([...eligibility, eligibilityType]);
    } else {
      setEligibility(eligibility.filter((e) => e !== eligibilityType));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updatePreferences({
        categories,
        eligibility,
        income_level: incomeLevel !== "none" ? incomeLevel : undefined,
        min_age: minAge ? parseInt(minAge, 10) : undefined,
        max_age: maxAge ? parseInt(maxAge, 10) : undefined,
        location: location || undefined,
        occupation: occupation || undefined
      });
      
      toast.success("Preferences updated successfully");
      router.push("/schemes");
    } catch (error: any) {
      toast.error(error.message || "Failed to update preferences");
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
          Customize your profile to get personalized scheme recommendations
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Categories of Interest</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="category-environment"
                  checked={categories.includes("environment")}
                  onCheckedChange={(checked) => handleCategoryChange("environment", checked as boolean)}
                />
                <Label htmlFor="category-environment">Environment</Label>
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
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eligibility-entrepreneurs"
                  checked={eligibility.includes("entrepreneurs")}
                  onCheckedChange={(checked) => handleEligibilityChange("entrepreneurs", checked as boolean)}
                />
                <Label htmlFor="eligibility-entrepreneurs">Entrepreneurs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="eligibility-minority"
                  checked={eligibility.includes("minority")}
                  onCheckedChange={(checked) => handleEligibilityChange("minority", checked as boolean)}
                />
                <Label htmlFor="eligibility-minority">Minority Groups</Label>
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
                <Select value={incomeLevel} onValueChange={setIncomeLevel}>
                  <SelectTrigger id="income-level">
                    <SelectValue placeholder="Select income level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No preference</SelectItem>
                    <SelectItem value="below-poverty-line">Below Poverty Line</SelectItem>
                    <SelectItem value="low-income">Low Income</SelectItem>
                    <SelectItem value="middle-income">Middle Income</SelectItem>
                    <SelectItem value="high-income">High Income</SelectItem>
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
                    onChange={(e) => setMinAge(e.target.value)}
                    min="0"
                    max="120"
                    className="w-1/2"
                  />
                  <span>to</span>
                  <Input
                    id="max-age"
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
                <Input
                  id="location"
                  placeholder="Enter your state or region"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input
                  id="occupation"
                  placeholder="Enter your occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => router.push("/schemes")}>
            Skip for Now
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 