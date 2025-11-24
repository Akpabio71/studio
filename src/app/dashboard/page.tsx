import { AppShell } from '@/components/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { categories } from '@/lib/data';
import { getOpenChats } from '@/lib/chats';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              An overview of your communication progress.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Open Chats</h2>
            <p className="mt-1 text-muted-foreground">Continue recent conversations or jump back into practice.</p>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {getOpenChats().map(chat => {
              const category = categories.find(c => c.id === chat.categoryId);
              return (
                <Card key={chat.id} className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                          <CardTitle className="text-lg">{chat.name}</CardTitle>
                          <CardDescription className="mt-1">{category?.name}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          {chat.unread > 0 && (
                            <span className="inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs px-2 py-0.5">{chat.unread}</span>
                          )}
                          <div className="text-sm text-muted-foreground">{new Date(chat.updatedAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <a href={`/chat/${chat.categoryId}?role=${chat.roleId}`} className="text-primary underline">Open</a>
                      <div className="text-xs text-muted-foreground">Role: {chat.roleId}</div>
                    </div>
                    {chat.lastMessageSnippet && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{chat.lastMessageSnippet}</p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
