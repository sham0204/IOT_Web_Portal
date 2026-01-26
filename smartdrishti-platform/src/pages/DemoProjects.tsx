import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Plus, Loader2 } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import ProjectCreationFormWithSteps from "@/components/ProjectCreationFormWithSteps";
import { projectAPI } from "@/api";
import { toast } from "sonner";

const DemoProjects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if user is admin (you can modify this based on your auth system)
  useEffect(() => {
    const userRole = localStorage.getItem('userRole') || 'user';
    setIsAdmin(userRole === 'admin');
  }, []);
  
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectsData: any = await projectAPI.getProjects();
      console.log('Projects loaded:', projectsData);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err: any) {
      const errorMessage = err.message || err || 'Failed to load projects';
      setError(errorMessage);
      toast.error(`Failed to load projects: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadProjects();
  }, []);

  // Filter projects
  const filteredProjects = (() => {
    let result = projects;
    
    // Apply search filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(project => 
        project.title.toLowerCase().includes(lowerQuery) ||
        project.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Apply difficulty filter
    if (difficultyFilter) {
      result = result.filter(project => project.difficulty === difficultyFilter);
    }
    
    return result;
  })();

  const completedCount = projects.filter((p: any) => p.progress === 100).length;
  const totalProjects = projects.length;
  const overallProgress = totalProjects > 0 ? (completedCount / totalProjects) * 100 : 0;

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingProject(null);
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
          <Button onClick={loadProjects} variant="outline">
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold">Demo Projects</h1>
              <p className="text-muted-foreground">Learn IoT through hands-on projects</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress Card */}
            <Card className="glass-card w-full md:w-auto">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-accent/30 flex items-center justify-center relative">
                  <span className="text-lg font-bold">{completedCount}/{totalProjects}</span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="hsl(156, 100%, 50%)"
                      strokeWidth="4"
                      strokeDasharray={`${overallProgress * 1.76} 176`}
                      className="opacity-60"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Progress</p>
                  <p className="font-semibold">{completedCount} projects completed</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Create Project Button - Moved to top-right corner */}
            <Button onClick={() => setShowCreateForm(true)} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {["Easy", "Medium", "Hard"].map((difficulty) => (
              <Button
                key={difficulty}
                variant={difficultyFilter === difficulty ? "default" : "outline"}
                size="sm"
                onClick={() => setDifficultyFilter(difficultyFilter === difficulty ? null : difficulty)}
              >
                {difficulty}
              </Button>
            ))}
          </div>
          

        </motion.div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any, index: number) => {
              console.log(`Rendering project card ${index}:`, project);
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                />
              );
            })}
          </div>
        ) : (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery || difficultyFilter 
                  ? "No projects found matching your criteria." 
                  : "No projects available yet."}
              </p>

            </CardContent>
          </Card>
        )}
      </div>

      {/* Project Creation Form with Steps */}
      <ProjectCreationFormWithSteps
        open={showCreateForm}
        onOpenChange={handleCloseForm}
      />
    </DashboardLayout>
  );
};

export default DemoProjects;