import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  X, 
  Star, 
  Clock, 
  Users, 
  DollarSign,
  Calendar,
  Award,
  BookOpen
} from 'lucide-react';

interface SearchFilters {
  query: string;
  genres: string[];
  themes: string[];
  castSizeMin: number;
  castSizeMax: number;
  durationMin: number;
  durationMax: number;
  priceMin: number;
  priceMax: number;
  difficulty: string[];
  ageRating: string[];
  publicationYearMin: number;
  publicationYearMax: number;
  hasAwards: boolean;
  rating: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClose: () => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch, onClose }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    genres: [],
    themes: [],
    castSizeMin: 1,
    castSizeMax: 30,
    durationMin: 30,
    durationMax: 300,
    priceMin: 0,
    priceMax: 500,
    difficulty: [],
    ageRating: [],
    publicationYearMin: 1500,
    publicationYearMax: 2024,
    hasAwards: false,
    rating: 0,
    sortBy: 'relevance',
    sortOrder: 'desc'
  });

  const availableGenres = [
    'Drama', 'Comedy', 'Tragedy', 'Musical', 'Romance', 'Historical', 
    'Contemporary', 'Fantasy', 'Horror', 'Mystery', 'Family', 'Children'
  ];

  const availableThemes = [
    'Love', 'Family', 'Power', 'Betrayal', 'Redemption', 'Coming of Age',
    'Social Justice', 'Identity', 'Revenge', 'Friendship', 'War', 'Peace',
    'Mental Health', 'LGBTQ+', 'Immigration', 'Technology', 'Environment'
  ];

  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
  const ageRatings = ['G', 'PG', 'PG-13', 'R', 'Mature'];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'playwright', label: 'Playwright' },
    { value: 'price', label: 'Price' },
    { value: 'duration', label: 'Duration' },
    { value: 'rating', label: 'Rating' },
    { value: 'publication_year', label: 'Publication Year' },
    { value: 'popularity', label: 'Popularity' }
  ];

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'genres' | 'themes' | 'difficulty' | 'ageRating', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      genres: [],
      themes: [],
      castSizeMin: 1,
      castSizeMax: 30,
      durationMin: 30,
      durationMax: 300,
      priceMin: 0,
      priceMax: 500,
      difficulty: [],
      ageRating: [],
      publicationYearMin: 1500,
      publicationYearMax: 2024,
      hasAwards: false,
      rating: 0,
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
  };

  const handleSearch = () => {
    onSearch(filters);
    onClose();
  };

  const activeFiltersCount = [
    filters.genres.length,
    filters.themes.length,
    filters.difficulty.length,
    filters.ageRating.length,
    filters.hasAwards ? 1 : 0,
    filters.rating > 0 ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Search
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount} filters</Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Search Query */}
          <div className="space-y-2">
            <Label>Search Term</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search titles, playwrights, descriptions..."
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="production">Production</TabsTrigger>
              <TabsTrigger value="commercial">Commercial</TabsTrigger>
              <TabsTrigger value="sort">Sort & Display</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6 mt-6">
              {/* Genres */}
              <div className="space-y-3">
                <Label>Genres</Label>
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map(genre => (
                    <Badge
                      key={genre}
                      variant={filters.genres.includes(genre) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter('genres', genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Themes */}
              <div className="space-y-3">
                <Label>Themes</Label>
                <div className="flex flex-wrap gap-2">
                  {availableThemes.map(theme => (
                    <Badge
                      key={theme}
                      variant={filters.themes.includes(theme) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayFilter('themes', theme)}
                    >
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Difficulty & Age Rating */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Difficulty Level</Label>
                  <div className="space-y-2">
                    {difficultyLevels.map(level => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`difficulty-${level}`}
                          checked={filters.difficulty.includes(level)}
                          onCheckedChange={() => toggleArrayFilter('difficulty', level)}
                        />
                        <Label htmlFor={`difficulty-${level}`}>{level}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Age Rating</Label>
                  <div className="space-y-2">
                    {ageRatings.map(rating => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={filters.ageRating.includes(rating)}
                          onCheckedChange={() => toggleArrayFilter('ageRating', rating)}
                        />
                        <Label htmlFor={`rating-${rating}`}>{rating}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="production" className="space-y-6 mt-6">
              {/* Cast Size */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Cast Size: {filters.castSizeMin} - {filters.castSizeMax} actors
                </Label>
                <div className="px-3">
                  <Slider
                    value={[filters.castSizeMin, filters.castSizeMax]}
                    onValueChange={([min, max]) => {
                      updateFilter('castSizeMin', min);
                      updateFilter('castSizeMax', max);
                    }}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Duration: {filters.durationMin} - {filters.durationMax} minutes
                </Label>
                <div className="px-3">
                  <Slider
                    value={[filters.durationMin, filters.durationMax]}
                    onValueChange={([min, max]) => {
                      updateFilter('durationMin', min);
                      updateFilter('durationMax', max);
                    }}
                    max={360}
                    min={15}
                    step={15}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Publication Year */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Publication Year: {filters.publicationYearMin} - {filters.publicationYearMax}
                </Label>
                <div className="px-3">
                  <Slider
                    value={[filters.publicationYearMin, filters.publicationYearMax]}
                    onValueChange={([min, max]) => {
                      updateFilter('publicationYearMin', min);
                      updateFilter('publicationYearMax', max);
                    }}
                    max={2024}
                    min={1500}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="commercial" className="space-y-6 mt-6">
              {/* Price Range */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  License Price: ${filters.priceMin} - ${filters.priceMax}
                </Label>
                <div className="px-3">
                  <Slider
                    value={[filters.priceMin, filters.priceMax]}
                    onValueChange={([min, max]) => {
                      updateFilter('priceMin', min);
                      updateFilter('priceMax', max);
                    }}
                    max={1000}
                    min={0}
                    step={25}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Minimum Rating: {filters.rating} stars
                </Label>
                <div className="px-3">
                  <Slider
                    value={[filters.rating]}
                    onValueChange={([rating]) => updateFilter('rating', rating)}
                    max={5}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Award Winner Filter */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has-awards"
                  checked={filters.hasAwards}
                  onCheckedChange={(checked) => updateFilter('hasAwards', checked)}
                />
                <Label htmlFor="has-awards" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Award Winners Only
                </Label>
              </div>
            </TabsContent>

            <TabsContent value="sort" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Sort By</Label>
                  <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Sort Order</Label>
                  <Select value={filters.sortOrder} onValueChange={(value: 'asc' | 'desc') => updateFilter('sortOrder', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Descending</SelectItem>
                      <SelectItem value="asc">Ascending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSearch} className="spotlight-button">
                <Search className="h-4 w-4 mr-2" />
                Search Scripts
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};