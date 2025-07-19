import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Search, 
  MoreHorizontal,
  Shield,
  AlertTriangle,
  Check,
  X,
  Eye,
  Ban,
  UserCheck,
  Settings,
  Filter
} from "lucide-react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const stats = [
    { title: "Total Users", value: "2,847", change: "+12%", icon: Users },
    { title: "Active Scripts", value: "1,429", change: "+8%", icon: FileText },
    { title: "Monthly Revenue", value: "$45,230", change: "+23%", icon: DollarSign },
    { title: "License Growth", value: "+18%", change: "+5%", icon: TrendingUp },
  ];

  const pendingScripts = [
    { id: "1", title: "New Drama Script", author: "Jane Smith", submitted: "2024-01-15", status: "pending" },
    { id: "2", title: "Comedy Masterpiece", author: "John Doe", submitted: "2024-01-14", status: "pending" },
    { id: "3", title: "Historical Play", author: "Mary Johnson", submitted: "2024-01-13", status: "under_review" },
  ];

  const users = [
    { id: "1", name: "Sarah Mitchell", email: "sarah@example.com", role: "playwright", status: "active", joined: "2024-01-01" },
    { id: "2", name: "Broadway Theater", email: "info@broadway.com", role: "theater_company", status: "active", joined: "2024-01-02" },
    { id: "3", name: "John Writer", email: "john@example.com", role: "playwright", status: "suspended", joined: "2024-01-03" },
  ];

  const recentActivity = [
    { type: "license", description: "New license purchased for 'Hamlet'", time: "2 hours ago", user: "Regional Theater" },
    { type: "script", description: "New script submitted for review", time: "4 hours ago", user: "Jane Smith" },
    { type: "user", description: "New theater company registered", time: "6 hours ago", user: "City Players" },
    { type: "payment", description: "Payment processed successfully", time: "8 hours ago", user: "Broadway Co." },
  ];

  const handleApproveScript = (scriptId: string) => {
    console.log("Approve script:", scriptId);
  };

  const handleRejectScript = (scriptId: string) => {
    console.log("Reject script:", scriptId);
  };

  const handleUserAction = (userId: string, action: string) => {
    console.log(`${action} user:`, userId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold theater-heading">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage platform content, users, and settings</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button className="spotlight-button">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="theater-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-500">{stat.change} from last month</p>
                </div>
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert for pending actions */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You have {pendingScripts.length} scripts pending review and 2 user reports to investigate.
        </AlertDescription>
      </Alert>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scripts">Scripts</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'license' ? 'bg-green-500' :
                        activity.type === 'script' ? 'bg-blue-500' :
                        activity.type === 'user' ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Review Pending Scripts ({pendingScripts.length})
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage User Reports (2)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Payouts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Platform Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scripts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Script Management</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search scripts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <Card className="theater-card">
            <CardHeader>
              <CardTitle>Pending Reviews</CardTitle>
              <CardDescription>Scripts awaiting admin approval</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingScripts.map((script) => (
                    <TableRow key={script.id}>
                      <TableCell className="font-medium">{script.title}</TableCell>
                      <TableCell>{script.author}</TableCell>
                      <TableCell>{script.submitted}</TableCell>
                      <TableCell>
                        <Badge variant={script.status === "pending" ? "secondary" : "outline"}>
                          {script.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleApproveScript(script.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejectScript(script.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">User Management</h2>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="playwrights">Playwrights</SelectItem>
                  <SelectItem value="theaters">Theater Companies</SelectItem>
                  <SelectItem value="admins">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">Export</Button>
            </div>
          </div>

          <Card className="theater-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "default" : "destructive"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.joined}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'view')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user.status === "active" ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUserAction(user.id, 'suspend')}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUserAction(user.id, 'activate')}
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finances" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Revenue This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">$45,230</div>
                <p className="text-sm text-green-500">+23% from last month</p>
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Pending Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">$8,420</div>
                <p className="text-sm text-muted-foreground">To 12 playwrights</p>
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Platform Fee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-500">$4,523</div>
                <p className="text-sm text-muted-foreground">10% commission</p>
              </CardContent>
            </Card>
          </div>

          <Card className="theater-card">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "License", script: "Hamlet", amount: "$125", user: "Broadway Theater", date: "Today" },
                  { type: "Royalty", script: "Romeo & Juliet", amount: "$89", user: "City Players", date: "Yesterday" },
                  { type: "License", script: "Macbeth", amount: "$95", user: "University Theater", date: "2 days ago" },
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={transaction.type === "License" ? "default" : "secondary"}>
                        {transaction.type}
                      </Badge>
                      <div>
                        <p className="font-medium">{transaction.script}</p>
                        <p className="text-sm text-muted-foreground">{transaction.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{transaction.amount}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Global platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New User Registration</p>
                    <p className="text-sm text-muted-foreground">Allow new users to register</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-approve Scripts</p>
                    <p className="text-sm text-muted-foreground">Automatically approve certain scripts</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Send platform update emails</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Commission Settings</CardTitle>
                <CardDescription>Platform fee configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform Commission (%)</label>
                  <Input type="number" defaultValue="10" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Payout ($)</label>
                  <Input type="number" defaultValue="50" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Processing Fee (%)</label>
                  <Input type="number" defaultValue="2.9" step="0.1" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;