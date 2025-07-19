import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Eye, 
  Download,
  Calendar as CalendarIcon,
  BarChart3,
  PieChart,
  Target,
  Star,
  Clock,
  Globe,
  MapPin,
  Filter,
  FileText,
  Activity,
  Zap
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Legend
} from 'recharts';

interface Metric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: any;
  description: string;
  target?: string;
}

interface AnalyticsDashboardProps {
  userRole: 'playwright' | 'theater_company' | 'admin';
}

export const AnalyticsDashboard = ({ userRole }: AnalyticsDashboardProps) => {
  const [timeRange, setTimeRange] = useState("30d");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Mock data - would be fetched based on user role
  const playwrightMetrics: Metric[] = [
    {
      title: "Total Revenue",
      value: "$12,847",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "This month",
      target: "$15,000"
    },
    {
      title: "Script Views",
      value: "8,432",
      change: "+23.1%",
      trend: "up",
      icon: Eye,
      description: "Last 30 days"
    },
    {
      title: "Licenses Sold",
      value: "34",
      change: "+8",
      trend: "up", 
      icon: Download,
      description: "This month"
    },
    {
      title: "Avg Rating",
      value: "4.7",
      change: "+0.2",
      trend: "up",
      icon: Star,
      description: "Across all scripts"
    }
  ];

  const theaterMetrics: Metric[] = [
    {
      title: "Licensed Scripts",
      value: "12",
      change: "+3",
      trend: "up",
      icon: FileText,
      description: "This month"
    },
    {
      title: "Total Spent",
      value: "$2,430",
      change: "+15.2%",
      trend: "up",
      icon: DollarSign,
      description: "This quarter"
    },
    {
      title: "Performances",
      value: "28",
      change: "+7",
      trend: "up",
      icon: Activity,
      description: "Scheduled"
    },
    {
      title: "Audience Reach",
      value: "14,250",
      change: "+18.5%",
      trend: "up",
      icon: Users,
      description: "Estimated attendance"
    }
  ];

  const adminMetrics: Metric[] = [
    {
      title: "Platform Revenue",
      value: "$127,450",
      change: "+18.2%",
      trend: "up",
      icon: DollarSign,
      description: "This month"
    },
    {
      title: "Active Users",
      value: "12,847",
      change: "+7.3%",
      trend: "up",
      icon: Users,
      description: "Monthly active"
    },
    {
      title: "Total Scripts",
      value: "4,293",
      change: "+156",
      trend: "up",
      icon: FileText,
      description: "Published"
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.5%",
      trend: "up",
      icon: Target,
      description: "View to license"
    }
  ];

  const getMetrics = () => {
    switch (userRole) {
      case 'playwright': return playwrightMetrics;
      case 'theater_company': return theaterMetrics;
      case 'admin': return adminMetrics;
      default: return playwrightMetrics;
    }
  };

  // Sample chart data
  const revenueData = [
    { month: 'Jan', revenue: 2400, licenses: 12, views: 890, users: 1200 },
    { month: 'Feb', revenue: 1398, licenses: 8, views: 1200, users: 1350 },
    { month: 'Mar', revenue: 9800, licenses: 24, views: 1600, users: 1400 },
    { month: 'Apr', revenue: 3908, licenses: 18, views: 1400, users: 1500 },
    { month: 'May', revenue: 4800, licenses: 22, views: 1800, users: 1650 },
    { month: 'Jun', revenue: 3800, licenses: 16, views: 1300, users: 1700 }
  ];

  const performanceData = [
    { name: 'Hamlet', revenue: 4800, licenses: 12, rating: 4.8, views: 2400 },
    { name: 'Romeo & Juliet', revenue: 3200, licenses: 8, rating: 4.6, views: 1800 },
    { name: 'Macbeth', revenue: 2800, licenses: 6, rating: 4.9, views: 1600 },
    { name: 'Othello', revenue: 2200, licenses: 4, rating: 4.7, views: 1200 }
  ];

  const audienceData = [
    { name: 'Educational', value: 45, color: '#8884d8' },
    { name: 'Professional', value: 30, color: '#82ca9d' },
    { name: 'Community', value: 20, color: '#ffc658' },
    { name: 'Other', value: 5, color: '#ff7c7c' }
  ];

  const geographicData = [
    { region: 'North America', users: 65, revenue: 8500 },
    { region: 'Europe', users: 20, revenue: 2800 },
    { region: 'Asia Pacific', users: 10, revenue: 1200 },
    { region: 'Other', users: 5, revenue: 500 }
  ];

  const getRoleTitle = () => {
    switch (userRole) {
      case 'playwright': return 'Playwright Analytics';
      case 'theater_company': return 'Theater Company Analytics';
      case 'admin': return 'Platform Analytics';
      default: return 'Analytics Dashboard';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold theater-heading">{getRoleTitle()}</h1>
          <p className="text-muted-foreground">
            {userRole === 'playwright' && "Track your script performance and revenue"}
            {userRole === 'theater_company' && "Monitor your licensing activity and productions"}
            {userRole === 'admin' && "Overview of platform performance and user activity"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Custom Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {getMetrics().map((metric, index) => (
          <Card key={index} className="theater-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {metric.change}
                    </span>
                    <span className="text-sm text-muted-foreground">{metric.description}</span>
                  </div>
                  {metric.target && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: {metric.target}
                    </p>
                  )}
                </div>
                <metric.icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Primary Chart */}
        <Card className="lg:col-span-2 theater-card">
          <CardHeader>
            <CardTitle>
              {userRole === 'playwright' && "Revenue & License Trends"}
              {userRole === 'theater_company' && "Licensing Activity"}
              {userRole === 'admin' && "Platform Growth"}
            </CardTitle>
            <CardDescription>
              {userRole === 'playwright' && "Monthly revenue and license sales"}
              {userRole === 'theater_company' && "Your licensing and performance activity"}
              {userRole === 'admin' && "User growth and platform metrics"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3}
                  name="Revenue ($)"
                />
                <Bar 
                  yAxisId="right"
                  dataKey={userRole === 'admin' ? 'users' : 'licenses'} 
                  fill="hsl(var(--accent))"
                  name={userRole === 'admin' ? 'New Users' : 'Licenses'}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Secondary Chart */}
        <Card className="theater-card">
          <CardHeader>
            <CardTitle>
              {userRole === 'playwright' && "Audience Breakdown"}
              {userRole === 'theater_company' && "Script Categories"}
              {userRole === 'admin' && "User Types"}
            </CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsPieChart>
                <Pie
                  data={audienceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {audienceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card className="theater-card">
            <CardHeader>
              <CardTitle>
                {userRole === 'playwright' && "Script Performance"}
                {userRole === 'theater_company' && "Production Performance"}
                {userRole === 'admin' && "Top Performing Content"}
              </CardTitle>
              <CardDescription>Detailed performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded flex items-center justify-center">
                        <span className="font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{item.licenses} licenses</span>
                          <span>{item.views} views</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-yellow-400" />
                            <span>{item.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">${item.revenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {audienceData.map((segment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span>{segment.name}</span>
                        <span>{segment.value}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${segment.value}%`,
                            backgroundColor: segment.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Engagement Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Peak Activity Time</span>
                    <Badge>2-4 PM EST</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg. Session Duration</span>
                    <span className="font-medium">12m 34s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bounce Rate</span>
                    <span className="font-medium">23.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Return Visitors</span>
                    <span className="font-medium">67.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <Card className="theater-card">
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>User and revenue distribution by region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geographicData.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-semibold">{region.region}</h4>
                        <p className="text-sm text-muted-foreground">{region.users}% of users</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${region.revenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="theater-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    Revenue increased 23% this month
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Driven by strong educational license sales
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Peak engagement on Tuesdays
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Consider scheduling releases on Tuesday mornings
                  </p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm font-medium text-purple-800">
                    Classical works trending up
                  </p>
                  <p className="text-xs text-purple-600 mt-1">
                    +45% views for Shakespeare adaptations
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">Optimize Script Descriptions</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scripts with detailed descriptions get 40% more views
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">Target Educational Markets</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Educational licenses show highest conversion rates
                  </p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h4 className="font-medium text-sm">Leverage Social Proof</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Scripts with reviews convert 60% better
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};