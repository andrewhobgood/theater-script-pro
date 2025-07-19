import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Share, 
  Heart, 
  MessageCircle, 
  Star, 
  Award,
  BookOpen,
  TrendingUp,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface Playwright {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  scripts: number;
  achievements: Achievement[];
  isFollowing: boolean;
  recentActivity: Activity[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: 'writing' | 'community' | 'milestone' | 'special';
}

interface Activity {
  id: string;
  type: 'script_published' | 'achievement_earned' | 'collaboration' | 'review_received';
  description: string;
  timestamp: string;
  relatedScript?: string;
}

interface SocialFeaturesProps {
  currentUserId: string;
}

export function SocialFeatures({ currentUserId }: SocialFeaturesProps) {
  const [activeTab, setActiveTab] = useState('following');
  const [sharingScript, setSharingScript] = useState<string | null>(null);

  // Mock data
  const playwrights: Playwright[] = [
    {
      id: '1',
      name: 'Emily Rodriguez',
      avatar: '/placeholder.svg',
      bio: 'Award-winning playwright specializing in contemporary drama and social commentary.',
      followers: 1250,
      following: 340,
      scripts: 23,
      isFollowing: true,
      achievements: [
        {
          id: 'a1',
          title: 'Prolific Writer',
          description: 'Published 20+ scripts',
          icon: '📝',
          earnedDate: '2024-01-15',
          category: 'writing'
        },
        {
          id: 'a2',
          title: 'Community Favorite',
          description: '100+ followers',
          icon: '⭐',
          earnedDate: '2024-01-10',
          category: 'community'
        }
      ],
      recentActivity: [
        {
          id: 'act1',
          type: 'script_published',
          description: 'Published new script "Urban Hearts"',
          timestamp: '2 hours ago',
          relatedScript: 'Urban Hearts'
        },
        {
          id: 'act2',
          type: 'achievement_earned',
          description: 'Earned "Prolific Writer" achievement',
          timestamp: '1 day ago'
        }
      ]
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: '/placeholder.svg',
      bio: 'Experimental theater creator exploring new narrative forms and interactive experiences.',
      followers: 890,
      following: 420,
      scripts: 15,
      isFollowing: false,
      achievements: [
        {
          id: 'a3',
          title: 'Innovator',
          description: 'Created experimental format',
          icon: '🎭',
          earnedDate: '2024-01-12',
          category: 'special'
        }
      ],
      recentActivity: [
        {
          id: 'act3',
          type: 'collaboration',
          description: 'Started collaboration on "Future Voices"',
          timestamp: '3 hours ago'
        }
      ]
    }
  ];

  const followingFeed = [
    {
      id: 'feed1',
      playwright: 'Emily Rodriguez',
      avatar: '/placeholder.svg',
      action: 'published a new script',
      content: 'Urban Hearts',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8
    },
    {
      id: 'feed2',
      playwright: 'Michael Chen',
      avatar: '/placeholder.svg',
      action: 'earned an achievement',
      content: 'Innovator Badge',
      timestamp: '1 day ago',
      likes: 15,
      comments: 3
    }
  ];

  const achievements = [
    {
      id: 'ach1',
      title: 'First Script',
      description: 'Published your first script',
      icon: '🎬',
      progress: 100,
      category: 'milestone'
    },
    {
      id: 'ach2',
      title: 'Community Builder',
      description: 'Get 50 followers',
      icon: '👥',
      progress: 60,
      category: 'community'
    },
    {
      id: 'ach3',
      title: 'Collaboration Master',
      description: 'Complete 5 collaborations',
      icon: '🤝',
      progress: 40,
      category: 'community'
    }
  ];

  const handleFollow = (playwrightId: string) => {
    console.log('Following playwright:', playwrightId);
  };

  const handleShare = (scriptId: string) => {
    setSharingScript(scriptId);
    // Implement sharing logic
    console.log('Sharing script:', scriptId);
  };

  const getAchievementColor = (category: string) => {
    switch (category) {
      case 'writing': return 'bg-blue-500';
      case 'community': return 'bg-green-500';
      case 'milestone': return 'bg-purple-500';
      case 'special': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Social Hub Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Social Hub
          </CardTitle>
          <p className="text-muted-foreground">
            Connect with playwrights, share your work, and build your community
          </p>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        {/* Following Feed */}
        <TabsContent value="following" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {followingFeed.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-lg bg-muted/50">
                  <Avatar>
                    <AvatarImage src={item.avatar} />
                    <AvatarFallback>{item.playwright.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{item.playwright}</span>
                      <span className="text-muted-foreground">{item.action}</span>
                      <span className="font-medium">{item.content}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{item.timestamp}</span>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Heart className="h-4 w-4 mr-1" />
                        {item.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {item.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discover Playwrights */}
        <TabsContent value="discover" className="space-y-4">
          <div className="grid gap-4">
            {playwrights.map((playwright) => (
              <Card key={playwright.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={playwright.avatar} />
                        <AvatarFallback>{playwright.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{playwright.name}</h4>
                        <p className="text-muted-foreground text-sm mt-1">{playwright.bio}</p>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span>{playwright.followers} followers</span>
                          <span>{playwright.following} following</span>
                          <span>{playwright.scripts} scripts</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {playwright.achievements.slice(0, 3).map((achievement) => (
                            <Badge key={achievement.id} variant="secondary" className="text-xs">
                              {achievement.icon} {achievement.title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant={playwright.isFollowing ? "outline" : "default"}
                      onClick={() => handleFollow(playwright.id)}
                      className="flex items-center gap-2"
                    >
                      <UserPlus className="h-4 w-4" />
                      {playwright.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </div>

                  {/* Recent Activity */}
                  <div className="mt-4 pt-4 border-t">
                    <h5 className="text-sm font-medium mb-2">Recent Activity</h5>
                    <div className="space-y-2">
                      {playwright.recentActivity.map((activity) => (
                        <div key={activity.id} className="text-sm text-muted-foreground">
                          {activity.description} • {activity.timestamp}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className={`w-12 h-12 rounded-full ${getAchievementColor(achievement.category)} flex items-center justify-center text-white text-lg`}>
                    {achievement.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  </div>
                  
                  {achievement.progress === 100 && (
                    <Badge className="bg-green-500">
                      <Star className="h-3 w-3 mr-1" />
                      Earned
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Community */}
        <TabsContent value="community" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Scripts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Urban Hearts', 'The Space Between', 'Digital Dreams'].map((script, index) => (
                    <div key={script} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                        <span className="font-medium">{script}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleShare(script)}>
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Community Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Monthly Script Reviews</span>
                      <span>156 / 200</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>New Playwright Welcomes</span>
                      <span>23 / 30</span>
                    </div>
                    <Progress value={77} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Collaboration Projects</span>
                      <span>8 / 10</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}