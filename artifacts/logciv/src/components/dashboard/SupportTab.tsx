import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle, ChevronDown, ChevronUp, Phone, Mail, MessageSquare, CheckCircle } from "lucide-react";

const FAQ = [
  {
    q: "Comment publier un bien immobilier ?",
    a: "Rendez-vous dans 'Ajouter un bien' depuis le menu de gauche. Remplissez toutes les informations (titre, type, prix, localisation, caractéristiques, photos) puis cliquez sur 'Publier le bien'.",
  },
  {
    q: "Pourquoi mon compte est-il en attente de vérification ?",
    a: "Après inscription, notre équipe examine vos documents pour valider votre identité. Ce processus prend généralement 24 à 48 heures. Vous recevrez une notification par email une fois validé.",
  },
  {
    q: "Comment accepter ou refuser une réservation ?",
    a: "Dans l'onglet 'Mes réservations', vous trouverez toutes les demandes de visite. Cliquez sur 'Accepter' ou 'Refuser' pour chaque demande en attente.",
  },
  {
    q: "Comment modifier le statut d'un bien ?",
    a: "Dans 'Mes biens', chaque carte de bien possède un menu déroulant pour changer le statut (Disponible, Réservé, Indisponible) directement.",
  },
  {
    q: "Comment contacter un client intéressé ?",
    a: "Utilisez l'onglet 'Messages' pour consulter et répondre aux conversations. Vous pouvez envoyer des messages directement depuis l'interface de chat.",
  },
  {
    q: "Puis-je supprimer un bien publié ?",
    a: "Oui. Dans 'Mes biens', cliquez sur l'icône de suppression (corbeille) sur la carte du bien concerné. Cette action est irréversible.",
  },
  {
    q: "Comment ajouter un agent à mon agence ?",
    a: "Si vous avez un compte Agence, l'onglet 'Agents' vous permet d'ajouter et gérer vos agents depuis un formulaire simple.",
  },
];

export default function SupportTab() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ sujet: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.sujet || !contactForm.message) return;
    setSent(true);
    setContactForm({ sujet: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-foreground">Aide & Support</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Trouvez rapidement des réponses à vos questions</p>
      </div>

      {/* Contact cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: Phone, label: "Téléphone", value: "+225 07 00 00 00 00", cls: "bg-primary/10 text-primary" },
          { icon: Mail, label: "Email", value: "support@logciv.ci", cls: "bg-accent/10 text-accent" },
          { icon: MessageSquare, label: "Chat en direct", value: "Lun–Ven 8h–18h", cls: "bg-purple-100 text-purple-600" },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-card border border-border rounded-xl p-4 text-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${c.cls}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-foreground">{c.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.value}</p>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-primary" /> Questions fréquentes
        </h3>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden">
              <button type="button"
                className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-muted/30 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span className="text-sm font-medium text-foreground pr-4">{item.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-primary shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact form */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" /> Contacter le support
        </h3>
        {sent ? (
          <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 rounded-xl p-4">
            <CheckCircle className="w-5 h-5 text-accent" />
            <p className="text-sm font-medium text-accent">Message envoyé ! Nous vous répondrons sous 24h.</p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Sujet</Label>
              <Input value={contactForm.sujet} onChange={(e) => setContactForm((p) => ({ ...p, sujet: e.target.value }))}
                placeholder="Problème avec une réservation..." className="mt-1.5" required />
            </div>
            <div>
              <Label className="text-sm font-medium">Message</Label>
              <textarea value={contactForm.message}
                onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                placeholder="Décrivez votre problème en détail..."
                className="mt-1.5 w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                required />
            </div>
            <Button type="submit" className="bg-primary text-white gap-2" data-testid="button-send-support">
              <Mail className="w-4 h-4" /> Envoyer le message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
