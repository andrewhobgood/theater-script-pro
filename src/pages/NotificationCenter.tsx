import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Bell, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  DollarSign,
  FileText,
  Users,
  Calendar,
  Star,
  Download,
  Heart,
  TrendingUp,
  Clock,
  X,
  Settings,
  Filter
} from "lucide-react";

interface Notification {
  id: string;
  type: 'message' | 'system' | 'payment' | 'review' | 'license' | 'update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

const NotificationCenter = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "license",
      title: "New License Purchase",
      message: "Broadway Theater Co. purchased a license for 'Hamlet'",
      timestamp: "2 minutes ago",
      read: false,
      priority: "high"
    },
    {
      id: "2", 
      type: "review",
      title: "New Review Received",
      message: "City Players left a 5-star review for 'Romeo & Juliet'",
      timestamp: "1 hour ago",
      read: false,
      priority: "medium"
    },
    {
      id: "3",
      type: "payment",
      title: "Payment Processed",
      message: "Monthly royalty payment of $1,247 has been processed",
      timestamp: "3 hours ago",
      read: true,
      priority: "medium"
    },
    {
      id: "4",
      type: "message",
      title: "New Message",
      message: "Regional Theater sent you a message about licensing terms",
      timestamp: "5 hours ago",
      read: false,
      priority: "medium"
    },
    {
      id: "5",
      type: "system",
      title: "Script Approved",
      message: "Your script 'The Last Act' has been approved and is now live",
      timestamp: "1 day ago",
      read: true,
      priority: "high"
    },
    {
      id: "6",
      type: "update",
      title: "Platform Update",
      message: "New analytics features are now available in your dashboard",
      timestamp: "2 days ago",
      read: true,
      priority: "low"
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'license': return Download;
      case 'review': return Star;
      case 'payment': return DollarSign;
      case 'message': return MessageSquare;
      case 'system': return CheckCircle;
      case 'update': return Info;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-blue-500';
      default: return 'border-l-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'license': return 'text-green-500';
      case 'review': return 'text-yellow-500';
      case 'payment': return 'text-blue-500';
      case 'message': return 'text-purple-500';
      case 'system': return 'text-emerald-500';
      case 'update': return 'text-indigo-500';
      default: return 'text-gray-500';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filterNotifications = (type: string) => {
    if (type === "all") return notifications;
    if (type === "unread") return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === type);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold theater-heading">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with your latest activity
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="theater-card">
          <CardContent className="p-4 text-center">
            <Bell className="h-6 w-6 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        
        <Card className="theater-card">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{unreadCount}</div>
            <p className="text-sm text-muted-foreground">Unread</p>
          </CardContent>
        </Card>
        
        <Card className="theater-card">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">
              {notifications.filter(n => n.type === 'license').length}
            </div>
            <p className="text-sm text-muted-foreground">Licenses</p>
          </CardContent>
        </Card>
        
        <Card className="theater-card">
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">
              {notifications.filter(n => n.type === 'message').length}
            </div>
            <p className="text-sm text-muted-foreground">Messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Notification Filters */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="license">Licenses</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <TabsContent value={activeTab}>
          <Card className="theater-card">
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-1 p-4">
                  {filterNotifications(activeTab).map((notification, index) => {
                    const Icon = getIcon(notification.type);
                    
                    return (
                      <div
                        key={notification.id}
                        className={`
                          border-l-4 rounded-lg p-4 transition-all hover:bg-accent/50 cursor-pointer
                          ${getPriorityColor(notification.priority)}
                          ${notification.read ? 'opacity-60' : 'bg-accent/10'}
                        `}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <Icon className={`h-5 w-5 mt-0.5 ${getTypeColor(notification.type)}`} />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                )}
                                <Badge variant="outline" className="text-xs capitalize">
                                  {notification.type}
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2">
                                {notification.message}
                              </p>
                              
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {notification.timestamp}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {notification.actionUrl && (
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filterNotifications(activeTab).length === 0 && (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                      <p className="text-muted-foreground">
                        {activeTab === "unread" 
                          ? "You're all caught up!" 
                          : `No ${activeTab} notifications to show.`
                        }
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notification Settings Preview */}
      <Card className="theater-card mt-6">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Email Notifications</h4>
              <div className="space-y-2 text-sm">
                <label className="flex items-center justify-between">
                  <span>New license purchases</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span>Script reviews</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span>Payment updates</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Push Notifications</h4>
              <div className="space-y-2 text-sm">
                <label className="flex items-center justify-between">
                  <span>New messages</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span>System updates</span>
                  <input type="checkbox" className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span>Marketing updates</span>
                  <input type="checkbox" className="rounded" />
                </label>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-end">
            <Button variant="outline">
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;