import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useProjectManagement } from '@/hooks/useProjectManagement';
import { useToast } from '@/hooks/use-toast';

interface ProjectCreationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing?: boolean;
  initialData?: any;
  projectId?: string;
}

const ProjectCreationForm = ({ 
  open, 
  onOpenChange, 
  isEditing = false,
  initialData,
  projectId
}: ProjectCreationFormProps) => {
  const { addProject, updateProject, isLoading } = useProjectManagement();
  const { toast } = useToast();
  const [components, setComponents] = useState<string[]>(initialData?.components || []);
  const [newComponent, setNewComponent] = useState('');
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    difficulty: initialData?.difficulty || 'Easy',
    duration: initialData?.duration || '',
    procedure: initialData?.procedure || '',
    conclusion: initialData?.conclusion || '',
    references: initialData?.references || ''
  });
  
  const [files, setFiles] = useState({
    pinoutDiagram: null as File | null,
    blockDiagram: null as File | null,
    codeFile: null as File | null
  });
  
  const [previews, setPreviews] = useState({
    pinoutDiagram: initialData?.pinoutDiagram || '',
    blockDiagram: initialData?.blockDiagram || ''
  });
  
  const fileInputRefs = {
    pinout: useRef<HTMLInputElement>(null),
    block: useRef<HTMLInputElement>(null),
    code: useRef<HTMLInputElement>(null)
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addComponent = () => {
    if (newComponent.trim() && !components.includes(newComponent.trim())) {
      setComponents([...components, newComponent.trim()]);
      setNewComponent('');
    }
  };

  const removeComponent = (index: number) => {
    setComponents(components.filter((_, i) => i !== index));
  };

  const handleFileUpload = (type: 'pinout' | 'block' | 'code', file: File) => {
    if (type === 'pinout' || type === 'block') {
      // For images, create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => ({
          ...prev,
          [type === 'pinout' ? 'pinoutDiagram' : 'blockDiagram']: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
      
      setFiles(prev => ({
        ...prev,
        [type === 'pinout' ? 'pinoutDiagram' : type === 'block' ? 'blockDiagram' : 'codeFile']: file
      }));
    } else {
      // For code files
      setFiles(prev => ({
        ...prev,
        codeFile: file
      }));
    }
  };

  const triggerFileInput = (type: 'pinout' | 'block' | 'code') => {
    const ref = fileInputRefs[type === 'pinout' ? 'pinout' : type === 'block' ? 'block' : 'code'];
    ref.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      toast({ title: 'Error', description: 'Project title is required', variant: 'destructive' });
      return;
    }
    
    if (!formData.description.trim()) {
      toast({ title: 'Error', description: 'Project description is required', variant: 'destructive' });
      return;
    }
    
    if (components.length === 0) {
      toast({ title: 'Error', description: 'At least one component is required', variant: 'destructive' });
      return;
    }

    try {
      const projectData = {
        ...formData,
        components,
        pinoutDiagram: files.pinoutDiagram,
        blockDiagram: files.blockDiagram,
        codeFile: files.codeFile
      };

      if (isEditing && projectId) {
        await updateProject(projectId, projectData);
        toast({ title: 'Success', description: 'Project updated successfully' });
      } else {
        await addProject(projectData);
        toast({ title: 'Success', description: 'Project created successfully' });
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        difficulty: 'Easy',
        duration: '',
        procedure: '',
        conclusion: '',
        references: ''
      });
      setComponents([]);
      setFiles({ pinoutDiagram: null, blockDiagram: null, codeFile: null });
      setPreviews({ pinoutDiagram: '', blockDiagram: '' });
      onOpenChange(false);
      
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: `Failed to ${isEditing ? 'update' : 'create'} project`, 
        variant: 'destructive' 
      });
    }
  };

  const removeFile = (type: 'pinout' | 'block' | 'code') => {
    if (type === 'pinout' || type === 'block') {
      setPreviews(prev => ({
        ...prev,
        [type === 'pinout' ? 'pinoutDiagram' : 'blockDiagram']: ''
      }));
    }
    setFiles(prev => ({
      ...prev,
      [type === 'pinout' ? 'pinoutDiagram' : type === 'block' ? 'blockDiagram' : 'codeFile']: null
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter project title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level *</Label>
              <Select 
                value={formData.difficulty} 
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your project..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Estimated Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              placeholder="e.g., 2-3 hours"
            />
          </div>

          {/* Components */}
          <div className="space-y-2">
            <Label>Required Components *</Label>
            <div className="flex gap-2">
              <Input
                value={newComponent}
                onChange={(e) => setNewComponent(e.target.value)}
                placeholder="Add component"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addComponent())}
              />
              <Button type="button" variant="outline" onClick={addComponent}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {components.map((component, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1.5">
                  {component}
                  <button 
                    type="button" 
                    onClick={() => removeComponent(index)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pinout Diagram */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Pinout Diagram
                    </Label>
                    {previews.pinoutDiagram && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFile('pinout')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {previews.pinoutDiagram ? (
                    <div className="relative">
                      <img 
                        src={previews.pinoutDiagram} 
                        alt="Pinout diagram preview" 
                        className="w-full h-32 object-cover rounded border"
                      />
                    </div>
                  ) : (
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full h-32 border-2 border-dashed"
                      onClick={() => triggerFileInput('pinout')}
                    >
                      <div className="text-center">
                        <Upload className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm">Upload Image</p>
                      </div>
                    </Button>
                  )}
                  
                  <input
                    ref={fileInputRefs.pinout}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('pinout', e.target.files[0])}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Block Diagram */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Block Diagram
                    </Label>
                    {previews.blockDiagram && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFile('block')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {previews.blockDiagram ? (
                    <div className="relative">
                      <img 
                        src={previews.blockDiagram} 
                        alt="Block diagram preview" 
                        className="w-full h-32 object-cover rounded border"
                      />
                    </div>
                  ) : (
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full h-32 border-2 border-dashed"
                      onClick={() => triggerFileInput('block')}
                    >
                      <div className="text-center">
                        <Upload className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm">Upload Image</p>
                      </div>
                    </Button>
                  )}
                  
                  <input
                    ref={fileInputRefs.block}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('block', e.target.files[0])}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Code File */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Project Code
                  </Label>
                  
                  {files.codeFile ? (
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm truncate">{files.codeFile.name}</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFile('code')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full h-32 border-2 border-dashed"
                      onClick={() => triggerFileInput('code')}
                    >
                      <div className="text-center">
                        <Upload className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-sm">Upload Code File</p>
                        <p className="text-xs text-muted-foreground">.ino, .py, .zip</p>
                      </div>
                    </Button>
                  )}
                  
                  <input
                    ref={fileInputRefs.code}
                    type="file"
                    accept=".ino,.py,.zip,.txt"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('code', e.target.files[0])}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Procedure */}
          <div className="space-y-2">
            <Label htmlFor="procedure">Project Procedure *</Label>
            <Textarea
              id="procedure"
              value={formData.procedure}
              onChange={(e) => handleInputChange('procedure', e.target.value)}
              placeholder="Step-by-step instructions..."
              rows={6}
              required
            />
          </div>

          {/* Conclusion */}
          <div className="space-y-2">
            <Label htmlFor="conclusion">Conclusion *</Label>
            <Textarea
              id="conclusion"
              value={formData.conclusion}
              onChange={(e) => handleInputChange('conclusion', e.target.value)}
              placeholder="Project outcomes and learnings..."
              rows={3}
              required
            />
          </div>

          {/* References */}
          <div className="space-y-2">
            <Label htmlFor="references">Project References</Label>
            <Textarea
              id="references"
              value={formData.references}
              onChange={(e) => handleInputChange('references', e.target.value)}
              placeholder="Links, tutorials, documentation..."
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectCreationForm;