import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Filter, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

// Define log entry type
type LogEntry = {
  id: string;
  time: string;
  user: string;
  client: string;
  action: string;
  actionCode: string;
  ip: string;
  status: 'success' | 'warning' | 'error';
};

const UserActionsLog = () => {
  const [timeFilter, setTimeFilter] = useState('1d');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const itemsPerPage = 10;

  // Mock log data
  const logData: LogEntry[] = [
    { id: '1', time: '2023-07-15 14:30:22', user: 'John Doe', client: 'Web App', action: 'Login', actionCode: 'AUTH_001', ip: '192.168.1.10', status: 'success' },
    { id: '2', time: '2023-07-15 14:32:45', user: 'Jane Smith', client: 'Mobile App', action: 'Create Device', actionCode: 'DEVICE_001', ip: '192.168.1.15', status: 'success' },
    { id: '3', time: '2023-07-15 14:35:10', user: 'Admin User', client: 'Dashboard', action: 'Update Settings', actionCode: 'SETTINGS_002', ip: '192.168.1.20', status: 'success' },
    { id: '4', time: '2023-07-15 14:37:33', user: 'Jane Smith', client: 'Mobile App', action: 'Delete Device', actionCode: 'DEVICE_005', ip: '192.168.1.15', status: 'warning' },
    { id: '5', time: '2023-07-15 14:40:05', user: 'John Doe', client: 'Web App', action: 'API Request', actionCode: 'API_101', ip: '192.168.1.10', status: 'success' },
    { id: '6', time: '2023-07-15 14:42:18', user: 'Guest User', client: 'Web App', action: 'Failed Login', actionCode: 'AUTH_005', ip: '192.168.1.25', status: 'error' },
    { id: '7', time: '2023-07-15 14:45:40', user: 'Admin User', client: 'Dashboard', action: 'Create User', actionCode: 'USER_003', ip: '192.168.1.20', status: 'success' },
    { id: '8', time: '2023-07-15 14:47:22', user: 'Jane Smith', client: 'Mobile App', action: 'Update Device', actionCode: 'DEVICE_008', ip: '192.168.1.15', status: 'success' },
    { id: '9', time: '2023-07-15 14:50:15', user: 'John Doe', client: 'Web App', action: 'Export Data', actionCode: 'EXPORT_001', ip: '192.168.1.10', status: 'success' },
    { id: '10', time: '2023-07-15 14:52:30', user: 'Jane Smith', client: 'Mobile App', action: 'View Report', actionCode: 'REPORT_005', ip: '192.168.1.15', status: 'success' },
    { id: '11', time: '2023-07-15 14:55:05', user: 'Admin User', client: 'Dashboard', action: 'Delete User', actionCode: 'USER_007', ip: '192.168.1.20', status: 'warning' },
    { id: '12', time: '2023-07-15 14:57:42', user: 'John Doe', client: 'Web App', action: 'API Request', actionCode: 'API_105', ip: '192.168.1.10', status: 'success' },
  ];

  const timeFilters = [
    { value: '1h', label: '1h' },
    { value: '6h', label: '6h' },
    { value: '1d', label: '1d' },
    { value: '1w', label: '1w' },
    { value: '1mo', label: '1mo' },
    { value: '3mo', label: '3mo' },
  ];

  const handleSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedLogs = [...logData].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key as keyof LogEntry];
    const bValue = b[sortConfig.key as keyof LogEntry];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredLogs = sortedLogs.filter(entry => 
    entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.actionCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  const exportLogs = () => {
    toast.success('Logs exported successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">User Actions Log</h3>
        <p className="text-sm text-muted-foreground">
          View and audit all user activities and system events
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Audit Log</CardTitle>
            <CardDescription>
              Detailed log of all user actions and system events
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeFilters.map(filter => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" onClick={exportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('time')}
                  >
                    <div className="flex items-center gap-1">
                      Time
                      {sortConfig?.key === 'time' && (
                        sortConfig.direction === 'ascending' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('user')}
                  >
                    <div className="flex items-center gap-1">
                      User Name
                      {sortConfig?.key === 'user' && (
                        sortConfig.direction === 'ascending' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('action')}
                  >
                    <div className="flex items-center gap-1">
                      Action Name
                      {sortConfig?.key === 'action' && (
                        sortConfig.direction === 'ascending' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Action Code</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{log.time}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {log.user.charAt(0)}
                          </span>
                        </div>
                        {log.user}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.client}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={log.status === 'success' ? 'default' : 
                                log.status === 'warning' ? 'secondary' : 
                                'destructive'}
                      >
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{log.actionCode}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredLogs.length)} of {filteredLogs.length} results
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActionsLog;