"use client";

import { useEffect } from "react";
import { checkSession, getUser } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);

  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await checkSession();

        if (!session) {
          clearIsAuthenticated();
          return;
        }

        const user = await getUser();

        setUser(user);
      } catch (error) {
        console.error("Failed to check session:", error);

        clearIsAuthenticated();
      }
    };

    checkAuth();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
