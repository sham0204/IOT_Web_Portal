import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Minus, 
  Upload, 
  Image as ImageIcon, 
  Video,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'not_started' | 'working' | 'complete';
  photos: File[];
  videos: (File | string)[];
}

interface ProjectSetupFormProps {
  onSubmit: (projectData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const ProjectSetupForm = ({ onSubmit, onCancel, initialData }: ProjectSetupFormProps) => {
  const [projectData, setProjectData] = useState({
    title: initialData?.title || '',
    difficulty: initialData?.difficulty || 'Easy',
    estimatedTime: initialData?.estimatedTime || '',
    description: initialData?.description || '',
  });

  const [steps, setSteps] = useState<Step[]>(initialData?.steps || [
    {
      id: 'step1',
      title: 'Project Setup',
      description: 'Install Arduino IDE and ESP32 board support',
      status: 'not_started',
      photos: [],
      videos: []
    },
    {
      id: 'step2',
      title: 'Hardware Connection',
      description: 'Connect DHT22 sensor to ESP32 using breadboard',
      status: 'not_started',
      photos: [],
      videos: []
    },
    {
      id: 'step3',
      title: 'Library Installation',
      description: 'Install DHT sensor library and WiFi manager',
      status: 'not_started',
      photos: [],
      videos: []
    },
    {
      id: 'step4',
      title: 'Basic Code',
      description: 'Write code to read temperature and humidity data',
      status: 'not_started',
      photos: [],
      videos: []
    },
    {
      id: 'step5',
      title: 'WiFi Connection',
      description: 'Configure WiFi credentials and connect to network',
      status: 'not_started',
      photos: [],
      videos: []
    },
    {
      id: 'step6',
      title: 'Data Logging',
      description: 'Send sensor data to cloud service (ThingSpeak)',
      status: 'not_started',
      photos: [],
      videos: []
    },
    {
      id: 'step7',
      title: 'Dashboard Creation',
      description: 'Create web dashboard to visualize data',
      status: 'not_started',
      photos: [],
      videos: []
    },
    {
      id: 'step8',
      title: 'Testing & Calibration',
      description: 'Test the complete system and calibrate readings',
      status: 'not_started',
      photos: [],
      videos: []
    }
  ]);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const videoInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleInputChange = (field: keyof typeof projectData, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const addStep = () => {
    const newStep: Step = {
      id: `step-${Date.now()}`,
      title: '',
      description: '',
      status: 'not_started',
      photos: [],
      videos: []
    };
    setSteps(prev => [...prev, newStep]);
  };

  const removeStep = (id: string) => {
    if (steps.length <= 1) {
      toast.error('Cannot remove the last step');
      return;
    }
    setSteps(prev => prev.filter(step => step.id !== id));
  };

  const updateStep = (id: string, field: keyof Step, value: any) => {
    setSteps(prev => 
      prev.map(step => 
        step.id === id ? { ...step, [field]: value } : step
      )
    );
  };

  const addPhotoToStep = (stepId: string, file: File) => {
    setSteps(prev => 
      prev.map(step => 
        step.id === stepId 
          ? { ...step, photos: [...step.photos, file] } 
          : step
      )
    );
  };

  const addVideoToStep = (stepId: string, video: File | string) => {
    setSteps(prev => 
      prev.map(step => 
        step.id === stepId 
          ? { ...step, videos: [...step.videos, video] } 
          : step
      )
    );
  };

  const triggerFileInput = (stepId: string, type: 'photo' | 'video') => {
    const ref = type === 'photo' 
      ? fileInputRefs.current[stepId] 
      : videoInputRefs.current[stepId];
    ref?.click();
  };

  const calculateProgress = () => {
    const completedSteps = steps.filter(step => step.status === 'complete').length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!projectData.title.trim()) {
      toast.error('Project title is required');
      return;
    }
    
    if (!projectData.description.trim()) {
      toast.error('Project description is required');
      return;
    }
    
    if (steps.some(step => !step.title.trim())) {
      toast.error('All steps must have a title');
      return;
    }
    
    // Prepare project data for submission
    const projectPayload = {
      ...projectData,
      steps: steps.map(step => ({
        ...step,
        photos: step.photos.map(photo => URL.createObjectURL(photo)),
        videos: step.videos.map(video => 
          typeof video === 'string' ? video : URL.createObjectURL(video)
        )
      }))
    };
    
    onSubmit(projectPayload);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Create New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Project Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={projectData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter project title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select 
                  value={projectData.difficulty} 
                  onValueChange={(value) => handleInputChange('difficulty', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Estimated Time</Label>
                <Input
                  id="estimatedTime"
                  value={projectData.estimatedTime}
                  onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                  placeholder="e.g., 2-3 hours"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description *</Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your project..."
                rows={4}
                required
              />
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Project Progress</Label>
                <span className="text-sm font-medium">{calculateProgress()}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>

            {/* Steps Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Project Steps</h3>
                <Button type="button" variant="outline" onClick={addStep}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>

              {steps.map((step, index) => (
                <Card key={step.id} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          Step {index + 1}
                        </span>
                        <Input
                          value={step.title}
                          onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                          placeholder="Step title"
                          className="font-medium"
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeStep(step.id)}
                        disabled={steps.length <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={step.description}
                          onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                          placeholder="Step description..."
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select 
                            value={step.status} 
                            onValueChange={(value: 'not_started' | 'working' | 'complete') => 
                              updateStep(step.id, 'status', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not_started">Not Started</SelectItem>
                              <SelectItem value="working">Working on this step…</SelectItem>
                              <SelectItem value="complete">Mark Complete</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Photos</Label>
                          <div className="flex gap-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => triggerFileInput(step.id, 'photo')}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Add Photo
                            </Button>
                            <input
                              ref={el => fileInputRefs.current[step.id] = el}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              multiple
                              onChange={(e) => {
                                if (e.target.files) {
                                  Array.from(e.target.files).forEach(file => {
                                    addPhotoToStep(step.id, file);
                                  });
                                }
                              }}
                            />
                          </div>
                          
                          {step.photos.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {step.photos.map((photo, photoIndex) => (
                                <div key={photoIndex} className="relative">
                                  <img 
                                    src={URL.createObjectURL(photo)} 
                                    alt={`Step photo ${photoIndex + 1}`}
                                    className="w-16 h-16 object-cover rounded border"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Videos</Label>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => triggerFileInput(step.id, 'video')}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Add Video
                          </Button>
                          <input
                            ref={el => videoInputRefs.current[step.id] = el}
                            type="file"
                            accept="video/*"
                            className="hidden"
                            multiple
                            onChange={(e) => {
                              if (e.target.files) {
                                Array.from(e.target.files).forEach(file => {
                                  addVideoToStep(step.id, file);
                                });
                              }
                            }}
                          />
                        </div>
                        
                        {step.videos.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {step.videos.map((video, videoIndex) => (
                              <div key={videoIndex} className="relative">
                                {typeof video === 'string' ? (
                                  <div className="w-32 h-20 bg-muted rounded flex items-center justify-center">
                                    <Video className="w-8 h-8 text-muted-foreground" />
                                    <span className="absolute inset-0 flex items-center justify-center text-xs text-center p-1">
                                      YouTube: {video}
                                    </span>
                                  </div>
                                ) : (
                                  <video 
                                    src={URL.createObjectURL(video)} 
                                    className="w-32 h-20 object-cover rounded border"
                                    controls
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSetupForm;