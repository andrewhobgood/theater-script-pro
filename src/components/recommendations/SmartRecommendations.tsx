import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  ThumbsUp, 
  Eye, 
  Heart, 
  TrendingUp, 
  Clock,
  Users,
  Star,
  DollarSign,
  Info,
  X,
  Lightbulb,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecommendationReason {
  type: 'similar_genre' | 'same_playwright' | 'similar_theme' | 'trending' | 'your_history' | 'cast_size' | 'price_range';
  label: string;
  confidence: number;
  description: string;
}

interface RecommendedScript {
  id: string;
  title: string;
  playwright: string;
  genre: string[];
  rating: number;
  price: number;
  duration: number;
  castSize: number;
  thumbnail: string;
  reasons: RecommendationReason[];
  matchScore: number;
  isNew?: boolean;
  isTrending?: boolean;
}

interface SmartRecommendationsProps {
  recommendations: RecommendedScript[];
  onScriptClick: (scriptId: string) => void;
  onDismissRecommendation: (scriptId: string) => void;
  className?: string;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  recommendations,
  onScriptClick,
  onDismissRecommendation,
  className
}) => {
  const [expandedScript, setExpandedScript] = useState<string | null>(null);

  const getReasonIcon = (type: string) => {
    switch (type) {
      case 'similar_genre': return '🎭';
      case 'same_playwright': return '✍️';
      case 'similar_theme': return '💡';
      case 'trending': return '🔥';
      case 'your_history': return '📚';
      case 'cast_size': return '👥';
      case 'price_range': return '💰';
      default: return '⭐';
    }
  };

  const getReasonColor = (type: string) => {
    switch (type) {
      case 'similar_genre': return 'bg-purple-100 text-purple-800';
      case 'same_playwright': return 'bg-blue-100 text-blue-800';
      case 'similar_theme': return 'bg-green-100 text-green-800';
      case 'trending': return 'bg-red-100 text-red-800';
      case 'your_history': return 'bg-yellow-100 text-yellow-800';
      case 'cast_size': return 'bg-indigo-100 text-indigo-800';
      case 'price_range': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Smart Recommendations</h2>
        <Badge variant="secondary" className="ml-auto">
          {recommendations.length} suggestions
        </Badge>
      </div>

      <div className="grid gap-4">
        {recommendations.map((script) => (
          <Card key={script.id} className="theater-card hover:shadow-lg transition-all duration-200">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Script Thumbnail */}
                  <div className="w-16 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📖</span>
                  </div>

                  {/* Script Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{script.title}</h3>
                          {script.isNew && (
                            <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
                          )}
                          {script.isTrending && (
                            <Badge className="bg-red-500 text-white text-xs flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              TRENDING
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{script.playwright}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={cn("px-2 py-1 rounded-full text-xs font-medium", getMatchScoreColor(script.matchScore))}>
                          {script.matchScore}% match
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDismissRecommendation(script.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Script Details */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{script.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${script.price}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{script.duration}m</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{script.castSize}</span>
                      </div>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {script.genre.map(g => (
                        <Badge key={g} variant="outline" className="text-xs">{g}</Badge>
                      ))}
                    </div>

                    {/* Top Recommendation Reasons */}
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Why this match:</span>
                      <div className="flex flex-wrap gap-1">
                        {script.reasons.slice(0, 2).map((reason, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <span>{getReasonIcon(reason.type)}</span>
                            <span className="text-xs text-muted-foreground">{reason.label}</span>
                          </div>
                        ))}
                        {script.reasons.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedScript(expandedScript === script.id ? null : script.id)}
                            className="h-auto p-1 text-xs text-primary"
                          >
                            +{script.reasons.length - 2} more
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Reasons */}
                    {expandedScript === script.id && (
                      <div className="border-t pt-3 space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">All recommendation factors:</span>
                        </div>
                        {script.reasons.map((reason, index) => (
                          <div key={index} className="flex items-center gap-3 text-sm">
                            <div className={cn("px-2 py-1 rounded-full text-xs font-medium", getReasonColor(reason.type))}>
                              {getReasonIcon(reason.type)} {reason.label}
                            </div>
                            <div className="flex-1">
                              <div className="text-muted-foreground">{reason.description}</div>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                <div 
                                  className="bg-primary h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${reason.confidence}%` }}
                                />
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {reason.confidence}%
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-4">
                      <Button 
                        onClick={() => onScriptClick(script.id)}
                        className="spotlight-button flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recommendations.length === 0 && (
        <Card className="theater-card">
          <CardContent className="p-8 text-center">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Recommendations Yet</h3>
            <p className="text-muted-foreground">
              Browse some scripts to help us understand your preferences and get personalized recommendations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};