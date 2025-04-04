// Export all tab components from a single file
import React from 'react';
import { Tabs } from './Tabs';

// Adding a component to satisfy the react-refresh/only-export-components rule
const TabsWrapper = (props) => <Tabs {...props} />;

// eslint-disable-next-line react-refresh/only-export-components
export * from './Tabs/index';
export { TabsWrapper }; 