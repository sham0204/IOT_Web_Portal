import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Clock, 
  Cpu, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw,
  Check,
  Star,
  ExternalLink,
  Loader2,
  Lightbulb,
  Code,
  Image
} from "lucide-react";
import { toast } from "sonner";
import { projectAPI, stepAPI } from "@/api";

// Mock project data with detailed steps
const mockProjectData = {
  proj001: {
    id: "proj001",
    title: "Smart Temperature Logger",
    description: "Build a temperature monitoring system using ESP32 and DHT22 sensor with cloud data logging.",
    difficulty: "Easy",
    components: ["ESP32", "DHT22", "Breadboard", "Jumper Wires", "USB Cable"],
    duration: "2-3 hours",
    estimatedSteps: 8,
    steps: [
      {
        id: 1,
        title: "Project Setup",
        description: "Install Arduino IDE and ESP32 board support",
        completed: false,
        timeEstimate: "30 mins"
      },
      {
        id: 2,
        title: "Hardware Connection",
        description: "Connect DHT22 sensor to ESP32 using breadboard",
        completed: false,
        timeEstimate: "20 mins"
      },
      {
        id: 3,
        title: "Library Installation",
        description: "Install DHT sensor library and WiFi manager",
        completed: false,
        timeEstimate: "15 mins"
      },
      {
        id: 4,
        title: "Basic Code",
        description: "Write code to read temperature and humidity data",
        completed: false,
        timeEstimate: "45 mins"
      },
      {
        id: 5,
        title: "WiFi Connection",
        description: "Configure WiFi credentials and connect to network",
        completed: false,
        timeEstimate: "20 mins"
      },
      {
        id: 6,
        title: "Data Logging",
        description: "Send sensor data to cloud service (ThingSpeak)",
        completed: false,
        timeEstimate: "30 mins"
      },
      {
        id: 7,
        title: "Dashboard Creation",
        description: "Create web dashboard to visualize data",
        completed: false,
        timeEstimate: "30 mins"
      },
      {
        id: 8,
        title: "Testing & Calibration",
        description: "Test the complete system and calibrate readings",
        completed: false,
        timeEstimate: "20 mins"
      }
    ]
  },
  proj002: {
    id: "proj002",
    title: "Home Automation Hub",
    description: "Create a centralized hub for controlling smart devices using Raspberry Pi and Node-RED.",
    difficulty: "Medium",
    components: ["Raspberry Pi 4", "Relay Module", "Power Supply", "Enclosure", "SD Card"],
    duration: "4-6 hours",
    estimatedSteps: 10,
    steps: [
      {
        id: 1,
        title: "Raspberry Pi Setup",
        description: "Install Raspberry Pi OS and configure basic settings",
        completed: false,
        timeEstimate: "45 mins"
      },
      {
        id: 2,
        title: "Node-RED Installation",
        description: "Install Node-RED and required nodes for home automation",
        completed: false,
        timeEstimate: "30 mins"
      },
      {
        id: 3,
        title: "GPIO Configuration",
        description: "Configure GPIO pins for relay control",
        completed: false,
        timeEstimate: "25 mins"
      },
      {
        id: 4,
        title: "Relay Circuit",
        description: "Build relay circuit for appliance control",
        completed: false,
        timeEstimate: "40 mins"
      },
      {
        id: 5,
        title: "Dashboard Design",
        description: "Design Node-RED dashboard for device control",
        completed: false,
        timeEstimate: "1 hour"
      },
      {
        id: 6,
        title: "MQTT Broker Setup",
        description: "Install and configure Mosquitto MQTT broker",
        completed: false,
        timeEstimate: "30 mins"
      },
      {
        id: 7,
        title: "Device Integration",
        description: "Integrate smart devices with the automation hub",
        completed: false,
        timeEstimate: "1 hour"
      },
      {
        id: 8,
        title: "Scheduling System",
        description: "Create automated schedules for device control",
        completed: false,
        timeEstimate: "45 mins"
      },
      {
        id: 9,
        title: "Security Configuration",
        description: "Configure authentication and secure access",
        completed: false,
        timeEstimate: "30 mins"
      },
      {
        id: 10,
        title: "Testing & Deployment",
        description: "Test all functionalities and deploy to production",
        completed: false,
        timeEstimate: "45 mins"
      }
    ]
  }
};

