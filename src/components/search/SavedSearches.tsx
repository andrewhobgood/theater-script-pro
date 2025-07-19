import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Bookmark, Plus } from 'lucide-react';
import { format } from 'date-fns';

export const SavedSearches = () => {
  const [savedSearches] = useState([
    {
      id: '1',
      name: 'Comedy Scripts for Small Cast',
      query: 'comedy small cast',
      filters: { genre: ['Comedy'], duration: [60, 120] },
      createdAt: new Date('2024-01-15'),
      lastUsed: new Date('2024-01-20'),
      useCount: 12,
      isFavorite: true
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Saved Searches</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Save Current Search
        </Button>
      </div>

      <div className="grid gap-4">
        {savedSearches.map(search => (
          <Card key={search.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{search.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Query: "{search.query}"
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Last used: {format(search.lastUsed, 'MMM d, yyyy')}
                  </div>
                </div>
                <Button size="sm">
                  <Search className="h-3 w-3 mr-1" />
                  Run
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};