import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SubscriptionPlan, PlanType, ColorType } from "@/types/pricing";

interface PricingCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan?: boolean;
  onSelect: (planId: PlanType) => void;
}

export default function PricingCard({ plan, isCurrentPlan, onSelect }: PricingCardProps) {
  const colorClasses: Record<ColorType, string> = {
    gray: "from-gray-50 to-gray-100 border-gray-200",
    blue: "from-blue-50 to-blue-100 border-blue-200",
    orange: "from-orange-50 to-orange-100 border-orange-300 shadow-lg shadow-orange-100",
    green: "from-green-50 to-green-100 border-green-300 shadow-lg shadow-green-100",
  };

  const buttonClasses: Record<ColorType, string> = {
    gray: "bg-gray-500 hover:bg-gray-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    orange: "bg-orange-500 hover:bg-orange-600",
    green: "bg-green-500 hover:bg-green-600",
  };

  const badgeClasses: Record<ColorType, string> = {
    gray: "bg-gray-100 text-gray-800",
    blue: "bg-blue-100 text-blue-800",
    orange: "bg-orange-100 text-orange-800",
    green: "bg-green-100 text-green-800",
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl border-2 bg-gradient-to-br p-8 transition-transform duration-300 ${colorClasses[plan.color]} ${!isCurrentPlan ? "hover:shadow-lg hover:-translate-y-1" : ""}`}
    >
      {plan.color !== "gray" && (
        <div className={`absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses[plan.color]}`}>
          {plan.badge || `À partir de ${plan.price.toLocaleString("fr-CI")} FCFA`}
        </div>
      )}

      <div className="mb-8 pt-4">
        <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-4xl font-bold text-gray-900">{plan.price.toLocaleString("fr-CI")}</span>
          <span className="text-sm text-gray-600">FCFA / {plan.period === "month" ? "mois" : "an"}</span>
        </div>
      </div>

      <div className="mb-8 flex-1">
        <p className="mb-4 text-sm font-semibold text-gray-700">Inclus :</p>
        <ul className="space-y-3">
          {plan.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <Check className={`mt-0.5 h-5 w-5 flex-shrink-0 ${plan.color === "gray" ? "text-gray-400" : plan.color === "blue" ? "text-blue-500" : plan.color === "orange" ? "text-orange-500" : "text-green-500"}`} />
              <span className="text-sm text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        onClick={() => onSelect(plan.id)}
        disabled={isCurrentPlan}
        className={`w-full py-2 font-semibold text-white ${buttonClasses[plan.color]} ${isCurrentPlan ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isCurrentPlan ? "Plan actuel" : "Choisir ce plan"}
      </Button>
    </div>
  );
}
