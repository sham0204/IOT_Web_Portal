import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { stepAPI } from "@/api";

const StepDetail = () => {
  const { projectId, stepId } = useParams<{ projectId: string; stepId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [step, setStep] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!projectId || !stepId) return;
      setLoading(true);
      try {
        const res = await stepAPI.getStep(projectId, stepId);
        setProject(res.project || null);
        setStep(res.step || null);
      } catch (err) {
        console.error('Failed to load step detail', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [projectId, stepId]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-48">Loading...</div>
    </DashboardLayout>
  );

  if (!project) return (
    <DashboardLayout>
      <div className="p-6">Project not found</div>
    </DashboardLayout>
  );

  if (!step) return (
    <DashboardLayout>
      <div className="p-6">Step not found</div>
    </DashboardLayout>
  );

  // detailed_content may be stored as JSON or plain text
  let detailed = step.detailed_content;
  try {
    if (typeof detailed === 'string') {
      const parsed = JSON.parse(detailed);
      detailed = parsed;
    }
  } catch (e) {
    // leave as string
  }

  const section = (key: string) => (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>{key}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert max-w-none">
          {detailed && detailed[key] ? (
            typeof detailed[key] === 'string' ? (
              <div className="text-foreground">{detailed[key]}</div>
            ) : (
              <div>{JSON.stringify(detailed[key])}</div>
            )
          ) : (
            <div className="text-muted-foreground">No content available</div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground mb-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/projects`}>Demo Projects</BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/projects/${projectId}`}>{project?.title || 'Project'}</BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </BreadcrumbItem>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Step {step.order_number || step.id}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <h1 className="text-2xl font-heading font-bold">{project.title} - Step {step.order_number || step.id}</h1>
            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
          </div>
        </div>

        <div className="space-y-4">
          {section('Description')}
          {section('Circuit Connection / Pinout')}
          {section('Components Required')}
          {section('Working Principle')}
          {section('Detailed Instructions')}

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Arduino Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-foreground whitespace-pre-wrap">
                  <code>{step.code || (detailed && detailed['Arduino Code']) || 'No code available'}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {section('Conclusion')}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StepDetail;
