'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Bell, Cloud, Lock, LogOut, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Placeholder state for settings - replace with actual user preferences
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [cloudBackupEnabled, setCloudBackupEnabled] = React.useState(false);

  const handleLogout = () => {
    // TODO: Implement actual logout logic (clear session/token, redirect)
    toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        variant: "default"
      });
    router.push('/'); // Redirect to home or login page after logout
  };

  const handleSettingChange = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean, settingName: string) => {
     setter(value);
      toast({
        title: "Setting Updated",
        description: `${settingName} ${value ? 'enabled' : 'disabled'}.`,
      });
     // TODO: Persist setting change to backend/local storage
  }


  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <header className="sticky top-0 z-10 flex items-center p-4 bg-background border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold text-primary ml-4">Settings</h1>
      </header>

      <div className="flex-grow p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account details and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <User className="mr-2 h-4 w-4" /> Profile Information
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Lock className="mr-2 h-4 w-4" /> Change Password
            </Button>
             <Separator />
             <div className="flex items-center justify-between">
                <Label htmlFor="notifications-switch" className="flex items-center">
                   <Bell className="mr-2 h-4 w-4 text-primary" /> Push Notifications
                </Label>
                <Switch
                    id="notifications-switch"
                    checked={notificationsEnabled}
                    onCheckedChange={(checked) => handleSettingChange(setNotificationsEnabled, checked, "Notifications")}
                />
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
            <CardDescription>Control how your data is stored and managed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
                <Label htmlFor="cloud-backup-switch" className="flex items-center">
                   <Cloud className="mr-2 h-4 w-4 text-primary" /> Cloud Backup (Optional)
                </Label>
                <Switch
                    id="cloud-backup-switch"
                    checked={cloudBackupEnabled}
                    onCheckedChange={(checked) => handleSettingChange(setCloudBackupEnabled, checked, "Cloud Backup")}
                />
             </div>
             <p className="text-xs text-muted-foreground">
               When enabled, your encrypted records will be backed up securely to the cloud.
             </p>
            <Button variant="outline" className="w-full justify-start">
              <Lock className="mr-2 h-4 w-4" /> Manage Access Permissions
            </Button>
             <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                Export My Data
            </Button>
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Log Out
        </Button>

         <p className="text-xs text-muted-foreground text-center mt-4">App Version 1.0.0 (Prototype)</p>
      </div>
    </div>
  );
}
