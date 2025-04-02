import React from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';
import { X } from 'lucide-react';
import styles from './Toast.module.css';
import { cn } from '../../../utils/cn';
import { useTheme } from '../../../hooks/useTheme';

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
   * @default 6
   */
  gap?: number;
  
  /**
   * Optional toast visibility duration in milliseconds
   * @default 3000
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
   * @default 12
   */
  offset?: number | string;
  
  /**
   * Use high-density layout (40px height instead of 50px)
   * @default false
   */
  highDensity?: boolean;
}

/**
 * Toast component for displaying notifications using sonner
 */
export const Toast: React.FC<ToastProps> = ({
  position = 'bottom-right',
  gap = 6,
  duration = 3000,
  className,
  closeButton = true,
  visibleToasts = 5,
  offset = 12,
  highDensity = false,
}) => {
  // Use the theme context to get the current theme
  const { currentTheme } = useTheme();
  const isDarkMode = currentTheme === 'dark';

  // Custom close button with Lucide X icon
  const CustomCloseButton = () => {
    return (
      <button className={styles.closeButton} aria-label="Close toast">
        <X size={14} color="currentColor" />
      </button>
    );
  };

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
          toast: cn(styles.toast, highDensity && styles.highDensity),
          title: styles.title,
          description: styles.description,
          success: styles.success,
          error: styles.error,
          warning: styles.warning,
          info: styles.info,
          action: styles.action,
          actionButton: styles.actionButton,
          cancelButton: styles.cancelButton,
          closeButton: styles.closeButton,
        },
        // Force using our CSS variables instead of sonner's built-in styling
        unstyled: true,
        // Use custom close button with Lucide icon
        closeButton: CustomCloseButton,
        // Set icon to null to completely remove it
        icon: null
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
      } : undefined,
      // Set icon to null to completely remove it
      icon: null,
      // Apply custom class for better centering of single-line toasts
      className: !description ? styles.singleLineToast : ''
    });
  },
  
  /**
   * Show a success toast notification
   */
  success: (title: string, description?: string) => {
    return toast.success(title, { 
      description,
      // Set icon to null to completely remove it
      icon: null,
      // Apply custom class for better centering of single-line toasts
      className: !description ? styles.singleLineToast : ''
    });
  },
  
  /**
   * Show an error toast notification
   */
  error: (title: string, description?: string) => {
    return toast.error(title, { 
      description,
      // Set icon to null to completely remove it
      icon: null,
      // Apply custom class for better centering of single-line toasts
      className: !description ? styles.singleLineToast : ''
    });
  },
  
  /**
   * Show a warning toast notification
   */
  warning: (title: string, description?: string) => {
    return toast.warning(title, { 
      description,
      // Set icon to null to completely remove it
      icon: null,
      // Apply custom class for better centering of single-line toasts
      className: !description ? styles.singleLineToast : ''
    });
  },
  
  /**
   * Show an info toast notification
   */
  info: (title: string, description?: string) => {
    return toast.info(title, { 
      description,
      // Set icon to null to completely remove it
      icon: null,
      // Apply custom class for better centering of single-line toasts
      className: !description ? styles.singleLineToast : ''
    });
  },
  
  /**
   * Show a promise toast that updates with promise resolution
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
    const opts = {
      ...options,
      icon: null
    };
    return toast.promise(promise, messages, opts);
  }
};

export default Toast; 