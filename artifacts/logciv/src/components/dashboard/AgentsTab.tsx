import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Users, UserCheck, UserX } from "lucide-react";

function unwrapList(data: any) {
  if (Array.isArray(data)) return data;
  return data?.results ?? [];
}

export default function AgentsTab() {
  const { currentUser } = useAuth();

  const agentsQuery = useQuery({
    queryKey: ["dashboard", "agents"],
    queryFn: () => api.users.agents(),
    enabled: !!currentUser,
    staleTime: 30_000,
  });

  const myAgents = unwrapList(agentsQuery.data);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Mes agents</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{myAgents.length} agent{myAgents.length !== 1 ? "s" : ""} dans votre agence</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{myAgents.filter((a: any) => a.statut === "actif").length}</p>
            <p className="text-xs text-muted-foreground">Agents actifs</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
            <UserX className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{myAgents.filter((a: any) => a.statut === "inactif").length}</p>
            <p className="text-xs text-muted-foreground">Agents inactifs</p>
          </div>
        </div>
      </div>

      {myAgents.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">Aucun agent</h3>
          <p className="text-sm text-muted-foreground">
            Les agents apparaîtront ici dès que l&apos;API les renverra.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {myAgents.map((agent: any) => (
            <div key={agent.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4" data-testid={`agent-${agent.id}`}>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">{(agent.prenom ?? "").charAt(0)}{(agent.nom ?? "").charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{agent.prenom} {agent.nom}</p>
                <p className="text-xs text-muted-foreground">{agent.email}</p>
                {agent.telephone && <p className="text-xs text-muted-foreground">{agent.telephone}</p>}
              </div>
              <span className={`text-xs border rounded-full px-2.5 py-1 font-medium ${agent.statut === "actif" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                {agent.statut === "actif" ? "Actif" : "Inactif"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
