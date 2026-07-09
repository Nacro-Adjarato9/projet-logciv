import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { useStore } from "@/lib/store";
import Home from "@/pages/Home";
import Apropos from "@/pages/Apropos";
import Inscription from "@/pages/Inscription";
import Connexion from "@/pages/Connexion";
import VerifyEmail from "@/pages/VerifyEmail";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Tarifs from "@/pages/Tarifs";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/apropos" component={Apropos} />
      <Route path="/tarifs" component={Tarifs} />
      <Route path="/inscription" component={Inscription} />
      <Route path="/connexion" component={Connexion} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/dashboard/proprietaire">
        {() => <Dashboard role="proprietaire" />}
      </Route>
      <Route path="/dashboard/locataire">
        {() => <Dashboard role="locataire" />}
      </Route>
      <Route path="/dashboard/agent">
        {() => <Dashboard role="agent" />}
      </Route>
      <Route path="/dashboard/agence">
        {() => <Dashboard role="agence" />}
      </Route>
      <Route path="/dashboard">
        {() => <Redirect to="/connexion" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const seedMockData = useStore((s) => s.seedMockData);

  useEffect(() => {
    seedMockData();
  }, [seedMockData]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