// Extend the mock data for other projects
const extendMockData = () => {
  const baseProjects = Object.keys(mockProjectData);
  const allProjects = [...baseProjects, "proj003", "proj004", "proj005", "proj006"];
  
  allProjects.forEach(id => {
    if (!mockProjectData[id as keyof typeof mockProjectData]) {
      mockProjectData[id as keyof typeof mockProjectData] = {
        id,
        title: `Project ${id}`,
        description: `Detailed description for ${id}`,
        difficulty: "Medium",
        components: ["Component 1", "Component 2", "Component 3"],
        duration: "3-4 hours",
        estimatedSteps: 6,
        steps: [
          { id: 1, title: "Step 1", description: "Description 1", completed: false, timeEstimate: "30 mins" },
          { id: 2, title: "Step 2", description: "Description 2", completed: false, timeEstimate: "45 mins" },
          { id: 3, title: "Step 3", description: "Description 3", completed: false, timeEstimate: "30 mins" },
          { id: 4, title: "Step 4", description: "Description 4", completed: false, timeEstimate: "40 mins" },
          { id: 5, title: "Step 5", description: "Description 5", completed: false, timeEstimate: "25 mins" },
          { id: 6, title: "Step 6", description: "Description 6", completed: false, timeEstimate: "30 mins" }
        ]
      };
    }
  });
};

extendMockData();

