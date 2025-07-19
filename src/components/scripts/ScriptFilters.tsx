import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, ChevronDown } from "lucide-react";

interface ScriptFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export const ScriptFilters = ({ onFiltersChange }: ScriptFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [durationRange, setDurationRange] = useState([30, 240]);
  const [castSizeRange, setCastSizeRange] = useState([1, 30]);
  const [difficulty, setDifficulty] = useState("");
  const [ageRating, setAgeRating] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  const genres = ["Drama", "Comedy", "Tragedy", "Musical", "Classical", "Contemporary", "Romance", "Thriller", "Historical"];
  const themes = ["Love", "Family", "Power", "Revenge", "Identity", "Justice", "Mortality", "Friendship", "Betrayal", "Redemption"];
  const difficulties = ["Beginner", "Intermediate", "Advanced", "Professional"];
  const ageRatings = ["G", "PG", "PG-13", "R", "Adult"];
  const sortOptions = [
    { value: "relevance", label: "Most Relevant" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "duration-short", label: "Duration: Short to Long" },
    { value: "duration-long", label: "Duration: Long to Short" },
    { value: "rating", label: "Highest Rated" },
  ];

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleThemeToggle = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedGenres([]);
    setSelectedThemes([]);
    setPriceRange([0, 500]);
    setDurationRange([30, 240]);
    setCastSizeRange([1, 30]);
    setDifficulty("");
    setAgeRating("");
    setSortBy("relevance");
  };

  const activeFiltersCount = 
    (searchTerm ? 1 : 0) +
    selectedGenres.length +
    selectedThemes.length +
    (difficulty ? 1 : 0) +
    (ageRating ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Search and Sort */}
      <Card className="theater-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scripts, playwrights, themes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="whitespace-nowrap"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchTerm}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
            </Badge>
          )}
          {selectedGenres.map((genre) => (
            <Badge key={genre} variant="secondary" className="gap-1">
              {genre}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleGenreToggle(genre)} />
            </Badge>
          ))}
          {selectedThemes.map((theme) => (
            <Badge key={theme} variant="secondary" className="gap-1">
              {theme}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleThemeToggle(theme)} />
            </Badge>
          ))}
        </div>
      )}

      {/* Advanced Filters */}
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Advanced Filters
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Genre Filter */}
          <Card className="theater-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Genres</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {genres.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={`genre-${genre}`}
                      checked={selectedGenres.includes(genre)}
                      onCheckedChange={() => handleGenreToggle(genre)}
                    />
                    <Label htmlFor={`genre-${genre}`} className="text-sm">
                      {genre}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Themes Filter */}
          <Card className="theater-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Themes</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {themes.map((theme) => (
                  <div key={theme} className="flex items-center space-x-2">
                    <Checkbox
                      id={`theme-${theme}`}
                      checked={selectedThemes.includes(theme)}
                      onCheckedChange={() => handleThemeToggle(theme)}
                    />
                    <Label htmlFor={`theme-${theme}`} className="text-sm">
                      {theme}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price Range */}
          <Card className="theater-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Price Range</CardTitle>
              <CardDescription className="text-xs">
                ${priceRange[0]} - ${priceRange[1]}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={500}
                min={0}
                step={5}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Duration Range */}
          <Card className="theater-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Duration (minutes)</CardTitle>
              <CardDescription className="text-xs">
                {durationRange[0]} - {durationRange[1]} minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Slider
                value={durationRange}
                onValueChange={setDurationRange}
                max={240}
                min={30}
                step={15}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Cast Size Range */}
          <Card className="theater-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Cast Size</CardTitle>
              <CardDescription className="text-xs">
                {castSizeRange[0]} - {castSizeRange[1]} actors
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Slider
                value={castSizeRange}
                onValueChange={setCastSizeRange}
                max={30}
                min={1}
                step={1}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Difficulty and Age Rating */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="theater-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Difficulty</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any difficulty</SelectItem>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff.toLowerCase()}>
                        {diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Age Rating</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Select value={ageRating} onValueChange={setAgeRating}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any rating</SelectItem>
                    {ageRatings.map((rating) => (
                      <SelectItem key={rating} value={rating}>
                        {rating}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};