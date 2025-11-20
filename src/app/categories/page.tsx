import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { categories } from '@/lib/data';
import { AppShell } from '@/components/AppShell';
import { ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Choose a Conversation</h1>
          <p className="mt-2 text-lg text-muted-foreground">Select a category to start practicing.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(category => (
            <Link href={`/chat/${category.id}`} key={category.id} className="group">
              <Card className="h-full flex flex-col hover:border-primary transition-colors duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <category.icon className="w-8 h-8 text-primary" />
                    <CardTitle>{category.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{category.description}</CardDescription>
                </CardContent>
                <div className="p-6 pt-0">
                    <div className="text-sm font-medium text-primary flex items-center gap-1">
                        Start Chat
                        <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
