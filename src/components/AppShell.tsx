"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Settings, Menu, X, LogOut, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { categories } from '@/lib/data'
import { useRouter } from 'next/navigation'
import { useUnreadCount } from '@/hooks/use-unread-count'

const navItems = [
  { href: '/categories', icon: Home, label: 'Home' },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const router = useRouter();

  const { count: dashboardUnread, loading: unreadLoading } = useUnreadCount();

  const [selectedCategory, setSelectedCategory] = useState<string>(() => categories?.[0]?.id ?? '');
  const [selectedRole, setSelectedRole] = useState<string>(() => categories?.[0]?.roles?.[0]?.id ?? '');

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Top-left menu icon */}
      <button
        aria-label="Open menu"
        title="Menu"
        onClick={() => setMenuOpen(prev => !prev)}
        className="fixed top-4 left-4 z-50 bg-card/95 backdrop-blur-sm border rounded-full p-2 shadow-md flex items-center justify-center"
      >
        {menuOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
      </button>

      {/* Slide-in mobile menu */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-card/95 backdrop-blur-md border-r shadow-lg transform transition-transform duration-300 md:hidden',
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Logo className="text-lg font-semibold" iconClassName="h-6 w-6" />
            <ThemeToggle />
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map(item => (
              <Link
                key={item.label}
                href={item.href}
                title={item.label}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted-foreground/5 hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.label === 'Dashboard' && dashboardUnread > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs px-2 py-0.5">{dashboardUnread}</span>
                )}
              </Link>
            ))}

            <div className="mt-4 pt-2 border-t border-border">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setLogoutOpen(true)}>
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Left fixed icon dock (desktop) */}
      <aside className="fixed left-4 top-1/2 z-40 -translate-y-1/2 hidden md:flex flex-col gap-3">
        <div className="bg-card/90 backdrop-blur-sm border rounded-full p-2 shadow-md flex flex-col gap-2 items-center">
          {navItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              className={cn(
                'p-2 rounded-full transition-transform transform hover:-translate-y-1 relative',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:bg-muted-foreground/5 hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="sr-only">{item.label}</span>
              {item.label === 'Dashboard' && dashboardUnread > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] px-1">{dashboardUnread}</span>
              )}
            </Link>
          ))}

          <button
            onClick={() => setLogoutOpen(true)}
            className="mt-2 p-2 rounded-full text-destructive hover:bg-destructive/5"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </aside>

      <main className="min-h-[60vh] flex-1 px-4 py-6 relative">
        {/* decorative background blob */}
        <div className="decorative-blob" />
        {children}

        {/* New Chat FAB (opens modal) */}
        <button onClick={() => setNewChatOpen(true)} title="New Chat" className="fixed right-6 bottom-6 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-lg flex items-center justify-center">
          <Plus className="h-5 w-5" />
        </button>
      </main>

      {/* Mobile bottom nav (icon-only) */}
      <nav className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 md:hidden">
        <div className="rounded-full bg-card/90 backdrop-blur-sm border shadow-md px-3 py-2 flex items-center gap-3">
          {navItems.map(item => (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              className={cn(
                'p-2 rounded-full transition-colors relative',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted-foreground/5 hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label === 'Dashboard' && dashboardUnread > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] px-1">{dashboardUnread}</span>
              )}
              <span className="sr-only">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* New Chat dialog */}
      <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start a new chat</DialogTitle>
            <DialogDescription>Select a category and role to begin practicing.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <label className="text-sm">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                const catId = e.target.value;
                setSelectedCategory(catId);
                const cat = categories.find(c => c.id === catId);
                setSelectedRole(cat?.roles?.[0]?.id ?? '');
              }}
              className="w-full rounded-md border px-3 py-2 bg-background"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <label className="text-sm">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full rounded-md border px-3 py-2 bg-background"
            >
              {categories.find(c => c.id === selectedCategory)?.roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewChatOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setNewChatOpen(false);
              if (selectedCategory && selectedRole) {
                router.push(`/chat/${selectedCategory}?role=${selectedRole}`);
              }
            }} className="ml-2">Start</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout confirmation dialog */}
      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm logout</DialogTitle>
            <DialogDescription>Are you sure you want to sign out? You will be returned to the login screen.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setLogoutOpen(false)}>Cancel</Button>
            <Button onClick={() => { window.location.href = '/logout' }} className="ml-2">Logout</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
