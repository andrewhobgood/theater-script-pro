import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  BookOpen, 
  Heart, 
  User,
  Menu,
  X,
  Bell,
  Settings,
  ShoppingCart,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  badge?: number;
}

const bottomNavItems: NavItem[] = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Search', href: '/scripts' },
  { icon: BookOpen, label: 'Library', href: '/dashboard' },
  { icon: Heart, label: 'Wishlist', href: '/wishlist' },
  { icon: User, label: 'Profile', href: '/profile' }
];

const drawerNavItems: NavItem[] = [
  { icon: Bell, label: 'Notifications', href: '/notifications', badge: 3 },
  { icon: ShoppingCart, label: 'Cart', href: '/cart', badge: 2 },
  { icon: MessageSquare, label: 'Messages', href: '/messages' },
  { icon: Settings, label: 'Settings', href: '/settings' }
];

export function MobileNavigation() {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
        <nav className="flex items-center justify-around h-16 px-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors",
                  isActive(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Menu Button (visible on mobile) */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <nav className="space-y-2">
              {drawerNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsDrawerOpen(false)}
                    className={cn(
                      "flex items-center justify-between w-full p-3 rounded-lg transition-colors",
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="destructive" className="h-6 w-6 text-xs p-0 flex items-center justify-center">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 pt-4 border-t">
              <div className="space-y-2">
                <Link
                  to="/about"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block p-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block p-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setIsDrawerOpen(false)}
                  className="block p-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Spacer for bottom navigation */}
      <div className="h-16 md:hidden" />
    </>
  );
}