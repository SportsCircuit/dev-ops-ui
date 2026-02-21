import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type { UserRole } from "@/types";

/* ─── Public types ─────────────────────────────────────── */

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextValue {
  /** The currently signed-in user (null when signed out). */
  currentUser: AuthUser | null;
  /** Convenience flag — true when currentUser.role === "Admin". */
  isAdmin: boolean;
  /** The JWT token (null when signed out). */
  token: string | null;
  /** Sign in – stores the JWT and user info. */
  signIn: (token: string, user: AuthUser) => void;
  /** Sign out – clears all auth state. */
  signOut: () => void;
}

/* ─── localStorage helpers ─────────────────────────────── */

const TOKEN_KEY = "devportal_token";
const USER_KEY = "devportal_auth";

function loadAuth(): { token: string; user: AuthUser } | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    if (!token || !raw) return null;
    const user = JSON.parse(raw);
    if (
      user &&
      typeof user.id === "string" &&
      typeof user.name === "string" &&
      typeof user.role === "string" &&
      typeof user.email === "string"
    ) {
      return { token, user: user as AuthUser };
    }
  } catch {
    // ignore corrupt data
  }
  return null;
}

/* ─── Context ──────────────────────────────────────────── */

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<{ token: string; user: AuthUser } | null>(
    loadAuth,
  );

  const signIn = useCallback((token: string, user: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setAuth({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setAuth(null);
  }, []);

  // Listen for 401 events dispatched by api.ts when a token expires
  useEffect(() => {
    const handler = () => setAuth(null);
    window.addEventListener("auth:expired", handler);
    return () => window.removeEventListener("auth:expired", handler);
  }, []);

  const currentUser = auth?.user ?? null;
  const token = auth?.token ?? null;
  const isAdmin = currentUser?.role === "Admin";

  const value = useMemo<AuthContextValue>(
    () => ({ currentUser, isAdmin, token, signOut, signIn }),
    [currentUser, isAdmin, token, signOut, signIn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