const difficultyColors = {
  Easy: "bg-green-500/20 text-green-500",
  Medium: "bg-yellow-500/20 text-yellow-500", 
  Hard: "bg-red-500/20 text-red-500",
};

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  console.log('ProjectDetails mounted with projectId:', projectId);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadProject = async () => {
    if (!projectId) {
      console.log('No projectId provided');
      return;
    }
    
    try {
      console.log('Loading project:', projectId);
      setLoading(true);
      setError(null);
      const projectData: any = await projectAPI.getProjectById(projectId);
      console.log('Project data received:', projectData);
      
      // Ensure the project data has the expected structure
      const normalizedProject = {
        ...projectData,
        components: projectData.components || ["ESP32", "DHT22", "Breadboard"],
        duration: projectData.estimated_time || "2-3 hours",
        steps: projectData.steps || [],
        working_principle: projectData.working_principle || "",
        code: projectData.code || "",
        image_url: projectData.image_url || "",
        conclusion: projectData.conclusion || ""
      };
      
      setProject(normalizedProject);
    } catch (err: any) {
      console.error('Error loading project:', err);
      const errorMessage = err.message || err || 'Failed to load project';
      setError(errorMessage);
      toast.error(`Failed to load project: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadProject();
  }, [projectId]);
  
  useEffect(() => {
    if (project && project.steps) {
      // Initialize step statuses from project data
      const stepStatuses = project.steps.map((step: any) => 
        step.status === 'completed' ? 100 : 0
      );
      // We'll manage progress in state based on step statuses
    }
  }, [project]);
  
  // Calculate overall progress
  const calculateProgress = () => {
    if (!project || !project.steps || project.steps.length === 0) return 0;
    const completedSteps = project.steps.filter((step: any) => step.status === 'completed').length;
    return Math.round((completedSteps / project.steps.length) * 100);
  };
  
  const overallProgress = calculateProgress();
  const isCompleted = overallProgress === 100;
  
  const handleStepComplete = async (stepId: string, stepIndex: number) => {
    console.log('Mark Complete clicked:', { stepId, stepIndex });
    console.log('Current project:', project);
    console.log('Current steps:', project?.steps);
    
    if (!stepId) {
      console.error('Step ID is undefined');
      toast.error('Step ID is missing');
      return;
    }
    
    try {
      console.log('Updating step:', stepId);
      const response = await stepAPI.updateStep(stepId, { status: 'completed' });
      console.log('Step update response:', response);
      toast.success(`Step ${stepIndex + 1} completed!`);
      
      // Reload project to get updated data
      await loadProject();
      
      // Move to next step if available
      if (stepIndex < (project?.steps?.length || 0) - 1) {
        setTimeout(() => {
          setCurrentStep(stepIndex + 1);
        }, 1000);
      }
    } catch (err: any) {
      console.error('Error updating step:', err);
      console.error('Error details:', err.response?.data || err.message);
      toast.error(err.response?.data?.error || err.message || 'Failed to update step');
    }
  };
  
  const handleResetProgress = async () => {
    if (!project || !project.steps) return;
    
    try {
      // Reset all steps to not_started
      for (const step of project.steps) {
        await stepAPI.updateStep(step.id, { status: 'not_started' });
      }
      
      toast.info("Project progress reset");
      await loadProject(); // Reload to show updated status
      setCurrentStep(0);
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset progress');
    }
  };
  
  const handleStartProject = () => {
    setCurrentStep(0);
    toast.success("Project started!");
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={loadProject} variant="outline">
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p>Project not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-start justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate("/projects")}
              className="mt-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-heading font-bold">{project.title}</h1>
                {isCompleted && (
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground max-w-2xl">{project.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <Badge className={difficultyColors[project.difficulty as keyof typeof difficultyColors] || "bg-blue-500/20 text-blue-500"}>
                  {project.difficulty}
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{project.duration || project.estimated_time || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{(project.steps?.length || 0)} Steps</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isCompleted && (
              <Button variant="outline" onClick={handleResetProgress}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
            <Button 
              variant={isCompleted ? "default" : "outline"}
              onClick={() => navigate(`/projects/${projectId}/summary`)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {isCompleted ? "View Summary" : "Summary"}
            </Button>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Project Progress</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {(project.steps?.filter((s: any) => s.status === 'completed').length || 0)}/{(project.steps?.length || 0)} Steps Completed
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={overallProgress} className="h-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className={isCompleted ? "text-accent font-medium" : "text-foreground"}>
                    {overallProgress}%
                  </span>
                </div>
                
                {isCompleted && (
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-2 text-accent">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">Congratulations! Project completed successfully.</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Image */}
        {project.image_url && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Project Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="max-w-full h-auto rounded-lg border border-border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Working Principle */}
        {project.working_principle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Working Principle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed">
                    {project.working_principle}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Components Needed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Required Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.components && project.components.length > 0 ? (
                  project.components.map((component, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1.5">
                      {component}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No components specified</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Step-by-Step Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.steps && project.steps.length > 0 ? (
                  project.steps.map((step, index) => (
                    <div 
                      key={step.id} 
                      onClick={() => navigate(`/projects/${projectId}/steps/${step.id}`)}
                      role="button"
                      tabIndex={0}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        index === currentStep 
                          ? "border-accent bg-accent/10 ring-2 ring-accent/30" 
                          : project.steps[index]?.status === 'completed'
                            ? "border-success/30 bg-success/5"
                            : "border-border hover:bg-muted/50"
                      }`}
                      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/projects/${projectId}/steps/${step.id}`); }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              index === currentStep 
                                ? "bg-accent text-accent-foreground" 
                                : project.steps[index]?.status === 'completed'
                                  ? "bg-success text-success-foreground"
                                  : "bg-muted text-muted-foreground"
                            }`}>
                              {project.steps[index]?.status === 'completed' ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            <h3 className="font-medium">{step.title || `Step ${index + 1}`}</h3>
                            {step.timeEstimate && (
                              <Badge variant="outline" className="text-xs">
                                {step.timeEstimate}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground ml-11">
                            {step.description || 'No description available'}
                          </p>
                        </div>
                        
                        {project.steps[index]?.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            onClick={(e) => { e.stopPropagation(); handleStepComplete(step.id, index); }}
                            className="ml-4"
                            disabled={index > currentStep}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {index === currentStep ? 'Mark Complete' : 'Start Step'}
                          </Button>
                        )}
                        
                        {project.steps[index]?.status === 'completed' && (
                          <div className="flex items-center gap-2 text-success ml-4">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-sm">Completed</span>
                          </div>
                        )}
                      </div>
                      
                      {index === currentStep && project.steps[index]?.status !== 'completed' && (
                        <div className="mt-3 ml-11">
                          <Progress value={75} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Working on this step...
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No steps available for this project</p>
                  </div>
                )}
              </div>
              
              {!isCompleted && overallProgress === 0 && project.steps && project.steps.length > 0 && (
                <div className="mt-6 text-center">
                  <Button onClick={() => setCurrentStep(0)} size="lg">
                    <Play className="w-5 h-5 mr-2" />
                    Start Project
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Code Section */}
        {project.code && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Source Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-foreground whitespace-pre-wrap">
                    <code>{project.code}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Conclusion */}
        {project.conclusion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Conclusion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed">
                    {project.conclusion}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;