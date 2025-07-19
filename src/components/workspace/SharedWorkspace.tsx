import React, { useState } from 'react';
import { 
  Users, 
  FolderOpen, 
  FileText, 
  Upload, 
  Download, 
  Share, 
  Plus, 
  MoreHorizontal,
  Filter,
  Search,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface WorkspaceFile {
  id: string;
  name: string;
  type: 'script' | 'document' | 'image' | 'video' | 'audio';
  size: string;
  lastModified: string;
  uploadedBy: string;
  shared: boolean;
  version: string;
}

interface WorkspaceTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  progress: number;
}

interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  lastActive: string;
  status: 'online' | 'offline';
}

interface SharedWorkspaceProps {
  workspaceId: string;
}

export function SharedWorkspace({ workspaceId }: SharedWorkspaceProps) {
  const [activeTab, setActiveTab] = useState('files');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '', priority: 'medium', dueDate: '' });

  // Mock data
  const workspaceFiles: WorkspaceFile[] = [
    {
      id: '1',
      name: 'Romeo_and_Juliet_Final.pdf',
      type: 'script',
      size: '2.4 MB',
      lastModified: '2024-01-15',
      uploadedBy: 'Emily Rodriguez',
      shared: true,
      version: 'v3.2'
    },
    {
      id: '2',
      name: 'Character_Notes.docx',
      type: 'document',
      size: '156 KB',
      lastModified: '2024-01-14',
      uploadedBy: 'Michael Chen',
      shared: false,
      version: 'v1.0'
    },
    {
      id: '3',
      name: 'Rehearsal_Schedule.xlsx',
      type: 'document',
      size: '89 KB',
      lastModified: '2024-01-13',
      uploadedBy: 'Sarah Wilson',
      shared: true,
      version: 'v2.1'
    }
  ];

  const workspaceTasks: WorkspaceTask[] = [
    {
      id: '1',
      title: 'Review script revisions',
      description: 'Go through the latest script changes and provide feedback',
      assignee: 'Emily Rodriguez',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-01-20',
      progress: 65
    },
    {
      id: '2',
      title: 'Finalize casting decisions',
      description: 'Make final decisions on the main characters',
      assignee: 'Michael Chen',
      status: 'review',
      priority: 'high',
      dueDate: '2024-01-18',
      progress: 90
    },
    {
      id: '3',
      title: 'Update production timeline',
      description: 'Adjust rehearsal and production schedule',
      assignee: 'Sarah Wilson',
      status: 'todo',
      priority: 'medium',
      dueDate: '2024-01-25',
      progress: 0
    }
  ];

  const workspaceMembers: WorkspaceMember[] = [
    {
      id: '1',
      name: 'Emily Rodriguez',
      email: 'emily@theater.com',
      avatar: '/placeholder.svg',
      role: 'owner',
      lastActive: '2 minutes ago',
      status: 'online'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@theater.com',
      avatar: '/placeholder.svg',
      role: 'admin',
      lastActive: '1 hour ago',
      status: 'online'
    },
    {
      id: '3',
      name: 'Sarah Wilson',
      email: 'sarah@theater.com',
      avatar: '/placeholder.svg',
      role: 'editor',
      lastActive: '3 hours ago',
      status: 'offline'
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'script': return FileText;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'review': return AlertCircle;
      default: return Clock;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const handleCreateTask = () => {
    console.log('Creating task:', newTask);
    setShowNewTask(false);
    setNewTask({ title: '', description: '', assignee: '', priority: 'medium', dueDate: '' });
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Romeo & Juliet Production
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Collaborative workspace for the Romeo & Juliet production team
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Invite Members
              </Button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{workspaceFiles.length}</div>
              <div className="text-sm text-muted-foreground">Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{workspaceTasks.length}</div>
              <div className="text-sm text-muted-foreground">Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{workspaceMembers.length}</div>
              <div className="text-sm text-muted-foreground">Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">85%</div>
              <div className="text-sm text-muted-foreground">Progress</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Files</SelectItem>
                <SelectItem value="script">Scripts</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="image">Images</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>

          <div className="grid gap-4">
            {workspaceFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              return (
                <Card key={file.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileIcon className="h-8 w-8 text-primary" />
                        <div>
                          <h4 className="font-medium">{file.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span>Modified {file.lastModified}</span>
                            <span>•</span>
                            <span>by {file.uploadedBy}</span>
                            {file.shared && <Badge variant="secondary">Shared</Badge>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{file.version}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Project Tasks</h3>
            <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Task title..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Task description..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Assignee</label>
                      <Select value={newTask.assignee} onValueChange={(value) => setNewTask(prev => ({ ...prev, assignee: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent>
                          {workspaceMembers.map(member => (
                            <SelectItem key={member.id} value={member.name}>{member.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Due Date</label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateTask} disabled={!newTask.title}>
                      Create Task
                    </Button>
                    <Button variant="ghost" onClick={() => setShowNewTask(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {workspaceTasks.map((task) => {
              const StatusIcon = getStatusIcon(task.status);
              return (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <StatusIcon className="h-4 w-4" />
                          <h4 className="font-medium">{task.title}</h4>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">{task.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {task.assignee}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {task.dueDate}
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit Task</DropdownMenuItem>
                          <DropdownMenuItem>Change Status</DropdownMenuItem>
                          <DropdownMenuItem>Assign to</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Workspace Members</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>

          <div className="grid gap-4">
            {workspaceMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${
                          member.status === 'online' ? 'bg-green-500' : 'bg-muted-foreground'
                        }`} />
                      </div>
                      
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <p className="text-xs text-muted-foreground">Last active: {member.lastActive}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                        {member.role}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Remove Member</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <h3 className="text-lg font-medium">Recent Activity</h3>
          
          <div className="space-y-4">
            {/* Activity items would go here */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>ER</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">Emily Rodriguez</span> uploaded{' '}
                      <span className="font-medium">Romeo_and_Juliet_Final.pdf</span>
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
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