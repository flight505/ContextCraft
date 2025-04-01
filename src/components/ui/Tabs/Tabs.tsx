import React, { useState, ReactNode } from 'react';
import { TabsContext } from './useTabs';
import styles from './Tabs.module.css';

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

// Main Tabs component managing state
const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`${styles.tabs} ${className || ''}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// Add display name for better debugging and component type detection
Tabs.displayName = 'Tabs';

export { Tabs }; 