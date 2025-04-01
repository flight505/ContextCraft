import React, { useEffect, useState } from 'react';
import { Toaster as SonnerToaster, toast, ExternalToast } from 'sonner';
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
 * Component for terminal-like prefix
 */
export const TerminalPrefix: React.FC = () => (
  <span className={styles.terminalPrefix}>&gt;_</span>
);

/**
 * Component for file loading indicator
 */
export const FileLoading: React.FC<{children?: React.ReactNode}> = ({ children }) => (
  <span className={styles.fileLoading}>{children}</span>
);

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
    // Initial check
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
      // Use 'light' theme always to let our CSS handle the theming
      theme="light"
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
          actionButton: styles.actionButton,
          cancelButton: styles.cancelButton,
          closeButton: styles.closeButton,
        }
      }}
    />
  );
};

// Toast helper functions
type CommonToastOptions = Omit<ExternalToast, 'description'> & {
  description?: React.ReactNode;
};

interface ToastPromiseOptions<T> {
  loading: string;
  success: (data: T) => string | React.ReactNode;
  error: (error: Error) => string | React.ReactNode;
}

export const showToast = {
  success: (title: string, options?: CommonToastOptions) => {
    return toast.success(title, options);
  },
  
  error: (title: string, options?: CommonToastOptions) => {
    return toast.error(title, options);
  },
  
  warning: (title: string, options?: CommonToastOptions) => {
    return toast.warning(title, options);
  },
  
  info: (title: string, options?: CommonToastOptions) => {
    return toast.info(title, options);
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: ToastPromiseOptions<T>,
    options?: CommonToastOptions
  ) => {
    // Merge messages and options to match Sonner's API
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
        ...options
      }
    );
  },
  
  fileLoading: (message: string, options?: CommonToastOptions) => {
    return toast.info('Processing', {
      ...options,
      description: (
        <>
          <FileLoading />
          <TerminalPrefix />{message}
        </>
      )
    });
  },
  
  fileComplete: (message: string, options?: CommonToastOptions) => {
    return toast.success(message, options);
  },
  
  fileError: (message: string, options?: CommonToastOptions) => {
    return toast.error('Error', {
      ...options,
      description: (
        <>
          <TerminalPrefix />{message}
        </>
      )
    });
  },
  
  custom: (
    title: string, 
    options?: CommonToastOptions
  ) => {
    return toast(title, options);
  },
  
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId);
  },
  
  dismissAll: () => {
    toast.dismiss();
  }
};

export default Toast; 