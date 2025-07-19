import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  DragDropContext, Droppable, Draggable, 
  DropResult, DraggableLocation 
} from '@hello-pangea/dnd';
import { 
  BarChart3, TrendingUp, Users, DollarSign, Eye, 
  Clock, Heart, Star, Download, Calendar, Settings,
  GripVertical, X, Plus, RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'list' | 'calendar';
  icon: React.ElementType;
  enabled: boolean;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
}

const availableWidgets: DashboardWidget[] = [
  {
    id: 'revenue-chart',
    title: 'Revenue Chart',
    type: 'chart',
    icon: BarChart3,
    enabled: true,
    size: 'large',
    position: { x: 0, y: 0 }
  },
  {
    id: 'total-views',
    title: 'Total Views',
    type: 'metric',
    icon: Eye,
    enabled: true,
    size: 'small',
    position: { x: 0, y: 1 }
  },
  {
    id: 'revenue',
    title: 'Revenue',
    type: 'metric',
    icon: DollarSign,
    enabled: true,
    size: 'small',
    position: { x: 1, y: 1 }
  },
  {
    id: 'active-users',
    title: 'Active Users',
    type: 'metric',
    icon: Users,
    enabled: true,
    size: 'small',
    position: { x: 2, y: 1 }
  },
  {
    id: 'downloads',
    title: 'Downloads',
    type: 'metric',
    icon: Download,
    enabled: true,
    size: 'small',
    position: { x: 3, y: 1 }
  },
  {
    id: 'trending-scripts',
    title: 'Trending Scripts',
    type: 'list',
    icon: TrendingUp,
    enabled: false,
    size: 'medium',
    position: { x: 0, y: 2 }
  },
  {
    id: 'recent-activity',
    title: 'Recent Activity',
    type: 'list',
    icon: Clock,
    enabled: false,
    size: 'medium',
    position: { x: 1, y: 2 }
  },
  {
    id: 'favorites',
    title: 'Favorite Scripts',
    type: 'list',
    icon: Heart,
    enabled: false,
    size: 'medium',
    position: { x: 0, y: 3 }
  },
  {
    id: 'top-rated',
    title: 'Top Rated Scripts',
    type: 'list',
    icon: Star,
    enabled: false,
    size: 'medium',
    position: { x: 1, y: 3 }
  },
  {
    id: 'calendar',
    title: 'Event Calendar',
    type: 'calendar',
    icon: Calendar,
    enabled: false,
    size: 'large',
    position: { x: 2, y: 2 }
  }
];

export const DashboardCustomizer = () => {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(availableWidgets);
  const [layoutName, setLayoutName] = useState('My Dashboard');
  const [savedLayouts, setSavedLayouts] = useState([
    { id: '1', name: 'Default Layout', isDefault: true },
    { id: '2', name: 'Analytics Focus', isDefault: false },
    { id: '3', name: 'Content Creator', isDefault: false }
  ]);

  const enabledWidgets = widgets.filter(w => w.enabled);
  const disabledWidgets = widgets.filter(w => !w.enabled);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Moving between enabled and disabled lists
    if (source.droppableId !== destination.droppableId) {
      const sourceList = source.droppableId === 'enabled' ? enabledWidgets : disabledWidgets;
      const destList = destination.droppableId === 'enabled' ? enabledWidgets : disabledWidgets;
      
      const [removed] = sourceList.splice(source.index, 1);
      removed.enabled = destination.droppableId === 'enabled';
      destList.splice(destination.index, 0, removed);

      const newWidgets = widgets.map(w => 
        w.id === removed.id ? { ...w, enabled: removed.enabled } : w
      );
      setWidgets(newWidgets);
    } else {
      // Reordering within the same list
      const list = source.droppableId === 'enabled' ? enabledWidgets : disabledWidgets;
      const [removed] = list.splice(source.index, 1);
      list.splice(destination.index, 0, removed);
    }
  };

  const toggleWidget = (widgetId: string) => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, enabled: !w.enabled } : w
    ));
  };

  const updateWidgetSize = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, size } : w
    ));
  };

  const saveLayout = () => {
    const newLayout = {
      id: Date.now().toString(),
      name: layoutName,
      isDefault: false
    };
    setSavedLayouts(prev => [...prev, newLayout]);
    // In real app, would save widget configuration to backend
  };

  const resetToDefault = () => {
    setWidgets(availableWidgets);
    setLayoutName('My Dashboard');
  };

  const renderWidget = (widget: DashboardWidget, index: number) => (
    <Draggable key={widget.id} draggableId={widget.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            "flex items-center justify-between p-3 bg-background border rounded-lg",
            snapshot.isDragging && "shadow-lg"
          )}
        >
          <div className="flex items-center space-x-3">
            <div {...provided.dragHandleProps}>
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <widget.icon className="h-4 w-4" />
            <span className="font-medium">{widget.title}</span>
            <Badge variant="outline" className="text-xs">
              {widget.size}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleWidget(widget.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Customizer</h1>
          <p className="text-muted-foreground">Customize your dashboard layout and widgets</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={saveLayout}>
            Save Layout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="layout" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
          <TabsTrigger value="saved">Saved Layouts</TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layout Configuration</CardTitle>
              <CardDescription>
                Drag and drop widgets to customize your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="layoutName">Layout Name</Label>
                  <Input
                    id="layoutName"
                    value={layoutName}
                    onChange={(e) => setLayoutName(e.target.value)}
                    placeholder="Enter layout name"
                  />
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Active Widgets ({enabledWidgets.length})
                      </h3>
                      <Droppable droppableId="enabled">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={cn(
                              "space-y-2 min-h-[200px] p-4 border-2 border-dashed rounded-lg",
                              snapshot.isDraggingOver && "border-primary bg-muted/50"
                            )}
                          >
                            {enabledWidgets.map((widget, index) => 
                              renderWidget(widget, index)
                            )}
                            {provided.placeholder}
                            {enabledWidgets.length === 0 && (
                              <div className="text-center text-muted-foreground py-8">
                                Drag widgets here to enable them
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">
                        Available Widgets ({disabledWidgets.length})
                      </h3>
                      <Droppable droppableId="disabled">
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={cn(
                              "space-y-2 min-h-[200px] p-4 border-2 border-dashed rounded-lg",
                              snapshot.isDraggingOver && "border-primary bg-muted/50"
                            )}
                          >
                            {disabledWidgets.map((widget, index) => 
                              renderWidget(widget, index)
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  </div>
                </DragDropContext>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="widgets" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {widgets.map((widget) => (
              <Card key={widget.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <widget.icon className="h-5 w-5" />
                      <span className="font-medium">{widget.title}</span>
                    </div>
                    <Switch
                      checked={widget.enabled}
                      onCheckedChange={() => toggleWidget(widget.id)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Size</Label>
                      <div className="flex gap-1 mt-1">
                        {(['small', 'medium', 'large'] as const).map((size) => (
                          <Button
                            key={size}
                            variant={widget.size === size ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateWidgetSize(widget.id, size)}
                            className="capitalize"
                          >
                            {size}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Badge variant={widget.enabled ? "default" : "secondary"}>
                      {widget.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Layouts</CardTitle>
              <CardDescription>
                Manage your saved dashboard configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedLayouts.map((layout) => (
                  <div key={layout.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{layout.name}</span>
                      {layout.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Load
                      </Button>
                      <Button variant="outline" size="sm">
                        Duplicate
                      </Button>
                      {!layout.isDefault && (
                        <Button variant="outline" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};