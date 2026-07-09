import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlanType, UserSubscription } from '@/types/pricing';
import { PRICING_PLANS } from '@/types/pricing';

export type UserRole = 'proprietaire' | 'agent' | 'agence';
export type VerificationStatus = 'non_verifie' | 'en_attente' | 'verifie' | 'refuse';

export interface UploadedDoc {
  name: string;
  type: string;
  dataUrl: string;
}

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  subscription?: UserSubscription;
  // Proprietaire
  type?: 'particulier' | 'entreprise';
  adresse?: string;
  ville?: string;
  // Agent / Agence
  nomAgence?: string;
  rccm?: string;
  ncc?: string;
  description?: string;
  logo?: string;
  siteWeb?: string;
  // Documents
  documents?: Record<string, UploadedDoc>;
  // Timestamps
  createdAt?: string;
}

export interface Property {
  id: string;
  ownerId: string;
  titre: string;
  type: 'Appartement' | 'Duplex' | 'Villa' | 'Bureau' | 'Terrain' | 'Studio' | 'Maison';
  categorie: 'Location' | 'Vente';
  prix: number;
  negociable: boolean;
  pays: string;
  ville: string;
  commune: string;
  quartier: string;
  adressePrecise: string;
  // Caracteristiques
  pieces?: number;
  chambres?: number;
  sallesDeBain?: number;
  superficie?: number;
  etage?: number;
  parking: boolean;
  meuble: boolean;
  // Equipements
  equipements: string[];
  description: string;
  images: string[];
  statut: 'disponible' | 'reserve' | 'indisponible';
  createdAt: string;
}

export interface Reservation {
  id: string;
  propertyId: string;
  ownerId: string;
  clientId: string;
  clientName: string;
  clientPhone?: string;
  date: string;
  time: string;
  message?: string;
  status: 'en_attente' | 'acceptee' | 'refusee';
  createdAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read?: boolean;
}

export interface MessageThread {
  id: string;
  participants: string[];
  participantNames?: Record<string, string>;
  propertyId?: string;
  lastMessageAt: string;
  lastMessage?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'reservation' | 'message' | 'bien' | 'info';
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface AgentEntry {
  id: string;
  agenceId: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  statut: 'actif' | 'inactif';
  createdAt: string;
}

interface AppState {
  users: User[];
  properties: Property[];
  reservations: Reservation[];
  messages: Message[];
  threads: MessageThread[];
  notifications: Notification[];
  agents: AgentEntry[];
  favorites: Record<string, string[]>; // userId -> propertyId[]
  currentUser: User | null;

  login: (user: User) => void;
  logout: () => void;
  register: (user: Omit<User, 'id'>) => User;
  updateUser: (id: string, data: Partial<User>) => void;

  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  updateProperty: (id: string, data: Partial<Property>) => void;
  deleteProperty: (id: string) => void;

  updateReservationStatus: (id: string, status: Reservation['status']) => void;

  sendMessage: (threadId: string, senderId: string, content: string) => void;

  addNotification: (notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;

  toggleFavorite: (userId: string, propertyId: string) => void;

  addAgent: (agent: Omit<AgentEntry, 'id' | 'createdAt'>) => void;
  removeAgent: (id: string) => void;

  upgradePlan: (userId: string, planId: PlanType) => void;
  getUserSubscription: (userId: string) => UserSubscription;
  getUserPropertiesCount: (userId: string) => number;
  canAddProperty: (userId: string) => boolean;

  seedMockData: () => void;
}

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: [],
      properties: [],
      reservations: [],
      messages: [],
      threads: [],
      notifications: [],
      agents: [],
      favorites: {},
      currentUser: null,

      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),

      register: (userData) => {
        const newUser: User = { ...userData, id: generateId(), createdAt: new Date().toISOString() };
        set((state) => ({ users: [...state.users, newUser] }));
        return newUser;
      },

