import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Lock, ChevronDown, ChevronRight, Plus, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';

// Define permission types
type Permission = {
  id: string;
  name: string;
  description: string;
};

type Role = {
  id: string;
  name: string;
  permissions: string[];
  locked?: boolean;
};

const RolesPermissions = () => {
  // Define permissions
  const permissions: Permission[] = [
    { id: 'read', name: 'Read', description: 'View resources and data' },
    { id: 'write', name: 'Write', description: 'Create and modify resources' },
    { id: 'delete', name: 'Delete', description: 'Remove resources' },
    { id: 'manage_users', name: 'Manage Users', description: 'Add, edit, and remove users' },
    { id: 'manage_roles', name: 'Manage Roles', description: 'Create and edit roles' },
    { id: 'view_reports', name: 'View Reports', description: 'Access analytics and reports' },
    { id: 'manage_billing', name: 'Manage Billing', description: 'Handle billing and subscriptions' },
    { id: 'api_access', name: 'API Access', description: 'Access to API endpoints' },
    { id: 'admin_panel', name: 'Admin Panel', description: 'Access to admin features' },
  ];

  // Define roles
  const [roles, setRoles] = useState<Role[]>([
    { 
      id: 'admin', 
      name: 'Admin', 
      permissions: permissions.map(p => p.id),
      locked: false
    },
    { 
      id: 'staff', 
      name: 'Staff', 
      permissions: ['read', 'write', 'view_reports'],
      locked: true
    },
    { 
      id: 'user', 
      name: 'User', 
      permissions: ['read'],
      locked: true
    },
  ]);

  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const togglePermission = (roleId: string, permissionId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role && !role.locked) {
      setRoles(prevRoles => 
        prevRoles.map(r => {
          if (r.id === roleId) {
            if (r.permissions.includes(permissionId)) {
              return {
                ...r,
                permissions: r.permissions.filter(p => p !== permissionId)
              };
            } else {
              return {
                ...r,
                permissions: [...r.permissions, permissionId]
              };
            }
          }
          return r;
        })
      );
      toast.success('Permission updated');
    } else if (role && role.locked) {
      toast.error('This role is locked. Upgrade to unlock advanced permissions.');
    }
  };

  const toggleRoleExpansion = (roleId: string) => {
    setExpandedRole(expandedRole === roleId ? null : roleId);
  };

  const filteredPermissions = permissions.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Roles & Permissions</h3>
        <p className="text-sm text-muted-foreground">
          Manage user roles and their access permissions
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search permissions..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>
            Configure permissions for each role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Permissions</th>
                  {roles.map(role => (
                    <th key={role.id} className="text-center py-3 px-4 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <span>{role.name}</span>
                        {role.locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPermissions.map(permission => (
                  <tr key={permission.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{permission.name}</div>
                        <div className="text-sm text-muted-foreground">{permission.description}</div>
                      </div>
                    </td>
                    {roles.map(role => (
                      <td key={`${role.id}-${permission.id}`} className="py-3 px-4">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={role.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(role.id, permission.id)}
                            disabled={role.locked}
                          />
                          {role.locked && (
                            <div className="ml-2">
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Need more control over permissions?
          </CardTitle>
          <CardDescription>
            Unlock advanced roles and permissions by upgrading your plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Upgrade Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolesPermissions;