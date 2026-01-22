"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type FormData = {
    gender: string
    age: string
    state: string
    residenceArea: string
    socialCategory: string[]
    differentlyAbled: string
    disabilityPercentage: string
    minority: string
    student: string
    bpl: string
}

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh"
]

export function EligibilityForm() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<FormData>({
        gender: "",
        age: "",
        state: "",
        residenceArea: "",
        socialCategory: [],
        differentlyAbled: "",
        disabilityPercentage: "",
        minority: "",
        student: "",
        bpl: ""
    })

    const totalSteps = 6

    const updateFormData = (field: keyof FormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const toggleCategory = (category: string) => {
        setFormData(prev => ({
            ...prev,
            socialCategory: prev.socialCategory.includes(category)
                ? prev.socialCategory.filter(c => c !== category)
                : [...prev.socialCategory, category]
        }))
    }

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleReset = () => {
        setFormData({
            gender: "",
            age: "",
            state: "",
            residenceArea: "",
            socialCategory: [],
            differentlyAbled: "",
            disabilityPercentage: "",
            minority: "",
            student: "",
            bpl: ""
        })
        setCurrentStep(1)
    }

    const handleSubmit = () => {
        const params = new URLSearchParams()

        if (formData.gender) params.append("gender", formData.gender)
        if (formData.age) params.append("age", formData.age)
        if (formData.state) params.append("state", formData.state)
        if (formData.residenceArea) params.append("residence", formData.residenceArea)
        if (formData.socialCategory.length > 0) params.append("category", formData.socialCategory.join(","))
        if (formData.differentlyAbled === "Yes") params.append("differently_abled", "Yes")
        if (formData.minority === "Yes") params.append("minority", "Yes")
        if (formData.student === "Yes") params.append("student", "Yes")
        if (formData.bpl === "Yes") params.append("bpl", "Yes")

        router.push(`/schemes?${params.toString()}`)
    }

    const handleSkipToResults = () => {
        // Build query parameters from currently filled form data
        const params = new URLSearchParams()

        if (formData.gender) params.append("gender", formData.gender)
        if (formData.age) params.append("age", formData.age)
        if (formData.state) params.append("state", formData.state)
        if (formData.residenceArea) params.append("residence", formData.residenceArea)
        if (formData.socialCategory.length > 0) params.append("category", formData.socialCategory.join(","))
        if (formData.differentlyAbled === "Yes") params.append("differently_abled", "Yes")
        if (formData.minority === "Yes") params.append("minority", "Yes")
        if (formData.student === "Yes") params.append("student", "Yes")
        if (formData.bpl === "Yes") params.append("bpl", "Yes")

        // Redirect with filters applied
        const queryString = params.toString()
        router.push(queryString ? `/schemes?${queryString}` : "/schemes")
    }

    const ToggleButton = ({
        active,
        onClick,
        children
    }: {
        active: boolean
        onClick: () => void
        children: React.ReactNode
    }) => (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "px-6 py-3 rounded-lg border-2 transition-all duration-200 font-medium",
                active
                    ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/20"
                    : "bg-card border-border hover:border-primary/50 hover:bg-primary/5"
            )}
        >
            {children}
        </button>
    )

    return (
        <Card className="w-full max-w-5xl mx-auto overflow-hidden bg-card border-border shadow-xl">
            <div className="grid md:grid-cols-2 min-h-[500px]">
                {/* Left Section - Static */}
                <div className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-primary/10 flex flex-col justify-between border-r border-border">
                    <div className="space-y-6">
                        <div className="flex justify-center mb-8">
                            <div className="w-24 h-24 rounded-full border-2 border-primary/30 flex items-center justify-center bg-primary/5">
                                <div className="w-16 h-16 rounded-full border-2 border-primary/50 flex items-center justify-center bg-primary/10">
                                    <div className="w-8 h-8 rounded-full bg-primary/30"></div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                                Find The Best Schemes For You In 6 Steps
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                {currentStep} of {totalSteps} steps completed
                            </p>
                        </div>

                        {/* Progress Indicator */}
                        <div className="flex justify-center items-center gap-2">
                            {Array.from({ length: totalSteps }).map((_, index) => {
                                const stepNumber = index + 1
                                const isCompleted = stepNumber < currentStep
                                const isCurrent = stepNumber === currentStep

                                return (
                                    <div key={stepNumber} className="flex items-center">
                                        <div
                                            className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                                                isCompleted && "bg-primary text-primary-foreground shadow-md shadow-primary/30",
                                                isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                                                !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                                        </div>
                                        {stepNumber < totalSteps && (
                                            <div className={cn(
                                                "w-8 h-0.5",
                                                stepNumber < currentStep ? "bg-primary" : "bg-border"
                                            )} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <span>Powered by:</span>
                        <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary font-medium">Sayan</span>
                    </div>
                </div>

                {/* Right Section - Dynamic Form */}
                <div className="p-8 md:p-12 bg-background">
                    <div className="space-y-6">
                        <p className="text-xs text-muted-foreground">Required fields are marked with an asterisk (*)</p>

                        {/* Step 1: Gender and Age */}
                        {currentStep === 1 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="space-y-3">
                                    <Label>*Select your gender</Label>
                                    <div className="flex gap-3">
                                        <ToggleButton
                                            active={formData.gender === "Male"}
                                            onClick={() => updateFormData("gender", "Male")}
                                        >
                                            Male
                                        </ToggleButton>
                                        <ToggleButton
                                            active={formData.gender === "Female"}
                                            onClick={() => updateFormData("gender", "Female")}
                                        >
                                            Female
                                        </ToggleButton>
                                        <ToggleButton
                                            active={formData.gender === "Transgender"}
                                            onClick={() => updateFormData("gender", "Transgender")}
                                        >
                                            Transgender
                                        </ToggleButton>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label>*Select your age</Label>
                                    <Select value={formData.age} onValueChange={(value) => updateFormData("age", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Age--" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0-18">0-18 years</SelectItem>
                                            <SelectItem value="18-25">18-25 years</SelectItem>
                                            <SelectItem value="25-35">25-35 years</SelectItem>
                                            <SelectItem value="35-45">35-45 years</SelectItem>
                                            <SelectItem value="45-60">45-60 years</SelectItem>
                                            <SelectItem value="60+">60+ years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {/* Step 2: State and Residence */}
                        {currentStep === 2 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="space-y-3">
                                    <Label>*Select your state</Label>
                                    <Select value={formData.state} onValueChange={(value) => updateFormData("state", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select state--" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-60">
                                            {INDIAN_STATES.map(state => (
                                                <SelectItem key={state} value={state}>{state}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-3">
                                    <Label>*Area of residence</Label>
                                    <div className="flex gap-3">
                                        <ToggleButton
                                            active={formData.residenceArea === "Rural"}
                                            onClick={() => updateFormData("residenceArea", "Rural")}
                                        >
                                            Rural
                                        </ToggleButton>
                                        <ToggleButton
                                            active={formData.residenceArea === "Urban"}
                                            onClick={() => updateFormData("residenceArea", "Urban")}
                                        >
                                            Urban
                                        </ToggleButton>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Social Category */}
                        {currentStep === 3 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="space-y-3">
                                    <Label>*Select your social category (can select multiple)</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {["SC", "ST", "OBC", "General", "PVTG", "DNT"].map(category => (
                                            <ToggleButton
                                                key={category}
                                                active={formData.socialCategory.includes(category)}
                                                onClick={() => toggleCategory(category)}
                                            >
                                                {category}
                                            </ToggleButton>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Disability and Minority */}
                        {currentStep === 4 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="space-y-3">
                                    <Label>*Are you differently abled?</Label>
                                    <div className="flex gap-3">
                                        <ToggleButton
                                            active={formData.differentlyAbled === "Yes"}
                                            onClick={() => updateFormData("differentlyAbled", "Yes")}
                                        >
                                            Yes
                                        </ToggleButton>
                                        <ToggleButton
                                            active={formData.differentlyAbled === "No"}
                                            onClick={() => updateFormData("differentlyAbled", "No")}
                                        >
                                            No
                                        </ToggleButton>
                                    </div>
                                </div>

                                {formData.differentlyAbled === "Yes" && (
                                    <div className="space-y-3 animate-fadeIn">
                                        <Label>*What is your differently abled percentage?</Label>
                                        <Select
                                            value={formData.disabilityPercentage}
                                            onValueChange={(value) => updateFormData("disabilityPercentage", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select percentage--" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="<40%">Less than 40%</SelectItem>
                                                <SelectItem value="40-59%">40-59%</SelectItem>
                                                <SelectItem value="60-79%">60-79%</SelectItem>
                                                <SelectItem value="80%+">80% or more</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <Label>*Are you a minority?</Label>
                                    <div className="flex gap-3">
                                        <ToggleButton
                                            active={formData.minority === "Yes"}
                                            onClick={() => updateFormData("minority", "Yes")}
                                        >
                                            Yes
                                        </ToggleButton>
                                        <ToggleButton
                                            active={formData.minority === "No"}
                                            onClick={() => updateFormData("minority", "No")}
                                        >
                                            No
                                        </ToggleButton>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Student Status */}
                        {currentStep === 5 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="space-y-3">
                                    <Label>*Are you a student?</Label>
                                    <div className="flex gap-3">
                                        <ToggleButton
                                            active={formData.student === "Yes"}
                                            onClick={() => updateFormData("student", "Yes")}
                                        >
                                            Yes
                                        </ToggleButton>
                                        <ToggleButton
                                            active={formData.student === "No"}
                                            onClick={() => updateFormData("student", "No")}
                                        >
                                            No
                                        </ToggleButton>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 6: BPL Status */}
                        {currentStep === 6 && (
                            <div className="space-y-6 animate-fadeIn">
                                <div className="space-y-3">
                                    <Label>*Are you from a BPL (Below Poverty Line) category?</Label>
                                    <div className="flex gap-3">
                                        <ToggleButton
                                            active={formData.bpl === "Yes"}
                                            onClick={() => updateFormData("bpl", "Yes")}
                                        >
                                            Yes
                                        </ToggleButton>
                                        <ToggleButton
                                            active={formData.bpl === "No"}
                                            onClick={() => updateFormData("bpl", "No")}
                                        >
                                            No
                                        </ToggleButton>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-6">
                            <div className="flex gap-2">
                                {currentStep > 1 && (
                                    <Button
                                        variant="ghost"
                                        onClick={handleBack}
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    onClick={handleReset}
                                    size="sm"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Reset
                                </Button>
                            </div>

                            <div className="flex gap-2">
                                {currentStep >= 2 && (
                                    <Button
                                        variant="outline"
                                        onClick={handleSkipToResults}
                                    >
                                        Skip To Results
                                    </Button>
                                )}
                                {currentStep < totalSteps ? (
                                    <Button
                                        onClick={handleNext}
                                        className="btn-hover-effect group"
                                    >
                                        Next
                                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        className="btn-hover-effect group"
                                    >
                                        Find Schemes
                                        <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
