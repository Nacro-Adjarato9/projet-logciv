import { useState } from "react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, PlusCircle, Trash2, UserCheck, UserX, X } from "lucide-react";

export default function AgentsTab() {
  const { currentUser } = useAuth();
  const { agents, addAgent, removeAgent } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "" });

  const myAgents = agents.filter((a) => a.agenceId === currentUser?.id);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.email || !currentUser) return;
    addAgent({ agenceId: currentUser.id, ...form, statut: "actif" });
    setForm({ nom: "", prenom: "", email: "", telephone: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Mes agents</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{myAgents.length} agent{myAgents.length !== 1 ? "s" : ""} dans votre agence</p>
        </div>
        <Button className="bg-primary text-white gap-2" onClick={() => setShowForm(!showForm)} data-testid="button-add-agent">
          {showForm ? <><X className="w-4 h-4" /> Annuler</> : <><PlusCircle className="w-4 h-4" /> Ajouter un agent</>}
        </Button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-card border border-primary/20 rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-4">Nouvel agent</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Nom *</Label>
                <Input value={form.nom} onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))} placeholder="Bamba" className="mt-1.5" required />
              </div>
              <div>
                <Label className="text-sm font-medium">Prénom *</Label>
                <Input value={form.prenom} onChange={(e) => setForm((p) => ({ ...p, prenom: e.target.value }))} placeholder="Cheick" className="mt-1.5" required />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Email *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="cheick@monagence.ci" className="mt-1.5" required />
            </div>
            <div>
              <Label className="text-sm font-medium">Téléphone</Label>
              <Input value={form.telephone} onChange={(e) => setForm((p) => ({ ...p, telephone: e.target.value }))} placeholder="+225 07 12 34 56 78" className="mt-1.5" />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Annuler</Button>
              <Button type="submit" className="flex-1 bg-primary text-white">Ajouter l'agent</Button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{myAgents.filter((a) => a.statut === "actif").length}</p>
            <p className="text-xs text-muted-foreground">Agents actifs</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
            <UserX className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{myAgents.filter((a) => a.statut === "inactif").length}</p>
            <p className="text-xs text-muted-foreground">Agents inactifs</p>
          </div>
        </div>
      </div>

      {myAgents.length === 0 && !showForm ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">Aucun agent</h3>
          <p className="text-sm text-muted-foreground mb-4">Ajoutez des agents à votre agence pour qu'ils puissent gérer des biens.</p>
          <Button className="bg-primary text-white gap-2" onClick={() => setShowForm(true)}>
            <PlusCircle className="w-4 h-4" /> Ajouter un agent
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {myAgents.map((agent) => (
            <div key={agent.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4" data-testid={`agent-${agent.id}`}>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">{agent.prenom.charAt(0)}{agent.nom.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{agent.prenom} {agent.nom}</p>
                <p className="text-xs text-muted-foreground">{agent.email}</p>
                {agent.telephone && <p className="text-xs text-muted-foreground">{agent.telephone}</p>}
              </div>
              <span className={`text-xs border rounded-full px-2.5 py-1 font-medium ${agent.statut === "actif" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
                {agent.statut === "actif" ? "Actif" : "Inactif"}
              </span>
              <button className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/5"
                onClick={() => removeAgent(agent.id)} data-testid={`remove-agent-${agent.id}`}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
