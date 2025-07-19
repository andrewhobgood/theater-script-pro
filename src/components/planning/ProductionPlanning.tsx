import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Filter,
  MoreHorizontal,
  Target,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'rehearsal' | 'audition' | 'meeting' | 'performance' | 'tech' | 'other';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  attendees: string[];
  description: string;
  status: 'scheduled' | 'confirmed' | 'cancelled';
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  tasks: string[];
  responsible: string;
}

interface ProductionPlanningProps {
  productionId: string;
}

export function ProductionPlanning({ productionId }: ProductionPlanningProps) {
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState('month');
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'rehearsal',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: ''
  });

  // Mock data
  const calendarEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Table Read - Act I',
      type: 'rehearsal',
      date: '2024-01-20',
      startTime: '14:00',
      endTime: '17:00',
      location: 'Rehearsal Room A',
      attendees: ['Emily Rodriguez', 'Michael Chen', 'Sarah Wilson'],
      description: 'Complete read-through of Act I with full cast',
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'Director Meeting',
      type: 'meeting',
      date: '2024-01-21',
      startTime: '10:00',
      endTime: '11:30',
      location: 'Conference Room',
      attendees: ['Emily Rodriguez', 'Michael Chen'],
      description: 'Discuss staging concepts and character interpretations',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Costume Fittings',
      type: 'other',
      date: '2024-01-22',
      startTime: '13:00',
      endTime: '18:00',
      location: 'Costume Department',
      attendees: ['Cast Members'],
      description: 'Initial costume measurements and fittings',
      status: 'confirmed'
    }
  ];

  const milestones: Milestone[] = [
    {
      id: '1',
      title: 'Script Finalization',
      description: 'Complete final revisions and approve script',
      targetDate: '2024-01-25',
      status: 'in-progress',
      progress: 85,
      tasks: ['Review final draft', 'Incorporate feedback', 'Get approval'],
      responsible: 'Emily Rodriguez'
    },
    {
      id: '2',
      title: 'Cast Selection',
      description: 'Complete auditions and finalize casting',
      targetDate: '2024-02-01',
      status: 'upcoming',
      progress: 0,
      tasks: ['Audition rounds', 'Callback sessions', 'Final decisions'],
      responsible: 'Michael Chen'
    },
    {
      id: '3',
      title: 'Set Design Approval',
      description: 'Finalize set designs and construction plans',
      targetDate: '2024-02-10',
      status: 'upcoming',
      progress: 0,
      tasks: ['Design review', 'Budget approval', 'Construction timeline'],
      responsible: 'Sarah Wilson'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'rehearsal': return 'bg-blue-500';
      case 'audition': return 'bg-green-500';
      case 'meeting': return 'bg-purple-500';
      case 'performance': return 'bg-red-500';
      case 'tech': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  const handleCreateEvent = () => {
    console.log('Creating event:', newEvent);
    setShowNewEvent(false);
    setNewEvent({
      title: '',
      type: 'rehearsal',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Production Planning
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Manage timelines, milestones, and production schedule
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week View</SelectItem>
                  <SelectItem value="month">Month View</SelectItem>
                  <SelectItem value="timeline">Timeline</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={showNewEvent} onOpenChange={setShowNewEvent}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Event Title</label>
                      <Input
                        value={newEvent.title}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Event title..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <Select value={newEvent.type} onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rehearsal">Rehearsal</SelectItem>
                            <SelectItem value="audition">Audition</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="tech">Tech Rehearsal</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          value={newEvent.location}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Location..."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Date</label>
                        <Input
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Start Time</label>
                        <Input
                          type="time"
                          value={newEvent.startTime}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, startTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Time</label>
                        <Input
                          type="time"
                          value={newEvent.endTime}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, endTime: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newEvent.description}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Event description..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateEvent} disabled={!newEvent.title}>
                        Create Event
                      </Button>
                      <Button variant="ghost" onClick={() => setShowNewEvent(false)}>
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
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
            
            <div className="space-y-6">
              {calendarEvents.map((event, index) => (
                <div key={event.id} className="relative flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className={`w-4 h-4 rounded-full ${getEventTypeColor(event.type)} border-2 border-background z-10`}></div>
                  
                  <Card className="flex-1">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{event.title}</h4>
                            <Badge variant="outline" className="capitalize">
                              {event.type}
                            </Badge>
                            <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                              {event.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {event.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {event.startTime} - {event.endTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground text-sm mb-3">{event.description}</p>
                          
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div className="flex -space-x-2">
                              {event.attendees.slice(0, 3).map((attendee, i) => (
                                <Avatar key={i} className="h-6 w-6 border-2 border-background">
                                  <AvatarFallback className="text-xs">{attendee.charAt(0)}</AvatarFallback>
                                </Avatar>
                              ))}
                              {event.attendees.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                                  +{event.attendees.length - 3}
                                </div>
                              )}
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
                            <DropdownMenuItem>Edit Event</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem>Export</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Cancel Event</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-4">
          <div className="grid gap-4">
            {milestones.map((milestone) => {
              const StatusIcon = getStatusIcon(milestone.status);
              return (
                <Card key={milestone.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <StatusIcon className="h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-medium">{milestone.title}</h4>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium">{milestone.targetDate}</div>
                        <Badge variant={milestone.status === 'completed' ? 'default' : 'secondary'}>
                          {milestone.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{milestone.progress}%</span>
                        </div>
                        <Progress value={milestone.progress} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium mb-2">Tasks</div>
                        <div className="space-y-1">
                          {milestone.tasks.map((task, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-3 w-3 text-muted-foreground" />
                              {task}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-sm text-muted-foreground">
                          Responsible: {milestone.responsible}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Milestone</DropdownMenuItem>
                            <DropdownMenuItem>Update Progress</DropdownMenuItem>
                            <DropdownMenuItem>Add Task</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Production Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Simple calendar grid would go here */}
              <div className="text-center text-muted-foreground py-8">
                Calendar view implementation would go here
              </div>
              
              {/* Upcoming events */}
              <div className="mt-6">
                <h4 className="font-medium mb-3">Upcoming Events</h4>
                <div className="space-y-2">
                  {calendarEvents.slice(0, 3).map(event => (
                    <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`}></div>
                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {event.date} at {event.startTime} - {event.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}