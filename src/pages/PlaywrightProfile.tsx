import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScriptCard } from "@/components/scripts/ScriptCard";
import { mockScripts, mockUsers, mockPlaywrightProfiles } from "@/lib/mock-data";
import { 
  MapPin, 
  Globe, 
  Twitter, 
  Instagram, 
  Facebook, 
  Award, 
  BookOpen, 
  Star,
  Users,
  Calendar,
  TrendingUp,
  Eye,
  Download,
  Heart,
  Share2,
  MessageSquare
} from "lucide-react";

const PlaywrightProfile = () => {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Mock data - in real app, fetch by ID
  const playwright = mockUsers.find(u => u.id === id && u.role === "playwright") || mockUsers[0];
  const profile = mockPlaywrightProfiles.find(p => p.userId === playwright.id) || mockPlaywrightProfiles[0];
  const playwrightScripts = mockScripts.filter(s => s.playwrightId === playwright.id);

  const stats = [
    { label: "Scripts Published", value: playwrightScripts.length, icon: BookOpen },
    { label: "Total Licenses", value: "1,247", icon: Download },
    { label: "Average Rating", value: "4.8", icon: Star },
    { label: "Followers", value: "892", icon: Users },
  ];

  const achievements = [
    { title: "Rising Star", description: "First script reached 100 licenses", date: "2024" },
    { title: "Prolific Writer", description: "Published 5+ scripts", date: "2024" },
    { title: "Highly Rated", description: "Maintained 4.5+ rating across all works", date: "2023" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Card className="theater-card">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profile.headshot} />
                    <AvatarFallback className="text-2xl">
                      {playwright.firstName[0]}{playwright.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <h1 className="text-3xl font-bold theater-heading">
                        {playwright.firstName} {playwright.lastName}
                      </h1>
                      <p className="text-lg text-muted-foreground mb-4">
                        Playwright & Theater Artist
                      </p>
                      
                      {profile.bio && (
                        <p className="text-muted-foreground max-w-2xl">
                          {profile.bio}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 mt-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>Based in New York</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Member since {new Date(playwright.createdAt).getFullYear()}</span>
                        </div>
                      </div>

                      {/* Social Links */}
                      {profile.socialMedia && (
                        <div className="flex gap-3 mt-4">
                          {profile.website && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={profile.website} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {profile.socialMedia.twitter && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`https://twitter.com/${profile.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer">
                                <Twitter className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {profile.socialMedia.instagram && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`https://instagram.com/${profile.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer">
                                <Instagram className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant={isFollowing ? "secondary" : "default"}
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={!isFollowing ? "spotlight-button" : ""}
                      >
                        {isFollowing ? (
                          <>
                            <Users className="h-4 w-4 mr-2" />
                            Following
                          </>
                        ) : (
                          <>
                            <Users className="h-4 w-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="theater-card">
              <CardContent className="p-4 text-center">
                <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Specialties */}
        {profile.specialties && profile.specialties.length > 0 && (
          <Card className="theater-card mb-8">
            <CardHeader>
              <CardTitle>Specialties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs defaultValue="scripts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="scripts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Published Scripts</h2>
              <div className="text-sm text-muted-foreground">
                {playwrightScripts.length} script{playwrightScripts.length !== 1 ? 's' : ''}
              </div>
            </div>

            {playwrightScripts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {playwrightScripts.map((script) => (
                  <ScriptCard key={script.id} script={script} />
                ))}
              </div>
            ) : (
              <Card className="theater-card p-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No published scripts yet</h3>
                <p className="text-muted-foreground">
                  This playwright hasn't published any scripts on our platform yet.
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Awards & Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.awards && profile.awards.length > 0 ? (
                  <div className="space-y-4">
                    {profile.awards.map((award, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Award className="h-6 w-6 text-yellow-500" />
                        <span className="font-medium">{award}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No awards listed yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Platform Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
                <CardDescription>What theater companies are saying</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      company: "Broadway Theater Co.",
                      script: "Hamlet",
                      rating: 5,
                      comment: "Exceptional adaptation with brilliant character development. Our audience was captivated throughout.",
                      date: "2 weeks ago"
                    },
                    {
                      company: "Regional Players",
                      script: "Romeo & Juliet",
                      rating: 5,
                      comment: "Beautiful reimagining of the classic. The dialogue flows naturally and the themes resonate with modern audiences.",
                      date: "1 month ago"
                    }
                  ].map((review, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{review.company}</h4>
                          <p className="text-sm text-muted-foreground">Production of {review.script}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-4 w-4 ${star <= review.rating ? 'fill-current text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{review.comment}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Biography</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {profile.bio || "No biography available."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Career Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Education</h4>
                    <div className="space-y-2 text-muted-foreground">
                      <p>• MFA in Playwriting, Yale School of Drama</p>
                      <p>• BA in English Literature, Harvard University</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Notable Productions</h4>
                    <div className="space-y-2 text-muted-foreground">
                      <p>• Hamlet - Broadway Revival (2023)</p>
                      <p>• Romeo & Juliet - Lincoln Center (2022)</p>
                      <p>• Macbeth - Off-Broadway (2021)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlaywrightProfile;