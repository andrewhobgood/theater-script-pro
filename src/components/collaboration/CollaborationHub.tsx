import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Send,
  Paperclip,
  Video,
  Phone,
  Star,
  Eye,
  Edit,
  Share2
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed';
  collaborators: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  dueDate: string;
  progress: number;
  lastActivity: string;
}

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
}

interface CollaborationHubProps {
  projectId?: string;
}

export const CollaborationHub = ({ projectId }: CollaborationHubProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const projects: Project[] = [
    {
      id: "1",
      title: "Modern Hamlet Adaptation",
      description: "Contemporary retelling set in corporate world",
      status: "in_progress",
      collaborators: [
        { id: "1", name: "Sarah Mitchell", role: "Lead Playwright", avatar: "" },
        { id: "2", name: "David Chen", role: "Co-writer", avatar: "" },
        { id: "3", name: "Emma Wilson", role: "Director", avatar: "" }
      ],
      dueDate: "2024-03-15",
      progress: 65,
      lastActivity: "2 hours ago"
    },
    {
      id: "2", 
      title: "Romeo & Juliet Musical",
      description: "Adding songs and choreography to classic",
      status: "planning",
      collaborators: [
        { id: "1", name: "Sarah Mitchell", role: "Book Writer", avatar: "" },
        { id: "4", name: "Mark Rodriguez", role: "Composer", avatar: "" }
      ],
      dueDate: "2024-04-20",
      progress: 25,
      lastActivity: "1 day ago"
    }
  ];

  const messages: Message[] = [
    {
      id: "1",
      sender: "David Chen",
      content: "I've finished the first draft of Act II. Ready for your review!",
      timestamp: "2 hours ago",
      type: "text"
    },
    {
      id: "2",
      sender: "Emma Wilson", 
      content: "Great work! I love the pacing in Scene 3. Can we schedule a call to discuss the staging?",
      timestamp: "1 hour ago",
      type: "text"
    },
    {
      id: "3",
      sender: "System",
      content: "Sarah Mitchell uploaded a new version of the script",
      timestamp: "30 minutes ago",
      type: "system"
    }
  ];

  const currentProject = projects.find(p => p.id === projectId) || projects[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'review': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      // In real app, send message via API
      setNewMessage("");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold theater-heading">Collaboration Hub</h1>
          <p className="text-muted-foreground">Work together on your theatrical projects</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Video className="h-4 w-4 mr-2" />
            Start Meeting
          </Button>
          <Button className="spotlight-button">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar - Projects List */}
        <div className="lg:col-span-1">
          <Card className="theater-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Projects
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 ${
                    project.id === currentProject.id ? 'bg-accent border-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2">{project.title}</h3>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {project.collaborators.slice(0, 3).map((collaborator) => (
                        <Avatar key={collaborator.id} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={collaborator.avatar} />
                          <AvatarFallback className="text-xs">
                            {collaborator.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.collaborators.length > 3 && (
                        <div className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                          <span className="text-xs">+{project.collaborators.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{project.progress}%</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="theater-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{currentProject.title}</CardTitle>
                  <CardDescription>{currentProject.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {getStatusLabel(currentProject.status)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Due {currentProject.dueDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Last activity {currentProject.lastActivity}</span>
                </div>
              </div>
              
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{currentProject.progress}%</span>
                </div>
                <Progress value={currentProject.progress} />
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="files">Files</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Team Members */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Team Members</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {currentProject.collaborators.map((collaborator) => (
                        <div key={collaborator.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Avatar>
                            <AvatarImage src={collaborator.avatar} />
                            <AvatarFallback>
                              {collaborator.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium">{collaborator.name}</h4>
                            <p className="text-sm text-muted-foreground">{collaborator.role}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Recent Activity */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm">New script version uploaded by Sarah Mitchell</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <MessageSquare className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="text-sm">David Chen added feedback on Act II</p>
                          <p className="text-xs text-muted-foreground">4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 border rounded-lg">
                        <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div>
                          <p className="text-sm">Character development task completed</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="chat" className="space-y-4">
                  <div className="border rounded-lg">
                    {/* Chat Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className="flex items-start gap-3">
                          {message.type !== 'system' && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.avatar} />
                              <AvatarFallback className="text-xs">
                                {message.sender.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`flex-1 ${message.type === 'system' ? 'text-center' : ''}`}>
                            {message.type !== 'system' && (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{message.sender}</span>
                                <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                              </div>
                            )}
                            <p className={`text-sm ${
                              message.type === 'system' 
                                ? 'text-muted-foreground italic' 
                                : 'bg-accent/50 rounded-lg p-2'
                            }`}>
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <Separator />
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button variant="outline" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button onClick={sendMessage} size="sm" className="spotlight-button">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="files" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Project Files</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                  
                  <div className="grid gap-3">
                    {[
                      { name: "Act_I_Draft_v3.pdf", type: "PDF", size: "2.1 MB", modified: "2 hours ago" },
                      { name: "Character_Notes.docx", type: "DOC", size: "856 KB", modified: "1 day ago" },
                      { name: "Stage_Directions.txt", type: "TXT", size: "45 KB", modified: "3 days ago" }
                    ].map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{file.size} • Modified {file.modified}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Project Tasks</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { title: "Revise opening monologue", assignee: "Sarah Mitchell", status: "in_progress", priority: "high" },
                      { title: "Add stage directions for Act II", assignee: "David Chen", status: "pending", priority: "medium" },
                      { title: "Review character arcs", assignee: "Emma Wilson", status: "completed", priority: "low" }
                    ].map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded border-2 ${
                            task.status === 'completed' ? 'bg-green-500 border-green-500' :
                            task.status === 'in_progress' ? 'bg-yellow-500 border-yellow-500' :
                            'border-gray-300'
                          }`}>
                            {task.status === 'completed' && (
                              <CheckCircle className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{task.title}</p>
                            <p className="text-xs text-muted-foreground">Assigned to {task.assignee}</p>
                          </div>
                        </div>
                        <Badge variant={
                          task.priority === 'high' ? 'destructive' :
                          task.priority === 'medium' ? 'default' : 'secondary'
                        }>
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Project Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-name">Project Name</Label>
                        <Input id="project-name" value={currentProject.title} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="project-description">Description</Label>
                        <Textarea id="project-description" value={currentProject.description} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="due-date">Due Date</Label>
                        <Input id="due-date" type="date" value={currentProject.dueDate} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={currentProject.status}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <Button variant="outline">Save Changes</Button>
                      <Button variant="destructive">Delete Project</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};