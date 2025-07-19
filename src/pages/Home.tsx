import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Shield, Zap, Star, Search, Theater, Award, Play, BookOpen, TrendingUp, Filter, ChevronRight, Sparkles, Globe, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockScripts } from '@/lib/mock-data';
import { ScriptCard } from '@/components/scripts/ScriptCard';
import { AdvancedSearchBar } from '@/components/search/AdvancedSearchBar';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('featured');

  const featuredScripts = mockScripts.slice(0, 6);
  const recentScripts = mockScripts.slice(0, 3);
  const trendingScripts = mockScripts.slice(3, 6);

  const features = [
    {
      icon: Shield,
      title: 'Secure Licensing',
      description: 'Protect your intellectual property with our secure, legally-compliant licensing system.',
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Get immediate script access upon licensing approval with our automated delivery system.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with playwrights and theater companies in our thriving creative community.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Curated collection of professional scripts from established and emerging playwrights.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
  ];

  const stats = [
    { label: 'Scripts Available', value: '2,500+', icon: BookOpen },
    { label: 'Playwrights', value: '800+', icon: Users },
    { label: 'Theater Companies', value: '1,200+', icon: Theater },
    { label: 'Successful Licenses', value: '15,000+', icon: Award },
  ];

  const testimonials = [
    {
      name: "Sarah Director",
      role: "Artistic Director, Broadway Theater Co.",
      content: "TheaterScript Pro has revolutionized how we discover and license new works. The platform is intuitive and the support is exceptional.",
      avatar: "SD",
      rating: 5
    },
    {
      name: "Michael Playwright",
      role: "Award-winning Playwright",
      content: "Finally, a platform that understands the needs of both playwrights and theater companies. My works have found new audiences I never could have reached before.",
      avatar: "MP",
      rating: 5
    },
    {
      name: "Jennifer Producer",
      role: "Regional Theater Producer",
      content: "The licensing process is seamless and transparent. We've discovered amazing scripts that have become cornerstone productions for our theater.",
      avatar: "JP",
      rating: 5
    }
  ];

  const categories = [
    { id: 'featured', label: 'Featured', icon: Sparkles },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'recent', label: 'New Releases', icon: Clock },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleQuickSearch = async (term: string) => {
    setIsLoading(true);
    setSearchTerm(term);
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Navigate to search results
  };

  const quickSearchTerms = ['Comedy', 'Drama', 'Small Cast', 'Contemporary', 'Musical'];

  const getCurrentScripts = () => {
    switch (activeCategory) {
      case 'trending': return trendingScripts;
      case 'recent': return recentScripts;
      default: return featuredScripts;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-[10%] animate-pulse">
            <Theater className="h-8 w-8 text-white" />
          </div>
          <div className="absolute top-40 right-[15%] animate-pulse delay-1000">
            <Star className="h-6 w-6 text-white" />
          </div>
          <div className="absolute bottom-32 left-[20%] animate-pulse delay-2000">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <div className="absolute bottom-20 right-[25%] animate-pulse delay-500">
            <Users className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-4 animate-fade-in">
              🎭 Professional Script Licensing Platform
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold leading-tight animate-fade-in">
              Where Stories Meet
              <span className="block text-secondary bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                The Stage
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              Connect playwrights with theater companies through secure, professional script licensing. 
              Discover exceptional works and bring them to life.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto animate-fade-in">
              <AdvancedSearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onFilterToggle={() => setShowFilters(!showFilters)}
                showFilters={showFilters}
                placeholder="Search for scripts, playwrights, or themes..."
                className="mb-4"
              />
              
              {/* Quick Search Tags */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {quickSearchTerms.map((term) => (
                  <Badge
                    key={term}
                    variant="secondary"
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30 cursor-pointer transition-all hover:scale-105"
                    onClick={() => handleQuickSearch(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 animate-fade-in">
              <EnhancedButton 
                size="xl" 
                variant="spotlight"
                asChild
                icon={<Search className="h-5 w-5" />}
              >
                <Link to="/scripts">
                  Browse Scripts
                </Link>
              </EnhancedButton>
              
              <EnhancedButton 
                size="xl" 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                asChild
                icon={<Users className="h-5 w-5" />}
              >
                <Link to="/register">
                  Join as Playwright
                </Link>
              </EnhancedButton>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-3 group hover:scale-105 transition-transform">
                <div className="bg-gradient-hero p-3 rounded-full w-16 h-16 mx-auto mb-2 flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary font-playfair">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Script Discovery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold theater-heading mb-4">
              Discover Exceptional Scripts
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of theatrical works from renowned and emerging playwrights
            </p>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <category.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="animate-fade-in">
                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <LoadingSkeleton key={i} variant="card" />
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {getCurrentScripts().map((script, index) => (
                      <div key={script.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <ScriptCard script={script} />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          <div className="text-center">
            <EnhancedButton 
              size="lg" 
              variant="outline"
              asChild
              icon={<ArrowRight className="h-4 w-4" />}
            >
              <Link to="/scripts">
                View All Scripts
              </Link>
            </EnhancedButton>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 curtain-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold theater-heading mb-4">
              Why Choose TheaterScript Pro?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional tools and secure processes designed for the theater industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="theater-card text-center p-6 group hover:scale-105 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className={`${feature.bgColor} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold theater-heading mb-4">
              Trusted by Theater Professionals
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what playwrights and theater companies are saying about our platform
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="theater-card p-8 text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-lg md:text-xl italic text-muted-foreground mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                
                <div className="flex items-center justify-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-hero text-white">
                      {testimonials[currentTestimonial].avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 animate-bounce">
            <Theater className="h-16 w-16 text-white" />
          </div>
          <div className="absolute bottom-10 right-10 animate-bounce delay-1000">
            <Globe className="h-12 w-12 text-white" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-playfair font-bold">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Join thousands of playwrights and theater companies bringing exceptional stories to the stage.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="font-semibold text-lg mb-2">For Playwrights</h3>
                <p className="text-white/80 text-sm">Share your work with theaters worldwide and earn from your creative talent.</p>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="font-semibold text-lg mb-2">For Theater Companies</h3>
                <p className="text-white/80 text-sm">Discover new works and connect with talented playwrights for your next production.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <EnhancedButton 
                size="xl" 
                variant="spotlight"
                asChild
                icon={<ArrowRight className="h-5 w-5" />}
              >
                <Link to="/register">
                  Get Started Today
                </Link>
              </EnhancedButton>
              <EnhancedButton 
                size="xl" 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                asChild
                icon={<BookOpen className="h-5 w-5" />}
              >
                <Link to="/about">
                  Learn More
                </Link>
              </EnhancedButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;