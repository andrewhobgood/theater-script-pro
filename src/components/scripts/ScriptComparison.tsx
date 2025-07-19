import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, 
  Star, 
  Clock, 
  Users, 
  DollarSign, 
  Award, 
  Calendar,
  Eye,
  Download,
  Heart,
  GitCompare,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Script {
  id: string;
  title: string;
  playwright: string;
  genre: string[];
  themes: string[];
  description: string;
  duration: number;
  castSize: number;
  price: number;
  rating: number;
  reviews: number;
  difficulty: string;
  ageRating: string;
  publicationYear: number;
  awards: string[];
  synopsis: string;
  characters: { name: string; description: string }[];
  technicalRequirements: string[];
  royaltyInfo: string;
}

interface ScriptComparisonProps {
  scripts: Script[];
  onClose: () => void;
  onRemoveScript: (scriptId: string) => void;
}

export const ScriptComparison: React.FC<ScriptComparisonProps> = ({
  scripts,
  onClose,
  onRemoveScript
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'characters' | 'technical'>('overview');

  if (scripts.length === 0) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <GitCompare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Scripts to Compare</h3>
            <p className="text-muted-foreground mb-4">Add scripts to your comparison to get started.</p>
            <Button onClick={onClose}>Close</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ComparisonRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="border-b">
      <div className="grid grid-cols-[200px_1fr] gap-4 p-4">
        <div className="font-medium text-muted-foreground">{label}</div>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${scripts.length}, 1fr)` }}>
          {children}
        </div>
      </div>
    </div>
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'professional': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Script Comparison ({scripts.length} scripts)
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'details', label: 'Details' },
              { id: 'characters', label: 'Characters' },
              { id: 'technical', label: 'Technical' }
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className="flex-1"
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[60vh]">
            {/* Script Headers */}
            <div className="sticky top-0 bg-background border-b z-10">
              <div className="grid grid-cols-[200px_1fr] gap-4 p-4">
                <div></div>
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${scripts.length}, 1fr)` }}>
                  {scripts.map(script => (
                    <div key={script.id} className="text-center">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold truncate">{script.title}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveScript(script.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{script.playwright}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <ComparisonRow label="Rating">
                  {scripts.map(script => (
                    <div key={script.id} className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{script.rating}</span>
                      <span className="text-sm text-muted-foreground">({script.reviews})</span>
                    </div>
                  ))}
                </ComparisonRow>

                <ComparisonRow label="Price">
                  {scripts.map(script => (
                    <div key={script.id} className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">${script.price}</span>
                    </div>
                  ))}
                </ComparisonRow>

                <ComparisonRow label="Duration">
                  {scripts.map(script => (
                    <div key={script.id} className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>{script.duration} min</span>
                    </div>
                  ))}
                </ComparisonRow>

                <ComparisonRow label="Cast Size">
                  {scripts.map(script => (
                    <div key={script.id} className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span>{script.castSize} actors</span>
                    </div>
                  ))}
                </ComparisonRow>

                <ComparisonRow label="Difficulty">
                  {scripts.map(script => (
                    <Badge key={script.id} className={cn("text-xs", getDifficultyColor(script.difficulty))}>
                      {script.difficulty}
                    </Badge>
                  ))}
                </ComparisonRow>

                <ComparisonRow label="Age Rating">
                  {scripts.map(script => (
                    <Badge key={script.id} variant="outline">{script.ageRating}</Badge>
                  ))}
                </ComparisonRow>

                <ComparisonRow label="Genres">
                  {scripts.map(script => (
                    <div key={script.id} className="flex flex-wrap gap-1">
                      {script.genre.map(g => (
                        <Badge key={g} variant="secondary" className="text-xs">{g}</Badge>
                      ))}
                    </div>
                  ))}
                </ComparisonRow>

                <ComparisonRow label="Awards">
                  {scripts.map(script => (
                    <div key={script.id}>
                      {script.awards.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm">{script.awards.length} awards</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">No awards</span>
                      )}
                    </div>
                  ))}
                </ComparisonRow>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div>
                <ComparisonRow label="Synopsis">
                  {scripts.map(script => (
                    <div key={script.id} className="text-sm">
                      {script.synopsis.substring(0, 150)}...
                    </div>
                  ))}
                </ComparisonRow>

                <ComparisonRow label="Themes">
                  {scripts.map(script => (
                    <div key={script.id} className="flex flex-wrap gap-1">
                      {script.themes.map(theme => (
                        <Badge key={theme} variant="outline" className="text-xs">{theme}</Badge>
                      ))}
                    </div>
                  ))}
                </ComparisonRow>

                <ComparisonRow label="Publication">
                  {scripts.map(script => (
                    <div key={script.id} className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span>{script.publicationYear}</span>
                    </div>
                  ))}
                </ComparisonRow>

                <ComparisonRow label="Royalty Info">
                  {scripts.map(script => (
                    <div key={script.id} className="text-sm text-muted-foreground">
                      {script.royaltyInfo}
                    </div>
                  ))}
                </ComparisonRow>
              </div>
            )}

            {/* Characters Tab */}
            {activeTab === 'characters' && (
              <div>
                <ComparisonRow label="Main Characters">
                  {scripts.map(script => (
                    <div key={script.id} className="space-y-2">
                      {script.characters.slice(0, 3).map(char => (
                        <div key={char.name} className="text-sm">
                          <div className="font-medium">{char.name}</div>
                          <div className="text-muted-foreground text-xs">
                            {char.description.substring(0, 60)}...
                          </div>
                        </div>
                      ))}
                      {script.characters.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{script.characters.length - 3} more characters
                        </div>
                      )}
                    </div>
                  ))}
                </ComparisonRow>
              </div>
            )}

            {/* Technical Tab */}
            {activeTab === 'technical' && (
              <div>
                <ComparisonRow label="Technical Requirements">
                  {scripts.map(script => (
                    <div key={script.id} className="space-y-1">
                      {script.technicalRequirements.map(req => (
                        <div key={req} className="text-sm flex items-center gap-1">
                          <div className="w-1 h-1 bg-primary rounded-full"></div>
                          {req}
                        </div>
                      ))}
                    </div>
                  ))}
                </ComparisonRow>
              </div>
            )}
          </ScrollArea>

          {/* Action Buttons */}
          <div className="border-t p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Comparing {scripts.length} scripts
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>
                  Close Comparison
                </Button>
                <Button className="spotlight-button">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};