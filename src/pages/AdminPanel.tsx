import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { UserManagement } from '@/components/admin/UserManagement';
import { ScriptModeration } from '@/components/admin/ScriptModeration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Placeholder components for other views
const FinancialOverview = () => (
  <Card>
    <CardHeader>
      <CardTitle>Financial Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Financial management features coming soon...</p>
    </CardContent>
  </Card>
);

const AnalyticsView = () => (
  <Card>
    <CardHeader>
      <CardTitle>Analytics</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Advanced analytics features coming soon...</p>
    </CardContent>
  </Card>
);

const ReportsView = () => (
  <Card>
    <CardHeader>
      <CardTitle>Reports</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Report management features coming soon...</p>
    </CardContent>
  </Card>
);

const SecuritySettings = () => (
  <Card>
    <CardHeader>
      <CardTitle>Security Settings</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Security configuration features coming soon...</p>
    </CardContent>
  </Card>
);

const PlatformSettings = () => (
  <Card>
    <CardHeader>
      <CardTitle>Platform Settings</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">Platform configuration features coming soon...</p>
    </CardContent>
  </Card>
);

const AdminPanel = () => {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminLayout>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/scripts" element={<ScriptModeration />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/finances" element={<FinancialOverview />} />
          <Route path="/analytics" element={<AnalyticsView />} />
          <Route path="/reports" element={<ReportsView />} />
          <Route path="/security" element={<SecuritySettings />} />
          <Route path="/settings" element={<PlatformSettings />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    </ProtectedRoute>
  );
};

export default AdminPanel;