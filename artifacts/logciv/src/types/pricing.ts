export type PlanType = 'free' | 'basic' | 'pro' | 'agence';
export type ColorType = 'gray' | 'blue' | 'orange' | 'green';

export interface SubscriptionPlan {
  id: PlanType;
  name: string;
  price: number; // en FCFA
  period: 'month' | 'year';
  maxProperties: number;
  features: string[];
  color: ColorType;
  badge?: string;
  priority?: boolean;
}

export interface UserSubscription {
  planId: PlanType;
  maxProperties: number;
  startDate: string;
  renewalDate?: string;
  isActive: boolean;
}

export const PRICING_PLANS: Record<PlanType, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    period: 'month',
    maxProperties: 3,
    features: [
      'Jusqu\'à 3 annonces',
      'Accès au tableau de bord',
      'Messagerie intégrée',
      'Gestion des réservations',
      'Support par email',
    ],
    color: 'gray',
  },
  basic: {
    id: 'basic',
    name: 'Plan Basic',
    price: 5000,
    period: 'month',
    maxProperties: 10,
    features: [
      'Jusqu\'à 10 annonces',
      'Accès complet au dashboard',
      'Messagerie prioritaire',
      'Statistiques basiques',
      'Support standard',
      'Photos illimitées par annonce',
    ],
    color: 'blue',
  },
  pro: {
    id: 'pro',
    name: 'Plan Pro',
    price: 10000,
    period: 'month',
    maxProperties: 30,
    features: [
      'Jusqu\'à 30 annonces',
      'Mise en avant des annonces',
      'Accès prioritaire aux messages',
      'Statistiques avancées',
      'Badge "Professionnel"',
      'Support prioritaire',
      'Outils analytiques',
    ],
    color: 'orange',
    priority: true,
  },
  agence: {
    id: 'agence',
    name: 'Plan Agence',
    price: 25000,
    period: 'month',
    maxProperties: 9999, // unlimited
    features: [
      'Annonces illimitées',
      'Gestion des agents',
      'Annonces en priorité absolue',
      'Badge "Agence Vérifiée"',
      'Statistiques complètes',
      'Support prioritaire 24/7',
      'API personnalisée',
      'Outils de gestion avancés',
    ],
    color: 'green',
    badge: 'Agence Vérifiée',
  },
};

export const PLAN_COLORS = {
  free: 'from-gray-50 to-gray-100',
  basic: 'from-blue-50 to-blue-100',
  pro: 'from-orange-50 to-orange-100',
  agence: 'from-green-50 to-green-100',
};

export const PLAN_BORDERS = {
  free: 'border-gray-200',
  basic: 'border-blue-200',
  pro: 'border-orange-300 shadow-lg shadow-orange-100',
  agence: 'border-green-300 shadow-lg shadow-green-100',
};
