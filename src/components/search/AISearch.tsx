import React, { useState, useCallback, useEffect } from 'react';
import { Search, Sparkles, Filter, Clock, TrendingUp, Brain, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface AISearchResult {
  id: string;
  title: string;
  author: string;
  relevanceScore: number;
  explanation: string;
  matchedConcepts: string[];
  semanticSimilarity: number;
  contextHighlights: string[];
}

interface SearchSuggestion {
  text: string;
  type: 'semantic' | 'trending' | 'recent' | 'similar';
  confidence: number;
}

interface AISearchProps {
  onSearchResults?: (results: AISearchResult[]) => void;
}

export function AISearch({ onSearchResults }: AISearchProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState<'natural' | 'semantic' | 'contextual'>('natural');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<AISearchResult[]>([]);

  // Mock AI search suggestions
  const mockSuggestions: SearchSuggestion[] = [
    {
      text: "romantic comedies with strong female leads",
      type: "semantic",
      confidence: 0.92
    },
    {
      text: "plays about family dynamics and generational conflict", 
      type: "trending",
      confidence: 0.88
    },
    {
      text: "contemporary dramas set in urban environments",
      type: "similar",
      confidence: 0.85
    },
    {
      text: "musical theater scripts with ensemble casts",
      type: "recent",
      confidence: 0.91
    }
  ];

  // Mock AI search results
  const mockResults: AISearchResult[] = [
    {
      id: '1',
      title: 'Urban Hearts',
      author: 'Maya Chen',
      relevanceScore: 0.94,
      explanation: 'This script matches your search for contemporary relationship drama with 94% confidence based on themes of urban romance, character development, and emotional depth.',
      matchedConcepts: ['romance', 'contemporary', 'character-driven', 'emotional'],
      semanticSimilarity: 0.89,
      contextHighlights: [
        'explores modern relationships in city settings',
        'features complex character interactions',
        'award-winning dialogue and emotional resonance'
      ]
    },
    {
      id: '2', 
      title: 'The Space Between',
      author: 'David Rodriguez',
      relevanceScore: 0.87,
      explanation: 'Strong thematic alignment with your search query, particularly in character development and contemporary themes.',
      matchedConcepts: ['drama', 'relationships', 'contemporary', 'psychological'],
      semanticSimilarity: 0.82,
      contextHighlights: [
        'psychological depth in character portrayals',
        'explores themes of connection and isolation',
        'critically acclaimed contemporary drama'
      ]
    }
  ];

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    
    // Add to recent searches
    setRecentSearches(prev => [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5));

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI search logic
    const searchResults = mockResults.filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.matchedConcepts.some(concept => 
        searchQuery.toLowerCase().includes(concept.toLowerCase())
      )
    );

    setResults(searchResults);
    onSearchResults?.(searchResults);
    setIsSearching(false);
  }, [onSearchResults]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    
    // Generate contextual suggestions based on input
    if (value.length > 2) {
      const relevantSuggestions = mockSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(value.toLowerCase()) ||
        value.toLowerCase().includes(suggestion.text.toLowerCase())
      );
      setSuggestions(relevantSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'semantic': return Brain;
      case 'trending': return TrendingUp;
      case 'recent': return Clock;
      case 'similar': return Sparkles;
      default: return Search;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Search Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Search
          </CardTitle>
          <p className="text-muted-foreground">
            Use natural language to find scripts that match your creative vision
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Mode Selector */}
          <Tabs value={searchMode} onValueChange={(value) => setSearchMode(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="natural">Natural Language</TabsTrigger>
              <TabsTrigger value="semantic">Semantic Search</TabsTrigger>
              <TabsTrigger value="contextual">Contextual</TabsTrigger>
            </TabsList>

            <TabsContent value="natural" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Describe what you're looking for... e.g., 'funny plays about family relationships'"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                />
                {isSearching && (
                  <div className="absolute right-3 top-3">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="semantic" className="space-y-4">
              <div className="relative">
                <Brain className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter concepts, themes, or emotions... e.g., 'betrayal redemption family'"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                />
              </div>
            </TabsContent>

            <TabsContent value="contextual" className="space-y-4">
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Describe the context or setting... e.g., 'workplace comedy in modern office'"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={() => handleSearch(query)} 
            disabled={!query.trim() || isSearching}
            className="w-full"
          >
            {isSearching ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-pulse" />
                AI Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Search with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Smart Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => {
                const Icon = getSuggestionIcon(suggestion.type);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => {
                      setQuery(suggestion.text);
                      handleSearch(suggestion.text);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-primary" />
                      <span className="text-sm">{suggestion.text}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {(suggestion.confidence * 100).toFixed(0)}% match
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {suggestion.type}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => {
                    setQuery(search);
                    handleSearch(search);
                  }}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI Search Results</h3>
          {results.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{result.title}</h4>
                    <p className="text-muted-foreground">by {result.author}</p>
                  </div>
                  <div className="text-right">
                    <Badge className="mb-2">{(result.relevanceScore * 100).toFixed(0)}% Match</Badge>
                    <div className="text-sm text-muted-foreground">
                      Semantic: {(result.semanticSimilarity * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-primary/5 p-3 rounded-lg">
                    <p className="text-sm font-medium mb-1 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      AI Explanation
                    </p>
                    <p className="text-sm text-muted-foreground">{result.explanation}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Matched Concepts</p>
                    <div className="flex flex-wrap gap-1">
                      {result.matchedConcepts.map((concept, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Key Highlights</p>
                    <ul className="space-y-1">
                      {result.contextHighlights.map((highlight, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Progress value={result.relevanceScore * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Relevance Score: {(result.relevanceScore * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}