import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock,
  BarChart3,
  Zap,
  Settings,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

type ApiKey = {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  permissions: string[];
  active: boolean;
};

const ApiIntegrations = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'sk_prod_...xyz789',
      created: '2023-07-10',
      lastUsed: '2023-07-15',
      permissions: ['read', 'write'],
      active: true
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'sk_dev_...abc123',
      created: '2023-07-05',
      lastUsed: '2023-07-14',
      permissions: ['read'],
      active: true
    },
    {
      id: '3',
      name: 'Analytics API Key',
      key: 'sk_anl_...def456',
      created: '2023-07-01',
      lastUsed: 'Never',
      permissions: ['read'],
      active: false
    }
  ]);
  
  const [showKey, setShowKey] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['read']);

  const toggleApiKeyVisibility = (id: string) => {
    setShowKey(showKey === id ? null : id);
  };

  const revokeApiKey = (id: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === id ? { ...key, active: false } : key
    ));
    toast.success('API key revoked successfully');
  };

  const regenerateApiKey = (id: string) => {
    setApiKeys(prev => prev.map(key => {
      if (key.id === id) {
        // In a real app, this would be done via an API call
        const newKey = `sk_${Math.random().toString(36).substr(2, 10)}_${Math.random().toString(36).substr(2, 6)}`;
        return { ...key, key: newKey, lastUsed: new Date().toISOString().split('T')[0] };
      }
      return key;
    }));
    toast.success('API key regenerated successfully');
  };

  const createNewApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    const newKey: ApiKey = {
      id: (apiKeys.length + 1).toString(),
      name: newKeyName,
      key: `sk_${Math.random().toString(36).substr(2, 10)}_${Math.random().toString(36).substr(2, 6)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      permissions: newKeyPermissions,
      active: true
    };

    setApiKeys(prev => [newKey, ...prev]);
    setNewKeyName('');
    setNewKeyPermissions(['read']);
    toast.success('New API key created successfully');
  };

  const togglePermission = (permission: string) => {
    if (newKeyPermissions.includes(permission)) {
      setNewKeyPermissions(prev => prev.filter(p => p !== permission));
    } else {
      setNewKeyPermissions(prev => [...prev, permission]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('API key copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">API & Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Manage API keys and third-party integrations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
          <CardDescription>
            Create and manage API keys for programmatic access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Name your API key (e.g. 'Production', 'Analytics')"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => togglePermission('read')}
                  className={newKeyPermissions.includes('read') ? 'bg-primary text-primary-foreground' : ''}
                >
                  Read
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => togglePermission('write')}
                  className={newKeyPermissions.includes('write') ? 'bg-primary text-primary-foreground' : ''}
                >
                  Write
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => togglePermission('delete')}
                  className={newKeyPermissions.includes('delete') ? 'bg-primary text-primary-foreground' : ''}
                >
                  Delete
                </Button>
              </div>
              <Button onClick={createNewApiKey}>
                <Plus className="h-4 w-4 mr-2" />
                Create
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {showKey === apiKey.id ? apiKey.key : '••••••••••••••••'}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleApiKeyVisibility(apiKey.id)}
                        >
                          {showKey === apiKey.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{apiKey.created}</TableCell>
                    <TableCell>
                      {apiKey.lastUsed === 'Never' ? (
                        <span className="text-muted-foreground">{apiKey.lastUsed}</span>
                      ) : (
                        apiKey.lastUsed
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {apiKey.permissions.map((perm, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {perm}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={apiKey.active ? 'default' : 'outline'}>
                        {apiKey.active ? 'Active' : 'Revoked'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {apiKey.active ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => revokeApiKey(apiKey.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => regenerateApiKey(apiKey.id)}
                          >
                            Regenerate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              API Usage
            </CardTitle>
            <CardDescription>
              Track your API usage and limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Requests (24h)</span>
                  <span>1,248 / 10,000</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: '12.48%' }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Rate Limit</span>
                  <span>100 / 1000 req/min</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: '10%' }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Webhooks
            </CardTitle>
            <CardDescription>
              Configure webhook endpoints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Device Events</h4>
                  <p className="text-sm text-muted-foreground">https://your-domain.com/webhooks/devices</p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">User Actions</h4>
                  <p className="text-sm text-muted-foreground">https://your-domain.com/webhooks/users</p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
              
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Integrations
            </CardTitle>
            <CardDescription>
              Connect with third-party services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-800 font-bold">S</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Slack</h4>
                    <p className="text-sm text-muted-foreground">Notifications</p>
                  </div>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-green-800 font-bold">D</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Datadog</h4>
                    <p className="text-sm text-muted-foreground">Monitoring</p>
                  </div>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiIntegrations;