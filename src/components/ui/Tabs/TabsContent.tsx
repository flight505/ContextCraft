import React, { ReactNode } from 'react';
import { useTabs } from './useTabs';
import styles from './Tabs.module.css';

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

// Content panel for each tab
const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
  const { activeTab } = useTabs(); // Get state from context
  const isActive = activeTab === value;
  
  // Use display:none via CSS classes instead of absolute positioning
  // This avoids layout issues when tabs have different heights

  return (
    <div
      id={`tab-content-${value}`} // Linked from trigger
      role="tabpanel"
      aria-labelledby={`tab-trigger-${value}`} 
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
      className={`${styles.tabsContent} ${isActive ? styles.activeContent : styles.inactiveContent} ${className || ''}`}
    >
      {children}
    </div>
  );
};

// Add display name for better debugging and component type detection
TabsContent.displayName = 'TabsContent';
export { TabsContent }; 