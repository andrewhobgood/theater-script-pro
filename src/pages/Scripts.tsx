import { useState } from 'react';
import { Search, Filter, Star, Clock, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { mockScripts } from '@/lib/mock-data';
import { Script } from '@/types/script';

const Scripts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [castSizeRange, setCastSizeRange] = useState([1, 30]);
  const [durationRange, setDurationRange] = useState([30, 300]);

  // Get unique genres from scripts
  const genres = Array.from(new Set(mockScripts.flatMap(script => script.genre)));

  // Filter scripts based on search criteria
  const filteredScripts = mockScripts.filter((script) => {
    const matchesSearch = script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.themes.some(theme => theme.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesGenre = selectedGenre === 'all' || script.genre.includes(selectedGenre);
    
    const matchesCastSize = script.castSize.min >= castSizeRange[0] && script.castSize.max <= castSizeRange[1];
    
    const matchesDuration = script.duration >= durationRange[0] && script.duration <= durationRange[1];

    return matchesSearch && matchesGenre && matchesCastSize && matchesDuration;
  });

  const ScriptCard = ({ script }: { script: Script }) => (
    <Card className="theater-card group hover:scale-105 transition-all duration-300 cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2">
            <Badge variant="secondary">{script.genre[0]}</Badge>
            <Badge variant="outline">{script.ageRating}</Badge>
          </div>
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
          <CardDescription className="font-medium">
            {script.subtitle}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground line-clamp-3">
          {script.description}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {script.themes.slice(0, 4).map((theme) => (
            <Badge key={theme} variant="outline" className="text-xs">
              {theme}
            </Badge>
          ))}
          {script.themes.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{script.themes.length - 4} more
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{script.duration}min</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{script.castSize.min}-{script.castSize.max}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>{script.pages}p</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            View Details
          </Button>
          <Button size="sm" variant="outline">
            Preview
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-playfair font-bold">
              Discover Scripts
            </h1>
            <p className="text-xl text-white/90">
              Browse our curated collection of professional theatrical works
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search scripts, themes, or playwrights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 space-y-6">
            <Card className="theater-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Genre Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Genre</label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genres</SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cast Size Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Cast Size: {castSizeRange[0]} - {castSizeRange[1]} actors
                  </label>
                  <Slider
                    value={castSizeRange}
                    onValueChange={setCastSizeRange}
                    max={30}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Duration Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Duration: {durationRange[0]} - {durationRange[1]} minutes
                  </label>
                  <Slider
                    value={durationRange}
                    onValueChange={setDurationRange}
                    max={300}
                    min={30}
                    step={15}
                    className="w-full"
                  />
                </div>

                {/* Clear Filters */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedGenre('all');
                    setCastSizeRange([1, 30]);
                    setDurationRange([30, 300]);
                    setSearchTerm('');
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="theater-card">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary font-playfair">
                    {filteredScripts.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Scripts Found
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Scripts Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {filteredScripts.length} Scripts Available
              </h2>
              
              <Select defaultValue="featured">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="cast-size">Cast Size</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredScripts.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredScripts.map((script) => (
                  <ScriptCard key={script.id} script={script} />
                ))}
              </div>
            ) : (
              <Card className="theater-card p-12 text-center">
                <div className="space-y-4">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-semibold">No scripts found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or clearing filters
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedGenre('all');
                      setCastSizeRange([1, 30]);
                      setDurationRange([30, 300]);
                      setSearchTerm('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Scripts;