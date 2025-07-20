import { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, Users, BookOpen, Grid, List, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Script } from '@/types/script';
import { AdvancedSearchBar } from '@/components/search/AdvancedSearchBar';
import { ScriptFilters } from '@/components/scripts/ScriptFilters';
import { ScriptCard } from '@/components/scripts/ScriptCard';
import { SavedSearches } from '@/components/search/SavedSearches';
import { ScriptCardSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/use-toast';

const Scripts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [castSizeRange, setCastSizeRange] = useState([1, 30]);
  const [durationRange, setDurationRange] = useState([30, 300]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('created_at');
  const [scripts, setScripts] = useState<any[]>([]);
  const [totalScripts, setTotalScripts] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();

  const limit = 20;

  // Fetch scripts from API
  useEffect(() => {
    fetchScripts();
  }, [selectedGenre, castSizeRange, durationRange, sortBy, currentPage]);

  const fetchScripts = async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (currentPage * limit).toString(),
        sort: sortBy,
        order: 'desc',
      });

      // Add filters
      if (selectedGenre !== 'all') {
        params.append('genre', selectedGenre);
      }
      if (castSizeRange[0] > 1) {
        params.append('min_cast', castSizeRange[0].toString());
      }
      if (castSizeRange[1] < 30) {
        params.append('max_cast', castSizeRange[1].toString());
      }
      if (durationRange[0] > 30) {
        params.append('min_duration', durationRange[0].toString());
      }
      if (durationRange[1] < 300) {
        params.append('max_duration', durationRange[1].toString());
      }

      const response = await apiClient.scripts.getScripts(params);
      
      setScripts(response.scripts);
      setTotalScripts(response.total);
    } catch (error: any) {
      console.error('Error fetching scripts:', error);
      toast({
        title: "Error loading scripts",
        description: error.message || "Failed to load scripts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchScripts = async () => {
    if (!searchTerm.trim()) {
      fetchScripts();
      return;
    }

    try {
      setIsLoading(true);
      
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (currentPage * limit).toString(),
      });

      const response = await apiClient.scripts.searchScripts(searchTerm, params);
      
      setScripts((response as any).scripts || []);
      setTotalScripts((response as any).total || 0);
    } catch (error: any) {
      console.error('Error searching scripts:', error);
      toast({
        title: "Search failed",
        description: error.message || "Failed to search scripts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Search when term changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchScripts();
      } else {
        fetchScripts();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleFilterChange = (filters: any) => {
    if (filters.genre) setSelectedGenre(filters.genre);
    if (filters.castSize) setCastSizeRange(filters.castSize);
    if (filters.duration) setDurationRange(filters.duration);
  };

  const handleSavedSearchLoad = (search: any) => {
    setSearchTerm(search.query);
    // Apply saved filters
    if (search.filters) {
      handleFilterChange(search.filters);
    }
  };

  const clearAllFilters = () => {
    setSelectedGenre('all');
    setCastSizeRange([1, 30]);
    setDurationRange([30, 300]);
    setSearchTerm('');
  };

  // Get unique genres from fetched scripts
  const genres = Array.from(new Set(scripts.map(script => script.genre).filter(Boolean)));

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
            <SavedSearches />
          </aside>

          {/* Scripts Grid */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  {searchTerm ? 'Search Results' : 'Available Scripts'}
                </h2>
                <p className="text-muted-foreground">
                  {totalScripts} scripts found
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Newest First</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="standard_price">Price: Low to High</SelectItem>
                    <SelectItem value="average_rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedGenre !== 'all' || searchTerm || castSizeRange[0] > 1 || castSizeRange[1] < 30) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedGenre !== 'all' && (
                  <Badge variant="secondary">
                    Genre: {selectedGenre}
                  </Badge>
                )}
                {castSizeRange[0] > 1 || castSizeRange[1] < 30 && (
                  <Badge variant="secondary">
                    Cast: {castSizeRange[0]}-{castSizeRange[1]}
                  </Badge>
                )}
                {searchTerm && (
                  <Badge variant="secondary">
                    Search: {searchTerm}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Scripts Display */}
            {isLoading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : ''}`}>
                {[...Array(6)].map((_, i) => (
                  <ScriptCardSkeleton key={i} />
                ))}
              </div>
            ) : scripts.length === 0 ? (
              <EmptyState
                icon={<BookOpen className="h-12 w-12" />}
                title="No scripts found"
                description={searchTerm ? "Try adjusting your search terms or filters" : "No scripts are available at the moment"}
                action={searchTerm ? {
                  label: "Clear filters",
                  onClick: clearAllFilters
                } : undefined}
              />
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : ''}`}>
                {scripts.map((script) => (
                  <ScriptCard 
                    key={script.id} 
                    script={{
                      id: script.id,
                      title: script.title,
                      playwright: `${script.profiles?.first_name || ''} ${script.profiles?.last_name || ''}`.trim(),
                      description: script.description,
                      genre: [script.genre],
                      castSize: {
                        min: script.cast_size_min,
                        max: script.cast_size_max,
                        flexible: true,
                      },
                      duration: script.duration_minutes,
                      ageRating: 'PG',
                      difficulty: 'Intermediate',
                      thumbnail: script.cover_image_url,
                      standard_price: script.standard_price,
                      premium_price: script.premium_price,
                      educational_price: script.educational_price,
                      isFeatured: script.is_featured,
                    }} 
                    viewMode={viewMode} 
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalScripts > limit && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {currentPage + 1} of {Math.ceil(totalScripts / limit)}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={(currentPage + 1) * limit >= totalScripts}
                >
                  Next
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Scripts;
