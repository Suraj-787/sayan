"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Bookmark, BookmarkCheck, Volume2, VolumeX } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type SchemeActionsProps = {
  scheme: {
    id: string
    title: string
    description: string
  }
}

export function SchemeActions({ scheme }: SchemeActionsProps) {
  const [bookmarked, setBookmarked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleBookmark = () => {
    setBookmarked(!bookmarked)

    if (!bookmarked) {
      toast({
        title: "Scheme Bookmarked",
        description: `${scheme.title} has been added to your bookmarks.`,
      })
    } else {
      toast({
        title: "Bookmark Removed",
        description: `${scheme.title} has been removed from your bookmarks.`,
      })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: scheme.title,
          text: scheme.description,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Scheme link copied to clipboard.",
      })
    }
  }

  const toggleVoiceAssistant = () => {
    setIsPlaying(!isPlaying)

    if (!isPlaying) {
      // In a real app, this would use Sarvam TTS to read the scheme details
      toast({
        title: "Voice Assistant",
        description: "Reading scheme details...",
      })
    } else {
      toast({
        title: "Voice Assistant Stopped",
        description: "Stopped reading scheme details.",
      })
    }
  }

  return (
    <Card className="border border-primary/20 animate-fadeIn">
      <CardHeader className="bg-primary/5">
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300"
            onClick={handleBookmark}
          >
            {bookmarked ? (
              <>
                <BookmarkCheck className="h-4 w-4" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        <div>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-primary/20 text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300"
            onClick={toggleVoiceAssistant}
          >
            {isPlaying ? (
              <>
                <VolumeX className="h-4 w-4" />
                Stop Voice Assistant
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4" />
                Listen with Voice Assistant
              </>
            )}
          </Button>
          <p className="text-xs text-foreground/60 mt-2 text-center">Uses AI to read scheme details aloud</p>
        </div>

        <Tabs defaultValue="apply" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-primary/10">
            <TabsTrigger
              value="apply"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              How to Apply
            </TabsTrigger>
            <TabsTrigger
              value="eligibility"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Check Eligibility
            </TabsTrigger>
          </TabsList>
          <TabsContent value="apply" className="space-y-4 pt-4">
            <h3 className="font-medium text-foreground">Application Steps</h3>
            <ol className="list-decimal pl-5 space-y-2 text-foreground/80">
              <li>Visit the official website</li>
              <li>Register with your details</li>
              <li>Fill the application form</li>
              <li>Upload required documents</li>
              <li>Submit and track your application</li>
            </ol>
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90 btn-hover-effect" asChild>
              <a href={`https://example.gov.in/apply/${scheme.id}`} target="_blank" rel="noopener noreferrer">
                Apply Now
              </a>
            </Button>
          </TabsContent>
          <TabsContent value="eligibility" className="space-y-4 pt-4">
            <h3 className="font-medium text-foreground">Eligibility Criteria</h3>
            <ul className="list-disc pl-5 space-y-2 text-foreground/80">
              <li>Indian citizen</li>
              <li>Age between 18-60 years</li>
              <li>Income below ₹2.5 lakhs per annum</li>
              <li>Must have valid identification documents</li>
            </ul>
            <Button
              className="w-full mt-4 border-primary text-primary hover:bg-primary/10 hover:text-primary"
              variant="outline"
              asChild
            >
              <a
                href={`https://example.gov.in/check-eligibility/${scheme.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Check Detailed Eligibility
              </a>
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

