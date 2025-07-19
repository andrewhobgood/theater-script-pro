import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockScripts } from "@/lib/mock-data";
import { Upload, Eye, Download, DollarSign, Users, FileText, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const userScripts = mockScripts.filter(script => script.playwright === user.name);

  const PlaywrightDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold theater-heading">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground">Manage your scripts and track performance</p>
        </div>
        <Button className="spotlight-button">
          <Upload className="mr-2 h-4 w-4" />
          Upload New Script
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scripts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userScripts.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,847</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Licenses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+3 this week</p>
          </CardContent>
        </Card>
      </div>

      <Card className="theater-card">
        <CardHeader>
          <CardTitle>Your Scripts</CardTitle>
          <CardDescription>Manage and track your published works</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userScripts.map((script) => (
              <div key={script.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{script.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {script.genre.join(", ")} • {script.castSize.min}-{script.castSize.max} cast • {script.duration}min
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{script.difficulty}</Badge>
                    <Badge variant="outline">${script.price}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const TheaterCompanyDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold theater-heading">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">Find and license scripts for your productions</p>
        </div>
        <Button className="spotlight-button">
          Browse Scripts
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Licensed Scripts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active licenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Shows</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Next 6 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,450</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      <Card className="theater-card">
        <CardHeader>
          <CardTitle>Recent Licenses</CardTitle>
          <CardDescription>Your script licensing history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockScripts.slice(0, 3).map((script) => (
              <div key={script.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{script.title}</h3>
                  <p className="text-sm text-muted-foreground">by {script.playwright}</p>
                  <p className="text-xs text-muted-foreground">Licensed on Jan 15, 2024</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      {user.role === "playwright" ? <PlaywrightDashboard /> : <TheaterCompanyDashboard />}
    </div>
  );
};

export default Dashboard;