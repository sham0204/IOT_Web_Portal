import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Star,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import { useToast } from '@/hooks/use-toast';
import { projectAPI } from '@/api';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface ProjectCardProps {
  project: any;
  onEdit?: (project: any) => void;
}

const ProjectCard = ({ project, onEdit }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useProjectManagement();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const difficultyColors = {
    Easy: "bg-accent/20 text-accent",
    Medium: "bg-secondary/20 text-secondary", 
    Hard: "bg-destructive/20 text-destructive",
  };

  const handleProjectClick = () => {
    console.log('Project clicked:', project.id, project);
    navigate(`/projects/${project.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(project);
  };

  const handleDelete = async () => {
    try {
      await projectAPI.delete(project.id);
      toast({ title: 'Success', description: 'Project deleted successfully' });
      // Optionally, you can trigger a refresh of the project list here
      // For now, we'll just close the dialog and expect the parent to handle the refresh
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete project', variant: 'destructive' });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handleViewSummary = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/projects/${project.id}/summary`);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="cursor-pointer"
        onClick={handleProjectClick}
      >
        <Card className={`glass-card-hover h-full flex flex-col group ${
          project.completed ? "border-accent/30" : ""
        }`}>
          <CardHeader>
            <div className="flex items-start justify-between mb-2">
              <Badge className={`text-xs ${difficultyColors[project.difficulty as keyof typeof difficultyColors]}`}>
                {project.difficulty}
              </Badge>
              <div className="flex items-center gap-2">
                {project.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <span className="text-sm">{project.rating}</span>
                  </div>
                )}
                
                {isAdmin && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteDialog(true);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            
            <CardTitle className="text-lg leading-tight group-hover:text-accent transition-colors">
              {project.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {project.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{project.duration || 'N/A'}</span>
              </div>
              
              <div className="flex flex-wrap gap-1.5">
                {project.components?.slice(0, 3).map((comp: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-md bg-muted/50">
                    {comp}
                  </span>
                ))}
                {project.components?.length > 3 && (
                  <span className="text-xs px-2 py-1 rounded-md bg-muted/50">
                    +{project.components.length - 3}
                  </span>
                )}
              </div>

              {/* Progress */}
              {project.progress !== undefined && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className={project.completed ? "text-accent" : "text-foreground"}>
                      {project.progress}%
                    </span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <Button
                variant={project.completed ? "outline" : "glow"}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Start Project button clicked:', project.id);
                  if (project.completed) {
                    handleViewSummary(e);
                  }
                }}
              >
                {project.completed ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 text-accent" />
                    View Summary
                  </>
                ) : project.progress > 0 ? (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Start Project
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
              
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleEdit}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project "{project.title}" 
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectCard;