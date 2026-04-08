import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import Home from "@/pages/Home";
import Apropos from "@/pages/Apropos";
import Inscription from "@/pages/Inscription";
import Connexion from "@/pages/Connexion";
import Dashboard from "@/pages/Dashboard";
import Tarifs from "@/pages/Tarifs";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/apropos" component={Apropos} />
      <Route path="/tarifs" component={Tarifs} />
      <Route path="/inscription" component={Inscription} />
      <Route path="/connexion" component={Connexion} />
      <Route path="/dashboard/proprietaire">
        {() => <Dashboard role="proprietaire" />}
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
