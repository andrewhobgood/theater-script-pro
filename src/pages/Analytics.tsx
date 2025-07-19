import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Clock
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock data
  const revenueData = [
    { month: 'Jan', revenue: 2400, licenses: 12, views: 890 },
    { month: 'Feb', revenue: 1398, licenses: 8, views: 1200 },
    { month: 'Mar', revenue: 9800, licenses: 24, views: 1600 },
    { month: 'Apr', revenue: 3908, licenses: 18, views: 1400 },
    { month: 'May', revenue: 4800, licenses: 22, views: 1800 },
    { month: 'Jun', revenue: 3800, licenses: 16, views: 1300 },
  ];

  const scriptPerformance = [
    { name: 'Hamlet', revenue: 4800, licenses: 12, rating: 4.8 },
    { name: 'Romeo & Juliet', revenue: 3200, licenses: 8, rating: 4.6 },
    { name: 'Macbeth', revenue: 2800, licenses: 6, rating: 4.9 },
    { name: 'Othello', revenue: 2200, licenses: 4, rating: 4.7 },
  ];

  const genreDistribution = [
    { name: 'Drama', value: 45, color: '#8884d8' },
    { name: 'Comedy', value: 25, color: '#82ca9d' },
    { name: 'Tragedy', value: 20, color: '#ffc658' },
    { name: 'Romance', value: 10, color: '#ff7c7c' },
  ];

  const metrics = [
    {
      title: "Total Revenue",
      value: "$12,847",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "This month"
    },
    {
      title: "Active Licenses",
      value: "34",
      change: "+8",
      trend: "up", 
      icon: Download,
      description: "Currently active"
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
      title: "Avg Rating",
      value: "4.7",
      change: "+0.2",
      trend: "up",
      icon: Star,
      description: "Across all scripts"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold theater-heading">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your script performance and revenue</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
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
                </div>
                <metric.icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 theater-card">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue and license trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Genre Distribution */}
        <Card className="theater-card">
          <CardHeader>
            <CardTitle>Genre Distribution</CardTitle>
            <CardDescription>License breakdown by genre</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={genreDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {genreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="scripts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scripts">Script Performance</TabsTrigger>
          <TabsTrigger value="licenses">License Activity</TabsTrigger>
          <TabsTrigger value="audience">Audience Insights</TabsTrigger>
          <TabsTrigger value="financial">Financial Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="scripts" className="space-y-6">
          <Card className="theater-card">
            <CardHeader>
              <CardTitle>Top Performing Scripts</CardTitle>
              <CardDescription>Revenue and licensing data for your scripts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scriptPerformance.map((script, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded flex items-center justify-center">
                        <span className="font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{script.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{script.licenses} licenses</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-yellow-400" />
                            <span>{script.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">${script.revenue.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="licenses" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="theater-card">
              <CardHeader>
                <CardTitle>License Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="licenses" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Recent Licenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { script: "Hamlet", company: "Broadway Theater", date: "2 days ago", type: "Standard" },
                    { script: "Romeo & Juliet", company: "City Players", date: "5 days ago", type: "Educational" },
                    { script: "Macbeth", company: "University Drama", date: "1 week ago", type: "Educational" },
                    { script: "Othello", company: "Regional Theater", date: "2 weeks ago", type: "Standard" },
                  ].map((license, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{license.script}</p>
                        <p className="text-sm text-muted-foreground">{license.company}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{license.type}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{license.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Educational</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Professional</span>
                    <span>35%</span>
                  </div>
                  <Progress value={35} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Community</span>
                    <span>20%</span>
                  </div>
                  <Progress value={20} />
                </div>
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { region: "North America", percentage: 65 },
                  { region: "Europe", percentage: 20 },
                  { region: "Asia", percentage: 10 },
                  { region: "Other", percentage: 5 },
                ].map((region, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{region.region}</span>
                    <span className="font-medium">{region.percentage}%</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Popular Times</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { time: "September", activity: "High" },
                  { time: "January", activity: "High" },
                  { time: "March", activity: "Medium" },
                  { time: "June", activity: "Low" },
                ].map((period, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{period.time}</span>
                    <Badge variant={period.activity === "High" ? "default" : period.activity === "Medium" ? "secondary" : "outline"}>
                      {period.activity}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>License Fees</span>
                  <span className="font-semibold">$8,420</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Royalties</span>
                  <span className="font-semibold">$3,210</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Perusal Fees</span>
                  <span className="font-semibold">$1,217</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Revenue</span>
                  <span>$12,847</span>
                </div>
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Projections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Next Month</span>
                    <span className="font-semibold">$14,200</span>
                  </div>
                  <Progress value={85} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Next Quarter</span>
                    <span className="font-semibold">$42,600</span>
                  </div>
                  <Progress value={70} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Next Year</span>
                    <span className="font-semibold">$165,000</span>
                  </div>
                  <Progress value={60} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;