import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { categories } from '@/lib/data';
import { AppShell } from '@/components/AppShell';
import { Label } from '@/components/ui/label';
import { RoleSelector } from './RoleSelector';

export default function CategoriesPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Choose a Conversation</h1>
          <p className="mt-2 text-lg text-muted-foreground">Select a category and role to start practicing.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(category => (
            <Card key={category.id} className="h-full flex flex-col transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>{category.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <CardDescription>{category.description}</CardDescription>
                   <div className="grid gap-2">
                     <Label htmlFor={`role-select-${category.id}`}>Select a Role</Label>
                      <RoleSelector categoryId={category.id} roles={category.roles} />
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
