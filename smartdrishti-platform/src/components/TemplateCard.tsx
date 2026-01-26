import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cpu, Wifi, Bluetooth, ArrowRight, Edit, Trash2, Key, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TemplateCardProps {
  name: string;
  id: string;
  connectionType: "WiFi" | "BLE" | "USB";
  hardware: string;
  apiKey?: string;
  isActive?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onGenerateKey?: () => void;
  index?: number;
}

const connectionIcons = {
  WiFi: Wifi,
  BLE: Bluetooth,
  USB: Cpu,
};

const connectionColors = {
  WiFi: "text-secondary",
  BLE: "text-primary",
  USB: "text-accent",
};

export const TemplateCard = ({
  name,
  id,
  connectionType,
  hardware,
  apiKey,
  isActive = false,
  onEdit,
  onDelete,
  onGenerateKey,
  index = 0,
}: TemplateCardProps) => {
  const ConnectionIcon = connectionIcons[connectionType];
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="glass-card-hover group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                connectionType === "WiFi" && "bg-secondary/20",
                connectionType === "BLE" && "bg-primary/20",
                connectionType === "USB" && "bg-accent/20"
              )}>
                <ConnectionIcon className={cn("w-6 h-6", connectionColors[connectionType])} />
              </div>
              <div>
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription className="font-mono text-xs">ID: {id}</CardDescription>
              </div>
            </div>
            <div className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              isActive ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
            )}>
              {isActive ? "Active" : "Inactive"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Cpu className="w-4 h-4" />
            <span>{hardware}</span>
          </div>

          {apiKey && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">API Key</p>
                  <p className="font-mono text-sm">••••••••{apiKey.slice(-8)}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => {
                    if (apiKey) {
                      navigator.clipboard.writeText(apiKey);
                      toast({ title: 'Copied', description: 'API key copied to clipboard' });
                    }
                  }}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            {!apiKey && (
              <Button variant="glow" size="sm" onClick={onGenerateKey} className="flex-1">
                <Key className="w-4 h-4 mr-1" />
                Generate Key
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
