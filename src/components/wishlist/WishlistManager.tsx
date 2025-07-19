import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScriptCard } from '@/components/scripts/ScriptCard';
import { 
  Heart, 
  Plus, 
  Share2, 
  FolderPlus,
  Search,
  Filter,
  Download,
  Calendar,
  Star,
  X,
  Eye,
  ShoppingCart,
  Bookmark
} from 'lucide-react';
import { mockScripts } from '@/lib/mock-data';

interface WishlistItem {
  id: string;
  scriptId: string;
  addedAt: string;
  notes: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

interface WishlistCollection {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  items: WishlistItem[];
  createdAt: string;
  color: string;
}

export const WishlistManager: React.FC = () => {
  const [collections, setCollections] = useState<WishlistCollection[]>([
    {
      id: 'main',
      name: 'My Wishlist',
      description: 'Scripts I want to license in the future',
      isPublic: false,
      items: [
        {
          id: '1',
          scriptId: 'hamlet-2024',
          addedAt: '2024-01-15T10:00:00Z',
          notes: 'Perfect for our spring season. Need to discuss with artistic director.',
          priority: 'high',
          tags: ['classical', 'spring-season', 'drama']
        },
        {
          id: '2',
          scriptId: 'romeo-juliet-2024',
          addedAt: '2024-01-10T14:30:00Z',
          notes: 'Great for youth program. Check if educational license available.',
          priority: 'medium',
          tags: ['youth', 'romance', 'educational']
        }
      ],
      createdAt: '2024-01-01T00:00:00Z',
      color: 'red'
    },
    {
      id: 'season-planning',
      name: '2025 Season Planning',
      description: 'Scripts being considered for next season',
      isPublic: true,
      items: [],
      createdAt: '2024-01-05T00:00:00Z',
      color: 'blue'
    }
  ]);

  const [activeCollection, setActiveCollection] = useState('main');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [showAddScript, setShowAddScript] = useState(false);

  const currentCollection = collections.find(c => c.id === activeCollection) || collections[0];

  const filteredItems = currentCollection.items.filter(item => {
    const script = mockScripts.find(s => s.id === item.scriptId);
    if (!script) return false;

    const matchesSearch = !searchTerm || 
      script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  const createCollection = (name: string, description: string, isPublic: boolean, color: string) => {
    const newCollection: WishlistCollection = {
      id: Date.now().toString(),
      name,
      description,
      isPublic,
      items: [],
      createdAt: new Date().toISOString(),
      color
    };
    setCollections([...collections, newCollection]);
    setShowCreateCollection(false);
  };

  const addToWishlist = (scriptId: string, notes: string, priority: WishlistItem['priority'], tags: string[]) => {
    const item: WishlistItem = {
      id: Date.now().toString(),
      scriptId,
      addedAt: new Date().toISOString(),
      notes,
      priority,
      tags
    };

    setCollections(collections.map(collection => 
      collection.id === activeCollection
        ? { ...collection, items: [...collection.items, item] }
        : collection
    ));
    setShowAddScript(false);
  };

  const removeFromWishlist = (itemId: string) => {
    setCollections(collections.map(collection => 
      collection.id === activeCollection
        ? { ...collection, items: collection.items.filter(item => item.id !== itemId) }
        : collection
    ));
  };

  const updateItemPriority = (itemId: string, priority: WishlistItem['priority']) => {
    setCollections(collections.map(collection => 
      collection.id === activeCollection
        ? {
            ...collection,
            items: collection.items.map(item => 
              item.id === itemId ? { ...item, priority } : item
            )
          }
        : collection
    ));
  };

  const getPriorityColor = (priority: WishlistItem['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalItems = collections.reduce((sum, collection) => sum + collection.items.length, 0);
  const highPriorityItems = collections.reduce((sum, collection) => 
    sum + collection.items.filter(item => item.priority === 'high').length, 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold theater-heading flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            My Wishlist
          </h2>
          <p className="text-muted-foreground">
            {totalItems} scripts saved • {highPriorityItems} high priority
          </p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showCreateCollection} onOpenChange={setShowCreateCollection}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
              </DialogHeader>
              <CreateCollectionForm onSubmit={createCollection} />
            </DialogContent>
          </Dialog>

          <Dialog open={showAddScript} onOpenChange={setShowAddScript}>
            <DialogTrigger asChild>
              <Button className="spotlight-button">
                <Plus className="h-4 w-4 mr-2" />
                Add Script
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Script to Wishlist</DialogTitle>
              </DialogHeader>
              <AddScriptForm onSubmit={addToWishlist} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Collections Tabs */}
      <Tabs value={activeCollection} onValueChange={setActiveCollection}>
        <TabsList className="w-full justify-start">
          {collections.map(collection => (
            <TabsTrigger key={collection.id} value={collection.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-${collection.color}-500`} />
              {collection.name}
              <Badge variant="secondary" className="ml-1">
                {collection.items.length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {collections.map(collection => (
          <TabsContent key={collection.id} value={collection.id} className="space-y-6">
            {/* Collection Info */}
            <Card className="theater-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{collection.name}</h3>
                    <p className="text-sm text-muted-foreground">{collection.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {collection.isPublic && (
                      <Badge variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Public
                      </Badge>
                    )}
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters and Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scripts in this collection..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Wishlist Items */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => {
                const script = mockScripts.find(s => s.id === item.scriptId);
                if (!script) return null;

                return (
                  <Card key={item.id} className="theater-card">
                    <div className="relative">
                      <ScriptCard script={script} compact />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getPriorityColor(item.priority)} variant="secondary">
                          {item.priority} priority
                        </Badge>
                        <Select
                          value={item.priority}
                          onValueChange={(value: WishlistItem['priority']) => 
                            updateItemPriority(item.id, value)
                          }
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {item.notes && (
                        <p className="text-sm text-muted-foreground">{item.notes}</p>
                      )}

                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" className="flex-1 spotlight-button">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          License
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <Card className="theater-card p-12 text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No scripts in this collection</h3>
                <p className="text-muted-foreground mb-4">
                  Start adding scripts you're interested in licensing
                </p>
                <Button onClick={() => setShowAddScript(true)} className="spotlight-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Script
                </Button>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Helper Components
const CreateCollectionForm: React.FC<{
  onSubmit: (name: string, description: string, isPublic: boolean, color: string) => void;
}> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [color, setColor] = useState('blue');

  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, description, isPublic, color);
    setName('');
    setDescription('');
    setIsPublic(false);
    setColor('blue');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Collection Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., 2025 Season Planning"
          required
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this collection for?"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        <label htmlFor="isPublic" className="text-sm font-medium">
          Make this collection public
        </label>
      </div>

      <div>
        <label className="text-sm font-medium">Color</label>
        <div className="flex gap-2 mt-2">
          {colors.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full bg-${c}-500 ${
                color === c ? 'ring-2 ring-offset-2 ring-primary' : ''
              }`}
            />
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Collection
      </Button>
    </form>
  );
};

const AddScriptForm: React.FC<{
  onSubmit: (scriptId: string, notes: string, priority: WishlistItem['priority'], tags: string[]) => void;
}> = ({ onSubmit }) => {
  const [selectedScript, setSelectedScript] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<WishlistItem['priority']>('medium');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(
      selectedScript, 
      notes, 
      priority, 
      tags.split(',').map(tag => tag.trim()).filter(Boolean)
    );
    setSelectedScript('');
    setNotes('');
    setPriority('medium');
    setTags('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Select Script</label>
        <Select value={selectedScript} onValueChange={setSelectedScript} required>
          <SelectTrigger>
            <SelectValue placeholder="Choose a script" />
          </SelectTrigger>
          <SelectContent>
            {mockScripts.map(script => (
              <SelectItem key={script.id} value={script.id}>
                {script.title} - {script.playwright}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Why are you interested in this script?"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Priority</label>
        <Select value={priority} onValueChange={(value: WishlistItem['priority']) => setPriority(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Tags (comma-separated)</label>
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., classical, drama, spring-season"
        />
      </div>

      <Button type="submit" className="w-full">
        Add to Wishlist
      </Button>
    </form>
  );
};