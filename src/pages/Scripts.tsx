import { useState } from 'react';
import { Search, Filter, Star, Clock, Users, BookOpen, Grid, List, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { mockScripts } from '@/lib/mock-data';
import { Script } from '@/types/script';
import { AdvancedSearchBar } from '@/components/search/AdvancedSearchBar';
import { ScriptFilters } from '@/components/scripts/ScriptFilters';
import { ScriptCard } from '@/components/scripts/ScriptCard';
import { SavedSearches } from '@/components/search/SavedSearches';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { EnhancedButton } from '@/components/ui/enhanced-button';

const Scripts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [castSizeRange, setCastSizeRange] = useState([1, 30]);
  const [durationRange, setDurationRange] = useState([30, 300]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

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

  const handleFilterChange = (filters: any) => {
    // Handle filter changes from the ScriptFilters component
    console.log('Filters changed:', filters);
  };

  const handleSavedSearchLoad = (search: any) => {
    setSearchTerm(search.query);
    // Apply saved filters
    console.log('Loading saved search:', search);
  };

  const clearAllFilters = () => {
    setSelectedGenre('all');
    setCastSizeRange([1, 30]);
    setDurationRange([30, 300]);
    setSearchTerm('');
  };

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
            
            {/* Advanced Search Bar */}
            <AdvancedSearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onFilterToggle={() => setShowFilters(!showFilters)}
              showFilters={showFilters}
              className="max-w-2xl mx-auto"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Filters Sidebar */}
          <aside className="lg:w-80 space-y-6">
            {showFilters && (
              <div className="animate-fade-in">
                <ScriptFilters onFiltersChange={handleFilterChange} />
              </div>
            )}
            
            {/* Saved Searches */}
            <SavedSearches 
              onLoadSearch={handleSavedSearchLoad}
              currentSearch={{ query: searchTerm, filters: {} }}
            />

            {/* Quick Stats */}
            <Card className="theater-card">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary font-playfair">
                    {filteredScripts.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Scripts Found
                  </div>
                  {filteredScripts.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {Math.round((filteredScripts.length / mockScripts.length) * 100)}% of collection
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Featured Scripts */}
            <Card className="theater-card">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4" />
                  Trending This Week
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {mockScripts.slice(0, 3).map((script) => (
                  <ScriptCard key={script.id} script={script} compact />
                ))}
              </CardContent>
            </Card>
          </aside>

          {/* Enhanced Scripts Grid */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  {filteredScripts.length} Scripts Available
                </h2>
                <p className="text-sm text-muted-foreground">
                  {searchTerm && `Results for "${searchTerm}"`}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex border rounded-lg p-1">
                  <Button
                    size="sm"
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Sort Selection */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                    <SelectItem value="cast-size">Cast Size</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <LoadingSkeleton key={i} variant="card" />
                ))}
              </div>
            ) : filteredScripts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {filteredScripts.map((script) => (
                  <div key={script.id} className="animate-fade-in">
                    <ScriptCard script={script} compact={viewMode === 'list'} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Search className="h-12 w-12" />}
                title="No scripts found"
                description={searchTerm 
                  ? `No scripts match "${searchTerm}". Try adjusting your search or filters.`
                  : "Try adjusting your search criteria or clearing filters"
                }
                action={{
                  label: "Clear All Filters",
                  onClick: clearAllFilters,
                  variant: "outline"
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Scripts;