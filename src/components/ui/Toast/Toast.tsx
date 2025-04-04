import React from 'react';
import { Toaster as SonnerToaster, toast as _toast } from 'sonner';
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

// Define the ToastClassnames interface to match our CSS modules
interface ToastClassnames {
  toast?: string;
  title?: string;
  description?: string;
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
  action?: string;
  actionButton?: string;
  cancelButton?: string;
  closeButton?: string;
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
  const CustomCloseButton: React.FC = () => {
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
        } as ToastClassnames,
        unstyled: true,
        closeButton: CustomCloseButton as unknown as boolean,
      }}
    />
  );
};

export default Toast; 