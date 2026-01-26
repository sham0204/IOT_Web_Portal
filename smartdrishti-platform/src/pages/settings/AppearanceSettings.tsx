import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

const AppearanceSettings = () => {
  const { theme, toggleTheme } = useTheme();

  const handleThemeChange = (value: string) => {
    // Update theme using the context
    if (value !== theme) {
      toggleTheme();
    }
    toast.success('Theme updated successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Appearance Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize the look and feel of the dashboard
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Choose how the dashboard looks across all devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            defaultValue={theme} 
            onValueChange={handleThemeChange}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="relative">
              <RadioGroupItem 
                value="light" 
                id="light" 
                className="peer sr-only"
              />
              <Label 
                htmlFor="light" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
              >
                <Sun className="h-6 w-6 mb-2" />
                <span>Light</span>
              </Label>
            </div>
            
            <div className="relative">
              <RadioGroupItem 
                value="dark" 
                id="dark" 
                className="peer sr-only"
              />
              <Label 
                htmlFor="dark" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
              >
                <Moon className="h-6 w-6 mb-2" />
                <span>Dark</span>
              </Label>
            </div>
            
            <div className="relative">
              <RadioGroupItem 
                value="system" 
                id="system" 
                className="peer sr-only"
              />
              <Label 
                htmlFor="system" 
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
              >
                <Monitor className="h-6 w-6 mb-2" />
                <span>System</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>
            See how your theme will look in real-time
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className={`p-6 rounded-lg border w-full max-w-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
            <div className="flex items-center space-x-4 mb-4">
              <div className={`h-10 w-10 rounded-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
              <div>
                <div className={`h-4 w-32 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                <div className={`h-3 w-24 rounded mt-2 ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-200'}`}></div>
              </div>
            </div>
            <div className={`h-4 w-full rounded mb-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            <div className={`h-4 w-5/6 rounded mb-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
            <div className={`h-4 w-3/4 rounded ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={() => toast.success('Settings saved successfully')}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default AppearanceSettings;