import { toast } from 'sonner';
import styles from './Toast.module.css';

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
      icon: null,
      className: !description ? styles.singleLineToast : ''
    });
  },
  
  /**
   * Show a success toast notification
   */
  success: (title: string, description?: string) => {
    return toast.success(title, { 
      description,
      icon: null,
      className: !description ? styles.singleLineToast : ''
    });
  },
  
  /**
   * Show an error toast notification
   */
  error: (title: string, description?: string) => {
    return toast.error(title, { 
      description,
      icon: null,
      className: !description ? styles.singleLineToast : ''
    });
  },
  
  /**
   * Show a warning toast notification
   */
  warning: (title: string, description?: string) => {
    return toast.warning(title, { 
      description,
      icon: null,
      className: !description ? styles.singleLineToast : ''
    });
  },
  
  /**
   * Show an info toast notification
   */
  info: (title: string, description?: string) => {
    return toast.info(title, { 
      description,
      icon: null,
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
      icon?: null;
    }
  ) => {
    return toast.promise(promise, {
      ...messages,
      icon: null
    });
  }
}; 