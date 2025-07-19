import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock, 
  Heart, 
  Reply, 
  Share2,
  Pin,
  Flag,
  Search,
  Filter,
  Plus,
  ThumbsUp,
  Eye,
  Calendar,
  Award,
  BookOpen,
  HelpCircle,
  Lightbulb,
  Coffee
} from "lucide-react";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
    reputation: number;
  };
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  lastActivity: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: any;
  postCount: number;
  color: string;
}

export const CommunityForum = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const categories: Category[] = [
    {
      id: "general",
      name: "General Discussion",
      description: "General theater and playwriting topics",
      icon: MessageSquare,
      postCount: 1247,
      color: "bg-blue-500"
    },
    {
      id: "writing",
      name: "Writing Craft",
      description: "Tips, techniques, and writing help",
      icon: BookOpen,
      postCount: 892,
      color: "bg-green-500"
    },
    {
      id: "production",
      name: "Production & Staging",
      description: "Directing, staging, and production topics",
      icon: Users,
      postCount: 567,
      color: "bg-purple-500"
    },
    {
      id: "industry",
      name: "Industry Insights",
      description: "Business side of theater and publishing",
      icon: TrendingUp,
      postCount: 423,
      color: "bg-orange-500"
    },
    {
      id: "help",
      name: "Help & Support",
      description: "Platform help and technical support",
      icon: HelpCircle,
      postCount: 234,
      color: "bg-red-500"
    },
    {
      id: "showcase",
      name: "Script Showcase",
      description: "Share excerpts and get feedback",
      icon: Award,
      postCount: 678,
      color: "bg-yellow-500"
    }
  ];

  const posts: ForumPost[] = [
    {
      id: "1",
      title: "Tips for writing authentic dialogue in period pieces?",
      content: "I'm working on a play set in the 1920s and struggling to make the dialogue feel authentic without being overly archaic. Any suggestions?",
      author: {
        name: "Sarah Mitchell",
        avatar: "",
        role: "Playwright",
        reputation: 847
      },
      category: "writing",
      tags: ["dialogue", "period", "1920s", "authenticity"],
      likes: 23,
      replies: 12,
      views: 156,
      isPinned: false,
      isLocked: false,
      lastActivity: "2 hours ago",
      createdAt: "1 day ago"
    },
    {
      id: "2",
      title: "Platform Update: New Collaboration Features",
      content: "We're excited to announce new collaboration tools for writers working together on projects...",
      author: {
        name: "TheaterScript Team",
        avatar: "",
        role: "Admin",
        reputation: 5000
      },
      category: "announcements",
      tags: ["update", "collaboration", "features"],
      likes: 89,
      replies: 34,
      views: 567,
      isPinned: true,
      isLocked: false,
      lastActivity: "30 minutes ago",
      createdAt: "3 days ago"
    },
    {
      id: "3",
      title: "How do you handle director feedback that changes your vision?",
      content: "Recently had a director want to make significant changes to my script. How do you balance collaboration with artistic integrity?",
      author: {
        name: "Marcus Johnson",
        avatar: "",
        role: "Playwright",
        reputation: 432
      },
      category: "general",
      tags: ["collaboration", "feedback", "director", "artistic-vision"],
      likes: 45,
      replies: 28,
      views: 234,
      isPinned: false,
      isLocked: false,
      lastActivity: "4 hours ago",
      createdAt: "2 days ago"
    }
  ];

  const filteredPosts = posts.filter(post => {
    if (activeTab !== "all" && post.category !== activeTab) return false;
    if (searchTerm && !post.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      case "popular":
        return b.likes - a.likes;
      case "replies":
        return b.replies - a.replies;
      default:
        return 0;
    }
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.icon || MessageSquare;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || "bg-gray-500";
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold theater-heading">Community Forum</h1>
          <p className="text-muted-foreground">Connect with fellow playwrights and theater professionals</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Coffee className="h-4 w-4 mr-2" />
            Quick Chat
          </Button>
          <Button className="spotlight-button">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Categories */}
        <div className="lg:col-span-1">
          <Card className="theater-card mb-6">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant={activeTab === "all" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("all")}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                All Posts
              </Button>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={activeTab === category.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab(category.id)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="flex-1 text-left">{category.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {category.postCount}
                    </Badge>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card className="theater-card">
            <CardHeader>
              <CardTitle>Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Members</span>
                <span className="font-semibold">12,847</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Posts Today</span>
                <span className="font-semibold">42</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Now</span>
                <span className="font-semibold">187</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search and Filters */}
          <Card className="theater-card mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="replies">Most Replies</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          <div className="space-y-4">
            {sortedPosts.map((post) => {
              const CategoryIcon = getCategoryIcon(post.category);
              return (
                <Card key={post.id} className="theater-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>
                          {post.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {post.isPinned && <Pin className="h-4 w-4 text-primary" />}
                            <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary cursor-pointer">
                              {post.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getCategoryColor(post.category)}`} />
                            <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {post.content}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{post.author.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {post.author.role}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Award className="h-3 w-3" />
                              <span>{post.author.reputation}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.replies}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{post.lastActivity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Load More */}
          <div className="text-center mt-6">
            <Button variant="outline">Load More Posts</Button>
          </div>
        </div>
      </div>
    </div>
  );
};