import { Link } from 'react-router-dom';
import { ArrowRight, Users, Shield, Zap, Star, Search, Theater, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockScripts } from '@/lib/mock-data';

const Home = () => {
  const featuredScripts = mockScripts.slice(0, 3);

  const features = [
    {
      icon: Shield,
      title: 'Secure Licensing',
      description: 'Protect your intellectual property with our secure, legally-compliant licensing system.',
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Get immediate script access upon licensing approval with our automated delivery system.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with playwrights and theater companies in our thriving creative community.',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Curated collection of professional scripts from established and emerging playwrights.',
    },
  ];

  const stats = [
    { label: 'Scripts Available', value: '2,500+' },
    { label: 'Playwrights', value: '800+' },
    { label: 'Theater Companies', value: '1,200+' },
    { label: 'Successful Licenses', value: '15,000+' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-4">
              Professional Script Licensing Platform
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold leading-tight">
              Where Stories Meet
              <span className="block text-secondary">The Stage</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Connect playwrights with theater companies through secure, professional script licensing. 
              Discover exceptional works and bring them to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button size="lg" className="spotlight-button text-lg px-8 py-6" asChild>
                <Link to="/scripts">
                  Browse Scripts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                <Link to="/register">
                  Join as Playwright
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Theater className="h-16 w-16 text-white animate-spotlight" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <Theater className="h-12 w-12 text-white animate-spotlight" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
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

      {/* Featured Scripts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold theater-heading mb-4">
              Featured Scripts
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover exceptional theatrical works from renowned playwrights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredScripts.map((script) => (
              <Card key={script.id} className="theater-card group hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{script.genre[0]}</Badge>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <CardTitle className="font-playfair text-xl group-hover:text-primary transition-colors">
                    {script.title}
                  </CardTitle>
                  {script.subtitle && (
                    <CardDescription className="font-medium text-muted-foreground">
                      {script.subtitle}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {script.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {script.themes.slice(0, 3).map((theme) => (
                      <Badge key={theme} variant="outline" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{script.duration} minutes</span>
                    <span>{script.castSize.min}-{script.castSize.max} actors</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/scripts">
                View All Scripts
                <Search className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              <Card key={index} className="theater-card text-center p-6">
                <CardContent className="pt-6">
                  <div className="bg-gradient-hero p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold">
              Ready to Share Your Story?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of playwrights and theater companies bringing exceptional stories to the stage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="spotlight-button" asChild>
                <Link to="/register">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20" asChild>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;