
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Heart, Eye, Download, Clock, Users, BookOpen, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface ScriptCardProps {
  script: {
    id: string;
    title: string;
    playwright: string;
    description: string;
    genre: string[];
    duration: number;
    castSize: { min: number; max: number; flexible: boolean };
    ageRating: string;
    standard_price: number;
    premium_price: number;
    educational_price: number;
    difficulty: string;
    thumbnail?: string;
    isFeatured?: boolean;
  };
  compact?: boolean;
  viewMode?: 'grid' | 'list';
}

export const ScriptCard = ({ script, compact = false, viewMode = 'grid' }: ScriptCardProps) => {
  if (compact) {
    return (
      <Card className="theater-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-16 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <Link to={`/scripts/${script.id}`} className="story-link">
                <h3 className="font-semibold text-sm truncate">{script.title}</h3>
              </Link>
              <p className="text-xs text-muted-foreground">{script.playwright}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">${script.standard_price}</Badge>
                <Badge variant="outline" className="text-xs">{script.difficulty}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="theater-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
      <div className="relative">
        <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
          {script.thumbnail ? (
            <img src={script.thumbnail} alt={script.title} className="w-full h-full object-cover rounded-t-lg" />
          ) : (
            <BookOpen className="h-12 w-12 text-primary" />
          )}
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link to={`/scripts/${script.id}`} className="story-link">
              <CardTitle className="text-lg leading-tight">{script.title}</CardTitle>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <Avatar className="h-5 w-5">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">
                  {script.playwright.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{script.playwright}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-primary">${script.standard_price}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-current text-yellow-400" />
              <span>4.8</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="text-sm line-clamp-2 mb-3">
          {script.description}
        </CardDescription>

        <div className="flex flex-wrap gap-1 mb-3">
          {script.genre.slice(0, 2).map((g) => (
            <Badge key={g} variant="secondary" className="text-xs">
              {g}
            </Badge>
          ))}
          {script.genre.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{script.genre.length - 2}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{script.duration}min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{script.castSize.min}-{script.castSize.max}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs">{script.ageRating}</span>
          </div>
        </div>

        <Separator className="mb-4" />

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button size="sm" className="flex-1 spotlight-button">
            <Download className="h-4 w-4 mr-1" />
            License
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
