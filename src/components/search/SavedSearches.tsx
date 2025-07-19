import { useState } from "react";
import { Bookmark, Plus, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: {
    genres?: string[];
    priceRange?: [number, number];
    castSize?: [number, number];
    duration?: [number, number];
  };
  resultCount: number;
  createdAt: Date;
}

interface SavedSearchesProps {
  onLoadSearch: (search: SavedSearch) => void;
  currentSearch?: {
    query: string;
    filters: any;
  };
}

export const SavedSearches = ({ onLoadSearch, currentSearch }: SavedSearchesProps) => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    {
      id: '1',
      name: 'Small Cast Comedies',
      query: 'comedy',
      filters: {
        genres: ['Comedy'],
        castSize: [2, 6]
      },
      resultCount: 24,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2', 
      name: 'Contemporary Dramas',
      query: 'contemporary',
      filters: {
        genres: ['Drama', 'Contemporary'],
        duration: [90, 180]
      },
      resultCount: 45,
      createdAt: new Date('2024-01-10')
    },
    {
      id: '3',
      name: 'Family-Friendly Shows',
      query: 'family',
      filters: {
        genres: ['Family', 'Comedy'],
        priceRange: [0, 100]
      },
      resultCount: 18,
      createdAt: new Date('2024-01-08')
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');

  const handleSaveCurrentSearch = () => {
    if (!currentSearch || !searchName.trim()) return;

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName.trim(),
      query: currentSearch.query,
      filters: currentSearch.filters,
      resultCount: 0, // This would be calculated from actual results
      createdAt: new Date()
    };

    setSavedSearches(prev => [newSearch, ...prev]);
    setSearchName('');
    setIsDialogOpen(false);
  };

  const handleDeleteSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== id));
  };

  const formatFilters = (filters: SavedSearch['filters']) => {
    const parts = [];
    
    if (filters.genres?.length) {
      parts.push(`${filters.genres.length} genre${filters.genres.length > 1 ? 's' : ''}`);
    }
    
    if (filters.castSize) {
      parts.push(`${filters.castSize[0]}-${filters.castSize[1]} cast`);
    }
    
    if (filters.duration) {
      parts.push(`${filters.duration[0]}-${filters.duration[1]}min`);
    }
    
    if (filters.priceRange) {
      parts.push(`$${filters.priceRange[0]}-${filters.priceRange[1]}`);
    }

    return parts.join(' • ');
  };

  return (
    <Card className="theater-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Bookmark className="h-4 w-4" />
            Saved Searches
          </CardTitle>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" disabled={!currentSearch?.query}>
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Current Search</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="search-name">Search Name</Label>
                  <Input
                    id="search-name"
                    placeholder="Enter a name for this search..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                {currentSearch && (
                  <div className="p-3 bg-muted rounded-lg space-y-2">
                    <div className="text-sm font-medium">Current Search:</div>
                    {currentSearch.query && (
                      <div className="flex items-center gap-2">
                        <Search className="h-3 w-3" />
                        <span className="text-xs">"{currentSearch.query}"</span>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {formatFilters(currentSearch.filters) || 'No filters applied'}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveCurrentSearch} disabled={!searchName.trim()}>
                    Save Search
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {savedSearches.length === 0 ? (
          <div className="text-center py-6">
            <Bookmark className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No saved searches yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
                onClick={() => onLoadSearch(search)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm truncate">{search.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {search.resultCount}
                      </Badge>
                    </div>
                    
                    {search.query && (
                      <div className="flex items-center gap-1 mb-1">
                        <Search className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">"{search.query}"</span>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      {formatFilters(search.filters) || 'No filters'}
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-1">
                      {search.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSearch(search.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};