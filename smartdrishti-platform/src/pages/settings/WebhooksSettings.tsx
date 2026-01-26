import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const WebhooksSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Webhooks</h3>
        <p className="text-sm text-muted-foreground">
          Manage webhook endpoints for receiving real-time notifications
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Webhook Management</CardTitle>
          <CardDescription>
            Configure endpoints to receive real-time notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Webhook management content would go here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhooksSettings;