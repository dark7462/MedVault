'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, Share2, Settings, FileText, ScrollText, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import QRCode from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';
import { generateOtp } from '@/services/otp'; // Assuming this service exists

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [showQr, setShowQr] = useState(false);
  const [otp, setOtp] = useState<string | null>(null);
  const uniqueUsername = "patient123"; // Placeholder for actual user data

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleShareCode = async () => {
    setShowQr(true);
    try {
      const generatedOtp = await generateOtp(uniqueUsername);
      setOtp(generatedOtp);
      toast({
        title: "OTP Generated",
        description: `Your temporary access code is ${generatedOtp}. It's valid for a limited time.`,
        variant: "default", // Changed to default to match light green accent intention (will use CSS)
      });
    } catch (error) {
      console.error("Error generating OTP:", error);
      toast({
        title: "Error",
        description: "Could not generate OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

   const handleNotificationClick = () => {
    // Placeholder: In a real app, this would navigate to a notifications screen or show a dropdown.
    toast({
      title: "Notifications",
      description: "New record uploaded by General Hospital. Dr. Sharma accessed your history on 5 May 2025.",
    });
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold text-primary">MediVault</CardTitle>
           <Button variant="ghost" size="icon" onClick={handleNotificationClick} aria-label="Notifications">
            <Bell className="h-5 w-5" />
           </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            variant="outline"
            className="w-full justify-start text-left h-14 text-lg"
            onClick={() => handleNavigate('/my-records')}
          >
            <FileText className="mr-3 h-6 w-6 text-primary" /> My Records
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-left h-14 text-lg"
            onClick={() => handleNavigate('/prescriptions')}
          >
            <ScrollText className="mr-3 h-6 w-6 text-primary" /> Prescriptions
          </Button>
          <Button
            variant="default"
            className="w-full justify-start text-left h-14 text-lg bg-primary hover:bg-primary/90"
            onClick={() => handleNavigate('/upload')}
          >
            <FileUp className="mr-3 h-6 w-6" /> Upload Document
          </Button>
          <AlertDialog open={showQr} onOpenChange={setShowQr}>
            <AlertDialogTrigger asChild>
               <Button
                variant="outline"
                className="w-full justify-start text-left h-14 text-lg border-accent text-accent-foreground hover:bg-accent/10"
                onClick={handleShareCode}
                >
                <Share2 className="mr-3 h-6 w-6 text-accent-foreground" /> Share Access Code
               </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Share Your Medical History</AlertDialogTitle>
                <AlertDialogDescription>
                  Show this QR code or provide your username ({uniqueUsername}) and the OTP below to your healthcare provider for temporary access.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col items-center justify-center gap-4 my-4">
                 <QRCode value={uniqueUsername} size={128} level="H" />
                 {otp && (
                   <div className="text-center">
                     <p className="text-sm text-muted-foreground">Temporary Access Code (OTP):</p>
                     <p className="text-2xl font-bold tracking-widest">{otp}</p>
                    </div>
                 )}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setOtp(null)}>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            variant="ghost"
            className="w-full justify-start text-left h-14 text-lg"
            onClick={() => handleNavigate('/settings')}
          >
            <Settings className="mr-3 h-6 w-6 text-muted-foreground" /> Settings
          </Button>
        </CardContent>
      </Card>
       <p className="text-xs text-muted-foreground mt-4">Prototype Phase - Functionality may be limited.</p>
    </div>
  );
}
