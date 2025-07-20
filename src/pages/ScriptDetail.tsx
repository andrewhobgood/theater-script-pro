import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScriptCard } from "@/components/scripts/ScriptCard";
import { ScriptReader } from "@/components/reader/ScriptReader";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { LicensePurchaseModal } from "@/components/licensing/LicensePurchaseModal";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showReader, setShowReader] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [script, setScript] = useState<any>(null);
  const [relatedScripts, setRelatedScripts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [userLicense, setUserLicense] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchScriptDetails();
      fetchRelatedScripts();
      if (profile?.role === 'theater_company') {
        checkExistingLicense();
      }
    }
  }, [id, profile]);

  const fetchScriptDetails = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.scripts.getScript(id!);
      setScript(data);
      fetchReviews();
    } catch (error: any) {
      console.error('Error fetching script:', error);
      toast({
        title: "Error",
        description: "Failed to load script details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedScripts = async () => {
    try {
      const params = new URLSearchParams({ limit: '3' });
      const data = await apiClient.scripts.getScripts(params);
      setRelatedScripts(data.scripts.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error fetching related scripts:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await apiClient.scripts.getReviews(id!);
      setReviews((data as any).reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const checkExistingLicense = async () => {
    try {
      const data = await apiClient.licenses.getMyLicenses();
      const existingLicense = ((data as any).licenses || []).find((l: any) => l.script_id === id && l.status === 'active');
      setUserLicense(existingLicense);
    } catch (error) {
      console.error('Error checking license:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!script) {
    return (
      <div className="container mx-auto px-6 py-8">
        <EmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="Script not found"
          description="The script you're looking for doesn't exist or has been removed."
          action={{
            label: "Browse Scripts",
            onClick: () => navigate('/scripts')
          }}
        />
      </div>
    );
  }



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

  const handleLicensePurchase = () => {
    if (!profile) {
      navigate('/auth');
      return;
    }

    if (profile.role !== 'theater_company') {
      toast({
        title: "License Purchase",
        description: "Only theater companies can purchase licenses",
        variant: "destructive"
      });
      return;
    }

    if (userLicense) {
      toast({
        title: "Existing License",
        description: "You already have an active license for this script",
        variant: "destructive"
      });
      return;
    }

    setShowPurchaseModal(true);
  };

  const handlePurchaseSuccess = () => {
    checkExistingLicense();
    setShowPurchaseModal(false);
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
                      <Link to={`/playwrights/${script.playwright_id}`} className="story-link group">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-xs">
                              {script.profiles?.first_name?.[0]}{script.profiles?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-lg font-medium group-hover:text-primary transition-colors">
                            {script.profiles?.first_name} {script.profiles?.last_name}
                          </span>
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
                        <span className="font-medium">{script.average_rating || 0}</span>
                        <span>({script.total_reviews || 0} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{script.view_count || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{script.license_count || 0} licenses</span>
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
                  {script.genre && <Badge variant="secondary">{script.genre}</Badge>}
                  {script.themes?.map((theme: string) => (
                    <Badge key={theme} variant="outline">{theme}</Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{script.duration_minutes} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{script.cast_size_min}-{script.cast_size_max} cast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{script.page_count || 'TBD'} pages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(script.created_at).getFullYear()}</span>
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
                  {userLicense ? (
                    <EnhancedButton
                      variant="outline"
                      icon={<CheckCircle className="h-4 w-4" />}
                      onClick={() => navigate('/dashboard')}
                    >
                      View License
                    </EnhancedButton>
                  ) : (
                    <EnhancedButton
                      variant="spotlight"
                      icon={<ShoppingCart className="h-4 w-4" />}
                      onClick={handleLicensePurchase}
                    >
                      License Now
                    </EnhancedButton>
                  )}
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
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
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
                          {script.themes?.map((theme: string) => (
                            <Badge key={theme} variant="outline">{theme}</Badge>
                          )) || <span className="text-sm text-muted-foreground">No themes specified</span>}
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
                      Cast size: {script.cast_size_min}-{script.cast_size_max} actors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {script.characters?.length > 0 ? (
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
                        {script.settings?.map((set: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <span>{set}</span>
                          </div>
                        )) || <span className="text-sm text-muted-foreground">No specific settings listed</span>}
                      </div>
                    </div>

                    {script.technical_requirements && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Technical Requirements
                        </h4>
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-800">
                          <p className="text-sm">{script.technical_requirements}</p>
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
                    <CardDescription>Based on {reviews.length} verified reviews</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-5xl font-bold theater-heading">{script.average_rating || 0}</div>
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
                      {reviews.length > 0 ? reviews.map((review: any) => (
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
                      )) : (
                        <EmptyState
                          icon={<MessageSquare className="h-8 w-8" />}
                          title="No reviews yet"
                          description="Be the first to review this script"
                          size="sm"
                        />
                      )}
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
                <div className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Standard License</h4>
                      <p className="text-sm text-muted-foreground">Performance rights for up to 5 shows</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${script.standard_price}</div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-all border-primary bg-primary/5">
                  <Badge variant="default" className="mb-2">Most Popular</Badge>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Premium License</h4>
                      <p className="text-sm text-muted-foreground">Unlimited performances for 1 year</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${script.premium_price}</div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Educational License</h4>
                      <p className="text-sm text-muted-foreground">Special pricing for schools</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${script.educational_price}</div>
                    </div>
                  </div>
                </div>

                {userLicense ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/dashboard')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    View Your License
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={handleLicensePurchase}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Purchase License
                  </Button>
                )}
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
                  <ScriptCard 
                    key={relatedScript.id} 
                    script={{
                      id: relatedScript.id,
                      title: relatedScript.title,
                      playwright: `${relatedScript.profiles?.first_name || ''} ${relatedScript.profiles?.last_name || ''}`.trim(),
                      description: relatedScript.description,
                      genre: [relatedScript.genre],
                      castSize: {
                        min: relatedScript.cast_size_min,
                        max: relatedScript.cast_size_max,
                        flexible: true,
                      },
                      duration: relatedScript.duration_minutes,
                      
                      thumbnail: relatedScript.cover_image_url,
                      rating: relatedScript.average_rating,
                      reviewCount: relatedScript.total_reviews,
                      standard_price: relatedScript.standard_price,
                      premium_price: relatedScript.premium_price,
                      educational_price: relatedScript.educational_price,
                      isFeatured: relatedScript.is_featured,
                    }} 
                    compact 
                  />
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

      {/* License Purchase Modal */}
      {script && (
        <LicensePurchaseModal
          script={script as any}
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          onSuccess={handlePurchaseSuccess}
        />
      )}
    </div>
  );
};

export default ScriptDetail;