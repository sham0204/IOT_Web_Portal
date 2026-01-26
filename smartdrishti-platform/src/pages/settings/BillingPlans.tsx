import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Crown, Users, Cpu, MessageCircle, DollarSign, Zap, Shield, TrendingUp } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const BillingPlans = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [currentPlan, setCurrentPlan] = useState('free');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        { name: 'Devices', value: '5', included: true },
        { name: 'Users', value: '1', included: true },
        { name: 'Templates', value: '10', included: true },
        { name: 'Messages', value: '1000/month', included: true },
        { name: 'Support', value: 'Community', included: true },
        { name: 'API Access', value: 'Limited', included: true },
      ],
      cta: 'Current Plan',
      popular: false,
    },
    {
      id: 'starter',
      name: 'Starter',
      price: { monthly: 29, yearly: 29 * 12 * 0.8 }, // 20% discount for yearly
      description: 'Hobby & early pilots',
      features: [
        { name: 'Devices', value: '50', included: true },
        { name: 'Users', value: '5', included: true },
        { name: 'Templates', value: '50', included: true },
        { name: 'Messages', value: '10,000/month', included: true },
        { name: 'Support', value: 'Email', included: true },
        { name: 'API Access', value: 'Full', included: true },
        { name: 'Basic Analytics', value: '', included: true },
        { name: 'Custom Dashboards', value: '', included: false },
        { name: 'Advanced Security', value: '', included: false },
      ],
      cta: 'Upgrade Plan',
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 299, yearly: 299 * 12 * 0.8 }, // 20% discount for yearly
      description: 'Professional IoT development',
      features: [
        { name: 'Devices', value: '500', included: true },
        { name: 'Users', value: '20', included: true },
        { name: 'Templates', value: 'Unlimited', included: true },
        { name: 'Messages', value: '100,000/month', included: true },
        { name: 'Support', value: 'Priority', included: true },
        { name: 'API Access', value: 'Full', included: true },
        { name: 'Basic Analytics', value: '', included: true },
        { name: 'Custom Dashboards', value: '', included: true },
        { name: 'Advanced Security', value: '', included: true },
        { name: 'Single Sign-On', value: '', included: true },
        { name: 'Audit Logs', value: '', included: true },
        { name: 'Custom Integrations', value: '', included: false },
      ],
      cta: 'Upgrade Plan',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 'Custom', yearly: 'Custom' },
      description: 'White-label IoT solution',
      features: [
        { name: 'Devices', value: 'Unlimited', included: true },
        { name: 'Users', value: 'Unlimited', included: true },
        { name: 'Templates', value: 'Unlimited', included: true },
        { name: 'Messages', value: 'Unlimited', included: true },
        { name: 'Support', value: '24/7 Dedicated', included: true },
        { name: 'API Access', value: 'Full', included: true },
        { name: 'Basic Analytics', value: '', included: true },
        { name: 'Custom Dashboards', value: '', included: true },
        { name: 'Advanced Security', value: '', included: true },
        { name: 'Single Sign-On', value: '', included: true },
        { name: 'Audit Logs', value: '', included: true },
        { name: 'Custom Integrations', value: '', included: true },
        { name: 'White-label', value: '', included: true },
        { name: 'Dedicated Account Manager', value: '', included: true },
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const currentPlanData = plans.find(plan => plan.id === currentPlan);

  const handlePlanChange = (planId: string) => {
    if (planId !== currentPlan) {
      setCurrentPlan(planId);
      if (planId === 'free') {
        toast.info('Downgraded to Free plan');
      } else {
        toast.success(`Upgraded to ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing & Plans</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            Your current subscription and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold flex items-center gap-2">
                {currentPlanData?.name}
                {currentPlanData?.popular && (
                  <Badge variant="secondary" className="ml-2">
                    Popular
                  </Badge>
                )}
              </h3>
              <p className="text-muted-foreground">
                {currentPlanData?.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                ${currentPlanData?.price[billingCycle] === 'Custom' 
                  ? 'Custom' 
                  : currentPlanData?.price[billingCycle]}
                {typeof currentPlanData?.price[billingCycle] === 'number' && (
                  <span className="text-lg font-normal text-muted-foreground">/
                  {billingCycle === 'yearly' ? 'year' : 'month'}</span>
                )}
              </div>
              {billingCycle === 'yearly' && typeof currentPlanData?.price.monthly === 'number' && (
                <p className="text-sm text-green-600">
                  Save ${(currentPlanData.price.monthly * 12 * 0.2).toFixed(2)} per year
                </p>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Cpu className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">3/5</div>
              <div className="text-sm text-muted-foreground">Devices</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Users className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">1/1</div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <MessageCircle className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">245/1000</div>
              <div className="text-sm text-muted-foreground">Messages</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Zap className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">7/10</div>
              <div className="text-sm text-muted-foreground">Templates</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium">Upgrade Plan</h3>
          <p className="text-sm text-muted-foreground">
            Choose a plan that fits your needs
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm">Monthly</span>
          <Switch
            id="billing-cycle"
            checked={billingCycle === 'yearly'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
          />
          <Label htmlFor="billing-cycle">Yearly (Save 20%)</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`${plan.popular ? 'border-primary border-2 relative' : ''} ${
              currentPlan === plan.id ? 'ring-2 ring-primary/30' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  <Crown className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex justify-between items-start">
                <span>{plan.name}</span>
                {plan.price[billingCycle] === 'Custom' ? (
                  <span className="text-2xl font-bold">Custom</span>
                ) : (
                  <span className="text-2xl font-bold">
                    ${plan.price[billingCycle]}
                    {typeof plan.price[billingCycle] === 'number' && (
                      <span className="text-sm font-normal text-muted-foreground">/
                      {billingCycle === 'yearly' ? 'year' : 'mo'}</span>
                    )}
                  </span>
                )}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Check className={`h-4 w-4 ${feature.included ? 'text-green-500' : 'text-muted-foreground'}`} />
                      <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                        {feature.name}
                      </span>
                    </div>
                    {feature.value && (
                      <span className={`text-sm ${feature.included ? '' : 'text-muted-foreground'}`}>
                        {feature.value}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={currentPlan === plan.id ? 'outline' : plan.popular ? 'default' : 'outline'}
                onClick={() => handlePlanChange(plan.id)}
                disabled={currentPlan === plan.id}
              >
                {currentPlan === plan.id ? 'Current Plan' : plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BillingPlans;