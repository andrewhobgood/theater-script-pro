import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Award,
  Settings,
  MoreHorizontal,
  Search,
  Filter,
  Crown,
  Key,
  Eye,
  Edit3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'owner' | 'admin' | 'director' | 'producer' | 'cast' | 'crew' | 'viewer';
  department: string;
  joinDate: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
  projects: number;
  skills: string[];
  bio: string;
}

interface RolePermission {
  id: string;
  name: string;
  description: string;
  category: 'content' | 'admin' | 'collaboration' | 'financial';
}

interface TeamManagementProps {
  organizationId: string;
}

export function TeamManagement({ organizationId }: TeamManagementProps) {
  const [activeTab, setActiveTab] = useState('members');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [showInvite, setShowInvite] = useState(false);
  const [showRoleEdit, setShowRoleEdit] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [inviteData, setInviteData] = useState({
    emails: '',
    role: 'viewer',
    message: '',
    departments: []
  });

  // Mock data
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Emily Rodriguez',
      email: 'emily@theater.com',
      phone: '+1 (555) 123-4567',
      avatar: '/placeholder.svg',
      role: 'owner',
      department: 'Leadership',
      joinDate: '2023-06-15',
      lastActive: '2 minutes ago',
      status: 'active',
      permissions: ['all'],
      projects: 15,
      skills: ['Direction', 'Production Management', 'Script Development'],
      bio: 'Experienced theater director with over 15 years in professional theater production.'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@theater.com',
      phone: '+1 (555) 234-5678',
      avatar: '/placeholder.svg',
      role: 'admin',
      department: 'Production',
      joinDate: '2023-08-20',
      lastActive: '1 hour ago',
      status: 'active',
      permissions: ['manage_content', 'manage_users', 'view_analytics'],
      projects: 12,
      skills: ['Stage Management', 'Technical Direction', 'Lighting Design'],
      bio: 'Technical theater specialist with expertise in stage management and lighting.'
    },
    {
      id: '3',
      name: 'Sarah Wilson',
      email: 'sarah@theater.com',
      phone: '+1 (555) 345-6789',
      avatar: '/placeholder.svg',
      role: 'director',
      department: 'Creative',
      joinDate: '2023-09-10',
      lastActive: '3 hours ago',
      status: 'active',
      permissions: ['manage_content', 'view_analytics'],
      projects: 8,
      skills: ['Directing', 'Acting', 'Script Analysis'],
      bio: 'Creative director focusing on contemporary theatrical works and new playwright development.'
    },
    {
      id: '4',
      name: 'David Thompson',
      email: 'david@theater.com',
      phone: '+1 (555) 456-7890',
      avatar: '/placeholder.svg',
      role: 'cast',
      department: 'Performance',
      joinDate: '2023-11-05',
      lastActive: '1 day ago',
      status: 'active',
      permissions: ['view_content'],
      projects: 5,
      skills: ['Acting', 'Voice', 'Movement'],
      bio: 'Professional actor with experience in classical and contemporary theater.'
    }
  ];

  const rolePermissions: RolePermission[] = [
    {
      id: 'manage_content',
      name: 'Manage Content',
      description: 'Create, edit, and delete scripts and productions',
      category: 'content'
    },
    {
      id: 'manage_users',
      name: 'Manage Users',
      description: 'Invite, edit, and remove team members',
      category: 'admin'
    },
    {
      id: 'view_analytics',
      name: 'View Analytics',
      description: 'Access performance and usage analytics',
      category: 'admin'
    },
    {
      id: 'manage_billing',
      name: 'Manage Billing',
      description: 'Handle subscriptions and payment information',
      category: 'financial'
    },
    {
      id: 'collaborate',
      name: 'Collaborate',
      description: 'Participate in discussions and shared workspaces',
      category: 'collaboration'
    }
  ];

  const departments = [
    'Leadership',
    'Production',
    'Creative',
    'Performance',
    'Technical',
    'Design',
    'Administration'
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return Crown;
      case 'admin': return Shield;
      case 'director': return Award;
      case 'producer': return Key;
      default: return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-yellow-600 bg-yellow-50';
      case 'admin': return 'text-red-600 bg-red-50';
      case 'director': return 'text-purple-600 bg-purple-50';
      case 'producer': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleInviteMembers = () => {
    console.log('Inviting members:', inviteData);
    setShowInvite(false);
    setInviteData({ emails: '', role: 'viewer', message: '', departments: [] });
  };

  const handleRoleChange = (memberId: string, newRole: string) => {
    console.log('Changing role for member:', memberId, 'to:', newRole);
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || member.role === filterBy || member.department === filterBy;
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
                <Users className="h-5 w-5" />
                Team Management
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Manage team members, roles, and permissions
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={showInvite} onOpenChange={setShowInvite}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Members
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Invite Team Members</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Email Addresses</label>
                      <Textarea
                        placeholder="Enter email addresses separated by commas..."
                        value={inviteData.emails}
                        onChange={(e) => setInviteData(prev => ({ ...prev, emails: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Default Role</label>
                        <Select value={inviteData.role} onValueChange={(value) => setInviteData(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="viewer">Viewer</SelectItem>
                            <SelectItem value="cast">Cast Member</SelectItem>
                            <SelectItem value="crew">Crew Member</SelectItem>
                            <SelectItem value="director">Director</SelectItem>
                            <SelectItem value="producer">Producer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Department</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Welcome Message (Optional)</label>
                      <Textarea
                        placeholder="Add a personal welcome message..."
                        value={inviteData.message}
                        onChange={(e) => setInviteData(prev => ({ ...prev, message: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleInviteMembers} disabled={!inviteData.emails}>
                        Send Invitations
                      </Button>
                      <Button variant="ghost" onClick={() => setShowInvite(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{teamMembers.length}</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{teamMembers.filter(m => m.status === 'active').length}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{departments.length}</div>
              <div className="text-sm text-muted-foreground">Departments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">Roles</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search members..."
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
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem value="owner">Owners</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="director">Directors</SelectItem>
                <SelectItem value="cast">Cast</SelectItem>
                <SelectItem value="crew">Crew</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredMembers.map((member) => {
              const RoleIcon = getRoleIcon(member.role);
              return (
                <Card key={member.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{member.name}</h4>
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getRoleColor(member.role)}`}>
                              <RoleIcon className="h-3 w-3" />
                              {member.role}
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {member.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {member.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {member.department}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Joined {member.joinDate}
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-sm text-muted-foreground mb-2">{member.bio}</p>
                            <div className="flex flex-wrap gap-1">
                              {member.skills.map(skill => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-2">
                          Last active: {member.lastActive}
                        </div>
                        <div className="text-sm font-medium mb-3">
                          {member.projects} projects
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedMember(member);
                              setShowRoleEdit(true);
                            }}>
                              <Settings className="h-4 w-4 mr-2" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Remove Member
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

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions Matrix</CardTitle>
              <p className="text-muted-foreground">
                Manage what each role can access and modify
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Permission</th>
                      <th className="text-center p-2">Owner</th>
                      <th className="text-center p-2">Admin</th>
                      <th className="text-center p-2">Director</th>
                      <th className="text-center p-2">Producer</th>
                      <th className="text-center p-2">Cast</th>
                      <th className="text-center p-2">Crew</th>
                      <th className="text-center p-2">Viewer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rolePermissions.map(permission => (
                      <tr key={permission.id} className="border-b">
                        <td className="p-2">
                          <div>
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-sm text-muted-foreground">{permission.description}</div>
                          </div>
                        </td>
                        <td className="text-center p-2">
                          <Switch checked disabled />
                        </td>
                        <td className="text-center p-2">
                          <Switch checked={permission.category !== 'financial'} />
                        </td>
                        <td className="text-center p-2">
                          <Switch checked={permission.category === 'content' || permission.category === 'collaboration'} />
                        </td>
                        <td className="text-center p-2">
                          <Switch checked={permission.category !== 'admin'} />
                        </td>
                        <td className="text-center p-2">
                          <Switch checked={permission.category === 'collaboration'} />
                        </td>
                        <td className="text-center p-2">
                          <Switch checked={permission.category === 'collaboration'} />
                        </td>
                        <td className="text-center p-2">
                          <Switch checked={false} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {departments.map(department => {
              const deptMembers = teamMembers.filter(m => m.department === department);
              return (
                <Card key={department}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{department}</CardTitle>
                      <Badge variant="secondary">{deptMembers.length} members</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {deptMembers.map(member => (
                        <div key={member.id} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{member.name}</div>
                            <div className="text-xs text-muted-foreground capitalize">{member.role}</div>
                          </div>
                          <div className={`h-2 w-2 rounded-full ${getStatusColor(member.status)}`} />
                        </div>
                      ))}
                      {deptMembers.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                          No members in this department
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Role Edit Dialog */}
      <Dialog open={showRoleEdit} onOpenChange={setShowRoleEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member Role</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedMember.avatar} />
                  <AvatarFallback>{selectedMember.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedMember.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedMember.email}</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select defaultValue={selectedMember.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="director">Director</SelectItem>
                    <SelectItem value="producer">Producer</SelectItem>
                    <SelectItem value="cast">Cast Member</SelectItem>
                    <SelectItem value="crew">Crew Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Department</label>
                <Select defaultValue={selectedMember.department}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => setShowRoleEdit(false)}>
                  Save Changes
                </Button>
                <Button variant="ghost" onClick={() => setShowRoleEdit(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}