import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Monitor, User, Users, Shield, CreditCard, Key, LogOut, Settings, Eye, Tag, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/hooks/useTheme';

const SettingsLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { 
      id: 'general', 
      label: 'General', 
      icon: Settings,
      path: '/settings/general'
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: Users,
      path: '/settings/users'
    },
    { 
      id: 'roles', 
      label: 'Roles & Permissions', 
      icon: User,
      path: '/settings/roles'
    },
    { 
      id: 'billing', 
      label: 'Billing', 
      icon: CreditCard,
      path: '/settings/billing'
    },
    { 
      id: 'tags', 
      label: 'Tags', 
      icon: Tag,
      path: '/settings/tags'
    },
    { 
      id: 'webhooks', 
      label: 'Webhooks', 
      icon: LinkIcon,
      path: '/settings/webhooks'
    },
    { 
      id: 'logs', 
      label: 'User Actions Log', 
      icon: Eye,
      path: '/settings/logs'
    },
    { 
      id: 'appearance', 
      label: 'Appearance', 
      icon: Monitor,
      path: '/settings/appearance'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: Shield,
      path: '/settings/security'
    },
    { 
      id: 'api', 
      label: 'API & Integrations', 
      icon: Key,
      path: '/settings/api'
    },
  ];

  return (
    <div className="flex h-full w-full">
      {/* Settings Sidebar */}
      <div className="w-64 border-r p-4 flex flex-col">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Separator className="my-4" />

        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Dark Mode</span>
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          </div>
          <Button variant="outline" className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsLayout;