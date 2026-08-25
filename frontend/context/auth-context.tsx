"use client";

import { useRouter } from "next/navigation";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getProfile } from "@/app/lib/api";
type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

// ✅ Create the context - this is a value, not a namespace
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("access_token");

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getProfile(storedToken);

        if (!response.ok) {
          // Token is invalid/expired
          localStorage.removeItem("access_token");
          setToken(null);
          setUser(null);
          return;
        }

        const userData = await response.json();

        console.log("the user Data are ... ", userData.data);
        setToken(storedToken);
        setUser(userData.data);
      } catch (error) {
        console.error("Authentication check failed:", error);
        localStorage.removeItem("access_token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (newToken: string) => {
    try {
      // 1. Save the token
      localStorage.setItem("access_token", newToken);
      setToken(newToken);

      // 2. Fetch user profile with the token
      const response = await getProfile(newToken);

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userData = await response.json();
      console.log("User data loaded after login:", userData);

      // 3. Set user data
      setUser(userData.data);
    } catch (error) {
      console.error("Login failed:", error);
      // Clean up if profile fetch fails
      localStorage.removeItem("access_token");
      setToken(null);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
