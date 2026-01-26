import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TemplateCard } from "@/components/TemplateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockTemplates = [
  { id: "temp001", name: "Temperature Monitor", connectionType: "WiFi" as const, hardware: "ESP32", apiKey: "sk_live_xxxxxxxxxxxxx", isActive: true },
  { id: "temp002", name: "Humidity Sensor Hub", connectionType: "WiFi" as const, hardware: "Arduino Nano", apiKey: undefined, isActive: false },
  { id: "temp003", name: "Motion Detection", connectionType: "BLE" as const, hardware: "ESP32-C3", apiKey: "sk_live_yyyyyyyyyyyy", isActive: true },
  { id: "temp004", name: "Smart Gateway", connectionType: "USB" as const, hardware: "Raspberry Pi 4", apiKey: "sk_live_zzzzzzzzzzzz", isActive: true },
  { id: "temp005", name: "Soil Moisture", connectionType: "WiFi" as const, hardware: "NodeMCU", apiKey: undefined, isActive: false },
];

const Templates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState(mockTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    connectionType: "WiFi",
    hardware: "",
    description: "",
  });
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [editTemplate, setEditTemplate] = useState({
    name: "",
    connectionType: "WiFi",
    hardware: "",
    description: "",
  });

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.hardware.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTemplate = () => {
    const template = {
      id: `temp${String(templates.length + 1).padStart(3, "0")}`,
      name: newTemplate.name,
      connectionType: newTemplate.connectionType as "WiFi" | "BLE" | "USB",
      hardware: newTemplate.hardware,
      apiKey: undefined,
      isActive: false,
    };
    setTemplates([...templates, template]);
    setIsDialogOpen(false);
    setNewTemplate({ name: "", connectionType: "WiFi", hardware: "", description: "" });
    toast({
      title: "Template Created",
      description: `${template.name} has been created successfully.`,
    });
  };

  const handleGenerateKey = (id: string) => {
    setTemplates(templates.map((t) =>
      t.id === id ? { ...t, apiKey: `sk_live_${Math.random().toString(36).substring(2, 15)}` } : t
    ));
    toast({
      title: "API Key Generated",
      description: "Your new API key has been generated and is ready to use.",
    });
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
    toast({
      title: "Template Deleted",
      description: "The template has been removed.",
      variant: "destructive",
    });
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setEditTemplate({
      name: template.name,
      connectionType: template.connectionType,
      hardware: template.hardware,
      description: "", // Description isn't stored in the template object
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return;
    
    setTemplates(templates.map(t => 
      t.id === editingTemplate.id ? {
        ...t,
        name: editTemplate.name,
        connectionType: editTemplate.connectionType as "WiFi" | "BLE" | "USB",
        hardware: editTemplate.hardware
      } : t
    ));
    
    setIsEditDialogOpen(false);
    setEditingTemplate(null);
    setEditTemplate({ name: "", connectionType: "WiFi", hardware: "", description: "" });
    
    toast({
      title: "Template Updated",
      description: `${editTemplate.name} has been updated successfully.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-heading font-bold">Templates</h1>
            <p className="text-muted-foreground">Manage your IoT device templates and configurations</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-border/50">
              <DialogHeader>
                <DialogTitle className="font-heading">Create New Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Template Name</Label>
                  <Input
                    placeholder="e.g., Temperature Monitor"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Connection Type</Label>
                  <Select
                    value={newTemplate.connectionType}
                    onValueChange={(value) => setNewTemplate({ ...newTemplate, connectionType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WiFi">WiFi</SelectItem>
                      <SelectItem value="BLE">Bluetooth LE</SelectItem>
                      <SelectItem value="USB">USB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Hardware Required</Label>
                  <Input
                    placeholder="e.g., ESP32, Arduino, Raspberry Pi"
                    value={newTemplate.hardware}
                    onChange={(e) => setNewTemplate({ ...newTemplate, hardware: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe what this template is for..."
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  />
                </div>
                <Button variant="hero" className="w-full" onClick={handleCreateTemplate}>
                  Create Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Edit Template Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass-card border-border/50">
            <DialogHeader>
              <DialogTitle className="font-heading">Edit Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input
                  placeholder="e.g., Temperature Monitor"
                  value={editTemplate.name}
                  onChange={(e) => setEditTemplate({ ...editTemplate, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Connection Type</Label>
                <Select
                  value={editTemplate.connectionType}
                  onValueChange={(value) => setEditTemplate({ ...editTemplate, connectionType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WiFi">WiFi</SelectItem>
                    <SelectItem value="BLE">Bluetooth LE</SelectItem>
                    <SelectItem value="USB">USB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Hardware Required</Label>
                <Input
                  placeholder="e.g., ESP32, Arduino, Raspberry Pi"
                  value={editTemplate.hardware}
                  onChange={(e) => setEditTemplate({ ...editTemplate, hardware: e.target.value })}
                />
              </div>
              <Button variant="hero" className="w-full" onClick={handleUpdateTemplate}>
                Update Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Search & Filter */}
        <motion.div
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </motion.div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              {...template}
              index={index}
              onGenerateKey={() => handleGenerateKey(template.id)}
              onDelete={() => handleDelete(template.id)}
              onEdit={() => handleEdit(template)}
            />
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <Card className="glass-card">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No templates found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Templates;
