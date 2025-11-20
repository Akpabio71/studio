import { AppShell } from '@/components/AppShell';
import { SettingsForm } from '@/components/settings/SettingsForm';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your profile and accessibility preferences.
            </p>
          </div>
          <SettingsForm />
        </div>
      </div>
    </AppShell>
  );
}
