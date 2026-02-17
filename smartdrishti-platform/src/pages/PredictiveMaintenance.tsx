import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Thermometer, 
  Droplets,
  Wifi,
  Battery,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Calendar,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { iotAPI } from "@/api";

const PredictiveMaintenance = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  const loadAnalysis = async () => {
    if (!deviceId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get device info
      const deviceResponse = await iotAPI.getDeviceById(deviceId);
      setDeviceInfo(deviceResponse.device);
      
      // Get predictive analysis
      const analysisResponse = await iotAPI.predictDeviceFailure(deviceId);
      setAnalysis(analysisResponse);
      
    } catch (err: any) {
      console.error('Error loading predictive analysis:', err);
      setError(err.message || 'Failed to load analysis');
      toast.error('Failed to load predictive analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, [deviceId]);

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return "destructive";
    if (risk >= 60) return "orange";
    if (risk >= 40) return "yellow";
    return "success";
  };

  const getRiskLevel = (risk: number) => {
    if (risk >= 80) return "CRITICAL";
    if (risk >= 60) return "HIGH";
    if (risk >= 40) return "MEDIUM";
    if (risk >= 20) return "LOW";
    return "MINIMAL";
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "HIGH": return "success";
      case "MEDIUM": return "yellow";
      case "LOW": return "destructive";
      default: return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-destructive">{error}</p>
        <Button onClick={loadAnalysis} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>No analysis data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Predictive Maintenance</h1>
            <p className="text-muted-foreground mt-2">
              AI-powered failure prediction for {deviceInfo?.name || deviceId}
            </p>
          </div>
          <Button onClick={loadAnalysis} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </motion.div>

      {/* Risk Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Failure Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Risk Meter */}
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">
                  {analysis.failure_risk_percentage}%
                </div>
                <Badge 
                  variant={getRiskColor(analysis.failure_risk_percentage) as any}
                  className="text-lg px-4 py-2"
                >
                  {getRiskLevel(analysis.failure_risk_percentage)} RISK
                </Badge>
                <p className="text-muted-foreground mt-2">
                  Predicted failure likelihood
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Risk Level</span>
                  <span>{analysis.failure_risk_percentage}%</span>
                </div>
                <Progress 
                  value={analysis.failure_risk_percentage} 
                  className="h-3"
                />
              </div>

              {/* Confidence Level */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="font-medium">Analysis Confidence</span>
                <Badge variant={getConfidenceColor(analysis.confidence_level) as any}>
                  {analysis.confidence_level}
                </Badge>
              </div>

              {/* Timeline */}
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="font-medium">Predicted Failure Window</span>
                </div>
                <p className="text-lg font-semibold text-accent">
                  {analysis.predicted_failure_window}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Maintenance Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              Maintenance Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.maintenance_recommendation.split('. ').map((rec: string, index: number) => (
                rec && (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-sm">{rec}{rec.endsWith('.') ? '' : '.'}</p>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Device Information */}
      {deviceInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Device Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Device ID</p>
                  <p className="font-medium">{deviceInfo.deviceId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Device Name</p>
                  <p className="font-medium">{deviceInfo.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{deviceInfo.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={deviceInfo.status === 'online' ? 'default' : 'secondary'}>
                    {deviceInfo.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center text-sm text-muted-foreground"
      >
        <p>
          This predictive analysis is based on AI algorithms and historical data patterns. 
          Actual device behavior may vary. Always combine automated predictions with 
          professional judgment and regular inspections.
        </p>
      </motion.div>
    </div>
  );
};

export default PredictiveMaintenance;