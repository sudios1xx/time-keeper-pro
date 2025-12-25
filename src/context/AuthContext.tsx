import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "player";

interface Session {
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  session: Session | null;
  login: (data: { email: string; role: UserRole }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  const login = (data: { email: string; role: UserRole }) => {
    setSession({ email: data.email, role: data.role });
  };

  const logout = () => setSession(null);

  return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
