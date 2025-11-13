import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { DebugAuth } from "@/components/DebugAuth";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import CattleProfile from "@/pages/CattleProfile";
import DiseaseDetection from "@/pages/DiseaseDetection";
import Vaccination from "@/pages/Vaccination";
import HealthMonitoring from "@/pages/HealthMonitoring";
import FeedingVaccination from "@/pages/FeedingVaccination";
import GroupManagement from "@/pages/GroupManagement";
import Inventory from "@/pages/Inventory";
import SalesRecords from "@/pages/SalesRecords";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function AuthenticatedApp() {
  const { isAuthenticated, loading, user } = useAuth();
  const [location, setLocation] = useLocation();

  console.log('AuthenticatedApp render:', { isAuthenticated, loading, user: user?.name, location });

  // Redirect to dashboard when user becomes authenticated and is on login page
  useEffect(() => {
    if (isAuthenticated && location === '/') {
      console.log('User authenticated, redirecting to dashboard');
      setLocation('/dashboard');
    }
  }, [isAuthenticated, location, setLocation]);

  // Show loading spinner while checking authentication
  if (loading) {
    console.log('AuthenticatedApp: Showing loading state');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    console.log('AuthenticatedApp: Showing login page');
    return <Login />;
  }

  console.log('AuthenticatedApp: Showing main application');
  // Show main application if authenticated
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-2 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-hidden">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Dashboard />} />
      <Route path="/dashboard" component={() => <Dashboard />} />
      <Route path="/cattle" component={() => <CattleProfile />} />
      <Route path="/disease-detection" component={() => <DiseaseDetection />} />
      <Route path="/vaccination" component={() => <Vaccination />} />
      <Route path="/health-monitoring" component={() => <HealthMonitoring />} />
      <Route path="/feeding" component={() => <FeedingVaccination />} />
      <Route path="/groups" component={() => <GroupManagement />} />
      <Route path="/inventory" component={() => <Inventory />} />
      <Route path="/sales" component={() => <SalesRecords />} />
      <Route path="/reports" component={() => <Reports />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <AuthenticatedApp />
            <DebugAuth />
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
