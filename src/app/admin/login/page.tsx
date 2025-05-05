'use client';

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LogIn, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { generateOtp, verifyOtp } from '@/services/otp'; // Assume verifyOtp is implemented

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [usernameForOtp, setUsernameForOtp] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const handleLoginSubmit = async (values: LoginFormValues) => {
    setLoginError(null);
    // --- TODO: Implement actual backend authentication ---
    // 1. Send username/password to backend
    // 2. Backend verifies credentials
    // 3. If valid, backend triggers OTP generation (e.g., via email/SMS)
    //    or uses a time-based OTP app associated with the user.
    // 4. Backend responds indicating success and OTP is needed.
    console.log("Login attempt:", values);

    // --- Mock Success ---
    // Simulate successful credential check
    const isValidCredentials = values.username === "admin" && values.password === "password"; // Replace with real check

    if (isValidCredentials) {
      try {
          // In a real app, the backend would handle OTP generation and sending.
          // Here, we simulate generating it for the frontend prompt.
          await generateOtp(values.username); // We don't need the OTP value here, just trigger it.
          setUsernameForOtp(values.username);
          setShowOtpForm(true);
          toast({ title: "Credentials Verified", description: "Please enter the OTP sent to your device." });
      } catch(error) {
          console.error("Error triggering OTP:", error);
          setLoginError("Failed to initiate 2FA. Please try again.");
      }

    } else {
      setLoginError("Invalid username or password.");
    }
    // --- End Mock ---
  };

  const handleOtpSubmit = async (values: OtpFormValues) => {
    setLoginError(null);
    setIsVerifying(true);

    // --- TODO: Implement actual OTP verification ---
    // 1. Send username and OTP to backend
    // 2. Backend verifies the OTP
    // 3. If valid, backend creates a session/token and responds success.
    console.log("OTP verification attempt:", { username: usernameForOtp, otp: values.otp });

    // --- Mock Verification ---
    try {
        const isOtpValid = await verifyOtp(usernameForOtp, values.otp); // Use the service

        if (isOtpValid) {
          toast({
            title: "Login Successful",
            description: "Welcome to the MediVault Admin Portal.",
            variant: "default", // Success indication
          });
          // TODO: Store session/token
          router.push('/admin/dashboard'); // Redirect to dashboard
        } else {
          setLoginError("Invalid OTP. Please try again.");
          otpForm.reset(); // Clear OTP field
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        setLoginError("An error occurred during OTP verification.");
    } finally {
        setIsVerifying(false);
    }
    // --- End Mock ---
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-secondary to-secondary">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">MediVault Admin Portal</CardTitle>
          <CardDescription>Secure login for hospital staff.</CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          {!showOtpForm ? (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-4">
                 <div className="text-center text-sm text-muted-foreground mb-2">
                    Enter the 6-digit code sent to your registered device for user: <strong>{usernameForOtp}</strong>
                 </div>
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>One-Time Password (OTP)</FormLabel>
                      <FormControl>
                        <Input
                         placeholder="Enter 6-digit OTP" {...field}
                         maxLength={6}
                         inputMode="numeric"
                         autoComplete="one-time-code"
                         />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isVerifying}>
                  <ShieldCheck className="mr-2 h-4 w-4" /> {isVerifying ? 'Verifying...' : 'Verify OTP'}
                </Button>
                 <Button variant="link" size="sm" className="w-full" onClick={() => setShowOtpForm(false)}>
                   Back to Login
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground">
          <p>For authorized personnel only. All access is logged.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
