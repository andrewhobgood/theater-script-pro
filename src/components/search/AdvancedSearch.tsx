import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Search, Filter } from 'lucide-react';

export const AdvancedSearch = () => {
  const [filters, setFilters] = useState({
    query: '',
    genre: [],
    duration: [60, 180],
    rating: [4, 5],
    status: 'all',
    language: 'all',
    castSize: [2, 20]
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Advanced Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="search">Search Query</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search scripts, titles, authors..."
              value={filters.query}
              onChange={(e) => setFilters({...filters, query: e.target.value})}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label>Duration (minutes): {filters.duration[0]} - {filters.duration[1]}</Label>
          <Slider
            value={filters.duration}
            onValueChange={(value) => setFilters({...filters, duration: value})}
            max={300}
            min={15}
            step={15}
            className="mt-2"
          />
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Search Scripts
          </Button>
          <Button variant="outline">Clear All</Button>
        </div>
      </CardContent>
    </Card>
  );
};