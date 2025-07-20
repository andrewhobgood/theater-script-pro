import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Eye, Download, DollarSign, Users, FileText, TrendingUp } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/components/ui/use-toast";
import { mockScripts } from "@/lib/mock-data";

const Dashboard = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [scripts, setScripts] = useState<any[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      fetchDashboardData();
    }
  }, [profile]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      if (profile?.role === 'playwright') {
        const response = await apiClient.scripts.getMyScripts();
        setScripts((response as any).scripts || []);
      } else if (profile?.role === 'theater_company') {
        const response = await apiClient.licenses.getMyLicenses();
        setLicenses((response as any).licenses || []);
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error loading dashboard",
        description: error.message || "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || !profile) {
    return <Navigate to="/auth" replace />;
  }

  const PlaywrightDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold theater-heading">Welcome back, {profile.first_name}</h1>
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
            <div className="text-2xl font-bold">{scripts.length}</div>
            <p className="text-xs text-muted-foreground">Total in your library</p>
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
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading scripts...</p>
            ) : scripts.length === 0 ? (
              <p className="text-center text-muted-foreground">No scripts uploaded yet</p>
            ) : (
              scripts.map((script) => (
                <div key={script.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{script.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {script.genre} • {script.cast_size_min}-{script.cast_size_max} cast • {script.duration_minutes}min
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={script.status === 'published' ? 'default' : 'secondary'}>
                        {script.status}
                      </Badge>
                      <Badge variant="outline">${script.standard_price}</Badge>
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const TheaterCompanyDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold theater-heading">Welcome, {profile.company_name || profile.first_name}</h1>
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
            <div className="text-2xl font-bold">{licenses.filter(l => l.status === 'active').length}</div>
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
      {profile.role === "playwright" ? <PlaywrightDashboard /> : <TheaterCompanyDashboard />}
    </div>
  );
};

export default Dashboard;