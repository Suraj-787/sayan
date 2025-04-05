"use client";

import { PreferencesForm } from "@/components/auth/preferences-form";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function PreferencesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    console.log("Preferences page loaded", { user, loading });
    
    // Redirect if no user after loading is complete
    if (!loading && !user) {
      console.log("No user found, redirecting to login");
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <div className="container max-w-4xl py-12 md:py-24">
      <PreferencesForm />
    </div>
  );
} 