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
  Trophy,
  Calendar,
  Award,
  RotateCcw,
  ExternalLink
} from "lucide-react";

const ProjectSummary = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  // Mock completion data
  const completionData = {
    proj001: {
      completedDate: "2024-01-15",
      totalTimeSpent: "2 hours 45 minutes",
      stepsCompleted: 8,
      totalSteps: 8,
      completionRate: 100,
      achievements: [
        { id: 1, title: "First Project Completed", description: "Successfully completed your first IoT project" },
        { id: 2, title: "Temperature Master", description: "Mastered temperature sensor integration" },
        { id: 3, title: "Cloud Connector", description: "Successfully connected to ThingSpeak cloud service" }
      ]
    },
    proj002: {
      completedDate: "2024-01-10",
      totalTimeSpent: "5 hours 20 minutes",
      stepsCompleted: 10,
      totalSteps: 10,
      completionRate: 100,
      achievements: [
        { id: 1, title: "Automation Expert", description: "Built a complete home automation system" },
        { id: 2, title: "Node-RED Ninja", description: "Mastered Node-RED dashboard creation" },
        { id: 3, title: "Security Champion", description: "Implemented secure access controls" }
      ]
    }
  };
  
  const projectData = {
    proj001: {
      title: "Smart Temperature Logger",
      difficulty: "Easy",
      components: ["ESP32", "DHT22", "Breadboard", "Jumper Wires"],
      duration: "2-3 hours"
    },
    proj002: {
      title: "Home Automation Hub",
      difficulty: "Medium",
      components: ["Raspberry Pi 4", "Relay Module", "Power Supply", "Enclosure"],
      duration: "4-6 hours"
    }
  };
  
  const project = projectData[projectId as keyof typeof projectData];
  const completion = completionData[projectId as keyof typeof completionData];
  
  const difficultyColors = {
    Easy: "bg-accent/20 text-accent",
    Medium: "bg-secondary/20 text-secondary",
    Hard: "bg-destructive/20 text-destructive",
  };
  
  if (!project || !completion) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p>Project summary not found</p>
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
              onClick={() => navigate(`/projects/${projectId}`)}
              className="mt-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-heading font-bold">{project.title}</h1>
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Completed
                </Badge>
              </div>
              <p className="text-muted-foreground">Project completion summary and achievements</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/projects/${projectId}`)}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart Project
            </Button>
            <Button onClick={() => navigate("/projects")}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </motion.div>

        {/* Completion Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-accent">{completion.completionRate}%</h3>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-secondary">{completion.totalTimeSpent}</h3>
              <p className="text-sm text-muted-foreground">Total Time Spent</p>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-primary">{completion.completedDate}</h3>
              <p className="text-sm text-muted-foreground">Completion Date</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Project Completion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Steps Completed</span>
                  <span className="text-accent font-bold">
                    {completion.stepsCompleted}/{completion.totalSteps}
                  </span>
                </div>
                <Progress value={completion.completionRate} className="h-3" />
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <h4 className="font-medium mb-2">Project Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Difficulty:</span>
                        <Badge className={difficultyColors[project.difficulty as keyof typeof difficultyColors]}>
                          {project.difficulty}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Time:</span>
                        <span>{project.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Components Used:</span>
                        <span>{project.components.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Skills Gained</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Sensor Integration</Badge>
                      <Badge variant="outline">WiFi Connectivity</Badge>
                      <Badge variant="outline">Cloud Services</Badge>
                      <Badge variant="outline">Data Logging</Badge>
                      <Badge variant="outline">Dashboard Creation</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievements Unlocked
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {completion.achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className="p-4 border rounded-lg bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <Award className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="font-medium text-sm">{achievement.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground ml-13">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Components Used */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Components Utilized
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.components.map((component, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="px-3 py-1.5 bg-accent/10 text-accent border-accent/20"
                  >
                    {component}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectSummary;