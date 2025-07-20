import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Eye,
  Check,
  X,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  Flag,
  MessageSquare,
} from 'lucide-react';
import { Label } from '@/components/ui/label';

interface Script {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  genre: string;
  cast_size: number;
  duration_minutes: number;
  synopsis: string;
  submitted_at: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  review_notes?: string;
  flags?: {
    copyright?: boolean;
    inappropriate?: boolean;
    quality?: boolean;
  };
  file_url?: string;
}

export const ScriptModeration = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [reviewDialog, setReviewDialog] = useState({
    open: false,
    script: null as Script | null,
    action: null as 'approve' | 'reject' | null,
  });
  const [reviewNotes, setReviewNotes] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.admin.getScripts();
      const { mockApiResponses } = await import('@/lib/admin-mock-data');
      const response = await mockApiResponses.admin.getScripts();
      setScripts(response.scripts);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch scripts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScriptReview = async (scriptId: string, action: 'approve' | 'reject') => {
    try {
      // TODO: Replace with actual API call when backend is ready
      // await apiClient.admin.reviewScript(scriptId, {
      //   action,
      //   notes: reviewNotes,
      // });
      const { mockApiResponses } = await import('@/lib/admin-mock-data');
      await mockApiResponses.admin.reviewScript(scriptId, { action, notes: reviewNotes });
      
      toast({
        title: 'Success',
        description: `Script ${action}ed successfully`,
      });
      
      setReviewDialog({ open: false, script: null, action: null });
      setReviewNotes('');
      fetchScripts();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} script`,
        variant: 'destructive',
      });
    }
  };

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = 
      script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'pending' && script.status === 'pending') ||
      (activeTab === 'under_review' && script.status === 'under_review') ||
      (activeTab === 'approved' && script.status === 'approved') ||
      (activeTab === 'rejected' && script.status === 'rejected') ||
      (activeTab === 'flagged' && (script.flags?.copyright || script.flags?.inappropriate || script.flags?.quality));
    
    return matchesSearch && matchesTab;
  });

  const getStatusStats = () => {
    return {
      pending: scripts.filter(s => s.status === 'pending').length,
      under_review: scripts.filter(s => s.status === 'under_review').length,
      approved: scripts.filter(s => s.status === 'approved').length,
      rejected: scripts.filter(s => s.status === 'rejected').length,
      flagged: scripts.filter(s => s.flags?.copyright || s.flags?.inappropriate || s.flags?.quality).length,
    };
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold">Script Moderation</h2>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scripts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Under Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.under_review}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Check className="h-4 w-4" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <X className="h-4 w-4" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Flagged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.flagged}</div>
          </CardContent>
        </Card>
      </div>

      {/* Scripts Table with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="under_review">
            Under Review ({stats.under_review})
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged ({stats.flagged})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Script Details</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Flags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScripts.map((script) => (
                    <TableRow key={script.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{script.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {script.cast_size} actors • {script.duration_minutes} min
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{script.author.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {script.author.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{script.genre}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(script.submitted_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            script.status === 'approved'
                              ? 'default'
                              : script.status === 'rejected'
                              ? 'destructive'
                              : script.status === 'under_review'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {script.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {script.flags?.copyright && (
                            <Badge variant="destructive" className="text-xs">
                              Copyright
                            </Badge>
                          )}
                          {script.flags?.inappropriate && (
                            <Badge variant="destructive" className="text-xs">
                              Content
                            </Badge>
                          )}
                          {script.flags?.quality && (
                            <Badge variant="secondary" className="text-xs">
                              Quality
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedScript(script)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {script.file_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(script.file_url, '_blank')}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          {(script.status === 'pending' || script.status === 'under_review') && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setReviewDialog({
                                    open: true,
                                    script,
                                    action: 'approve',
                                  })
                                }
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setReviewDialog({
                                    open: true,
                                    script,
                                    action: 'reject',
                                  })
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialog.open}
        onOpenChange={(open) =>
          setReviewDialog({ ...reviewDialog, open })
        }
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {reviewDialog.action === 'approve' ? 'Approve' : 'Reject'} Script
            </DialogTitle>
            <DialogDescription>
              {reviewDialog.script?.title} by {reviewDialog.script?.author.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Synopsis</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {reviewDialog.script?.synopsis}
              </p>
            </div>
            
            <div>
              <Label htmlFor="review-notes">Review Notes</Label>
              <Textarea
                id="review-notes"
                placeholder={
                  reviewDialog.action === 'approve'
                    ? 'Optional notes about the approval...'
                    : 'Please provide a reason for rejection...'
                }
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
            
            {reviewDialog.action === 'reject' && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-destructive">
                      Important: Rejection Guidelines
                    </p>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      <li>• Provide clear, constructive feedback</li>
                      <li>• Specify what needs to be changed</li>
                      <li>• Be respectful and professional</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setReviewDialog({ open: false, script: null, action: null });
                setReviewNotes('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant={reviewDialog.action === 'approve' ? 'default' : 'destructive'}
              onClick={() =>
                reviewDialog.script &&
                reviewDialog.action &&
                handleScriptReview(reviewDialog.script.id, reviewDialog.action)
              }
              disabled={reviewDialog.action === 'reject' && !reviewNotes.trim()}
            >
              {reviewDialog.action === 'approve' ? 'Approve Script' : 'Reject Script'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Script Details Dialog */}
      {selectedScript && (
        <Dialog
          open={!!selectedScript}
          onOpenChange={() => setSelectedScript(null)}
        >
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedScript.title}</DialogTitle>
              <DialogDescription>
                Submitted by {selectedScript.author.name} on{' '}
                {new Date(selectedScript.submitted_at).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Genre</Label>
                  <p className="text-sm">{selectedScript.genre}</p>
                </div>
                <div>
                  <Label>Cast Size</Label>
                  <p className="text-sm">{selectedScript.cast_size} actors</p>
                </div>
                <div>
                  <Label>Duration</Label>
                  <p className="text-sm">{selectedScript.duration_minutes} minutes</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className="mt-1">{selectedScript.status}</Badge>
                </div>
              </div>
              
              <div>
                <Label>Synopsis</Label>
                <p className="text-sm mt-1">{selectedScript.synopsis}</p>
              </div>
              
              {selectedScript.review_notes && (
                <div>
                  <Label>Review Notes</Label>
                  <p className="text-sm mt-1">{selectedScript.review_notes}</p>
                </div>
              )}
              
              {selectedScript.flags && (
                <div>
                  <Label>Flags</Label>
                  <div className="flex gap-2 mt-1">
                    {selectedScript.flags.copyright && (
                      <Badge variant="destructive">Copyright Issue</Badge>
                    )}
                    {selectedScript.flags.inappropriate && (
                      <Badge variant="destructive">Inappropriate Content</Badge>
                    )}
                    {selectedScript.flags.quality && (
                      <Badge variant="secondary">Quality Concerns</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};