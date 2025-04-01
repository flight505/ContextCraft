import React, { ReactNode, forwardRef } from 'react';
import { useTabs } from './useTabs';
import styles from './Tabs.module.css';

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode; // Add support for optional icon
}

// Clickable trigger for each tab
const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, children, className, disabled, icon }, ref) => {
    const { activeTab, setActiveTab } = useTabs(); // Get state from context
    const isActive = activeTab === value;

    const handleClick = () => {
      if (!disabled) {
        setActiveTab(value);
      }
    };

    return (
      <button
        ref={ref} // Assign the forwarded ref
        type="button"
        id={`tab-trigger-${value}`} // Add ID for ARIA linkage
        role="tab"
        aria-selected={isActive}
        aria-controls={`tab-content-${value}`} // Link to content panel
        tabIndex={isActive ? 0 : -1} // Manage focus
        className={`${styles.tabsTrigger} ${isActive ? styles.active : ''} ${className || ''}`}
        onClick={handleClick}
        disabled={disabled}
      >
        {icon && <span className={styles.tabIcon}>{icon}</span>}
        {children}
      </button>
    );
  }
);

// Add display name for better debugging
TabsTrigger.displayName = 'TabsTrigger';
export { TabsTrigger }; 