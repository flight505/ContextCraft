import React, { ReactNode, Children, useRef, useEffect, KeyboardEvent } from 'react';
import { useTabs } from './useTabs';
import styles from './Tabs.module.css';

interface TabsListProps {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

// Container for the tab triggers
const TabsList: React.FC<TabsListProps> = ({ children, className, 'aria-label': ariaLabel }) => {
  const { activeTab, setActiveTab } = useTabs();
  const triggersRef = useRef<(HTMLButtonElement | null)[]>([]);

  const childrenArray = Children.toArray(children);

  // Ensure triggersRef array is the correct size
  useEffect(() => {
    triggersRef.current = triggersRef.current.slice(0, childrenArray.length);
  }, [childrenArray.length]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = childrenArray.findIndex(
      (child) => React.isValidElement(child) && child.props.value === activeTab
    );

    if (currentIndex === -1) return;

    let nextIndex = -1;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % childrenArray.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + childrenArray.length) % childrenArray.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = childrenArray.length - 1;
    }

    if (nextIndex !== -1) {
      event.preventDefault();
      const nextTrigger = triggersRef.current[nextIndex];
      if (nextTrigger) {
        nextTrigger.focus();
        // Optionally activate on arrow navigation (common pattern)
        const nextChild = childrenArray[nextIndex];
        if (React.isValidElement(nextChild)) {
          setActiveTab(nextChild.props.value);
        }
      }
    }
  };

  return (
    <div
      className={`${styles.tabsList} ${className || ''}`}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      {Children.map(childrenArray, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            ref: (el: HTMLButtonElement | null) => triggersRef.current[index] = el,
          });
        }
        return child;
      })}
    </div>
  );
};

// Add display name for better debugging and component type detection
TabsList.displayName = 'TabsList';
export { TabsList }; 