import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  BookmarkCheck,
  Search, 
  StickyNote,
  Plus,
  X,
  Settings,
  Eye,
  Type,
  Palette
} from 'lucide-react';

interface Annotation {
  id: string;
  page: number;
  text: string;
  note: string;
  timestamp: string;
  color: 'yellow' | 'blue' | 'green' | 'pink';
}

interface Bookmark {
  id: string;
  page: number;
  title: string;
  timestamp: string;
}

interface ScriptReaderProps {
  scriptId: string;
  scriptTitle: string;
  scriptContent: string[];
  onClose: () => void;
}

export const ScriptReader: React.FC<ScriptReaderProps> = ({
  scriptId,
  scriptTitle,
  scriptContent,
  onClose
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [showAnnotationDialog, setShowAnnotationDialog] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('light');

  const totalPages = scriptContent.length;

  // Search functionality
  useEffect(() => {
    if (searchTerm) {
      const results: number[] = [];
      scriptContent.forEach((page, index) => {
        if (page.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push(index + 1);
        }
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, scriptContent]);

  const addBookmark = () => {
    const bookmark: Bookmark = {
      id: Date.now().toString(),
      page: currentPage,
      title: `Page ${currentPage}`,
      timestamp: new Date().toISOString()
    };
    setBookmarks([...bookmarks, bookmark]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const addAnnotation = (note: string, color: Annotation['color'] = 'yellow') => {
    const annotation: Annotation = {
      id: Date.now().toString(),
      page: currentPage,
      text: selectedText,
      note,
      timestamp: new Date().toISOString(),
      color
    };
    setAnnotations([...annotations, annotation]);
    setShowAnnotationDialog(false);
    setSelectedText('');
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(annotations.filter(a => a.id !== id));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getCurrentPageBookmarks = () => bookmarks.filter(b => b.page === currentPage);
  const getCurrentPageAnnotations = () => annotations.filter(a => a.page === currentPage);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
      setShowAnnotationDialog(true);
    }
  };

  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-gray-900 text-gray-100',
    sepia: 'bg-amber-50 text-amber-900'
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{scriptTitle}</h1>
              <p className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search in script..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
              {searchResults.length > 0 && (
                <Badge variant="secondary" className="absolute -right-2 -top-2">
                  {searchResults.length}
                </Badge>
              )}
            </div>

            {/* Reader Settings */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reading Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Font Size: {fontSize}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['light', 'dark', 'sepia'] as const).map((t) => (
                        <Button
                          key={t}
                          variant={theme === t ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTheme(t)}
                          className="capitalize"
                        >
                          {t}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-80 border-r bg-background/95 backdrop-blur-sm">
          <Tabs defaultValue="bookmarks" className="h-full">
            <TabsList className="grid w-full grid-cols-2 m-4">
              <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
              <TabsTrigger value="annotations">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="bookmarks" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Bookmarks</h3>
                <Button size="sm" onClick={addBookmark}>
                  <Bookmark className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {bookmarks.map((bookmark) => (
                  <Card key={bookmark.id} className="p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div onClick={() => goToPage(bookmark.page)}>
                        <p className="font-medium">{bookmark.title}</p>
                        <p className="text-sm text-muted-foreground">Page {bookmark.page}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBookmark(bookmark.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                {bookmarks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No bookmarks yet
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="annotations" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Annotations</h3>
                <span className="text-sm text-muted-foreground">
                  {annotations.length} notes
                </span>
              </div>

              <div className="space-y-3">
                {annotations.map((annotation) => (
                  <Card key={annotation.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant="secondary" 
                            className={`bg-${annotation.color}-100 text-${annotation.color}-800`}
                          >
                            Page {annotation.page}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">"{annotation.text}"</p>
                        <p className="text-sm text-muted-foreground">{annotation.note}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAnnotation(annotation.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                {annotations.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No annotations yet. Select text to add notes.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Reading Area */}
        <div className="flex-1 flex flex-col">
          {/* Navigation */}
          <div className="border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Input
                type="number"
                value={currentPage}
                onChange={(e) => goToPage(Number(e.target.value))}
                className="w-20 text-center"
                min={1}
                max={totalPages}
              />
              
              <span className="text-sm text-muted-foreground">of {totalPages}</span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Search Results Navigation */}
            {searchResults.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {searchResults.length} results
                </span>
                <div className="flex gap-1">
                  {searchResults.slice(0, 5).map((page) => (
                    <Button
                      key={page}
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  {searchResults.length > 5 && (
                    <span className="text-sm text-muted-foreground">...</span>
                  )}
                </div>
              </div>
            )}

            {/* Current Page Indicators */}
            <div className="flex items-center gap-2">
              {getCurrentPageBookmarks().length > 0 && (
                <BookmarkCheck className="h-4 w-4 text-blue-500" />
              )}
              {getCurrentPageAnnotations().length > 0 && (
                <StickyNote className="h-4 w-4 text-yellow-500" />
              )}
            </div>
          </div>

          {/* Script Content */}
          <div className="flex-1 overflow-auto">
            <div 
              className={`max-w-4xl mx-auto p-8 ${themeClasses[theme]} min-h-full`}
              style={{ fontSize: `${fontSize}px` }}
              onMouseUp={handleTextSelection}
            >
              <div className="whitespace-pre-wrap leading-relaxed font-mono">
                {scriptContent[currentPage - 1]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Annotation Dialog */}
      <Dialog open={showAnnotationDialog} onOpenChange={setShowAnnotationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Annotation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Selected Text</label>
              <p className="text-sm bg-muted p-2 rounded">{selectedText}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">Your Note</label>
              <Textarea
                placeholder="Add your note about this text..."
                id="annotation-note"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Color</label>
              <div className="flex gap-2 mt-2">
                {(['yellow', 'blue', 'green', 'pink'] as const).map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    size="sm"
                    className={`w-8 h-8 bg-${color}-100 hover:bg-${color}-200`}
                    onClick={() => {
                      const note = (document.getElementById('annotation-note') as HTMLTextAreaElement)?.value || '';
                      addAnnotation(note, color);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};