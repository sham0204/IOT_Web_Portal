import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GeneralSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and default preferences
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Update your account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>General settings content would go here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;