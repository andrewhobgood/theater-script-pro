import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Theater, Menu, User, Search, Bell, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { cn } from '@/lib/utils';

export const Header = () => {
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const handleRoleSwitch = (role: UserRole) => {
    switchRole(role);
    setIsMobileMenuOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navigationItems = [
    {
      title: "Browse",
      href: "/scripts",
      description: "Discover theatrical scripts",
      items: [
        { title: "All Scripts", href: "/scripts", description: "Browse our complete collection" },
        { title: "Featured", href: "/scripts?featured=true", description: "Hand-picked exceptional works" },
        { title: "New Releases", href: "/scripts?sort=newest", description: "Latest additions to our library" },
        { title: "Popular", href: "/scripts?sort=popular", description: "Most licensed scripts" },
      ]
    },
    {
      title: "Creators",
      href: "/playwrights",
      description: "Meet our talented playwrights",
      items: [
        { title: "All Playwrights", href: "/playwrights", description: "Discover talented creators" },
        { title: "Featured Artists", href: "/playwrights?featured=true", description: "Spotlight on exceptional talent" },
        { title: "Join as Playwright", href: "/register?role=playwright", description: "Share your creative work" },
      ]
    },
    {
      title: "Resources",
      href: "/about",
      description: "Learn more about our platform",
      items: [
        { title: "How It Works", href: "/about", description: "Understanding our process" },
        { title: "Licensing Guide", href: "/licensing-guide", description: "Everything about licensing" },
        { title: "Support Center", href: "/support", description: "Get help when you need it" },
        { title: "Blog", href: "/blog", description: "Industry insights and updates" },
      ]
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/scripts?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className={cn(
      "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50 transition-all duration-200",
      isScrolled && "shadow-md"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity group">
            <div className="bg-gradient-hero p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Theater className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-playfair font-bold text-xl theater-heading">
                TheaterScript Pro
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Professional Script Licensing
              </p>
            </div>
          </Link>

          {/* Enhanced Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger className="font-medium">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              to={item.href}
                            >
                              <Theater className="h-6 w-6" />
                              <div className="mb-2 mt-4 text-lg font-medium">
                                {item.title}
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        {item.items.map((subItem) => (
                          <li key={subItem.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={subItem.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{subItem.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {subItem.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-3">
            {/* Enhanced Search */}
            <div className="hidden md:flex items-center">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2 animate-fade-in">
                  <Input
                    placeholder="Search scripts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                    autoFocus
                  />
                  <Button size="sm" type="submit">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsSearchOpen(true)}
                  className="hover:scale-110 transition-transform"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Cart/Wishlist */}
                <Button variant="ghost" size="sm" className="relative hover:scale-110 transition-transform">
                  <ShoppingCart className="h-4 w-4" />
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    2
                  </Badge>
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative hover:scale-110 transition-transform">
                  <Bell className="h-4 w-4" />
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
                  >
                    3
                  </Badge>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-muted">
                      <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="hidden sm:inline font-medium">
                        {user?.firstName}
                      </span>
                      <Badge variant="secondary" className="hidden sm:inline">
                        {user?.role?.replace('_', ' ')}
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">Settings</Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    {/* Development: Role Switching */}
                    <div className="px-2 py-1">
                      <p className="text-xs text-muted-foreground mb-1">Switch Role (Dev)</p>
                    </div>
                    <DropdownMenuItem onClick={() => handleRoleSwitch('playwright')}>
                      Switch to Playwright
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleSwitch('theater_company')}>
                      Switch to Theater Company
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleSwitch('admin')}>
                      Switch to Admin
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-destructive">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild className="hover:scale-105 transition-transform">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" className="spotlight-button hover:scale-105 transition-transform" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:scale-110 transition-transform"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 animate-fade-in">
            {/* Mobile Search */}
            <div className="md:hidden mb-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search scripts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" type="submit">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <div key={item.title} className="space-y-2">
                  <Link 
                    to={item.href} 
                    className="font-medium text-foreground hover:text-primary transition-colors px-2 py-1 block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                  <div className="pl-4 space-y-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        to={subItem.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors px-2 py-1 block"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};