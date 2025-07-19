import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { mockScripts } from "@/lib/mock-data";
import { ScriptCard } from "@/components/scripts/ScriptCard";
import { ScriptReader } from "@/components/reader/ScriptReader";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Heart, 
  Share2, 
  Download, 
  Eye, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  ChevronLeft,
  Play,
  ShoppingCart,
  Bookmark,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Sparkles,
  CheckCircle
} from "lucide-react";

const ScriptDetail = () => {
  const { id } = useParams();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReader, setShowReader] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock script data - in real app, fetch by ID
  const script = mockScripts.find(s => s.id === id) || mockScripts[0];
  const relatedScripts = mockScripts.filter(s => s.id !== script.id).slice(0, 3);

  const mockReviews = [
    {
      id: "1",
      user: "Theater Director",
      avatar: "TD",
      rating: 5,
      comment: "Absolutely brilliant! Our production was a huge success. The characters are well-developed and the dialogue is engaging.",
      date: "2024-01-15",
      helpful: 24,
      verified: true
    },
    {
      id: "2", 
      user: "Sarah K.",
      avatar: "SK",
      rating: 4,
      comment: "Great script with strong themes. Some technical requirements were challenging but worth it.",
      date: "2024-01-10",
      helpful: 12,
      verified: false
    },
    {
      id: "3",
      user: "Mike R.",
      avatar: "MR", 
      rating: 5,
      comment: "Perfect for our community theater. The audience loved every moment. Highly recommend!",
      date: "2024-01-08",
      helpful: 8,
      verified: true
    }
  ];

  const mockLicenseOptions = [
    {
      id: "perusal",
      name: "Perusal License",
      description: "Read-only access for evaluation purposes",
      price: 15,
      duration: "30 days",
      popular: false,
      includes: ["Watermarked script", "Character breakdown", "Synopsis"],
      restrictions: ["No performance rights", "Evaluation only"]
    },
    {
      id: "educational",
      name: "Educational License", 
      description: "Perfect for schools and educational institutions",
      price: 75,
      duration: "1 year",
      popular: true,
      includes: ["Full script", "Director's notes", "Study materials", "Performance rights"],
      restrictions: ["Non-profit performances only", "Educational venues only"]
    },
    {
      id: "standard",
      name: "Standard License",
      description: "Full production rights for professional theaters",
      price: script.price,
      duration: "6 months", 
      popular: false,
      includes: ["Full script", "Performance rights", "Marketing materials", "Technical specs"],
      restrictions: ["Venue capacity limits apply", "Royalty payments required"]
    }
  ];

  // Mock script content for reader
  const mockScriptContent = [
    `ACT I
SCENE I. Elsinore. A platform before the castle.

FRANCISCO at his post. Enter to him BERNARDO

BERNARDO
Who's there?

FRANCISCO
Nay, answer me: stand, and unfold yourself.

BERNARDO
Long live the king!

FRANCISCO
Bernardo?

BERNARDO
He.

FRANCISCO
You come most carefully upon your hour.

BERNARDO
'Tis now struck twelve; get thee to bed, Francisco.`,
    
    `FRANCISCO
For this relief much thanks: 'tis bitter cold,
And I am sick at heart.

BERNARDO
Have you had quiet guard?

FRANCISCO
Not a mouse stirring.

BERNARDO
Well, good night.
If you do meet Horatio and Marcellus,
The rivals of my watch, bid them make haste.

FRANCISCO
I think I hear them. Stand, ho! Who's there?

Enter HORATIO and MARCELLUS`,
    
    // Add more pages as needed...
  ];

  const handleLicensePurchase = async (licenseId: string) => {
    setIsLoading(true);
    setSelectedLicense(licenseId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    // Handle success/redirect to checkout
  };

  const handleAddToWishlist = () => {
    setIsFavorited(!isFavorited);
    // Show toast notification
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <Link to="/scripts" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Scripts
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Header */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=400&fit=crop" 
                  alt="Script preview"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <BookOpen className="absolute bottom-4 right-4 h-8 w-8 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold theater-heading mb-2">{script.title}</h1>
                    {script.subtitle && (
                      <p className="text-xl text-muted-foreground mb-3">{script.subtitle}</p>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      <Link to={`/playwrights/${script.playwrightId}`} className="story-link group">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-xs">
                              {script.playwright.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-lg font-medium group-hover:text-primary transition-colors">{script.playwright}</span>
                        </div>
                      </Link>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                        <span className="font-medium">4.8</span>
                        <span>({mockReviews.length} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>1,247 views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>342 licenses</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <EnhancedButton
                      variant="outline"
                      size="sm"
                      onClick={handleAddToWishlist}
                      icon={<Heart className={`h-4 w-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />}
                    />
                    <EnhancedButton 
                      variant="outline" 
                      size="sm"
                      icon={<Share2 className="h-4 w-4" />}
                    />
                    <EnhancedButton 
                      variant="outline" 
                      size="sm"
                      icon={<MoreHorizontal className="h-4 w-4" />}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {script.genre.map((g) => (
                    <Badge key={g} variant="secondary">{g}</Badge>
                  ))}
                  <Badge variant="outline">{script.difficulty}</Badge>
                  <Badge variant="outline">{script.ageRating}</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{script.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{script.castSize.min}-{script.castSize.max} cast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{script.pages} pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{script.publicationYear}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  <EnhancedButton
                    variant="theater"
                    onClick={() => setShowReader(true)}
                    icon={<Eye className="h-4 w-4" />}
                  >
                    Preview Script
                  </EnhancedButton>
                  <EnhancedButton
                    variant="spotlight"
                    icon={<ShoppingCart className="h-4 w-4" />}
                  >
                    License Now
                  </EnhancedButton>
                  <EnhancedButton
                    variant="outline"
                    icon={<Bookmark className="h-4 w-4" />}
                  >
                    Save for Later
                  </EnhancedButton>
                </div>
              </div>
            </div>

            {/* Enhanced Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="characters">Characters</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({mockReviews.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 animate-fade-in">
                <Card className="theater-card">
                  <CardHeader>
                    <CardTitle>Synopsis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {script.description}
                    </p>
                    
                    <Separator className="my-6" />
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          Themes
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {script.themes.map((theme) => (
                            <Badge key={theme} variant="outline">{theme}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-3">Content Warnings</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>• Violence and sword fighting</p>
                          <p>• Adult themes and language</p>
                          <p>• Mature content</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="characters" className="mt-6 animate-fade-in">
                <Card className="theater-card">
                  <CardHeader>
                    <CardTitle>Character Breakdown</CardTitle>
                    <CardDescription>
                      Cast size: {script.castSize.min}-{script.castSize.max} actors
                      {script.castSize.flexible && " (flexible casting available)"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {script.characters && script.characters.length > 0 ? (
                        script.characters.map((character, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-lg">{character.name}</h4>
                                  {character.isLead && (
                                    <Badge variant="secondary">Lead Role</Badge>
                                  )}
                                </div>
                                <p className="text-muted-foreground mb-3">{character.description}</p>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Age:</span> {character.ageRange}
                                  </div>
                                  <div>
                                    <span className="font-medium">Gender:</span> {character.gender}
                                  </div>
                                  {character.voiceType && (
                                    <div>
                                      <span className="font-medium">Voice:</span> {character.voiceType}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <EmptyState
                          icon={<Users className="h-12 w-12" />}
                          title="Character details available with license"
                          description="Full character breakdown, casting notes, and audition materials are included with your license purchase."
                          size="sm"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technical" className="mt-6 animate-fade-in">
                <Card className="theater-card">
                  <CardHeader>
                    <CardTitle>Technical Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Sets & Locations
                      </h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {script.sets.map((set, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <span>{set}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {script.specialRequirements && script.specialRequirements.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Special Requirements
                        </h4>
                        <div className="space-y-2">
                          {script.specialRequirements.map((req, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h5 className="font-medium mb-2">Complete Package Includes:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Detailed lighting plots and cues</li>
                        <li>• Sound design specifications</li>
                        <li>• Costume and makeup guidelines</li>
                        <li>• Set construction blueprints</li>
                        <li>• Prop requirements list</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 animate-fade-in">
                <Card className="theater-card">
                  <CardHeader>
                    <CardTitle>Reviews & Ratings</CardTitle>
                    <CardDescription>Based on {mockReviews.length} verified reviews</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-5xl font-bold theater-heading">4.8</div>
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="h-5 w-5 fill-current text-yellow-400" />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground">Average rating</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {[5,4,3,2,1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-2">{rating}</span>
                            <Star className="h-3 w-3 fill-current text-yellow-400" />
                            <Progress value={rating === 5 ? 80 : rating === 4 ? 20 : 0} className="flex-1" />
                            <span className="text-sm text-muted-foreground w-8">
                              {rating === 5 ? '20' : rating === 4 ? '4' : '0'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      {mockReviews.map((review) => (
                        <div key={review.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="text-sm">{review.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{review.user}</p>
                                  {review.verified && (
                                    <Badge variant="outline" className="text-xs">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                  {[1,2,3,4,5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`h-3 w-3 ${star <= review.rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                  <span className="text-xs text-muted-foreground ml-2">{review.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{review.comment}</p>
                          <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" className="text-xs">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Helpful ({review.helpful})
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Licensing Options */}
            <Card className="theater-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Licensing Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockLicenseOptions.map((option) => (
                  <div key={option.id} className={`border rounded-lg p-4 space-y-3 hover:shadow-md transition-all cursor-pointer ${option.popular ? 'border-primary bg-primary/5' : ''}`}>
                    {option.popular && (
                      <Badge variant="default" className="mb-2">Most Popular</Badge>
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{option.name}</h4>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${option.price}</div>
                        <div className="text-xs text-muted-foreground">{option.duration}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-xs font-medium">Includes:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {option.includes.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>

                    <EnhancedButton
                      variant={option.popular ? "theater" : "outline"}
                      className="w-full"
                      loading={isLoading && selectedLicense === option.id}
                      onClick={() => handleLicensePurchase(option.id)}
                      icon={<ShoppingCart className="h-4 w-4" />}
                    >
                      {option.id === 'perusal' ? 'Preview' : 'License'} ${option.price}
                    </EnhancedButton>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Related Scripts */}
            <Card className="theater-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Related Scripts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedScripts.map((relatedScript) => (
                  <ScriptCard key={relatedScript.id} script={relatedScript} compact />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Script Reader Modal */}
      {showReader && (
        <ScriptReader
          scriptId={script.id}
          scriptTitle={script.title}
          scriptContent={mockScriptContent}
          onClose={() => setShowReader(false)}
        />
      )}
    </div>
  );
};

export default ScriptDetail;