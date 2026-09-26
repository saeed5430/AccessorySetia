import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { getPlatform, getUser } from "@/services/Platform";
import type { AppUser, Platform } from "@/types/account";

type AppContextType = {
  platform: Platform;
  user: AppUser | null;
};

const AppContext = createContext<AppContextType | null>(null);

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({
  children,
}: AppProviderProps) {
  const value = {
    platform: getPlatform(),
    user: getUser(),
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return context;
}