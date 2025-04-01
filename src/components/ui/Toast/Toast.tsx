import React, { useEffect, useState } from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import styles from './Toast.module.css';
import { cn } from '../../../utils/cn';

/**
 * Properties for Toast component
 */
export interface ToastProps {
  /**
   * Position of the toast notifications
   * @default 'bottom-right'
   */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  
  /**
   * Gap between toast notifications
   * @default 8
   */
  gap?: number;
  
  /**
   * Optional toast visibility duration in milliseconds
   * @default 4000
   */
  duration?: number;
  
  /**
   * Additional class name for the toaster container
   */
  className?: string;
  
  /**
   * If true, toast notifications will have a close button
   * @default true
   */
  closeButton?: boolean;
  
  /**
   * Maximum number of toast notifications shown at once
   * @default 5
   */
  visibleToasts?: number;

  /**
   * Offset from the edges of the screen in pixels
   * @default 16
   */
  offset?: number | string;
}

/**
 * Toast component for displaying notifications using sonner
 */
export const Toast: React.FC<ToastProps> = ({
  position = 'bottom-right',
  gap = 8,
  duration = 4000,
  className,
  closeButton = true,
  visibleToasts = 5,
  offset = 16,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark-mode');
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Observer for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <SonnerToaster
      theme={isDarkMode ? 'dark' : 'light'}
      className={cn(styles.toaster, className)}
      position={position}
      gap={gap}
      duration={duration}
      closeButton={closeButton}
      visibleToasts={visibleToasts}
      offset={offset}
      toastOptions={{
        classNames: {
          toast: styles.toast,
          title: styles.title,
          description: styles.description,
          loader: styles.loader,
          success: styles.success,
          error: styles.error,
          warning: styles.warning,
          info: styles.info,
          action: styles.action,
          actionButton: styles.actionButton,
          cancelButton: styles.cancelButton,
          closeButton: styles.closeButton,
        }
      }}
    />
  );
};

/**
 * Helper functions to show different types of toasts
 */
export const showToast = {
  /**
   * Show a default toast notification
   */
  default: (
    title: string, 
    description?: string, 
    action?: { label: string; onClick: () => void }
  ) => {
    return toast(title, {
      description,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined
    });
  },
  
  /**
   * Show a success toast notification
   */
  success: (title: string, description?: string) => {
    return toast.success(title, { description });
  },
  
  /**
   * Show an error toast notification
   */
  error: (title: string, description?: string) => {
    return toast.error(title, { description });
  },
  
  /**
   * Show a warning toast notification
   */
  warning: (title: string, description?: string) => {
    return toast.warning(title, { description });
  },
  
  /**
   * Show an info toast notification
   */
  info: (title: string, description?: string) => {
    return toast.info(title, { description });
  },
  
  /**
   * Show a loading toast that updates with promise resolution
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
    options?: { description?: string }
  ) => {
    return toast.promise(promise, messages, options);
  }
};

export default Toast; 