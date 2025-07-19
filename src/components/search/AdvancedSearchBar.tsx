import { useState, useRef, useEffect } from "react";
import { Search, Clock, TrendingUp, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface SearchSuggestion {
  type: 'script' | 'playwright' | 'genre' | 'theme';
  value: string;
  count?: number;
}

interface AdvancedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterToggle: () => void;
  showFilters: boolean;
  className?: string;
  placeholder?: string;
}

export const AdvancedSearchBar = ({ 
  value, 
  onChange, 
  onFilterToggle, 
  showFilters,
  className,
  placeholder = "Search scripts, playwrights, themes..."
}: AdvancedSearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches] = useState([
    "Shakespeare", "Comedy", "Family drama", "Contemporary", "Small cast"
  ]);
  const [suggestions] = useState<SearchSuggestion[]>([
    { type: 'script', value: 'Hamlet', count: 12 },
    { type: 'script', value: 'Romeo and Juliet', count: 8 },
    { type: 'playwright', value: 'William Shakespeare', count: 45 },
    { type: 'playwright', value: 'Tennessee Williams', count: 23 },
    { type: 'genre', value: 'Drama', count: 156 },
    { type: 'genre', value: 'Comedy', count: 89 },
    { type: 'theme', value: 'Love', count: 234 },
    { type: 'theme', value: 'Family', count: 187 },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions = suggestions.filter(s => 
    s.value.toLowerCase().includes(value.toLowerCase()) && value.length > 0
  );

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'script': return '📖';
      case 'playwright': return '✍️';
      case 'genre': return '🎭';
      case 'theme': return '💡';
      default: return '🔍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'script': return 'bg-primary/10 text-primary';
      case 'playwright': return 'bg-secondary/10 text-secondary-foreground';
      case 'genre': return 'bg-accent/10 text-accent-foreground';
      case 'theme': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-12 pr-20 py-6 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 transition-all duration-200"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {value && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClear}
              className="h-8 w-8 p-0 hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant={showFilters ? "secondary" : "ghost"}
            onClick={onFilterToggle}
            className={cn(
              "h-8 w-8 p-0",
              showFilters ? "bg-white/20" : "hover:bg-white/20"
            )}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto theater-card animate-fade-in">
          <CardContent className="p-0">
            {/* Recent Searches */}
            {value === "" && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleSuggestionClick(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Search Suggestions */}
            {filteredSuggestions.length > 0 && (
              <>
                {value === "" && recentSearches.length > 0 && <Separator />}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Suggestions</span>
                  </div>
                  <div className="space-y-2">
                    {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer group transition-colors"
                        onClick={() => handleSuggestionClick(suggestion.value)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                          <div>
                            <div className="font-medium group-hover:text-primary transition-colors">
                              {suggestion.value}
                            </div>
                            <div className={cn("text-xs px-2 py-1 rounded-full inline-block", getTypeColor(suggestion.type))}>
                              {suggestion.type}
                            </div>
                          </div>
                        </div>
                        {suggestion.count && (
                          <Badge variant="outline" className="text-xs">
                            {suggestion.count}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* No Results */}
            {value !== "" && filteredSuggestions.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2" />
                <p>No suggestions found for "{value}"</p>
                <p className="text-xs">Press Enter to search anyway</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};