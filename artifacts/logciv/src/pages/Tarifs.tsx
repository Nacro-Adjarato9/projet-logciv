import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/lib/store";
import PricingCard from "@/components/PricingCard";
import { PRICING_PLANS } from "@/types/pricing";
import type { PlanType } from "@/types/pricing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Zap, Users, Shield } from "lucide-react";

export default function Tarifs() {
  const [, setLocation] = useLocation();
  const { currentUser } = useAuth();
  const { getUserSubscription } = useStore();

  const currentPlan = currentUser ? getUserSubscription(currentUser.id) : null;

  const handleSelectPlan = (planId: PlanType) => {
    if (planId === currentPlan?.planId) return;
    if (planId === "free" && currentUser) {
      useStore.getState().upgradePlan(currentUser.id, "free");
      return;
    }
    setLocation(`/paiement?plan=${planId}`);
  };

  const plans = [PRICING_PLANS.free, PRICING_PLANS.basic, PRICING_PLANS.pro, PRICING_PLANS.agence];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Tarification Simple et Transparente</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Commencez gratuitement et passez à Premium quand vous le souhaitez. Aucune carte bancaire requise pour démarrer.</p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={plan.id === currentPlan?.planId}
                onSelect={handleSelectPlan}
              />
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Comparaison détaillée</h2>
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fonctionnalité</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Gratuit</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-blue-600">Basic</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-orange-600">Pro</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-green-600">Agence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Nombre d'annonces</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">3</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">10</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">30</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Illimité</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Mise en avant</td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-red-500 mx-auto opacity-30" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-blue-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-orange-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Statistiques</td>
                    <td className="px-6 py-4 text-center text-xs text-gray-500">Basique</td>
                    <td className="px-6 py-4 text-center text-xs text-gray-500">Basique</td>
                    <td className="px-6 py-4 text-center text-xs text-gray-500">Avancées</td>
                    <td className="px-6 py-4 text-center text-xs text-gray-500">Complètes</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Support</td>
                    <td className="px-6 py-4 text-center text-xs text-gray-500">Email</td>
                    <td className="px-6 py-4 text-center text-xs text-gray-500">Standard</td>
                    <td className="px-6 py-4 text-center text-xs text-gray-500">Prioritaire</td>
                    <td className="px-6 py-4 text-center text-xs text-gray-500">24/7 Prioritaire</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Gestion d'agents</td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-red-500 mx-auto opacity-30" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-red-500 mx-auto opacity-30" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-red-500 mx-auto opacity-30" /></td>
                    <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <Zap className="h-12 w-12 text-orange-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible</h3>
              <p className="text-gray-600">Changez de plan à tout moment. Aucun engagement à long terme.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <Users className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pour tous</h3>
              <p className="text-gray-600">Particulariser, agents ou agences - il y a un plan pour vous.</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <Shield className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sécurisé</h3>
              <p className="text-gray-600">Vos données sont protégées. Pas de frais cachés.</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20 bg-blue-50 rounded-lg border border-blue-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Foire aux questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Puis-je changer de plan ?</h3>
                <p className="text-gray-600 text-sm">Oui, vous pouvez changer de plan à tout moment depuis votre tableau de bord. Les modifications prennent effet immédiatement.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Existe-t-il une période d'essai ?</h3>
                <p className="text-gray-600 text-sm">Oui ! Le plan gratuit n'a aucune limite de durée. Testez gratuitement avant de passer à Premium.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Comment fonctionnent les paiements ?</h3>
                <p className="text-gray-600 text-sm">Les paiements sont récurrents mensuellement. Vous recevrez une facture et pouvez annuler à tout moment.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Accès aux fonctionnalités après annulation ?</h3>
                <p className="text-gray-600 text-sm">Révolez au plan gratuit après annulation. Vos données restent intactes.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
