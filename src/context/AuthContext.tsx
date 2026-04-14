"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

export interface UserOrder {
  id: string;
  items: { name: string; size: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  date: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  orders: UserOrder[];
}

interface AuthContextType {
  user: User | null;
  isAccountOpen: boolean;
  openAccount: () => void;
  closeAccount: () => void;
  register: (name: string, email: string, phone: string, password: string) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addOrder: (order: UserOrder) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface StoredUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  orders: UserOrder[];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Load session on mount
  useEffect(() => {
    const session = localStorage.getItem("komarovi_session");
    if (session) {
      const email = JSON.parse(session);
      const users: StoredUser[] = JSON.parse(localStorage.getItem("komarovi_users") || "[]");
      const found = users.find((u) => u.email === email);
      if (found) {
        setUser({ name: found.name, email: found.email, phone: found.phone, orders: found.orders });
      }
    }
  }, []);

  const openAccount = useCallback(() => setIsAccountOpen(true), []);
  const closeAccount = useCallback(() => setIsAccountOpen(false), []);

  const register = useCallback((name: string, email: string, phone: string, password: string): boolean => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem("komarovi_users") || "[]");
    if (users.find((u) => u.email === email)) return false;
    const newUser: StoredUser = { name, email, phone, password, orders: [] };
    users.push(newUser);
    localStorage.setItem("komarovi_users", JSON.stringify(users));
    localStorage.setItem("komarovi_session", JSON.stringify(email));
    setUser({ name, email, phone, orders: [] });
    return true;
  }, []);

  const login = useCallback((email: string, password: string): boolean => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem("komarovi_users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return false;
    localStorage.setItem("komarovi_session", JSON.stringify(email));
    setUser({ name: found.name, email: found.email, phone: found.phone, orders: found.orders });
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("komarovi_session");
    setUser(null);
  }, []);

  const addOrder = useCallback((order: UserOrder) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, orders: [order, ...prev.orders] };
      // Persist
      const users: StoredUser[] = JSON.parse(localStorage.getItem("komarovi_users") || "[]");
      const idx = users.findIndex((u) => u.email === prev.email);
      if (idx !== -1) {
        users[idx].orders = updated.orders;
        localStorage.setItem("komarovi_users", JSON.stringify(users));
      }
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAccountOpen, openAccount, closeAccount, register, login, logout, addOrder }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
