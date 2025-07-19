import React, { useState } from 'react';
import { 
  FileText, 
  MessageSquare, 
  Users, 
  Eye, 
  Edit3, 
  Share, 
  Download,
  Plus,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Hash,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface Document {
  id: string;
  title: string;
  type: 'script' | 'notes' | 'analysis' | 'feedback' | 'research';
  content: string;
  author: string;
  lastModified: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  collaborators: string[];
  comments: Comment[];
  version: string;
  wordCount: number;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  lineNumber?: number;
  resolved: boolean;
  replies: Reply[];
}

interface Reply {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

interface ApprovalWorkflow {
  id: string;
  documentId: string;
  stage: string;
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback: string;
  timestamp: string;
}

interface DocumentCollaborationProps {
  projectId: string;
}

export function DocumentCollaboration({ projectId }: DocumentCollaborationProps) {
  const [activeTab, setActiveTab] = useState('documents');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [showNewDoc, setShowNewDoc] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newDocument, setNewDocument] = useState({
    title: '',
    type: 'notes',
    content: ''
  });

  // Mock data
  const documents: Document[] = [
    {
      id: '1',
      title: 'Romeo & Juliet - Director\'s Notes',
      type: 'notes',
      content: `# Director's Vision for Romeo & Juliet

## Act I Staging Concepts

The opening scene should establish the tension between the families through spatial arrangements. Consider using elevated platforms to represent the different houses.

### Character Interpretations
- Romeo: More introspective than traditional interpretations
- Juliet: Strong-willed and decisive
- Mercutio: The heart of the production's energy

## Technical Requirements
- Lighting: Warm tones for Capulet scenes, cool for Montague
- Set: Minimalist with moveable pieces
- Costumes: Contemporary with period influences`,
      author: 'Emily Rodriguez',
      lastModified: '2024-01-15 14:30',
      status: 'review',
      collaborators: ['Michael Chen', 'Sarah Wilson', 'David Thompson'],
      comments: [
        {
          id: 'c1',
          author: 'Michael Chen',
          avatar: '/placeholder.svg',
          content: 'Love the spatial arrangement concept for the opening. Should we consider using different levels throughout?',
          timestamp: '2024-01-15 15:00',
          lineNumber: 5,
          resolved: false,
          replies: [
            {
              id: 'r1',
              author: 'Emily Rodriguez',
              avatar: '/placeholder.svg',
              content: 'Absolutely! I was thinking the balcony scene could use a multi-level approach as well.',
              timestamp: '2024-01-15 15:15'
            }
          ]
        }
      ],
      version: 'v2.1',
      wordCount: 245
    },
    {
      id: '2',
      title: 'Character Analysis - Juliet',
      type: 'analysis',
      content: `# Juliet Capulet - Character Study

## Character Arc
Juliet transforms from an obedient daughter to a woman who defies family expectations for love.

## Key Scenes Analysis
1. **Act I, Scene 3** - Introduction and relationship with the Nurse
2. **Act II, Scene 2** - The balcony scene and declaration of love
3. **Act IV, Scene 1** - The potion scene and ultimate decision

## Performance Notes
- Age progression throughout the play
- Relationship dynamics with different characters
- Physical and vocal development`,
      author: 'Sarah Wilson',
      lastModified: '2024-01-14 16:45',
      status: 'approved',
      collaborators: ['Emily Rodriguez', 'David Thompson'],
      comments: [],
      version: 'v1.3',
      wordCount: 189
    }
  ];

  const approvalWorkflows: ApprovalWorkflow[] = [
    {
      id: '1',
      documentId: '1',
      stage: 'Director Review',
      approver: 'Emily Rodriguez',
      status: 'pending',
      feedback: '',
      timestamp: '2024-01-15 14:30'
    },
    {
      id: '2',
      documentId: '2',
      stage: 'Final Approval',
      approver: 'Michael Chen',
      status: 'approved',
      feedback: 'Excellent character analysis. Ready for cast distribution.',
      timestamp: '2024-01-14 17:00'
    }
  ];

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'script': return FileText;
      case 'notes': return Edit3;
      case 'analysis': return Search;
      case 'feedback': return MessageSquare;
      case 'research': return Eye;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'review': return 'text-yellow-600 bg-yellow-50';
      case 'draft': return 'text-blue-600 bg-blue-50';
      case 'archived': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleCreateDocument = () => {
    console.log('Creating document:', newDocument);
    setShowNewDoc(false);
    setNewDocument({ title: '', type: 'notes', content: '' });
  };

  const handleAddComment = (documentId: string) => {
    console.log('Adding comment to document:', documentId, newComment);
    setNewComment('');
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || doc.type === filterBy || doc.status === filterBy;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Collaboration
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Collaborate on scripts, notes, and production documents
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={showNewDoc} onOpenChange={setShowNewDoc}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Document</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Document Title</label>
                      <Input
                        value={newDocument.title}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Document title..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Document Type</label>
                      <Select value={newDocument.type} onValueChange={(value) => setNewDocument(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="script">Script</SelectItem>
                          <SelectItem value="notes">Notes</SelectItem>
                          <SelectItem value="analysis">Analysis</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="research">Research</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Content</label>
                      <Textarea
                        value={newDocument.content}
                        onChange={(e) => setNewDocument(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Start writing..."
                        rows={8}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateDocument} disabled={!newDocument.title}>
                        Create Document
                      </Button>
                      <Button variant="ghost" onClick={() => setShowNewDoc(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                <SelectItem value="script">Scripts</SelectItem>
                <SelectItem value="notes">Notes</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
                <SelectItem value="review">In Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredDocuments.map((document) => {
              const TypeIcon = getDocumentTypeIcon(document.type);
              return (
                <Card key={document.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <TypeIcon className="h-8 w-8 text-primary mt-1" />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{document.title}</h4>
                            <Badge variant="outline" className="capitalize">
                              {document.type}
                            </Badge>
                            <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(document.status)}`}>
                              {document.status}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {document.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {document.lastModified}
                            </div>
                            <div className="flex items-center gap-1">
                              <Hash className="h-4 w-4" />
                              {document.wordCount} words
                            </div>
                            <Badge variant="secondary">{document.version}</Badge>
                          </div>
                          
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {document.content.split('\n')[0].replace('#', '').trim()}
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <div className="flex -space-x-2">
                                {document.collaborators.slice(0, 3).map((collaborator, i) => (
                                  <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                    <AvatarFallback className="text-xs">{collaborator.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                ))}
                                {document.collaborators.length > 3 && (
                                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                    +{document.collaborators.length - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {document.comments.length} comments
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedDocument(document)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Document
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.flatMap(doc => 
                  doc.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3 p-4 rounded-lg bg-muted/50">
                      <Avatar>
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-sm text-muted-foreground">on</span>
                          <span className="text-sm font-medium">{documents.find(d => d.comments.includes(comment))?.title}</span>
                          <span className="text-sm text-muted-foreground">{comment.timestamp}</span>
                          {!comment.resolved && <Badge variant="outline" className="text-xs">Open</Badge>}
                        </div>
                        <p className="text-muted-foreground">{comment.content}</p>
                        
                        {comment.replies.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {comment.replies.map(reply => (
                              <div key={reply.id} className="flex gap-2 ml-4">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={reply.avatar} />
                                  <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{reply.author}</span>
                                    <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approval Workflows</CardTitle>
              <p className="text-muted-foreground">
                Track document approval status and feedback
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {approvalWorkflows.map((workflow) => {
                  const StatusIcon = workflow.status === 'approved' ? CheckCircle : 
                                   workflow.status === 'rejected' ? AlertCircle : Clock;
                  return (
                    <div key={workflow.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <StatusIcon className={`h-5 w-5 mt-0.5 ${
                        workflow.status === 'approved' ? 'text-green-500' :
                        workflow.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'
                      }`} />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{workflow.stage}</span>
                          <Badge variant={
                            workflow.status === 'approved' ? 'default' :
                            workflow.status === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {workflow.status}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-2">
                          Document: {documents.find(d => d.id === workflow.documentId)?.title} • 
                          Approver: {workflow.approver} • 
                          {workflow.timestamp}
                        </div>
                        
                        {workflow.feedback && (
                          <p className="text-sm bg-muted p-2 rounded">
                            {workflow.feedback}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Viewer Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedDocument?.title}</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="grid md:grid-cols-3 gap-6 h-full">
              <div className="md:col-span-2">
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-mono text-sm">
                      {selectedDocument.content}
                    </pre>
                  </div>
                </ScrollArea>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Comments</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <ScrollArea className="h-[40vh]">
                      <div className="space-y-3">
                        {selectedDocument.comments.map(comment => (
                          <div key={comment.id} className="text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={comment.avatar} />
                                <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{comment.author}</span>
                            </div>
                            <p className="text-muted-foreground ml-8">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <Separator className="my-3" />
                    
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                      />
                      <Button 
                        size="sm" 
                        onClick={() => handleAddComment(selectedDocument.id)}
                        disabled={!newComment.trim()}
                      >
                        Add Comment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}