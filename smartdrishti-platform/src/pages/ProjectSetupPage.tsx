import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Cpu, Wrench, FileText, CheckCircle, Loader2 } from 'lucide-react';
import ProjectSetupForm from '@/components/ProjectSetupForm';
import { toast } from 'sonner';
import { projectAPI } from '@/api';

const ProjectSetupPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSaveProject = async (projectData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transform the data to match backend expectations
      const transformedData = {
        title: projectData.title,
        difficulty: projectData.difficulty,
        estimated_time: projectData.estimatedTime,
        description: projectData.description,
        steps: projectData.steps?.map((step: any) => ({
          title: step.title,
          description: step.description,
          status: step.status
        }))
      };

      const response: any = await projectAPI.createProject(transformedData);
      
      // Refresh projects list
      await loadProjects();
      
      setShowForm(false);
      toast.success(response.message || 'Project created successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
      toast.error(err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectsData: any = await projectAPI.getProjects();
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err: any) {
      const errorMessage = err.message || err || 'Failed to load projects';
      setError(errorMessage);
      toast.error(`Failed to load projects: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-start justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Wrench className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold">Project Setup</h1>
              <p className="text-muted-foreground">Create and configure your IoT projects</p>
            </div>
          </div>

          <Card className="glass-card w-full md:w-auto">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-accent/30 flex items-center justify-center relative">
                <span className="text-lg font-bold">{projects.length}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Projects Created</p>
                <p className="font-semibold">{projects.length} projects</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        {showForm ? (
          <ProjectSetupForm 
            onSubmit={handleSaveProject} 
            onCancel={handleCancel} 
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Cpu className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Start a New IoT Project</CardTitle>
                <p className="text-muted-foreground">
                  Create a new project to guide you through the IoT development process
                </p>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => setShowForm(true)}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Create New Project
                </Button>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-medium mb-1">Step-by-Step Guidance</h4>
                    <p className="text-sm text-muted-foreground">
                      Follow structured steps to complete your project
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Cpu className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-medium mb-1">IoT Focus</h4>
                    <p className="text-sm text-muted-foreground">
                      Designed specifically for IoT learning projects
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <Wrench className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-medium mb-1">Hands-on Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      Practical exercises with real hardware
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadProjects} variant="outline">
              Retry
            </Button>
          </motion.div>
        )}

        {/* Recent Projects */}
        {!loading && !error && projects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4">Recent Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(-6).map((project: any, index: number) => (
                <Card key={project.id || index} className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {project.difficulty}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                        {project.estimated_time || 'N/A'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                    <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                      <span>{project.total_steps || 0} steps</span>
                      <span>
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {project.progress > 0 && (
                      <div className="mt-2">
                        <div className="w-full bg-secondary rounded-full h-1.5">
                          <div 
                            className="bg-primary h-1.5 rounded-full" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {project.progress}% complete
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectSetupPage;