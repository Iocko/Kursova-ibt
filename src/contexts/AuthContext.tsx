import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { UserModel } from "@/types/userModel";
import { authApi } from "@/utils/authApi";

type AuthContextType = {
  user: UserModel | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserModel) => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.getCurrentUser();
        if (response.data) {
          setUser(response.data);
        } else {
          localStorage.removeItem("auth_token");
        }
      } catch (error) {
        localStorage.removeItem("auth_token");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });

      if (response.data) {
        localStorage.setItem("auth_token", response.data.token);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.error || "Login failed" };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authApi.register({ email, password, name });

      if (response.data) {
        localStorage.setItem("auth_token", response.data.token);
        setUser(response.data.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Registration failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      };
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
