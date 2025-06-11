
// Ensure this file is saved with a .tsx extension

"use client"; // Add "use client" if not already present for useState/useEffect

import { RegistrationWizard } from "@/components/tender-match-pro/registration-wizard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { useState, useEffect } from 'react'; // Import useState and useEffect

export default function TenderMatchProPage() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-background to-secondary">
      <div className="w-full max-w-4xl space-y-8">
        <header className="text-center space-y-2">
           <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-lg mb-4">
             <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                <line x1="12" y1="22" x2="12" y2="12"></line>
                <line x1="20" y1="12" x2="20" y2="17"></line>
                <line x1="4" y1="12" x2="4" y2="17"></line>
            </svg>
           </div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Welcome to TenderMatch Pro
          </h1>
          <p className="text-xl text-muted-foreground">
            Complete your company profile to get started.
          </p>
        </header>

        <Card className="w-full shadow-2xl overflow-hidden border-2 border-primary/20">
          <CardHeader className="bg-primary/5 p-6">
            <CardTitle className="text-2xl font-semibold text-primary">Company Profile Registration</CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Follow the steps below to build a comprehensive profile for your company.
              Your progress is saved automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <RegistrationWizard />
          </CardContent>
        </Card>
        
        <footer className="text-center text-sm text-muted-foreground mt-12">
          {currentYear !== null ? (
            `© ${currentYear} TenderMatch Pro. All rights reserved.`
          ) : (
            `© TenderMatch Pro. All rights reserved.` // Fallback text during SSR/initial client render
          )}
          <div className="mt-2">
            <Image src="https://placehold.co/150x50.png?text=PoweredByAI" alt="Powered by AI" width={150} height={50} data-ai-hint="logo ai" className="mx-auto opacity-75" />
          </div>
        </footer>
      </div>
    </main>
  );
}