      updateUser: (id, data) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
          currentUser: state.currentUser?.id === id ? { ...state.currentUser, ...data } : state.currentUser,
        }));
      },

      addProperty: (propertyData) => {
        const newProperty: Property = {
          ...propertyData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ properties: [...state.properties, newProperty] }));
      },

      updateProperty: (id, data) => {
        set((state) => ({
          properties: state.properties.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }));
      },

      deleteProperty: (id) => {
        set((state) => ({ properties: state.properties.filter((p) => p.id !== id) }));
      },

      updateReservationStatus: (id, status) => {
        set((state) => ({
          reservations: state.reservations.map((res) => (res.id === id ? { ...res, status } : res)),
        }));
      },

      sendMessage: (threadId, senderId, content) => {
        const newMessage: Message = {
          id: generateId(),
          threadId,
          senderId,
          content,
          timestamp: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
          threads: state.threads.map((t) =>
            t.id === threadId ? { ...t, lastMessageAt: newMessage.timestamp, lastMessage: content } : t
          ),
        }));
      },

      addNotification: (notif) => {
        const newNotif: Notification = {
          ...notif,
          id: generateId(),
          read: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ notifications: [newNotif, ...state.notifications] }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }));
      },

      markAllNotificationsRead: (userId) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)),
        }));
      },

      toggleFavorite: (userId, propertyId) => {
        set((state) => {
          const userFavs = state.favorites[userId] ?? [];
          const newFavs = userFavs.includes(propertyId)
            ? userFavs.filter((id) => id !== propertyId)
            : [...userFavs, propertyId];
          return { favorites: { ...state.favorites, [userId]: newFavs } };
        });
      },

      addAgent: (agentData) => {
        const newAgent: AgentEntry = { ...agentData, id: generateId(), createdAt: new Date().toISOString() };
        set((state) => ({ agents: [...state.agents, newAgent] }));
      },

      removeAgent: (id) => {
        set((state) => ({ agents: state.agents.filter((a) => a.id !== id) }));
      },

      upgradePlan: (userId, planId) => {
        set((state) => ({
          users: state.users.map((u) => {
            if (u.id === userId) {
              const plan = PRICING_PLANS[planId];
              return {
                ...u,
                subscription: {
                  planId,
                  maxProperties: plan.maxProperties,
                  startDate: new Date().toISOString(),
                  renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                  isActive: true,
                },
              };
            }
            return u;
          }),
          currentUser: state.currentUser?.id === userId
            ? {
                ...state.currentUser,
                subscription: {
                  planId,
                  maxProperties: PRICING_PLANS[planId].maxProperties,
                  startDate: new Date().toISOString(),
                  renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                  isActive: true,
                },
              }
            : state.currentUser,
        }));
      },

      getUserSubscription: (userId) => {
        const user = get().users.find((u) => u.id === userId);
        if (user?.subscription) {
          return user.subscription;
        }
        // Default free plan
        return {
          planId: 'free',
          maxProperties: 3,
          startDate: new Date().toISOString(),
          isActive: true,
        };
      },

      getUserPropertiesCount: (userId) => {
        return get().properties.filter((p) => p.ownerId === userId).length;
      },

      canAddProperty: (userId) => {
        const sub = get().getUserSubscription(userId);
        const count = get().getUserPropertiesCount(userId);
        return count < sub.maxProperties;
      },

      seedMockData: () => {
        const state = get();
        if (state.properties.length > 0) return;

        const mockOwner: User = {
          id: 'owner1',
          nom: 'Kouassi',
          prenom: 'Jean',
          email: 'jean@test.com',
          telephone: '+225 0700000000',
          role: 'proprietaire',
          verificationStatus: 'verifie',
          type: 'particulier',
          adresse: 'Cocody Riviera 3',
          ville: 'Abidjan',
          createdAt: new Date().toISOString(),
        };

        const mockAgent: User = {
          id: 'agent1',
          nom: 'Traoré',
          prenom: 'Moussa',
          email: 'moussa@test.com',
          telephone: '+225 0500000000',
          role: 'agent',
          verificationStatus: 'verifie',
          nomAgence: 'Abidjan Immo Plus',
          rccm: 'CI-ABJ-2024-B-12345',
          ncc: 'NCC-2024-001234',
          adresse: 'Marcory Zone 4',
          ville: 'Abidjan',
          description: 'Agence spécialisée dans la vente et location de biens à Abidjan',
          createdAt: new Date().toISOString(),
        };

        const mockAgence: User = {
          id: 'agence1',
          nom: 'Diallo',
          prenom: 'Aminata',
          email: 'agence@test.com',
          telephone: '+225 0600000000',
          role: 'agence',
          verificationStatus: 'verifie',
          nomAgence: 'Côte Immobilier',
          rccm: 'CI-ABJ-2024-A-99999',
          ncc: 'NCC-2024-009999',
          adresse: 'Plateau Immeuble Alpha',
          ville: 'Abidjan',
          description: 'Agence premium spécialisée dans le haut-standing à Abidjan',
          createdAt: new Date().toISOString(),
        };

        const mockProperties: Property[] = [
          {
            id: 'prop1',
            ownerId: 'owner1',
            titre: 'Appartement 3 pièces Haut Standing',
            type: 'Appartement',
            categorie: 'Location',
            prix: 350000,
            negociable: true,
            pays: 'Côte d\'Ivoire',
            ville: 'Abidjan',
            commune: 'Cocody',
            quartier: 'Angré',
            adressePrecise: 'Résidence Les Palmiers, Bâtiment A',
            pieces: 3,
            chambres: 2,
            sallesDeBain: 2,
            superficie: 85,
            etage: 3,
            parking: true,
            meuble: false,
            equipements: ['Climatisation', 'Gardiennage', 'Sécurité 24h/24'],
            description: 'Superbe appartement 3 pièces au 3ème étage avec ascenseur. Sécurité 24/7, parking souterrain. Vue dégagée.',
            images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'],
            statut: 'disponible',
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          },
          {
            id: 'prop2',
            ownerId: 'owner1',
            titre: 'Villa Duplex 5 pièces avec Piscine',
            type: 'Villa',
            categorie: 'Vente',
            prix: 85000000,
            negociable: true,
            pays: 'Côte d\'Ivoire',
            ville: 'Abidjan',
            commune: 'Bingerville',
            quartier: 'Résidence Palmier',
            adressePrecise: 'Lot 45, Résidence Palmier',
            pieces: 5,
            chambres: 4,
            sallesDeBain: 3,
            superficie: 320,
            parking: true,
            meuble: true,
            etage: 0,
            equipements: ['Climatisation', 'Piscine', 'Gardiennage', 'Wifi', 'Cuisine équipée'],
            description: 'Magnifique villa avec jardin et piscine. 4 chambres autonomes, salon spacieux, cuisine équipée.',
            images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600'],
            statut: 'disponible',
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
          {
            id: 'prop3',
            ownerId: 'agent1',
            titre: 'Bureau open space 100m² vue Lagune',
            type: 'Bureau',
            categorie: 'Location',
            prix: 500000,
            negociable: false,
            pays: 'Côte d\'Ivoire',
            ville: 'Abidjan',
            commune: 'Plateau',
            quartier: 'Zone 4C',
            adressePrecise: 'Immeuble Alpha, 5ème étage',
            pieces: 4,
            chambres: 0,
            sallesDeBain: 2,
            superficie: 100,
            etage: 5,
            parking: true,
            meuble: true,
            equipements: ['Climatisation', 'Wifi', 'Groupe électrogène'],
            description: 'Bureau moderne idéal pour startup ou PME. Vue sur la lagune, entièrement climatisé.',
            images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=600'],
            statut: 'reserve',
            createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          },
          {
            id: 'prop4',
            ownerId: 'agence1',
            titre: 'Studio meublé Marcory Zone 4',
            type: 'Studio',
            categorie: 'Location',
            prix: 120000,
            negociable: false,
            pays: 'Côte d\'Ivoire',
            ville: 'Abidjan',
            commune: 'Marcory',
            quartier: 'Zone 4',
            adressePrecise: 'Résidence Lagune Bleue',
            pieces: 1,
            chambres: 1,
            sallesDeBain: 1,
            superficie: 35,
            etage: 2,
            parking: false,
            meuble: true,
            equipements: ['Climatisation', 'Wifi', 'Cuisine équipée'],
            description: 'Studio entièrement meublé dans une résidence sécurisée.',
            images: ['https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600'],
            statut: 'disponible',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
        ];

        const mockReservations: Reservation[] = [
          {
            id: 'res1',
            propertyId: 'prop1',
            ownerId: 'owner1',
            clientId: 'client1',
            clientName: 'Diallo Awa',
            clientPhone: '+225 0701000001',
            date: '2026-04-12',
            time: '14:00',
            message: 'Bonjour, je souhaite visiter cet appartement. Suis-je disponible samedi ?',
            status: 'en_attente',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'res2',
            propertyId: 'prop2',
            ownerId: 'owner1',
            clientId: 'client2',
            clientName: 'Konan Marc',
            clientPhone: '+225 0702000002',
            date: '2026-04-15',
            time: '10:00',
            message: 'Intéressé par la villa. Peut-on voir le dimanche matin ?',
            status: 'acceptee',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 'res3',
            propertyId: 'prop3',
            ownerId: 'agent1',
            clientId: 'client3',
            clientName: 'Touré Ibrahim',
            clientPhone: '+225 0703000003',
            date: '2026-04-18',
            time: '16:30',
            message: 'Je cherche un bureau pour une petite équipe de 5 personnes.',
            status: 'refusee',
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
          {
            id: 'res4',
            propertyId: 'prop1',
            ownerId: 'owner1',
            clientId: 'client4',
            clientName: 'Yao Bénédicte',
            clientPhone: '+225 0704000004',
            date: '2026-04-20',
            time: '11:00',
            message: 'Pouvez-vous me donner plus d\'informations sur les charges ?',
            status: 'en_attente',
            createdAt: new Date(Date.now() - 1800000).toISOString(),
          },
        ];

        const mockThreads: MessageThread[] = [
          {
            id: 'thread1',
            participants: ['owner1', 'client1'],
            participantNames: { client1: 'Diallo Awa' },
            propertyId: 'prop1',
            lastMessageAt: new Date(Date.now() - 1800000).toISOString(),
            lastMessage: 'Oui, vous pouvez réserver une visite.',
          },
          {
            id: 'thread2',
            participants: ['owner1', 'client2'],
            participantNames: { client2: 'Konan Marc' },
            propertyId: 'prop2',
            lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
            lastMessage: 'La villa est disponible pour la visite.',
          },
        ];

        const mockMessages: Message[] = [
          {
            id: 'msg1',
            threadId: 'thread1',
            senderId: 'client1',
            content: 'Bonjour, le bien est-il toujours disponible ?',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: true,
          },
          {
            id: 'msg2',
            threadId: 'thread1',
            senderId: 'owner1',
            content: 'Oui, vous pouvez réserver une visite.',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            read: true,
          },
          {
            id: 'msg3',
            threadId: 'thread2',
            senderId: 'client2',
            content: 'Bonjour, je suis intéressé par la villa. Le prix est-il négociable ?',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            read: false,
          },
        ];

        const mockNotifications: Notification[] = [
          {
            id: 'notif1',
            userId: 'owner1',
            type: 'reservation',
            title: 'Nouvelle réservation',
            content: 'Diallo Awa souhaite visiter votre appartement à Cocody.',
            read: false,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 'notif2',
            userId: 'owner1',
            type: 'message',
            title: 'Nouveau message',
            content: 'Konan Marc vous a envoyé un message concernant la villa.',
            read: false,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 'notif3',
            userId: 'owner1',
            type: 'info',
            title: 'Compte vérifié',
            content: 'Félicitations ! Votre compte a été vérifié avec succès.',
            read: true,
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
        ];

        const mockAgents: AgentEntry[] = [
          {
            id: 'agentEntry1',
            agenceId: 'agence1',
            nom: 'Bamba',
            prenom: 'Cheick',
            email: 'cheick@cotimmo.ci',
            telephone: '+225 0712345678',
            statut: 'actif',
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
          },
          {
            id: 'agentEntry2',
            agenceId: 'agence1',
            nom: 'Ouattara',
            prenom: 'Fatima',
            email: 'fatima@cotimmo.ci',
            telephone: '+225 0723456789',
            statut: 'actif',
            createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
          },
        ];

        set({
          users: [mockOwner, mockAgent, mockAgence],
          properties: mockProperties,
          reservations: mockReservations,
          threads: mockThreads,
          messages: mockMessages,
          notifications: mockNotifications,
          agents: mockAgents,
          favorites: { owner1: ['prop3', 'prop4'] },
        });
      },
    }),
    { name: 'logciv-storage' }
  )
);
