import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  Send, 
  Search, 
  Plus, 
  Phone, 
  Video, 
  MoreHorizontal,
  Paperclip,
  Smile,
  Archive,
  Star,
  Flag,
  Clock,
  Check,
  CheckCheck,
  Circle,
  Users
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: string;
  isOwn: boolean;
  status: 'sent' | 'delivered' | 'read';
  attachments?: Array<{
    name: string;
    type: string;
    url: string;
  }>;
}

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  type: 'direct' | 'group';
  participants?: string[];
}

interface MessageCenterProps {
  userRole: 'playwright' | 'theater_company' | 'admin';
}

export const MessageCenter = ({ userRole }: MessageCenterProps) => {
  const [activeConversation, setActiveConversation] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewConversation, setShowNewConversation] = useState(false);

  // Mock data
  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Sarah Mitchell",
      avatar: "",
      lastMessage: "Thanks for the feedback on Act II!",
      lastMessageTime: "2 min ago",
      unreadCount: 2,
      isOnline: true,
      type: "direct"
    },
    {
      id: "2", 
      name: "Broadway Theater Co.",
      avatar: "",
      lastMessage: "When can we schedule the licensing call?",
      lastMessageTime: "1 hour ago",
      unreadCount: 0,
      isOnline: false,
      type: "direct"
    },
    {
      id: "3",
      name: "Hamlet Production Team",
      avatar: "",
      lastMessage: "David: The script revisions look great",
      lastMessageTime: "3 hours ago",
      unreadCount: 1,
      isOnline: true,
      type: "group",
      participants: ["Sarah Mitchell", "David Chen", "Emma Wilson"]
    },
    {
      id: "4",
      name: "Regional Theater",
      avatar: "",
      lastMessage: "We'd love to license Romeo & Juliet",
      lastMessageTime: "1 day ago",
      unreadCount: 0,
      isOnline: false,
      type: "direct"
    }
  ];

  const messages: Message[] = [
    {
      id: "1",
      content: "Hi! I wanted to discuss the licensing terms for your Hamlet adaptation.",
      timestamp: "10:30 AM",
      sender: "Sarah Mitchell",
      isOwn: false,
      status: 'read'
    },
    {
      id: "2",
      content: "Hello Sarah! I'd be happy to discuss that. What specific aspects are you interested in?",
      timestamp: "10:35 AM",
      sender: "You",
      isOwn: true,
      status: 'read'
    },
    {
      id: "3",
      content: "We're planning a production for next fall and need to understand the performance rights and royalty structure.",
      timestamp: "10:37 AM",
      sender: "Sarah Mitchell",
      isOwn: false,
      status: 'read'
    },
    {
      id: "4",
      content: "Perfect timing! I just updated the licensing package. Let me send you the details.",
      timestamp: "10:40 AM",
      sender: "You",
      isOwn: true,
      status: 'delivered',
      attachments: [
        { name: "Hamlet_Licensing_Package.pdf", type: "PDF", url: "#" }
      ]
    },
    {
      id: "5",
      content: "Thanks for the feedback on Act II!",
      timestamp: "2 min ago",
      sender: "Sarah Mitchell",
      isOwn: false,
      status: 'sent'
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (newMessage.trim()) {
      // In real app, send message via API
      setNewMessage("");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default: return <Circle className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const currentConversation = conversations.find(c => c.id === activeConversation);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold theater-heading">Messages</h1>
          <p className="text-muted-foreground">Communicate with collaborators and clients</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Archive className="h-4 w-4 mr-2" />
            Archived
          </Button>
          <Button 
            className="spotlight-button"
            onClick={() => setShowNewConversation(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="theater-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversations
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="space-y-1 p-4">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent/50 ${
                        activeConversation === conversation.id ? 'bg-accent border border-primary' : ''
                      }`}
                      onClick={() => setActiveConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conversation.avatar} />
                            <AvatarFallback>
                              {conversation.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                          )}
                          {conversation.type === 'group' && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary border border-background rounded-full flex items-center justify-center">
                              <Users className="h-2 w-2 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-sm truncate">{conversation.name}</h3>
                            <span className="text-xs text-muted-foreground">
                              {conversation.lastMessageTime}
                            </span>
                          </div>
                          
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                          
                          {conversation.unreadCount > 0 && (
                            <div className="flex justify-end mt-1">
                              <Badge variant="destructive" className="text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Message View */}
        <div className="lg:col-span-3">
          <Card className="theater-card">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={currentConversation.avatar} />
                        <AvatarFallback>
                          {currentConversation.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{currentConversation.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {currentConversation.isOnline ? 'Online' : 'Last seen 2 hours ago'}
                          {currentConversation.type === 'group' && currentConversation.participants && (
                            <span> • {currentConversation.participants.length} members</span>
                          )}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <Separator />

                {/* Messages */}
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${message.isOwn ? 'order-1' : 'order-2'}`}>
                            <div
                              className={`rounded-lg p-3 ${
                                message.isOwn
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-accent text-accent-foreground'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              
                              {message.attachments && (
                                <div className="mt-2 space-y-1">
                                  {message.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-background/10 rounded">
                                      <Paperclip className="h-4 w-4" />
                                      <span className="text-xs">{attachment.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className={`flex items-center gap-1 mt-1 ${
                              message.isOwn ? 'justify-end' : 'justify-start'
                            }`}>
                              <span className="text-xs text-muted-foreground">
                                {message.timestamp}
                              </span>
                              {message.isOwn && getStatusIcon(message.status)}
                            </div>
                          </div>
                          
                          {!message.isOwn && (
                            <Avatar className="h-8 w-8 order-1 mr-2">
                              <AvatarImage src="" />
                              <AvatarFallback className="text-xs">
                                {message.sender.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>

                <Separator />

                {/* Message Input */}
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} className="spotlight-button">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* New Conversation Modal */}
      {showNewConversation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>New Conversation</CardTitle>
              <CardDescription>Start a new conversation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">To:</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user1">Sarah Mitchell</SelectItem>
                    <SelectItem value="user2">David Chen</SelectItem>
                    <SelectItem value="user3">Broadway Theater Co.</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject (optional):</Label>
                <Input id="subject" placeholder="Message subject" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message:</Label>
                <Textarea 
                  id="message" 
                  placeholder="Type your message..."
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewConversation(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="spotlight-button"
                  onClick={() => setShowNewConversation(false)}
                >
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};