import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  RefreshCw,
  Eye,
  Bell,
  Search,
  Filter,
  Users,
  MapPin,
  DollarSign
} from 'lucide-react';

interface License {
  id: string;
  scriptId: string;
  scriptTitle: string;
  playwright: string;
  licenseType: 'perusal' | 'educational' | 'standard' | 'commercial';
  status: 'active' | 'expired' | 'pending' | 'cancelled';
  purchaseDate: string;
  expiryDate: string;
  venue: string;
  organization: string;
  performanceDates: {
    start: string;
    end: string;
  };
  audience: {
    capacity: number;
    estimated: number;
  };
  usage: {
    downloadsRemaining: number;
    totalDownloads: number;
    performancesRemaining: number;
    totalPerformances: number;
  };
  price: number;
  renewalAvailable: boolean;
  terms: string;
}

export const LicenseManagement: React.FC = () => {
  const [licenses] = useState<License[]>([
    {
      id: 'lic-001',
      scriptId: 'hamlet-2024',
      scriptTitle: 'Hamlet: A Modern Adaptation',
      playwright: 'William Shakespeare',
      licenseType: 'standard',
      status: 'active',
      purchaseDate: '2024-01-15',
      expiryDate: '2024-07-15',
      venue: 'Broadway Theater',
      organization: 'NYC Theater Company',
      performanceDates: {
        start: '2024-03-01',
        end: '2024-03-31'
      },
      audience: {
        capacity: 500,
        estimated: 450
      },
      usage: {
        downloadsRemaining: 3,
        totalDownloads: 5,
        performancesRemaining: 8,
        totalPerformances: 12
      },
      price: 299,
      renewalAvailable: true,
      terms: 'Standard performance license with modification rights'
    },
    {
      id: 'lic-002',
      scriptId: 'romeo-juliet-2024',
      scriptTitle: 'Romeo & Juliet',
      playwright: 'William Shakespeare',
      licenseType: 'educational',
      status: 'active',
      purchaseDate: '2024-02-01',
      expiryDate: '2025-02-01',
      venue: 'Lincoln High School Auditorium',
      organization: 'Lincoln High School',
      performanceDates: {
        start: '2024-05-15',
        end: '2024-05-18'
      },
      audience: {
        capacity: 300,
        estimated: 280
      },
      usage: {
        downloadsRemaining: 8,
        totalDownloads: 10,
        performancesRemaining: 4,
        totalPerformances: 4
      },
      price: 150,
      renewalAvailable: true,
      terms: 'Educational license with student performance rights'
    },
    {
      id: 'lic-003',
      scriptId: 'macbeth-2024',
      scriptTitle: 'Macbeth',
      playwright: 'William Shakespeare',
      licenseType: 'standard',
      status: 'expired',
      purchaseDate: '2023-08-01',
      expiryDate: '2024-02-01',
      venue: 'Community Center',
      organization: 'Local Drama Society',
      performanceDates: {
        start: '2023-12-01',
        end: '2023-12-15'
      },
      audience: {
        capacity: 200,
        estimated: 180
      },
      usage: {
        downloadsRemaining: 0,
        totalDownloads: 3,
        performancesRemaining: 0,
        totalPerformances: 6
      },
      price: 199,
      renewalAvailable: true,
      terms: 'Standard performance license'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredLicenses = licenses.filter(license => {
    const matchesSearch = license.scriptTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.playwright.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         license.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || license.status === statusFilter;
    const matchesType = typeFilter === 'all' || license.licenseType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: License['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLicenseTypeColor = (type: License['licenseType']) => {
    switch (type) {
      case 'perusal': return 'bg-blue-100 text-blue-800';
      case 'educational': return 'bg-green-100 text-green-800';
      case 'standard': return 'bg-purple-100 text-purple-800';
      case 'commercial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUsagePercentage = (remaining: number, total: number) => {
    if (total === 0) return 0;
    return ((total - remaining) / total) * 100;
  };

  const activeLicenses = licenses.filter(l => l.status === 'active').length;
  const expiringLicenses = licenses.filter(l => {
    const daysUntilExpiry = getDaysUntilExpiry(l.expiryDate);
    return l.status === 'active' && daysUntilExpiry <= 30;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header & Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold theater-heading">License Management</h2>
          <p className="text-muted-foreground">Track and manage your script licenses</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Set Reminders
          </Button>
          <Button className="spotlight-button">
            <FileText className="h-4 w-4 mr-2" />
            Browse Scripts
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Licenses</p>
                <p className="text-2xl font-bold">{activeLicenses}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold">{expiringLicenses}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Licenses</p>
                <p className="text-2xl font-bold">{licenses.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">${licenses.reduce((sum, l) => sum + l.price, 0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Licenses Alert */}
      {expiringLicenses > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {expiringLicenses} license(s) expiring within 30 days. Consider renewing to avoid interruption.
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search licenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="perusal">Perusal</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* License List */}
      <div className="space-y-4">
        {filteredLicenses.map(license => {
          const daysUntilExpiry = getDaysUntilExpiry(license.expiryDate);
          const downloadProgress = getUsagePercentage(license.usage.downloadsRemaining, license.usage.totalDownloads);
          const performanceProgress = getUsagePercentage(license.usage.performancesRemaining, license.usage.totalPerformances);
          
          return (
            <Card key={license.id} className="theater-card">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{license.scriptTitle}</h3>
                        <p className="text-muted-foreground">by {license.playwright}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(license.status)} variant="secondary">
                          {license.status}
                        </Badge>
                        <Badge className={getLicenseTypeColor(license.licenseType)} variant="secondary">
                          {license.licenseType}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{license.organization}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{license.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(license.performanceDates.start).toLocaleDateString()} - 
                            {new Date(license.performanceDates.end).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {license.status === 'active' 
                              ? `${daysUntilExpiry} days remaining`
                              : `Expired ${Math.abs(daysUntilExpiry)} days ago`
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>${license.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Usage Tracking */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Downloads Used</span>
                          <span>{license.usage.totalDownloads - license.usage.downloadsRemaining}/{license.usage.totalDownloads}</span>
                        </div>
                        <Progress value={downloadProgress} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Performances Used</span>
                          <span>{license.usage.totalPerformances - license.usage.performancesRemaining}/{license.usage.totalPerformances}</span>
                        </div>
                        <Progress value={performanceProgress} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    
                    {license.status === 'active' && (
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Script
                      </Button>
                    )}
                    
                    {license.renewalAvailable && (
                      <Button 
                        size="sm" 
                        className="w-full spotlight-button"
                        variant={license.status === 'expired' ? 'default' : 'outline'}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        {license.status === 'expired' ? 'Renew License' : 'Extend License'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredLicenses.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No licenses found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'No licenses match your current filters' 
                : 'You haven\'t purchased any licenses yet'}
            </p>
            <Button className="spotlight-button">
              <FileText className="h-4 w-4 mr-2" />
              Browse Scripts
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};