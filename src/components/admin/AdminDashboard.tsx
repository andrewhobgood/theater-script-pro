import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Shield,
  Activity,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    new_this_month: number;
    growth_percentage: number;
  };
  scripts: {
    total: number;
    pending_review: number;
    approved_this_month: number;
    rejection_rate: number;
  };
  revenue: {
    total_this_month: number;
    total_last_month: number;
    growth_percentage: number;
    pending_payouts: number;
  };
  platform: {
    uptime_percentage: number;
    active_sessions: number;
    api_response_time: number;
    storage_used_gb: number;
  };
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call when backend is ready
      // const response = await apiClient.admin.getDashboardStats(timeRange);
      const { mockApiResponses } = await import('@/lib/admin-mock-data');
      const response = await mockApiResponses.admin.getDashboardStats();
      setStats(response.stats);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 12500, scripts: 145 },
    { month: 'Feb', revenue: 15800, scripts: 178 },
    { month: 'Mar', revenue: 18200, scripts: 201 },
    { month: 'Apr', revenue: 22100, scripts: 245 },
    { month: 'May', revenue: 26500, scripts: 289 },
    { month: 'Jun', revenue: 31200, scripts: 334 },
  ];

  const userGrowthData = [
    { day: 'Mon', new_users: 12, active_users: 245 },
    { day: 'Tue', new_users: 18, active_users: 267 },
    { day: 'Wed', new_users: 15, active_users: 251 },
    { day: 'Thu', new_users: 22, active_users: 289 },
    { day: 'Fri', new_users: 28, active_users: 312 },
    { day: 'Sat', new_users: 35, active_users: 345 },
    { day: 'Sun', new_users: 30, active_users: 334 },
  ];

  const scriptGenreData = [
    { genre: 'Drama', count: 245, percentage: 35 },
    { genre: 'Comedy', count: 189, percentage: 27 },
    { genre: 'Musical', count: 112, percentage: 16 },
    { genre: 'Thriller', count: 84, percentage: 12 },
    { genre: 'Historical', count: 70, percentage: 10 },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="flex gap-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users.total || 2847}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">{stats?.users.growth_percentage || 12}%</span>
              <span className="ml-1">from last month</span>
            </div>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scripts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.scripts.total || 1429}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {stats?.scripts.pending_review || 23} pending
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats?.scripts.rejection_rate || 8}% rejected
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.revenue.total_this_month?.toLocaleString() || '45,230'}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">{stats?.revenue.growth_percentage || 23}%</span>
              <span className="ml-1">growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.platform.uptime_percentage || 99.9}%</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" className="text-xs">
                {stats?.platform.api_response_time || 124}ms
              </Badge>
              <Badge variant="outline" className="text-xs">
                {stats?.platform.active_sessions || 342} active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Banner */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-base">Action Required</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <p className="text-sm">
                You have <span className="font-semibold">{stats?.scripts.pending_review || 23} scripts</span> pending review
                and <span className="font-semibold">2 user reports</span> to investigate.
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">Review Scripts</Button>
              <Button size="sm">View Reports</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Revenue & Script Growth</CardTitle>
                <CardDescription>Monthly revenue and script submissions</CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="scripts"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Scripts"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Daily new users and active users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="active_users"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                  name="Active Users"
                />
                <Area
                  type="monotone"
                  dataKey="new_users"
                  stackId="1"
                  stroke="#ec4899"
                  fill="#ec4899"
                  fillOpacity={0.6}
                  name="New Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Script Genres */}
        <Card>
          <CardHeader>
            <CardTitle>Script Distribution by Genre</CardTitle>
            <CardDescription>Breakdown of submitted scripts</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scriptGenreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ genre, percentage }) => `${genre} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {scriptGenreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Review Pending Scripts ({stats?.scripts.pending_review || 23})
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage User Reports (2)
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <DollarSign className="h-4 w-4 mr-2" />
              Process Pending Payouts (${stats?.revenue.pending_payouts?.toLocaleString() || '8,420'})
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Security Audit
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Platform Activity</CardTitle>
          <CardDescription>Latest actions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: 'script', action: 'New script submitted', user: 'Jane Smith', time: '2 minutes ago', status: 'pending' },
              { type: 'user', action: 'New theater company registered', user: 'City Playhouse', time: '15 minutes ago', status: 'active' },
              { type: 'payment', action: 'License purchased', user: 'Regional Theater', time: '1 hour ago', status: 'completed' },
              { type: 'review', action: 'Script approved', user: 'Admin John', time: '2 hours ago', status: 'approved' },
              { type: 'report', action: 'User reported content', user: 'Anonymous', time: '3 hours ago', status: 'pending' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'script' ? 'bg-blue-500' :
                    activity.type === 'user' ? 'bg-purple-500' :
                    activity.type === 'payment' ? 'bg-green-500' :
                    activity.type === 'review' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={
                    activity.status === 'completed' || activity.status === 'approved' || activity.status === 'active' ? 'default' :
                    activity.status === 'pending' ? 'secondary' :
                    'destructive'
                  }>
                    {activity.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};