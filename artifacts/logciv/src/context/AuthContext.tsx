import { createContext, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/lib/store";
import type { User } from "@/lib/store";

interface AuthContextValue {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { currentUser, login: storeLogin, logout: storeLogout } = useStore();
  const queryClient = useQueryClient();

  // Les requetes (biens, reservations, notifications...) sont mises en cache par
  // React Query independamment de l'utilisateur connecte. Sans ce nettoyage, un
  // changement de compte affiche brievement les donnees du compte precedent tant
  // que le cache n'a pas expire (staleTime) ou ete invalide.
  const login = (user: User) => {
    queryClient.clear();
    storeLogin(user);
  };

  const logout = () => {
    queryClient.clear();
    storeLogout();
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
