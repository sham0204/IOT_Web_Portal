import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Cpu, Layers, BookOpen, ArrowRight, TrendingUp, Wifi } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { icon: Layers, label: "Templates", value: "12", change: "+2 this week" },
  { icon: Cpu, label: "Active Devices", value: "8", change: "3 online now" },
  { icon: Activity, label: "Data Points", value: "24.5K", change: "+1.2K today" },
  { icon: BookOpen, label: "Projects", value: "5/10", change: "50% complete" },
];

const recentActivity = [
  { device: "ESP32-Temp-01", action: "Data received", time: "2 min ago", status: "success" },
  { device: "Arduino-Humid-02", action: "Connected", time: "15 min ago", status: "success" },
  { device: "RPi-Gateway-01", action: "API key regenerated", time: "1 hour ago", status: "warning" },
  { device: "ESP32-Motion-03", action: "Disconnected", time: "2 hours ago", status: "error" },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-heading font-bold">
            Welcome back, <span className="gradient-text">John</span>
          </h1>
          <p className="text-muted-foreground">
            We started building SmartDrishti to simplify IoT monitoring and project learning...
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-3xl font-heading font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-accent mt-2">{stat.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/monitor">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === "success" ? "bg-accent" :
                          activity.status === "warning" ? "bg-secondary" : "bg-destructive"
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{activity.device}</p>
                          <p className="text-xs text-muted-foreground">{activity.action}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions & Progress */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Project Progress */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Project Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completed Projects</span>
                    <span className="text-accent">5/10</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
                <p className="text-xs text-muted-foreground">
                  You're halfway there! Keep learning to unlock more features.
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="glow" className="w-full justify-start" asChild>
                  <Link to="/templates">
                    <Layers className="w-4 h-4 mr-2" />
                    Create Template
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/monitor">
                    <Activity className="w-4 h-4 mr-2" />
                    Live Monitor
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/projects">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Projects
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Connection Status */}
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Wifi className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">System Status</p>
                    <p className="text-sm text-accent">All systems operational</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
