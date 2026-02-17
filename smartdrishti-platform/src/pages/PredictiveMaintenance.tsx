import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { iotAPI } from "@/api";
import { DashboardLayout } from "@/components/DashboardLayout";

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

      const deviceResponse = await iotAPI.getDeviceById(deviceId);
      setDeviceInfo(deviceResponse.device);

      const analysisResponse = await iotAPI.predictDeviceFailure(deviceId);
      setAnalysis(analysisResponse);

    } catch (err: any) {
      console.error("Error loading predictive analysis:", err);
      setError(err.message || "Failed to load analysis");
      toast.error("Failed to load predictive analysis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysis();
  }, [deviceId]);

  const getRiskLevel = (risk: number) => {
    if (risk >= 80) return "CRITICAL";
    if (risk >= 60) return "HIGH";
    if (risk >= 40) return "MEDIUM";
    if (risk >= 20) return "LOW";
    return "MINIMAL";
  };

  const getBadgeVariant = (risk: number): any => {
    if (risk >= 80) return "destructive";
    if (risk >= 60) return "secondary";
    if (risk >= 40) return "outline";
    return "default";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <p className="text-destructive">{error}</p>
          <Button onClick={loadAnalysis}>Retry</Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!analysis) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p>No analysis data available</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">

        <div>
          <h1 className="text-3xl font-bold">Predictive Maintenance</h1>
          <p className="text-muted-foreground mt-2">
            AI-powered failure prediction for {deviceInfo?.name || deviceId}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Failure Risk Assessment
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                {analysis.failure_risk_percentage}%
              </div>

              <Badge variant={getBadgeVariant(analysis.failure_risk_percentage)}>
                {getRiskLevel(analysis.failure_risk_percentage)} RISK
              </Badge>

              <p className="text-muted-foreground mt-2">
                Predicted failure likelihood
              </p>
            </div>

            <Progress value={analysis.failure_risk_percentage} className="h-3" />

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Predicted Failure Window</span>
              </div>
              <p className="text-lg font-semibold">
                {analysis.predicted_failure_window}
              </p>
            </div>

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Maintenance Recommendations
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {analysis.maintenance_recommendation
              .split(". ")
              .map((rec: string, index: number) =>
                rec ? (
                  <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                    {rec.endsWith(".") ? rec : rec + "."}
                  </div>
                ) : null
              )}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
};

export default PredictiveMaintenance;
