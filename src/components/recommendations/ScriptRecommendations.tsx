import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScriptCard } from '@/components/scripts/ScriptCard';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Star, 
  Heart,
  Clock,
  RefreshCw,
  Brain,
  Target,
  Lightbulb
} from 'lucide-react';
import { mockScripts } from '@/lib/mock-data';

interface RecommendationEngine {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  scripts: any[];
  reasoning?: string[];
}

interface UserPreferences {
  favoriteGenres: string[];
  preferredCastSize: { min: number; max: number };
  preferredDuration: { min: number; max: number };
  themes: string[];
  difficulty: string[];
  viewHistory: string[];
  favoritePlaywrights: string[];
}

export const ScriptRecommendations: React.FC = () => {
  const [userPreferences] = useState<UserPreferences>({
    favoriteGenres: ['Drama', 'Comedy'],
    preferredCastSize: { min: 5, max: 15 },
    preferredDuration: { min: 90, max: 180 },
    themes: ['Family', 'Love', 'Coming of Age'],
    difficulty: ['Intermediate', 'Advanced'],
    viewHistory: ['hamlet-2024', 'romeo-juliet-2024'],
    favoritePlaywrights: ['William Shakespeare']
  });

  const [engines, setEngines] = useState<RecommendationEngine[]>([]);
  const [activeEngine, setActiveEngine] = useState<string>('ai-powered');

  useEffect(() => {
    generateRecommendations();
  }, []);

  const generateRecommendations = () => {
    // AI-Powered Recommendations
    const aiRecommendations = mockScripts
      .filter(script => 
        script.genre.some(g => userPreferences.favoriteGenres.includes(g)) ||
        script.themes.some(t => userPreferences.themes.includes(t))
      )
      .slice(0, 6);

    // Trending Scripts
    const trendingScripts = [...mockScripts]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    // Similar to Viewed
    const similarScripts = mockScripts
      .filter(script => !userPreferences.viewHistory.includes(script.id))
      .slice(0, 6);

    // Based on Cast Size
    const castSizeRecommendations = mockScripts
      .filter(script => 
        script.castSize.min >= userPreferences.preferredCastSize.min &&
        script.castSize.max <= userPreferences.preferredCastSize.max
      )
      .slice(0, 6);

    setEngines([
      {
        id: 'ai-powered',
        name: 'AI Recommendations',
        description: 'Personalized suggestions based on your viewing history and preferences',
        icon: Brain,
        scripts: aiRecommendations,
        reasoning: [
          'Matches your favorite genres: Drama, Comedy',
          'Contains themes you enjoy: Family, Love',
          'Similar to scripts you\'ve viewed recently',
          'Appropriate difficulty level for your experience'
        ]
      },
      {
        id: 'trending',
        name: 'Trending Now',
        description: 'Popular scripts currently being licensed by theater companies',
        icon: TrendingUp,
        scripts: trendingScripts,
        reasoning: [
          'High licensing activity this month',
          'Positive reviews from recent productions',
          'Rising popularity among directors',
          'Featured in theater industry publications'
        ]
      },
      {
        id: 'similar',
        name: 'More Like These',
        description: 'Scripts similar to ones you\'ve recently viewed or favorited',
        icon: Target,
        scripts: similarScripts,
        reasoning: [
          'Similar themes to Hamlet and Romeo & Juliet',
          'Same playwright: William Shakespeare',
          'Comparable cast size requirements',
          'Classical drama genre preference'
        ]
      },
      {
        id: 'cast-size',
        name: 'Perfect Cast Size',
        description: 'Scripts that match your preferred cast size requirements',
        icon: Users,
        scripts: castSizeRecommendations,
        reasoning: [
          `Optimal for ${userPreferences.preferredCastSize.min}-${userPreferences.preferredCastSize.max} actor casts`,
          'Flexible casting options available',
          'Suitable for your venue capacity',
          'Cost-effective production requirements'
        ]
      }
    ]);
  };

  const refreshRecommendations = () => {
    generateRecommendations();
  };

  const currentEngine = engines.find(e => e.id === activeEngine) || engines[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold theater-heading flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Recommended for You
          </h2>
          <p className="text-muted-foreground">
            Discover your next great production with AI-powered recommendations
          </p>
        </div>
        
        <Button variant="outline" onClick={refreshRecommendations}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeEngine} onValueChange={setActiveEngine} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {engines.map(engine => (
            <TabsTrigger key={engine.id} value={engine.id} className="flex items-center gap-2">
              <engine.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{engine.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {engines.map(engine => (
          <TabsContent key={engine.id} value={engine.id} className="space-y-6">
            {/* Engine Info */}
            <Card className="theater-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <engine.icon className="h-5 w-5 text-primary" />
                  {engine.name}
                </CardTitle>
                <p className="text-muted-foreground">{engine.description}</p>
              </CardHeader>
              
              {engine.reasoning && (
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Why these recommendations?
                    </h4>
                    <ul className="space-y-1">
                      {engine.reasoning.map((reason, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Recommended Scripts */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {engine.scripts.map(script => (
                <div key={script.id} className="relative">
                  {engine.id === 'ai-powered' && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 left-2 z-10 bg-gradient-to-r from-primary to-accent text-white"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      AI Pick
                    </Badge>
                  )}
                  {engine.id === 'trending' && (
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  <ScriptCard script={script} />
                </div>
              ))}
            </div>

            {engine.scripts.length === 0 && (
              <Card className="theater-card p-12 text-center">
                <engine.icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
                <p className="text-muted-foreground mb-4">
                  We need more data about your preferences to generate personalized recommendations.
                </p>
                <Button variant="outline">
                  Update Preferences
                </Button>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Recommendation Insights */}
      <Card className="theater-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Your Recommendation Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Favorite Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {userPreferences.favoriteGenres.map(genre => (
                    <Badge key={genre} variant="secondary">{genre}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Preferred Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {userPreferences.themes.map(theme => (
                    <Badge key={theme} variant="outline">{theme}</Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Production Preferences</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Cast Size: {userPreferences.preferredCastSize.min}-{userPreferences.preferredCastSize.max} actors
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration: {userPreferences.preferredDuration.min}-{userPreferences.preferredDuration.max} minutes
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Recent Activity</h4>
                <p className="text-sm text-muted-foreground">
                  Based on {userPreferences.viewHistory.length} recently viewed scripts
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};