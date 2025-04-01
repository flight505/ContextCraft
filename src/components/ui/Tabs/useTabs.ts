import { createContext, useContext } from 'react';

export interface TabsContextProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

// Create context for sharing tab state
export const TabsContext = createContext<TabsContextProps | undefined>(undefined);

// Hook to access tab context
export const useTabs = (): TabsContextProps => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component');
  }
  return context;
}; 