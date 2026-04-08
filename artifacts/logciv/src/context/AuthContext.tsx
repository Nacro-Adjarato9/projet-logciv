import { createContext, useContext } from "react";
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
  const { currentUser, login, logout } = useStore();

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
