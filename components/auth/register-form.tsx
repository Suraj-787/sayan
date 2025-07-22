"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register form submitted", { name, email });
    
    // Clear previous messages
    setError(null);
    setSuccess(null);
    
    if (!name || !email || !password || !confirmPassword) {
      const errorMsg = "Please fill in all fields";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    // Basic email validation
    if (!email.includes('@') || !email.includes('.')) {
      const errorMsg = "Please enter a valid email address";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    // Name validation
    if (name.trim().length < 2) {
      const errorMsg = "Name must be at least 2 characters long";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    if (password !== confirmPassword) {
      const errorMsg = "Passwords do not match";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    if (password.length < 6) {
      const errorMsg = "Password must be at least 6 characters long";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Attempting registration...");
      await register(name, email, password);
      console.log("Registration successful");
      
      const successMsg = "Account created successfully! Redirecting...";
      setSuccess(successMsg);
      toast.success(successMsg);
      
      // Use setTimeout to ensure the router navigation happens after state updates
      setTimeout(() => {
        router.push("/preferences");
      }, 1500); // Slightly longer to show success message
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMsg = error.message || "Registration failed. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple click handler for the button as a fallback
  const handleButtonClick = () => {
    if (!isSubmitting) {
      handleSubmit(new Event('submit') as any);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                // Clear error when user starts typing
                if (error) setError(null);
              }}
              required
              disabled={isSubmitting}
              className={error && error.includes('Name') ? 'border-red-500 focus:border-red-500' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Clear error when user starts typing
                if (error) setError(null);
              }}
              required
              disabled={isSubmitting}
              className={error && error.includes('email') ? 'border-red-500 focus:border-red-500' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                // Clear error when user starts typing
                if (error) setError(null);
              }}
              required
              disabled={isSubmitting}
              className={error && error.includes('Password') ? 'border-red-500 focus:border-red-500' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                // Clear error when user starts typing
                if (error) setError(null);
              }}
              required
              disabled={isSubmitting}
              className={error && error.includes('match') ? 'border-red-500 focus:border-red-500' : ''}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="button" 
            className="w-full" 
            disabled={isSubmitting}
            onClick={handleButtonClick}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
} 