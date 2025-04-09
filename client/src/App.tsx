import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Patients from "@/pages/Patients";
import Appointments from "@/pages/Appointments";
import Analytics from "@/pages/Analytics";
import Staff from "@/pages/Staff";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import AppLayout from "@/components/layouts/AppLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/patients" component={Patients} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/staff" component={Staff} />
      <Route path="/messages" component={Messages} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayout>
        <Router />
      </AppLayout>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
