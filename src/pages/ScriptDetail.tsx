import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { mockScripts } from "@/lib/mock-data";
import { ScriptCard } from "@/components/scripts/ScriptCard";
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
  ChevronLeft
} from "lucide-react";

const ScriptDetail = () => {
  const { id } = useParams();
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Mock script data - in real app, fetch by ID
  const script = mockScripts.find(s => s.id === id) || mockScripts[0];
  const relatedScripts = mockScripts.filter(s => s.id !== script.id).slice(0, 3);

  const mockReviews = [
    {
      id: "1",
      user: "Theater Director",
      rating: 5,
      comment: "Absolutely brilliant! Our production was a huge success. The characters are well-developed and the dialogue is engaging.",
      date: "2024-01-15"
    },
    {
      id: "2", 
      user: "Sarah K.",
      rating: 4,
      comment: "Great script with strong themes. Some technical requirements were challenging but worth it.",
      date: "2024-01-10"
    }
  ];

  const mockLicenseOptions = [
    {
      id: "perusal",
      name: "Perusal License",
      description: "Read-only access for evaluation purposes",
      price: 15,
      duration: "30 days",
      includes: ["Watermarked script", "Character breakdown", "Synopsis"],
      restrictions: ["No performance rights", "Evaluation only"]
    },
    {
      id: "educational",
      name: "Educational License", 
      description: "For schools and educational institutions",
      price: 75,
      duration: "1 year",
      includes: ["Full script", "Director's notes", "Study materials", "Performance rights"],
      restrictions: ["Non-profit performances only", "Educational venues only"]
    },
    {
      id: "standard",
      name: "Standard License",
      description: "Full production rights for professional theaters",
      price: script.price,
      duration: "6 months",
      includes: ["Full script", "Performance rights", "Marketing materials", "Technical specs"],
      restrictions: ["Venue capacity limits apply", "Royalty payments required"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="container mx-auto px-6 py-4">
          <Link to="/scripts" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Scripts
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-64 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-16 w-16 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold theater-heading mb-2">{script.title}</h1>
                    <div className="flex items-center gap-3 mb-2">
                      <Link to={`/playwrights/${script.playwrightId}`} className="story-link">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-xs">
                              {script.playwright.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-lg text-muted-foreground">{script.playwright}</span>
                        </div>
                      </Link>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                        <span>4.8 (24 reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>1,247 views</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsFavorited(!isFavorited)}
                    >
                      <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {script.genre.map((g) => (
                    <Badge key={g} variant="secondary">{g}</Badge>
                  ))}
                  <Badge variant="outline">{script.difficulty}</Badge>
                  <Badge variant="outline">{script.ageRating}</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{script.duration} minutes</span>
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
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="characters">Characters</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="theater-card">
                  <CardHeader>
                    <CardTitle>Synopsis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {script.description}
                    </p>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="font-semibold mb-3">Themes</h3>
                      <div className="flex flex-wrap gap-2">
                        {script.themes.map((theme) => (
                          <Badge key={theme} variant="outline">{theme}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="characters" className="mt-6">
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
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{character.name}</h4>
                                <p className="text-sm text-muted-foreground">{character.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                  <span>Age: {character.ageRange}</span>
                                  <span className="capitalize">Gender: {character.gender}</span>
                                  {character.voiceType && <span>Voice: {character.voiceType}</span>}
                                </div>
                              </div>
                              {character.isLead && (
                                <Badge variant="secondary">Lead</Badge>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Character breakdown will be available with license</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technical" className="mt-6">
                <Card className="theater-card">
                  <CardHeader>
                    <CardTitle>Technical Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Sets & Locations</h4>
                      <div className="space-y-2">
                        {script.sets.map((set, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{set}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {script.specialRequirements && script.specialRequirements.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Special Requirements</h4>
                        <div className="space-y-2">
                          {script.specialRequirements.map((req, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-500" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        Complete technical specifications, lighting plots, and sound cues 
                        are included with full production licenses.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card className="theater-card">
                  <CardHeader>
                    <CardTitle>Reviews & Ratings</CardTitle>
                    <CardDescription>Based on {mockReviews.length} reviews</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-4xl font-bold">4.8</div>
                          <div>
                            <div className="flex items-center gap-1">
                              {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-current text-yellow-400" />
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
                        <div key={review.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {review.user.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{review.user}</p>
                                <div className="flex items-center gap-1">
                                  {[1,2,3,4,5].map((star) => (
                                    <Star 
                                      key={star} 
                                      className={`h-3 w-3 ${star <= review.rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
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
                  <div key={option.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{option.name}</h4>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">${option.price}</div>
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

                    <Button 
                      className={`w-full ${option.id === 'standard' ? 'spotlight-button' : ''}`}
                      variant={option.id === 'standard' ? 'default' : 'outline'}
                    >
                      {option.id === 'perusal' ? (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Script
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Get License
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Related Scripts */}
            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Related Scripts</CardTitle>
                <CardDescription>Other works you might enjoy</CardDescription>
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
    </div>
  );
};

export default ScriptDetail;