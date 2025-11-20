'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '../ThemeToggle';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

const settingsSchema = z.object({
  language: z.string(),
  goal: z.string(),
  experienceLevel: z.string(),
  asdFriendlyMode: z.boolean(),
  fontSize: z.string().optional(),
  textToSpeech: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const { data: profileSettings, loading } = useDoc<SettingsFormValues>(`userSettings`, user?.uid || 'guest');


  const { control, handleSubmit, reset } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      language: 'en-us',
      goal: 'confidence',
      experienceLevel: 'intermediate',
      asdFriendlyMode: false,
      textToSpeech: false,
    },
  });

  useEffect(() => {
    if (profileSettings) {
      reset(profileSettings);
    }
  }, [profileSettings, reset]);

  async function onSubmit(data: SettingsFormValues) {
    if (!user || !firestore) {
        toast({ title: 'Error', description: 'You must be logged in to save settings.', variant: 'destructive' });
        return;
    }
    try {
        await setDoc(doc(firestore, 'userSettings', user.uid), data, { merge: true });
        toast({
          title: 'Settings Saved',
          description: 'Your preferences have been updated.',
        });
    } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  }

  if (loading) {
      return (
          <div className="space-y-8">
              <Card>
                  <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                  <CardContent className="space-y-4">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                  <CardContent className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                  </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Preferences</CardTitle>
          <CardDescription>Set your language, goals, and experience level.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label>Language</Label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-us">English (US)</SelectItem>
                    <SelectItem value="en-gb">English (UK)</SelectItem>
                    <SelectItem value="es-es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="grid gap-2">
            <Label>Communication Goal</Label>
             <Controller
              name="goal"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confidence">Build Confidence</SelectItem>
                    <SelectItem value="clarity">Improve Clarity</SelectItem>
                    <SelectItem value="professionalism">Enhance Professionalism</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="grid gap-2">
            <Label>Experience Level</Label>
             <Controller
              name="experienceLevel"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>Customize the app to your needs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>Color Contrast</Label>
              <p className="text-sm text-muted-foreground">Toggle between light and dark mode.</p>
            </div>
            <ThemeToggle />
          </div>

          <Controller
            name="asdFriendlyMode"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="asd-mode">ASD-Friendly Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable structured guidance and simplified feedback.</p>
                </div>
                <Switch id="asd-mode" checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />

          <Controller
            name="textToSpeech"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="tts-mode">Text-to-Speech</Label>
                  <p className="text-sm text-muted-foreground">Read messages and feedback aloud.</p>
                </div>
                <Switch id="tts-mode" checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
