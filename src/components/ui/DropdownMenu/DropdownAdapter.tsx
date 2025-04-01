import React from 'react';
import { FileText, FileCode, Code } from 'lucide-react';
import { DropdownMenu, DropdownMenuProps } from './DropdownMenu';
import styles from './DropdownMenu.module.css';

// Extend original props with renderHeader from DropdownMenuProps
interface DropdownAdapterProps extends Omit<DropdownMenuProps, 'options' | 'onChange'> {
  options: {
    value: string;
    label: string;
    description?: string;
    icon?: string;
    disabled?: boolean;
  }[];
  value?: string | undefined;
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  title?: string;
  className?: string;
  menuClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  side?: 'top' | 'bottom' | 'auto';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  renderHeader?: () => React.ReactNode;
}

export const DropdownAdapter: React.FC<DropdownAdapterProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  title,
  className,
  menuClassName,
  size = 'md',
  disabled = false,
  side = 'auto',
  sideOffset = 5,
  align = 'start',
  renderHeader,
}) => {
  // Map option icons to Lucide components
  const getIconForOption = (option: { value: string; icon?: string }) => {
    switch (option.value) {
      case 'xml':
        return <Code size={16} className={styles.itemIcon} aria-hidden="true" />;
      case 'markdown':
        return <FileCode size={16} className={styles.itemIcon} aria-hidden="true" />;
      case 'plain':
        return <FileText size={16} className={styles.itemIcon} aria-hidden="true" />;
      default:
        return null;
    }
  };

  // Convert options to the format expected by the new DropdownMenu
  const dropdownOptions = options.map(option => ({
    value: option.value,
    label: option.label,
    icon: getIconForOption(option),
    disabled: option.disabled,
  }));

  // Handle onChange adaptation if needed (string vs string[])
  // Assuming DropdownMenu now only handles single string value based on its reverted state
  const handleDropdownChange = (val: string) => {
    onChange(val);
  };

  return (
    <DropdownMenu
      options={dropdownOptions}
      value={value as string}
      onChange={handleDropdownChange}
      placeholder={placeholder}
      title={title}
      className={className}
      menuClassName={menuClassName}
      size={size}
      disabled={disabled}
      align={align}
      side={side}
      sideOffset={sideOffset}
      renderHeader={renderHeader}
    />
  );
}; 