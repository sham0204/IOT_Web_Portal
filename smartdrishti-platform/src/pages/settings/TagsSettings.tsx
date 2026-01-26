import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TagsSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Tags</h3>
        <p className="text-sm text-muted-foreground">
          Manage tags for organizing and categorizing your resources
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Tag Management</CardTitle>
          <CardDescription>
            Create and manage tags for your devices and resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Tag management content would go here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TagsSettings;