import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UsersSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Users</h3>
        <p className="text-sm text-muted-foreground">
          Manage users and their access to your organization
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            Add, remove, and manage users in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>User management content would go here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersSettings;