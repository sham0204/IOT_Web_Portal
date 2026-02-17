import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";
import { ProjectProvider } from "./hooks/useProjectManagement";
import Index from "./pages/Index";
import ProjectSetupPage from "./pages/ProjectSetupPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import LiveMonitor from "./pages/LiveMonitor";
import DemoProjects from "./pages/DemoProjects";
import ProjectDetails from "./pages/ProjectDetails";
import ProjectSummary from "./pages/ProjectSummary";
import StepDetail from "./pages/StepDetail";
import TestNavigation from "./pages/TestNavigation";
import Profile from "./pages/Profile";
import PredictiveMaintenance from "./pages/PredictiveMaintenance";
import NotFound from "./pages/NotFound";
import SettingsLayout from "./pages/settings/SettingsLayout";
import GeneralSettings from "./pages/settings/GeneralSettings";
import UsersSettings from "./pages/settings/UsersSettings";
import RolesPermissions from "./pages/settings/RolesPermissions";
import BillingPlans from "./pages/settings/BillingPlans";
import TagsSettings from "./pages/settings/TagsSettings";
import WebhooksSettings from "./pages/settings/WebhooksSettings";
import UserActionsLog from "./pages/settings/UserActionsLog";
import AppearanceSettings from "./pages/settings/AppearanceSettings";
import SecuritySettings from "./pages/settings/SecuritySettings";
import ApiIntegrations from "./pages/settings/ApiIntegrations";
import LearningHub from "./pages/LearningHub";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <ProjectProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/monitor" element={<LiveMonitor />} />
              <Route path="/projects" element={<DemoProjects />} />
              <Route path="/projects/:projectId" element={<ProjectDetails />} />
              <Route path="/projects/:projectId/steps/:stepId" element={<StepDetail />} />
              <Route path="/projects/:projectId/summary" element={<ProjectSummary />} />
              <Route path="/test-nav" element={<TestNavigation />} />
              <Route path="/project-setup" element={<ProjectSetupPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/devices/:deviceId/predictive-maintenance" element={<PredictiveMaintenance />} />
              <Route path="/learning" element={<LearningHub />} />
              <Route path="/settings" element={<SettingsLayout /> }>
                <Route index element={<GeneralSettings />} />
                <Route path="general" element={<GeneralSettings />} />
                <Route path="users" element={<UsersSettings />} />
                <Route path="roles" element={<RolesPermissions />} />
                <Route path="billing" element={<BillingPlans />} />
                <Route path="tags" element={<TagsSettings />} />
                <Route path="webhooks" element={<WebhooksSettings />} />
                <Route path="logs" element={<UserActionsLog />} />
                <Route path="appearance" element={<AppearanceSettings />} />
                <Route path="security" element={<SecuritySettings />} />
                <Route path="api" element={<ApiIntegrations />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ProjectProvider>
  </ThemeProvider>
);

export default App;
