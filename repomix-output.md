This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where line numbers have been added.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: src/, preload.js, main.js
- Files matching these patterns are excluded: src/__tests__/utils/**, **/*.md, docs/**, scripts/**, node_modules/**, dist/**, .git/**, **/*.log, **/*.lock, **/*.svg
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Line numbers have been added to the beginning of each line
- Files are sorted by Git change count (files with more changes are at the bottom)

## Additional Info

# Directory Structure
```
src/
  __tests__/
    setup.ts
  components/
    __tests__/
      IgnorePatterns.test.tsx
    ui/
      Button/
        Button.module.css
        Button.tsx
        index.ts
      ButtonGroup/
        ButtonGroup.module.css
        ButtonGroup.tsx
        index.ts
      Card/
        Card.module.css
        Card.tsx
        index.ts
      Dialog/
        Dialog.module.css
        Dialog.tsx
        index.ts
      Dropdown/
        Dropdown.module.css
        Dropdown.tsx
        index.ts
      DropdownMenu/
        DropdownAdapter.tsx
        DropdownMenu.module.css
        DropdownMenu.tsx
        index.ts
        TemplateDropdownAdapter.tsx
      Input/
        index.ts
        Input.module.css
        Input.tsx
      StatusAlert/
        index.ts
        StatusAlert.module.css
        StatusAlert.tsx
      Switch/
        index.ts
        Switch.module.css
        Switch.tsx
      Tabs/
        index.ts
        Tabs.module.css
        Tabs.tsx
        TabsContent.tsx
        TabsList.tsx
        TabsTrigger.tsx
        useTabs.ts
      ConfirmationDialog.tsx
      index.ts
      TabsComponents.tsx
    ControlContainer.module.css
    ControlContainer.tsx
    ErrorBoundary.tsx
    FileCard.module.css
    FileCard.tsx
    FileList.module.css
    FileList.tsx
    FileTreeHeader.module.css
    FileTreeHeader.tsx
    IgnorePatterns.module.css
    IgnorePatterns.tsx
    SearchBar.module.css
    SearchBar.tsx
    Sidebar.module.css
    Sidebar.module.css.d.ts
    Sidebar.tsx
    ThemeToggle.module.css
    ThemeToggle.tsx
    TreeItem.module.css
    TreeItem.tsx
    UserInstructionsWithTemplates.module.css
    UserInstructionsWithTemplates.tsx
  constants/
    api.ts
    outputFormats.ts
    promptTemplates.ts
    theme.ts
  context/
    ThemeContext.tsx
    ThemeContextType.ts
  hooks/
    useTheme.ts
  styles/
    globals.css
    index.css
  types/
    css.d.ts
    electron.d.ts
    FileInfo.ts
    FileTypes.ts
    GlobalPatternsState.ts
    index.ts
    ModelTypes.ts
    SortOrder.ts
  utils/
    cn.ts
    compressionUtils.ts
    create-variants.ts
    formatters.ts
    modelUtils.ts
    pathUtils.ts
    patternUtils.ts
    sortIcons.tsx
  App.module.css
  App.tsx
  declarations.d.ts
  main.tsx
  react-app-env.d.ts
```

# Files

## File: src/__tests__/setup.ts
````typescript
 1: import '@testing-library/jest-dom';
 2: import { TextEncoder, TextDecoder } from 'util';
 3: 
 4: global.TextEncoder = TextEncoder;
 5: global.TextDecoder = TextDecoder as any;
 6: 
 7: // Mock window.matchMedia
 8: Object.defineProperty(window, 'matchMedia', {
 9:   writable: true,
10:   value: jest.fn().mockImplementation(query => ({
11:     matches: false,
12:     media: query,
13:     onchange: null,
14:     addListener: jest.fn(),
15:     removeListener: jest.fn(),
16:     addEventListener: jest.fn(),
17:     removeEventListener: jest.fn(),
18:     dispatchEvent: jest.fn(),
19:   })),
20: });
21: 
22: // Mock ResizeObserver
23: global.ResizeObserver = class ResizeObserver {
24:   observe = jest.fn();
25:   unobserve = jest.fn();
26:   disconnect = jest.fn();
27: };
28: 
29: // Mock IntersectionObserver
30: global.IntersectionObserver = jest.fn().mockImplementation(() => ({
31:   root: null,
32:   rootMargin: '',
33:   thresholds: [],
34:   disconnect: jest.fn(),
35:   observe: jest.fn(),
36:   takeRecords: jest.fn(),
37:   unobserve: jest.fn(),
38: }));
````

## File: src/components/__tests__/IgnorePatterns.test.tsx
````typescript
 1: // Imports commented out since they're not used in the current test implementation
 2: // import React from 'react';
 3: // import { render } from '@testing-library/react';
 4: // import IgnorePatterns from '../IgnorePatterns';
 5: 
 6: // Mock implementation to disable tests for now
 7: describe('IgnorePatterns component', () => {
 8:   it('should be temporarily disabled', () => {
 9:     // Skip tests until we update the testing library
10:     expect(true).toBe(true);
11:   });
12: });
````

## File: src/components/ui/Button/Button.module.css
````css
  1: .button {
  2:   display: inline-flex;
  3:   align-items: center;
  4:   justify-content: center;
  5:   cursor: pointer;
  6:   font-family: inherit;
  7:   font-size: 13px;
  8:   gap: 8px;
  9:   padding: 0 12px;
 10:   border-radius: 6px;
 11:   transition: all 0.15s ease;
 12:   white-space: nowrap;
 13:   font-weight: 500;
 14:   height: 32px;
 15:   background-color: var(--background-primary);
 16:   color: var(--text-primary);
 17:   border: 1px solid var(--border-color);
 18: }
 19: 
 20: .button:hover:not(:disabled) {
 21:   background-color: var(--hover-color);
 22: }
 23: 
 24: .button:active:not(:disabled) {
 25:   background-color: var(--secondary-button-active);
 26: }
 27: 
 28: .button:disabled {
 29:   opacity: 0.5;
 30:   cursor: not-allowed;
 31: }
 32: 
 33: /* Variants */
 34: .ghost {
 35:   background-color: transparent;
 36:   border: 1px solid var(--border-color);
 37:   color: var(--text-primary);
 38: }
 39: 
 40: .ghost:hover:not(:disabled) {
 41:   background-color: var(--hover-color);
 42: }
 43: 
 44: .ghost:active:not(:disabled) {
 45:   background-color: var(--secondary-button-active);
 46: }
 47: 
 48: .secondary {
 49:   background-color: transparent;
 50:   border: 1px solid var(--border-color);
 51:   color: var(--text-primary);
 52: }
 53: 
 54: .secondary:hover:not(:disabled) {
 55:   background-color: var(--hover-color);
 56: }
 57: 
 58: .secondary:active:not(:disabled) {
 59:   background-color: var(--secondary-button-active);
 60: }
 61: 
 62: /* Icon styles */
 63: .startIcon {
 64:   margin-right: 4px;
 65:   display: flex;
 66:   align-items: center;
 67: }
 68: 
 69: .endIcon {
 70:   margin-left: 4px;
 71:   display: flex;
 72:   align-items: center;
 73: }
 74: 
 75: /* Variants */
 76: .primary {
 77:   background-color: var(--primary-button-background);
 78:   color: var(--primary-button-text);
 79:   border: 1px solid var(--primary-button-border);
 80: }
 81: 
 82: .primary:hover:not(:disabled) {
 83:   background-color: var(--primary-button-hover);
 84:   border-color: var(--primary-button-border);
 85: }
 86: 
 87: .primary:active:not(:disabled) {
 88:   background-color: var(--primary-button-active);
 89:   border-color: var(--primary-button-border);
 90: }
 91: 
 92: .destructive {
 93:   background-color: var(--error-color);
 94:   color: white;
 95:   border: 1px solid var(--error-color);
 96: }
 97: 
 98: .destructive:hover:not(:disabled) {
 99:   opacity: 0.9;
100: }
101: 
102: .destructive:active:not(:disabled) {
103:   opacity: 0.8;
104: }
105: 
106: /* Sizes */
107: .sm {
108:   font-size: 12px;
109:   padding: 0 12px;
110:   height: var(--button-height-sm);
111: }
112: 
113: .md {
114:   font-size: 14px;
115:   padding: 0 16px;
116:   height: var(--button-height-md);
117: }
118: 
119: .lg {
120:   font-size: 16px;
121:   padding: 0 20px;
122:   height: var(--button-height-lg);
123: }
124: 
125: /* Icon styles */
126: .startIcon {
127:   margin-right: 4px;
128:   display: flex;
129:   align-items: center;
130: }
131: 
132: .endIcon {
133:   margin-left: 4px;
134:   display: flex;
135:   align-items: center;
136: }
137: 
138: .iconOnly {
139:   padding: 0;
140:   aspect-ratio: 1/1;
141:   justify-content: center;
142: }
143: 
144: .iconOnly.sm {
145:   width: var(--button-height-sm);
146: }
147: 
148: .iconOnly.md {
149:   width: var(--button-height-md);
150: }
151: 
152: .iconOnly.lg {
153:   width: var(--button-height-lg);
154: }
155: 
156: /* Pill shape - just the border radius */
157: .pillShaped {
158:   border-radius: var(--radius-full);
159: }
160: 
161: /* Pill variant - tag/badge style button */
162: .pill {
163:   border-radius: var(--radius-full);
164:   background-color: var(--background-primary-dark);
165:   color: white;
166:   border: none;
167:   padding: 0 12px;
168:   font-size: 12px;
169:   font-weight: 500;
170:   height: 24px;
171:   letter-spacing: 0.01em;
172:   text-transform: capitalize;
173:   transition: opacity 0.2s ease;
174: }
175: 
176: .pill:hover:not(:disabled) {
177:   background-color: var(--background-primary-dark);
178:   opacity: 0.9;
179: }
180: 
181: .pill:active:not(:disabled) {
182:   background-color: var(--background-primary-dark);
183:   opacity: 0.8;
184: }
185: 
186: /* Dark mode support for pill */
187: :global(.dark-mode) .pill {
188:   background-color: hsl(240, 5%, 84.9%);
189:   color: var(--background-primary-dark);
190: }
191: 
192: :global(.dark-mode) .pill:hover:not(:disabled),
193: :global(.dark-mode) .pill:active:not(:disabled) {
194:   background-color: hsl(240, 5%, 84.9%);
195: }
196: 
197: /* Round variant - inherits from primary but with enhancements */
198: .round {
199:   background-color: var(--primary-button-background);
200:   color: var(--primary-button-text);
201:   border-color: var(--primary-button-background);
202:   padding: 0 20px;
203:   border-width: 1.5px;
204:   font-weight: 600;
205:   letter-spacing: 0.01em;
206: }
207: 
208: .round:hover:not(:disabled) {
209:   background-color: var(--primary-button-hover);
210:   border-color: var(--primary-button-hover);
211:   box-shadow: var(--shadow-sm);
212: }
213: 
214: .round:active:not(:disabled) {
215:   background-color: var(--primary-button-active);
216:   border-color: var(--primary-button-active);
217: }
218: 
219: .round.iconOnly {
220:   padding: 0;
221:   width: var(--button-height-md);
222:   height: var(--button-height-md);
223: }
224: 
225: .round.sm.iconOnly {
226:   width: var(--button-height-sm);
227:   height: var(--button-height-sm);
228: }
229: 
230: .round.lg.iconOnly {
231:   width: var(--button-height-lg);
232:   height: var(--button-height-lg);
233: }
234: 
235: /* Adjust icon spacing for round variant */
236: .round .startIcon {
237:   margin-right: 8px;
238: }
239: 
240: .round .endIcon {
241:   margin-left: 8px;
242: }
243: 
244: .round.iconOnly .startIcon,
245: .round.iconOnly .endIcon {
246:   margin: 0;
247: }
248: 
249: /* Icon variant - for icon-only buttons without background effects */
250: .icon {
251:   background-color: transparent;
252:   border: none;
253:   color: var(--icon-color);
254:   padding: 0;
255:   transition: transform 0.2s ease, color 0.2s ease;
256: }
257: 
258: .icon:hover:not(:disabled) {
259:   background-color: transparent;
260:   color: var(--text-primary);
261:   opacity: 0.8;
262:   transform: scale(1.1);
263: }
264: 
265: .icon:active:not(:disabled) {
266:   background-color: transparent;
267:   opacity: 0.9;
268:   transform: scale(1.05);
269: }
````

## File: src/components/ui/Button/Button.tsx
````typescript
 1: import React from 'react';
 2: import { cn } from '../../../utils/cn';
 3: import styles from './Button.module.css';
 4: 
 5: export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'round' | 'icon' | 'pill';
 6: export type ButtonSize = 'sm' | 'md' | 'lg';
 7: 
 8: export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 9:   /**
10:    * Button visual variant
11:    * @default 'primary'
12:    */
13:   variant?: ButtonVariant;
14:   
15:   /**
16:    * Button size
17:    * @default 'md'
18:    */
19:   size?: ButtonSize;
20:   
21:   /**
22:    * Optional icon to display before the button text
23:    */
24:   startIcon?: React.ReactNode;
25:   
26:   /**
27:    * Optional icon to display after the button text
28:    */
29:   endIcon?: React.ReactNode;
30:   
31:   /**
32:    * If true, button will have equal width and height, and padding will be adjusted
33:    * Useful for icon-only buttons
34:    * @default false
35:    */
36:   iconOnly?: boolean;
37:   
38:   /**
39:    * If true, button will have fully rounded corners (pill shape)
40:    * Note: This is different from the 'pill' variant which has specific styling
41:    * @default false
42:    */
43:   pill?: boolean;
44:   
45:   /**
46:    * Button children (text content or other elements)
47:    */
48:   children?: React.ReactNode;
49: }
50: 
51: /**
52:  * Primary UI component for user interaction.
53:  * Supports multiple variants (primary, secondary, ghost, destructive, round, pill, icon) and sizes.
54:  * Round variant is always pill-shaped and inherits primary colors with enhanced styling.
55:  * Pill variant is a compact, high-contrast tag-like button (similar to the Platform badge in the reference).
56:  */
57: export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
58:   (
59:     {
60:       className,
61:       variant = 'primary',
62:       size = 'md',
63:       startIcon,
64:       endIcon,
65:       iconOnly = false,
66:       pill = false,
67:       children,
68:       ...props
69:     },
70:     ref
71:   ) => {
72:     // Force pill shape for round variant and pill variant
73:     const isPillShaped = variant === 'round' || variant === 'pill' || pill;
74:     
75:     return (
76:       <button
77:         className={cn(
78:           styles.button,
79:           styles[variant],
80:           styles[size],
81:           iconOnly && styles.iconOnly,
82:           isPillShaped && !variant.includes('pill') && styles.pillShaped, // Apply pill shape but not pill styling
83:           className
84:         )}
85:         ref={ref}
86:         {...props}
87:       >
88:         {startIcon && <span className={styles.startIcon}>{startIcon}</span>}
89:         {children}
90:         {endIcon && <span className={styles.endIcon}>{endIcon}</span>}
91:       </button>
92:     );
93:   }
94: );
95: 
96: Button.displayName = 'Button';
````

## File: src/components/ui/Button/index.ts
````typescript
1: export * from './Button';
````

## File: src/components/ui/ButtonGroup/ButtonGroup.module.css
````css
 1: .buttonGroup {
 2:   display: flex;
 3:   align-items: center;
 4: }
 5: 
 6: /* Horizontal variant - default */
 7: .horizontal {
 8:   display: flex;
 9:   flex-direction: row;
10: }
11: 
12: /* Vertical variant */
13: .vertical {
14:   display: flex;
15:   flex-direction: column;
16: }
17: 
18: /* Position-based styles for horizontal variant */
19: .first {
20:   border-top-right-radius: 0;
21:   border-bottom-right-radius: 0;
22:   border-right: none;
23: }
24: 
25: .middle {
26:   border-radius: 0;
27:   border-right: none;
28: }
29: 
30: .last {
31:   border-top-left-radius: 0;
32:   border-bottom-left-radius: 0;
33:   border-left: 1px solid var(--border-color);
34: }
35: 
36: /* Position-based styles for vertical variant */
37: .top {
38:   border-bottom-left-radius: 0;
39:   border-bottom-right-radius: 0;
40:   border-bottom: none;
41: }
42: 
43: .center {
44:   border-radius: 0;
45:   border-bottom: none;
46: }
47: 
48: .bottom {
49:   border-top-left-radius: 0;
50:   border-top-right-radius: 0;
51:   border-top: 1px solid var(--border-color);
52: }
53: 
54: /* Handle hover and active states - ensure proper z-index */
55: .buttonGroup button:hover:not(:disabled) {
56:   z-index: 1;
57: }
58: 
59: .buttonGroup button:active:not(:disabled) {
60:   z-index: 2;
61: }
62: 
63: /* Sizes */
64: .xs {
65:   gap: 0;
66: }
67: 
68: .xs button {
69:   height: 22px;
70:   font-size: 9px;
71:   padding: 2px 6px;
72: }
73: 
74: .sm {
75:   gap: 0;
76: }
77: 
78: .sm button {
79:   height: 26px;
80:   font-size: 10px;
81:   padding: 3px 8px;
82: }
83: 
84: .md {
85:   gap: 0;
86: }
87: 
88: .md button {
89:   height: 30px;
90:   font-size: 11px;
91: }
92: 
93: .lg {
94:   gap: 0;
95: }
````

## File: src/components/ui/ButtonGroup/ButtonGroup.tsx
````typescript
 1: import React from 'react';
 2: import { Button } from '../Button';
 3: import styles from './ButtonGroup.module.css';
 4: 
 5: interface ButtonGroupProps {
 6:   children: React.ReactNode;
 7:   className?: string;
 8:   variant?: 'horizontal' | 'vertical';
 9:   size?: 'xs' | 'sm' | 'md' | 'lg';
10: }
11: 
12: const ButtonGroup: React.FC<ButtonGroupProps> = ({
13:   children,
14:   className = '',
15:   variant = 'horizontal',
16:   size = 'md'
17: }) => {
18:   // Apply the buttonGroup class and any additional className
19:   const groupClassName = `${styles.buttonGroup} ${styles[variant]} ${styles[size]} ${className}`;
20: 
21:   // Apply styling to children to connect them
22:   const childrenWithProps = React.Children.map(children, (child, index) => {
23:     // Skip non-Button children
24:     if (!React.isValidElement(child) || (child.type as any) !== Button) {
25:       console.warn("ButtonGroup should only contain Button components.");
26:       return child;
27:     }
28: 
29:     const isFirst = index === 0;
30:     const isLast = index === React.Children.count(children) - 1;
31: 
32:     // Calculate the position classes
33:     let positionClass = '';
34:     if (variant === 'horizontal') {
35:       if (isFirst) positionClass = styles.first;
36:       else if (isLast) positionClass = styles.last;
37:       else positionClass = styles.middle;
38:     } else { // vertical
39:       if (isFirst) positionClass = styles.top;
40:       else if (isLast) positionClass = styles.bottom;
41:       else positionClass = styles.center;
42:     }
43: 
44:     // Clone the child with additional className
45:     const childClassName = child.props.className || '';
46:     return React.cloneElement(child, {
47:       ...child.props,
48:       className: `${childClassName} ${positionClass}`,
49:       size: child.props.size || size, // Pass down size if not specified
50:     });
51:   });
52: 
53:   return (
54:     <div className={groupClassName}>
55:       {childrenWithProps}
56:     </div>
57:   );
58: };
59: 
60: ButtonGroup.displayName = 'ButtonGroup';
61: 
62: export { ButtonGroup };
````

## File: src/components/ui/ButtonGroup/index.ts
````typescript
1: export { ButtonGroup } from './ButtonGroup';
````

## File: src/components/ui/Card/Card.module.css
````css
 1: .card {
 2:   border: 1px solid var(--border-color);
 3:   border-radius: var(--radius);
 4:   background-color: var(--card-background);
 5:   color: var(--text-primary);
 6:   transition: border-color 0.2s ease, box-shadow 0.2s ease;
 7: }
 8: 
 9: .card:hover {
10:   border-color: var(--accent-color);
11:   box-shadow: var(--shadow-sm);
12: }
13: 
14: .cardSelected {
15:   border-color: var(--accent-color);
16:   box-shadow: var(--shadow-md);
17: }
18: 
19: .cardInteractive {
20:   cursor: pointer;
21: }
22: 
23: .cardInteractive:hover {
24:   box-shadow: var(--shadow-md);
25: }
26: 
27: .cardHeader {
28:   display: flex;
29:   align-items: center;
30:   justify-content: space-between;
31:   padding: 12px 16px;
32:   border-bottom: 1px solid var(--border-color);
33: }
34: 
35: .cardTitle {
36:   font-weight: 600;
37:   font-size: 16px;
38:   margin: 0;
39:   color: var(--text-primary);
40: }
41: 
42: .cardDescription {
43:   color: var(--text-secondary);
44:   font-size: 14px;
45:   margin-top: 4px;
46: }
47: 
48: .cardContent {
49:   padding: 16px;
50: }
51: 
52: .cardFooter {
53:   display: flex;
54:   align-items: center;
55:   justify-content: flex-end;
56:   padding: 12px 16px;
57:   border-top: 1px solid var(--border-color);
58: }
````

## File: src/components/ui/Card/Card.tsx
````typescript
  1: import React from 'react';
  2: import { cn } from '../../../utils/cn';
  3: import styles from './Card.module.css';
  4: 
  5: // Card component types
  6: export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  7:   /**
  8:    * Whether the card is selected
  9:    */
 10:   selected?: boolean;
 11:   
 12:   /**
 13:    * Makes the card interactive (clickable)
 14:    */
 15:   interactive?: boolean;
 16: }
 17: 
 18: /**
 19:  * Card component container
 20:  */
 21: export const Card = React.forwardRef<HTMLDivElement, CardProps>(
 22:   ({ className, selected = false, interactive = false, ...props }, ref) => {
 23:     return (
 24:       <div
 25:         className={cn(
 26:           styles.card,
 27:           selected && styles.cardSelected,
 28:           interactive && styles.cardInteractive,
 29:           className
 30:         )}
 31:         ref={ref}
 32:         {...props}
 33:       />
 34:     );
 35:   }
 36: );
 37: 
 38: Card.displayName = 'Card';
 39: 
 40: // Card Header types
 41: export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
 42: 
 43: /**
 44:  * Card header section
 45:  */
 46: export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
 47:   ({ className, ...props }, ref) => {
 48:     return (
 49:       <div
 50:         className={cn(styles.cardHeader, className)}
 51:         ref={ref}
 52:         {...props}
 53:       />
 54:     );
 55:   }
 56: );
 57: 
 58: CardHeader.displayName = 'CardHeader';
 59: 
 60: // Card Title types
 61: export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
 62: 
 63: /**
 64:  * Card title element
 65:  */
 66: export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
 67:   ({ className, ...props }, ref) => {
 68:     return (
 69:       <h3
 70:         className={cn(styles.cardTitle, className)}
 71:         ref={ref}
 72:         {...props}
 73:       />
 74:     );
 75:   }
 76: );
 77: 
 78: CardTitle.displayName = 'CardTitle';
 79: 
 80: // Card Description types
 81: export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
 82: 
 83: /**
 84:  * Card description element
 85:  */
 86: export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
 87:   ({ className, ...props }, ref) => {
 88:     return (
 89:       <p
 90:         className={cn(styles.cardDescription, className)}
 91:         ref={ref}
 92:         {...props}
 93:       />
 94:     );
 95:   }
 96: );
 97: 
 98: CardDescription.displayName = 'CardDescription';
 99: 
100: // Card Content types
101: export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
102: 
103: /**
104:  * Card content section
105:  */
106: export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
107:   ({ className, ...props }, ref) => {
108:     return (
109:       <div
110:         className={cn(styles.cardContent, className)}
111:         ref={ref}
112:         {...props}
113:       />
114:     );
115:   }
116: );
117: 
118: CardContent.displayName = 'CardContent';
119: 
120: // Card Footer types
121: export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
122: 
123: /**
124:  * Card footer section
125:  */
126: export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
127:   ({ className, ...props }, ref) => {
128:     return (
129:       <div
130:         className={cn(styles.cardFooter, className)}
131:         ref={ref}
132:         {...props}
133:       />
134:     );
135:   }
136: );
137: 
138: CardFooter.displayName = 'CardFooter';
````

## File: src/components/ui/Card/index.ts
````typescript
1: export * from './Card';
````

## File: src/components/ui/Dialog/Dialog.module.css
````css
  1: .backdrop {
  2:   position: fixed;
  3:   top: 0;
  4:   left: 0;
  5:   right: 0;
  6:   bottom: 0;
  7:   background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  8:   display: flex;
  9:   justify-content: center;
 10:   align-items: center;
 11:   z-index: var(--z-index-modal, 50);
 12:   backdrop-filter: blur(4px); /* Background blur */
 13:   animation: fadeIn 0.15s ease-out;
 14: }
 15: 
 16: .dialog { /* Style the main dialog container */
 17:   background-color: var(--background-primary);
 18:   border: 1px solid var(--border-color); /* Added border */
 19:   border-radius: var(--radius-lg, 8px); /* Use variable or default */
 20:   box-shadow: var(--shadow-lg);
 21:   width: 90vw; /* Responsive width */
 22:   max-width: 500px; /* Default max-width (size 'md') */
 23:   max-height: 85vh;
 24:   display: flex; /* Use flexbox for layout */
 25:   flex-direction: column;
 26:   overflow: hidden; /* Prevent content overflow issues */
 27:   animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1); /* Optional: entry animation */
 28: }
 29: 
 30: /* Remove fixed positioning and transform, rely on backdrop flexbox for centering */
 31: /* .dialogContent { ... } */
 32: 
 33: /* Size variants for .dialog */
 34: .sm {
 35:   max-width: 400px;
 36: }
 37: 
 38: .md {
 39:   max-width: 500px; /* Consistent with above */
 40: }
 41: 
 42: .lg {
 43:   max-width: 800px;
 44: }
 45: 
 46: .header {
 47:   display: flex;
 48:   justify-content: space-between;
 49:   align-items: center;
 50:   padding: 16px 20px;
 51:   border-bottom: 1px solid var(--border-color);
 52:   flex-shrink: 0; /* Prevent header from shrinking */
 53: }
 54: 
 55: .title {
 56:   margin: 0;
 57:   font-size: 18px;
 58:   font-weight: 600;
 59:   color: var(--text-primary);
 60:   line-height: 1.4;
 61: }
 62: 
 63: /* Removed .closeButton - handled by Button component */
 64: 
 65: .description {
 66:   padding: 12px 20px 0;
 67:   font-size: 14px;
 68:   color: var(--text-secondary);
 69:   line-height: 1.5;
 70:   flex-shrink: 0; /* Prevent shrinking */
 71: }
 72: 
 73: .content {
 74:   padding: 20px;
 75:   overflow-y: auto; /* Allow content to scroll if needed */
 76:   flex-grow: 1; /* Allow content to take available space */
 77: }
 78: 
 79: .footer {
 80:   display: flex;
 81:   justify-content: center; /* Center buttons */
 82:   align-items: center;
 83:   gap: 12px;
 84:   padding: 16px 20px;
 85:   border-top: 1px solid var(--border-color);
 86:   background-color: var(--background-secondary);
 87:   flex-shrink: 0; /* Prevent footer from shrinking */
 88: }
 89: 
 90: /* Animations */
 91: @keyframes fadeIn {
 92:   from { opacity: 0; }
 93:   to { opacity: 1; }
 94: }
 95: 
 96: @keyframes slideIn {
 97:   from {
 98:     opacity: 0;
 99:     transform: translateY(10px) scale(0.98);
100:   }
101:   to {
102:     opacity: 1;
103:     transform: translateY(0) scale(1);
104:   }
105: }
````

## File: src/components/ui/Dialog/Dialog.tsx
````typescript
  1: import React, { useEffect, useRef } from 'react';
  2: import { X } from 'lucide-react';
  3: import { Button } from '../Button';
  4: import { cn } from '../../../utils/cn';
  5: import styles from './Dialog.module.css';
  6: 
  7: export interface DialogProps {
  8:   /**
  9:    * Whether the dialog is open
 10:    */
 11:   isOpen: boolean;
 12: 
 13:   /**
 14:    * Callback when the dialog should close
 15:    */
 16:   onClose: () => void;
 17: 
 18:   /**
 19:    * Dialog title
 20:    */
 21:   title: string;
 22: 
 23:   /**
 24:    * Optional description text below the title
 25:    */
 26:   description?: string;
 27: 
 28:   /**
 29:    * Dialog content
 30:    */
 31:   children: React.ReactNode;
 32: 
 33:   /**
 34:    * Optional footer content (usually action buttons)
 35:    */
 36:   footer?: React.ReactNode;
 37: 
 38:   /**
 39:    * Optional size variant
 40:    * @default 'md'
 41:    */
 42:   size?: 'sm' | 'md' | 'lg';
 43: 
 44:   /**
 45:    * Optional custom class name
 46:    */
 47:   className?: string;
 48: }
 49: 
 50: /**
 51:  * Dialog component for modal interactions
 52:  * Handles focus trapping, keyboard interactions, and animations
 53:  */
 54: export const Dialog: React.FC<DialogProps> = ({
 55:   isOpen,
 56:   onClose,
 57:   title,
 58:   description,
 59:   children,
 60:   footer,
 61:   size = 'md',
 62:   className,
 63: }) => {
 64:   const dialogRef = useRef<HTMLDivElement>(null);
 65:   const backdropRef = useRef<HTMLDivElement>(null); // Ref for the backdrop
 66: 
 67:   // Handle ESC key to close dialog
 68:   useEffect(() => {
 69:     const handleKeyDown = (e: KeyboardEvent) => {
 70:       if (e.key === 'Escape' && isOpen) {
 71:         onClose();
 72:       }
 73:     };
 74: 
 75:     window.addEventListener('keydown', handleKeyDown);
 76:     return () => window.removeEventListener('keydown', handleKeyDown);
 77:   }, [isOpen, onClose]);
 78: 
 79:   // Handle click outside (on backdrop) to close
 80:   useEffect(() => {
 81:     const handleClickOutside = (e: MouseEvent) => {
 82:       // Only close if clicking directly on the backdrop
 83:       if (backdropRef.current === e.target) {
 84:         onClose();
 85:       }
 86:     };
 87: 
 88:     if (isOpen) {
 89:       document.addEventListener('mousedown', handleClickOutside);
 90:       return () => document.removeEventListener('mousedown', handleClickOutside);
 91:     }
 92:   }, [isOpen, onClose]);
 93: 
 94:   // Prevent body scroll when dialog is open
 95:   useEffect(() => {
 96:     if (isOpen) {
 97:       document.body.style.overflow = 'hidden';
 98:       // Focus the dialog container or first focusable element on open
 99:       dialogRef.current?.focus();
100:       return () => {
101:         document.body.style.overflow = 'unset';
102:       };
103:     }
104:   }, [isOpen]);
105: 
106:   if (!isOpen) return null;
107: 
108:   return (
109:     <div
110:       ref={backdropRef} // Add ref to backdrop
111:       className={styles.backdrop}
112:       role="presentation" // Backdrop is presentational
113:     >
114:       <div
115:         ref={dialogRef}
116:         className={cn(
117:           styles.dialog, // Use .dialog for the main container
118:           styles[size],
119:           className
120:         )}
121:         role="dialog"
122:         aria-modal="true"
123:         aria-labelledby="dialog-title"
124:         tabIndex={-1} // Make the dialog focusable
125:       >
126:         <div className={styles.header}>
127:           <h2 id="dialog-title" className={styles.title}>{title}</h2>
128:           <Button
129:             variant="ghost"
130:             size="sm"
131:             iconOnly
132:             onClick={onClose}
133:             startIcon={<X size={16} />} // Correctly uses Button component
134:             title="Close dialog"
135:             aria-label="Close dialog" // Add aria-label
136:           />
137:         </div>
138: 
139:         {description && (
140:           <div className={styles.description}>
141:             {description}
142:           </div>
143:         )}
144: 
145:         <div className={styles.content}>
146:           {children}
147:         </div>
148: 
149:         {footer && (
150:           <div className={styles.footer}>
151:             {footer}
152:           </div>
153:         )}
154:       </div>
155:     </div>
156:   );
157: };
````

## File: src/components/ui/Dialog/index.ts
````typescript
1: export * from './Dialog';
````

## File: src/components/ui/Dropdown/Dropdown.module.css
````css
  1: .dropdown {
  2:   position: relative;
  3:   display: inline-flex;
  4:   vertical-align: middle;
  5: }
  6: 
  7: .button {
  8:   display: inline-flex;
  9:   align-items: center;
 10:   justify-content: center;
 11:   gap: 0.5rem;
 12:   padding: 0.5rem;
 13:   font-size: 0.875rem;
 14:   color: var(--icon-color);
 15:   border-radius: var(--radius);
 16:   cursor: pointer;
 17:   transition: all 0.15s ease;
 18:   background: transparent;
 19:   border: 1px solid var(--border-color);
 20:   height: 32px;
 21:   width: 32px;
 22: }
 23: 
 24: .button:hover:not(:disabled) {
 25:   background: var(--hover-color);
 26: }
 27: 
 28: .button:focus-visible {
 29:   outline: 2px solid var(--ring-color);
 30:   outline-offset: -1px;
 31: }
 32: 
 33: .button.active {
 34:   background: var(--hover-color);
 35: }
 36: 
 37: .buttonLabel {
 38:   flex: 1;
 39:   text-align: left;
 40:   overflow: hidden;
 41:   text-overflow: ellipsis;
 42:   white-space: nowrap;
 43: }
 44: 
 45: .chevron {
 46:   color: var(--text-secondary);
 47:   transition: transform 0.2s ease;
 48:   width: 16px;
 49:   height: 16px;
 50: }
 51: 
 52: .chevronOpen {
 53:   transform: rotate(180deg);
 54: }
 55: 
 56: .menu {
 57:   position: absolute;
 58:   top: 100%;
 59:   left: 0;
 60:   z-index: var(--z-index-dropdown);
 61:   min-width: 180px;
 62:   margin-top: 0.25rem;
 63:   padding: 0.375rem;
 64:   background: var(--background-primary);
 65:   border: 1px solid var(--border-color);
 66:   border-radius: var(--radius);
 67:   box-shadow: var(--shadow-md);
 68:   overflow-y: auto;
 69:   max-height: 300px;
 70:   animation: dropdownFadeIn 0.15s ease;
 71: }
 72: 
 73: .option {
 74:   display: flex;
 75:   align-items: center;
 76:   gap: 0.5rem;
 77:   padding: 0.5rem 0.75rem;
 78:   font-size: 0.875rem;
 79:   color: var(--text-primary);
 80:   cursor: pointer;
 81:   border-radius: var(--radius);
 82:   transition: background-color 0.1s ease;
 83:   user-select: none;
 84: }
 85: 
 86: .option:hover:not(.disabled) {
 87:   background: var(--hover-color);
 88: }
 89: 
 90: .option:focus {
 91:   outline: none;
 92:   background: var(--hover-color);
 93: }
 94: 
 95: .option.selected {
 96:   background: var(--background-selected);
 97:   color: var(--text-primary);
 98: }
 99: 
100: .option.disabled {
101:   opacity: 0.5;
102:   cursor: not-allowed;
103: }
104: 
105: .optionIcon {
106:   flex-shrink: 0;
107:   color: var(--icon-color);
108:   width: 16px;
109:   height: 16px;
110: }
111: 
112: .optionLabel {
113:   flex: 1;
114:   white-space: nowrap;
115:   overflow: hidden;
116:   text-overflow: ellipsis;
117: }
118: 
119: .checkmark {
120:   color: var(--accent-color);
121: }
122: 
123: /* Size variants */
124: .sm .button {
125:   height: 28px;
126:   width: 28px;
127:   padding: 0.25rem;
128: }
129: 
130: .lg .button {
131:   height: 36px;
132:   width: 36px;
133:   padding: 0.75rem;
134: }
135: 
136: @keyframes dropdownFadeIn {
137:   from {
138:     opacity: 0;
139:     transform: translateY(4px);
140:   }
141:   to {
142:     opacity: 1;
143:     transform: translateY(0);
144:   }
145: }
146: 
147: /* Dark mode enhancements */
148: :global(.dark-mode) .menu {
149:   background: var(--dropdown-menu-background);
150:   border-color: var(--border-color);
151: }
152: 
153: :global(.dark-mode) .option:hover:not(.disabled) {
154:   background: var(--dropdown-item-hover);
155: }
156: 
157: /* Improved focus styles for keyboard navigation */
158: .option:focus-visible {
159:   outline: none;
160:   box-shadow: 0 0 0 2px var(--background-primary), 0 0 0 4px var(--ring-color);
161: }
162: 
163: /* Add subtle divider between groups of options if needed */
164: .option + .option {
165:   border-top: 1px solid transparent;
166: }
167: 
168: .option:hover + .option {
169:   border-top-color: transparent;
170: }
````

## File: src/components/ui/Dropdown/Dropdown.tsx
````typescript
  1: import React, { useEffect, useRef, useState, useCallback } from 'react';
  2: import { ChevronDown } from 'lucide-react';
  3: import { cn } from '../../../utils/cn';
  4: import styles from './Dropdown.module.css';
  5: 
  6: export interface DropdownOption {
  7:   label: string;
  8:   value: string;
  9:   icon?: React.ReactNode;
 10:   disabled?: boolean;
 11: }
 12: 
 13: export interface DropdownProps {
 14:   /**
 15:    * Array of options to display in the dropdown
 16:    */
 17:   options: DropdownOption[];
 18:   
 19:   /**
 20:    * Currently selected value(s)
 21:    */
 22:   value?: string | string[];
 23:   
 24:   /**
 25:    * Callback when selection changes
 26:    */
 27:   onChange: (value: string | string[]) => void;
 28:   
 29:   /**
 30:    * Optional placeholder text when no option is selected
 31:    */
 32:   placeholder?: string;
 33:   
 34:   /**
 35:    * Whether the dropdown supports multiple selections
 36:    * @default false
 37:    */
 38:   multiple?: boolean;
 39:   
 40:   /**
 41:    * Optional title for the dropdown button (for accessibility)
 42:    */
 43:   title?: string;
 44:   
 45:   /**
 46:    * Optional custom trigger element
 47:    */
 48:   trigger?: React.ReactNode;
 49:   
 50:   /**
 51:    * Optional custom class name for the dropdown container
 52:    */
 53:   className?: string;
 54:   
 55:   /**
 56:    * Optional custom class name for the dropdown menu
 57:    */
 58:   menuClassName?: string;
 59:   
 60:   /**
 61:    * Optional size variant
 62:    * @default 'md'
 63:    */
 64:   size?: 'sm' | 'md' | 'lg';
 65:   
 66:   /**
 67:    * Optional style variant
 68:    * @default 'default'
 69:    */
 70:   variant?: string;
 71:   
 72:   /**
 73:    * Optional icon to display in the dropdown
 74:    */
 75:   icon?: React.ReactNode;
 76:   
 77:   /**
 78:    * Whether the dropdown is disabled
 79:    * @default false
 80:    */
 81:   disabled?: boolean;
 82:   
 83:   /**
 84:    * Optional maximum height for the dropdown menu in pixels
 85:    * @default 300
 86:    */
 87:   maxHeight?: number;
 88: }
 89: 
 90: export const Dropdown: React.FC<DropdownProps> = ({
 91:   options,
 92:   value,
 93:   onChange,
 94:   placeholder = 'Select option',
 95:   multiple = false,
 96:   title,
 97:   trigger,
 98:   className,
 99:   menuClassName,
100:   size = 'md',
101:   disabled = false,
102:   maxHeight = 300,
103: }) => {
104:   const [isOpen, setIsOpen] = useState(false);
105:   const dropdownRef = useRef<HTMLDivElement>(null);
106:   const menuRef = useRef<HTMLDivElement>(null);
107:   
108:   // Handle click outside to close dropdown
109:   useEffect(() => {
110:     const handleClickOutside = (event: MouseEvent) => {
111:       if (
112:         dropdownRef.current &&
113:         !dropdownRef.current.contains(event.target as Node)
114:       ) {
115:         setIsOpen(false);
116:       }
117:     };
118:     
119:     if (isOpen) {
120:       document.addEventListener('mousedown', handleClickOutside);
121:       return () => document.removeEventListener('mousedown', handleClickOutside);
122:     }
123:   }, [isOpen]);
124:   
125:   const handleSelect = useCallback((option: DropdownOption) => {
126:     if (!option.disabled) {
127:       onChange(option.value);
128:       setIsOpen(false);
129:     }
130:   }, [onChange]);
131: 
132:   const handleKeyDown = useCallback((event: KeyboardEvent) => {
133:     const optionElements = Array.from(dropdownRef.current?.querySelectorAll('[role="option"]') || []);
134:     const currentIndex = optionElements.findIndex(opt => opt === document.activeElement);
135: 
136:     switch (event.key) {
137:       case 'ArrowDown': {
138:         event.preventDefault();
139:         const nextIndex = currentIndex + 1 < optionElements.length ? currentIndex + 1 : 0;
140:         (optionElements[nextIndex] as HTMLElement).focus();
141:         break;
142:       }
143:       case 'ArrowUp': {
144:         event.preventDefault();
145:         const prevIndex = currentIndex > 0 ? currentIndex - 1 : optionElements.length - 1;
146:         (optionElements[prevIndex] as HTMLElement).focus();
147:         break;
148:       }
149:       case 'Enter':
150:       case 'Space': {
151:         event.preventDefault();
152:         const focusedOption = document.activeElement as HTMLDivElement;
153:         if (focusedOption?.dataset?.value) {
154:           const optionValue = focusedOption.dataset.value;
155:           const foundOption = options.find(opt => opt.value === optionValue);
156:           if (foundOption) {
157:             handleSelect(foundOption);
158:           }
159:         }
160:         break;
161:       }
162:       case 'Escape': {
163:         event.preventDefault();
164:         setIsOpen(false);
165:         break;
166:       }
167:     }
168:   }, [handleSelect, options]);
169: 
170:   useEffect(() => {
171:     if (isOpen) {
172:       document.addEventListener('keydown', handleKeyDown);
173:       return () => document.removeEventListener('keydown', handleKeyDown);
174:     }
175:   }, [isOpen, handleKeyDown]);
176:   
177:   const getSelectedLabel = () => {
178:     if (multiple) {
179:       const selectedCount = Array.isArray(value) ? value.length : 0;
180:       return selectedCount > 0
181:         ? `${selectedCount} selected`
182:         : placeholder;
183:     }
184:     
185:     const selectedOption = options.find(opt => opt.value === value);
186:     return selectedOption ? selectedOption.label : placeholder;
187:   };
188:   
189:   const isSelected = (optionValue: string) => {
190:     if (multiple) {
191:       return Array.isArray(value) && value.includes(optionValue);
192:     }
193:     return value === optionValue;
194:   };
195:   
196:   return (
197:     <div
198:       ref={dropdownRef}
199:       className={cn(
200:         styles.dropdown,
201:         styles[size],
202:         disabled && styles.disabled,
203:         className
204:       )}
205:     >
206:       {trigger ? (
207:         <div
208:           onClick={() => !disabled && setIsOpen(!isOpen)}
209:           className={cn(styles.trigger, isOpen && styles.active)}
210:         >
211:           {trigger}
212:         </div>
213:       ) : (
214:         <button
215:           type="button"
216:           className={cn(
217:             styles.button,
218:             isOpen && styles.active,
219:             size && styles[size],
220:             disabled && styles.disabled,
221:             className
222:           )}
223:           onClick={() => !disabled && setIsOpen(!isOpen)}
224:           aria-haspopup="listbox"
225:           aria-expanded={isOpen}
226:           disabled={disabled}
227:           title={title}
228:         >
229:           <span className={styles.buttonLabel}>{getSelectedLabel()}</span>
230:           <ChevronDown
231:             size={16}
232:             className={cn(styles.chevron, isOpen && styles.chevronOpen)}
233:           />
234:         </button>
235:       )}
236:       
237:       {isOpen && (
238:         <div
239:           ref={menuRef}
240:           className={cn(styles.menu, menuClassName)}
241:           style={{ maxHeight }}
242:           role="listbox"
243:           aria-multiselectable={multiple}
244:         >
245:           {options.map((option) => (
246:             <div
247:               key={option.value}
248:               className={cn(
249:                 styles.option,
250:                 isSelected(option.value) && styles.selected,
251:                 option.disabled && styles.disabled
252:               )}
253:               onClick={() => handleSelect(option)}
254:               role="option"
255:               aria-selected={isSelected(option.value)}
256:               tabIndex={0}
257:               data-value={option.value}
258:             >
259:               {option.icon && (
260:                 <span className={styles.optionIcon}>{option.icon}</span>
261:               )}
262:               <span className={styles.optionLabel}>{option.label}</span>
263:               {multiple && isSelected(option.value) && (
264:                 <span className={styles.checkmark}>✓</span>
265:               )}
266:             </div>
267:           ))}
268:         </div>
269:       )}
270:     </div>
271:   );
272: };
````

## File: src/components/ui/Dropdown/index.ts
````typescript
1: export { Dropdown } from './Dropdown';
2: export type { DropdownOption, DropdownProps } from './Dropdown';
````

## File: src/components/ui/DropdownMenu/DropdownAdapter.tsx
````typescript
 1: import React from 'react';
 2: import { FileText, FileCode, Code } from 'lucide-react';
 3: import { DropdownMenu, DropdownMenuProps } from './DropdownMenu';
 4: import styles from './DropdownMenu.module.css';
 5: 
 6: // Extend original props with renderHeader from DropdownMenuProps
 7: interface DropdownAdapterProps extends Omit<DropdownMenuProps, 'options' | 'onChange'> {
 8:   options: {
 9:     value: string;
10:     label: string;
11:     description?: string;
12:     icon?: string;
13:     disabled?: boolean;
14:   }[];
15:   value?: string | undefined;
16:   onChange: (value: string | string[]) => void;
17:   placeholder?: string;
18:   multiple?: boolean;
19:   title?: string;
20:   className?: string;
21:   menuClassName?: string;
22:   size?: 'sm' | 'md' | 'lg';
23:   disabled?: boolean;
24:   side?: 'top' | 'bottom' | 'auto';
25:   sideOffset?: number;
26:   align?: 'start' | 'center' | 'end';
27:   renderHeader?: () => React.ReactNode;
28: }
29: 
30: export const DropdownAdapter: React.FC<DropdownAdapterProps> = ({
31:   options,
32:   value,
33:   onChange,
34:   placeholder = 'Select option',
35:   title,
36:   className,
37:   menuClassName,
38:   size = 'md',
39:   disabled = false,
40:   side = 'auto',
41:   sideOffset = 5,
42:   align = 'start',
43:   renderHeader,
44: }) => {
45:   // Map option icons to Lucide components
46:   const getIconForOption = (option: { value: string; icon?: string }) => {
47:     switch (option.value) {
48:       case 'xml':
49:         return <Code size={16} className={styles.itemIcon} aria-hidden="true" />;
50:       case 'markdown':
51:         return <FileCode size={16} className={styles.itemIcon} aria-hidden="true" />;
52:       case 'plain':
53:         return <FileText size={16} className={styles.itemIcon} aria-hidden="true" />;
54:       default:
55:         return null;
56:     }
57:   };
58: 
59:   // Convert options to the format expected by the new DropdownMenu
60:   const dropdownOptions = options.map(option => ({
61:     value: option.value,
62:     label: option.label,
63:     icon: getIconForOption(option),
64:     disabled: option.disabled,
65:   }));
66: 
67:   // Handle onChange adaptation if needed (string vs string[])
68:   // Assuming DropdownMenu now only handles single string value based on its reverted state
69:   const handleDropdownChange = (val: string) => {
70:     onChange(val);
71:   };
72: 
73:   return (
74:     <DropdownMenu
75:       options={dropdownOptions}
76:       value={value as string}
77:       onChange={handleDropdownChange}
78:       placeholder={placeholder}
79:       title={title}
80:       className={className}
81:       menuClassName={menuClassName}
82:       size={size}
83:       disabled={disabled}
84:       align={align}
85:       side={side}
86:       sideOffset={sideOffset}
87:       renderHeader={renderHeader}
88:     />
89:   );
90: };
````

## File: src/components/ui/DropdownMenu/DropdownMenu.module.css
````css
  1: .dropdownMenu {
  2:   position: relative;
  3:   display: inline-block;
  4:   width: auto;
  5:   max-width: 100%;
  6: }
  7: 
  8: .dropdownTrigger {
  9:   display: flex;
 10:   align-items: center;
 11:   justify-content: space-between;
 12:   width: 100%;
 13:   padding: 0.35rem 0.75rem;
 14:   background-color: var(--background-primary);
 15:   border: 1px solid var(--border-color);
 16:   border-radius: var(--radius);
 17:   color: var(--text-primary);
 18:   font-size: 11px;
 19:   cursor: pointer;
 20:   transition: all 0.15s ease;
 21:   text-align: left;
 22:   min-height: 28px;
 23: }
 24: 
 25: .dropdownTrigger:hover:not(:disabled) {
 26:   background-color: var(--hover-color);
 27: }
 28: 
 29: .dropdownTrigger:focus {
 30:   outline: none;
 31:   box-shadow: 0 0 0 2px var(--focus-ring-color);
 32: }
 33: 
 34: .dropdownTrigger:disabled {
 35:   opacity: 0.5;
 36:   cursor: not-allowed;
 37: }
 38: 
 39: .dropdownTriggerOpen {
 40:   background-color: var(--hover-color);
 41: }
 42: 
 43: .dropdownContent {
 44:   position: fixed;
 45:   min-width: 12rem;
 46:   width: max-content;
 47:   max-width: 300px;
 48:   padding: 0.5rem;
 49:   background-color: var(--background-primary);
 50:   border: 1px solid var(--border-color);
 51:   border-radius: var(--radius);
 52:   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
 53:   z-index: 1000;
 54:   max-height: 80vh;
 55:   overflow-y: auto;
 56:   animation: dropdownIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
 57:   will-change: transform, opacity;
 58: }
 59: 
 60: .dropdownContent.closing {
 61:   animation: dropdownOut 0.15s ease-in forwards;
 62: }
 63: 
 64: .dropdownItem {
 65:   display: flex;
 66:   align-items: center;
 67:   gap: 0.5rem;
 68:   padding: 0.35rem 0.75rem;
 69:   color: var(--text-primary);
 70:   font-size: 11px;
 71:   cursor: pointer;
 72:   border-radius: 0.375rem;
 73:   transition: all 0.1s ease;
 74:   user-select: none;
 75: }
 76: 
 77: .dropdownItem:hover:not(.disabled) {
 78:   background-color: var(--hover-color);
 79: }
 80: 
 81: .itemIcon {
 82:   display: flex;
 83:   align-items: center;
 84:   justify-content: center;
 85:   width: 1rem;
 86:   height: 1rem;
 87:   opacity: 0.6;
 88:   flex-shrink: 0;
 89: }
 90: 
 91: .itemText {
 92:   flex: 1;
 93:   white-space: nowrap;
 94:   overflow: hidden;
 95:   text-overflow: ellipsis;
 96: }
 97: 
 98: .buttonLabel {
 99:   flex: 1;
100:   text-align: left;
101:   overflow: hidden;
102:   text-overflow: ellipsis;
103:   white-space: nowrap;
104:   margin-right: 0.5rem;
105:   max-width: 220px;
106: }
107: 
108: .accordionIcon {
109:   transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
110:   position: relative;
111:   color: var(--text-secondary);
112:   width: 16px;
113:   height: 16px;
114:   opacity: 0.6;
115: }
116: 
117: .accordionIcon path:last-child {
118:   transform-origin: center;
119:   transition: opacity 0.2s ease;
120: }
121: 
122: .accordionIcon.rotated {
123:   transform: rotate(180deg);
124: }
125: 
126: .accordionIcon.rotated path:last-child {
127:   opacity: 0;
128: }
129: 
130: .sm {
131:   height: 24px;
132:   font-size: 10px;
133:   padding: 0.2rem 0.5rem;
134: }
135: 
136: .md {
137:   height: 28px;
138:   font-size: 11px;
139:   padding: 0.25rem 0.75rem;
140: }
141: 
142: .lg {
143:   height: 32px;
144:   font-size: 12px;
145:   padding: 0.35rem 1rem;
146: }
147: 
148: @keyframes dropdownIn {
149:   from {
150:     opacity: 0;
151:     transform: translateY(-4px) scale(0.97);
152:   }
153:   to {
154:     opacity: 1;
155:     transform: translateY(0) scale(1);
156:   }
157: }
158: 
159: @keyframes dropdownOut {
160:   from {
161:     opacity: 1;
162:     transform: translateY(0) scale(1);
163:   }
164:   to {
165:     opacity: 0;
166:     transform: translateY(-4px) scale(0.97);
167:   }
168: }
169: 
170: .dropdownContent[data-side="top"] {
171:   transform-origin: bottom;
172:   animation: dropdownInTop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
173: }
174: 
175: .dropdownContent[data-side="top"].closing {
176:   animation: dropdownOutTop 0.15s ease-in forwards;
177: }
178: 
179: .dropdownContent[data-side="bottom"] {
180:   transform-origin: top;
181: }
182: 
183: @keyframes dropdownInTop {
184:   from {
185:     opacity: 0;
186:     transform: translateY(4px) scale(0.97);
187:   }
188:   to {
189:     opacity: 1;
190:     transform: translateY(0) scale(1);
191:   }
192: }
193: 
194: @keyframes dropdownOutTop {
195:   from {
196:     opacity: 1;
197:     transform: translateY(0) scale(1);
198:   }
199:   to {
200:     opacity: 0;
201:     transform: translateY(4px) scale(0.97);
202:   }
203: }
204: 
205: @media (max-width: 768px) {
206:   .dropdownContent {
207:     max-width: calc(100vw - 2rem);
208:   }
209: }
210: 
211: :global(.dark) .dropdownContent {
212:   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
213: }
214: 
215: :global(.dark) .dropdownItem:hover:not(.disabled) {
216:   background-color: var(--hover-color);
217: }
````

## File: src/components/ui/DropdownMenu/DropdownMenu.tsx
````typescript
  1: import React, { useState, useRef, useEffect, useCallback } from 'react';
  2: import { createPortal } from 'react-dom';
  3: import { Plus } from 'lucide-react';
  4: import styles from './DropdownMenu.module.css';
  5: 
  6: // Main types
  7: export interface DropdownMenuOption {
  8:   value: string;
  9:   label: string;
 10:   description?: string;
 11:   icon?: React.ReactNode;
 12:   disabled?: boolean;
 13: }
 14: 
 15: export interface DropdownMenuProps {
 16:   /**
 17:    * Options to display in the dropdown menu
 18:    */
 19:   options: DropdownMenuOption[];
 20:   
 21:   /**
 22:    * Currently selected value
 23:    */
 24:   value?: string;
 25:   
 26:   /**
 27:    * Callback when selection changes
 28:    */
 29:   onChange: (value: string) => void;
 30:   
 31:   /**
 32:    * Optional placeholder text when no option is selected
 33:    */
 34:   placeholder?: string;
 35:   
 36:   /**
 37:    * Optional title for the dropdown button (for accessibility)
 38:    */
 39:   title?: string;
 40:   
 41:   /**
 42:    * Optional custom class name for the dropdown container
 43:    */
 44:   className?: string;
 45:   
 46:   /**
 47:    * Optional custom class name for the dropdown menu
 48:    */
 49:   menuClassName?: string;
 50:   
 51:   /**
 52:    * Optional size variant
 53:    * @default 'md'
 54:    */
 55:   size?: 'sm' | 'md' | 'lg';
 56:   
 57:   /**
 58:    * Whether the dropdown is disabled
 59:    * @default false
 60:    */
 61:   disabled?: boolean;
 62:   
 63:   /**
 64:    * Custom alignment of the dropdown menu
 65:    * @default 'start'
 66:    */
 67:   align?: 'start' | 'center' | 'end';
 68:   
 69:   /**
 70:    * Side to render the dropdown menu
 71:    * @default 'auto'
 72:    */
 73:   side?: 'top' | 'right' | 'bottom' | 'left' | 'auto';
 74:   
 75:   /**
 76:    * Offset from the trigger element
 77:    * @default 5
 78:    */
 79:   sideOffset?: number;
 80:   
 81:   /** Optional function to render custom content at the top of the menu */
 82:   renderHeader?: () => React.ReactNode;
 83: }
 84: 
 85: export const DropdownMenu: React.FC<DropdownMenuProps> = ({
 86:   options,
 87:   value,
 88:   onChange,
 89:   placeholder = 'Select option',
 90:   title,
 91:   className,
 92:   menuClassName,
 93:   size = 'md',
 94:   disabled = false,
 95:   align = 'start',
 96:   side = 'auto',
 97:   sideOffset = 5,
 98:   renderHeader,
 99: }) => {
100:   // State
101:   const [isOpen, setIsOpen] = useState(false);
102:   const [position, setPosition] = useState<React.CSSProperties>({});
103:   const [dropdownSide, setDropdownSide] = useState<'top' | 'bottom'>('bottom');
104:   const [isClosing, setIsClosing] = useState(false);
105:   
106:   // Refs
107:   const triggerRef = useRef<HTMLButtonElement>(null);
108:   const menuRef = useRef<HTMLDivElement>(null);
109:   const firstItemRef = useRef<HTMLDivElement>(null);
110:   
111:   // Get the label of the selected option
112:   const getSelectedLabel = () => {
113:     const selectedOption = options.find(opt => opt.value === value);
114:     return selectedOption ? selectedOption.label : placeholder;
115:   };
116:   
117:   // Define closeDropdown
118:   const closeDropdown = useCallback(() => {
119:     if (!isOpen) return;
120:     
121:     setIsClosing(true);
122:     setTimeout(() => {
123:       setIsOpen(false);
124:       setIsClosing(false);
125:     }, 150);
126:   }, [isOpen]);
127:   
128:   // Determine the best side for the dropdown based on available space
129:   const determineDropdownSide = useCallback(() => {
130:     if (side !== 'auto') return side;
131:     
132:     if (!triggerRef.current) return 'bottom';
133:     
134:     const rect = triggerRef.current.getBoundingClientRect();
135:     const spaceBelow = window.innerHeight - rect.bottom;
136:     const spaceAbove = rect.top;
137:     const menuHeight = menuRef.current?.getBoundingClientRect().height || 200; // Default height estimate
138:     
139:     // If there's not enough space below and more space above, flip to top
140:     if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
141:       return 'top';
142:     }
143:     
144:     return 'bottom';
145:   }, [side]);
146:   
147:   // Calculate position of the dropdown menu
148:   const calculatePosition = useCallback(() => {
149:     if (!triggerRef.current || !menuRef.current) return {};
150:     
151:     const triggerRect = triggerRef.current.getBoundingClientRect();
152:     const menuRect = menuRef.current.getBoundingClientRect();
153:     
154:     const { top, left, bottom, right, width } = triggerRect;
155:     const { innerWidth, innerHeight } = window;
156:     const scrollY = window.scrollY || document.documentElement.scrollTop;
157:     const scrollX = window.scrollX || document.documentElement.scrollLeft;
158:     
159:     const positionStyles: React.CSSProperties = {};
160:     const determinedSide = determineDropdownSide();
161:     setDropdownSide(determinedSide === 'top' ? 'top' : 'bottom');
162:     
163:     // Vertical positioning
164:     if (determinedSide === 'top') {
165:       positionStyles.bottom = innerHeight - top + sideOffset;
166:     } else if (determinedSide === 'bottom') {
167:       positionStyles.top = bottom + scrollY + sideOffset;
168:     } else if (determinedSide === 'right') {
169:       positionStyles.left = right + scrollX + sideOffset;
170:     } else if (determinedSide === 'left') {
171:       positionStyles.right = innerWidth - left + scrollX + sideOffset;
172:     }
173:     
174:     // Horizontal alignment
175:     if ((determinedSide === 'top' || determinedSide === 'bottom') && !positionStyles.left && !positionStyles.right) {
176:       switch (align) {
177:         case 'start':
178:           positionStyles.left = left + scrollX;
179:           break;
180:         case 'center':
181:           positionStyles.left = left + scrollX + (width / 2) - (menuRect.width / 2);
182:           break;
183:         case 'end':
184:           positionStyles.left = left + scrollX + width - menuRect.width;
185:           break;
186:       }
187:     }
188:     
189:     // Ensure the menu stays within viewport bounds
190:     if (positionStyles.left !== undefined) {
191:       const leftPos = positionStyles.left as number;
192:       positionStyles.left = Math.max(sideOffset, Math.min(leftPos, innerWidth - menuRect.width - sideOffset));
193:     }
194:     
195:     if (positionStyles.top !== undefined) {
196:       const topPos = positionStyles.top as number;
197:       positionStyles.top = Math.max(sideOffset, Math.min(topPos, innerHeight - menuRect.height - sideOffset + scrollY));
198:     }
199:     
200:     return positionStyles;
201:   }, [align, determineDropdownSide, sideOffset]);
202:   
203:   // Update position when needed
204:   const updatePosition = useCallback(() => {
205:     if (isOpen) {
206:       setPosition(calculatePosition());
207:     }
208:   }, [isOpen, calculatePosition]);
209:   
210:   // Handle outside clicks
211:   useEffect(() => {
212:     const handleClickOutside = (event: MouseEvent) => {
213:       if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
214:           triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
215:         closeDropdown();
216:       }
217:     };
218:     
219:     if (isOpen) {
220:       document.addEventListener('mousedown', handleClickOutside);
221:       return () => document.removeEventListener('mousedown', handleClickOutside);
222:     }
223:   }, [isOpen, closeDropdown]);
224:   
225:   // Handle window resize and scroll
226:   useEffect(() => {
227:     if (isOpen) {
228:       window.addEventListener('resize', updatePosition);
229:       window.addEventListener('scroll', updatePosition, true);
230:       
231:       return () => {
232:         window.removeEventListener('resize', updatePosition);
233:         window.removeEventListener('scroll', updatePosition, true);
234:       };
235:     }
236:   }, [isOpen, updatePosition]);
237:   
238:   // Update position and focus first item when opening
239:   useEffect(() => {
240:     if (isOpen) {
241:       updatePosition();
242:       
243:       // Focus the first non-disabled item
244:       setTimeout(() => {
245:         firstItemRef.current?.focus();
246:       }, 10); 
247:     }
248:   }, [isOpen, updatePosition]);
249:   
250:   // Handle keyboard navigation on trigger button
251:   const handleKeyDown = (e: React.KeyboardEvent) => {
252:     if (disabled) return;
253:     
254:     switch (e.key) {
255:       case 'Enter':
256:       case ' ':
257:         e.preventDefault();
258:         setIsOpen(prev => !prev);
259:         break;
260:       case 'Escape':
261:         e.preventDefault();
262:         closeDropdown();
263:         break;
264:       case 'ArrowDown':
265:       case 'ArrowUp':
266:         if (!isOpen) {
267:           e.preventDefault();
268:           setIsOpen(true);
269:         } else {
270:             const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])');
271:             if (menuItems && menuItems.length > 0) {
272:                 e.preventDefault();
273:                 const targetIndex = e.key === 'ArrowUp' ? menuItems.length - 1 : 0;
274:                 (menuItems[targetIndex] as HTMLElement)?.focus();
275:             }
276:         }
277:         break;
278:     }
279:   };
280:   
281:   // Handle key navigation within the menu
282:   const handleMenuKeyDown = (e: React.KeyboardEvent, option: DropdownMenuOption) => {
283:     if (option.disabled) return;
284:     
285:     switch (e.key) {
286:       case 'Enter':
287:       case ' ':
288:         e.preventDefault();
289:         handleSelect(option);
290:         break;
291:       case 'Escape':
292:         e.preventDefault();
293:         closeDropdown();
294:         triggerRef.current?.focus();
295:         break;
296:       case 'ArrowDown':
297:         e.preventDefault();
298:         focusNextItem();
299:         break;
300:       case 'ArrowUp':
301:         e.preventDefault();
302:         focusPreviousItem();
303:         break;
304:       case 'Tab':
305:         closeDropdown();
306:         break;
307:     }
308:   };
309:   
310:   // Focus the next menu item
311:   const focusNextItem = () => {
312:     const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])');
313:     if (!menuItems || menuItems.length === 0) return;
314:     const activeElement = document.activeElement;
315:     const currentIndex = Array.from(menuItems).findIndex(item => item === activeElement);
316:     const nextIndex = currentIndex + 1 < menuItems.length ? currentIndex + 1 : 0;
317:     (menuItems[nextIndex] as HTMLElement)?.focus();
318:   };
319:   
320:   // Focus the previous menu item
321:   const focusPreviousItem = () => {
322:     const menuItems = menuRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])');
323:     if (!menuItems || menuItems.length === 0) return;
324:     const activeElement = document.activeElement;
325:     const currentIndex = Array.from(menuItems).findIndex(item => item === activeElement);
326:     const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
327:     (menuItems[prevIndex] as HTMLElement)?.focus();
328:   };
329:   
330:   // Handle option selection
331:   const handleSelect = (option: DropdownMenuOption) => {
332:     if (option.disabled) return;
333:     onChange(option.value);
334:     closeDropdown();
335:     triggerRef.current?.focus();
336:   };
337:   
338:   // Toggle the dropdown
339:   const toggleDropdown = () => {
340:     if (!disabled) {
341:       if (isOpen) {
342:         closeDropdown();
343:       } else {
344:         setIsOpen(true);
345:       }
346:     }
347:   };
348:   
349:   return (
350:     <div className={`${styles.dropdownMenu} ${className || ''}`}>
351:       <button
352:         ref={triggerRef}
353:         className={`${styles.dropdownTrigger} ${isOpen ? styles.dropdownTriggerOpen : ''} ${size ? styles[size] : ''}`}
354:         onClick={toggleDropdown}
355:         onKeyDown={handleKeyDown}
356:         aria-haspopup="listbox"
357:         aria-expanded={isOpen}
358:         aria-labelledby={title}
359:         disabled={disabled}
360:         type="button"
361:       >
362:         <span className={styles.buttonLabel}>{getSelectedLabel()}</span>
363:         <Plus 
364:           size={16} 
365:           className={`${styles.accordionIcon} ${isOpen ? styles.rotated : ''}`} 
366:           aria-hidden="true" 
367:         />
368:       </button>
369:       
370:       {(isOpen || isClosing) && createPortal(
371:         <div 
372:           ref={menuRef}
373:           className={`${styles.dropdownContent} ${isClosing ? styles.closing : ''} ${menuClassName || ''}`}
374:           style={{
375:             ...position,
376:             width: triggerRef.current ? `${triggerRef.current.offsetWidth}px` : undefined
377:           }}
378:           role="listbox"
379:           aria-orientation="vertical"
380:           data-side={dropdownSide}
381:         >
382:           {renderHeader && renderHeader()}
383: 
384:           {options.map((option, index) => {
385:             const isSelected = option.value === value;
386:             const isFirstNonDisabled = !option.disabled && options.findIndex(o => !o.disabled) === index;
387:             
388:             return (
389:               <div
390:                 key={option.value}
391:                 ref={isFirstNonDisabled ? firstItemRef : undefined}
392:                 className={`${styles.dropdownItem} ${option.disabled ? styles.disabled : ''} ${isSelected ? styles.selected : ''}`}
393:                 onClick={() => handleSelect(option)}
394:                 onKeyDown={(e) => handleMenuKeyDown(e, option)}
395:                 role="option"
396:                 aria-selected={isSelected}
397:                 aria-disabled={option.disabled}
398:                 tabIndex={option.disabled ? -1 : 0}
399:                 data-value={option.value}
400:               >
401:                 {option.icon && (
402:                   <span className={styles.itemIcon}>{option.icon}</span>
403:                 )}
404:                 <span className={styles.itemText}>{option.label}</span>
405:               </div>
406:             );
407:           })}
408:         </div>,
409:         document.body
410:       )}
411:     </div>
412:   );
413: };
````

## File: src/components/ui/DropdownMenu/index.ts
````typescript
1: export { DropdownMenu } from "./DropdownMenu";
2: export type { DropdownMenuProps, DropdownMenuOption } from "./DropdownMenu";
3: export { DropdownAdapter } from "./DropdownAdapter";
````

## File: src/components/ui/DropdownMenu/TemplateDropdownAdapter.tsx
````typescript
  1: import React from 'react';
  2: import { 
  3:   BookText, 
  4:   FileText, 
  5:   BarChart, 
  6:   TestTube, 
  7:   CheckCircle 
  8: } from 'lucide-react';
  9: import { DropdownMenu } from './DropdownMenu';
 10: import { TemplateCategory } from '../../../constants/promptTemplates';
 11: import styles from './DropdownMenu.module.css';
 12: 
 13: // Match the interface needed for the templateSelector
 14: interface TemplateDropdownAdapterProps {
 15:   options: {
 16:     value: string;
 17:     label: string;
 18:     description?: string;
 19:     category: TemplateCategory;
 20:     icon?: string;
 21:     disabled?: boolean;
 22:   }[];
 23:   value?: string;
 24:   onChange: (value: string) => void;
 25:   placeholder?: string;
 26:   title?: string;
 27:   className?: string;
 28:   menuClassName?: string;
 29:   size?: 'sm' | 'md' | 'lg';
 30:   disabled?: boolean;
 31:   align?: 'start' | 'center' | 'end';
 32:   side?: 'top' | 'right' | 'bottom' | 'left' | 'auto';
 33:   sideOffset?: number;
 34: }
 35: 
 36: export const TemplateDropdownAdapter: React.FC<TemplateDropdownAdapterProps> = ({
 37:   options,
 38:   value,
 39:   onChange,
 40:   placeholder = 'Select template',
 41:   title,
 42:   className,
 43:   menuClassName,
 44:   size = 'md',
 45:   disabled = false,
 46:   align = 'start',
 47:   side = 'bottom',
 48:   sideOffset = 5,
 49: }) => {
 50:   // Map category to Lucide component icons with enhanced visibility
 51:   const getIconForCategory = (category: TemplateCategory) => {
 52:     const iconProps = {
 53:       size: 18,
 54:       className: `${styles.itemIcon} ${styles.categoryIcon}`,
 55:       strokeWidth: 2,
 56:       'aria-hidden': true,
 57:     };
 58:     
 59:     switch (category) {
 60:       case 'Code Review':
 61:         return <BookText {...iconProps} />;
 62:       case 'Documentation Generation':
 63:         return <FileText {...iconProps} />;
 64:       case 'Analysis and Improvement':
 65:         return <BarChart {...iconProps} />;
 66:       case 'Testing':
 67:         return <TestTube {...iconProps} />;
 68:       case 'Code Quality':
 69:         return <CheckCircle {...iconProps} />;
 70:       default:
 71:         return null;
 72:     }
 73:   };
 74: 
 75:   // Convert options to the format expected by DropdownMenu
 76:   const dropdownOptions = options.map(option => ({
 77:     value: option.value,
 78:     label: option.label,
 79:     description: option.description,
 80:     icon: getIconForCategory(option.category),
 81:     disabled: option.disabled,
 82:   }));
 83: 
 84:   return (
 85:     <DropdownMenu
 86:       options={dropdownOptions}
 87:       value={value}
 88:       onChange={onChange}
 89:       placeholder={placeholder}
 90:       title={title}
 91:       className={`${styles.templateDropdown} ${className || ''}`}
 92:       menuClassName={`${styles.templateDropdownMenu} ${menuClassName || ''}`}
 93:       size={size}
 94:       disabled={disabled}
 95:       align={align}
 96:       side={side}
 97:       sideOffset={sideOffset}
 98:     />
 99:   );
100: };
````

## File: src/components/ui/Input/index.ts
````typescript
1: export * from './Input';
````

## File: src/components/ui/Input/Input.module.css
````css
 1: .inputWrapper {
 2:   position: relative;
 3:   display: flex;
 4:   width: 100%;
 5: }
 6: 
 7: .input {
 8:   width: 100%;
 9:   height: var(--button-height-md);
10:   padding: 0 12px;
11:   border: 1px solid var(--border-color);
12:   border-radius: var(--radius);
13:   font-family: inherit;
14:   font-size: 14px;
15:   outline: none;
16:   background-color: var(--background-primary);
17:   color: var(--text-primary);
18:   transition: all 0.2s ease;
19: }
20: 
21: .input:hover:not(:disabled) {
22:   border-color: var(--text-secondary);
23: }
24: 
25: .input:focus {
26:   outline: none;
27:   border-color: var(--ring-color);
28:   box-shadow: 0 0 0 2px var(--background-primary),
29:               0 0 0 4px var(--ring-color);
30: }
31: 
32: .input:disabled {
33:   opacity: 0.5;
34:   cursor: not-allowed;
35:   background-color: var(--background-secondary);
36: }
37: 
38: .withStartIcon {
39:   padding-left: 36px;
40: }
41: 
42: .withEndIcon {
43:   padding-right: 36px;
44: }
45: 
46: .startIcon,
47: .endIcon {
48:   position: absolute;
49:   top: 50%;
50:   transform: translateY(-50%);
51:   color: var(--text-secondary);
52:   display: flex;
53:   align-items: center;
54:   justify-content: center;
55:   pointer-events: none;
56:   width: 36px;
57: }
58: 
59: .startIcon {
60:   left: 0;
61: }
62: 
63: .endIcon {
64:   right: 0;
65: }
66: 
67: .inputError {
68:   border-color: var(--error-color);
69: }
70: 
71: .inputError:focus {
72:   border-color: var(--error-color);
73:   box-shadow: 0 0 0 2px var(--background-primary),
74:               0 0 0 4px var(--error-color);
75: }
76: 
77: /* Search input specific styles */
78: .searchInput {
79:   padding-left: 36px;
80:   background-color: var(--background-secondary);
81:   border-color: transparent;
82: }
83: 
84: .searchInput:focus {
85:   background-color: var(--background-primary);
86:   border-color: var(--ring-color);
87: }
````

## File: src/components/ui/Input/Input.tsx
````typescript
 1: import React from 'react';
 2: import { cn } from '../../../utils/cn';
 3: import styles from './Input.module.css';
 4: 
 5: export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
 6:   /**
 7:    * Shows error styling
 8:    */
 9:   error?: boolean;
10:   
11:   /**
12:    * Icon to display at the start of the input
13:    */
14:   startIcon?: React.ReactNode;
15:   
16:   /**
17:    * Icon to display at the end of the input
18:    */
19:   endIcon?: React.ReactNode;
20:   
21:   /**
22:    * Applies search input styling
23:    */
24:   isSearchInput?: boolean;
25: }
26: 
27: /**
28:  * Input component for text entry
29:  */
30: export const Input = React.forwardRef<HTMLInputElement, InputProps>(
31:   ({ className, error, startIcon, endIcon, isSearchInput, ...props }, ref) => {
32:     return (
33:       <div className={styles.inputWrapper}>
34:         {startIcon && <div className={styles.startIcon}>{startIcon}</div>}
35:         <input
36:           className={cn(
37:             styles.input,
38:             startIcon ? styles.withStartIcon : null,
39:             endIcon ? styles.withEndIcon : null,
40:             isSearchInput ? styles.searchInput : null,
41:             error ? styles.inputError : null,
42:             className
43:           )}
44:           ref={ref}
45:           {...props}
46:         />
47:         {endIcon && <div className={styles.endIcon}>{endIcon}</div>}
48:       </div>
49:     );
50:   }
51: );
52: 
53: Input.displayName = 'Input';
````

## File: src/components/ui/StatusAlert/index.ts
````typescript
1: export { default as StatusAlert } from './StatusAlert';
2: export * from './StatusAlert';
````

## File: src/components/ui/StatusAlert/StatusAlert.module.css
````css
 1: .alertContainer {
 2:     position: relative;
 3:     width: 100%;
 4:     padding: 0.5rem 1rem;
 5:     transition: opacity 200ms ease-out, transform 200ms ease-out;
 6:     display: flex;
 7:     align-items: center;
 8:     background-color: var(--background-secondary);
 9:     border-bottom: 1px solid var(--border);
10:     margin-bottom: 0;
11:     height: 36px;
12:     overflow: hidden;
13:   }
14:   
15:   .enter {
16:     opacity: 1;
17:     transform: translateY(0);
18:   }
19:   
20:   .exit {
21:     opacity: 0;
22:     transform: translateY(-5px);
23:   }
24:   
25:   .alertContent {
26:     display: flex;
27:     gap: 0.5rem;
28:     width: 100%;
29:     align-items: center;
30:   }
31:   
32:   .messageContent {
33:     flex: 1;
34:     display: flex;
35:     align-items: center;
36:     gap: 0.5rem;
37:     font-size: 14px;
38:     font-family: monospace;
39:   }
40:   
41:   .terminalPrefix {
42:     font-family: 'Courier New', Courier, monospace;
43:     color: var(--text-secondary);
44:     margin-right: 0.25rem;
45:   }
46:   
47:   .alertTitle {
48:     font-weight: 500;
49:     margin: 0;
50:     font-size: 12px;
51:   }
52:   
53:   .alertDescription {
54:     font-size: 12px;
55:     color: var(--text-secondary);
56:     margin: 0;
57:   }
58:   
59:   /* Status-specific styles */
60:   .processing {
61:     background-color: var(--background-secondary);
62:   }
63:   
64:   .complete {
65:     background-color: var(--background-secondary);
66:   }
67:   
68:   .error {
69:     background-color: var(--background-secondary);
70:   }
71:   
72:   .closeButton {
73:     background: transparent;
74:     border: none;
75:     cursor: pointer;
76:     color: var(--text-secondary);
77:     padding: 0;
78:     margin-left: auto;
79:     display: flex;
80:     align-items: center;
81:     justify-content: center;
82:     height: 16px;
83:     width: 16px;
84:   }
85:   
86:   .closeButton:hover {
87:     color: var(--text-primary);
88:   }
````

## File: src/components/ui/StatusAlert/StatusAlert.tsx
````typescript
 1: import React, { useState, useEffect, useCallback } from 'react';
 2: import { X } from 'lucide-react';
 3: import styles from './StatusAlert.module.css';
 4: 
 5: // Core structure with TypeScript props
 6: interface StatusAlertProps {
 7:     status: "idle" | "processing" | "complete" | "error";
 8:     message: string;
 9:     autoDismissTime?: number; // in milliseconds, default for success/complete
10:     onClose?: () => void;     // callback when dismissed
11:   }
12:   
13:   const StatusAlert: React.FC<StatusAlertProps> = ({
14:     status,
15:     message,
16:     autoDismissTime = 5000, // longer default than current 3000ms
17:     onClose
18:   }) => {
19:     // Visual state management
20:     const [isVisible, setIsVisible] = useState(true);
21:     const [isExiting, setIsExiting] = useState(false);
22:     
23:     // Map status to classes
24:     const statusClasses = {
25:       idle: styles.idle,
26:       processing: styles.processing,
27:       complete: styles.success,
28:       error: styles.error
29:     };
30:     
31:     // Define handleExit before it's used in useEffect
32:     const handleExit = useCallback(() => {
33:       setIsExiting(true);
34:       setTimeout(() => {
35:         setIsVisible(false);
36:         if (onClose) onClose();
37:       }, 200); // Match transition duration
38:     }, [onClose]);
39:     
40:     // Handle status changes
41:     useEffect(() => {
42:       if (status === "complete" && autoDismissTime) {
43:         const timer = setTimeout(() => {
44:           handleExit();
45:         }, autoDismissTime);
46:         
47:         return () => clearTimeout(timer);
48:       }
49:     }, [status, message, autoDismissTime, handleExit]);
50:     
51:     if (!isVisible && status === "idle") return null;
52:     
53:     return (
54:       <div
55:         className={`${styles.alertContainer} ${isExiting ? styles.exit : styles.enter} ${statusClasses[status]}`}
56:         role="alert"
57:       >
58:         <div className={styles.alertContent}>
59:           <div className={styles.messageContent}>
60:             <span className={styles.terminalPrefix}>&gt;_</span>
61:             <div className={styles.alertDescription}>{message}</div>
62:           </div>
63:           {status === "error" && (
64:             <button 
65:               className={styles.closeButton} 
66:               onClick={handleExit}
67:               aria-label="Close"
68:             >
69:               <X size={14} />
70:             </button>
71:           )}
72:         </div>
73:       </div>
74:     );
75:   };
76: 
77: export default StatusAlert;
````

## File: src/components/ui/Switch/index.ts
````typescript
1: export * from './Switch';
````

## File: src/components/ui/Switch/Switch.module.css
````css
 1: .switchContainer {
 2:   display: inline-flex;
 3:   align-items: center;
 4: }
 5: 
 6: .switchLabel {
 7:   margin-right: 8px;
 8:   font-size: 14px;
 9:   color: var(--text-primary);
10: }
11: 
12: .switch {
13:   position: relative;
14:   display: inline-flex;
15:   width: 36px;
16:   height: 20px;
17:   border-radius: var(--radius-full);
18:   background-color: var(--text-disabled);
19:   transition: background-color 0.2s ease;
20:   cursor: pointer;
21: }
22: 
23: .switchChecked {
24:   background-color: var(--accent-color);
25: }
26: 
27: .switch:focus-visible {
28:   outline: none;
29:   box-shadow: 0 0 0 2px var(--background-primary),
30:               0 0 0 4px var(--ring-color);
31: }
32: 
33: .switchDisabled {
34:   opacity: 0.5;
35:   cursor: not-allowed;
36: }
37: 
38: .switchThumb {
39:   position: absolute;
40:   top: 3px;
41:   left: 3px;
42:   width: 14px;
43:   height: 14px;
44:   border-radius: var(--radius-full);
45:   background-color: var(--background-primary);
46:   box-shadow: var(--shadow-sm);
47:   transition: transform 0.2s ease;
48: }
49: 
50: .switchChecked .switchThumb {
51:   transform: translateX(16px);
52: }
53: 
54: /* Small size variant */
55: .switchSm {
56:   width: 28px;
57:   height: 16px;
58: }
59: 
60: .switchSm .switchThumb {
61:   width: 10px;
62:   height: 10px;
63:   top: 3px;
64:   left: 3px;
65: }
66: 
67: .switchSm.switchChecked .switchThumb {
68:   transform: translateX(12px);
69: }
70: 
71: /* Large size variant */
72: .switchLg {
73:   width: 44px;
74:   height: 24px;
75: }
76: 
77: .switchLg .switchThumb {
78:   width: 18px;
79:   height: 18px;
80:   top: 3px;
81:   left: 3px;
82: }
83: 
84: .switchLg.switchChecked .switchThumb {
85:   transform: translateX(20px);
86: }
````

## File: src/components/ui/Switch/Switch.tsx
````typescript
 1: import React from 'react';
 2: import { cn } from '../../../utils/cn';
 3: import styles from './Switch.module.css';
 4: 
 5: export interface SwitchProps {
 6:   /**
 7:    * Whether the switch is checked
 8:    */
 9:   checked: boolean;
10:   
11:   /**
12:    * Function called when the switch is toggled
13:    */
14:   onChange: (checked?: boolean) => void;
15:   
16:   /**
17:    * Optional label to display beside the switch
18:    */
19:   label?: string;
20:   
21:   /**
22:    * Disables the switch
23:    */
24:   disabled?: boolean;
25:   
26:   /**
27:    * Optional additional className
28:    */
29:   className?: string;
30:   
31:   /**
32:    * Optional ID for the switch
33:    */
34:   id?: string;
35: 
36:   /**
37:    * Optional title tooltip for the switch
38:    */
39:   title?: string;
40:   
41:   /**
42:    * Optional size for the switch (sm, md, lg)
43:    */
44:   size?: 'sm' | 'md' | 'lg';
45: }
46: 
47: /**
48:  * Switch component for toggling between two states
49:  */
50: export const Switch: React.FC<SwitchProps> = ({
51:   checked,
52:   onChange,
53:   label,
54:   disabled = false,
55:   className,
56:   id,
57:   size = 'md',
58:   title
59: }) => {
60:   const switchId = id || `switch-${Math.random().toString(36).substring(2, 9)}`;
61: 
62:   return (
63:     <div className={cn(styles.switchContainer, className)}>
64:       {label && (
65:         <label htmlFor={switchId} className={styles.switchLabel}>
66:           {label}
67:         </label>
68:       )}
69:       <div
70:         className={cn(
71:           styles.switch,
72:           checked && styles.switchChecked,
73:           disabled && styles.switchDisabled,
74:           size === 'sm' && styles.switchSm,
75:           size === 'lg' && styles.switchLg
76:         )}
77:         role="switch"
78:         aria-checked={checked}
79:         aria-disabled={disabled}
80:         tabIndex={disabled ? -1 : 0}
81:         onClick={disabled ? undefined : () => onChange(!checked)}
82:         onKeyDown={(e) => {
83:           if (disabled) return;
84:           if (e.key === 'Enter' || e.key === ' ') {
85:             e.preventDefault();
86:             onChange(!checked);
87:           }
88:         }}
89:         id={switchId}
90:         title={title}
91:       >
92:         <div className={styles.switchThumb} />
93:       </div>
94:     </div>
95:   );
96: };
97: 
98: Switch.displayName = 'Switch';
````

## File: src/components/ui/Tabs/index.ts
````typescript
1: export { Tabs } from './Tabs';
2: export { TabsList } from './TabsList';
3: export { TabsTrigger } from './TabsTrigger';
4: export { TabsContent } from './TabsContent';
5: export { useTabs } from './useTabs';
6: export type { TabsContextProps } from './useTabs';
````

## File: src/components/ui/Tabs/Tabs.module.css
````css
  1: /* Tabs component styling */
  2: .tabs {
  3:   width: 100%;
  4:   position: relative; /* Required for absolute positioning of children */
  5: }
  6: 
  7: .tabsList {
  8:   display: flex;
  9:   align-items: center;
 10:   border-bottom: 1px solid var(--border-color);
 11:   margin-bottom: 0; /* Reduced margin for more compact layout */
 12:   background-color: var(--background-secondary);
 13:   border-top-left-radius: var(--radius);
 14:   border-top-right-radius: var(--radius);
 15:   padding: 4px 4px 0; /* Padding for tabs container */
 16:   gap: 2px; /* Small gap between tabs */
 17: }
 18: 
 19: .tabsTrigger {
 20:   padding: 6px 12px;
 21:   background-color: var(--background-tertiary, rgba(0,0,0,0.05));
 22:   color: var(--text-secondary);
 23:   cursor: pointer;
 24:   font-size: 13px;
 25:   font-weight: 500;
 26:   transition: all 0.15s ease;
 27:   white-space: nowrap;
 28:   border-radius: 4px 4px 0 0;
 29:   border: 1px solid transparent;
 30:   border-bottom: none;
 31:   position: relative;
 32:   display: flex;
 33:   align-items: center;
 34:   justify-content: center;
 35:   user-select: none;
 36: }
 37: 
 38: .tabsTrigger:hover:not(:disabled) {
 39:   color: var(--text-primary);
 40:   background-color: var(--background-hover, rgba(0,0,0,0.03));
 41: }
 42: 
 43: .tabsTrigger.active {
 44:   color: var(--text-primary);
 45:   background-color: var(--background-primary);
 46:   border-color: var(--border-color);
 47:   border-bottom-color: var(--background-primary);
 48:   font-weight: 600;
 49:   z-index: 2; /* Ensure active tab is on top */
 50: }
 51: 
 52: .tabsTrigger:focus-visible {
 53:   outline: 2px solid var(--accent-color);
 54:   outline-offset: -1px;
 55:   z-index: 3;
 56: }
 57: 
 58: .tabsTrigger:disabled {
 59:   color: var(--text-disabled);
 60:   cursor: not-allowed;
 61:   opacity: 0.6;
 62: }
 63: 
 64: /* Tab content container - establishes the positioning context */
 65: .tabsContentWrapper {
 66:   position: relative;
 67:   width: 100%;
 68:   border: 1px solid var(--border-color);
 69:   border-top: none;
 70:   background-color: var(--background-primary);
 71:   border-bottom-left-radius: var(--radius);
 72:   border-bottom-right-radius: var(--radius);
 73:   overflow: hidden; /* Prevent content from bleeding out */
 74: }
 75: 
 76: /* Individual tab content panel */
 77: .tabsContent {
 78:   padding: 12px; /* Slightly reduced padding */
 79:   outline: none;
 80:   transition: opacity 150ms ease-in-out;
 81: }
 82: 
 83: /* Styles for active/inactive tab content */
 84: .activeContent {
 85:   opacity: 1;
 86:   z-index: 2;
 87: }
 88: 
 89: .inactiveContent {
 90:   opacity: 0;
 91:   z-index: 1;
 92:   /* Position absolute was causing issues - we'll fix it differently */
 93:   display: none;
 94:   pointer-events: none;
 95: }
 96: 
 97: /* Style for subheadings within merged tabs */
 98: .subHeading {
 99:   font-size: 13px;
100:   font-weight: 600;
101:   color: var(--text-primary);
102:   margin-top: 8px;
103:   margin-bottom: 12px;
104:   padding-bottom: 6px;
105:   border-bottom: 1px dashed var(--border-color-subtle, rgba(128,128,128,0.3));
106: }
107: 
108: /* Style for divider within merged tabs */
109: .divider {
110:   border: none;
111:   border-top: 1px solid var(--border-color);
112:   margin: 16px 0;
113: }
114: 
115: /* Add support for icons in tabs */
116: .tabIcon {
117:   margin-right: 6px;
118:   display: flex;
119:   align-items: center;
120: }
````

## File: src/components/ui/Tabs/Tabs.tsx
````typescript
 1: import React, { useState, ReactNode } from 'react';
 2: import { TabsContext } from './useTabs';
 3: import styles from './Tabs.module.css';
 4: 
 5: interface TabsProps {
 6:   defaultValue: string;
 7:   children: ReactNode;
 8:   className?: string;
 9: }
10: 
11: // Main Tabs component managing state
12: const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className }) => {
13:   const [activeTab, setActiveTab] = useState<string>(defaultValue);
14: 
15:   return (
16:     <TabsContext.Provider value={{ activeTab, setActiveTab }}>
17:       <div className={`${styles.tabs} ${className || ''}`}>
18:         {children}
19:       </div>
20:     </TabsContext.Provider>
21:   );
22: };
23: 
24: // Add display name for better debugging and component type detection
25: Tabs.displayName = 'Tabs';
26: 
27: export { Tabs };
````

## File: src/components/ui/Tabs/TabsContent.tsx
````typescript
 1: import React, { ReactNode } from 'react';
 2: import { useTabs } from './useTabs';
 3: import styles from './Tabs.module.css';
 4: 
 5: interface TabsContentProps {
 6:   value: string;
 7:   children: ReactNode;
 8:   className?: string;
 9: }
10: 
11: // Content panel for each tab
12: const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
13:   const { activeTab } = useTabs(); // Get state from context
14:   const isActive = activeTab === value;
15:   
16:   // Use display:none via CSS classes instead of absolute positioning
17:   // This avoids layout issues when tabs have different heights
18: 
19:   return (
20:     <div
21:       id={`tab-content-${value}`} // Linked from trigger
22:       role="tabpanel"
23:       aria-labelledby={`tab-trigger-${value}`} 
24:       aria-hidden={!isActive}
25:       tabIndex={isActive ? 0 : -1}
26:       className={`${styles.tabsContent} ${isActive ? styles.activeContent : styles.inactiveContent} ${className || ''}`}
27:     >
28:       {children}
29:     </div>
30:   );
31: };
32: 
33: // Add display name for better debugging and component type detection
34: TabsContent.displayName = 'TabsContent';
35: export { TabsContent };
````

## File: src/components/ui/Tabs/TabsList.tsx
````typescript
 1: import React, { ReactNode, Children, useRef, useEffect, KeyboardEvent } from 'react';
 2: import { useTabs } from './useTabs';
 3: import styles from './Tabs.module.css';
 4: 
 5: interface TabsListProps {
 6:   children: ReactNode;
 7:   className?: string;
 8:   'aria-label'?: string;
 9: }
10: 
11: // Container for the tab triggers
12: const TabsList: React.FC<TabsListProps> = ({ children, className, 'aria-label': ariaLabel }) => {
13:   const { activeTab, setActiveTab } = useTabs();
14:   const triggersRef = useRef<(HTMLButtonElement | null)[]>([]);
15: 
16:   const childrenArray = Children.toArray(children);
17: 
18:   // Ensure triggersRef array is the correct size
19:   useEffect(() => {
20:     triggersRef.current = triggersRef.current.slice(0, childrenArray.length);
21:   }, [childrenArray.length]);
22: 
23:   const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
24:     const currentIndex = childrenArray.findIndex(
25:       (child) => React.isValidElement(child) && child.props.value === activeTab
26:     );
27: 
28:     if (currentIndex === -1) return;
29: 
30:     let nextIndex = -1;
31: 
32:     if (event.key === 'ArrowRight') {
33:       nextIndex = (currentIndex + 1) % childrenArray.length;
34:     } else if (event.key === 'ArrowLeft') {
35:       nextIndex = (currentIndex - 1 + childrenArray.length) % childrenArray.length;
36:     } else if (event.key === 'Home') {
37:       nextIndex = 0;
38:     } else if (event.key === 'End') {
39:       nextIndex = childrenArray.length - 1;
40:     }
41: 
42:     if (nextIndex !== -1) {
43:       event.preventDefault();
44:       const nextTrigger = triggersRef.current[nextIndex];
45:       if (nextTrigger) {
46:         nextTrigger.focus();
47:         // Optionally activate on arrow navigation (common pattern)
48:         const nextChild = childrenArray[nextIndex];
49:         if (React.isValidElement(nextChild)) {
50:           setActiveTab(nextChild.props.value);
51:         }
52:       }
53:     }
54:   };
55: 
56:   return (
57:     <div
58:       className={`${styles.tabsList} ${className || ''}`}
59:       role="tablist"
60:       aria-label={ariaLabel}
61:       onKeyDown={handleKeyDown}
62:     >
63:       {Children.map(childrenArray, (child, index) => {
64:         if (React.isValidElement(child)) {
65:           return React.cloneElement(child as React.ReactElement<any>, {
66:             ref: (el: HTMLButtonElement | null) => triggersRef.current[index] = el,
67:           });
68:         }
69:         return child;
70:       })}
71:     </div>
72:   );
73: };
74: 
75: // Add display name for better debugging and component type detection
76: TabsList.displayName = 'TabsList';
77: export { TabsList };
````

## File: src/components/ui/Tabs/TabsTrigger.tsx
````typescript
 1: import React, { ReactNode, forwardRef } from 'react';
 2: import { useTabs } from './useTabs';
 3: import styles from './Tabs.module.css';
 4: 
 5: interface TabsTriggerProps {
 6:   value: string;
 7:   children: ReactNode;
 8:   className?: string;
 9:   disabled?: boolean;
10:   icon?: ReactNode; // Add support for optional icon
11: }
12: 
13: // Clickable trigger for each tab
14: const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
15:   ({ value, children, className, disabled, icon }, ref) => {
16:     const { activeTab, setActiveTab } = useTabs(); // Get state from context
17:     const isActive = activeTab === value;
18: 
19:     const handleClick = () => {
20:       if (!disabled) {
21:         setActiveTab(value);
22:       }
23:     };
24: 
25:     return (
26:       <button
27:         ref={ref} // Assign the forwarded ref
28:         type="button"
29:         id={`tab-trigger-${value}`} // Add ID for ARIA linkage
30:         role="tab"
31:         aria-selected={isActive}
32:         aria-controls={`tab-content-${value}`} // Link to content panel
33:         tabIndex={isActive ? 0 : -1} // Manage focus
34:         className={`${styles.tabsTrigger} ${isActive ? styles.active : ''} ${className || ''}`}
35:         onClick={handleClick}
36:         disabled={disabled}
37:       >
38:         {icon && <span className={styles.tabIcon}>{icon}</span>}
39:         {children}
40:       </button>
41:     );
42:   }
43: );
44: 
45: // Add display name for better debugging
46: TabsTrigger.displayName = 'TabsTrigger';
47: export { TabsTrigger };
````

## File: src/components/ui/Tabs/useTabs.ts
````typescript
 1: import { createContext, useContext } from 'react';
 2: 
 3: export interface TabsContextProps {
 4:   activeTab: string;
 5:   setActiveTab: (value: string) => void;
 6: }
 7: 
 8: // Create context for sharing tab state
 9: export const TabsContext = createContext<TabsContextProps | undefined>(undefined);
10: 
11: // Hook to access tab context
12: export const useTabs = (): TabsContextProps => {
13:   const context = useContext(TabsContext);
14:   if (!context) {
15:     throw new Error('useTabs must be used within a Tabs component');
16:   }
17:   return context;
18: };
````

## File: src/components/ui/ConfirmationDialog.tsx
````typescript
 1: import React from 'react';
 2: import { Dialog } from './Dialog'; // Use the updated Dialog
 3: import { Button } from './Button';
 4: 
 5: interface ConfirmationDialogProps {
 6:   isOpen: boolean;
 7:   onClose: () => void;
 8:   onConfirm: () => void;
 9:   title: string;
10:   description: string;
11:   confirmLabel?: string;
12:   cancelLabel?: string;
13:   variant?: 'default' | 'destructive'; // Semantic variant for the dialog itself
14: }
15: 
16: export function ConfirmationDialog({
17:   isOpen,
18:   onClose,
19:   onConfirm,
20:   title,
21:   description,
22:   confirmLabel = 'Confirm',
23:   cancelLabel = 'Cancel',
24:   variant = 'default' // This prop influences the overall dialog but not buttons directly here
25: }: ConfirmationDialogProps) {
26:   const handleConfirm = () => {
27:     onConfirm();
28:     onClose(); // Typically close after confirm
29:   };
30: 
31:   // Determine the button variant based on the dialog variant
32:   const buttonVariant = variant === 'destructive' ? 'destructive' : 'primary';
33: 
34:   return (
35:     <Dialog
36:       isOpen={isOpen}
37:       onClose={onClose}
38:       title={title}
39:       description={description}
40:       size="sm" // Keep it small for confirmations
41:       footer={ // Pass buttons as the footer content
42:         <>
43:           <Button
44:             variant="ghost" // Standard cancel button
45:             size="sm"
46:             onClick={onClose}
47:           >
48:             {cancelLabel}
49:           </Button>
50:           <Button
51:             variant={buttonVariant} // Use destructive or primary variant based on dialog variant
52:             size="sm"
53:             onClick={handleConfirm}
54:           >
55:             {confirmLabel}
56:           </Button>
57:         </>
58:       }
59:     >
60:       {/* No children needed if description covers the content */}
61:       {/* If there was more complex content, it would go here */}
62:       <div style={{ minHeight: '20px' }}></div> {/* Add some minimal height if description is short */}
63:     </Dialog>
64:   );
65: }
````

## File: src/components/ui/index.ts
````typescript
 1: export { Button } from './Button';
 2: export { Card } from './Card';
 3: export { Switch } from './Switch';
 4: export { ButtonGroup } from './ButtonGroup';
 5: export { DropdownAdapter } from './DropdownMenu/DropdownAdapter';
 6: export { Dropdown } from './Dropdown/Dropdown';
 7: export { ConfirmationDialog } from './ConfirmationDialog';
 8: export { StatusAlert } from './StatusAlert';
 9: export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card/Card';
10: 
11: // Re-export Tabs components from TabsComponents
12: export { Tabs, TabsList, TabsTrigger, TabsContent } from './TabsComponents';
````

## File: src/components/ui/TabsComponents.tsx
````typescript
1: // Export all tab components from a single file
2: export * from './Tabs/index';
````

## File: src/components/ControlContainer.module.css
````css
  1: .controlContainer {
  2:   border: 1px solid var(--border-color);
  3:   border-radius: var(--radius);
  4:   margin-bottom: 12px;
  5:   background-color: var(--background-primary);
  6:   display: flex;
  7:   flex-direction: column;
  8:   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  9:   overflow: hidden; /* Ensure shadows don't leak */
 10:   
 11:   /* Add macOS-like vibrancy effect */
 12:   backdrop-filter: var(--backdrop-blur-md);
 13:   -webkit-backdrop-filter: var(--backdrop-blur-md);
 14: }
 15: 
 16: .controlContainerHeader {
 17:   background-color: var(--background-secondary);
 18:   padding: 6px 8px; /* Smaller padding */
 19:   font-weight: 600;
 20:   color: var(--text-primary);
 21:   border-bottom: 1px solid var(--border-color);
 22:   font-size: 12px; /* Reduced from 15px */
 23:   letter-spacing: -0.01em;
 24:   display: flex; /* Enable flexbox */
 25:   align-items: center; /* Vertically center items */
 26:   justify-content: space-between; /* Space between left section and centered buttons */
 27:   height: 30px; /* Fixed height for smaller header */
 28:   
 29:   /* Add macOS-like vibrancy effect */
 30:   backdrop-filter: var(--backdrop-blur-sm);
 31:   -webkit-backdrop-filter: var(--backdrop-blur-sm);
 32: }
 33: 
 34: /* Left part of header with Controls text and toggle */
 35: .controlHeaderLeft {
 36:   display: flex;
 37:   align-items: center;
 38:   gap: 8px;
 39: }
 40: 
 41: /* Header actions - now on the left */
 42: .headerActionButtons {
 43:   display: flex;
 44:   margin-left: 6px;
 45: }
 46: 
 47: /* Instructions section at the top */
 48: .controlInstructions {
 49:   padding: 6px 10px; /* Reduced padding */
 50:   border-bottom: 1px solid var(--border-color);
 51:   background-color: var(--background-primary);
 52:   font-size: var(--font-size-xs); /* Smaller font */
 53: }
 54: 
 55: /* Tabs container */
 56: .controlTabs {
 57:   width: 100%;
 58: }
 59: 
 60: .tabsContainer {
 61:   padding: 0;
 62: }
 63: 
 64: .tabsContentWrapper {
 65:   padding: 10px; /* Reduced from 16px */
 66:   background-color: var(--background-primary);
 67:   border-bottom-left-radius: var(--radius);
 68:   border-bottom-right-radius: var(--radius);
 69: }
 70: 
 71: /* Individual control items */
 72: .controlItem {
 73:   display: flex;
 74:   align-items: center;
 75:   gap: 8px;
 76:   margin-bottom: 8px; /* Smaller bottom margin */
 77:   width: 100%;
 78: }
 79: 
 80: .controlItem:last-child {
 81:   margin-bottom: 0;
 82: }
 83: 
 84: /* Control labels */
 85: .controlLabel {
 86:   min-width: 60px; /* Reduced from 70px */
 87:   font-weight: 500;
 88:   font-size: 10px; /* Reduced from 12px */
 89:   color: var(--text-secondary);
 90: }
 91: 
 92: /* Control sizes for different importance levels */
 93: .controlPrimary {
 94:   font-weight: 500;
 95:   font-size: 11px; /* Reduced from 12px */
 96: }
 97: 
 98: .controlSecondary, 
 99: .controlHelp {
100:   font-size: 9px; /* Reduced from 10px */
101:   color: var(--text-secondary);
102: }
103: 
104: /* Token usage styling */
105: .tokenBarContainer {
106:   height: 3px;
107:   width: 100%;
108:   background-color: hsl(240, 5.9%, 90%);
109:   border-radius: 9999px;
110:   overflow: hidden;
111:   margin-top: 0.5rem;
112:   position: relative;
113: }
114: 
115: .tokenBar {
116:   height: 100%;
117:   width: 0;
118:   background: var(--accent-color);
119:   transition: width 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
120:   border-radius: 9999px;
121: }
122: 
123: .dark .tokenBarContainer {
124:   background-color: hsl(240, 3.7%, 25%);
125: }
126: 
127: /* Token warnings */
128: .tokenWarning {
129:   color: var(--warning-color, #f59e0b);
130:   display: flex;
131:   align-items: center;
132:   font-size: 10px;
133:   margin-top: 6px; /* Reduced from 8px */
134:   font-weight: 500;
135:   padding: 4px 8px; /* Reduced padding */
136:   background-color: var(--warning-bg-color, rgba(245, 158, 11, 0.1));
137:   border-radius: var(--radius);
138: }
139: 
140: .tokenLimitWarning {
141:   margin-top: 8px; /* Reduced from 10px */
142: }
143: 
144: /* Token count text */
145: .tokenCountText {
146:   margin: 4px 0 6px 0; /* Reduced margins */
147:   font-size: 10px; /* Explicit small size */
148: }
149: 
150: /* Token usage bar */
151: .tokenUsageBar {
152:   height: 3px; /* Reduced from 4px */
153:   width: 100%;
154:   background-color: var(--background-tertiary, rgba(0, 0, 0, 0.1));
155:   border-radius: 2px;
156:   margin-bottom: 0;
157:   overflow: hidden;
158: }
159: 
160: .tokenUsageFill {
161:   height: 100%;
162:   transition: width 0.3s ease;
163: }
164: 
165: /* Token usage colors */
166: .tokenGood {
167:   color: var(--success-color, #10b981);
168: }
169: 
170: .tokenWarning {
171:   color: var(--warning-color, #f59e0b);
172: }
173: 
174: .tokenDanger {
175:   color: var(--error-color, #ef4444);
176: }
177: 
178: /* Token header */
179: .tokenHeader {
180:   display: flex;
181:   justify-content: space-between;
182:   align-items: center;
183:   margin-bottom: 6px; /* Reduced from 8px */
184:   font-size: 12px; /* Reduced from 14px */
185: }
186: 
187: /* Tiny switch class */
188: .tinySwitch {
189:   transform: scale(0.65) !important;
190:   transform-origin: left center !important;
191: }
192: 
193: /* Switch with label layout */
194: .switchWithLabel {
195:   display: flex;
196:   align-items: flex-start;
197:   gap: 6px;
198:   width: 100%;
199:   margin-bottom: 8px;
200: }
201: 
202: .switchWithLabel:last-child {
203:   margin-bottom: 0;
204: }
205: 
206: /* Model selector container */
207: .modelSelectorContainer {
208:   display: flex;
209:   align-items: center;
210:   gap: 6px;
211:   width: 100%;
212: }
213: 
214: /* Search container for local dropdowns */
215: .searchContainerLocal {
216:   display: flex;
217:   align-items: center;
218:   padding: 6px 8px;
219:   background-color: var(--background-secondary);
220:   border: 1px solid var(--border-color);
221:   border-radius: var(--radius);
222:   margin-bottom: 4px;
223:   transition: border-color 0.2s ease, box-shadow 0.2s ease;
224: }
225: 
226: .searchIconLocal {
227:   color: var(--icon-color);
228:   margin-right: 6px;
229:   flex-shrink: 0;
230:   opacity: 0.7;
231:   transition: opacity 0.2s ease;
232:   display: flex;
233:   align-items: center;
234:   justify-content: center;
235:   width: 14px;
236:   height: 14px;
237: }
238: 
239: .searchInputLocal {
240:   flex: 1;
241:   font-size: 11px;
242:   border: none;
243:   outline: none;
244:   background-color: transparent;
245:   color: var(--text-primary);
246:   padding: 2px 0;
247:   width: 100%;
248:   height: 18px;
249: }
250: 
251: .searchInputLocal:focus {
252:   border-color: var(--accent-color);
253:   box-shadow: 0 0 0 1px var(--accent-color);
254: }
255: 
256: /* Simple tabs implementation */
257: .simpleTabs {
258:   width: 100%;
259: }
260: 
261: .simpleTabsList {
262:   display: flex;
263:   border-bottom: 1px solid var(--border-color);
264:   background-color: var(--background-secondary);
265: }
266: 
267: .simpleTabsTrigger {
268:   flex: 1;
269:   display: flex;
270:   align-items: center;
271:   justify-content: center;
272:   gap: 4px;
273:   padding: 5px 8px;
274:   background: none;
275:   border: none;
276:   cursor: pointer;
277:   color: var(--text-secondary);
278:   font-size: 11px;
279:   position: relative;
280:   transition: color 0.2s;
281: }
282: 
283: .simpleTabsTrigger:hover {
284:   color: var(--text-primary);
285:   background-color: var(--hover-color);
286: }
287: 
288: .simpleTabsTriggerActive {
289:   color: var(--text-primary);
290:   font-weight: 500;
291: }
292: 
293: .simpleTabsTriggerActive::after {
294:   content: '';
295:   position: absolute;
296:   bottom: -1px;
297:   left: 0;
298:   right: 0;
299:   height: 2px;
300:   background-color: var(--accent-color);
301:   transform: scaleX(0.8);
302:   transition: transform 0.2s;
303: }
304: 
305: .simpleTabsTrigger:hover::after {
306:   transform: scaleX(1);
307: }
308: 
309: .simpleTabsContent {
310:   padding: 10px;
311: }
312: 
313: .smallerDropdown {
314:   font-size: 11px;
315:   width: auto;
316:   min-width: 120px;
317:   max-width: 160px;
318: }
319: 
320: /* Wider dropdown for model selection */
321: .modelDropdown {
322:   font-size: 11px;
323:   width: auto;
324:   min-width: 220px;
325:   max-width: 280px;
326: }
327: 
328: /* Fixed-width dropdown for consistent sizing in configure tab */
329: .configureDropdown {
330:   font-size: 11px;
331:   width: 140px;
332:   min-width: 140px;
333:   max-width: 140px;
334: }
335: 
336: .controlGroup {
337:   margin-bottom: 10px;
338:   padding-bottom: 6px;
339:   border-bottom: 1px solid var(--border-color);
340: }
341: 
342: .controlGroup:last-child {
343:   margin-bottom: 0;
344:   padding-bottom: 0;
345:   border-bottom: none;
346: }
347: 
348: .controlGroupLabel {
349:   font-size: 10px;
350:   font-weight: 600;
351:   margin-bottom: 4px;
352:   color: var(--text-secondary);
353:   text-transform: uppercase;
354:   letter-spacing: 0.02em;
355: }
356: 
357: .container {
358:   width: 100%;
359:   display: flex;
360:   flex-direction: column;
361:   height: 100%;
362:   overflow: hidden;
363: }
364: 
365: .controlHeader {
366:   display: flex;
367:   justify-content: space-between;
368:   align-items: center;
369:   padding: 0.5rem;
370: }
371: 
372: .instructionsToggle {
373:   display: flex;
374:   align-items: center;
375: }
376: 
377: .smallSwitch {
378:   height: 28px;
379: }
380: 
381: .switchContainer {
382:   width: 100%;
383:   margin-bottom: 0.75rem;
384: }
385: 
386: .switchDescription {
387:   margin-left: 36px;
388:   margin-top: 2px;
389:   font-size: 0.8rem;
390:   color: var(--text-secondary);
391: }
392: 
393: .controlRow {
394:   display: flex;
395:   align-items: center;
396:   gap: 0.5rem;
397:   margin-bottom: 0.75rem;
398: }
399: 
400: .formatDropdown {
401:   width: 100%;
402: }
403: 
404: .tokenInfo {
405:   width: 100%;
406: }
407: 
408: .tokenInfoRow {
409:   display: flex;
410:   justify-content: space-between;
411:   align-items: center;
412:   margin-bottom: 4px;
413:   font-size: 11px;
414: }
415: 
416: .tokenBarContainer {
417:   width: 100%;
418:   height: 4px; /* Reduced from 6px */
419:   background-color: var(--background-secondary);
420:   border-radius: 2px;
421:   overflow: hidden;
422:   margin-bottom: 6px;
423: }
424: 
425: .tokenBar {
426:   height: 100%;
427:   background-color: var(--success-color);
428:   border-radius: 3px;
429:   transition: width 0.3s ease;
430: }
431: 
432: .tokenGood {
433:   color: var(--success-color);
434: }
435: 
436: .tokenWarning {
437:   color: var(--warning-color);
438: }
439: 
440: .tokenDanger {
441:   color: var(--error-color);
442: }
443: 
444: .tokenBar.tokenWarning {
445:   background-color: var(--warning-color);
446: }
447: 
448: .tokenBar.tokenDanger {
449:   background-color: var(--error-color);
450: }
451: 
452: .tokenWarningMessage {
453:   display: flex;
454:   align-items: center;
455:   gap: 4px;
456:   font-size: 10px; /* Reduced from 0.85rem */
457:   color: var(--error-color);
458:   margin-bottom: 4px;
459: }
460: 
461: .optimizationInfo {
462:   display: flex;
463:   align-items: flex-start;
464:   gap: 4px;
465:   padding: 6px;
466:   background-color: var(--background-secondary);
467:   border-radius: var(--radius);
468:   font-size: 10px;
469:   color: var(--text-secondary);
470:   margin-top: 4px;
471: }
472: 
473: .infoIcon {
474:   color: var(--accent-color);
475:   flex-shrink: 0;
476:   margin-top: 1px;
477: }
478: 
479: .controlActions {
480:   display: flex;
481:   flex-wrap: wrap;
482:   gap: 0.5rem;
483: }
484: 
485: .actionButton {
486:   flex: 1;
487:   min-width: 80px;
488: }
489: 
490: .refreshButton {
491:   color: var(--text-secondary);
492: }
493: 
494: .spinner {
495:   animation: spin 1s linear infinite;
496: }
497: 
498: @keyframes spin {
499:   from {
500:     transform: rotate(0deg);
501:   }
502:   to {
503:     transform: rotate(360deg);
504:   }
505: }
506: 
507: /* Search styling improvements */
508: .searchContainerLocal:focus-within {
509:   border-color: var(--accent-color);
510:   box-shadow: 0 0 0 1px var(--accent-color);
511: }
512: 
513: .searchInputLocal::placeholder {
514:   color: var(--text-secondary);
515:   opacity: 0.7;
516: }
517: 
518: .searchContainerLocal:focus-within .searchIconLocal {
519:   opacity: 1;
520: }
521: 
522: /* Styles for new compression UI elements */
523: .numberInput {
524:   width: 80px;
525:   padding: 4px 6px;
526:   border: 1px solid var(--border-color);
527:   border-radius: var(--radius);
528:   background-color: var(--background-secondary);
529:   color: var(--text-primary);
530:   font-size: 11px;
531:   height: 24px;
532: }
533: 
534: .patternsTextarea {
535:   width: 100%;
536:   min-height: 60px;
537:   max-height: 120px;
538:   resize: vertical;
539:   padding: 6px 8px;
540:   border: 1px solid var(--border-color);
541:   border-radius: var(--radius);
542:   background-color: var(--background-secondary);
543:   color: var(--text-primary);
544:   font-size: 11px;
545:   font-family: var(--font-mono, monospace);
546:   margin-bottom: 4px;
547:   line-height: 1.4;
548:   white-space: pre;
549:   tab-size: 2;
550:   letter-spacing: normal;
551:   text-rendering: auto;
552: }
````

## File: src/components/ControlContainer.tsx
````typescript
  1: import React, { useState, useCallback, ChangeEvent, useEffect } from 'react';
  2: import { FileTreeMode } from '../types/FileTypes';
  3: import { OutputFormatType, OUTPUT_FORMAT_OPTIONS } from '../constants/outputFormats';
  4: import { Switch, Button, ButtonGroup, DropdownAdapter } from './ui';
  5: import { Copy, Download, Check, Loader2, AlertTriangle, RefreshCw, Search, Settings, Cpu, Zap } from 'lucide-react';
  6: import styles from './ControlContainer.module.css';
  7: import { ModelInfo } from "../types/ModelTypes";
  8: 
  9: // Define options for File Tree Mode Dropdown
 10: const FILE_TREE_MODE_OPTIONS = [
 11:   { value: 'none', label: 'None' },
 12:   { value: 'selected', label: 'Selected Only' },
 13:   { value: 'selected-with-roots', label: 'Selected with Path' },
 14:   { value: 'complete', label: 'Complete Tree' },
 15: ];
 16: 
 17: interface ControlContainerProps {
 18:   fileTreeMode: FileTreeMode;
 19:   setFileTreeMode: (mode: FileTreeMode) => void;
 20:   showUserInstructions: boolean;
 21:   setShowUserInstructions: (show: boolean) => void;
 22:   getSelectedFilesContent: () => Promise<string>; // Make async
 23:   selectedFilesCount: number;
 24:   outputFormat: OutputFormatType;
 25:   setOutputFormat: (format: OutputFormatType) => void;
 26:   // Add new props for model selection
 27:   availableModels: ModelInfo[] | null;
 28:   selectedModelId: string | null;
 29:   onModelChange: (modelId: string | null) => void;
 30:   // Add props for token info display
 31:   totalTokenCount: number;
 32:   selectedContextLength: number | null;
 33:   // Add props for compression toggle
 34:   isCompressionEnabled: boolean;
 35:   setIsCompressionEnabled: (enabled: boolean) => void;
 36:   // Add props for comment removal
 37:   isCommentRemovalEnabled: boolean;
 38:   setIsCommentRemovalEnabled: (enabled: boolean) => void;
 39:   // Added missing props (can be used with underscore prefix)
 40:   isElectron: boolean;
 41:   processingStatus: 'idle' | 'processing' | 'complete' | 'error';
 42:   onGenerateOutput: () => void;
 43:   // Add new prop for model refreshing
 44:   onRefreshModels?: () => Promise<void>;
 45:   // Add new props for enhanced compression controls
 46:   keepDocstrings: boolean;
 47:   setKeepDocstrings: (keep: boolean) => void;
 48:   removeEmptyLines: boolean;
 49:   setRemoveEmptyLines: (remove: boolean) => void;
 50:   neverCompressPatterns: string[];
 51:   neverCompressPatternsRaw: string;
 52:   setNeverCompressPatternsRaw: (patterns: string) => void;
 53:   minCompressTokenThreshold: number;
 54:   setMinCompressTokenThreshold: (threshold: number) => void;
 55:   // Underscore-prefixed props for marking as intentionally unused
 56:   _isElectron?: boolean;
 57:   _processingStatus?: 'idle' | 'processing' | 'complete' | 'error';
 58:   _onGenerateOutput?: () => void;
 59:   _neverCompressPatterns?: string[];
 60: }
 61: 
 62: const ControlContainer: React.FC<ControlContainerProps> = ({
 63:   fileTreeMode,
 64:   setFileTreeMode,
 65:   showUserInstructions,
 66:   setShowUserInstructions,
 67:   getSelectedFilesContent,
 68:   selectedFilesCount,
 69:   outputFormat,
 70:   setOutputFormat,
 71:   // Destructure new props
 72:   availableModels,
 73:   selectedModelId,
 74:   onModelChange,
 75:   // Destructure token info props
 76:   totalTokenCount,
 77:   selectedContextLength,
 78:   // Destructure compression props
 79:   isCompressionEnabled,
 80:   setIsCompressionEnabled,
 81:   // Destructure comment removal props
 82:   isCommentRemovalEnabled,
 83:   setIsCommentRemovalEnabled,
 84:   // Unused props (prefixed with _ to indicate they're intentionally unused)
 85:   _isElectron: isElectron,
 86:   _processingStatus: processingStatus,
 87:   _onGenerateOutput: onGenerateOutput,
 88:   // New prop for refreshing models
 89:   onRefreshModels,
 90:   // Destructure new props for enhanced compression controls
 91:   keepDocstrings,
 92:   setKeepDocstrings,
 93:   removeEmptyLines,
 94:   setRemoveEmptyLines,
 95:   _neverCompressPatterns: neverCompressPatterns,
 96:   neverCompressPatternsRaw,
 97:   setNeverCompressPatternsRaw,
 98:   minCompressTokenThreshold,
 99:   setMinCompressTokenThreshold,
100: }) => {
101:   const [copied, setCopied] = useState(false);
102:   const [isCopying, setIsCopying] = useState(false); // Add loading state for copy
103:   const [isDownloading, setIsDownloading] = useState(false); // Add loading state for download
104:   const [isRefreshingModels, setIsRefreshingModels] = useState(false); // Add loading state for model refresh
105:   const [modelSearchTerm, setModelSearchTerm] = useState(''); // State for model search
106:   const [activeTab, setActiveTab] = useState('configure'); // State for simple tab implementation
107:   const [showControls, setShowControls] = useState(true); // New state for controls visibility
108: 
109:   const handleCopy = useCallback(async () => {
110:     if (selectedFilesCount === 0 || isCopying) return;
111:     setIsCopying(true);
112:     setCopied(false); // Reset copied state
113:     try {
114:       const content = await getSelectedFilesContent(); // Await the async function
115:       await navigator.clipboard.writeText(content);
116:       setCopied(true);
117:       setTimeout(() => setCopied(false), 2000);
118:     } catch (err) {
119:       console.error('Failed to copy:', err);
120:       // TODO: Show user error feedback
121:     } finally {
122:       setIsCopying(false);
123:     }
124:   }, [getSelectedFilesContent, selectedFilesCount, isCopying]); // Add dependencies
125: 
126:   const handleDownload = useCallback(async () => {
127:     if (selectedFilesCount === 0 || isDownloading) return;
128:     setIsDownloading(true);
129:     try {
130:         const content = await getSelectedFilesContent(); // Await the async function
131:         const blob = new Blob([content], { type: 'text/plain;charset=utf-8' }); // Specify charset
132:         const url = URL.createObjectURL(blob);
133:         const a = document.createElement('a');
134:         a.href = url;
135:         // Generate filename based on current context if possible
136:         const filename = `pastemax_output_${new Date().toISOString().split('T')[0]}.txt`;
137:         a.download = filename;
138:         document.body.appendChild(a);
139:         a.click();
140:         document.body.removeChild(a);
141:         URL.revokeObjectURL(url);
142:     } catch (err) {
143:         console.error('Failed to download:', err);
144:         // TODO: Show user error feedback
145:     } finally {
146:         setIsDownloading(false);
147:     }
148:   }, [getSelectedFilesContent, selectedFilesCount, isDownloading]); // Add dependencies
149: 
150:   // Handle model refresh
151:   const handleRefreshModels = useCallback(async () => {
152:     if (!onRefreshModels || isRefreshingModels) return;
153:     
154:     setIsRefreshingModels(true);
155:     try {
156:       await onRefreshModels();
157:     } catch (error) {
158:       console.error('Error refreshing models:', error);
159:     } finally {
160:       setIsRefreshingModels(false);
161:     }
162:   }, [onRefreshModels, isRefreshingModels]);
163: 
164:   // Toggle controls visibility
165:   const toggleControls = () => {
166:     setShowControls(prev => !prev);
167:   };
168: 
169:   // Prepare model options, already available as prop 'availableModels'
170:   // No need to map here, adapter handles icon logic if any
171:   
172:   // Filter model options based on search term
173:   const filteredModelOptions = availableModels
174:     ? availableModels.filter(model => 
175:         model.name.toLowerCase().includes(modelSearchTerm.toLowerCase())
176:       ).map(model => ({ // Map to required { value, label } format for DropdownAdapter
177:           value: model.id,
178:           label: `${model.name} (${(model.context_length/1000).toLocaleString()}k)`,
179:         }))
180:     : [{ value: '', label: 'Loading models...', disabled: true }];
181: 
182:   // Check if token count exceeds the limit
183:   const exceedsLimit = selectedContextLength !== null && totalTokenCount > selectedContextLength;
184:   
185:   // Calculate percentage of token limit used
186:   const tokenPercentage = selectedContextLength ? Math.min(100, Math.round((totalTokenCount / selectedContextLength) * 100)) : 0;
187:   
188:   // Get token usage class
189:   const getTokenUsageClass = () => {
190:     if (tokenPercentage > 95) return styles.tokenDanger;
191:     if (tokenPercentage > 75) return styles.tokenWarning;
192:     if (tokenPercentage > 0) return styles.tokenGood;
193:     return '';
194:   };
195: 
196:   // Determine the width of the token bar with animation for visual appeal
197:   const [tokenBarWidth, setTokenBarWidth] = useState(0);
198:   
199:   // Animate token bar on changes similar to the file card implementation
200:   useEffect(() => {
201:     // Start with 0 width
202:     setTokenBarWidth(0);
203:     
204:     // Animate to the correct width with a slight delay for visual appeal
205:     const timer = setTimeout(() => {
206:       setTokenBarWidth(tokenPercentage);
207:     }, 100);
208:     
209:     return () => clearTimeout(timer);
210:   }, [tokenPercentage]);
211: 
212:   // Function to render the search input for the model dropdown
213:   const renderModelSearchHeader = () => (
214:     <div className={styles.searchContainerLocal}>
215:       <Search size={14} className={styles.searchIconLocal} />
216:       <input
217:         type="text"
218:         placeholder="Search models..."
219:         value={modelSearchTerm}
220:         onChange={(e: ChangeEvent<HTMLInputElement>) => setModelSearchTerm(e.target.value)}
221:         onClick={(e) => e.stopPropagation()} // Prevent click from closing dropdown
222:         onKeyDown={(e) => e.stopPropagation()} // Prevent arrow keys etc. from bubbling up
223:         className={styles.searchInputLocal}
224:         aria-label="Search models"
225:       />
226:     </div>
227:   );
228: 
229:   return (
230:     <div className={styles.controlContainer}>
231:       <div className={styles.controlContainerHeader}>
232:         <div className={styles.controlHeaderLeft}>
233:           <span>Controls</span>
234:           <Switch 
235:             checked={showControls} 
236:             onChange={() => toggleControls()}
237:             size="sm"
238:             className={styles.tinySwitch}
239:           />
240:           
241:           <div className={styles.headerActionButtons}>
242:             <ButtonGroup size="xs" variant="horizontal">
243:               <Button
244:                 variant="ghost"
245:                 iconOnly
246:                 startIcon={isCopying ? <Loader2 size={12} className="animate-spin" /> : copied ? <Check size={12} /> : <Copy size={12} />}
247:                 disabled={selectedFilesCount === 0 || isCopying || isDownloading}
248:                 onClick={handleCopy}
249:                 title={copied ? "Copied!" : "Copy content"}
250:               />
251:               <Button
252:                 variant="ghost"
253:                 iconOnly
254:                 startIcon={isDownloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
255:                 disabled={selectedFilesCount === 0 || isCopying || isDownloading}
256:                 onClick={handleDownload}
257:                 title="Download as text file"
258:               />
259:             </ButtonGroup>
260:           </div>
261:         </div>
262:       </div>
263: 
264:       {showControls && (
265:         <>
266:           {showUserInstructions && (
267:             <div className={styles.controlInstructions}>
268:               <p>Select files from the sidebar to include them in your output.</p>
269:             </div>
270:           )}
271: 
272:           <div className={styles.simpleTabs}>
273:             <div className={styles.simpleTabsList}>
274:               <button 
275:                 className={`${styles.simpleTabsTrigger} ${activeTab === 'configure' ? styles.simpleTabsTriggerActive : ''}`}
276:                 onClick={() => setActiveTab('configure')}
277:               >
278:                 <Settings size={12} />
279:                 <span>Configure</span>
280:               </button>
281:               <button 
282:                 className={`${styles.simpleTabsTrigger} ${activeTab === 'model' ? styles.simpleTabsTriggerActive : ''}`}
283:                 onClick={() => setActiveTab('model')}
284:               >
285:                 <Cpu size={12} />
286:                 <span>Model</span>
287:               </button>
288:               <button 
289:                 className={`${styles.simpleTabsTrigger} ${activeTab === 'optimize' ? styles.simpleTabsTriggerActive : ''}`}
290:                 onClick={() => setActiveTab('optimize')}
291:               >
292:                 <Zap size={12} />
293:                 <span>Optimize</span>
294:               </button>
295:             </div>
296: 
297:             <div className={styles.simpleTabsContent}>
298:               {activeTab === 'configure' && (
299:                 <div className={styles.controlGroup}>
300:                   <div className={styles.switchWithLabel}>
301:                     <Switch
302:                       checked={showUserInstructions}
303:                       onChange={() => setShowUserInstructions(!showUserInstructions)}
304:                       size="sm"
305:                       className={styles.tinySwitch}
306:                     />
307:                     <div>
308:                       <div className={styles.controlPrimary}>Show Instructions</div>
309:                       <div className={styles.controlHelp}>
310:                         Display helpful instructions for using the app
311:                       </div>
312:                     </div>
313:                   </div>
314: 
315:                   <div className={styles.controlItem}>
316:                     <div className={styles.controlLabel}>Output</div>
317:                     <DropdownAdapter
318:                       options={OUTPUT_FORMAT_OPTIONS}
319:                       value={outputFormat}
320:                       onChange={(val) => {
321:                         if (typeof val === 'string') {
322:                           setOutputFormat(val as OutputFormatType);
323:                         }
324:                       }}
325:                       placeholder="Format"
326:                       className={styles.configureDropdown}
327:                     />
328:                   </div>
329: 
330:                   <div className={styles.controlItem}>
331:                     <div className={styles.controlLabel}>Tree</div>
332:                     <DropdownAdapter
333:                       options={FILE_TREE_MODE_OPTIONS}
334:                       value={fileTreeMode}
335:                       onChange={(val) => {
336:                         if (typeof val === 'string') {
337:                           setFileTreeMode(val as FileTreeMode);
338:                         }
339:                       }}
340:                       placeholder="Tree Mode"
341:                       className={styles.configureDropdown}
342:                     />
343:                   </div>
344:                 </div>
345:               )}
346: 
347:               {activeTab === 'model' && (
348:                 <div className={styles.controlGroup}>
349:                   <div className={styles.controlItem}>
350:                     <div className={styles.controlLabel}>Model</div>
351:                     <div className={styles.modelSelectorContainer}>
352:                       <DropdownAdapter
353:                         options={filteredModelOptions}
354:                         value={selectedModelId || ''}
355:                         onChange={(val) => {
356:                           if (typeof val === 'string') {
357:                             onModelChange(val || null);
358:                           }
359:                         }}
360:                         placeholder="Select Model"
361:                         renderHeader={renderModelSearchHeader}
362:                         className={styles.modelDropdown}
363:                       />
364:                       
365:                       <Button
366:                         variant="ghost"
367:                         size="sm"
368:                         iconOnly
369:                         startIcon={isRefreshingModels ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
370:                         disabled={isRefreshingModels || !onRefreshModels}
371:                         onClick={handleRefreshModels}
372:                         title="Refresh available models"
373:                       />
374:                     </div>
375:                   </div>
376:                   
377:                   {/* Token usage indicator */}
378:                   <div className={styles.tokenInfo}>
379:                     <div className={styles.tokenCountText}>
380:                       {totalTokenCount.toLocaleString()} tokens
381:                       {selectedContextLength && ` / ${(selectedContextLength/1000).toLocaleString()}k context limit`}
382:                     </div>
383:                     
384:                     <div className={styles.tokenUsageBar}>
385:                       <div
386:                         className={`${styles.tokenUsageFill} ${getTokenUsageClass()}`}
387:                         style={{ 
388:                           width: `${tokenBarWidth}%`,
389:                           backgroundColor: exceedsLimit ? 'var(--error-color)' : 
390:                                           (tokenPercentage > 75 ? 'var(--warning-color)' : 'var(--accent-color)')
391:                         }}
392:                       />
393:                     </div>
394:                     
395:                     {exceedsLimit && (
396:                       <div className={styles.tokenWarning}>
397:                         <AlertTriangle size={12} style={{ marginRight: '6px' }} />
398:                         <span>Exceeds model context limit by {(totalTokenCount - selectedContextLength!).toLocaleString()} tokens</span>
399:                       </div>
400:                     )}
401:                   </div>
402:                 </div>
403:               )}
404: 
405:               {activeTab === 'optimize' && (
406:                 <div className={styles.controlGroup}>
407:                   <div className={styles.switchWithLabel}>
408:                     <Switch
409:                       checked={isCompressionEnabled}
410:                       onChange={() => setIsCompressionEnabled(!isCompressionEnabled)}
411:                       size="sm"
412:                       className={styles.tinySwitch}
413:                     />
414:                     <div>
415:                       <div className={styles.controlPrimary}>Compress Code</div>
416:                       <div className={styles.controlHelp}>
417:                         Reduces token count by removing code bodies from functions and methods
418:                       </div>
419:                     </div>
420:                   </div>
421:                   
422:                   {isCompressionEnabled && (
423:                     <>
424:                       <div className={styles.controlItem}>
425:                         <div className={styles.controlLabel}>Min Tokens to Compress</div>
426:                         <input
427:                           type="number"
428:                           min={1}
429:                           max={10000}
430:                           value={minCompressTokenThreshold}
431:                           onChange={(e) => setMinCompressTokenThreshold(parseInt(e.target.value) || 100)}
432:                           className={styles.numberInput}
433:                           title="Minimum token count for a file to be considered for compression"
434:                         />
435:                       </div>
436:                       
437:                       <div className={styles.controlItem}>
438:                         <div className={styles.controlLabel}>Never Compress Patterns</div>
439:                         <textarea
440:                           placeholder="Enter glob patterns (one per line)"
441:                           value={neverCompressPatternsRaw}
442:                           onChange={(e) => setNeverCompressPatternsRaw(e.target.value)}
443:                           className={styles.patternsTextarea}
444:                           title="Files matching these patterns will never be compressed"
445:                         />
446:                         <div className={styles.controlHelp}>
447:                           Enter glob patterns (one per line) for files/folders to exclude from body compression
448:                         </div>
449:                       </div>
450:                     </>
451:                   )}
452:                   
453:                   <div className={styles.switchWithLabel}>
454:                     <Switch
455:                       checked={isCommentRemovalEnabled}
456:                       onChange={() => setIsCommentRemovalEnabled(!isCommentRemovalEnabled)}
457:                       size="sm"
458:                       className={styles.tinySwitch}
459:                     />
460:                     <div>
461:                       <div className={styles.controlPrimary}>Remove Comments</div>
462:                       <div className={styles.controlHelp}>
463:                         Reduces token count by stripping comments from code files
464:                       </div>
465:                     </div>
466:                   </div>
467:                   
468:                   {isCommentRemovalEnabled && (
469:                     <div className={styles.switchWithLabel}>
470:                       <Switch
471:                         checked={keepDocstrings}
472:                         onChange={() => setKeepDocstrings(!keepDocstrings)}
473:                         size="sm"
474:                         className={styles.tinySwitch}
475:                         disabled={!isCommentRemovalEnabled}
476:                       />
477:                       <div>
478:                         <div className={styles.controlPrimary}>Keep Docstrings</div>
479:                         <div className={styles.controlHelp}>
480:                           Preserves documentation comments (e.g., JSDoc, Python docstrings) even if 'Remove Comments' is enabled
481:                         </div>
482:                       </div>
483:                     </div>
484:                   )}
485:                   
486:                   <div className={styles.switchWithLabel}>
487:                     <Switch
488:                       checked={removeEmptyLines}
489:                       onChange={() => setRemoveEmptyLines(!removeEmptyLines)}
490:                       size="sm"
491:                       className={styles.tinySwitch}
492:                     />
493:                     <div>
494:                       <div className={styles.controlPrimary}>Remove Empty Lines</div>
495:                       <div className={styles.controlHelp}>
496:                         Removes blank lines from the output
497:                       </div>
498:                     </div>
499:                   </div>
500:                 </div>
501:               )}
502:             </div>
503:           </div>
504:         </>
505:       )}
506:     </div>
507:   );
508: };
509: 
510: export default ControlContainer;
````

## File: src/components/ErrorBoundary.tsx
````typescript
 1: import React, { Component, ErrorInfo } from 'react';
 2: 
 3: interface Props {
 4:   children: React.ReactNode;
 5:   fallback?: React.ReactNode;
 6: }
 7: 
 8: interface State {
 9:   hasError: boolean;
10:   error: Error | null;
11: }
12: 
13: /**
14:  * Error Boundary component for catching and handling React component errors.
15:  * Provides a fallback UI when child components throw errors.
16:  */
17: export class ErrorBoundary extends Component<Props, State> {
18:   constructor(props: Props) {
19:     super(props);
20:     this.state = {
21:       hasError: false,
22:       error: null
23:     };
24:   }
25: 
26:   static getDerivedStateFromError(error: Error): State {
27:     return {
28:       hasError: true,
29:       error
30:     };
31:   }
32: 
33:   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
34:     console.error('Error caught by boundary:', error);
35:     console.error('Component stack:', errorInfo.componentStack);
36:   }
37: 
38:   render() {
39:     if (this.state.hasError) {
40:       return this.props.fallback || (
41:         <div className="error-boundary">
42:           <h3>Something went wrong</h3>
43:           <p>{this.state.error?.message}</p>
44:           <button onClick={() => this.setState({ hasError: false, error: null })}>
45:             Try again
46:           </button>
47:         </div>
48:       );
49:     }
50: 
51:     return this.props.children;
52:   }
53: }
````

## File: src/components/FileCard.module.css
````css
  1: .fileCard {
  2:   display: flex;
  3:   flex-direction: column;
  4:   margin-bottom: 4px;
  5:   transition: all 0.2s ease;
  6:   border: 1px solid var(--border-color);
  7:   border-radius: var(--radius);
  8:   position: relative;
  9:   height: auto;
 10:   min-height: 70px;
 11:   background-color: var(--card-background);
 12:   color: var(--card-foreground);
 13:   box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
 14:   
 15:   backdrop-filter: var(--backdrop-blur-sm);
 16:   -webkit-backdrop-filter: var(--backdrop-blur-sm);
 17: }
 18: 
 19: .fileCard:hover {
 20:   background-color: var(--card-background);
 21:   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
 22:   border-color: var(--border-color);
 23:   transform: translateY(-1px);
 24: }
 25: 
 26: .fileCard.selected {
 27:   border-color: var(--file-card-selected-border);
 28:   box-shadow: 0 0 0 1px var(--file-card-selected-border);
 29:   background-color: rgba(255, 255, 255, 0.07);
 30: }
 31: 
 32: .fileCardContent {
 33:   padding: 6px !important;
 34: }
 35: 
 36: .fileCardHeader {
 37:   display: flex;
 38:   align-items: center;
 39:   gap: 3px;
 40:   margin-bottom: 3px;
 41: }
 42: 
 43: .fileCardIcon {
 44:   color: var(--text-secondary);
 45:   display: flex;
 46:   align-items: center;
 47:   margin-right: 0.2rem;
 48:   flex-shrink: 0;
 49: }
 50: 
 51: .fileCardName {
 52:   flex: 1;
 53:   font-family: monospace;
 54:   white-space: nowrap;
 55:   overflow: hidden;
 56:   text-overflow: ellipsis;
 57:   font-weight: 500;
 58:   color: var(--card-foreground);
 59:   font-size: 11px;
 60: }
 61: 
 62: .fileCardInfo {
 63:   display: flex;
 64:   flex-direction: column;
 65:   margin-bottom: 10px;
 66:   flex-grow: 1;
 67: }
 68: 
 69: .fileCardTokens {
 70:   font-size: 10px;
 71:   color: var(--text-secondary);
 72:   margin-bottom: 3px;
 73: }
 74: 
 75: .fileCardStatus {
 76:   font-size: 11px;
 77:   color: var(--text-secondary);
 78: }
 79: 
 80: .tokenBarContainer {
 81:   width: 100%;
 82:   height: 3px;
 83:   background-color: var(--background-secondary);
 84:   border-radius: 1.5px;
 85:   overflow: hidden;
 86: }
 87: 
 88: .tokenBar {
 89:   height: 100%;
 90:   background-color: var(--accent-color);
 91:   border-radius: 1.5px;
 92:   transition: width 0.3s ease;
 93: }
 94: 
 95: .fileCardActions {
 96:   display: flex;
 97:   gap: 2px;
 98:   position: absolute;
 99:   bottom: 4px;
100:   right: 8px;
101:   opacity: 0;
102:   transition: opacity 0.2s ease;
103: }
104: 
105: .fileCard:hover .fileCardActions {
106:   opacity: 1;
107: }
108: 
109: .fileCardAction {
110:   width: 20px !important;
111:   height: 20px !important;
112:   padding: 0 !important;
113:   color: var(--text-secondary);
114:   transition: color 0.2s ease !important;
115: }
116: 
117: .fileCardAction:hover {
118:   background-color: transparent !important;
119:   color: var(--text-primary) !important;
120: }
121: 
122: .copySuccess {
123:   color: var(--success-color);
124:   animation: pulse 1s ease-in-out;
125: }
126: 
127: .compressedIcon {
128:   color: var(--text-secondary);
129:   opacity: 0.7;
130:   margin-left: 2px;
131: }
132: 
133: @keyframes pulse {
134:   0% {
135:     transform: scale(1);
136:   }
137:   50% {
138:     transform: scale(1.2);
139:   }
140:   100% {
141:     transform: scale(1);
142:   }
143: }
````

## File: src/components/FileCard.tsx
````typescript
  1: import React, { useEffect, useState } from "react";
  2: import { Plus, X, FileText, Copy, Minimize2 } from "lucide-react";
  3: import { Card, CardContent, Button } from "./ui";
  4: import styles from "./FileCard.module.css";
  5: 
  6: interface FileCardComponentProps {
  7:   file: {
  8:     name: string;
  9:     path: string;
 10:     tokenCount: number;
 11:     content: string;
 12:     isCompressed: boolean;
 13:   };
 14:   isSelected: boolean;
 15:   toggleSelection: (path: string) => void;
 16:   maxTokenCount?: number; // Maximum token count among all displayed files
 17: }
 18: 
 19: const FileCard = ({
 20:   file,
 21:   isSelected,
 22:   toggleSelection,
 23:   maxTokenCount = 5000, // Default if not provided
 24: }: FileCardComponentProps) => {
 25:   const { name, path: filePath, tokenCount, content, isCompressed } = file;
 26:   const [barWidth, setBarWidth] = useState(0);
 27:   const [copied, setCopied] = useState(false);
 28: 
 29:   // Format token count for display
 30:   const formattedTokens = tokenCount.toLocaleString();
 31: 
 32:   // Calculate the percentage width for the token bar based on the highest token count
 33:   useEffect(() => {
 34:     // Start with 0 width
 35:     setBarWidth(0);
 36:     
 37:     // Animate to the correct width with a slight delay for visual appeal
 38:     const timer = setTimeout(() => {
 39:       // If token count is very small compared to max, ensure it has at least some visible width
 40:       let percentage;
 41:       if (maxTokenCount <= 0) {
 42:         percentage = 0;
 43:       } else {
 44:         // Use relative scaling with a minimum percentage to ensure visibility
 45:         const minPercentage = 5; // Ensure even small files have a visible bar
 46:         percentage = Math.max(
 47:           minPercentage,
 48:           Math.min((tokenCount / maxTokenCount) * 100, 100)
 49:         );
 50:       }
 51:       setBarWidth(percentage);
 52:     }, 50);
 53:     
 54:     return () => clearTimeout(timer);
 55:   }, [tokenCount, maxTokenCount]);
 56: 
 57:   const handleCopy = async () => {
 58:     try {
 59:       await navigator.clipboard.writeText(content);
 60:       setCopied(true);
 61:       setTimeout(() => setCopied(false), 2000);
 62:     } catch (err) {
 63:       console.error("Failed to copy:", err);
 64:     }
 65:   };
 66: 
 67:   return (
 68:     <Card 
 69:       selected={isSelected} 
 70:       className={styles.fileCard}
 71:     >
 72:       <CardContent className={styles.fileCardContent}>
 73:         <div className={styles.fileCardHeader}>
 74:           <div className={styles.fileCardIcon}>
 75:             <FileText size={14} />
 76:           </div>
 77:           <div className={styles.fileCardName}>{name}</div>
 78:           {isCompressed && (
 79:             <div className={styles.compressedIcon} title="Function bodies removed">
 80:               <Minimize2 size={10} />
 81:             </div>
 82:           )}
 83:         </div>
 84:         <div className={styles.fileCardInfo}>
 85:           <div className={styles.fileCardTokens}>~{formattedTokens} tokens</div>
 86:           <div className={styles.tokenBarContainer}>
 87:             <div 
 88:               className={styles.tokenBar} 
 89:               style={{ width: `${barWidth}%` }}
 90:               title={`${tokenCount} tokens (${Math.round(barWidth)}% of largest file)`}
 91:             ></div>
 92:           </div>
 93:         </div>
 94: 
 95:         <div className={styles.fileCardActions}>
 96:           <Button
 97:             variant="icon"
 98:             size="sm"
 99:             iconOnly
100:             onClick={() => toggleSelection(filePath)}
101:             title={isSelected ? "Remove from selection" : "Add to selection"}
102:             startIcon={isSelected ? <X size={12} /> : <Plus size={12} />}
103:             className={styles.fileCardAction}
104:           />
105:           <Button
106:             variant="icon"
107:             size="sm"
108:             iconOnly
109:             onClick={handleCopy}
110:             title={copied ? "Copied!" : "Copy to clipboard"}
111:             startIcon={copied ? <Copy size={12} className={styles.copySuccess} /> : <Copy size={12} />}
112:             className={styles.fileCardAction}
113:           />
114:         </div>
115:       </CardContent>
116:     </Card>
117:   );
118: };
119: 
120: export default FileCard;
````

## File: src/components/FileList.module.css
````css
 1: .fileListContainer {
 2:   flex: 1;
 3:   overflow: hidden;
 4:   display: flex;
 5:   flex-direction: column;
 6: }
 7: 
 8: .fileList {
 9:   flex: 1;
10:   overflow-y: auto;
11:   padding: 1rem;
12:   display: grid;
13:   grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
14:   grid-auto-rows: max-content;
15:   align-content: start;
16:   gap: 0.5rem;
17:   background-color: var(--background-primary);
18: }
19: 
20: /* Specific scrollbar styling for file list */
21: .fileList::-webkit-scrollbar-track {
22:   background-color: var(--scrollbar-track-color);
23: }
24: 
25: .fileList::-webkit-scrollbar-thumb {
26:   background-color: var(--scrollbar-thumb-color);
27:   border-radius: var(--radius-full);
28: }
29: 
30: .fileList::-webkit-scrollbar-thumb:hover {
31:   background-color: var(--scrollbar-thumb-hover-color);
32: }
33: 
34: .fileListEmpty {
35:   display: flex;
36:   align-items: center;
37:   justify-content: center;
38:   height: 100%;
39:   color: var(--text-secondary);
40:   font-size: 16px;
41:   padding: 32px;
42:   text-align: center;
43: }
````

## File: src/components/FileList.tsx
````typescript
 1: import React, { useState, useEffect } from "react";
 2: import { FileListProps, FileData } from "../types/FileTypes";
 3: import FileCard from "./FileCard";
 4: import { arePathsEqual } from "../utils/pathUtils";
 5: import styles from "./FileList.module.css";
 6: 
 7: const FileList = ({
 8:   files,
 9:   selectedFiles,
10:   toggleFileSelection,
11: }: FileListProps) => {
12:   const [fileContents, setFileContents] = useState<Record<string, string>>({});
13: 
14:   // Only show files that are in the selectedFiles array and not binary/skipped
15:   const displayableFiles = files.filter(
16:     (file: FileData) =>
17:       selectedFiles.some(selectedPath => arePathsEqual(selectedPath, file.path)) && 
18:       !file.isBinary && 
19:       !file.isSkipped,
20:   );
21: 
22:   // Find the maximum token count for relative scaling
23:   const maxTokenCount = displayableFiles.length > 0
24:     ? Math.max(...displayableFiles.map(file => file.tokenCount))
25:     : 5000; // Default if no files
26: 
27:   // Fetch file contents when needed
28:   useEffect(() => {
29:     const fetchContents = async () => {
30:       const newContents: Record<string, string> = {};
31:       for (const file of displayableFiles) {
32:         if (!fileContents[file.path]) {
33:           try {
34:             const content = await window.electron.readFile(file.path);
35:             newContents[file.path] = content ?? "Error: File content is null";
36:           } catch (error) {
37:             console.error(`Error reading file ${file.path}:`, error);
38:             newContents[file.path] = "Error loading file content";
39:           }
40:         }
41:       }
42:       if (Object.keys(newContents).length > 0) {
43:         setFileContents(prev => ({ ...prev, ...newContents }));
44:       }
45:     };
46: 
47:     fetchContents();
48:   }, [displayableFiles, fileContents]);
49: 
50:   return (
51:     <div className={styles.fileListContainer}>
52:       {displayableFiles.length > 0 ? (
53:         <div className={styles.fileList}>
54:           {displayableFiles.map((file) => (
55:             <FileCard
56:               key={file.path}
57:               file={{
58:                 ...file,
59:                 content: fileContents[file.path] || "Loading..."
60:               }}
61:               isSelected={true} // Always true since we're already filtering for selected files
62:               toggleSelection={toggleFileSelection}
63:               maxTokenCount={maxTokenCount}
64:             />
65:           ))}
66:         </div>
67:       ) : (
68:         <div className={styles.fileListEmpty}>
69:           No files selected. Select files from the sidebar to see them here.
70:         </div>
71:       )}
72:     </div>
73:   );
74: };
75: 
76: export default FileList;
````

## File: src/components/FileTreeHeader.module.css
````css
 1: .fileTreeHeader {
 2:   display: flex;
 3:   align-items: center;
 4:   gap: 0.5rem;
 5:   padding: 0.5rem;
 6:   background: var(--background-primary);
 7:   border-bottom: 1px solid var(--border-color);
 8:   height: 46px;
 9:   justify-content: center;
10: }
11: 
12: .fileTreeBtn:focus-visible {
13:   outline: 2px solid var(--focus-ring);
14:   outline-offset: -1px;
15: }
16: 
17: .dropdownContainer {
18:   position: relative;
19:   display: inline-flex;
20:   align-items: center;
21:   height: 32px;
22: }
23: 
24: .excludedFilesCount {
25:   padding: 0.5rem;
26:   font-size: 0.875rem;
27:   color: var(--text-secondary);
28:   background: var(--bg-secondary);
29:   border-bottom: 1px solid var(--border-color);
30: }
````

## File: src/components/FileTreeHeader.tsx
````typescript
 1: import React, { useCallback } from "react"; // Import useCallback
 2: import { Folder, Filter, X, RefreshCw } from "lucide-react"; // Removed unused sort icons
 3: import { SortOrder } from "../types/FileTypes";
 4: import { Button } from "./ui";
 5: import { Dropdown } from "./ui/Dropdown";
 6: import { getSortIcon } from "../utils/sortIcons"; // Keep this utility
 7: import styles from "./FileTreeHeader.module.css";
 8: 
 9: // Removed unused sortIconMap and iconComponents
10: 
11: interface FileTreeHeaderProps {
12:   onOpenFolder: () => void;
13:   onSortChange: (sortOrder: SortOrder) => void;
14:   onClearSelection: () => void; // Should trigger dialog in App
15:   onRemoveAllFolders: () => void; // Should trigger dialog in App
16:   onReloadFileTree: () => void;
17:   onOpenIgnorePatterns: () => void; // Simplified: always opens modal
18:   excludedFilesCount?: number;
19:   currentSortOrder?: SortOrder;
20: }
21: 
22: // Keep sortOptions definition
23: const sortOptions = [
24:   { value: "name-ascending", label: "Name (A to Z)" },
25:   { value: "name-descending", label: "Name (Z to A)" },
26:   { value: "tokens-ascending", label: "Tokens (Asc)" }, // Updated labels for brevity if desired
27:   { value: "tokens-descending", label: "Tokens (Desc)" },
28:   { value: "date-ascending", label: "Date (Oldest)" },
29:   { value: "date-descending", label: "Date (Newest)" }
30: ];
31: 
32: // Keep clearOptions definition
33: const clearOptions = [
34:   { value: "clear", label: "Clear selection" },
35:   { value: "removeAll", label: "Remove All Folders" },
36: ];
37: 
38: const FileTreeHeader: React.FC<FileTreeHeaderProps> = ({ // Use React.FC for consistency
39:   onOpenFolder,
40:   onSortChange,
41:   onClearSelection,
42:   onRemoveAllFolders,
43:   onReloadFileTree,
44:   onOpenIgnorePatterns,
45:   excludedFilesCount,
46:   currentSortOrder,
47: }) => {
48: 
49:   // Use useCallback for handlers passed to Dropdown
50:   const handleSortSelect = useCallback((value: string | string[]) => {
51:     if (typeof value === 'string') {
52:         onSortChange(value as SortOrder);
53:     }
54:   }, [onSortChange]);
55: 
56:   const handleClearSelect = useCallback((value: string | string[]) => {
57:     if (typeof value === 'string') {
58:       if (value === 'clear') onClearSelection();
59:       else if (value === 'removeAll') onRemoveAllFolders();
60:     }
61:   }, [onClearSelection, onRemoveAllFolders]);
62: 
63:   return (
64:     <>
65:       <div className={styles.fileTreeHeader}>
66:         <Button variant="icon" size="sm" iconOnly startIcon={<Folder size={16} />} onClick={onOpenFolder} title="Select Folder" className={styles.fileTreeBtn} />
67:         <div className={styles.dropdownContainer}>
68:           <Dropdown
69:             options={sortOptions}
70:             onChange={handleSortSelect}
71:             value={currentSortOrder}
72:             trigger={<Button variant="icon" size="sm" iconOnly startIcon={getSortIcon(currentSortOrder)} title="Sort By" className={styles.fileTreeBtn} />}
73:             menuClassName={styles.headerDropdownMenu} // Ensure this class exists or remove
74:           />
75:         </div>
76:         <Button variant="icon" size="sm" iconOnly startIcon={<Filter size={16} />} onClick={onOpenIgnorePatterns} title="Ignore Patterns" className={styles.fileTreeBtn} />
77:         <div className={styles.dropdownContainer}>
78:           <Dropdown
79:             options={clearOptions}
80:             onChange={handleClearSelect}
81:             trigger={<Button variant="icon" size="sm" iconOnly startIcon={<X size={16} />} title="Clear Actions" className={styles.fileTreeBtn} />}
82:             menuClassName={styles.headerDropdownMenu} // Ensure this class exists or remove
83:           />
84:         </div>
85:         <Button variant="icon" size="sm" iconOnly startIcon={<RefreshCw size={16} />} onClick={onReloadFileTree} title="Reload" className={styles.fileTreeBtn} />
86:       </div>
87: 
88:       {excludedFilesCount !== undefined && excludedFilesCount > 0 && (
89:         <div className={styles.excludedFilesCount}>
90:           {excludedFilesCount} {excludedFilesCount === 1 ? 'file' : 'files'} excluded
91:         </div>
92:       )}
93:     </>
94:   );
95: };
96: 
97: export default FileTreeHeader; // Add default export if not already present
````

## File: src/components/IgnorePatterns.module.css
````css
  1: .modal {
  2:   position: fixed;
  3:   top: 0;
  4:   left: 0;
  5:   width: 100%;
  6:   height: 100%;
  7:   background-color: rgba(0, 0, 0, 0.5);
  8:   display: flex;
  9:   justify-content: center;
 10:   align-items: center;
 11:   z-index: var(--z-index-modal);
 12:   backdrop-filter: blur(4px);
 13:   animation: fadeIn 0.25s ease-out;
 14: }
 15: 
 16: .content {
 17:   background-color: var(--background-primary);
 18:   border-radius: 0.75rem;
 19:   width: 90%;
 20:   max-width: 700px;
 21:   max-height: 85vh;
 22:   padding: 1rem;
 23:   box-shadow: var(--shadow-lg);
 24:   overflow-y: auto;
 25:   animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
 26:   border: 1px solid var(--border-color);
 27:   scrollbar-width: thin;
 28:   scrollbar-color: var(--border-color) transparent;
 29: }
 30: 
 31: .content::-webkit-scrollbar {
 32:   width: 6px;
 33: }
 34: 
 35: .content::-webkit-scrollbar-track {
 36:   background: transparent;
 37: }
 38: 
 39: .content::-webkit-scrollbar-thumb {
 40:   background-color: var(--border-color);
 41:   border-radius: 4px;
 42:   border: 2px solid var(--background-primary);
 43: }
 44: 
 45: .header {
 46:   display: flex;
 47:   justify-content: space-between;
 48:   align-items: center;
 49:   margin-bottom: 12px;
 50: }
 51: 
 52: .header h2 {
 53:   margin: 0;
 54:   font-size: 1.2rem;
 55:   color: var(--text-primary);
 56:   font-weight: 600;
 57: }
 58: 
 59: .description {
 60:   margin-bottom: 12px;
 61:   font-size: 0.75rem;
 62:   color: var(--text-secondary);
 63:   line-height: 1.4;
 64: }
 65: 
 66: .scopeSelector {
 67:   display: flex;
 68:   margin-bottom: 10px;
 69:   border-bottom: 1px solid var(--border-color);
 70:   padding: 0 4px;
 71:   gap: 1px;
 72: }
 73: 
 74: .scopeBtn {
 75:   flex: 1;
 76:   border-radius: var(--radius) var(--radius) 0 0 !important;
 77:   font-size: 0.8rem !important;
 78:   padding: 6px 10px !important;
 79:   transition: all 0.15s ease-out;
 80: }
 81: 
 82: .scopeBtn:first-child {
 83:   border-top-right-radius: 0 !important;
 84: }
 85: 
 86: .scopeBtn:last-child {
 87:   border-top-left-radius: 0 !important;
 88: }
 89: 
 90: .scopeBtn:hover {
 91:   background-color: var(--hover-color);
 92:   opacity: 0.9;
 93: }
 94: 
 95: .scopeBtn.active {
 96:   font-weight: 500 !important;
 97:   position: relative;
 98: }
 99: 
100: .scopeBtn.active::after {
101:   content: "";
102:   position: absolute;
103:   bottom: -1px;
104:   left: 0;
105:   width: 100%;
106:   height: 2px;
107:   background-color: var(--accent-color);
108: }
109: 
110: .scopeDescription {
111:   margin-bottom: 12px;
112:   font-size: 0.75rem;
113:   color: var(--text-secondary);
114:   padding: 0 6px;
115: }
116: 
117: .folderSelector {
118:   margin-bottom: 12px;
119: }
120: 
121: .folderSelector label {
122:   display: block;
123:   margin-bottom: 4px;
124:   font-size: 0.8rem;
125:   font-weight: 500;
126:   color: var(--text-primary);
127: }
128: 
129: .customSelect {
130:   position: relative;
131:   width: 100%;
132:   cursor: pointer;
133: }
134: 
135: .selectedValue {
136:   display: flex;
137:   justify-content: space-between;
138:   align-items: center;
139:   padding: 6px 8px;
140:   background-color: var(--background-secondary);
141:   border: 1px solid var(--border-color);
142:   border-radius: var(--radius);
143:   font-size: 0.7rem;
144:   transition: border-color 0.2s;
145: }
146: 
147: .selectedValue:hover {
148:   border-color: var(--accent-color);
149: }
150: 
151: .chevron {
152:   transition: transform 0.2s;
153: }
154: 
155: .chevron.open {
156:   transform: rotate(180deg);
157: }
158: 
159: .optionsContainer {
160:   position: absolute;
161:   top: 100%;
162:   left: 0;
163:   right: 0;
164:   background-color: var(--background-primary);
165:   border: 1px solid var(--border-color);
166:   border-radius: var(--radius);
167:   box-shadow: var(--shadow-md);
168:   z-index: var(--z-index-dropdown);
169:   max-height: 180px;
170:   overflow-y: auto;
171: }
172: 
173: .option {
174:   padding: 6px 8px;
175:   font-size: 0.6rem;
176:   cursor: pointer;
177: }
178: 
179: .option:hover {
180:   background-color: var(--hover-color);
181: }
182: 
183: .pathDisplay {
184:   margin-top: 3px;
185:   font-size: 0.6rem;
186:   color: var(--text-secondary);
187:   font-family: monospace;
188: }
189: 
190: .patternsSection {
191:   margin-bottom: 16px;
192: }
193: 
194: .patternsInput:focus {
195:   outline: none;
196:   border-color: var(--accent-color);
197:   box-shadow: 0 0 0 1px var(--accent-color);
198: }
199: 
200: /* Styles for the react-simple-code-editor */
201: .editorContainer {
202:   position: relative;
203:   border: 1px solid var(--border-color);
204:   border-radius: var(--radius);
205:   overflow: hidden;
206:   margin-bottom: 12px;
207:   background-color: var(--background-secondary);
208: }
209: 
210: .patternsEditor {
211:   background-color: var(--background-secondary) !important;
212:   font-family: monospace !important;
213:   font-size: 0.75rem !important;
214:   line-height: 1.4 !important;
215:   padding: 8px !important;
216:   min-height: 140px !important;
217:   max-height: 200px !important;
218:   overflow-y: auto !important;
219:   position: relative !important;
220: }
221: 
222: .patternsEditor:focus-within,
223: .editorContainer:focus-within {
224:   border-color: var(--accent-color);
225:   box-shadow: 0 0 0 1px var(--accent-color);
226: }
227: 
228: .patternsEditorTextarea {
229:   font-family: monospace !important;
230:   padding: 8px !important;
231:   margin: 0 !important;
232:   position: absolute !important;
233:   top: 0 !important;
234:   left: 0 !important;
235:   height: 100% !important;
236:   width: 100% !important;
237:   resize: none !important;
238:   overflow: auto !important;
239:   white-space: pre !important;
240:   tab-size: 2 !important;
241:   line-height: 1.4 !important;
242:   letter-spacing: normal !important;
243:   text-rendering: auto !important;
244:   color: inherit !important;
245:   background-color: transparent !important;
246:   caret-color: var(--text-primary) !important;
247:   outline: none !important;
248: }
249: 
250: .patternsEditor::-webkit-scrollbar { width: var(--scrollbar-width); }
251: .patternsEditor::-webkit-scrollbar-track { background: var(--scrollbar-track-color); }
252: .patternsEditor::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb-color); border-radius: var(--radius-full); }
253: .patternsEditor::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-thumb-hover-color); }
254: .patternsEditor { scrollbar-width: thin; scrollbar-color: var(--scrollbar-thumb-color) var(--scrollbar-track-color); }
255: 
256: .patternsEditor .token.comment,
257: .patternsEditor .token.prolog,
258: .patternsEditor .token.doctype,
259: .patternsEditor .token.cdata {
260:   color: var(--text-secondary);
261:   font-style: italic;
262: }
263: 
264: .patternsEditor .token.punctuation {
265:   color: var(--text-secondary);
266: }
267: 
268: .patternsEditor pre,
269: .patternsEditor code {
270:   font-family: monospace !important;
271:   font-size: 0.75rem !important;
272:   line-height: 1.4 !important;
273:   padding: 0 !important;
274:   margin: 0 !important;
275:   white-space: pre !important;
276:   tab-size: 2 !important;
277: }
278: 
279: .patternComment {
280:   color: var(--text-secondary) !important;
281:   font-style: italic;
282: }
283: 
284: .patternsHelp {
285:   margin-top: 8px;
286:   font-size: 0.7rem;
287:   color: var(--text-secondary);
288: }
289: 
290: .patternsHelp p {
291:   margin: 4px 0;
292: }
293: 
294: .modalStatus {
295:   margin-bottom: 12px;
296:   font-size: 0.8rem;
297: }
298: 
299: .unsaved {
300:   color: var(--warning-color);
301:   font-style: italic;
302: }
303: 
304: .modalActions {
305:   display: flex;
306:   justify-content: space-between;
307:   margin-top: 12px;
308:   gap: 6px;
309: }
310: 
311: .modalActions button {
312:   font-size: 0.75rem !important;
313:   padding: 5px 8px !important;
314: }
315: 
316: .destructiveIcon {
317:   color: var(--error-color);
318:   margin-right: 4px;
319:   vertical-align: middle;
320:   width: 14px;
321:   height: 14px;
322: }
323: 
324: /* We'll override these with our Button component */
325: 
326: .systemPatterns {
327:   margin-top: 8px;
328:   margin-bottom: 12px;
329:   padding: 8px;
330:   background-color: var(--background-secondary);
331:   border: 1px solid var(--border-color);
332:   border-radius: var(--radius);
333: }
334: 
335: .systemPatterns h3 {
336:   margin: 0 0 8px 0;
337:   font-size: 0.85rem;
338:   font-weight: 600;
339: }
340: 
341: .systemPatternsList {
342:   margin: 0;
343:   padding: 0;
344:   list-style: none;
345:   max-height: 200px;
346:   overflow-y: auto;
347: }
348: 
349: .systemPatternItem {
350:   display: flex;
351:   align-items: center;
352:   padding: 4px 6px;
353:   margin-bottom: 2px;
354:   border-radius: 3px;
355:   font-size: 0.7rem;
356:   font-family: monospace;
357:   transition: background-color 0.15s;
358: }
359: 
360: .systemPatternItem:hover {
361:   background-color: var(--hover-color);
362: }
363: 
364: .toggleButton {
365:   margin-right: 6px;
366:   border: none;
367:   background: none;
368:   cursor: pointer;
369:   display: flex;
370:   align-items: center;
371:   justify-content: center;
372:   padding: 2px;
373:   border-radius: 3px;
374:   width: 20px;
375:   height: 20px;
376:   color: var(--text-primary);
377:   transition: background-color 0.2s, color 0.2s;
378: }
379: 
380: .toggleButton:hover {
381:   background-color: var(--hover-color);
382:   color: var(--accent-color);
383: }
384: 
385: .disabledPattern {
386:   text-decoration: line-through;
387:   opacity: 0.5;
388: }
389: 
390: .previewSection {
391:   margin-top: 12px;
392:   margin-bottom: 12px;
393: }
394: 
395: .previewContainer {
396:   max-height: 180px;
397:   overflow-y: auto;
398:   padding: 8px;
399:   border: 1px solid var(--border-color);
400:   border-radius: var(--radius);
401:   background-color: var(--background-secondary);
402:   font-family: monospace;
403:   font-size: 0.7rem;
404: }
405: 
406: /* Make the scrollbar look consistent */
407: .previewContainer::-webkit-scrollbar {
408:   width: 6px;
409: }
410: 
411: .previewContainer::-webkit-scrollbar-track {
412:   background: transparent;
413: }
414: 
415: .previewContainer::-webkit-scrollbar-thumb {
416:   background-color: var(--border-color-lighter);
417:   border-radius: 3px;
418: }
419: 
420: .previewContainer {
421:   scrollbar-width: thin;
422:   scrollbar-color: var(--border-color-lighter) transparent;
423: }
424: 
425: .previewHeader {
426:   display: flex;
427:   justify-content: space-between;
428:   align-items: center;
429:   margin-bottom: 6px;
430:   font-size: 0.75rem;
431:   font-weight: 600;
432: }
433: 
434: .patternCount {
435:   font-size: 0.65rem;
436:   color: var(--text-secondary);
437:   padding: 2px 4px;
438:   border-radius: 3px;
439:   background-color: var(--background-secondary);
440: }
441: 
442: .previewLine {
443:   display: flex;
444:   align-items: center;
445:   padding: 2px 0;
446:   margin: 1px 0;
447:   font-size: 0.7rem;
448:   line-height: 1.3;
449: }
450: 
451: .previewPatternText {
452:   flex: 1;
453:   white-space: nowrap;
454:   overflow: hidden;
455:   text-overflow: ellipsis;
456: }
457: 
458: .previewBadge {
459:   font-size: 0.6rem;
460:   padding: 1px 3px;
461:   border-radius: 2px;
462:   margin-left: 4px;
463:   color: var(--text-primary);
464:   background-color: var(--accent-color);
465:   opacity: 0.7;
466: }
467: 
468: .previewBadgeLocal {
469:   background-color: var(--success-color);
470:   opacity: 0.7;
471: }
472: 
473: .previewComment {
474:   color: var(--text-secondary);
475:   font-style: italic;
476:   font-size: 0.65rem;
477: }
478: 
479: .previewSeparator {
480:   height: 4px;
481:   margin: 2px 0;
482: }
483: 
484: .previewUnknown {
485:   color: var(--error-color);
486:   opacity: 0.8;
487: }
488: 
489: .notification {
490:   position: fixed;
491:   bottom: 20px;
492:   right: 20px;
493:   padding: 12px 16px;
494:   border-radius: var(--radius);
495:   background-color: var(--background-primary);
496:   color: var(--text-primary);
497:   box-shadow: var(--shadow-md);
498:   transform: translateY(100%);
499:   opacity: 0;
500:   transition: transform 0.3s ease, opacity 0.3s ease;
501:   z-index: var(--z-index-modal);
502: }
503: 
504: .notification.visible {
505:   transform: translateY(0);
506:   opacity: 1;
507: }
508: 
509: .notification.success {
510:   border-left: 4px solid var(--success-color);
511: }
512: 
513: .notification.error {
514:   border-left: 4px solid var(--error-color);
515: }
516: 
517: @keyframes slideIn {
518:   from {
519:     transform: scaleX(0);
520:   }
521:   to {
522:     transform: scaleX(1);
523:   }
524: }
525: 
526: @keyframes fadeIn {
527:   from {
528:     opacity: 0;
529:   }
530:   to {
531:     opacity: 1;
532:   }
533: }
534: 
535: @keyframes slideUp {
536:   from {
537:     opacity: 0;
538:     transform: translateY(20px);
539:   }
540:   to {
541:     opacity: 1;
542:     transform: translateY(0);
543:   }
544: }
545: 
546: @keyframes togglePulse {
547:   0% { transform: scale(1); }
548:   50% { transform: scale(1.05); }
549:   100% { transform: scale(1); }
550: }
551: 
552: .patternCategory {
553:   border: 1px solid var(--border-color);
554:   border-radius: var(--radius);
555:   overflow: hidden;
556:   margin-bottom: 8px;
557:   transition: box-shadow 0.2s;
558: }
559: 
560: .patternCategory:hover {
561:   box-shadow: var(--shadow-sm);
562: }
563: 
564: .categoryHeader {
565:   display: flex;
566:   align-items: center;
567:   padding: 6px 8px;
568:   background-color: var(--background-secondary);
569:   cursor: pointer;
570:   user-select: none;
571:   transition: background-color 0.2s;
572:   justify-content: space-between;
573: }
574: 
575: .categoryTitle {
576:   font-weight: 600;
577:   color: var(--text-primary);
578:   font-size: 0.75rem;
579:   margin-right: 6px;
580: }
581: 
582: .categoryMeta {
583:   display: flex;
584:   align-items: center;
585:   justify-content: flex-end;
586:   flex-shrink: 0;
587: }
588: 
589: .categoryCount {
590:   font-size: 0.65rem;
591:   color: var(--text-secondary);
592:   padding: 1px 3px;
593:   border-radius: 2px;
594:   background-color: var(--background-tertiary, rgba(0, 0, 0, 0.05));
595: }
596: 
597: .accordionIcon {
598:   transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
599:   position: relative;
600: }
601: 
602: .accordionIcon.rotated {
603:   transform: rotate(180deg);
604: }
605: 
606: .accordionIcon.rotated path:last-child {
607:   opacity: 0;
608:   transition: opacity 0.15s ease;
609: }
610: 
611: .accordionIcon path:last-child {
612:   transform-origin: center;
613:   transition: opacity 0.2s ease;
614: }
615: 
616: .chevron {
617:   transition: transform 0.3s ease;
618: }
619: 
620: .chevronRotated {
621:   transform: rotate(180deg);
622: }
623: 
624: .categoryItems {
625:   max-height: 0;
626:   overflow: hidden;
627:   transform: translateY(-10px);
628:   opacity: 0;
629:   transition: 
630:     max-height 0.25s cubic-bezier(0.4, 0.0, 0.2, 1), 
631:     padding 0.2s cubic-bezier(0.4, 0.0, 0.2, 1),
632:     opacity 0.15s ease,
633:     transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
634: }
635: 
636: .categoryExpanded .categoryItems {
637:   max-height: 2000px;
638:   transform: translateY(0);
639:   opacity: 1;
640:   transition: 
641:     max-height 0.35s cubic-bezier(0.4, 0.0, 0.2, 1), 
642:     padding 0.2s cubic-bezier(0.4, 0.0, 0.2, 1),
643:     opacity 0.2s ease,
644:     transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
645:   padding: 8px 12px;
646: }
647: 
648: .smallerSwitch {
649:   transform: scale(0.65);
650:   transform-origin: right center;
651:   margin-left: auto;
652: }
653: 
654: .buttonGroup {
655:   display: flex;
656:   flex-wrap: wrap;
657:   gap: 4px;
658:   margin-top: 6px;
659: }
660: 
661: .buttonGroup button {
662:   font-size: 0.7rem;
663:   flex: 1 0 calc(50% - 4px); /* Make buttons take up half the width minus the gap */
664:   min-width: 80px;
665: }
666: 
667: .previewContent {
668:   margin-top: 8px;
669:   padding: 12px;
670:   background: var(--background);
671:   border-radius: 4px;
672:   font-family: monospace;
673:   white-space: pre-wrap;
674:   max-height: 200px;
675:   overflow-y: auto;
676: }
677: 
678: .hint {
679:   color: var(--text-secondary);
680:   font-size: 0.9em;
681:   margin: 8px 0;
682: }
683: 
684: /* Additional animation for the toggle */
685: .patternToggled {
686:   animation: togglePulse 0.3s ease;
687: }
688: 
689: .sectionTitle {
690:   margin-bottom: 16px;
691:   font-size: 0.9rem;
692:   font-weight: 500;
693:   color: var(--text-primary);
694: }
695: 
696: .closeButton {
697:   padding: 6px !important;
698:   border-radius: 6px;
699:   display: flex;
700:   align-items: center;
701:   justify-content: center;
702:   color: var(--text-secondary);
703:   transition: all 0.15s ease;
704: }
705: 
706: .closeButton:hover {
707:   background-color: var(--hover-color);
708:   color: var(--text-primary);
709: }
710: 
711: /* Visual feedback for saving operations */
712: .saveSuccess {
713:   animation: saveSuccessFlash 0.5s ease;
714: }
715: 
716: .saveError {
717:   animation: saveErrorFlash 0.5s ease;
718: }
719: 
720: .saveMessage {
721:   position: absolute;
722:   bottom: 1rem;
723:   left: 50%;
724:   transform: translateX(-50%);
725:   background-color: var(--accent-color);
726:   color: white;
727:   padding: 0.5rem 1rem;
728:   border-radius: var(--radius);
729:   font-size: 0.9rem;
730:   animation: fadeInUp 0.3s ease;
731:   z-index: 10;
732:   box-shadow: var(--shadow-md);
733: }
734: 
735: .errorMessage {
736:   background-color: var(--error-color);
737: }
738: 
739: @keyframes saveSuccessFlash {
740:   0% { background-color: var(--background-primary); }
741:   30% { background-color: rgba(46, 160, 67, 0.15); }
742:   100% { background-color: var(--background-primary); }
743: }
744: 
745: @keyframes saveErrorFlash {
746:   0% { background-color: var(--background-primary); }
747:   30% { background-color: rgba(248, 81, 73, 0.15); }
748:   100% { background-color: var(--background-primary); }
749: }
750: 
751: @keyframes fadeInUp {
752:   from { 
753:     opacity: 0;
754:     transform: translate(-50%, 1rem);
755:   }
756:   to { 
757:     opacity: 1;
758:     transform: translate(-50%, 0);
759:   }
760: }
761: 
762: .patternEntrySection {
763:   margin-bottom: 1.5rem;
764:   position: relative;
765: }
766: 
767: .sectionHeader {
768:   display: flex;
769:   justify-content: space-between;
770:   align-items: center;
771:   margin-bottom: 0.75rem; /* Space between header and editor */
772: }
773: 
774: .timestamp {
775:   font-size: 0.8rem;
776:   color: var(--text-secondary);
777:   font-style: italic;
778: }
779: 
780: .loadingIndicator {
781:   font-size: 0.8rem;
782:   color: var(--text-secondary);
783:   font-style: italic;
784:   /* Add a subtle animation if desired */
785:   animation: pulse 1.5s infinite ease-in-out;
786: }
787: 
788: /* Optional pulsing animation for loading indicator */
789: @keyframes pulse {
790:   0%, 100% { opacity: 1; }
791:   50% { opacity: 0.5; }
792: }
793: 
794: /* Style for the test button specifically */
795: .testButton {
796:   display: flex;
797:   align-items: center;
798:   gap: 6px; /* Space between icon and text */
799: }
800: 
801: .loadingIcon {
802:   animation: spin 1s linear infinite;
803: }
804: 
805: @keyframes spin {
806:   from { transform: rotate(0deg); }
807:   to { transform: rotate(360deg); }
808: }
809: 
810: /* Test Results Section */
811: .testResultsSection {
812:   margin-top: 1.5rem;
813:   border-top: 1px solid var(--border-color);
814:   padding-top: 1rem;
815: }
816: 
817: .testResultsHeader {
818:   font-size: 1rem;
819:   font-weight: 600;
820:   margin-bottom: 0.75rem;
821:   color: var(--text-primary);
822: }
823: 
824: .testResultsList {
825:   max-height: 150px; /* Limit height */
826:   overflow-y: auto;
827:   border: 1px solid var(--border-color);
828:   border-radius: var(--radius);
829:   padding: 0.5rem;
830:   background-color: var(--background-secondary);
831:   font-family: monospace;
832:   font-size: 0.8rem;
833: }
834: 
835: /* Test results scrollbar */
836: .testResultsList::-webkit-scrollbar {
837:   width: 6px;
838: }
839: .testResultsList::-webkit-scrollbar-track {
840:   background: transparent;
841: }
842: .testResultsList::-webkit-scrollbar-thumb {
843:   background-color: var(--border-color-lighter);
844:   border-radius: 3px;
845: }
846: .testResultsList {
847:   scrollbar-width: thin;
848:   scrollbar-color: var(--border-color-lighter) transparent;
849: }
850: 
851: .testResultItem {
852:   padding: 2px 4px;
853:   margin-bottom: 2px;
854:   white-space: nowrap;
855:   overflow: hidden;
856:   text-overflow: ellipsis;
857:   border-radius: 3px;
858: }
859: 
860: .testError {
861:   color: var(--error-color);
862:   background-color: rgba(var(--error-color-rgb), 0.1);
863:   padding: 0.5rem;
864:   border-radius: var(--radius);
865: }
866: 
867: .noResults {
868:   color: var(--text-secondary);
869:   font-style: italic;
870:   padding: 0.5rem;
871: }
````

## File: src/components/IgnorePatterns.tsx
````typescript
  1: import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
  2: import { ChevronDown, Plus, X, Play, Loader2 } from "lucide-react";
  3: import Editor from 'react-simple-code-editor';
  4: import Prism from 'prismjs';
  5: import 'prismjs/components/prism-clike';
  6: import 'prismjs/components/prism-ignore';
  7: import 'prismjs/themes/prism.css';
  8: import 'prismjs/themes/prism-tomorrow.css';
  9: import { Button, Switch } from "./ui";
 10: import { ErrorBoundary } from './ErrorBoundary';
 11: import styles from "./IgnorePatterns.module.css";
 12: import { SYSTEM_PATTERN_CATEGORIES, IgnorePatternsState } from "../utils/patternUtils";
 13: 
 14: // Props interface - Updated
 15: interface IgnorePatternsProps {
 16:   isOpen: boolean;
 17:   onClose: () => void;
 18:   // Pass the full state objects
 19:   globalPatternsState: IgnorePatternsState;
 20:   localPatternsState: IgnorePatternsState; // Only 'patterns' part is relevant here
 21:   localFolderPath?: string;
 22:   processingStatus?: {
 23:     status: "idle" | "processing" | "complete" | "error";
 24:     message: string;
 25:   };
 26:   // Callbacks to App.tsx
 27:   saveIgnorePatterns: (patterns: string, isGlobal: boolean, folderPath?: string) => Promise<void>;
 28:   resetIgnorePatterns: (isGlobal: boolean, folderPath?: string) => Promise<void>;
 29:   clearIgnorePatterns: (folderPath: string) => Promise<void>;
 30:   // For controlling excluded system patterns
 31:   onExcludedSystemPatternsChange: (patterns: string[]) => void;
 32:   systemIgnorePatterns: string[]; // Full list of available system patterns
 33:   recentFolders: string[];
 34: }
 35: 
 36: // Custom error for pattern validation
 37: class PatternValidationError extends Error {
 38:  constructor(message: string) {
 39:   super(message);
 40:   this.name = 'PatternValidationError';
 41:  }
 42: }
 43: 
 44: // Validates a glob pattern for syntax errors
 45: const validatePattern = (pattern: string): boolean => {
 46:   if (!pattern.trim()) {
 47:    throw new PatternValidationError(`Invalid pattern: Pattern cannot be empty`);
 48:   }
 49:   return true;
 50: };
 51: 
 52: // Add type for test results
 53: interface PatternTestResult {
 54:   ignoredCount: number;
 55:   ignoredFiles: string[];
 56:   totalFilesChecked: number;
 57: }
 58: 
 59: const IgnorePatternsWithErrorBoundary: React.FC<IgnorePatternsProps> = (props) => (
 60:   <ErrorBoundary fallback={ <div>Error loading ignore patterns component.</div> }>
 61:     <IgnorePatterns {...props} />
 62:   </ErrorBoundary>
 63: );
 64: 
 65: // Add a helper function to truncate file paths to show only username
 66: const truncatePath = (path: string): string => {
 67:   if (!path) return '';
 68:   
 69:   // For macOS/Linux paths
 70:   if (path.startsWith('/')) {
 71:     const parts = path.split('/');
 72:     // Get username part (usually the third part in /Users/username/...)
 73:     if (parts.length >= 3 && parts[1] === 'Users') {
 74:       return `~/${parts.slice(3).join('/')}`;
 75:     }
 76:   }
 77:   
 78:   // For Windows paths
 79:   if (path.includes(':\\')) {
 80:     const parts = path.split('\\');
 81:     const userIndex = parts.findIndex(part => part === 'Users') + 1;
 82:     if (userIndex > 0 && userIndex < parts.length) {
 83:       return `~\\${parts.slice(userIndex + 1).join('\\')}`;
 84:     }
 85:   }
 86:   
 87:   // Simple fallback for other paths
 88:   const pathParts = path.split(/[/\\]/); // Removed unnecessary escape for /
 89:   return `.../${pathParts[pathParts.length - 1]}`;
 90: };
 91: 
 92: const IgnorePatterns: React.FC<IgnorePatternsProps> = ({
 93:   isOpen,
 94:   onClose,
 95:   globalPatternsState, // Now an object { patterns, excludedSystemPatterns }
 96:   localPatternsState,  // Now an object { patterns, excludedSystemPatterns } (but we only use patterns)
 97:   localFolderPath,
 98:   processingStatus = { status: "idle", message: "" },
 99:   saveIgnorePatterns,
100:   resetIgnorePatterns,
101:   clearIgnorePatterns,
102:   onExcludedSystemPatternsChange,
103:   systemIgnorePatterns,
104:   recentFolders,
105: }) => {
106:   /**
107:    * Component State Management
108:    */
109:   const isInitialized = useRef(false);
110: 
111:   // Use safe initializers for useState, relying on useEffect for sync
112:   const [currentGlobalPatterns, setCurrentGlobalPatterns] = useState<string>('');
113:   const [currentLocalPatterns, setCurrentLocalPatterns] = useState<string>('');
114:   const [mergedPreview, setMergedPreview] = useState<Array<{ pattern: string; source: string }>>([]);
115:   const [activeTab, setActiveTab] = useState<"global" | "local">("global");
116:   const [selectedFolder, setSelectedFolder] = useState<string | undefined>(localFolderPath);
117:   const [applyingPatterns, setApplyingPatterns] = useState<boolean>(false);
118:   const [folderSelectOpen, setFolderSelectOpen] = useState(false);
119:   const [actualPatternCount, setActualPatternCount] = useState<number>(0);
120:   const [lastSavedGlobal, setLastSavedGlobal] = useState<Date | null>(null);
121:   const [lastSavedLocal, setLastSavedLocal] = useState<Record<string, Date | null>>({}); // Store by folder path
122:   const [isLoadingPatterns, setIsLoadingPatterns] = useState<boolean>(false);
123:   const [isTestingPatterns, setIsTestingPatterns] = useState<boolean>(false);
124:   const [testResults, setTestResults] = useState<PatternTestResult | null>(null);
125:   const [testError, setTestError] = useState<string | null>(null);
126: 
127:   // Add ref for the editor container
128:   const editorContainerRef = useRef<HTMLDivElement>(null);
129: 
130:   // Derive excluded patterns directly from props for controlled behavior
131:   // Add safe fallback for initial render if globalPatternsState is somehow undefined briefly
132:   const excludedSystemPatterns = useMemo(() => globalPatternsState?.excludedSystemPatterns || [], [globalPatternsState]);
133: 
134:   // Initialize with all categories collapsed
135:   const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
136:     Object.keys(SYSTEM_PATTERN_CATEGORIES).reduce((acc, category) => ({ ...acc, [category]: false }), {})
137:   );
138: 
139:   /**
140:    * Sync internal state with props when modal opens or props change
141:    */
142:   useEffect(() => {
143:     if (isOpen) {
144:       // Safely access props, providing defaults if undefined during initial render cycle
145:       setCurrentGlobalPatterns(globalPatternsState?.patterns ?? '');
146:       if (selectedFolder === localFolderPath) {
147:           setCurrentLocalPatterns(localPatternsState?.patterns ?? '');
148:       } else if (!isInitialized.current) {
149:           setCurrentLocalPatterns(''); // Start fresh if different folder on init
150:       }
151:       setSelectedFolder(localFolderPath); // Sync selected folder
152:       setApplyingPatterns(processingStatus.status === 'processing');
153: 
154:       if (!isInitialized.current) {
155:         isInitialized.current = true;
156:       }
157:     } else {
158:       // Reset init flag when closed
159:       isInitialized.current = false;
160:     }
161:   }, [isOpen, globalPatternsState, localPatternsState, localFolderPath, processingStatus, selectedFolder]); // Ensure all relevant props are dependencies
162: 
163: 
164:   // Generate merged preview - Refined logic
165:   useEffect(() => {
166:     // 1. Get all potential patterns sources
167:     const currentGlobalEdit = currentGlobalPatterns.split('\n').filter(p => p.trim());
168:     const currentLocalEdit = currentLocalPatterns.split('\n').filter(p => p.trim());
169:     
170:     // Use props for saved state, providing defaults
171:     const savedGlobalPatterns = (globalPatternsState?.patterns ?? '').split('\n').filter(p => p.trim());
172:     const savedLocalPatterns = (localPatternsState?.patterns ?? '').split('\n').filter(p => p.trim());
173:     const safeExcludedSystem = Array.isArray(excludedSystemPatterns) ? excludedSystemPatterns : [];
174:     const activeSystemPatterns = systemIgnorePatterns.filter(p => !safeExcludedSystem.includes(p));
175: 
176:     // 2. Determine active patterns based on the *current* tab
177:     // Use edits for the active tab, saved state for the inactive tab
178:     const activeGlobal = (activeTab === 'global') ? currentGlobalEdit : savedGlobalPatterns;
179:     const activeLocal = (activeTab === 'local') ? currentLocalEdit : savedLocalPatterns;
180: 
181:     // 3. Combine and deduplicate, tracking source (System > Global > Local precedence)
182:     const effectivePatterns = new Map<string, 'system' | 'global' | 'local'>();
183: 
184:     // Add system patterns first
185:     activeSystemPatterns.forEach(p => effectivePatterns.set(p, 'system'));
186:     
187:     // Add global patterns (overwriting system if duplicate)
188:     activeGlobal.forEach(p => effectivePatterns.set(p, 'global'));
189:     
190:     // Add local patterns (overwriting global/system if duplicate)
191:     // Only add local patterns if a folder is selected
192:     if (selectedFolder) {
193:       activeLocal.forEach(p => effectivePatterns.set(p, 'local'));
194:     }
195: 
196:     // 4. Build the preview string array with source indicators
197:     const previewLines: { pattern: string; source: string }[] = [];
198:     
199:     // Group by source for clarity in preview
200:     const systemLines = Array.from(effectivePatterns.entries()).filter(([, src]) => src === 'system').map(([pat]) => ({ pattern: pat, source: 'system' }));
201:     const globalLines = Array.from(effectivePatterns.entries()).filter(([, src]) => src === 'global').map(([pat]) => ({ pattern: pat, source: 'global' }));
202:     const localLines = Array.from(effectivePatterns.entries()).filter(([, src]) => src === 'local').map(([pat]) => ({ pattern: pat, source: 'local' }));
203: 
204:     if (systemLines.length > 0) {
205:       previewLines.push({ pattern: "# --- System Patterns ---", source: 'comment' });
206:       previewLines.push(...systemLines);
207:     }
208:     if (globalLines.length > 0) {
209:       if (previewLines.length > 0) previewLines.push({ pattern: "", source: 'comment' }); // separator
210:       previewLines.push({ pattern: "# --- Global Patterns ---", source: 'comment' });
211:       previewLines.push(...globalLines);
212:     }
213:     if (localLines.length > 0) {
214:       if (previewLines.length > 0) previewLines.push({ pattern: "", source: 'comment' }); // separator
215:       previewLines.push({ pattern: "# --- Local Patterns ---", source: 'comment' });
216:       previewLines.push(...localLines);
217:     }
218: 
219:     // Store the preview data (more structured now)
220:     // We'll adapt the rendering logic below
221:     setMergedPreview(previewLines); // Assuming setMergedPreview can handle this array
222:     setActualPatternCount(effectivePatterns.size);
223: 
224:   }, [activeTab, currentGlobalPatterns, currentLocalPatterns, globalPatternsState, localPatternsState, systemIgnorePatterns, excludedSystemPatterns, selectedFolder]); // Added selectedFolder dependency
225: 
226:   // Effect to update last saved time when props indicate a save might have occurred elsewhere
227:   // (This is a basic check, might need refinement based on actual app logic)
228:   useEffect(() => {
229:     // Placeholder: If we had timestamps from props, we'd sync them here.
230:     // For now, we'll rely on setting it during save actions within this component.
231:   }, [globalPatternsState, localPatternsState]);
232: 
233:   // Effect to handle initial loading state
234:   useEffect(() => {
235:     if (isOpen) {
236:       setIsLoadingPatterns(true);
237:       // Simulate loading delay or use actual loading status from props if available
238:       const timer = setTimeout(() => setIsLoadingPatterns(false), 300); // Adjust delay as needed
239:       return () => clearTimeout(timer);
240:     }
241:   }, [isOpen, activeTab, selectedFolder]); // Reload when tab or folder changes
242: 
243:   // Effect to clear test results when inputs change or modal closes
244:   useEffect(() => {
245:     if (!isOpen) {
246:       setTestResults(null);
247:       setTestError(null);
248:     }
249:   }, [isOpen]);
250: 
251:   useEffect(() => {
252:     // Clear results if patterns or folder change
253:     setTestResults(null);
254:     setTestError(null);
255:   }, [currentGlobalPatterns, currentLocalPatterns, selectedFolder, excludedSystemPatterns]);
256: 
257:   /**
258:    * Event Handlers
259:    */
260:   const handleTabChange = (isGlobal: boolean) => setActiveTab(isGlobal ? "global" : "local");
261: 
262:   const handleFolderChange = (folderPath: string) => {
263:     setSelectedFolder(folderPath);
264:     setFolderSelectOpen(false);
265:     if (folderPath === localFolderPath) {
266:        // Safely access patterns from prop state
267:        setCurrentLocalPatterns(localPatternsState?.patterns ?? '');
268:     } else {
269:        setCurrentLocalPatterns('');
270:        console.warn("Selecting a different folder than the App's current one. Local patterns shown are temporary until saved for that specific folder.");
271:     }
272:   };
273: 
274:   const toggleCategory = (category: string) => {
275:     setExpandedCategories(prev => ({ ...prev, [category]: !prev[category] }));
276:   };
277: 
278:   // System pattern management - Calls the callback prop
279:   const handleToggleSystemPattern = useCallback((pattern: string) => {
280:     try {
281:       validatePattern(pattern);
282:        // Ensure excludedSystemPatterns is an array before operating on it
283:       const safeExcluded = Array.isArray(excludedSystemPatterns) ? excludedSystemPatterns : [];
284:       const newExcluded = safeExcluded.includes(pattern)
285:         ? safeExcluded.filter(p => p !== pattern)
286:         : [...safeExcluded, pattern];
287:       onExcludedSystemPatternsChange(newExcluded); // Update App state
288: 
289:       // Visual feedback (optional)
290:       const patternElement = document.querySelector(`[data-pattern="${pattern}"]`);
291:       if (patternElement) {
292:         patternElement.classList.add(styles.patternToggled);
293:         setTimeout(() => patternElement.classList.remove(styles.patternToggled), 300);
294:       }
295:     } catch (error) {
296:       console.error('Error toggling pattern:', error);
297:       if (error instanceof PatternValidationError) console.warn('Pattern validation failed:', error.message);
298:     }
299:   }, [excludedSystemPatterns, onExcludedSystemPatternsChange]); // Use derived excludedSystemPatterns
300: 
301:   // Pattern saving handlers - Use current local edits + props
302:   const handleSaveGlobalPatterns = useCallback(async () => {
303:     try {
304:       setApplyingPatterns(true);
305:       const userPatterns = currentGlobalPatterns.split('\n').filter(p => p.trim());
306:       userPatterns.forEach(validatePattern);
307: 
308:       // Format disabled patterns using the derived prop value
309:       const safeExcluded = Array.isArray(excludedSystemPatterns) ? excludedSystemPatterns : [];
310:       
311:       // Format disabled patterns section - each disabled pattern on its own line
312:       const disabledPatternsSection = safeExcluded
313:         .map(pattern => `# DISABLED: ${pattern}`)
314:         .join('\n');
315: 
316:       // Add user patterns with proper header
317:       let formattedContent = '';
318:       
319:       // Add the disabled patterns first
320:       if (disabledPatternsSection) {
321:         formattedContent += disabledPatternsSection + '\n\n';
322:       }
323:       
324:       // Then add user patterns with header
325:       if (currentGlobalPatterns.trim()) {
326:         formattedContent += '# USER PATTERNS:\n' + currentGlobalPatterns.trim();
327:       }
328: 
329:       await saveIgnorePatterns(formattedContent, true);
330:       setApplyingPatterns(false);
331:       setLastSavedGlobal(new Date()); // Set timestamp on success
332:       // Return success for handleSave
333:       return { success: true };
334:     } catch (error) {
335:       console.error('Error saving global patterns:', error);
336:       setApplyingPatterns(false);
337:       // Propagate error
338:       throw error; 
339:     }
340:   }, [currentGlobalPatterns, excludedSystemPatterns, saveIgnorePatterns]);
341: 
342:   const handleSaveLocalPatterns = useCallback(async () => {
343:     try {
344:       if (!selectedFolder) {
345:         throw new Error('No folder selected for local patterns');
346:       }
347:       setApplyingPatterns(true);
348:       
349:       // Save the patterns and get the result
350:       const result = await saveIgnorePatterns(currentLocalPatterns, false, selectedFolder);
351:       
352:       // Add visual feedback using the editorContainerRef
353:       if (editorContainerRef.current) {
354:         editorContainerRef.current.classList.add(styles.saveSuccess);
355:         setTimeout(() => {
356:           if (editorContainerRef.current) {
357:             editorContainerRef.current.classList.remove(styles.saveSuccess);
358:           }
359:         }, 500);
360:       }
361:       
362:       setApplyingPatterns(false);
363:       setLastSavedLocal(prev => ({ ...prev, [selectedFolder]: new Date() })); // Set timestamp
364:       return result; // Return result from saveIgnorePatterns
365:     } catch (error) {
366:       console.error('Error saving local patterns:', error);
367:       setApplyingPatterns(false);
368:       
369:       // Add visual error feedback using the editorContainerRef
370:       if (editorContainerRef.current) {
371:         editorContainerRef.current.classList.add(styles.saveError);
372:         setTimeout(() => {
373:           if (editorContainerRef.current) {
374:             editorContainerRef.current.classList.remove(styles.saveError);
375:           }
376:         }, 500);
377:       }
378:       
379:       throw error;
380:     }
381:   }, [currentLocalPatterns, selectedFolder, saveIgnorePatterns]);
382: 
383:   const handleSave = useCallback(async () => {
384:     let success = false;
385:     try {
386:       let result;
387:       if (activeTab === 'global') {
388:         result = await handleSaveGlobalPatterns();
389:       } else {
390:         result = await handleSaveLocalPatterns();
391:       }
392:       // Check if save was successful (assuming handlers return { success: true } or similar)
393:       success = result?.success ?? true; // Default to true if no explicit success field
394: 
395:       if (success) {
396:         // Add status message for user feedback
397:         const message = document.createElement('div');
398:         message.className = styles.saveMessage;
399:         message.textContent = `${activeTab === 'global' ? 'Global' : 'Local'} patterns saved successfully`;
400:         
401:         const container = document.querySelector(`.${styles.patternEntrySection}`);
402:         if (container) {
403:           container.appendChild(message);
404:           setTimeout(() => {
405:             if (container.contains(message)) {
406:               container.removeChild(message);
407:             }
408:           }, 2000);
409:         }
410:       }
411:     } catch (error) {
412:       console.error('Failed to save patterns:', error);
413:       
414:       // Show error message - Check if error is an instance of Error
415:       const message = document.createElement('div');
416:       message.className = `${styles.saveMessage} ${styles.errorMessage}`;
417:       const errorMessage = error instanceof Error ? error.message : 'Failed to save patterns';
418:       message.textContent = `Error: ${errorMessage}`;
419:       
420:       const container = document.querySelector(`.${styles.patternEntrySection}`);
421:       if (container) {
422:         container.appendChild(message);
423:         setTimeout(() => {
424:           if (container.contains(message)) {
425:             container.removeChild(message);
426:           }
427:         }, 3000);
428:       }
429:     }
430:   }, [activeTab, handleSaveGlobalPatterns, handleSaveLocalPatterns]);
431: 
432:   // Keyboard shortcuts
433:   useEffect(() => {
434:     const handleKeyDown = (e: KeyboardEvent) => {
435:       if ((e.ctrlKey || e.metaKey) && e.key === 's') {
436:         e.preventDefault();
437:         handleSave();
438:       }
439:     };
440:     document.addEventListener('keydown', handleKeyDown);
441:     return () => document.removeEventListener('keydown', handleKeyDown);
442:   }, [handleSave]);
443: 
444:   const handleClearLocal = useCallback(async () => {
445:     try {
446:       if (!selectedFolder) {
447:         throw new Error('No folder selected for local patterns');
448:       }
449:       setApplyingPatterns(true);
450:       await clearIgnorePatterns(selectedFolder);
451:       setCurrentLocalPatterns(''); // Clear the textarea
452:       setLastSavedLocal(prev => ({ ...prev, [selectedFolder]: null })); // Clear timestamp
453:       setApplyingPatterns(false);
454:       // Add feedback message
455:       const message = document.createElement('div');
456:       message.className = styles.saveMessage;
457:       message.textContent = `Local patterns cleared successfully`;
458:       
459:       const container = document.querySelector(`.${styles.patternEntrySection}`);
460:       if (container) {
461:         container.appendChild(message);
462:         setTimeout(() => {
463:           if (container.contains(message)) {
464:             container.removeChild(message);
465:           }
466:         }, 2000);
467:       }
468:     } catch (error) {
469:       console.error('Error clearing local patterns:', error);
470:       setApplyingPatterns(false);
471:     }
472:   }, [selectedFolder, clearIgnorePatterns]);
473: 
474:   const handleResetLocal = useCallback(async () => {
475:     try {
476:       if (!selectedFolder) {
477:         throw new Error('No folder selected for local patterns');
478:       }
479:       setApplyingPatterns(true);
480:       await resetIgnorePatterns(false, selectedFolder);
481:       // Patterns will reload via event, maybe update timestamp based on that?
482:       // For now, let's clear it as we don't know the *exact* save time of the reset default
483:       setLastSavedLocal(prev => ({ ...prev, [selectedFolder]: null })); 
484:       setApplyingPatterns(false);
485:       // Add feedback message
486:       const message = document.createElement('div');
487:       message.className = styles.saveMessage;
488:       message.textContent = `Local patterns reset successfully`;
489:       
490:       const container = document.querySelector(`.${styles.patternEntrySection}`);
491:       if (container) {
492:         container.appendChild(message);
493:         setTimeout(() => {
494:           if (container.contains(message)) {
495:             container.removeChild(message);
496:           }
497:         }, 2000);
498:       }
499:     } catch (error) {
500:       console.error('Error resetting local patterns:', error);
501:       setApplyingPatterns(false);
502:     }
503:   }, [selectedFolder, resetIgnorePatterns]);
504: 
505:   const handleTestPatterns = useCallback(async () => {
506:     if (!selectedFolder) {
507:       setTestError("Please select a local folder to test patterns.");
508:       return;
509:     }
510: 
511:     setIsTestingPatterns(true);
512:     setTestResults(null); // Clear previous results
513:     setTestError(null);
514: 
515:     try {
516:       // 1. Construct the effective patterns (similar to preview logic)
517:       const currentGlobalEdit = currentGlobalPatterns.split('\n').filter(p => p.trim());
518:       // const currentLocalEdit = currentLocalPatterns.split('\n').filter(p => p.trim()); // Unused
519:       // const savedGlobalPatterns = (globalPatternsState?.patterns ?? '').split('\n').filter(p => p.trim()); // Unused
520:       // For testing, always use the *current edits* for the local patterns if a folder is selected
521:       const activeLocal = currentLocalPatterns.split('\n').filter(p => p.trim()); 
522:       const safeExcludedSystem = Array.isArray(excludedSystemPatterns) ? excludedSystemPatterns : [];
523:       const activeSystemPatterns = systemIgnorePatterns.filter(p => !safeExcludedSystem.includes(p));
524: 
525:       const effectivePatternsMap = new Map<string, 'system' | 'global' | 'local'>();
526:       activeSystemPatterns.forEach(p => effectivePatternsMap.set(p, 'system'));
527:       // Use current global edits for testing
528:       currentGlobalEdit.forEach(p => effectivePatternsMap.set(p, 'global'));
529:       // Use current local edits for testing
530:       activeLocal.forEach(p => effectivePatternsMap.set(p, 'local'));
531: 
532:       const patternsToTest = Array.from(effectivePatternsMap.keys());
533: 
534:       // 2. Call the IPC handler
535:       const result = await window.electron.testIgnorePatterns({
536:         folderPath: selectedFolder,
537:         patterns: patternsToTest.join('\n'), // Join array into newline-separated string
538:       });
539: 
540:       if (result.success) {
541:         setTestResults({
542:           ignoredCount: result.ignoredCount ?? 0,
543:           ignoredFiles: result.ignoredFiles ?? [],
544:           totalFilesChecked: result.totalFilesChecked ?? 0,
545:         });
546:       } else {
547:         setTestError(result.error || "Failed to test patterns.");
548:       }
549:     } catch (error) {
550:       console.error("Error invoking test-ignore-patterns:", error);
551:       setTestError(error instanceof Error ? error.message : "An unknown error occurred during testing.");
552:     } finally {
553:       setIsTestingPatterns(false);
554:     }
555:   }, [
556:     selectedFolder, 
557:     currentGlobalPatterns, 
558:     currentLocalPatterns, 
559:     systemIgnorePatterns, 
560:     excludedSystemPatterns
561:   ]);
562: 
563:   // Add explanation tooltips for the buttons
564:   const buttonTooltips = {
565:     save: 'Save current patterns',
566:     reset: 'Reset to last saved patterns',
567:     clear: 'Remove all patterns',
568:     cancel: 'Discard changes'
569:   };
570: 
571:   // Replace handleTextareaChange with a handler for the Editor component
572:   const handleEditorChange = (code: string) => {
573:     if (activeTab === 'global') setCurrentGlobalPatterns(code);
574:     else setCurrentLocalPatterns(code);
575:     // Add validation logic here if desired
576:   };
577: 
578:   // Helper to format timestamp
579:   const formatTimestamp = (date: Date | null): string => {
580:     if (!date) return '';
581:     return `Last saved: ${date.toLocaleTimeString()}`;
582:   };
583: 
584:   // Determine current timestamp to display
585:   const currentTimestamp = activeTab === 'global' 
586:     ? formatTimestamp(lastSavedGlobal)
587:     : formatTimestamp(selectedFolder ? lastSavedLocal[selectedFolder] : null);
588: 
589:   // --- Render ---
590:   if (!isOpen) return null;
591: 
592:   return (
593:     <div className={styles.modal} onClick={(e) => {
594:       if (e.target === e.currentTarget) onClose();
595:     }}>
596:       <div className={styles.content}>
597:         <div className={styles.header}>
598:           <h2>
599:             Ignore Patterns
600:             {applyingPatterns && <span className={styles.applying}>(Applying...)</span>}
601:           </h2>
602:           <Button 
603:             variant="ghost" 
604:             size="sm" 
605:             onClick={onClose} 
606:             aria-label="Close" 
607:             disabled={applyingPatterns}
608:             className={styles.closeButton}
609:           >
610:             <X size={16} />
611:           </Button>
612:         </div>
613: 
614:         <div className={styles.description}>
615:             Manage patterns to exclude files from processing. Global patterns apply everywhere, local patterns apply only to the selected folder. System patterns can be toggled on/off globally.
616:         </div>
617: 
618:         {/* Scope Selector (Tabs) */}
619:         <div className={styles.scopeSelector}>
620:             <Button variant={activeTab === "global" ? "secondary" : "ghost"} className={`${styles.scopeBtn} ${activeTab === "global" ? styles.active : ""}`} onClick={() => handleTabChange(true)} disabled={applyingPatterns}> Global </Button>
621:             <Button variant={activeTab === "local" ? "secondary" : "ghost"} className={`${styles.scopeBtn} ${activeTab === "local" ? styles.active : ""}`} onClick={() => handleTabChange(false)} disabled={applyingPatterns}> Local Folder </Button>
622:         </div>
623: 
624:         {/* Global Tab Content */}
625:         {activeTab === "global" && (
626:           <>
627:             {/* System Patterns Section */}
628:             <div className={styles.systemPatternsSection}>
629:               {/* Ensure excludedSystemPatterns is array before calculating length */}
630:               <h3 className={styles.sectionTitle}> System Defaults ({systemIgnorePatterns.length - (Array.isArray(excludedSystemPatterns) ? excludedSystemPatterns.length : 0)} active) </h3>
631:                {Object.entries(SYSTEM_PATTERN_CATEGORIES).map(([category, patternsInCategory]) => { // Renamed variable
632:                     // Ensure excludedSystemPatterns is array before filtering
633:                     const safeExcluded = Array.isArray(excludedSystemPatterns) ? excludedSystemPatterns : [];
634:                     // Filter patterns from the *main* system list that belong to this category
635:                     const categoryPatterns = systemIgnorePatterns.filter(p => patternsInCategory.includes(p));
636:                     if (categoryPatterns.length === 0) return null; // Skip empty categories
637:                     const enabledInCategory = categoryPatterns.filter(p => !safeExcluded.includes(p)).length;
638: 
639:                     return (
640:                         <div key={category} className={`${styles.patternCategory} ${expandedCategories[category] ? styles.categoryExpanded : ''}`}>
641:                           <div className={styles.categoryHeader} onClick={() => toggleCategory(category)}>
642:                             <div className={styles.categoryTitle}> {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} </div>
643:                             <div className={styles.categoryMeta}>
644:                               <span className={styles.categoryCount}> {enabledInCategory}/{categoryPatterns.length} </span>
645:                               <Plus 
646:                                 size={16} 
647:                                 className={`${styles.accordionIcon} ${expandedCategories[category] ? styles.rotated : ''}`} 
648:                               />
649:                             </div>
650:                           </div>
651:                           {expandedCategories[category] && (
652:                             <div className={styles.categoryItems}>
653:                               {categoryPatterns.map(pattern => {
654:                                 // Ensure excludedSystemPatterns is array before checking includes
655:                                 const safeExcludedInner = Array.isArray(excludedSystemPatterns) ? excludedSystemPatterns : [];
656:                                 const isEnabled = !safeExcludedInner.includes(pattern);
657:                                 return (
658:                                   <div key={pattern} className={`${styles.systemPatternItem} ${isEnabled ? '' : styles.disabledPattern}`} data-pattern={pattern}>
659:                                     <span className={styles.patternText} title={pattern}>{pattern}</span>
660:                                     <Switch
661:                                         checked={isEnabled}
662:                                         onChange={() => handleToggleSystemPattern(pattern)}
663:                                         size="sm"
664:                                         className={styles.smallerSwitch}
665:                                         id={`switch-${pattern}-${category}`} // Make ID more unique
666:                                         aria-label={pattern} // Use pattern as label
667:                                     />
668:                                   </div>
669:                                 );
670:                               })}
671:                             </div>
672:                           )}
673:                         </div>
674:                     );
675:                 })}
676:             </div>
677: 
678:             {/* Global Custom Patterns Section - Use Editor */}
679:             <div className={styles.patternEntrySection}>
680:                 <div className={styles.sectionHeader}> {/* New container for title + timestamp */}
681:                   <h3 className={styles.sectionTitle}> Global Custom Patterns </h3>
682:                   {isLoadingPatterns ? (
683:                     <span className={styles.loadingIndicator}>Loading...</span>
684:                   ) : (
685:                     <span className={styles.timestamp}>{currentTimestamp}</span>
686:                   )}
687:                 </div>
688:                 <div ref={activeTab === 'global' ? editorContainerRef : null} className={styles.editorContainer}> {/* Optional: Add a container for styling */} 
689:                   <Editor
690:                     value={currentGlobalPatterns}
691:                     onValueChange={handleEditorChange}
692:                     highlight={(code) => {
693:                       // Use Prism.highlight and Prism.languages
694:                       try {
695:                         // Ensure the language is loaded before highlighting
696:                         if (Prism.languages.ignore) {
697:                           return Prism.highlight(code, Prism.languages.ignore, 'ignore');
698:                         } else {
699:                           console.warn("Prism language 'ignore' not loaded yet.");
700:                           return code; // Return unhighlighted if language missing
701:                         }
702:                       } catch (e) {
703:                         console.warn("Prism highlighting failed:", e);
704:                         return code; // Return plain code on error
705:                       }
706:                     }}
707:                     padding={10}
708:                     className={styles.patternsEditor} 
709:                     textareaClassName={styles.patternsEditorTextarea} 
710:                     style={{
711:                       // Use CSS variables for theme compatibility
712:                       backgroundColor: 'var(--background-primary)', 
713:                       fontFamily: 'var(--font-mono, "Fira code", "Fira Mono", monospace)', // Use theme mono font if available
714:                       fontSize: 14,
715:                       color: 'var(--text-primary)',
716:                       outline: 0,
717:                     }}
718:                     disabled={applyingPatterns}
719:                   />
720:                 </div>
721:                 <div className={styles.buttonGroup}>
722:                   <Button
723:                     variant="secondary"
724:                     size="sm"
725:                     onClick={() => resetIgnorePatterns(true)}
726:                     disabled={applyingPatterns}
727:                     title={buttonTooltips.reset}
728:                   >
729:                     Reset Global
730:                   </Button>
731:                   <Button
732:                     variant="secondary"
733:                     size="sm"
734:                     onClick={() => {
735:                       setCurrentGlobalPatterns('');
736:                       onExcludedSystemPatternsChange([]);
737:                     }}
738:                     disabled={applyingPatterns}
739:                     title={buttonTooltips.clear}
740:                   >
741:                     Clear Global
742:                   </Button>
743:                   <Button
744:                     variant="ghost"
745:                     size="sm"
746:                     onClick={onClose}
747:                     disabled={applyingPatterns}
748:                     title={buttonTooltips.cancel}
749:                   >
750:                     Cancel
751:                   </Button>
752:                   <Button
753:                     variant="primary"
754:                     size="sm"
755:                     onClick={handleSaveGlobalPatterns}
756:                     disabled={applyingPatterns}
757:                     title={buttonTooltips.save}
758:                   >
759:                     {applyingPatterns ? 'Saving...' : 'Save'}
760:                   </Button>
761:                 </div>
762:             </div>
763:           </>
764:         )}
765: 
766:         {/* Local Tab Content - Use Editor */}
767:         {activeTab === "local" && (
768:             <div className={styles.patternEntrySection}>
769:                 <div className={styles.sectionHeader}> {/* New container for title + timestamp */}
770:                   <h3 className={styles.sectionTitle}> Local Custom Patterns </h3>
771:                   {isLoadingPatterns ? (
772:                     <span className={styles.loadingIndicator}>Loading...</span>
773:                   ) : (
774:                     <span className={styles.timestamp}>{currentTimestamp}</span>
775:                   )}
776:                 </div>
777:                 <div className={styles.folderSelector}>
778:                     <label htmlFor="folder-select-dropdown">Select Folder</label>
779:                     <div id="folder-select-dropdown" className={styles.customSelect} onClick={() => !applyingPatterns && setFolderSelectOpen(!folderSelectOpen)} aria-haspopup="listbox">
780:                         <div className={styles.selectedValue} role="button" aria-expanded={folderSelectOpen}>
781:                             {selectedFolder ? truncatePath(selectedFolder) : 'Select a folder'}
782:                             <ChevronDown size={16} className={`${styles.chevron} ${folderSelectOpen ? styles.open : ''}`} />
783:                         </div>
784:                         {folderSelectOpen && (
785:                         <div className={styles.optionsContainer} role="listbox">
786:                             {recentFolders.length > 0 ? (
787:                             recentFolders.map((folder, index) => (
788:                                 <div key={index} className={styles.option} onClick={() => handleFolderChange(folder)} role="option" aria-selected={folder === selectedFolder}> {folder} </div>
789:                             ))
790:                             ) : (
791:                             <div className={styles.option} role="option" aria-disabled="true"> {selectedFolder || 'No recent folders'} </div>
792:                             )}
793:                         </div>
794:                         )}
795:                     </div>
796:                     <div className={styles.pathDisplay}> Path: {selectedFolder ? `${truncatePath(selectedFolder)}/.repo_ignore` : 'N/A'} </div>
797:                 </div>
798:                 <div ref={activeTab === 'local' ? editorContainerRef : null} className={styles.editorContainer}> {/* Optional: Add a container */} 
799:                   <Editor
800:                     value={currentLocalPatterns}
801:                     onValueChange={handleEditorChange}
802:                     highlight={(code) => {
803:                       // Use Prism.highlight and Prism.languages
804:                       try {
805:                         // Ensure the language is loaded before highlighting
806:                         if (Prism.languages.ignore) {
807:                           return Prism.highlight(code, Prism.languages.ignore, 'ignore');
808:                         } else {
809:                           console.warn("Prism language 'ignore' not loaded yet.");
810:                           return code; // Return unhighlighted if language missing
811:                         }
812:                       } catch (e) {
813:                         console.warn("Prism highlighting failed:", e);
814:                         return code; // Return plain code on error
815:                       }
816:                     }}
817:                     padding={10}
818:                     className={styles.patternsEditor} 
819:                     textareaClassName={styles.patternsEditorTextarea} 
820:                     style={{
821:                       // Use CSS variables for theme compatibility
822:                       backgroundColor: 'var(--background-primary)', 
823:                       fontFamily: 'var(--font-mono, "Fira code", "Fira Mono", monospace)', // Use theme mono font if available
824:                       fontSize: 14,
825:                       color: 'var(--text-primary)',
826:                       outline: 0,
827:                     }}
828:                     disabled={applyingPatterns || !selectedFolder}
829:                   />
830:                 </div>
831:                 <div className={styles.buttonGroup}>
832:                   <Button
833:                     variant="secondary"
834:                     size="sm"
835:                     onClick={handleResetLocal}
836:                     disabled={applyingPatterns || !selectedFolder}
837:                     title={buttonTooltips.reset}
838:                   >
839:                     Reset Local
840:                   </Button>
841:                   <Button
842:                     variant="secondary"
843:                     size="sm"
844:                     onClick={handleClearLocal}
845:                     disabled={applyingPatterns || !selectedFolder}
846:                     title={buttonTooltips.clear}
847:                   >
848:                     Clear Local
849:                   </Button>
850:                   <Button
851:                     variant="ghost"
852:                     size="sm"
853:                     onClick={onClose}
854:                     disabled={applyingPatterns}
855:                     title={buttonTooltips.cancel}
856:                   >
857:                     Cancel
858:                   </Button>
859:                   <Button
860:                     variant="primary"
861:                     size="sm"
862:                     onClick={handleSave}
863:                     disabled={applyingPatterns || !selectedFolder}
864:                     title={buttonTooltips.save}
865:                   >
866:                     {applyingPatterns ? 'Saving...' : 'Save'}
867:                   </Button>
868:                   <Button 
869:                     variant="secondary"
870:                     size="sm" 
871:                     onClick={handleTestPatterns} 
872:                     disabled={applyingPatterns || isTestingPatterns || !selectedFolder}
873:                     title="Test current patterns against selected folder"
874:                     className={styles.testButton} 
875:                   >
876:                     {isTestingPatterns ? (
877:                       <Loader2 size={16} className={styles.loadingIcon} />
878:                     ) : (
879:                       <Play size={16} />
880:                     )}
881:                     Test
882:                   </Button>
883:                 </div>
884:             </div>
885:         )}
886: 
887:         {/* Test Results Section (Conditionally Rendered) */}
888:         {(testResults || testError) && (
889:             <div className={styles.testResultsSection}>
890:               <h4 className={styles.testResultsHeader}>
891:                 Test Results {testResults ? `(${testResults.ignoredCount} ignored / ${testResults.totalFilesChecked} total)` : ''}
892:               </h4>
893:               {testError && (
894:                 <div className={`${styles.testResultItem} ${styles.testError}`}>Error: {testError}</div>
895:               )}
896:               {testResults && testResults.ignoredFiles.length > 0 && (
897:                 <div className={styles.testResultsList}>
898:                   {testResults.ignoredFiles.map((file, index) => (
899:                     <div key={index} className={styles.testResultItem} title={file}>{file}</div>
900:                   ))}
901:                 </div>
902:               )}
903:               {testResults && testResults.ignoredFiles.length === 0 && !testError && (
904:                 <div className={`${styles.testResultItem} ${styles.noResults}`}>No files matched the current patterns.</div>
905:               )}
906:             </div>
907:           )}
908: 
909:         {/* Preview Section (Always visible) - Updated Render Logic */}
910:         <div className={styles.previewSection}>
911:             <div className={styles.previewContainer}>
912:                 <div className={styles.previewHeader}>
913:                     <span>Effective Patterns Preview</span>
914:                     <span className={styles.patternCount}>
915:                         {actualPatternCount} active
916:                     </span>
917:                 </div>
918:                 {/* Check if mergedPreview is the new array structure */}
919:                 {Array.isArray(mergedPreview) ? mergedPreview.map((lineData, index) => {
920:                     if (!lineData.pattern.trim() && lineData.source === 'comment') {
921:                        // Render empty lines used as separators differently if needed, or skip
922:                        return <div key={index} className={styles.previewSeparator}></div>;
923:                     }
924: 
925:                     let badgeText = '';
926:                     let lineClass = '';
927:                     let badgeClass = '';
928: 
929:                     switch (lineData.source) {
930:                       case 'system':
931:                         badgeText = 'System';
932:                         lineClass = styles.previewSystem;
933:                         badgeClass = styles.previewBadgeSystem;
934:                         break;
935:                       case 'global':
936:                         badgeText = 'Global';
937:                         lineClass = styles.previewGlobal;
938:                         badgeClass = styles.previewBadgeGlobal;
939:                         break;
940:                       case 'local':
941:                         badgeText = 'Local';
942:                         lineClass = styles.previewLocal;
943:                         badgeClass = styles.previewBadgeLocal;
944:                         break;
945:                       case 'comment':
946:                         lineClass = styles.previewComment;
947:                         break;
948:                       default:
949:                         // Should not happen with the new structure
950:                         lineClass = styles.previewUnknown;
951:                         break;
952:                     }
953: 
954:                     return (
955:                         <div key={index} className={`${styles.previewLine} ${lineClass}`}>
956:                             {/* Display pattern or comment header */}
957:                             <span className={styles.previewPatternText}>{lineData.pattern}</span>
958:                              {badgeText && <span className={`${styles.previewBadge} ${badgeClass}`}>{badgeText}</span>}
959:                         </div>
960:                     );
961:                 }) : (
962:                   // Fallback for old string format (should ideally be removed later)
963:                   <div className={styles.previewLine}>Invalid preview format</div>
964:                 )}
965:             </div>
966:         </div>
967:       </div>
968:     </div>
969:   );
970: };
971: 
972: export default IgnorePatternsWithErrorBoundary;
````

## File: src/components/SearchBar.module.css
````css
 1: .searchBarWrapper {
 2:   width: 100%;
 3:   position: relative;
 4:   display: flex;
 5:   align-items: center;
 6:   background-color: var(--background-primary);
 7:   border: 1px solid var(--border-color);
 8:   border-radius: var(--radius);
 9:   height: 28px; /* Fixed height to fit in sidebar */
10:   transition: border-color 0.2s, box-shadow 0.2s;
11: }
12: 
13: .searchBarWrapper.focused {
14:   border-color: var(--accent-color);
15: }
16: 
17: .searchContainer {
18:   position: relative;
19:   display: flex;
20:   align-items: center;
21:   width: 100%;
22: }
23: 
24: .searchIcon {
25:   position: absolute;
26:   left: 8px;
27:   color: var(--text-secondary);
28:   pointer-events: none;
29:   width: 14px;
30:   height: 14px;
31: }
32: 
33: .searchInput {
34:   width: 100%;
35:   padding: 4px 10px 4px 26px;
36:   border: 1px solid var(--border-color);
37:   border-radius: 16px;
38:   font-size: 0.75rem;
39:   background: var(--background-secondary);
40:   color: var(--text-primary);
41:   transition: all 0.15s ease;
42:   outline: none;
43:   height: 24px;
44:   line-height: 1;
45: }
46: 
47: .searchInput:focus {
48:   border-color: var(--accent-color);
49:   box-shadow: 0 0 0 1px rgba(var(--accent-rgb), 0.2);
50: }
51: 
52: .searchInput::placeholder {
53:   color: var(--text-tertiary, var(--text-secondary));
54:   opacity: 0.6;
55: }
56: 
57: .clearButton {
58:   position: absolute;
59:   right: 6px;
60:   top: 50%;
61:   transform: translateY(-50%);
62:   background: none;
63:   border: none;
64:   padding: 2px;
65:   color: var(--text-secondary);
66:   display: flex;
67:   align-items: center;
68:   justify-content: center;
69:   border-radius: 50%;
70:   cursor: pointer;
71:   z-index: 2;
72:   width: 16px;
73:   height: 16px;
74:   transition: color 0.2s ease, background-color 0.2s ease;
75: }
76: 
77: .clearButton:hover {
78:   color: var(--text-primary);
79:   background-color: var(--hover-color);
80: }
````

## File: src/components/SearchBar.tsx
````typescript
 1: import React from "react";
 2: import { Search } from "lucide-react";
 3: import styles from "./SearchBar.module.css";
 4: 
 5: interface SearchBarProps {
 6:   searchTerm: string;
 7:   onSearchChange: (term: string) => void;
 8: }
 9: 
10: const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange }) => {
11:   return (
12:     <div className={styles.searchContainer}>
13:       <Search size={14} className={styles.searchIcon} />
14:       <input
15:         type="text"
16:         value={searchTerm}
17:         onChange={(e) => onSearchChange(e.target.value)}
18:         placeholder="Search files..."
19:         className={styles.searchInput}
20:       />
21:     </div>
22:   );
23: };
24: 
25: export default SearchBar;
````

## File: src/components/Sidebar.module.css
````css
  1: .sidebar {
  2:   display: flex;
  3:   flex-direction: column;
  4:   height: 100%;
  5:   border-right: 1px solid var(--border-color);
  6:   background: var(--background-primary);
  7:   position: relative;
  8:   
  9:   /* Add macOS-like vibrancy effect */
 10:   backdrop-filter: var(--backdrop-blur-md);
 11:   -webkit-backdrop-filter: var(--backdrop-blur-md);
 12: }
 13: 
 14: .sidebarSearch {
 15:   padding: 6px 12px;
 16:   border-bottom: 1px solid var(--border-color);
 17:   display: flex;
 18:   align-items: center;
 19:   height: 36px;
 20:   background-color: var(--background-secondary);
 21:   backdrop-filter: var(--backdrop-blur-sm);
 22:   -webkit-backdrop-filter: var(--backdrop-blur-sm);
 23: }
 24: 
 25: .sidebarActions {
 26:   display: flex;
 27:   padding: 6px 8px;
 28:   gap: 8px;
 29:   border-bottom: 1px solid var(--border-color);
 30:   justify-content: center;
 31:   align-items: center;
 32:   height: 40px;
 33:   background-color: var(--background-secondary);
 34:   backdrop-filter: var(--backdrop-blur-sm);
 35:   -webkit-backdrop-filter: var(--backdrop-blur-sm);
 36: }
 37: 
 38: .fileTree {
 39:   flex: 1;
 40:   overflow-y: auto;
 41:   padding: 8px 0;
 42: }
 43: 
 44: .treeEmpty {
 45:   padding: 16px;
 46:   text-align: center;
 47:   color: var(--text-secondary);
 48: }
 49: 
 50: .treeLoading {
 51:   display: flex;
 52:   flex-direction: column;
 53:   align-items: center;
 54:   justify-content: center;
 55:   padding: 32px;
 56:   gap: 16px;
 57:   color: var(--text-secondary);
 58: }
 59: 
 60: .spinner {
 61:   border: 2px solid var(--border-color);
 62:   border-top: 2px solid var(--text-primary);
 63:   border-radius: 50%;
 64:   width: 24px;
 65:   height: 24px;
 66:   animation: spin 1s linear infinite;
 67: }
 68: 
 69: .sidebarEmptyState {
 70:   display: flex;
 71:   flex-direction: column;
 72:   align-items: center;
 73:   justify-content: center;
 74:   height: 100%;
 75:   padding: 32px;
 76:   text-align: center;
 77:   gap: 16px;
 78:   color: var(--text-secondary);
 79: }
 80: 
 81: .sidebarEmptyIcon {
 82:   color: var(--text-secondary);
 83:   opacity: 0.5;
 84: }
 85: 
 86: .sidebarResizeHandle {
 87:   position: absolute;
 88:   right: -4px;
 89:   top: 0;
 90:   bottom: 0;
 91:   width: 8px;
 92:   cursor: col-resize;
 93:   background: transparent;
 94:   transition: background-color 0.2s;
 95: }
 96: 
 97: .sidebarResizeHandle:hover {
 98:   background: var(--accent);
 99: }
100: 
101: @keyframes spin {
102:   0% { transform: rotate(0deg); }
103:   100% { transform: rotate(360deg); }
104: }
105: 
106: .excludedFilesIndicator {
107:   font-size: 0.75rem;
108:   color: var(--text-secondary);
109:   padding: 6px 8px;
110:   margin: 4px 8px;
111:   text-align: center;
112:   font-style: italic;
113:   opacity: 0.7;
114:   background-color: var(--background-secondary);
115:   border-radius: var(--radius);
116: }
117: 
118: .excludedFilesMessage {
119:   font-size: 0.75rem;
120:   color: var(--text-secondary);
121:   padding: 4px 8px;
122:   text-align: center;
123:   font-style: italic;
124:   opacity: 0.7;
125:   border-bottom: 1px solid var(--border-color);
126: }
````

## File: src/components/Sidebar.module.css.d.ts
````typescript
 1: declare const styles: {
 2:   readonly sidebar: string;
 3:   readonly sidebarSearch: string;
 4:   readonly sidebarActions: string;
 5:   readonly fileTree: string;
 6:   readonly treeEmpty: string;
 7:   readonly treeLoading: string;
 8:   readonly spinner: string;
 9:   readonly sidebarEmptyState: string;
10:   readonly sidebarEmptyIcon: string;
11:   readonly sidebarResizeHandle: string;
12: };
13: 
14: export default styles;
````

## File: src/components/Sidebar.tsx
````typescript
  1: import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
  2: import { SidebarProps, TreeNode, SortOrder, FileData } from "../types/FileTypes";
  3: import TreeItem from "./TreeItem";
  4: import FileTreeHeader from "./FileTreeHeader";
  5: import IgnorePatterns from "./IgnorePatterns";
  6: import { FolderPlus } from "lucide-react";
  7: import { Button } from "./ui";
  8: import SearchBar from "./SearchBar";
  9: import styles from "./Sidebar.module.css";
 10: import { ModelInfo } from "../types/ModelTypes";
 11: 
 12: // Extend the existing SidebarProps from FileTypes
 13: interface ExtendedSidebarProps extends SidebarProps {
 14:   reloadFolder: () => void;
 15:   clearSelection: () => void;
 16:   removeAllFolders: () => void;
 17:   setIgnorePatterns: (patterns: string) => void;
 18:   loadIgnorePatterns: (folderPath: string, isGlobal?: boolean) => Promise<void>;
 19:   saveIgnorePatterns: (patterns: string, isGlobal: boolean, folderPath?: string) => Promise<void>;
 20:   resetIgnorePatterns: (isGlobal: boolean, folderPath?: string) => Promise<void>;
 21:   systemIgnorePatterns: string[];
 22:   clearIgnorePatterns: (folderPath: string) => Promise<void>;
 23:   onClearSelectionClick: () => void;
 24:   onRemoveAllFoldersClick: () => void;
 25:   fileTreeSortOrder: SortOrder;
 26:   onSortOrderChange: (order: SortOrder) => void;
 27:   globalPatternsState: IgnorePatternsState;
 28:   localPatternsState: IgnorePatternsState;
 29:   onExcludedSystemPatternsChange: (patterns: string[]) => void;
 30:   // Add model-related properties
 31:   _availableModels: ModelInfo[] | null;
 32:   _selectedModelId: string | null;
 33:   _onModelChange: (modelId: string | null) => void;
 34: }
 35: 
 36: // Define IgnorePatternsState interface
 37: interface IgnorePatternsState {
 38:   patterns: string;
 39:   excludedSystemPatterns: string[];
 40: }
 41: 
 42: // Debounce delay in ms
 43: const DEBOUNCE_DELAY = 200;
 44: 
 45: // Use a timeout to prevent infinite tree building loops
 46: const TREE_BUILD_TIMEOUT = 5000;
 47: 
 48: const Sidebar: React.FC<ExtendedSidebarProps> = ({
 49:   selectedFolder,
 50:   openFolder,
 51:   allFiles,
 52:   selectedFiles,
 53:   toggleFileSelection,
 54:   toggleFolderSelection,
 55:   searchTerm,
 56:   onSearchChange,
 57:   selectAllFiles,
 58:   deselectAllFiles,
 59:   expandedNodes,
 60:   toggleExpanded,
 61:   reloadFolder,
 62:   clearSelection,
 63:   removeAllFolders,
 64:   setIgnorePatterns,
 65:   loadIgnorePatterns,
 66:   saveIgnorePatterns,
 67:   resetIgnorePatterns,
 68:   systemIgnorePatterns,
 69:   clearIgnorePatterns,
 70:   onClearSelectionClick,
 71:   onRemoveAllFoldersClick,
 72:   fileTreeSortOrder,
 73:   onSortOrderChange,
 74:   globalPatternsState,
 75:   localPatternsState,
 76:   onExcludedSystemPatternsChange,
 77:   // Unused props (prefixed with _ to indicate they're intentionally unused)
 78:   _availableModels: availableModels,
 79:   _selectedModelId: selectedModelId,
 80:   _onModelChange: onModelChange,
 81: }) => {
 82:   const [fileTree, setFileTree] = useState<TreeNode[]>([]);
 83:   const [sidebarWidth, setSidebarWidth] = useState(300);
 84:   const [isResizing, setIsResizing] = useState(false);
 85:   
 86:   // State for ignore patterns modal
 87:   const [ignoreModalOpen, setIgnoreModalOpen] = useState(false);
 88:   const [globalIgnorePatterns, /*REMOVE: setGlobalIgnorePatterns*/] = useState("");
 89:   const [localIgnorePatterns, /*REMOVE: setLocalIgnorePatterns*/] = useState("");
 90:   
 91:   // Min and max width constraints
 92:   const MIN_SIDEBAR_WIDTH = 200;
 93:   const MAX_SIDEBAR_WIDTH = 500;
 94: 
 95:   // All component level refs need to be defined here
 96:   const loadedFoldersRef = useRef<Set<string>>(new Set());
 97:   const lastProcessedFolderRef = useRef<string | null>(null);
 98:   const isBuildingTreeRef = useRef(false);
 99:   const buildTimeoutRef = useRef<NodeJS.Timeout | null>(null);
100:   const lastSelectedFilesRef = useRef<string[]>([]);
101: 
102:   // Cache the previous selected files to optimize render
103:   useEffect(() => {
104:     lastSelectedFilesRef.current = selectedFiles;
105:   }, [selectedFiles]);
106: 
107:   // Helper function for file tree - Flatten the tree for rendering
108:   const flattenTree = useCallback((nodes: TreeNode[]): TreeNode[] => {
109:     let result: TreeNode[] = [];
110:     
111:     for (const node of nodes) {
112:       result.push(node);
113:       
114:       if (node.type === "directory" && node.isExpanded && node.children && node.children.length > 0) {
115:         result = result.concat(flattenTree(node.children));
116:       }
117:     }
118:     
119:     return result;
120:   }, []);
121:   
122:   // Helper function for file tree - Filter the tree based on search term with performance optimizations
123:   const filterTree = useCallback((nodes: TreeNode[], term: string): TreeNode[] => {
124:     if (!term) return nodes;
125:     
126:     const lowerTerm = term.toLowerCase();
127:     
128:     // Helper function to check if a node or its children match the search term
129:     const hasMatch = (node: TreeNode): boolean => {
130:       if (node.name.toLowerCase().includes(lowerTerm)) {
131:         return true;
132:       }
133:       
134:       if (node.type === "directory" && node.children && node.children.length > 0) {
135:         return node.children.some(hasMatch);
136:       }
137:       
138:       return false;
139:     };
140:     
141:     const filterNode = (node: TreeNode): TreeNode | null => {
142:       if (!hasMatch(node)) {
143:         return null;
144:       }
145:       
146:       if (node.type === "file") {
147:         return node;
148:       }
149:       
150:       if (node.type === "directory") {
151:         const filteredChildren = node.children 
152:           ? node.children
153:               .map(filterNode)
154:               .filter((n): n is TreeNode => n !== null)
155:           : [];
156:         
157:         return {
158:           ...node,
159:           isExpanded: true, // Always expand matching directories
160:           children: filteredChildren
161:         };
162:       }
163:       
164:       return null;
165:     };
166:     
167:     return nodes
168:       .map(filterNode)
169:       .filter((n): n is TreeNode => n !== null);
170:   }, []);
171:   
172:   // Use memoization to avoid unnecessary recalculations
173:   const memoizedFilteredTree = useMemo(() => {
174:     return searchTerm ? filterTree(fileTree, searchTerm) : fileTree;
175:   }, [fileTree, searchTerm, filterTree]);
176:   
177:   const memoizedFlattenedTree = useMemo(() => {
178:     return flattenTree(memoizedFilteredTree);
179:   }, [memoizedFilteredTree, flattenTree]);
180: 
181:   // Handle mouse down for resizing
182:   const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
183:     e.preventDefault();
184:     setIsResizing(true);
185:   };
186: 
187:   // Handle resize effect
188:   useEffect(() => {
189:     const handleResize = (e: globalThis.MouseEvent) => {
190:       if (isResizing) {
191:         const newWidth = e.clientX;
192:         if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
193:           setSidebarWidth(newWidth);
194:         }
195:       }
196:     };
197: 
198:     const handleResizeEnd = () => {
199:       setIsResizing(false);
200:     };
201: 
202:     document.addEventListener("mousemove", handleResize);
203:     document.addEventListener("mouseup", handleResizeEnd);
204: 
205:     return () => {
206:       document.removeEventListener("mousemove", handleResize);
207:       document.removeEventListener("mouseup", handleResizeEnd);
208:     };
209:   }, [isResizing]);
210: 
211:   // Load ignore patterns when folder changes - with optimization to prevent infinite loops
212:   useEffect(() => {
213:     // Skip if no folder is selected
214:     if (!selectedFolder) return;
215:     
216:     // Skip if we already processed this exact folder
217:     if (lastProcessedFolderRef.current === selectedFolder && 
218:         loadedFoldersRef.current.has(selectedFolder)) return;
219:     
220:     // Set the last processed folder reference
221:     lastProcessedFolderRef.current = selectedFolder;
222:     
223:     // Track that we're processing this folder
224:     loadedFoldersRef.current.add(selectedFolder);
225:     
226:     // Load the patterns
227:     loadIgnorePatterns(selectedFolder, false);
228:     
229:   }, [selectedFolder, loadIgnorePatterns]);
230: 
231:   // Sort file tree nodes - memoized with useCallback to prevent recreation on every render
232:   const sortFileTreeNodes = useCallback((nodes: TreeNode[]): TreeNode[] => {
233:     if (!nodes || nodes.length === 0) return [];
234: 
235:     // Create a new array to avoid mutating the input
236:     return [...nodes].sort((a, b) => {
237:       // Always sort directories first
238:       if (a.type === "directory" && b.type === "file") return -1;
239:       if (a.type === "file" && b.type === "directory") return 1;
240:       
241:       // Sort based on selected sort order
242:       switch (fileTreeSortOrder) {
243:         case "name-ascending":
244:           return a.name.localeCompare(b.name);
245:         case "name-descending":
246:           return b.name.localeCompare(a.name);
247:         case "tokens-ascending":
248:           return (a.fileData?.tokenCount || 0) - (b.fileData?.tokenCount || 0);
249:         case "tokens-descending":
250:           return (b.fileData?.tokenCount || 0) - (a.fileData?.tokenCount || 0);
251:         case "date-ascending":
252:           return (a.fileData?.lastModified || 0) - (b.fileData?.lastModified || 0);
253:         case "date-descending":
254:           return (b.fileData?.lastModified || 0) - (a.fileData?.lastModified || 0);
255:         default:
256:           return a.name.localeCompare(b.name);
257:       }
258:     });
259:   }, [fileTreeSortOrder]);
260: 
261:   // Apply sort recursively to the entire tree
262:   const sortNodesRecursively = useCallback((nodes: TreeNode[]): TreeNode[] => {
263:     if (!nodes || nodes.length === 0) return [];
264: 
265:     // Sort the current level
266:     const sortedNodes = sortFileTreeNodes(nodes);
267:     
268:     // Recursively sort children
269:     return sortedNodes.map(node => {
270:       if (node.type === "directory" && node.children && node.children.length > 0) {
271:         return {
272:           ...node,
273:           children: sortNodesRecursively(node.children)
274:         };
275:       }
276:       return node;
277:     });
278:   }, [sortFileTreeNodes]);
279: 
280:   // Build file tree structure from flat list of files - optimized
281:   const buildFileTree = useCallback(async (files: FileData[], rootFolder: string): Promise<TreeNode[]> => {
282:     if (!files || files.length === 0) return [];
283:     
284:     // Create a stable map of paths to prevent recursion issues
285:     const pathMap = new Map<string, FileData>();
286:     files.forEach(file => {
287:       if (file.path) {
288:         pathMap.set(file.path, file);
289:       }
290:     });
291:     
292:     try {
293:       // Create a map to store the file tree structure
294:       const fileMap: Record<string, any> = {};
295:       
296:       // Process each file
297:       Array.from(pathMap.entries()).forEach(([path, file]) => {
298:         let relativePath = path;
299:         if (relativePath.startsWith(rootFolder)) {
300:           relativePath = relativePath.substring(rootFolder.length);
301:           if (relativePath.startsWith('/') || relativePath.startsWith('\\')) {
302:             relativePath = relativePath.substring(1);
303:           }
304:         }
305:         
306:         const parts = relativePath.split(/[/\\]/);
307:         let current = fileMap;
308:         
309:         // Build the tree structure
310:         parts.forEach((part, index) => {
311:           if (!current[part]) {
312:             const fullPath = rootFolder + '/' + parts.slice(0, index + 1).join('/');
313:             const nodeId = `${fullPath}`;
314:             current[part] = {
315:               name: part,
316:               path: fullPath,
317:               id: nodeId, 
318:               type: index === parts.length - 1 ? "file" as const : "directory" as const,
319:               children: {},
320:               fileData: index === parts.length - 1 ? file : undefined
321:             };
322:           }
323:           current = current[part].children;
324:         });
325:       });
326:       
327:       // Convert the nested object structure to an array of TreeNodes
328:       const convertToTreeNodes = (
329:         obj: Record<string, any>,
330:         level = 0
331:       ): TreeNode[] => {
332:         const nodes = Object.values(obj)
333:           .filter(item => item !== undefined)
334:           .map((item: any): TreeNode => {
335:             const nodeId = item.id;
336:             const isNodeExpanded = expandedNodes.get(nodeId);
337:             
338:             // Auto-expand first level when no explicit expansion state is saved
339:             const shouldAutoExpand = isNodeExpanded === undefined && level < 1;
340:             
341:             if (item.type === "directory") {
342:               const children = convertToTreeNodes(item.children, level + 1);
343:               return {
344:                 id: nodeId,
345:                 name: item.name,
346:                 path: item.path,
347:                 type: "directory" as const,
348:                 children: children,
349:                 isExpanded: isNodeExpanded !== undefined ? isNodeExpanded : shouldAutoExpand,
350:                 depth: level,
351:               };
352:             }
353:             
354:             return {
355:               id: nodeId,
356:               name: item.name,
357:               path: item.path,
358:               type: "file" as const,
359:               fileData: item.fileData,
360:               depth: level,
361:             };
362:           });
363:         
364:         return nodes;
365:       };
366:       
367:       // Convert with timeout protection
368:       let result = convertToTreeNodes(fileMap);
369:       
370:       // Apply sorting recursively
371:       result = sortNodesRecursively(result);
372:       
373:       return result;
374:         
375:     } catch (error) {
376:       console.error('Error building file tree:', error);
377:       return [];
378:     }
379:   }, [expandedNodes, sortNodesRecursively]);
380: 
381:   // Set up the effect for building the file tree with debouncing and cleanup
382:   useEffect(() => {
383:     if (!allFiles || allFiles.length === 0) {
384:       setFileTree([]);
385:       isBuildingTreeRef.current = false;
386:       return;
387:     }
388:     
389:     // Skip if we're already building a tree
390:     if (isBuildingTreeRef.current) {
391:       console.log('Tree building in progress, skipping...');
392:       return;
393:     }
394:     
395:     // Clear any existing timeout
396:     if (buildTimeoutRef.current) {
397:       clearTimeout(buildTimeoutRef.current);
398:       buildTimeoutRef.current = null;
399:     }
400:     
401:     let isCurrentBuild = true;
402:     const buildId = Math.random().toString(36).substring(2, 9); // Unique ID for logging
403:     
404:     const buildTreeWithDebounce = async () => {
405:       try {
406:         isBuildingTreeRef.current = true;
407:         console.log(`Starting tree build ${buildId}...`);
408:         
409:         // Safety timeout to prevent tree building from hanging
410:         const timeoutPromise = new Promise<TreeNode[]>((_, reject) => {
411:           buildTimeoutRef.current = setTimeout(() => {
412:             console.warn(`Tree build ${buildId} timed out after ${TREE_BUILD_TIMEOUT}ms`);
413:             reject(new Error('Tree build timed out'));
414:           }, TREE_BUILD_TIMEOUT);
415:         });
416:         
417:         // Actual tree building process
418:         const buildPromise = buildFileTree(allFiles, selectedFolder || "");
419:         
420:         // Race between timeout and completion
421:         const result = await Promise.race([timeoutPromise, buildPromise]);
422:         
423:         // Only update if this is still the current build and we have a valid result
424:         if (isCurrentBuild && result) {
425:           setFileTree(result);
426:           console.log(`Tree build ${buildId} completed successfully with ${result.length} root nodes`);
427:         }
428:       } catch (error) {
429:         console.error(`Tree build ${buildId} failed:`, error);
430:         if (isCurrentBuild) {
431:           setFileTree([]);
432:         }
433:       } finally {
434:         if (isCurrentBuild) {
435:           isBuildingTreeRef.current = false;
436:           if (buildTimeoutRef.current) {
437:             clearTimeout(buildTimeoutRef.current);
438:             buildTimeoutRef.current = null;
439:           }
440:         }
441:       }
442:     };
443:     
444:     // Debounce the tree build to avoid unnecessary work during rapid state changes
445:     const timeoutId = setTimeout(buildTreeWithDebounce, DEBOUNCE_DELAY);
446:     
447:     return () => {
448:       isCurrentBuild = false;
449:       clearTimeout(timeoutId);
450:       if (buildTimeoutRef.current) {
451:         clearTimeout(buildTimeoutRef.current);
452:         buildTimeoutRef.current = null;
453:       }
454:       console.log(`Cleaning up tree build ${buildId}`);
455:     };
456:   }, [allFiles, selectedFolder, buildFileTree]);
457: 
458:   // Handle opening the ignore patterns modal
459:   const handleOpenIgnorePatterns = async (isGlobal = false) => {
460:     try {
461:       setIgnoreModalOpen(true);
462:       
463:       // Ensure we have patterns loaded
464:       if (isGlobal) {
465:         await loadPatterns(true);
466:       } else {
467:         await loadPatterns(false);
468:       }
469:     } catch (error) {
470:       console.error('Error opening ignore patterns modal:', error);
471:       // Reset modal state on error
472:       setIgnoreModalOpen(false);
473:     }
474:   };
475: 
476:   // Load patterns based on global or local scope
477:   const loadPatterns = useCallback(async (isGlobal: boolean) => {
478:     try {
479:       // Load global patterns if needed
480:       if (isGlobal) {
481:         if (!globalIgnorePatterns) {
482:           await loadIgnorePatterns('', true);
483:         } else {
484:           setIgnorePatterns(globalIgnorePatterns);
485:         }
486:       } 
487:       // Load local patterns if needed
488:       else if (selectedFolder && !localIgnorePatterns) {
489:         await loadIgnorePatterns(selectedFolder, false);
490:       } else if (selectedFolder) {
491:         setIgnorePatterns(localIgnorePatterns);
492:       }
493:     } catch (err) {
494:       console.error(`Error loading ${isGlobal ? 'global' : 'local'} patterns:`, err);
495:     }
496:   }, [selectedFolder, loadIgnorePatterns, globalIgnorePatterns, localIgnorePatterns, setIgnorePatterns]);
497: 
498:   // Get a list of available folders for the folder selector
499:   const getAvailableFolders = () => {
500:     const folders = new Set<string>();
501:     
502:     // Collect all unique folder paths
503:     allFiles.forEach((file) => {
504:       if (file.path) {
505:         // Extract directory without the file name
506:         const lastSlashIndex = Math.max(
507:           file.path.lastIndexOf('/'),
508:           file.path.lastIndexOf('\\')
509:         );
510:         
511:         if (lastSlashIndex > 0) {
512:           const folder = file.path.substring(0, lastSlashIndex);
513:           folders.add(folder);
514:         }
515:       }
516:     });
517:     
518:     return Array.from(folders);
519:   };
520: 
521:   // Count files excluded by ignore patterns
522:   const countExcludedFiles = () => {
523:     return allFiles.filter(file => file.excluded).length;
524:   };
525: 
526:   // Handle sort change events
527:   const handleSortChange = (newSortOrder: SortOrder) => {
528:     // Pass the sort order change back to the parent component
529:     if (fileTreeSortOrder !== newSortOrder) {
530:       // We need to handle this in the App component, not locally
531:       if (onSortOrderChange) {
532:         onSortOrderChange(newSortOrder);
533:       }
534:     }
535:   };
536: 
537:   const handleCloseIgnorePatterns = useCallback(() => {
538:     setIgnoreModalOpen(false);
539:   }, []);
540: 
541:   return (
542:     <div className={styles.sidebar} style={{ width: `${sidebarWidth}px` }}>
543:       <FileTreeHeader 
544:         onOpenFolder={openFolder}
545:         onSortChange={handleSortChange}
546:         onClearSelection={onClearSelectionClick || clearSelection}
547:         onRemoveAllFolders={onRemoveAllFoldersClick || removeAllFolders}
548:         onReloadFileTree={reloadFolder}
549:         onOpenIgnorePatterns={() => handleOpenIgnorePatterns(false)}
550:         excludedFilesCount={countExcludedFiles()}
551:         currentSortOrder={fileTreeSortOrder}
552:       />
553:       
554:       {selectedFolder ? (
555:         <>
556:           <div className={styles.sidebarSearch}>
557:             <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
558:           </div>
559: 
560:           <div className={styles.sidebarActions}>
561:             <Button
562:               variant="primary"
563:               size="sm"
564:               onClick={selectAllFiles}
565:               title="Select all files"
566:             >
567:               Select All
568:             </Button>
569:             <Button
570:               variant="primary"
571:               size="sm"
572:               onClick={deselectAllFiles}
573:               title="Deselect all files"
574:             >
575:               Deselect All
576:             </Button>
577:           </div>
578: 
579:           <div className={styles.fileTree}>
580:             {memoizedFlattenedTree.length > 0 ? (
581:               <>
582:                 {memoizedFlattenedTree.map((node) => (
583:                   <TreeItem
584:                     key={node.id}
585:                     node={node}
586:                     selectedFiles={selectedFiles}
587:                     toggleFileSelection={toggleFileSelection}
588:                     toggleFolderSelection={toggleFolderSelection}
589:                     toggleExpanded={toggleExpanded}
590:                   />
591:                 ))}
592:               </>
593:             ) : (
594:               <div className={styles.treeEmpty}>
595:                 {searchTerm
596:                   ? "No files match your search."
597:                   : "No files in this folder."}
598:               </div>
599:             )}
600:           </div>
601:         </>
602:       ) : (
603:         <div className={styles.sidebarEmptyState}>
604:           <FolderPlus size={48} className={styles.sidebarEmptyIcon} />
605:           <h3>No Folder Selected</h3>
606:           <p>Click the folder icon above to select a project folder.</p>
607:         </div>
608:       )}
609: 
610:       <div
611:         className={styles.sidebarResizeHandle}
612:         onMouseDown={handleResizeStart}
613:         title="Resize sidebar"
614:       />
615:       
616:       <IgnorePatterns 
617:         isOpen={ignoreModalOpen}
618:         onClose={handleCloseIgnorePatterns}
619:         globalPatternsState={globalPatternsState}
620:         localPatternsState={localPatternsState}
621:         localFolderPath={selectedFolder || ""}
622:         processingStatus={{ status: "idle", message: "" }}
623:         saveIgnorePatterns={async (patterns, isGlobal, folderPath) => {
624:           await Promise.resolve(saveIgnorePatterns(patterns, isGlobal, folderPath || ""));
625:         }}
626:         resetIgnorePatterns={async (isGlobal, folderPath) => {
627:           if (resetIgnorePatterns) {
628:             await Promise.resolve(resetIgnorePatterns(isGlobal, folderPath || ""));
629:           }
630:         }}
631:         clearIgnorePatterns={async (folderPath) => {
632:           await Promise.resolve(clearIgnorePatterns(folderPath));
633:         }}
634:         onExcludedSystemPatternsChange={onExcludedSystemPatternsChange}
635:         systemIgnorePatterns={systemIgnorePatterns}
636:         recentFolders={getAvailableFolders()}
637:       />
638:     </div>
639:   );
640: };
641: 
642: export default Sidebar;
````

## File: src/components/ThemeToggle.module.css
````css
 1: .themeSegmentedControl {
 2:   display: flex;
 3:   background-color: var(--background-secondary);
 4:   border-radius: 9999px;
 5:   padding: 2px;
 6:   width: fit-content;
 7:   position: relative;
 8:   height: 28px;
 9:   border: 1px solid hsla(240, 6%, 90%, 0.6);
10:   gap: 1px;
11:   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), inset 0 0 0 1px rgba(255, 255, 255, 0.03);
12:   overflow: hidden;
13: }
14: 
15: .themeSegmentsBackground {
16:   position: absolute;
17:   top: 2px;
18:   left: 2px;
19:   width: calc(33.33% - 2px);
20:   height: calc(100% - 4px);
21:   background-color: var(--background-primary);
22:   border-radius: 9999px;
23:   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.056), 0 0 0 1px rgba(0, 0, 0, 0.04);
24:   z-index: 0;
25:   transform: translateX(0);
26: }
27: 
28: .themeSegmentsBackground.animated {
29:   transition-property: transform, box-shadow;
30: }
31: 
32: .themeSegmentsBackground.light {
33:   transform: translateX(0);
34: }
35: 
36: .themeSegmentsBackground.dark {
37:   transform: translateX(100%);
38: }
39: 
40: .themeSegmentsBackground.system {
41:   transform: translateX(200%);
42: }
43: 
44: .themeSegment {
45:   display: flex;
46:   align-items: center;
47:   justify-content: center;
48:   width: 28px;
49:   height: 24px;
50:   border: none;
51:   background: none;
52:   color: var(--text-secondary);
53:   position: relative;
54:   z-index: 1;
55:   transition: color 0.2s ease;
56:   border-radius: 9999px;
57:   cursor: pointer;
58:   padding: 0;
59: }
60: 
61: .themeSegment:hover {
62:   color: var(--text-primary);
63:   background: none;
64: }
65: 
66: .themeSegment:focus {
67:   outline: none;
68:   box-shadow: none;
69: }
70: 
71: .themeSegment:focus-visible {
72:   outline: none;
73:   box-shadow: 0 0 0 1px var(--accent-color);
74: }
75: 
76: .themeSegment.active {
77:   color: var(--text-primary);
78: }
79: 
80: /* Dark mode adjustments */
81: :global(.dark-mode) .themeSegmentedControl {
82:   border-color: hsla(240, 3.7%, 25%, 0.3);
83:   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.02);
84: }
85: 
86: :global(.dark-mode) .themeSegmentsBackground {
87:   background-color: var(--background-selected);
88:   box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05);
89: }
````

## File: src/components/ThemeToggle.tsx
````typescript
 1: import React, { useEffect, useState } from 'react';
 2: import { useTheme } from '../hooks/useTheme';
 3: import { Sun, Moon, Monitor } from 'lucide-react';
 4: import styles from './ThemeToggle.module.css';
 5: 
 6: const ThemeToggle: React.FC = () => {
 7:   const { theme, setTheme } = useTheme();
 8:   const [isAnimated, setIsAnimated] = useState(false);
 9: 
10:   useEffect(() => {
11:     // Add animation class after initial render
12:     const timer = setTimeout(() => setIsAnimated(true), 0);
13:     return () => clearTimeout(timer);
14:   }, []);
15: 
16:   return (
17:     <div className={styles.themeSegmentedControl}>
18:       <div
19:         className={`${styles.themeSegmentsBackground} ${styles[theme]} ${
20:           isAnimated ? styles.animated : ''
21:         }`}
22:       />
23:       <button
24:         className={`${styles.themeSegment} ${theme === 'light' ? styles.active : ''}`}
25:         onClick={() => setTheme('light')}
26:         title="Light theme"
27:       >
28:         <Sun size={16} />
29:       </button>
30:       <button
31:         className={`${styles.themeSegment} ${theme === 'dark' ? styles.active : ''}`}
32:         onClick={() => setTheme('dark')}
33:         title="Dark theme"
34:       >
35:         <Moon size={16} />
36:       </button>
37:       <button
38:         className={`${styles.themeSegment} ${theme === 'system' ? styles.active : ''}`}
39:         onClick={() => setTheme('system')}
40:         title="System theme"
41:       >
42:         <Monitor size={16} />
43:       </button>
44:     </div>
45:   );
46: };
47: 
48: export default ThemeToggle;
````

## File: src/components/TreeItem.module.css
````css
  1: .treeItem {
  2:   display: flex;
  3:   align-items: center;
  4:   padding: 4px 8px;
  5:   cursor: pointer;
  6:   font-size: 14px;
  7:   position: relative;
  8:   color: var(--text-primary);
  9:   transition: background-color 0.1s ease;
 10:   border-radius: 4px;
 11: }
 12: 
 13: .treeItem:hover {
 14:   background-color: var(--hover-color);
 15: }
 16: 
 17: .treeItemSelected {
 18:   background-color: var(--background-selected);
 19: }
 20: 
 21: /* When selected, extend background to full width */
 22: .treeItemSelected,
 23: .treeItem:hover {
 24:   margin-left: -8px;
 25:   margin-right: -8px;
 26:   padding-left: 16px;
 27:   padding-right: 16px;
 28:   width: calc(100% + 16px);
 29: }
 30: 
 31: .treeItemContent {
 32:   display: flex;
 33:   align-items: center;
 34:   width: 100%;
 35:   min-width: 0;
 36:   overflow: hidden;
 37: }
 38: 
 39: .treeItemIndent {
 40:   display: inline-block;
 41:   width: 16px;
 42:   flex-shrink: 0;
 43: }
 44: 
 45: .treeItemIcon {
 46:   display: flex;
 47:   align-items: center;
 48:   margin-right: 4px;
 49:   color: var(--icon-color);
 50:   flex-shrink: 0;
 51: }
 52: 
 53: .treeItemCheckbox {
 54:   margin-right: 4px;
 55:   cursor: pointer;
 56:   accent-color: var(--accent-color);
 57: }
 58: 
 59: .treeItemName {
 60:   overflow: hidden;
 61:   text-overflow: ellipsis;
 62:   white-space: nowrap;
 63:   flex-grow: 1;
 64:   font-size: 0.85rem;
 65: }
 66: 
 67: .treeItemTokens {
 68:   margin-left: 4px;
 69:   color: var(--text-secondary);
 70:   font-size: 0.75rem;
 71:   white-space: nowrap;
 72: }
 73: 
 74: .treeItemExpander {
 75:   cursor: pointer;
 76:   display: flex;
 77:   align-items: center;
 78:   justify-content: center;
 79:   width: 20px;
 80:   height: 20px;
 81:   margin-right: 4px;
 82:   transition: transform 0.15s ease-in-out;
 83:   color: var(--icon-color);
 84:   z-index: 2;
 85: }
 86: 
 87: .treeItemExpanderRotated {
 88:   transform: rotate(90deg);
 89: }
 90: 
 91: .fileIcon {
 92:   color: var(--text-secondary);
 93: }
 94: 
 95: .folderIcon {
 96:   color: var(--accent-color);
 97: }
 98: 
 99: .disabledItem {
100:   opacity: 0.5;
101:   cursor: not-allowed;
102: }
103: 
104: .treeItemBadge {
105:   font-size: 10px;
106:   padding: 1px 5px;
107:   border-radius: var(--radius);
108:   background-color: var(--hover-color);
109:   color: var(--text-secondary);
110:   margin-left: 6px;
111:   white-space: nowrap;
112: }
````

## File: src/components/TreeItem.tsx
````typescript
  1: import React, { useRef, useEffect, useMemo, memo } from "react";
  2: import { TreeItemProps, TreeNode } from "../types/FileTypes";
  3: import { ChevronRight, File, Folder } from "lucide-react";
  4: import { arePathsEqual } from "../utils/pathUtils";
  5: import styles from "./TreeItem.module.css";
  6: 
  7: /**
  8:  * TreeItem component that renders a file or directory in the file tree.
  9:  * Optimized with memoization to prevent unnecessary re-renders.
 10:  */
 11: const TreeItem = memo(({
 12:   node,
 13:   selectedFiles,
 14:   toggleFileSelection,
 15:   toggleFolderSelection,
 16:   toggleExpanded,
 17: }: TreeItemProps) => {
 18:   const { id, name, path, type, depth, isExpanded, fileData } = node;
 19:   const checkboxRef = useRef<HTMLInputElement>(null);
 20: 
 21:   // Check if file is selected - optimized with useMemo
 22:   const isSelected = useMemo(() => {
 23:     if (type === "file") {
 24:       return selectedFiles.some(selectedPath => arePathsEqual(selectedPath, path));
 25:     }
 26:     return false;
 27:   }, [type, path, selectedFiles]);
 28: 
 29:   // Check if file is disabled (excluded by patterns)
 30:   const isDisabled = fileData?.excluded || false;
 31: 
 32:   // Optimize directory selection calculations
 33:   const { isDirectorySelected, isDirectoryPartiallySelected } = useMemo(() => {
 34:     if (type !== "directory" || !node.children || node.children.length === 0) {
 35:       return { isDirectorySelected: false, isDirectoryPartiallySelected: false };
 36:     }
 37: 
 38:     // Use a more efficient approach to determine selection state
 39:     const counts = {
 40:       total: 0,
 41:       selected: 0
 42:     };
 43: 
 44:     // Recursive function to count files
 45:     const countFiles = (node: TreeNode) => {
 46:       if (node.type === "file") {
 47:         if (node.fileData?.excluded) return; // Skip excluded files
 48:         counts.total++;
 49:         if (selectedFiles.some(path => arePathsEqual(path, node.path))) {
 50:           counts.selected++;
 51:         }
 52:       } else if (node.type === "directory" && node.children) {
 53:         node.children.forEach(countFiles);
 54:       }
 55:     };
 56: 
 57:     // Count all files in this directory
 58:     node.children.forEach(countFiles);
 59: 
 60:     // Determine selection state
 61:     const isAllSelected = counts.total > 0 && counts.selected === counts.total;
 62:     const isPartiallySelected = counts.selected > 0 && counts.selected < counts.total;
 63: 
 64:     return {
 65:       isDirectorySelected: isAllSelected,
 66:       isDirectoryPartiallySelected: isPartiallySelected
 67:     };
 68:   }, [node, type, selectedFiles]);
 69: 
 70:   // Update the indeterminate state of the checkbox
 71:   useEffect(() => {
 72:     if (checkboxRef.current) {
 73:       checkboxRef.current.indeterminate = isDirectoryPartiallySelected;
 74:     }
 75:   }, [isDirectoryPartiallySelected]);
 76: 
 77:   // Event handlers - using inline functions for better clarity
 78:   const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
 79:     e.stopPropagation();
 80:     toggleExpanded(id);
 81:   };
 82: 
 83:   const handleItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
 84:     e.stopPropagation();
 85:     if (type === "directory") {
 86:       toggleExpanded(id);
 87:     } else if (type === "file" && !isDisabled) {
 88:       toggleFileSelection(path);
 89:     }
 90:   };
 91: 
 92:   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 93:     e.stopPropagation();
 94:     if (type === "file") {
 95:       toggleFileSelection(path);
 96:     } else if (type === "directory") {
 97:       toggleFolderSelection(path, e.target.checked);
 98:     }
 99:   };
100: 
101:   const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
102:     e.stopPropagation();
103:   };
104: 
105:   // Generate indentation for nested levels - memoized
106:   const indentation = useMemo(() => {
107:     const result = [];
108:     for (let i = 0; i < depth; i++) {
109:       result.push(
110:         <span key={`indent-${i}`} className={styles.treeItemIndent} />
111:       );
112:     }
113:     return result;
114:   }, [depth]);
115: 
116:   return (
117:     <div
118:       className={`${styles.treeItem} ${
119:         (isSelected || isDirectorySelected) ? styles.treeItemSelected : ""
120:       } ${isDisabled ? styles.disabledItem : ""}`}
121:       onClick={handleItemClick}
122:       data-testid={`tree-item-${name}`}
123:     >
124:       <div className={styles.treeItemContent}>
125:         {indentation}
126: 
127:         {type === "directory" && (
128:           <div
129:             className={`${styles.treeItemExpander} ${
130:               isExpanded ? styles.treeItemExpanderRotated : ""
131:             }`}
132:             onClick={handleToggle}
133:           >
134:             <ChevronRight size={14} />
135:           </div>
136:         )}
137: 
138:         <input
139:           type="checkbox"
140:           checked={isSelected || isDirectorySelected}
141:           onChange={handleCheckboxChange}
142:           onClick={handleCheckboxClick}
143:           ref={type === "directory" ? checkboxRef : null}
144:           className={styles.treeItemCheckbox}
145:           disabled={isDisabled}
146:         />
147: 
148:         <div className={styles.treeItemIcon}>
149:           {type === "directory" ? (
150:             <Folder size={16} className={styles.folderIcon} />
151:           ) : (
152:             <File size={16} className={styles.fileIcon} />
153:           )}
154:         </div>
155: 
156:         <span
157:           className={styles.treeItemName}
158:           title={path}
159:           onClick={(e) => {
160:             e.stopPropagation();
161:             if (type === "file" && !isDisabled) {
162:               toggleFileSelection(path);
163:             } else if (type === "directory") {
164:               toggleExpanded(id);
165:             }
166:           }}
167:         >
168:           {name}
169:         </span>
170:         
171:         {/* Display token count or excluded label */}
172:         {type === "file" && fileData && (
173:           <span className={styles.treeItemTokens}>
174:             {isDisabled ? "Excluded" : fileData.tokenCount > 0 ? `(${fileData.tokenCount.toLocaleString()})` : ""}
175:           </span>
176:         )}
177:       </div>
178:     </div>
179:   );
180: });
181: 
182: TreeItem.displayName = "TreeItem";
183: 
184: export default TreeItem;
````

## File: src/components/UserInstructionsWithTemplates.module.css
````css
  1: .container {
  2:   display: flex;
  3:   flex-direction: column;
  4:   gap: 1rem;
  5:   width: 100%;
  6:   height: 100%;
  7:   min-height: 200px;
  8:   border: 1px solid var(--border-color);
  9:   border-radius: var(--radius);
 10:   padding: 1rem;
 11:   background-color: var(--background-primary);
 12:   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
 13:   margin-bottom: 1rem;
 14: }
 15: 
 16: .header {
 17:   display: flex;
 18:   justify-content: space-between;
 19:   align-items: center;
 20:   gap: 1rem;
 21:   padding-bottom: 0.75rem;
 22:   border-bottom: 1px solid var(--border-color);
 23:   margin-bottom: 0.75rem;
 24: }
 25: 
 26: .header::before {
 27:   content: "Template";
 28:   font-weight: 500;
 29:   font-size: 0.9rem;
 30:   color: var(--text-primary);
 31: }
 32: 
 33: .templateSelector {
 34:   width: 400px;
 35:   max-width: 100%;
 36: }
 37: 
 38: .textareaContainer {
 39:   flex: 1;
 40:   min-height: 150px;
 41:   position: relative;
 42: }
 43: 
 44: .textareaContainer::before {
 45:   content: "Instructions";
 46:   display: block;
 47:   font-weight: 500;
 48:   font-size: 0.9rem;
 49:   color: var(--text-primary);
 50:   margin-bottom: 0.5rem;
 51: }
 52: 
 53: .textarea {
 54:   width: 100%;
 55:   height: 100%;
 56:   min-height: 150px;
 57:   padding: 0.75rem;
 58:   border: 1px solid var(--border-color);
 59:   border-radius: 0.375rem;
 60:   background-color: var(--input-bg);
 61:   color: var(--text-color);
 62:   font-family: var(--font-mono);
 63:   font-size: 0.875rem;
 64:   line-height: 1.5;
 65:   resize: vertical;
 66:   transition: border-color 0.2s ease, box-shadow 0.2s ease;
 67: }
 68: 
 69: .textarea:focus {
 70:   outline: none;
 71:   border-color: var(--primary-color);
 72:   box-shadow: 0 0 0 2px var(--primary-color-alpha);
 73: }
 74: 
 75: .templatePreview {
 76:   padding: 1rem;
 77:   border: 1px solid var(--border-color);
 78:   border-radius: 0.375rem;
 79:   background-color: var(--surface-color);
 80:   margin-top: 1rem;
 81:   box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
 82: }
 83: 
 84: .templatePreview h4 {
 85:   margin: 0 0 0.5rem 0;
 86:   font-size: 1rem;
 87:   font-weight: 600;
 88:   color: var(--heading-color);
 89: }
 90: 
 91: .templateDescription {
 92:   margin: 0 0 1rem 0;
 93:   font-size: 0.875rem;
 94:   color: var(--text-color-secondary);
 95: }
 96: 
 97: .templateContent {
 98:   margin: 0;
 99:   padding: 0.75rem;
100:   background-color: var(--code-bg);
101:   border-radius: 0.25rem;
102:   font-family: var(--font-mono);
103:   font-size: 0.875rem;
104:   line-height: 1.5;
105:   white-space: pre-wrap;
106:   color: var(--code-color);
107:   border: 1px solid rgba(0, 0, 0, 0.1);
108: }
109: 
110: .insertModeOptions {
111:   display: flex;
112:   gap: 0.5rem;
113:   justify-content: center;
114:   margin-top: 1rem;
115: }
116: 
117: /* Responsive adjustments */
118: @media (max-width: 640px) {
119:   .templateSelector {
120:     width: 100%;
121:   }
122:   
123:   .header {
124:     flex-direction: column;
125:     align-items: stretch;
126:   }
127: }
````

## File: src/components/UserInstructionsWithTemplates.tsx
````typescript
  1: import React, { useState, useCallback, useMemo } from 'react';
  2: import { ConfirmationDialog } from './ui/ConfirmationDialog';
  3: import { TemplateDropdownAdapter } from './ui/DropdownMenu/TemplateDropdownAdapter';
  4: import {
  5:   PromptTemplate,
  6:   PROMPT_TEMPLATES,
  7:   TEMPLATE_STORAGE_KEY,
  8:   TEMPLATE_INSERT_MODE_KEY,
  9:   TemplateInsertMode,
 10:   TemplateCategory
 11: } from '../constants/promptTemplates';
 12: import styles from './UserInstructionsWithTemplates.module.css';
 13: 
 14: interface UserInstructionsWithTemplatesProps {
 15:   instructions: string;
 16:   setInstructions: (value: string | ((prev: string) => string)) => void;
 17: }
 18: 
 19: interface TemplateOption {
 20:   value: string;
 21:   label: string;
 22:   category: TemplateCategory;
 23:   icon?: string;
 24:   description?: string;
 25:   disabled?: boolean;
 26: }
 27: 
 28: export const UserInstructionsWithTemplates: React.FC<UserInstructionsWithTemplatesProps> = ({
 29:   instructions,
 30:   setInstructions,
 31: }) => {
 32:   // State for selected template and preview
 33:   const [selectedTemplate, setSelectedTemplate] = useState<string | null>(() => {
 34:     return localStorage.getItem(TEMPLATE_STORAGE_KEY);
 35:   });
 36:   const [previewTemplate, setPreviewTemplate] = useState<PromptTemplate | null>(null);
 37:   
 38:   // State for confirmation dialog
 39:   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
 40:   const [pendingTemplate, setPendingTemplate] = useState<PromptTemplate | null>(null);
 41:   
 42:   // State for insertion mode
 43:   const [insertMode, setInsertMode] = useState<TemplateInsertMode>(() => {
 44:     return (localStorage.getItem(TEMPLATE_INSERT_MODE_KEY) as TemplateInsertMode) || 'replace';
 45:   });
 46: 
 47:   // Create template options for the dropdown
 48:   const templateOptions = useMemo<TemplateOption[]>(() => {
 49:     return PROMPT_TEMPLATES.map(template => ({
 50:       value: template.id,
 51:       label: template.name,
 52:       description: template.description,
 53:       icon: template.icon,
 54:       category: template.category
 55:     }));
 56:   }, []);
 57: 
 58:   // Handle template selection
 59:   const handleTemplateSelect = useCallback((value: string) => {
 60:     const template = PROMPT_TEMPLATES.find(t => t.id === value);
 61:     if (!template) return;
 62:     
 63:     // Save last selected template
 64:     localStorage.setItem(TEMPLATE_STORAGE_KEY, value);
 65:     setSelectedTemplate(value);
 66:     
 67:     // Also update the preview template when selected
 68:     setPreviewTemplate(template);
 69:     
 70:     // If instructions are empty, directly insert
 71:     if (!instructions.trim()) {
 72:       setInstructions(template.content);
 73:       return;
 74:     }
 75:     
 76:     // Otherwise, show confirmation dialog
 77:     setPendingTemplate(template);
 78:     setShowConfirmDialog(true);
 79:   }, [instructions, setInstructions]);
 80: 
 81:   // Handle template insertion
 82:   const insertTemplate = useCallback((template: PromptTemplate, mode: TemplateInsertMode) => {
 83:     // Save insertion mode preference
 84:     localStorage.setItem(TEMPLATE_INSERT_MODE_KEY, mode);
 85:     setInsertMode(mode);
 86:     
 87:     if (mode === 'replace') {
 88:       setInstructions(template.content);
 89:     } else {
 90:       setInstructions((prev: string) => {
 91:         if (prev.trim()) {
 92:           return `${prev.trim()}\n\n${template.content}`;
 93:         }
 94:         return template.content;
 95:       });
 96:     }
 97:   }, [setInstructions]);
 98: 
 99:   // Get the selected template name
100:   const getSelectedTemplateName = () => {
101:     if (!selectedTemplate) return null;
102:     const template = PROMPT_TEMPLATES.find(t => t.id === selectedTemplate);
103:     return template ? template.name : null;
104:   };
105: 
106:   return (
107:     <div className={styles.container}>
108:       <div className={styles.header}>
109:         <div className={styles.templateSelector}>
110:           <TemplateDropdownAdapter
111:             options={templateOptions}
112:             value={selectedTemplate || undefined}
113:             onChange={handleTemplateSelect}
114:             placeholder="Select a prompt template..."
115:             title="Select a prompt template"
116:           />
117:         </div>
118:       </div>
119: 
120:       <div className={styles.textareaContainer}>
121:         <textarea
122:           value={instructions}
123:           onChange={(e) => setInstructions(e.target.value)}
124:           placeholder="Enter your instructions here to guide the AI response..."
125:           className={styles.textarea}
126:           aria-label="User instructions"
127:         />
128:       </div>
129: 
130:       {selectedTemplate && (
131:         <div className={styles.templatePreview} role="complementary" aria-label="Template preview">
132:           <h4>Selected Template: {getSelectedTemplateName()}</h4>
133:           {previewTemplate && (
134:             <>
135:               <p className={styles.templateDescription}>{previewTemplate.description}</p>
136:             </>
137:           )}
138:         </div>
139:       )}
140: 
141:       <ConfirmationDialog
142:         isOpen={showConfirmDialog}
143:         onClose={() => {
144:           setShowConfirmDialog(false);
145:           setPendingTemplate(null);
146:         }}
147:         onConfirm={() => {
148:           if (pendingTemplate) {
149:             insertTemplate(pendingTemplate, insertMode);
150:           }
151:           setShowConfirmDialog(false);
152:           setPendingTemplate(null);
153:         }}
154:         title="Insert Template"
155:         description="Would you like to replace your current instructions or append the template?"
156:         confirmLabel={insertMode === 'replace' ? 'Replace' : 'Append'}
157:         cancelLabel="Cancel"
158:       />
159:     </div>
160:   );
161: };
````

## File: src/constants/api.ts
````typescript
1: // API Endpoints
2: export const OPENROUTER_MODELS_API_URL = "https://openrouter.ai/api/v1/models";
3: 
4: // Add other API-related constants here as needed
````

## File: src/constants/outputFormats.ts
````typescript
 1: export type OutputFormatType = 'xml' | 'markdown' | 'plain';
 2: 
 3: export const OUTPUT_FORMAT_OPTIONS = [
 4:   { 
 5:     value: 'xml', 
 6:     label: 'XML', 
 7:     description: 'XML format with tags for file content',
 8:     icon: '🔰'
 9:   },
10:   { 
11:     value: 'markdown', 
12:     label: 'Markdown', 
13:     description: 'Markdown format with code blocks',
14:     icon: '📝'
15:   },
16:   { 
17:     value: 'plain', 
18:     label: 'Plain Text', 
19:     description: 'Plain text with ASCII separators',
20:     icon: '📄'
21:   },
22: ];
23: 
24: export const OUTPUT_FORMAT_STORAGE_KEY = 'pastemax-output-format';
````

## File: src/constants/promptTemplates.ts
````typescript
  1: export interface PromptTemplate {
  2:   id: string;
  3:   name: string;
  4:   content: string;
  5:   category: TemplateCategory;
  6:   description?: string;
  7:   icon?: string;
  8: }
  9: 
 10: export type TemplateCategory = 
 11:   | 'Code Review' 
 12:   | 'Documentation Generation' 
 13:   | 'Analysis and Improvement' 
 14:   | 'Testing' 
 15:   | 'Code Quality';
 16: 
 17: export const PROMPT_TEMPLATES: PromptTemplate[] = [
 18:   {
 19:     id: 'architecture-review',
 20:     name: 'Architecture Review',
 21:     category: 'Code Review',
 22:     icon: '🏗️',
 23:     description: 'Analyze codebase architecture, patterns, and suggest improvements',
 24:     content: `Architecture Review:
 25: - Analyze this codebase's architecture:
 26: 1. Evaluate the overall structure and patterns
 27: 2. Identify potential architectural issues
 28: 3. Suggest improvements for scalability
 29: 4. Note areas that follow best practices
 30: Focus on maintainability and modularity.`
 31:   },
 32:   {
 33:     id: 'security-review',
 34:     name: 'Security Review',
 35:     category: 'Code Review',
 36:     icon: '🔒',
 37:     description: 'Identify security vulnerabilities and suggest fixes',
 38:     content: `Security Review:
 39: Perform a security review of this codebase:
 40: 1. Identify potential security vulnerabilities
 41: 2. Check for common security anti-patterns
 42: 3. Review error handling and input validation
 43: 4. Assess dependency security
 44: Provide specific examples and remediation steps.`
 45:   },
 46:   {
 47:     id: 'performance-review',
 48:     name: 'Performance Review',
 49:     category: 'Code Review',
 50:     icon: '⚡',
 51:     description: 'Analyze performance bottlenecks and optimization opportunities',
 52:     content: `Performance Review
 53: Review the codebase for performance:
 54: 1. Identify performance bottlenecks
 55: 2. Check resource utilization
 56: 3. Review algorithmic efficiency
 57: 4. Assess caching strategies
 58: Include specific optimization recommendations.`
 59:   },
 60:   {
 61:     id: 'api-documentation',
 62:     name: 'API Documentation',
 63:     category: 'Documentation Generation',
 64:     icon: '📚',
 65:     description: 'Generate comprehensive API documentation',
 66:     content: `API Documentation
 67: Generate comprehensive API documentation:
 68: 1. List and describe all public endpoints
 69: 2. Document request/response formats
 70: 3. Include usage examples
 71: 4. Note any limitations or constraints`
 72:   },
 73:   {
 74:     id: 'developer-guide',
 75:     name: 'Developer Guide',
 76:     category: 'Documentation Generation',
 77:     icon: '📖',
 78:     description: 'Create a comprehensive guide for developers',
 79:     content: `Developer Guide
 80: Create a developer guide covering:
 81: 1. Setup instructions
 82: 2. Project structure overview
 83: 3. Development workflow
 84: 4. Testing approach
 85: 5. Common troubleshooting steps`
 86:   },
 87:   {
 88:     id: 'architecture-documentation',
 89:     name: 'Architecture Documentation',
 90:     category: 'Documentation Generation',
 91:     icon: '🏛️',
 92:     description: 'Document system architecture and design decisions',
 93:     content: `Architecture Documentation
 94: Document the system architecture:
 95: 1. High-level overview
 96: 2. Component interactions
 97: 3. Data flow diagrams
 98: 4. Design decisions and rationale
 99: 5. System constraints and limitations`
100:   },
101:   {
102:     id: 'dependency-analysis',
103:     name: 'Dependency Analysis',
104:     category: 'Analysis and Improvement',
105:     icon: '📦',
106:     description: 'Analyze project dependencies and suggest improvements',
107:     content: `Dependency Analysis
108: Analyze the project dependencies:
109: 1. Identify outdated packages
110: 2. Check for security vulnerabilities
111: 3. Suggest alternative packages
112: 4. Review dependency usage patterns
113: Include specific upgrade recommendations.`
114:   },
115:   {
116:     id: 'test-coverage',
117:     name: 'Test Coverage Review',
118:     category: 'Testing',
119:     icon: '🧪',
120:     description: 'Review test coverage and suggest improvements',
121:     content: `Test Coverage Review
122: Review the test coverage:
123: 1. Identify untested components
124: 2. Suggest additional test cases
125: 3. Review test quality
126: 4. Recommend testing strategies`
127:   },
128:   {
129:     id: 'code-quality',
130:     name: 'Code Quality Assessment',
131:     category: 'Code Quality',
132:     icon: '✨',
133:     description: 'Assess code quality and suggest improvements',
134:     content: `Code Quality Assessment
135: Assess code quality and suggest improvements:
136: 1. Review naming conventions
137: 2. Check code organization
138: 3. Evaluate error handling
139: 4. Review commenting practices
140: Provide specific examples of good and problematic patterns.`
141:   }
142: ];
143: 
144: export const TEMPLATE_STORAGE_KEY = 'pastemax-last-template';
145: export const TEMPLATE_INSERT_MODE_KEY = 'pastemax-template-insert-mode';
146: export type TemplateInsertMode = 'replace' | 'append';
````

## File: src/constants/theme.ts
````typescript
1: // export const STORAGE_KEY = "pastemax-theme";
````

## File: src/context/ThemeContext.tsx
````typescript
 1: import React, { useState, useEffect } from "react";
 2: import { ThemeType, ThemeContext } from "./ThemeContextType";
 3: 
 4: export const ThemeProvider = ({
 5:   children,
 6: }: {
 7:   children: React.ReactNode;
 8: }): JSX.Element => {
 9:   // Initialize theme from localStorage or default to "system"
10:   const [theme, setThemeState] = useState<ThemeType>(() => {
11:     const savedTheme = localStorage.getItem("theme") as ThemeType;
12:     return savedTheme && ["light", "dark", "system"].includes(savedTheme) ? savedTheme : "system";
13:   });
14:   
15:   const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
16: 
17:   // Function to set theme and save to localStorage
18:   const setTheme = (newTheme: ThemeType) => {
19:     setThemeState(newTheme);
20:     localStorage.setItem("theme", newTheme);
21:   };
22: 
23:   // Effect to apply the correct theme based on selection or system preference
24:   useEffect(() => {
25:     const applyTheme = (themeName: "light" | "dark") => {
26:       setCurrentTheme(themeName);
27:       
28:       if (themeName === "dark") {
29:         document.body.classList.add("dark-mode");
30:       } else {
31:         document.body.classList.remove("dark-mode");
32:       }
33:     };
34:     
35:     // Check for system preference
36:     const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
37:     
38:     // Apply theme based on selection or system preference
39:     if (theme === "system") {
40:       applyTheme(prefersDark ? "dark" : "light");
41:     } else {
42:       applyTheme(theme as "light" | "dark");
43:     }
44:     
45:     // Listen for system preference changes if in auto mode
46:     const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
47:     
48:     const handleSystemThemeChange = (e: MediaQueryListEvent) => {
49:       if (theme === "system") {
50:         applyTheme(e.matches ? "dark" : "light");
51:       }
52:     };
53:     
54:     mediaQuery.addEventListener("change", handleSystemThemeChange);
55:     
56:     return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
57:   }, [theme]);
58: 
59:   return (
60:     <ThemeContext.Provider value={{ theme, currentTheme, setTheme }}>
61:       {children}
62:     </ThemeContext.Provider>
63:   );
64: };
````

## File: src/context/ThemeContextType.ts
````typescript
 1: import { createContext } from "react";
 2: 
 3: export type ThemeType = "light" | "dark" | "system";
 4: 
 5: export interface ThemeContextType {
 6:   theme: ThemeType;
 7:   currentTheme: "light" | "dark"; // The actual applied theme
 8:   setTheme: (theme: ThemeType) => void;
 9: }
10: 
11: // Create context with proper typing
12: const defaultThemeContext: ThemeContextType = {
13:   theme: "system",
14:   currentTheme: "light",
15:   setTheme: () => {},
16: };
17: 
18: export const ThemeContext = createContext(defaultThemeContext);
````

## File: src/hooks/useTheme.ts
````typescript
 1: import { useContext } from "react";
 2: import { ThemeContext } from "../context/ThemeContextType";
 3: 
 4: export const useTheme = () => {
 5:   const context = useContext(ThemeContext);
 6:   if (context === undefined) {
 7:     throw new Error("useTheme must be used within a ThemeProvider");
 8:   }
 9:   return context;
10: };
````

## File: src/styles/globals.css
````css
 1: :root {
 2:   /* Base colors */
 3:   --background: #ffffff;
 4:   --background-primary: #ffffff;
 5:   --background-secondary: #f1f5f9;
 6:   --background-selected: #f8fafc;
 7:   --foreground: #0f172a;
 8:   
 9:   /* Text colors */
10:   --text-primary: #0f172a;
11:   --text-secondary: #64748b;
12:   --text-muted: #94a3b8;
13:   
14:   /* Border colors */
15:   --border-color: #e2e8f0;
16:   --border-hover: #cbd5e1;
17:   
18:   /* Component colors */
19:   --accent-color: #0ea5e9;
20:   --accent-hover: #0284c7;
21:   --accent-muted: #e0f2fe;
22:   
23:   /* Status colors */
24:   --success: #22c55e;
25:   --warning: #f59e0b;
26:   --error: #ef4444;
27:   
28:   /* Shadows */
29:   --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
30:   --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
31:   --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
32:   
33:   /* Radii */
34:   --radius: 6px;
35:   --radius-lg: 8px;
36:   --radius-full: 9999px;
37: }
38: 
39: .dark-mode {
40:   /* Base colors */
41:   --background: #0f172a;
42:   --background-primary: #1e293b;
43:   --background-secondary: #0f172a;
44:   --background-selected: #334155;
45:   --foreground: #f8fafc;
46:   
47:   /* Text colors */
48:   --text-primary: #f8fafc;
49:   --text-secondary: #94a3b8;
50:   --text-muted: #64748b;
51:   
52:   /* Border colors */
53:   --border-color: #1e293b;
54:   --border-hover: #334155;
55:   
56:   /* Component colors */
57:   --accent-color: #0ea5e9;
58:   --accent-hover: #38bdf8;
59:   --accent-muted: #0c4a6e;
60:   
61:   /* Status colors */
62:   --success: #22c55e;
63:   --warning: #f59e0b;
64:   --error: #ef4444;
65:   
66:   /* Shadows */
67:   --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
68:   --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
69:   --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
70: }
71: 
72: /* ... rest of the existing styles ... */
````

## File: src/styles/index.css
````css
  1: :root {
  2:   /* Refined monochrome Zinc theme with improved contrasts */
  3:   --background-primary: hsl(0, 0%, 100%);
  4:   --background-primary-dark: hsl(240, 10%, 3.9%);
  5:   --background-secondary: hsla(240, 4.8%, 95.9%, 0.92);
  6:   --background-selected: hsla(216, 12%, 92%, 0.85);
  7:   --card-background: hsla(0, 0%, 100%, 0.92);
  8:   --card-foreground: hsl(240, 10%, 3.9%);
  9:   --accent-color: hsl(215, 25%, 27%);
 10:   --border-color: hsla(240, 5.9%, 90%, 0.85);
 11:   --hover-color: hsla(210, 8%, 90%, 0.85);
 12:   --text-primary: hsl(240, 10%, 3.9%);
 13:   --text-secondary: hsl(215, 14%, 34%);
 14:   --text-disabled: hsl(240, 3.8%, 70%);
 15:   --icon-color: hsl(215, 14%, 34%);
 16:   --success-color: hsl(142, 72%, 29%);
 17:   --warning-color: hsl(40, 92%, 40%);
 18:   --error-color: hsl(0, 84.2%, 60.2%);
 19:   --primary-button-background: transparent;
 20:   --primary-button-text: var(--text-primary);
 21:   --primary-button-border: var(--border-color);
 22:   --primary-button-hover: var(--hover-color);
 23:   --primary-button-active: var(--secondary-button-active);
 24:   --secondary-button-background: hsla(240, 4.8%, 95.9%, 0.9);
 25:   --secondary-button-hover: hsla(210, 8%, 90%, 0.9);
 26:   --secondary-button-active: hsla(210, 8%, 85%, 0.9);
 27:   --file-card-selected-border: hsla(211, 100%, 50%, 0.4);
 28:   --popover: hsla(0, 0%, 100%, 0.95);
 29:   --popover-foreground: hsl(0, 0%, 0%);
 30: 
 31:   /* Component Sizing */
 32:   --button-height-sm: 22px;
 33:   --button-height-md: 26px;
 34:   --button-height-lg: 30px;
 35:   
 36:   /* Border radius */
 37:   --radius: 0.4rem;
 38:   --radius-full: 9999px;
 39:   
 40:   /* Focus ring */
 41:   --ring-color: hsl(211, 100%, 50%);
 42:   
 43:   /* Scrollbar */
 44:   --scrollbar-width: 6px;
 45:   --scrollbar-height: 6px;
 46:   --scrollbar-track-color: transparent;
 47:   --scrollbar-thumb-color: hsla(215, 14%, 80%, 0.6);
 48:   --scrollbar-thumb-hover-color: hsla(215, 14%, 70%, 0.8);
 49:   
 50:   /* Z-index layers */
 51:   --z-index-modal: 1000;
 52:   --z-index-dropdown: 100;
 53:   --z-index-tooltip: 50;
 54:   
 55:   /* Elevation (box-shadows) */
 56:   --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
 57:   --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.08);
 58:   --shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.1);
 59:   --shadow-xl: 0 8px 16px rgba(0, 0, 0, 0.15);
 60:   
 61:   /* Backdrop blur for vibrancy */
 62:   --backdrop-blur-sm: blur(8px);
 63:   --backdrop-blur-md: blur(12px);
 64:   --backdrop-blur-lg: blur(16px);
 65:   
 66:   /* Font Sizes (reduced by ~25%) */
 67:   --font-size-xs: 0.65rem;
 68:   --font-size-sm: 0.75rem;
 69:   --font-size-md: 0.85rem;
 70:   --font-size-lg: 1rem;
 71:   --font-size-xl: 1.15rem;
 72:   
 73:   /* Component Spacing */
 74:   --spacing-xs: 0.25rem;
 75:   --spacing-sm: 0.5rem;
 76:   --spacing-md: 0.75rem;
 77:   --spacing-lg: 1rem;
 78: }
 79: 
 80: /* Dark theme variables - enhanced for better contrast and modern feel */
 81: .dark-mode {
 82:   --background-primary: hsla(220, 13%, 9%, 0.9);
 83:   --background-primary-dark: hsla(220, 13%, 9%, 0.95);
 84:   --background-secondary: hsla(220, 13%, 14%, 0.85);
 85:   --background-selected: hsla(222, 15%, 19%, 0.75);
 86:   --card-background: hsla(220, 13%, 9%, 0.85);
 87:   --card-foreground: hsl(0, 0%, 98%);
 88:   --accent-color: hsl(213, 30%, 60%);
 89:   --border-color: hsla(220, 13%, 18%, 0.8);
 90:   --hover-color: hsla(222, 15%, 22%, 0.8);
 91:   --text-primary: hsl(0, 0%, 98%);
 92:   --text-secondary: hsl(214, 15%, 72%);
 93:   --text-disabled: hsl(214, 15%, 50%);
 94:   --icon-color: hsl(214, 15%, 72%);
 95:   --primary-button-background: transparent;
 96:   --primary-button-text: var(--text-primary);
 97:   --primary-button-border: var(--border-color);
 98:   --primary-button-hover: var(--hover-color);
 99:   --primary-button-active: var(--secondary-button-active);
100:   --secondary-button-background: hsla(222, 15%, 18%, 0.9);
101:   --secondary-button-hover: hsla(222, 15%, 22%, 0.9);
102:   --secondary-button-active: hsla(222, 15%, 27%, 0.9);
103:   --file-card-selected-border: hsla(211, 100%, 65%, 0.5);
104:   --scrollbar-thumb-color: hsla(220, 13%, 25%, 0.6);
105:   --scrollbar-thumb-hover-color: hsla(220, 13%, 35%, 0.8);
106:   --popover-foreground: hsl(0, 0%, 98%);
107:   --dropdown-menu-background: hsla(220, 13%, 9%, 0.95);
108:   --dropdown-item-hover: hsla(222, 15%, 18%, 0.9);
109:   --ring-color: hsl(211, 100%, 65%);
110: }
111: 
112: /* Reset and base styles */
113: * {
114:   margin: 0;
115:   padding: 0;
116:   box-sizing: border-box;
117: }
118: 
119: :root,
120: .dark-mode {
121:   transition: 
122:     color 0.15s ease-out,
123:     background-color 0.15s ease-out,
124:     border-color 0.15s ease-out,
125:     box-shadow 0.15s ease-out;
126: }
127: 
128: body {
129:   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
130:   -webkit-font-smoothing: antialiased;
131:   -moz-osx-font-smoothing: grayscale;
132:   background-color: var(--background-primary);
133:   color: var(--text-primary);
134:   transition: background-color 0.15s ease-out, color 0.15s ease-out;
135:   font-size: var(--font-size-sm);
136:   line-height: 1.4;
137: }
138: 
139: #root {
140:   min-height: 100vh;
141:   display: flex;
142:   flex-direction: column;
143: }
144: 
145: /* Global scrollbar styling */
146: ::-webkit-scrollbar {
147:   width: var(--scrollbar-width);
148:   height: var(--scrollbar-height);
149: }
150: 
151: ::-webkit-scrollbar-track {
152:   background: var(--scrollbar-track-color);
153: }
154: 
155: ::-webkit-scrollbar-thumb {
156:   background: var(--scrollbar-thumb-color);
157:   border-radius: var(--radius-full);
158: }
159: 
160: ::-webkit-scrollbar-thumb:hover {
161:   background: var(--scrollbar-thumb-hover-color);
162: }
163: 
164: ::-webkit-scrollbar-corner {
165:   background: transparent;
166: }
167: 
168: /* Global button style adjustments */
169: button, 
170: .button {
171:   font-size: var(--font-size-sm);
172:   line-height: 1;
173:   padding: 0.35rem 0.6rem;
174: }
175: 
176: /* Input fields */
177: input, 
178: textarea, 
179: select {
180:   font-size: var(--font-size-sm);
181:   padding: 0.25rem 0.5rem;
182:   line-height: 1.4;
183:   letter-spacing: normal;
184:   text-rendering: auto;
185: }
186: 
187: /* Headings */
188: h1 { font-size: var(--font-size-xl); }
189: h2 { font-size: var(--font-size-lg); }
190: h3 { font-size: var(--font-size-md); }
191: h4, h5, h6 { font-size: var(--font-size-sm); }
192: 
193: /* List items */
194: li { font-size: var(--font-size-sm); }
195: 
196: /* Tables */
197: table { font-size: var(--font-size-sm); }
198: 
199: /* Dialog/modal content */
200: dialog, 
201: .modal {
202:   font-size: var(--font-size-sm);
203: }
````

## File: src/types/css.d.ts
````typescript
1: declare module '*.module.css' {
2:   const classes: { [key: string]: string };
3:   export default classes;
4: }
````

## File: src/types/electron.d.ts
````typescript
 1: declare global {
 2:   interface Window {
 3:     /**
 4:      * Electron API exposed through contextBridge in preload.js
 5:      */
 6:     electron: {
 7:       /**
 8:        * IPC Renderer interface for communication with the main process
 9:        */
10:       ipcRenderer: {
11:         /**
12:          * Send a message to the main process
13:          * @param channel - The channel to send the message on
14:          * @param data - Optional data to send with the message
15:          */
16:         send: (channel: string, data?: any) => void;
17:         
18:         /**
19:          * Register a listener for messages from the main process
20:          * @param channel - The channel to listen on
21:          * @param func - The callback function to handle the message
22:          */
23:         on: (channel: string, func: (...args: any[]) => void) => void;
24:         
25:         /**
26:          * Remove a listener for messages from the main process
27:          * @param channel - The channel to remove the listener from
28:          * @param func - The callback function to remove
29:          */
30:         removeListener: (channel: string, func: (...args: any[]) => void) => void;
31:         
32:         /**
33:          * Invoke a method in the main process and get a response
34:          * @param channel - The channel to invoke the method on
35:          * @param data - Optional data to send with the invocation
36:          * @returns A promise that resolves with the result from the main process
37:          */
38:         invoke: <T = any>(channel: string, data?: any) => Promise<T>;
39:         
40:         /**
41:          * Set the maximum number of listeners for a channel
42:          * @param n - The maximum number of listeners
43:          */
44:         setMaxListeners?: (n: number) => void;
45:       };
46: 
47:       // Specific invoke methods
48:       openFolder: () => Promise<string | null>;
49:       readFile: (filePath: string) => Promise<string | null>;
50:       requestFileList: (data: { path: string; forceRefresh?: boolean }) => Promise<any>; // Consider defining a stricter return type
51:       saveIgnorePatterns: (data: { patterns: string; isGlobal: boolean; folderPath?: string }) => Promise<{ success: boolean; error?: string }>;
52:       loadIgnorePatterns: (data: { folderPath?: string; isGlobal: boolean }) => Promise<{ success: boolean; patterns: string; systemPatterns: string[]; excludedPatterns: string[]; error?: string }>;
53:       resetIgnorePatterns: (data: { folderPath?: string; isGlobal: boolean }) => Promise<{ success: boolean; patterns?: string; systemPatterns?: string[]; error?: string }>;
54:       clearLocalIgnorePatterns: (data: { folderPath: string }) => Promise<{ success: boolean; error?: string }>;
55:       getFileContent: (filePath: string) => Promise<{ success: boolean; content?: string; size?: number; lastModified?: number; error?: string }>;
56:       testIgnorePatterns: (data: { folderPath: string; patterns: string }) => Promise<{ success: boolean; ignoredCount?: number; ignoredFiles?: string[]; totalFilesChecked?: number; error?: string }>;
57:       compressCode: (source: string, language: string) => Promise<string | null>;
58:       removeComments: (source: string, language: string, keepDocstrings?: boolean) => Promise<string | null>;
59:       countTokens: (text: string) => Promise<number>; // Added based on error messages
60:       getFileMetadata: (filePath: string) => Promise<{ 
61:         success: boolean; 
62:         fileData?: { 
63:           name: string; 
64:           path: string; 
65:           size: number; 
66:           lastModified: number; 
67:           isBinary: boolean; 
68:           excludedByDefault: boolean; 
69:           excluded: boolean; 
70:           isSkipped: boolean; 
71:           tokenCount: number; 
72:           uncompressedTokenCount: number;
73:           error?: string;
74:         }; 
75:         error?: string 
76:       }>;
77: 
78:       // Send method (if still needed - prefer specific invokes)
79:       send: (channel: string, data?: any) => void;
80: 
81:       // Receive method (if still needed)
82:       receive: (channel: string, func: (...args: any[]) => void) => void;
83:       
84:       // Optional: Keep generic ipcRenderer if absolutely necessary, but discourage use
85:       ipcRenderer?: {
86:         send: (channel: string, data?: any) => void;
87:         invoke: (channel: string, data?: any) => Promise<any>;
88:         on: (channel: string, func: (...args: any[]) => void) => any; // Return type might vary
89:         removeListener: (channel: string, func: (...args: any[]) => void) => void;
90:         removeAllListeners: (channel: string) => void;
91:       };
92:     };
93:   }
94: }
95: 
96: export {};
````

## File: src/types/FileInfo.ts
````typescript
 1: // Commenting out the unused FileInfo type
 2: /*
 3: export interface FileInfo {
 4:   name: string;
 5:   path: string;
 6:   size: number;
 7:   lastModified: number;
 8:   isBinary: boolean;
 9:   tokenCount: number; 
10:   excludedByDefault: boolean;
11:   excluded: boolean;
12:   isSkipped: boolean; 
13: }
14: */
15: 
16: export {}; // Keep this if the file becomes empty
````

## File: src/types/FileTypes.ts
````typescript
 1: export interface FileData {
 2:   name: string;
 3:   path: string;
 4:   content?: string;
 5:   tokenCount: number;
 6:   uncompressedTokenCount: number;
 7:   isCompressed: boolean;
 8:   size: number;
 9:   isBinary: boolean;
10:   isSkipped: boolean;
11:   error?: string;
12:   fileType?: string;
13:   type?: "file" | "directory";
14:   excludedByDefault?: boolean;
15:   lastModified?: number;
16:   isAppDirectory?: boolean;
17:   excluded?: boolean;
18: }
19: 
20: export interface TreeNode {
21:   id: string;
22:   name: string;
23:   path: string;
24:   type: "file" | "directory";
25:   children?: TreeNode[];
26:   isExpanded?: boolean;
27:   isSelected?: boolean;
28:   depth: number;
29:   parentId?: string;
30:   fileData?: FileData;
31: }
32: 
33: export interface SidebarProps {
34:   selectedFolder: string | null;
35:   openFolder: () => void;
36:   allFiles: Omit<FileData, 'content'>[];
37:   selectedFiles: string[];
38:   toggleFileSelection: (filePath: string) => void;
39:   toggleFolderSelection: (folderPath: string, isSelected: boolean) => void;
40:   searchTerm: string;
41:   onSearchChange: (term: string) => void;
42:   selectAllFiles: () => void;
43:   deselectAllFiles: () => void;
44:   expandedNodes: Map<string, boolean>;
45:   toggleExpanded: (nodeId: string) => void;
46: }
47: 
48: export interface FileListProps {
49:   files: Omit<FileData, 'content'>[];
50:   selectedFiles: string[];
51:   toggleFileSelection: (filePath: string) => void;
52: }
53: 
54: export interface FileCardProps {
55:   file: Omit<FileData, 'content'>;
56:   isSelected: boolean;
57:   toggleSelection: (filePath: string) => void;
58: }
59: 
60: export interface TreeItemProps {
61:   node: TreeNode;
62:   selectedFiles: string[];
63:   toggleFileSelection: (filePath: string) => void;
64:   toggleFolderSelection: (folderPath: string, isSelected: boolean) => void;
65:   toggleExpanded: (nodeId: string) => void;
66: }
67: 
68: export interface SortOption {
69:   value: string;
70:   label: string;
71: }
72: 
73: export interface SearchBarProps {
74:   searchTerm: string;
75:   onSearchChange: (term: string) => void;
76: }
77: 
78: export type FileTreeMode = "none" | "selected" | "selected-with-roots" | "complete";
79: 
80: // SortOrder type with consistent naming
81: export type SortOrder = 
82:   | "name-ascending" 
83:   | "name-descending" 
84:   | "tokens-ascending" 
85:   | "tokens-descending" 
86:   | "date-ascending" 
87:   | "date-descending";
88: 
89: // Add IgnorePattern interface for ignore patterns feature
90: export interface IgnorePattern {
91:   pattern: string;
92:   isGlobal: boolean;
93: }
````

## File: src/types/GlobalPatternsState.ts
````typescript
1: // Commenting out the unused GlobalPatternsState type
2: /*
3: export interface GlobalPatternsState {
4:   patterns: string;
5:   excludedSystemPatterns: string[];
6: }
7: */
8: 
9: export {}; // Keep this if the file becomes empty
````

## File: src/types/index.ts
````typescript
1: // Re-export all types from FileTypes.ts
2: export * from './FileTypes';
````

## File: src/types/ModelTypes.ts
````typescript
 1: /**
 2:  * Represents the information structure for an AI model,
 3:  * typically fetched from an API like OpenRouter.
 4:  */
 5: export interface ModelInfo {
 6:   id: string;           // Unique identifier for the model (e.g., "openai/gpt-4o")
 7:   name: string;         // User-friendly display name (e.g., "GPT-4o")
 8:   context_length: number; // Maximum context window size in tokens
 9:   // Add other relevant properties from the API if needed, e.g.:
10:   // description?: string;
11:   // pricing?: { prompt: number; completion: number; };
12: }
````

## File: src/types/SortOrder.ts
````typescript
 1: // Commenting out the unused SortOrder type
 2: /*
 3: export type SortOrder = 
 4:   | "name-ascending"
 5:   | "name-descending"
 6:   | "tokens-ascending"
 7:   | "tokens-descending"
 8:   | "date-ascending"
 9:   | "date-descending";
10: */
11: 
12: export {}; // Keep this if the file becomes empty
````

## File: src/utils/cn.ts
````typescript
 1: /**
 2:  * Merges class names conditionally
 3:  * @param classes - Array of class names or objects with class names as keys and booleans as values
 4:  * @returns Merged class names string
 5:  */
 6: export function cn(...classes: (string | boolean | undefined | null | { [key: string]: boolean })[]): string {
 7:   return classes
 8:     .filter(Boolean)
 9:     .map((item) => {
10:       if (typeof item === 'string') return item;
11:       if (typeof item === 'object' && item !== null) {
12:         return Object.entries(item)
13:           .filter(([, value]) => value)
14:           .map(([key]) => key)
15:           .join(' ');
16:       }
17:       return '';
18:     })
19:     .join(' ')
20:     .trim();
21: }
````

## File: src/utils/compressionUtils.ts
````typescript
  1: // This file now acts as a bridge to the main process for heavy compression tasks.
  2: 
  3: // Global type definition is now in src/types/electron.d.ts
  4: 
  5: /**
  6:  * Asynchronously removes comments from source code by calling the main process.
  7:  *
  8:  * @param source The source code string.
  9:  * @param language The programming language.
 10:  * @param keepDocstrings Whether to preserve documentation comments.
 11:  * @returns A Promise resolving to the source code with comments removed, or null on failure.
 12:  */
 13: export async function removeComments(source: string, language: string, keepDocstrings: boolean = true): Promise<string | null> {
 14:   if (!source || !language) {
 15:     console.warn("Source and language required for comment removal.");
 16:     return source; // Return original if inputs are invalid
 17:   }
 18:   try {
 19:     const result = await window.electron.removeComments(source, language, keepDocstrings);
 20:     return result;
 21:   } catch (error) {
 22:     console.error(`Error calling main process for comment removal (${language}):`, error);
 23:     return null; // Indicate failure
 24:   }
 25: }
 26: 
 27: /**
 28:  * Asynchronously compresses source code by replacing function bodies via the main process.
 29:  *
 30:  * @param source The source code string.
 31:  * @param language The programming language (e.g., 'javascript', 'python').
 32:  * @returns A Promise resolving to the compressed source code string, or null if compression failed or is not supported.
 33:  */
 34: export async function compressCode(source: string, language: string): Promise<string | null> {
 35:   if (!source || !language) {
 36:     console.warn("Source and language required for code compression.");
 37:     return source; // Return original if inputs are invalid
 38:   }
 39:   try {
 40:     const result = await window.electron.compressCode(source, language);
 41:     // If result is null, it means main process failed or didn't support it
 42:     // If result is same as source, it means nothing was compressed (no bodies found)
 43:     return result; 
 44:   } catch (error) {
 45:     console.error(`Error calling main process for code compression (${language}):`, error);
 46:     return null; // Indicate failure
 47:   }
 48: }
 49: 
 50: // Keep any other utility functions here that DON'T depend on tree-sitter
 51: // For example, if you had functions for determining language from filename,
 52: // they could stay here.
 53: 
 54: /**
 55:  * Gets a simple language identifier from a filename.
 56:  * @param filename The filename (e.g., 'myComponent.tsx')
 57:  * @returns A language string (e.g., 'typescript', 'python') or null.
 58:  */
 59: export function getLanguageFromFilename(filename: string): string | null {
 60:   if (!filename) return null;
 61:   
 62:   // More reliable extension extraction
 63:   const lastDotIndex = filename.lastIndexOf('.');
 64:   const extension = lastDotIndex !== -1 ? filename.slice(lastDotIndex + 1).toLowerCase() : '';
 65:   
 66:   if (!extension) return null;
 67: 
 68:   switch (extension) {
 69:     case 'js':
 70:     case 'jsx':
 71:       return 'javascript';
 72:     case 'ts':
 73:     case 'tsx':
 74:       return 'typescript';
 75:     case 'py':
 76:       return 'python';
 77:     case 'css':
 78:       return 'css';
 79:     case 'html':
 80:     case 'htm':
 81:       return 'html';
 82:     // Add more mappings as needed
 83:     default:
 84:       return null; // Or return the extension itself if you want to attempt unsupported types
 85:   }
 86: }
 87: 
 88: // --- Example Usage (for testing) ---
 89: /*
 90: const jsCode = `
 91: function hello(name) {
 92:   console.log("Hello, " + name);
 93:   return true;
 94: }
 95: 
 96: const add = (a, b) => {
 97:   const result = a + b;
 98:   return result;
 99: };
100: 
101: class Greeter {
102:   constructor(greeting) {
103:     this.greeting = greeting;
104:   }
105: 
106:   greet() {
107:     console.log(this.greeting);
108:   }
109: }
110: `;
111: 
112: const pyCode = `
113: def greet(name):
114:     print(f"Hello, {name}!")
115:     return f"Hi, {name}"
116: 
117: class Calculator:
118:     def add(self, a, b):
119:         # Adds two numbers
120:         return a + b
121: `;
122: 
123: const compressedJs = compressCode(jsCode, 'javascript');
124: console.log("--- Compressed JS ---\n", compressedJs);
125: 
126: const compressedPy = compressCode(pyCode, 'python');
127: console.log("--- Compressed Python ---", compressedPy);
128: */
````

## File: src/utils/create-variants.ts
````typescript
 1: /**
 2:  * Creates a map of variant classes for a component.
 3:  * Based on the concept of class-variance-authority but simplified.
 4:  */
 5: export function createVariants<T extends string>(
 6:   baseClass: string,
 7:   variantMap: Record<T, string>
 8: ): {
 9:   base: string;
10:   variants: Record<T, string>;
11:   getVariantClass: (variant: T) => string;
12: } {
13:   return {
14:     base: baseClass,
15:     variants: variantMap,
16:     getVariantClass: (variant: T) => variantMap[variant] || ''
17:   };
18: }
````

## File: src/utils/formatters.ts
````typescript
  1: import { FileTreeMode } from '../types/FileTypes';
  2: 
  3: export interface FileContent {
  4:   path: string;
  5:   content: string;
  6:   tokenCount?: number;
  7: }
  8: 
  9: // Helper function to escape XML special characters
 10: function escapeXML(str: string): string {
 11:   return str
 12:     .replace(/&/g, '&amp;')
 13:     .replace(/</g, '&lt;')
 14:     .replace(/>/g, '&gt;')
 15:     .replace(/"/g, '&quot;')
 16:     .replace(/'/g, '&apos;');
 17: }
 18: 
 19: // Helper function to wrap content in CDATA if it contains special characters
 20: function wrapInCDATA(content: string): string {
 21:   if (content.includes(']]>')) {
 22:     // Handle nested CDATA by splitting the string
 23:     return content
 24:       .split(']]>')
 25:       .map(part => `<![CDATA[${part}]]>`)
 26:       .join(']]&gt;');
 27:   }
 28:   return `<![CDATA[${content}]]>`;
 29: }
 30: 
 31: export function formatAsXML(
 32:   files: FileContent[],
 33:   selectedFolder: string | null,
 34:   fileTreeMode: FileTreeMode,
 35:   fileTree: string,
 36:   userInstructions: string
 37: ): string {
 38:   const timestamp = new Date().toISOString();
 39:   let output = '<?xml version="1.0" encoding="UTF-8"?>\n';
 40:   output += '<pastemax-export>\n';
 41:   
 42:   // Add metadata
 43:   output += '  <metadata>\n';
 44:   output += `    <timestamp>${timestamp}</timestamp>\n`;
 45:   output += `    <file_count>${files.length}</file_count>\n`;
 46:   if (selectedFolder) {
 47:     output += `    <base_folder>${escapeXML(selectedFolder)}</base_folder>\n`;
 48:   }
 49:   output += '  </metadata>\n\n';
 50: 
 51:   // Add user instructions if present
 52:   if (userInstructions) {
 53:     output += '  <instructions>\n';
 54:     output += `    ${wrapInCDATA(userInstructions)}\n`;
 55:     output += '  </instructions>\n\n';
 56:   }
 57: 
 58:   // Add file tree if present
 59:   if (fileTree) {
 60:     output += '  <directory_structure>\n';
 61:     output += `    ${wrapInCDATA(fileTree)}\n`;
 62:     output += '  </directory_structure>\n\n';
 63:   }
 64: 
 65:   // Add files
 66:   output += '  <files>\n';
 67:   files.forEach(file => {
 68:     output += `    <file path="${escapeXML(file.path)}"`;
 69:     if (file.tokenCount !== undefined) {
 70:       output += ` token_count="${file.tokenCount}"`;
 71:     }
 72:     output += '>\n';
 73:     output += `      ${wrapInCDATA(file.content)}\n`;
 74:     output += '    </file>\n';
 75:   });
 76:   output += '  </files>\n';
 77:   
 78:   output += '</pastemax-export>';
 79:   return output;
 80: }
 81: 
 82: export function formatAsMarkdown(
 83:   files: FileContent[],
 84:   selectedFolder: string | null,
 85:   fileTreeMode: FileTreeMode,
 86:   fileTree: string,
 87:   userInstructions: string
 88: ): string {
 89:   const timestamp = new Date().toISOString();
 90:   let output = '# PasteMax Export\n\n';
 91: 
 92:   // Add metadata
 93:   output += '## Metadata\n';
 94:   output += `- **Timestamp:** ${timestamp}\n`;
 95:   output += `- **File Count:** ${files.length}\n`;
 96:   if (selectedFolder) {
 97:     output += `- **Base Folder:** \`${selectedFolder}\`\n`;
 98:   }
 99:   output += '\n';
100: 
101:   // Add user instructions if present
102:   if (userInstructions) {
103:     output += '## Instructions\n\n';
104:     output += userInstructions + '\n\n';
105:   }
106: 
107:   // Add file tree if present
108:   if (fileTree) {
109:     output += '## Directory Structure\n\n';
110:     output += '```\n' + fileTree + '\n```\n\n';
111:   }
112: 
113:   // Add files
114:   output += '## Files\n\n';
115:   files.forEach(file => {
116:     const extension = file.path.split('.').pop() || '';
117:     output += `### ${file.path}\n`;
118:     if (file.tokenCount !== undefined) {
119:       output += `Token count: ${file.tokenCount}\n\n`;
120:     }
121:     output += '```' + extension + '\n' + file.content + '\n```\n\n';
122:   });
123: 
124:   return output;
125: }
126: 
127: export function formatAsPlain(
128:   files: FileContent[],
129:   selectedFolder: string | null,
130:   fileTreeMode: FileTreeMode,
131:   fileTree: string,
132:   userInstructions: string
133: ): string {
134:   const timestamp = new Date().toISOString();
135:   const separator = '='.repeat(80) + '\n';
136:   let output = '';
137: 
138:   // Add header
139:   output += separator;
140:   output += 'PASTEMAX EXPORT\n';
141:   output += separator + '\n';
142: 
143:   // Add metadata
144:   output += 'METADATA\n';
145:   output += separator;
146:   output += `Timestamp: ${timestamp}\n`;
147:   output += `File Count: ${files.length}\n`;
148:   if (selectedFolder) {
149:     output += `Base Folder: ${selectedFolder}\n`;
150:   }
151:   output += '\n';
152: 
153:   // Add user instructions if present
154:   if (userInstructions) {
155:     output += separator;
156:     output += 'INSTRUCTIONS\n';
157:     output += separator;
158:     output += userInstructions + '\n\n';
159:   }
160: 
161:   // Add file tree if present
162:   if (fileTree) {
163:     output += separator;
164:     output += 'DIRECTORY STRUCTURE\n';
165:     output += separator;
166:     output += fileTree + '\n\n';
167:   }
168: 
169:   // Add files
170:   output += separator;
171:   output += 'FILES\n';
172:   output += separator;
173:   
174:   files.forEach((file, index) => {
175:     if (index > 0) output += '\n';
176:     output += `File: ${file.path}\n`;
177:     if (file.tokenCount !== undefined) {
178:       output += `Token Count: ${file.tokenCount}\n`;
179:     }
180:     output += separator;
181:     output += file.content + '\n';
182:   });
183: 
184:   return output;
185: }
````

## File: src/utils/modelUtils.ts
````typescript
  1: import { OPENROUTER_MODELS_API_URL } from '../constants/api';
  2: import { ModelInfo } from '../types/ModelTypes';
  3: 
  4: // Constants for localStorage
  5: const MODELS_CACHE_KEY = 'pastemax-cached-models';
  6: const MODELS_CACHE_TIMESTAMP_KEY = 'pastemax-models-cache-timestamp';
  7: const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  8: 
  9: /**
 10:  * Fetches the list of available models from the OpenRouter API.
 11:  * @param {boolean} forceRefresh - Whether to force fetching from API instead of using cache
 12:  * @returns {Promise<ModelInfo[] | null>} A promise that resolves to an array of model objects or null if an error occurs.
 13:  */
 14: export async function fetchModels(forceRefresh = false): Promise<ModelInfo[] | null> {
 15:   // Try to get models from cache first, unless forceRefresh is true
 16:   if (!forceRefresh) {
 17:     const cachedModels = getCachedModels();
 18:     if (cachedModels) {
 19:       console.log(`Using ${cachedModels.length} cached models.`);
 20:       return cachedModels;
 21:     }
 22:   }
 23: 
 24:   console.log(`Fetching models from ${OPENROUTER_MODELS_API_URL}...`);
 25:   try {
 26:     const response = await fetch(OPENROUTER_MODELS_API_URL);
 27:     if (!response.ok) {
 28:       console.error(`Error fetching models: ${response.status} ${response.statusText}`);
 29:       // Consider more specific error handling or returning an empty array
 30:       // depending on how the caller should react to fetch failures.
 31:       return null;
 32:     }
 33:     const data = await response.json();
 34:     // Assuming the API returns an object with a 'data' property containing the array of models
 35:     // Adjust this based on the actual API response structure
 36:     if (data && Array.isArray(data.data)) {
 37:        console.log(`Successfully fetched ${data.data.length} models.`);
 38:       const models = data.data as ModelInfo[];
 39:       
 40:       // Cache the fetched models
 41:       cacheModels(models);
 42:       
 43:       return models;
 44:     } else {
 45:       console.error("Error fetching models: Invalid response format. Expected object with 'data' array.", data);
 46:       return null;
 47:     }
 48:   } catch (error) {
 49:     console.error('Error fetching models:', error);
 50:     return null; // Return null or throw the error based on desired handling
 51:   }
 52: }
 53: 
 54: /**
 55:  * Saves models to localStorage cache with timestamp
 56:  * @param models The models to cache
 57:  */
 58: function cacheModels(models: ModelInfo[]): void {
 59:   try {
 60:     localStorage.setItem(MODELS_CACHE_KEY, JSON.stringify(models));
 61:     localStorage.setItem(MODELS_CACHE_TIMESTAMP_KEY, Date.now().toString());
 62:     console.log(`Cached ${models.length} models.`);
 63:   } catch (error) {
 64:     console.error('Error caching models:', error);
 65:   }
 66: }
 67: 
 68: /**
 69:  * Retrieves cached models if available and not expired
 70:  * @returns The cached models or null if unavailable or expired
 71:  */
 72: export function getCachedModels(): ModelInfo[] | null {
 73:   try {
 74:     const cachedModelsJson = localStorage.getItem(MODELS_CACHE_KEY);
 75:     const timestampStr = localStorage.getItem(MODELS_CACHE_TIMESTAMP_KEY);
 76:     
 77:     if (!cachedModelsJson || !timestampStr) {
 78:       return null;
 79:     }
 80:     
 81:     // Check if cache is expired
 82:     const timestamp = parseInt(timestampStr);
 83:     const now = Date.now();
 84:     if (now - timestamp > CACHE_EXPIRY_TIME) {
 85:       console.log('Models cache expired, will fetch fresh data.');
 86:       return null;
 87:     }
 88:     
 89:     // Calculate age for logging
 90:     const ageHours = Math.round((now - timestamp) / (60 * 60 * 1000) * 10) / 10;
 91:     
 92:     // Parse and return cached models
 93:     const cachedModels = JSON.parse(cachedModelsJson);
 94:     console.log(`Using cached models (${ageHours} hours old).`);
 95:     return Array.isArray(cachedModels) ? cachedModels : null;
 96:   } catch (error) {
 97:     console.error('Error retrieving cached models:', error);
 98:     return null;
 99:   }
100: }
101: 
102: // Example Usage (You would call this from your App component or context):
103: /*
104: import { useEffect, useState } from 'react';
105: import { fetchModels } from './utils/modelUtils';
106: 
107: function App() {
108:   const [models, setModels] = useState<any[] | null>(null);
109: 
110:   useEffect(() => {
111:     const loadModels = async () => {
112:       const fetchedModels = await fetchModels();
113:       setModels(fetchedModels);
114:     };
115:     loadModels();
116:   }, []);
117: 
118:   // ... rest of your component
119: }
120: */
````

## File: src/utils/pathUtils.ts
````typescript
  1: /**
  2:  * Browser-compatible path utilities to replace Node.js path module
  3:  */
  4: 
  5: import { FileTreeMode } from "../types/FileTypes";
  6: import path from 'path'; // Ensure path is imported if needed internally
  7: 
  8: /**
  9:  * Normalizes a file path to use forward slashes regardless of operating system
 10:  * This helps with path comparison across different platforms
 11:  * 
 12:  * @param filePath The file path to normalize
 13:  * @returns The normalized path with forward slashes
 14:  */
 15: export function normalizePath(filePath: string): string {
 16:   if (!filePath) return filePath;
 17:   
 18:   // Replace backslashes with forward slashes
 19:   return filePath.replace(/\\/g, '/');
 20: }
 21: 
 22: /**
 23:  * Detects the operating system
 24:  * 
 25:  * @returns The detected operating system ('windows', 'mac', 'linux', or 'unknown')
 26:  */
 27: /*
 28: export const detectOS = (): 'windows' | 'mac' | 'linux' | 'other' => {
 29:   const platform = typeof process !== 'undefined' ? process.platform : (navigator.platform || '').toLowerCase();
 30:   if (platform.startsWith('win')) return 'windows';
 31:   if (platform.startsWith('darwin') || platform.startsWith('mac')) return 'mac';
 32:   if (platform.startsWith('linux')) return 'linux';
 33:   return 'other';
 34: };
 35: */
 36: 
 37: /**
 38:  * Compares two paths for equality, handling different OS path separators
 39:  * 
 40:  * @param path1 First path to compare
 41:  * @param path2 Second path to compare
 42:  * @returns True if the paths are equivalent, false otherwise
 43:  */
 44: export function arePathsEqual(path1: string, path2: string): boolean {
 45:   return normalizePath(path1) === normalizePath(path2);
 46: }
 47: 
 48: /**
 49:  * Extract the basename from a path string
 50:  * @param path The path to extract the basename from
 51:  * @returns The basename (last part of the path)
 52:  */
 53: /*
 54: const basename = (filePath: string): string => {
 55:   // Basic implementation, consider edge cases
 56:   const parts = normalizePath(filePath).split('/');
 57:   return parts[parts.length - 1] || '';
 58: };
 59: */
 60: 
 61: /**
 62:  * Extract the directory name from a path string
 63:  * @param path The path to extract the directory from
 64:  * @returns The directory (everything except the last part)
 65:  */
 66: /*
 67: export const dirname = (filePath: string): string => {
 68:   const normalized = normalizePath(filePath);
 69:   const lastSlash = normalized.lastIndexOf('/');
 70:   if (lastSlash === -1) return '.'; // Root or no directory
 71:   return normalized.substring(0, lastSlash) || '/'; // Handle root case
 72: };
 73: */
 74: 
 75: /**
 76:  * Join path segments together
 77:  * @param segments The path segments to join
 78:  * @returns The joined path
 79:  */
 80: /*
 81: const join = (...paths: string[]): string => {
 82:   // Basic implementation
 83:   const joined = paths.map(p => normalizePath(p)).join('/');
 84:   // Handle multiple slashes, etc. (more robust logic needed for full path.join mimicry)
 85:   return joined.replace(/\/+/g, '/'); 
 86: };
 87: */
 88: 
 89: /**
 90:  * Get the file extension
 91:  * @param path The path to get the extension from
 92:  * @returns The file extension including the dot
 93:  */
 94: /*
 95: export const extname = (filePath: string): string => {
 96:   const name = basename(filePath);
 97:   const lastDot = name.lastIndexOf('.');
 98:   return lastDot > 0 ? name.substring(lastDot) : ''; // Check > 0 to avoid hidden files
 99: };
100: */
101: 
102: /**
103:  * Generate an ASCII representation of the file tree for the selected files
104:  * @param files Array of selected FileData objects
105:  * @param rootPath The root directory path
106:  * @param mode The FileTreeMode to use for generation
107:  * @returns ASCII string representing the file tree
108:  */
109: export function generateAsciiFileTree(
110:   files: { path: string }[], 
111:   rootPath: string,
112:   mode: FileTreeMode = "selected"
113: ): string {
114:   if (!files.length) return "No files selected.";
115: 
116:   // Normalize the root path for consistent path handling
117:   const normalizedRoot = rootPath.replace(/\\/g, "/").replace(/\/$/, "");
118:   
119:   // Create a tree structure from the file paths
120:   interface TreeNode {
121:     name: string;
122:     isFile: boolean;
123:     children: Record<string, TreeNode>;
124:     // Add a flag to identify if this node contains a selected file
125:     hasSelectedFile?: boolean;
126:   }
127:   
128:   // Extract the root folder name from the path
129:   const rootName = normalizedRoot.split('/').filter(Boolean).pop() || 'root';
130:   
131:   const root: TreeNode = { 
132:     name: rootName, 
133:     isFile: false, 
134:     children: {},
135:     hasSelectedFile: false
136:   };
137:   
138:   // Insert a file path into the tree
139:   const insertPath = (filePath: string, node: TreeNode, isSelected: boolean = true) => {
140:     const normalizedPath = filePath.replace(/\\/g, "/");
141:     if (!normalizedPath.startsWith(normalizedRoot)) return;
142:     
143:     const relativePath = normalizedPath.substring(normalizedRoot.length).replace(/^\//, "");
144:     if (!relativePath) return;
145:     
146:     const pathParts = relativePath.split("/");
147:     let currentNode = node;
148:     
149:     for (let i = 0; i < pathParts.length; i++) {
150:       const part = pathParts[i];
151:       const isFile = i === pathParts.length - 1;
152:       
153:       if (!currentNode.children[part]) {
154:         currentNode.children[part] = {
155:           name: part,
156:           isFile,
157:           children: {},
158:           hasSelectedFile: isSelected && isFile
159:         };
160:       }
161:       
162:       // If this file is selected, mark this node and all parent nodes
163:       if (isSelected && isFile && i === pathParts.length - 1) {
164:         currentNode.children[part].hasSelectedFile = true;
165:       }
166:       
167:       currentNode = currentNode.children[part];
168:     }
169:     
170:     // Mark parent directories as having selected files
171:     if (isSelected) {
172:       let tempNode = node;
173:       for (let i = 0; i < pathParts.length - 1; i++) {
174:         const part = pathParts[i];
175:         if (tempNode.children[part]) {
176:           tempNode.children[part].hasSelectedFile = true;
177:           tempNode = tempNode.children[part];
178:         }
179:       }
180:     }
181:   };
182:   
183:   // Insert files into the tree based on the mode
184:   if (mode === "complete") {
185:     // In complete mode, insert all files, marking the selected ones
186:     files.forEach(file => {
187:       // Determine if this file is among the selected files
188:       // This requires a full list of files, where some might be selected and others not
189:       const isSelected = "selected" in file ? Boolean(file.selected) : true;
190:       insertPath(file.path, root, isSelected);
191:     });
192:   } else {
193:     // In selected mode or selected-with-roots mode, all files we're given are selected
194:     files.forEach(file => insertPath(file.path, root, true));
195:   }
196:   
197:   // Generate ASCII representation
198:   const generateAscii = (node: TreeNode, prefix = "", isLast = true, isRoot = true): string => {
199:     // For selected-with-roots mode, only include nodes that have selected files
200:     if (mode === "selected-with-roots" && !node.hasSelectedFile && !isRoot) {
201:       return "";
202:     }
203:     
204:     if (!isRoot) {
205:       let result = prefix;
206:       result += isLast ? "└── " : "├── ";
207:       result += node.name;
208:       
209:       // In complete mode, mark selected files with a '*'
210:       if (mode === "complete" && node.hasSelectedFile && node.isFile) {
211:         result += " *";
212:       }
213:       
214:       result += "\n";
215:       prefix += isLast ? "    " : "│   ";
216:       
217:       const children = Object.values(node.children).sort((a, b) => {
218:         // Sort by type (directories first) then by name
219:         if (a.isFile !== b.isFile) {
220:           return a.isFile ? 1 : -1;
221:         }
222:         return a.name.localeCompare(b.name);
223:       });
224:       
225:       return result + children
226:         .map((child, index) =>
227:           generateAscii(child, prefix, index === children.length - 1, false)
228:         )
229:         .join("");
230:     } else {
231:       // Root node special handling
232:       const children = Object.values(node.children).sort((a, b) => {
233:         // Sort by type (directories first) then by name
234:         if (a.isFile !== b.isFile) {
235:           return a.isFile ? 1 : -1;
236:         }
237:         return a.name.localeCompare(b.name);
238:       });
239:       
240:       return children
241:         .map((child, index) => {
242:           // For selected-with-roots mode, only include nodes that have selected files
243:           if (mode === "selected-with-roots" && !child.hasSelectedFile) {
244:             return "";
245:           }
246:           return generateAscii(child, prefix, index === children.length - 1, false);
247:         })
248:         .join("");
249:     }
250:   };
251:   
252:   return generateAscii(root);
253: }
````

## File: src/utils/patternUtils.ts
````typescript
  1: // System pattern categories - Moved from App.tsx
  2: export const SYSTEM_PATTERN_CATEGORIES = {
  3:     versionControl: [
  4:       "**/.git/**",
  5:       "**/.svn/**",
  6:       "**/.hg/**",
  7:       "**/.cvs/**" // Added .cvs
  8:     ],
  9:     buildOutput: [
 10:       "**/node_modules/**",
 11:       "**/dist/**",
 12:       "**/build/**",
 13:       "**/.output/**", // Added .output
 14:       "**/.next/**",
 15:     ],
 16:     caches: [
 17:       "**/.cache/**",
 18:       "**/__pycache__/**",
 19:       "**/.pytest_cache/**",
 20:     ],
 21:     logs: [
 22:       "**/logs/**",
 23:       "**/*.log",
 24:     ],
 25:     ide: [
 26:       "**/.idea/**",
 27:       "**/.vscode/**",
 28:       "**/.vs/**",
 29:     ],
 30:     temp: [
 31:       "**/tmp/**",
 32:       "**/temp/**",
 33:     ],
 34:     os: [
 35:       "**/.DS_Store",
 36:       "**/Thumbs.db",
 37:     ],
 38:   };
 39:   
 40:   /**
 41:    * Interface for ignore patterns state
 42:    */
 43:   export interface IgnorePatternsState {
 44:     patterns: string;
 45:     excludedSystemPatterns: string[];
 46:   }
 47:   
 48:   /**
 49:    * Parse ignore patterns content to extract disabled patterns and user patterns
 50:    */
 51:   export const parseIgnorePatternsContent = (content: string): { excludedPatterns: string[]; userPatterns: string } => {
 52:     if (!content) {
 53:       return { excludedPatterns: [], userPatterns: '' };
 54:     }
 55:     const lines = content.split('\n');
 56:     const excludedPatterns: string[] = [];
 57:     const userPatterns: string[] = [];
 58:   
 59:     let inUserSection = false;
 60:   
 61:     lines.forEach(line => {
 62:       const trimmedLine = line.trim();
 63:       
 64:       // Check for section headers
 65:       if (trimmedLine === '# USER PATTERNS:') {
 66:         inUserSection = true;
 67:         return;
 68:       }
 69:       
 70:       if (trimmedLine.startsWith('# DISABLED:')) {
 71:         // Extract pattern removing the DISABLED marker
 72:         const pattern = trimmedLine.substring('# DISABLED:'.length).trim();
 73:         if (pattern) {
 74:           excludedPatterns.push(pattern);
 75:         }
 76:       } else if (inUserSection && trimmedLine !== '' && !trimmedLine.startsWith('#')) {
 77:         // In user section, add non-comment lines to user patterns
 78:         userPatterns.push(line); // Keep original line to preserve indentation/whitespace
 79:       } else if (!inUserSection && !trimmedLine.startsWith('#') && trimmedLine !== '') {
 80:         // Not in user section yet, but found a pattern - also add to user patterns
 81:         // This handles the case where user patterns aren't properly marked with a section
 82:         userPatterns.push(line);
 83:       }
 84:       // Ignore empty lines and regular comments
 85:     });
 86:   
 87:     // Ensure excluded patterns are unique
 88:     const uniqueExcluded = Array.from(new Set(excludedPatterns));
 89:   
 90:     return {
 91:       excludedPatterns: uniqueExcluded,
 92:       userPatterns: userPatterns.join('\n')
 93:     };
 94:   };
 95:   
 96:   // --- Keep existing functions below if they are used ---
 97:   
 98:   // Pattern state update function (Example, confirm if used or remove)
 99:   /*
100:   export const handlePatternStateUpdate = (patterns: string | string[]): string => {
101:     return Array.isArray(patterns) ? patterns.join('\n') : patterns;
102:   };
103:   */
104:   
105:   /**
106:    * Format global patterns for saving
107:    */
108:   /*
109:   export const formatPatternsForSaving = (
110:     state: IgnorePatternsState,
111:     systemPatterns: string[] = []
112:   ): string => {
113:     // Combine user patterns and non-excluded system patterns
114:     const userLines = state.patterns.split('\n').map(p => p.trim()).filter(p => p !== '');
115:     const activeSystemPatterns = systemPatterns.filter(p => !state.excludedSystemPatterns.includes(p));
116:     
117:     // Structure with comments might be helpful, but for now just combine
118:     // A simple approach: just save the user patterns string
119:     // If more complex logic is needed (like preserving comments or sections), adjust here
120:     return state.patterns; 
121:     // Alternative: Combine user and active system if needed for storage format
122:     // return [...userLines, ...activeSystemPatterns].join('\n');
123:   };
124:   */
125:   
126:   // Keep other potentially used exports like saveIgnoreStateToStorage if needed
````

## File: src/utils/sortIcons.tsx
````typescript
 1: import React from 'react';
 2: import type { LucideIcon } from 'lucide-react';
 3: import { 
 4:   ArrowUpDown,        // Default icon
 5:   ArrowDownAZ,        // For name-ascending
 6:   ArrowUpZA,          // For name-descending
 7:   ArrowUp01,          // For tokens-ascending
 8:   ArrowDown10,        // For tokens-descending
 9:   ArrowUpNarrowWide,  // For date-ascending
10:   ArrowDownWideNarrow // For date-descending
11: } from "lucide-react";
12: 
13: // Map sort options to corresponding Lucide icons
14: export const sortIconMap = {
15:   "name-ascending": "ArrowDownAZ",
16:   "name-descending": "ArrowUpZA",
17:   "tokens-ascending": "ArrowUp01",
18:   "tokens-descending": "ArrowDown10",
19:   "date-ascending": "ArrowUpNarrowWide",
20:   "date-descending": "ArrowDownWideNarrow"
21: } as const;
22: 
23: // Icon component lookup for direct reference
24: export const iconComponents: Record<string, LucideIcon> = {
25:   "ArrowDownAZ": ArrowDownAZ,
26:   "ArrowUpZA": ArrowUpZA,
27:   "ArrowUp01": ArrowUp01,
28:   "ArrowDown10": ArrowDown10,
29:   "ArrowUpNarrowWide": ArrowUpNarrowWide,
30:   "ArrowDownWideNarrow": ArrowDownWideNarrow,
31:   "ArrowUpDown": ArrowUpDown  // Default
32: };
33: 
34: // Helper function to get the appropriate icon component
35: export const getSortIcon = (sortOrder?: string, size: number = 16): JSX.Element => {
36:   try {
37:     const iconName = sortOrder && sortIconMap[sortOrder as keyof typeof sortIconMap] 
38:       ? sortIconMap[sortOrder as keyof typeof sortIconMap] 
39:       : "ArrowUpDown";
40:     
41:     const IconComponent = iconComponents[iconName];
42:     return <IconComponent size={size} />;
43:   } catch (error) {
44:     console.error("Error rendering sort icon:", error);
45:     return <ArrowUpDown size={size} />;
46:   }
47: };
````

## File: src/App.module.css
````css
  1: .app {
  2:   display: flex;
  3:   flex-direction: column;
  4:   height: 100vh;
  5:   background: var(--bg-primary);
  6:   color: var(--text-primary);
  7: }
  8: 
  9: .header {
 10:   display: flex;
 11:   align-items: center;
 12:   justify-content: space-between;
 13:   padding: 0.5rem;
 14:   background: var(--bg-secondary);
 15:   border-bottom: 1px solid var(--border-color);
 16: }
 17: 
 18: .headerLeft,
 19: .headerRight {
 20:   display: flex;
 21:   align-items: center;
 22:   gap: 0.25rem;
 23: }
 24: 
 25: .headerBtn {
 26:   color: var(--text-primary);
 27: }
 28: 
 29: .headerBtn:hover {
 30:   background: var(--bg-hover);
 31: }
 32: 
 33: .dropdownContainer {
 34:   position: relative;
 35:   display: inline-flex;
 36:   align-items: center;
 37:   height: 32px;
 38: }
 39: 
 40: .appContainer {
 41:   display: flex;
 42:   flex-direction: column;
 43:   height: 100vh;
 44:   width: 100%;
 45:   overflow: hidden;
 46: }
 47: 
 48: .mainContainer {
 49:   display: flex;
 50:   flex: 1;
 51:   overflow: hidden;
 52:   position: relative;
 53: }
 54: 
 55: .contentArea {
 56:   flex-grow: 1;
 57:   padding: 0;
 58:   overflow-y: auto;
 59:   display: flex;
 60:   flex-direction: column;
 61:   height: 100%;
 62:   background: var(--background);
 63:   border-left: 1px solid var(--border);
 64:   background-color: var(--background-primary);
 65:   backdrop-filter: var(--backdrop-blur-sm);
 66:   -webkit-backdrop-filter: var(--backdrop-blur-sm);
 67: }
 68: 
 69: .contentHeader {
 70:   display: flex;
 71:   align-items: center;
 72:   padding: 0.5rem 1rem;
 73:   border-bottom: 1px solid var(--border-color);
 74:   background: var(--background-primary);
 75:   height: 46px;
 76:   position: sticky;
 77:   top: 0;
 78:   z-index: 10;
 79:   gap: 12px;
 80:   backdrop-filter: var(--backdrop-blur-sm);
 81:   -webkit-backdrop-filter: var(--backdrop-blur-sm);
 82: }
 83: 
 84: .contentTitle {
 85:   display: none;
 86: }
 87: 
 88: .contentActions {
 89:   display: flex;
 90:   gap: 0.75rem;
 91:   align-items: center;
 92:   height: 32px;
 93:   margin-left: 0;
 94: }
 95: 
 96: .folderPathDisplay {
 97:   font-size: 0.875rem;
 98:   color: var(--text-secondary);
 99:   padding: 0 0.75rem;
100:   height: 32px;
101:   display: inline-flex;
102:   align-items: center;
103:   overflow: hidden;
104:   text-overflow: ellipsis;
105:   white-space: nowrap;
106:   flex: 1;
107:   min-width: 0;
108:   font-family: var(--font-mono, monospace);
109: }
110: 
111: .pathLabel {
112:   color: var(--text-primary);
113:   margin-right: 0.5rem;
114:   font-weight: 500;
115:   font-family: var(--font-sans, Courier);
116: }
117: 
118: .fileStats {
119:   font-size: 0.875rem;
120:   color: var(--text-secondary);
121:   padding: 0 0.75rem;
122:   height: 32px;
123:   display: flex;
124:   align-items: center;
125:   white-space: nowrap;
126:   flex-shrink: 0;
127: }
128: 
129: .fileStats span {
130:   color: var(--text-primary);
131:   font-weight: 500;
132:   margin: 0 0.15rem;
133: }
134: 
135: .appHeader {
136:   display: flex;
137:   justify-content: space-between;
138:   align-items: center;
139:   padding: 0.5rem 1rem;
140:   background-color: var(--background-secondary);
141:   border-bottom: 1px solid var(--border-color);
142:   backdrop-filter: var(--backdrop-blur-md);
143:   -webkit-backdrop-filter: var(--backdrop-blur-md);
144:   z-index: 10;
145: }
146: 
147: .headerActions {
148:   display: flex;
149:   align-items: center;
150:   gap: 0.5rem;
151: }
152: 
153: .headerLink {
154:   color: var(--text-primary);
155:   text-decoration: none;
156:   transition: color 0.2s;
157: }
158: 
159: .headerLink:hover {
160:   color: var(--accent-color);
161: }
162: 
163: .headerSeparator {
164:   width: 1px;
165:   height: 24px;
166:   background-color: var(--border-color);
167:   margin: 0 0.75rem;
168:   opacity: 0.6;
169: }
170: 
171: .githubButton {
172:   display: flex;
173:   align-items: center;
174:   gap: 0.5rem;
175:   padding: 0.5rem;
176:   border-radius: var(--radius);
177:   text-decoration: none;
178:   color: var(--accent-color);
179:   transition: color 0.2s;
180: }
181: 
182: .githubButton:hover {
183:   color: var(--text-primary);
184: }
185: 
186: .treeEmpty {
187:   display: flex;
188:   flex-direction: column;
189:   align-items: center;
190:   justify-content: center;
191:   padding: 2rem;
192:   text-align: center;
193:   color: var(--text-secondary);
194: }
195: 
196: .treeLoading {
197:   display: flex;
198:   flex-direction: column;
199:   align-items: center;
200:   justify-content: center;
201:   padding: 2rem;
202:   text-align: center;
203:   color: var(--text-secondary);
204: }
205: 
206: .spinner {
207:   border: 3px solid rgba(0, 0, 0, 0.1);
208:   border-top: 3px solid var(--accent-color);
209:   border-radius: 50%;
210:   width: 20px;
211:   height: 20px;
212:   animation: spin 1s linear infinite;
213:   margin-bottom: 1rem;
214: }
215: 
216: .processingIndicator {
217:   display: flex;
218:   align-items: center;
219:   justify-content: center;
220:   gap: 0.5rem;
221:   padding: 0.5rem;
222:   background-color: var(--background-secondary);
223:   color: var(--text-secondary);
224:   font-size: 0.9rem;
225: }
226: 
227: .errorMessage {
228:   padding: 0.5rem 1rem;
229:   background-color: var(--error-color);
230:   color: white;
231:   font-size: 0.9rem;
232: }
233: 
234: .userInstructionsContainer {
235:   margin-top: 1rem;
236:   animation: instructionsSlideDown 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
237:   transform-origin: top;
238:   overflow: hidden;
239: }
240: 
241: .emptyStateContent {
242:   display: flex;
243:   flex-direction: column;
244:   align-items: center;
245:   justify-content: center;
246:   padding: 2rem;
247:   text-align: center;
248: }
249: 
250: .emptyStateContent h2 {
251:   margin-bottom: 1rem;
252: }
253: 
254: .emptyStateContent ul {
255:   text-align: left;
256:   margin-top: 1rem;
257: }
258: 
259: @keyframes spin {
260:   0% { transform: rotate(0deg); }
261:   100% { transform: rotate(360deg); }
262: }
263: 
264: @keyframes dropdownFadeIn {
265:   from {
266:     opacity: 0;
267:     transform: translateY(-8px);
268:   }
269:   to {
270:     opacity: 1;
271:     transform: translateY(0);
272:   }
273: }
274: 
275: @keyframes tooltipFadeIn {
276:   from {
277:     opacity: 0;
278:     transform: translateY(-4px);
279:   }
280:   to {
281:     opacity: 1;
282:     transform: translateY(0);
283:   }
284: }
285: 
286: @keyframes instructionsSlideDown {
287:   from {
288:     opacity: 0;
289:     max-height: 0;
290:     transform: translateY(-10px);
291:   }
292:   to {
293:     opacity: 1;
294:     max-height: 1000px;
295:     transform: translateY(0);
296:   }
297: }
````

## File: src/declarations.d.ts
````typescript
 1: // Type declarations for external modules
 2: declare module "react";
 3: declare module "react-dom/client";
 4: declare module "react/jsx-runtime";
 5: declare module "electron";
 6: declare module "tiktoken";
 7: declare module "ignore";
 8: declare module "gpt-3-encoder";
 9: 
10: // Allow importing CSS files
11: declare module "*.css" {
12:   const content: { [className: string]: string };
13:   export default content;
14: }
15: 
16: // Allow importing various file types
17: declare module "*.svg" {
18:   const content: string;
19:   export default content;
20: }
21: 
22: declare module "*.png" {
23:   const content: string;
24:   export default content;
25: }
26: 
27: declare module "*.jpg" {
28:   const content: string;
29:   export default content;
30: }
31: 
32: // Add CSS module declarations
33: declare module '*.module.css' {
34:   const classes: { [key: string]: string };
35:   export default classes;
36: }
37: 
38: // React / TypeScript setup fixes
39: import 'react';
40: 
41: declare module 'react' {
42:   export type FC<P = Record<string, never>> = React.FunctionComponent<P>;
43:   
44:   export interface FunctionComponent<P = Record<string, never>> {
45:     (props: P, context?: any): React.ReactElement<any, any> | null;
46:     displayName?: string;
47:   }
48:   
49:   export type MouseEvent<T = Element> = React.MouseEvent<T>;
50:   export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
51:   export type ReactElement = React.ReactElement;
52: }
````

## File: src/main.tsx
````typescript
 1: import React from "react";
 2: import ReactDOM from "react-dom/client";
 3: import App from "./App";
 4: import "./styles/index.css";
 5: 
 6: ReactDOM.createRoot(document.getElementById("root")!).render(
 7:   <React.StrictMode>
 8:     <App />
 9:   </React.StrictMode>,
10: );
````

## File: src/react-app-env.d.ts
````typescript
 1: /// <reference types="react" />
 2: /// <reference types="react-dom" />
 3: /// <reference types="react-scripts" />
 4: 
 5: // Add missing TypeScript definitions
 6: declare namespace React {
 7:   interface MouseEvent<T extends Element> extends globalThis.MouseEvent {
 8:     currentTarget: T;
 9:   }
10:   interface ChangeEvent<T extends Element> extends Event {
11:     target: T;
12:   }
13: }
14: 
15: // Fix the type parameters that are unused
16: interface ImportMeta {
17:    
18:   readonly hot: {
19:     readonly data: any;
20:     accept(): void;
21:     accept(cb: (dependencies: any) => void): void;
22:     accept(path: string, cb: (dependencies: any) => void): void;
23:   };
24: }
25: 
26: declare module '*.module.css' {
27:   const classes: Record<string, string>;
28:   export default classes;
29: }
30: 
31: declare module '*.svg' {
32:   const content: string;
33:   export default content;
34: }
35: 
36: declare module '*.png' {
37:   const content: string;
38:   export default content;
39: }
40: 
41: declare module '*.jpg' {
42:   const content: string;
43:   export default content;
44: }
45: 
46: declare module '*.jpeg' {
47:   const content: string;
48:   export default content;
49: }
50: 
51: declare module '*.gif' {
52:   const content: string;
53:   export default content;
54: }
55: 
56: declare module '*.webp' {
57:   const content: string;
58:   export default content;
59: }
60: 
61: declare module '*.ico' {
62:   const content: string;
63:   export default content;
64: }
65: 
66: declare module '*.bmp' {
67:   const content: string;
68:   export default content;
69: }
````

## File: src/App.tsx
````typescript
   1: import React, { useState, useEffect, useCallback, useMemo } from "react";
   2: import Sidebar from "./components/Sidebar";
   3: import FileList from "./components/FileList";
   4: import ControlContainer from "./components/ControlContainer";
   5: import { FileData, FileTreeMode, SortOrder } from "./types/FileTypes";
   6: import { ThemeProvider } from "./context/ThemeContext";
   7: import ThemeToggle from "./components/ThemeToggle";
   8: import { generateAsciiFileTree, normalizePath, arePathsEqual } from "./utils/pathUtils";
   9: import { Github } from "lucide-react";
  10: import styles from "./App.module.css";
  11: import { Dropdown } from "./components/ui";
  12: import { ConfirmationDialog } from "./components/ui/ConfirmationDialog";
  13: import { Button } from "./components/ui/Button";
  14: import { getSortIcon } from "./utils/sortIcons";
  15: // Import utilities from patternUtils
  16: import { SYSTEM_PATTERN_CATEGORIES, parseIgnorePatternsContent, IgnorePatternsState } from "./utils/patternUtils";
  17: // Import the StatusAlert component
  18: import { StatusAlert } from "./components/ui/StatusAlert";
  19: import { OutputFormatType, OUTPUT_FORMAT_STORAGE_KEY } from './constants/outputFormats';
  20: import { formatAsXML, formatAsMarkdown, formatAsPlain, FileContent } from './utils/formatters';
  21: import { UserInstructionsWithTemplates } from './components/UserInstructionsWithTemplates';
  22: // Import model fetching utility
  23: import { fetchModels } from './utils/modelUtils';
  24: import { ModelInfo } from "./types/ModelTypes"; // Import the new ModelInfo type
  25: import { compressCode, removeComments, getLanguageFromFilename } from './utils/compressionUtils'; // Import compression utils and getLanguageFromFilename
  26: 
  27: // Keys for localStorage
  28: const STORAGE_KEYS = {
  29:   SELECTED_FOLDER: "pastemax-selected-folder",
  30:   SELECTED_FILES: "pastemax-selected-files",
  31:   SORT_ORDER: "pastemax-sort-order",
  32:   SEARCH_TERM: "pastemax-search-term",
  33:   EXPANDED_NODES: "pastemax-expanded-nodes",
  34:   GLOBAL_IGNORE_PATTERNS: "pastemax-global-ignore-patterns-v2", // Added version suffix
  35:   SELECTED_MODEL_ID: "pastemax-selected-model-id", // New key
  36: };
  37: 
  38: // Default system patterns as fallback if not provided by main process
  39: const DEFAULT_SYSTEM_PATTERNS = [
  40:   // Combine categories into one list for default state
  41:   ...SYSTEM_PATTERN_CATEGORIES.versionControl,
  42:   ...SYSTEM_PATTERN_CATEGORIES.buildOutput,
  43:   ...SYSTEM_PATTERN_CATEGORIES.caches,
  44:   ...SYSTEM_PATTERN_CATEGORIES.logs,
  45:   ...SYSTEM_PATTERN_CATEGORIES.ide,
  46:   ...SYSTEM_PATTERN_CATEGORIES.temp,
  47:   ...SYSTEM_PATTERN_CATEGORIES.os,
  48:   // Other common defaults
  49:   "**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.ico",
  50:   "**/*.webp", "**/*.svg", "**/*.pdf", "**/*.zip", "**/*.tar.gz",
  51:   "**/*.tgz", "**/*.rar", "**/*.7z", "**/*.mp4", "**/*.mov",
  52:   "**/*.avi", "**/*.mkv", "**/*.mp3", "**/*.wav", "**/*.flac",
  53:   "**/*.sqlite", "**/*.db", "**/*.sql",
  54:   "**/*.doc", "**/*.docx", "**/*.xls", "**/*.xlsx", "**/*.ppt", "**/*.pptx",
  55:   "**/*.iso", "**/*.bin", "**/*.exe", "**/*.dll", "**/*.so", "**/*.dylib",
  56:   "**/*.min.js", "**/*.min.css",
  57: ];
  58: 
  59: // Mock type definition for ignore package
  60: interface IgnoreInstance {
  61:   ignores: (path: string) => boolean;
  62: }
  63: 
  64: interface IgnoreFactory {
  65:   add: (patterns: string[] | string) => IgnoreInstance;
  66: }
  67: 
  68: // This is just a simple interface to satisfy TypeScript without importing the actual package
  69: // The real implementation will be used at runtime
  70: function ignore(): IgnoreFactory {
  71:   return {
  72:     add: () => ({
  73:       ignores: () => false
  74:     })
  75:   };
  76: }
  77: 
  78: const App = () => {
  79:   // Load initial state from localStorage if available
  80:   const savedFolder = localStorage.getItem(STORAGE_KEYS.SELECTED_FOLDER);
  81:   const savedFiles = localStorage.getItem(STORAGE_KEYS.SELECTED_FILES);
  82:   const savedExpandedNodes = localStorage.getItem(STORAGE_KEYS.EXPANDED_NODES);
  83:   const savedShowInstructions = localStorage.getItem('pastemax-show-instructions');
  84:   const savedModelId = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL_ID);
  85: 
  86:   // State for user interface controls
  87:   const [showUserInstructions, setShowUserInstructions] = useState(
  88:     savedShowInstructions === null ? false : savedShowInstructions !== 'false'
  89:   );
  90:   const [fileTreeMode, setFileTreeMode] = useState<FileTreeMode>('complete');
  91: 
  92:   // State for model information
  93:   const [availableModels, setAvailableModels] = useState<ModelInfo[] | null>(null);
  94:   const [selectedModelId, setSelectedModelId] = useState<string | null>(savedModelId);
  95:   const [selectedContextLength, setSelectedContextLength] = useState<number | null>(null);
  96:   const [isCompressionEnabled, setIsCompressionEnabled] = useState<boolean>(false);
  97: 
  98:   // Initialize expanded nodes from localStorage if available
  99:   const initialExpandedNodes = useMemo(() => {
 100:     const map = new Map<string, boolean>();
 101:     if (savedExpandedNodes) {
 102:       try {
 103:         const parsedNodes = JSON.parse(savedExpandedNodes);
 104:         if (Array.isArray(parsedNodes)) {
 105:           parsedNodes.forEach(([key, value]) => {
 106:             if (typeof key === 'string' && typeof value === 'boolean') {
 107:               map.set(key, value);
 108:             }
 109:           });
 110:         }
 111:       } catch (error) {
 112:         console.error("Error parsing saved expanded nodes:", error);
 113:       }
 114:     }
 115:     return map;
 116:   }, [savedExpandedNodes]);
 117: 
 118:   const [selectedFolder, setSelectedFolder] = useState<string | null>(savedFolder);
 119:   const [allFiles, setAllFiles] = useState<Omit<FileData, 'content'>[]>([]);
 120:   const [selectedFiles, setSelectedFiles] = useState<string[]>(
 121:     savedFiles ? JSON.parse(savedFiles) : []
 122:   );
 123:   const [sortOrder, setSortOrder] = useState<SortOrder>("name-ascending");
 124:   const [searchTerm, setSearchTerm] = useState("");
 125:   const [expandedNodes, setExpandedNodes] = useState<Map<string, boolean>>(initialExpandedNodes);
 126:   const [displayedFiles, setDisplayedFiles] = useState<Omit<FileData, 'content'>[]>([]);
 127:   const [processingStatus, setProcessingStatus] = useState({
 128:     status: "idle",
 129:     message: "",
 130:   } as {
 131:     status: "idle" | "processing" | "complete" | "error";
 132:     message: string;
 133:   });
 134: 
 135:   const [userInstructions, setUserInstructions] = useState("");
 136:   const [fileTreeSortOrder, setFileTreeSortOrder] = useState<SortOrder>("name-ascending");
 137: 
 138:   // Centralized state for ignore patterns
 139:   const [globalPatternsState, setGlobalPatternsState] = useState<IgnorePatternsState>({
 140:     patterns: '',
 141:     excludedSystemPatterns: []
 142:   });
 143:   const [localIgnorePatterns, setLocalPatterns] = useState<IgnorePatternsState>({ patterns: '', excludedSystemPatterns: [] }); // Local doesn't have excluded system patterns
 144:   const [systemIgnorePatterns, setSystemIgnorePatterns] = useState<string[]>(DEFAULT_SYSTEM_PATTERNS);
 145: 
 146:   const [outputFormat, setOutputFormat] = useState<OutputFormatType>(() => {
 147:     const saved = localStorage.getItem(OUTPUT_FORMAT_STORAGE_KEY);
 148:     return (saved as OutputFormatType) || 'xml';
 149:   });
 150: 
 151:   const isElectron = window.electron !== undefined;
 152: 
 153:   // Add state for displayed token count after processing
 154:   const [displayedTokenCount, setDisplayedTokenCount] = useState<number>(0);
 155:   const [isCommentRemovalEnabled, setIsCommentRemovalEnabled] = useState<boolean>(false); // Add state for comment removal
 156:   
 157:   // New state variables for enhanced compression controls
 158:   const [keepDocstrings, setKeepDocstrings] = useState<boolean>(true); // Default: true
 159:   const [removeEmptyLines, setRemoveEmptyLines] = useState<boolean>(false); // Default: false
 160:   const [neverCompressPatternsRaw, setNeverCompressPatternsRaw] = useState<string>(''); // Raw string input
 161:   const [neverCompressPatterns, setNeverCompressPatterns] = useState<string[]>([]); // Parsed array
 162:   const [minCompressTokenThreshold, setMinCompressTokenThreshold] = useState<number>(100); // Default: 100
 163: 
 164:   // Parse raw patterns into array when the raw string changes
 165:   useEffect(() => {
 166:     const patterns = neverCompressPatternsRaw.split('\n').map(p => p.trim()).filter(p => p !== '');
 167:     setNeverCompressPatterns(patterns);
 168:   }, [neverCompressPatternsRaw]);
 169: 
 170:   // Add state for model loading
 171:   const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);
 172:   const [initialModelLoadComplete, setInitialModelLoadComplete] = useState<boolean>(false);
 173: 
 174:   // --- Fetch Models Effect ---
 175:   useEffect(() => {
 176:     // Skip if already completed initial load
 177:     if (initialModelLoadComplete) return;
 178:     
 179:     const loadModels = async () => {
 180:       console.log("Attempting to fetch models...");
 181:       setIsLoadingModels(true);
 182:       
 183:       try {
 184:         const fetchedModels = await fetchModels();
 185:         const modelsToUse = (fetchedModels as ModelInfo[] | null) || []; // Ensure we have an array
 186:         
 187:         // Create fallback models if fetchedModels is empty
 188:         const fallbackModels = [
 189:           { id: "openai/gpt-4o", name: "GPT-4o (Fallback)", context_length: 128000 },
 190:           { id: "anthropic/claude-3-5-sonnet-20240620", name: "Claude 3.5 Sonnet (Fallback)", context_length: 200000 }
 191:         ];
 192:         
 193:         // If no models fetched, use fallback models
 194:         const finalModels = modelsToUse.length > 0 ? modelsToUse : fallbackModels;
 195:         setAvailableModels(finalModels);
 196: 
 197:         const savedModelId = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL_ID);
 198:         
 199:         // Determine initial model
 200:         if (finalModels.length > 0) {
 201:           const validModelIds = finalModels.map(m => m.id);
 202:           let initialModelId: string | null = null;
 203:           
 204:           if (savedModelId && validModelIds.includes(savedModelId)) {
 205:             initialModelId = savedModelId; // Keep saved ID if valid
 206:           } else {
 207:             initialModelId = finalModels[0].id; // Default to first model
 208:           }
 209:           
 210:           // Set the selected model ID
 211:           setSelectedModelId(initialModelId);
 212:           console.log(`Initial model ID set to: ${initialModelId}`);
 213:           
 214:           // Find the model and set context length
 215:           const initialModel = finalModels.find(m => m.id === initialModelId);
 216:           if (initialModel) {
 217:             setSelectedContextLength(initialModel.context_length);
 218:             console.log(`Initial context length set to: ${initialModel.context_length}`);
 219:           } else {
 220:             console.error("Could not find selected model to set context length.");
 221:             // Use a reasonable default
 222:             setSelectedContextLength(128000);
 223:           }
 224:         }
 225:       } catch (error) {
 226:         console.error("Error loading models:", error);
 227:       } finally {
 228:         setIsLoadingModels(false);
 229:         setInitialModelLoadComplete(true);
 230:       }
 231:     };
 232: 
 233:     if (isElectron) {
 234:       loadModels();
 235:     } else {
 236:       // Handle non-electron case
 237:       const fallbackModels = [
 238:         { id: "openai/gpt-4o", name: "GPT-4o (Fallback)", context_length: 128000 },
 239:         { id: "anthropic/claude-3-5-sonnet-20240620", name: "Claude 3.5 Sonnet (Fallback)", context_length: 200000 }
 240:       ];
 241:       setAvailableModels(fallbackModels);
 242:       
 243:       const savedModelId = localStorage.getItem(STORAGE_KEYS.SELECTED_MODEL_ID);
 244:       
 245:       // Use saved model ID or default to first
 246:       const initialModelId = savedModelId && fallbackModels.some(m => m.id === savedModelId) 
 247:         ? savedModelId 
 248:         : fallbackModels[0].id;
 249:       
 250:       setSelectedModelId(initialModelId);
 251:       
 252:       // Set context length from the selected model
 253:       const initialModel = fallbackModels.find(m => m.id === initialModelId);
 254:       setSelectedContextLength(initialModel?.context_length || 128000);
 255:       console.log(`Initial model ID (non-electron): ${initialModelId}, Context: ${initialModel?.context_length ?? 'null'}`);
 256:       
 257:       // Mark as complete for non-electron case too
 258:       setInitialModelLoadComplete(true);
 259:     }
 260:   // Only depend on isElectron since we want this to run just once at startup
 261:   }, [isElectron, initialModelLoadComplete]);
 262: 
 263:   // Note on model persistence strategy:
 264:   // 1. Models are loaded at startup from API or fallbacks
 265:   // 2. Initial model selection reads from localStorage and is validated against available models
 266:   // 3. Persistence happens directly in the handleModelChange function, not via a separate effect
 267:   // This approach prevents feedback loops between state updates and localStorage
 268: 
 269:   // Define applyFiltersAndSort early to avoid reference issues
 270:   const applyFiltersAndSort = useCallback((files: Omit<FileData, 'content'>[], sort: SortOrder, filter: string) => {
 271:     let filtered = files;
 272:     if (filter) {
 273:       const lowerFilter = filter.toLowerCase();
 274:       filtered = files.filter(file =>
 275:         file.name.toLowerCase().includes(lowerFilter) ||
 276:         file.path.toLowerCase().includes(lowerFilter)
 277:       );
 278:     }
 279: 
 280:     const [sortKey, sortDir] = sort.split("-");
 281: 
 282:     const sorted = [...filtered].sort((a, b) => {
 283:       let comparison = 0;
 284:       // Moved declarations outside switch
 285:       const aTokens = typeof a.tokenCount === 'number' ? a.tokenCount : 0;
 286:       const bTokens = typeof b.tokenCount === 'number' ? b.tokenCount : 0;
 287:       const aDate = a.lastModified || 0;
 288:       const bDate = b.lastModified || 0;
 289: 
 290:       switch (sortKey) {
 291:         case "name":
 292:           comparison = a.name.localeCompare(b.name);
 293:           break;
 294:         case "tokens":
 295:           comparison = aTokens - bTokens;
 296:           break;
 297:         case "date":
 298:           comparison = Number(aDate) - Number(bDate);
 299:           break;
 300:         default:
 301:           comparison = a.name.localeCompare(b.name);
 302:       }
 303:       return sortDir === "ascending" ? comparison : -comparison;
 304:     });
 305: 
 306:     setDisplayedFiles(sorted);
 307:   }, []);
 308:   
 309:   // Re-run applyFiltersAndSort when relevant state changes
 310:   useEffect(() => {
 311:     applyFiltersAndSort(allFiles, sortOrder, searchTerm);
 312:   }, [allFiles, sortOrder, searchTerm, applyFiltersAndSort]); 
 313: 
 314:   // --- Persist State Effects ---
 315:   useEffect(() => {
 316:     if (selectedFolder) localStorage.setItem(STORAGE_KEYS.SELECTED_FOLDER, selectedFolder);
 317:     else localStorage.removeItem(STORAGE_KEYS.SELECTED_FOLDER);
 318:   }, [selectedFolder]);
 319: 
 320:   useEffect(() => {
 321:     localStorage.setItem(STORAGE_KEYS.SELECTED_FILES, JSON.stringify(selectedFiles));
 322:   }, [selectedFiles]);
 323: 
 324:   useEffect(() => {
 325:     localStorage.setItem(STORAGE_KEYS.SORT_ORDER, sortOrder);
 326:   }, [sortOrder]);
 327: 
 328:   useEffect(() => {
 329:     localStorage.setItem(STORAGE_KEYS.SEARCH_TERM, searchTerm);
 330:   }, [searchTerm]);
 331: 
 332:   useEffect(() => {
 333:     try {
 334:       localStorage.setItem(STORAGE_KEYS.EXPANDED_NODES, JSON.stringify(Array.from(expandedNodes.entries())));
 335:     } catch (error) {
 336:       console.error("Error saving expanded nodes:", error);
 337:     }
 338:   }, [expandedNodes]);
 339: 
 340:   useEffect(() => {
 341:     localStorage.setItem('pastemax-show-instructions', String(showUserInstructions));
 342:   }, [showUserInstructions]);
 343: 
 344:   // Persist global ignore patterns state
 345:   useEffect(() => {
 346:     localStorage.setItem(STORAGE_KEYS.GLOBAL_IGNORE_PATTERNS, JSON.stringify(globalPatternsState));
 347:   }, [globalPatternsState]);
 348: 
 349:   useEffect(() => {
 350:     localStorage.setItem(OUTPUT_FORMAT_STORAGE_KEY, outputFormat);
 351:   }, [outputFormat]);
 352: 
 353:   // --- IPC Listeners ---
 354: 
 355:   // Load initial data from saved folder
 356:   useEffect(() => {
 357:     if (!isElectron || !selectedFolder) return;
 358:     
 359:     console.log("Loading saved folder on startup:", selectedFolder);
 360:     setProcessingStatus({ status: "processing", message: "Loading files..." });
 361:     
 362:     // Add debug logging to trace the request
 363:     console.log("Requesting file list with send method");
 364:     
 365:     // Either use the dedicated method or the generic send
 366:     if (window.electron.requestFileList) {
 367:       window.electron.requestFileList({ path: selectedFolder });
 368:     } else {
 369:       window.electron.send("request-file-list", selectedFolder);
 370:     }
 371:     
 372:   }, [isElectron, selectedFolder]);
 373: 
 374:   // Listen for folder selection and file list data
 375:   useEffect(() => {
 376:     if (!isElectron) return;
 377: 
 378:     const handleFolderSelected = (folderPath: string) => {
 379:       if (typeof folderPath === "string") {
 380:         console.log("Folder selected:", folderPath);
 381:         setSelectedFolder(folderPath);
 382:         // Reset selection and patterns when folder changes
 383:         setSelectedFiles([]);
 384:         setLocalPatterns({ patterns: '', excludedSystemPatterns: [] });
 385:         setProcessingStatus({ status: "processing", message: "Loading files..." });
 386:         // Use specific method if available, or generic send
 387:         window.electron.send("request-file-list", folderPath);
 388:       }
 389:     };
 390: 
 391:     const handleFileListData = (filesMetadata: Omit<FileData, 'content'>[]) => {
 392:       console.log(`Received metadata for ${filesMetadata.length} files`);
 393:       
 394:       // Add detailed logging for diagnostics
 395:       if (filesMetadata.length > 0) {
 396:         console.log("Sample files received:");
 397:         filesMetadata.slice(0, Math.min(5, filesMetadata.length)).forEach(file => {
 398:           console.log(`- ${file.name} (${file.path}) ${file.excluded ? '[EXCLUDED]' : ''}`);
 399:         });
 400:         
 401:         // Count excluded files
 402:         const excludedCount = filesMetadata.filter(f => f.excluded).length;
 403:         if (excludedCount > 0) {
 404:           console.log(`Warning: ${excludedCount} files are excluded by patterns!`);
 405:         }
 406:       } else {
 407:         console.warn("No files received from main process!");
 408:       }
 409:       
 410:       setAllFiles(filesMetadata);
 411:       applyFiltersAndSort(filesMetadata, sortOrder, searchTerm);  
 412:       setProcessingStatus({ status: "complete", message: `Loaded ${filesMetadata.length} files` });
 413:     };
 414:     
 415:     // PERFORMANCE IMPROVEMENT: Handle partial file list updates
 416:     const handlePartialFileListData = (partialFilesMetadata: Omit<FileData, 'content'>[]) => {
 417:       console.log(`Received partial metadata for ${partialFilesMetadata.length} files`);
 418:       
 419:       // Update files progressively by appending to existing files
 420:       setAllFiles(prevFiles => {
 421:         const newFiles = [...prevFiles];
 422:         
 423:         // Add new files, avoiding duplicates by path
 424:         const existingPaths = new Set(prevFiles.map(f => f.path));
 425:         for (const file of partialFilesMetadata) {
 426:           if (!existingPaths.has(file.path)) {
 427:             newFiles.push(file);
 428:             existingPaths.add(file.path);
 429:           }
 430:         }
 431:         
 432:         return newFiles;
 433:       });
 434:       
 435:       // Update the filtered/sorted list based on the latest files
 436:       // Note that we need to use a callback to ensure we're using the latest state
 437:       setAllFiles(currentFiles => {
 438:         applyFiltersAndSort(currentFiles, sortOrder, searchTerm);
 439:         return currentFiles;
 440:       });
 441:     };
 442: 
 443:     const handleProcessingStatus = (status: { status: "idle" | "processing" | "complete" | "error"; message: string; partial?: boolean }) => {
 444:       setProcessingStatus(status);
 445:       
 446:       // If the status includes "partial: true", we're getting progressive updates
 447:       // Don't mark as complete until we get the final "complete" status without partial flag
 448:       if (status.status === "complete" && !status.partial) {
 449:         console.log("File loading complete:", status.message);
 450:       }
 451:     };
 452: 
 453:     const handleIgnorePatternsLoaded = (result: { patterns: string; isGlobal: boolean; systemPatterns?: string[]; folderPath?: string }) => {
 454:       console.log(`Ignore patterns loaded (global: ${result.isGlobal})`);
 455:       
 456:       if (result.systemPatterns) {
 457:         setSystemIgnorePatterns(result.systemPatterns);
 458:       }
 459:       
 460:       const parsedPatterns = parseIgnorePatternsContent(result.patterns);
 461:       
 462:       if (result.isGlobal) {
 463:         setGlobalPatternsState({
 464:           patterns: parsedPatterns.userPatterns,
 465:           excludedSystemPatterns: parsedPatterns.excludedPatterns
 466:         });
 467:       } else if (result.folderPath && selectedFolder && arePathsEqual(result.folderPath, selectedFolder)) {
 468:         setLocalPatterns({
 469:           patterns: parsedPatterns.userPatterns,
 470:           excludedSystemPatterns: parsedPatterns.excludedPatterns
 471:         });
 472:       }
 473:     };
 474: 
 475:     // Setup IPC listeners using the exposed 'receive' method
 476:     window.electron.receive("folder-selected", handleFolderSelected);
 477:     window.electron.receive("file-list-data", handleFileListData);
 478:     window.electron.receive("file-list-partial-data", handlePartialFileListData); // Add handler for partial updates
 479:     window.electron.receive("file-processing-status", handleProcessingStatus);
 480:     window.electron.receive("ignore-patterns-loaded", handleIgnorePatternsLoaded);
 481: 
 482:     // Cleanup function should use removeListener if it exists on the exposed API
 483:     return () => {
 484:       // Check if ipcRenderer and removeListener method exist before calling
 485:       if (window.electron.ipcRenderer?.removeListener) {
 486:         window.electron.ipcRenderer.removeListener("folder-selected", handleFolderSelected);
 487:         window.electron.ipcRenderer.removeListener("file-list-data", handleFileListData);
 488:         window.electron.ipcRenderer.removeListener("file-list-partial-data", handlePartialFileListData); // Clean up partial updates handler
 489:         window.electron.ipcRenderer.removeListener("file-processing-status", handleProcessingStatus);
 490:         window.electron.ipcRenderer.removeListener("ignore-patterns-loaded", handleIgnorePatternsLoaded);
 491:       } else {
 492:         console.warn("Cleanup: ipcRenderer.removeListener not found on window.electron");
 493:         // Alternative cleanup if needed, e.g., calling ipcRenderer.removeAllListeners(channel)
 494:       }
 495:     };
 496:   }, [isElectron, applyFiltersAndSort, sortOrder, searchTerm, selectedFolder]);
 497: 
 498:   // Add ESC key handler
 499:   const handleEscKey = useCallback((e: KeyboardEvent) => {
 500:       if (e.key === 'Escape' && processingStatus.status === 'processing') {
 501:         console.log("Escape key pressed, cancelling directory loading...");
 502:         // Use specific method if available, or generic send
 503:         window.electron.send("cancel-directory-loading");
 504:       }
 505:     }, [processingStatus.status]);
 506: 
 507:   useEffect(() => {
 508:       document.addEventListener('keydown', handleEscKey);
 509:       return () => {
 510:         document.removeEventListener('keydown', handleEscKey);
 511:       };
 512:     }, [handleEscKey]);
 513:     
 514:   // Add file change detection handler
 515:   useEffect(() => {
 516:     if (!isElectron || !selectedFolder) return;
 517:     
 518:     console.log("Setting up file change listener");
 519:     
 520:     const handleFileChanged = (data: { type: 'add' | 'change' | 'delete', path: string }) => {
 521:       // Immediately normalize the path to match allFiles format
 522:       const { type, path } = data;
 523:       const normalizedPath = normalizePath(path);
 524:       console.log(`File ${type} event detected: ${normalizedPath}`);
 525:       
 526:       if (type === 'add') {
 527:         // Fetch metadata for the new file and add it to allFiles
 528:         window.electron.getFileMetadata(normalizedPath).then((result: any) => {
 529:           if (result.success && result.fileData) {
 530:             console.log("Adding new file to allFiles:", result.fileData.path);
 531:             // Use functional update to get the latest state
 532:             setAllFiles(prev => {
 533:               const updatedFiles = [...prev, result.fileData];
 534:               // Call applyFiltersAndSort with the new array to update displayedFiles
 535:               applyFiltersAndSort(updatedFiles, sortOrder, searchTerm);
 536:               return updatedFiles;
 537:             });
 538:           }
 539:         });
 540:       } 
 541:       else if (type === 'change') {
 542:         // Update existing file's metadata
 543:         window.electron.getFileMetadata(normalizedPath).then((result: any) => {
 544:           if (result.success && result.fileData) {
 545:             console.log("Updating file in allFiles:", result.fileData.path);
 546:             setAllFiles(prev => {
 547:               const updatedFiles = prev.map(file => 
 548:                 arePathsEqual(file.path, normalizedPath) ? result.fileData : file
 549:               );
 550:               applyFiltersAndSort(updatedFiles, sortOrder, searchTerm);
 551:               return updatedFiles;
 552:             });
 553:           }
 554:         });
 555:       } 
 556:       else if (type === 'delete') {
 557:         // Remove file from allFiles and selectedFiles
 558:         console.log("Removing file from allFiles:", normalizedPath);
 559:         
 560:         // Use functional update for all state setters relying on previous state
 561:         setAllFiles(prevAllFiles => {
 562:           const updatedAllFiles = prevAllFiles.filter(file => !arePathsEqual(file.path, normalizedPath));
 563:           // Call applyFiltersAndSort with the updated array
 564:           applyFiltersAndSort(updatedAllFiles, sortOrder, searchTerm);
 565:           return updatedAllFiles;
 566:         });
 567:         
 568:         setSelectedFiles(prevSelectedFiles => 
 569:           prevSelectedFiles.filter(filePath => !arePathsEqual(filePath, normalizedPath))
 570:         );
 571:       }
 572:     };
 573:     
 574:     // Use the receive method to listen for file-changed events
 575:     window.electron.receive("file-changed", handleFileChanged);
 576:     
 577:     // Cleanup listener when component unmounts
 578:     return () => {
 579:       // Check if ipcRenderer and removeListener method exist before calling
 580:       if (window.electron.ipcRenderer?.removeListener) {
 581:         window.electron.ipcRenderer.removeListener("file-changed", handleFileChanged);
 582:       }
 583:     };
 584:   // Reduce dependencies to prevent unnecessary re-subscriptions
 585:   }, [isElectron, selectedFolder, applyFiltersAndSort, sortOrder, searchTerm]);
 586: 
 587:   // --- Core Functions ---
 588: 
 589:   const openFolder = async () => { // Make async
 590:     if (isElectron) {
 591:       console.log("Requesting to open folder dialog via IPC invoke...");
 592:       try {
 593:         // Use the specific invoke method
 594:         const folderPath = await window.electron.openFolder();
 595:         if (folderPath) {
 596:           console.log("Folder selected via dialog:", folderPath);
 597:           
 598:           // Clear all relevant state
 599:           setAllFiles([]);
 600:           setDisplayedFiles([]);
 601:           setSelectedFiles([]);
 602:           setExpandedNodes(new Map());
 603:           setLocalPatterns({ patterns: '', excludedSystemPatterns: [] });
 604:           
 605:           // Set processing status first
 606:           setProcessingStatus({ status: "processing", message: "Loading files..." });
 607:           
 608:           // Then set the selected folder
 609:           setSelectedFolder(folderPath);
 610:           
 611:           // Request file list for the newly selected folder
 612:           console.log("Requesting file list for:", folderPath);
 613:           if (window.electron.requestFileList) {
 614:             window.electron.requestFileList({ path: folderPath });
 615:           } else {
 616:             window.electron.send("request-file-list", folderPath);
 617:           }
 618:         } else {
 619:           console.log("Folder selection cancelled.");
 620:         }
 621:       } catch (error) {
 622:         console.error("Error opening folder dialog via IPC:", error);
 623:          setProcessingStatus({ status: "error", message: `Error opening folder: ${error instanceof Error ? error.message : error}` });
 624:       }
 625:     }
 626:   };
 627: 
 628:   // Toggle file selection
 629:   const toggleFileSelection = useCallback((filePath: string) => {
 630:     const normalizedPath = normalizePath(filePath);
 631:     setSelectedFiles(prevSelected => {
 632:       const isSelected = prevSelected.some(path => arePathsEqual(path, normalizedPath));
 633:       return isSelected
 634:         ? prevSelected.filter(path => !arePathsEqual(path, normalizedPath))
 635:         : [...prevSelected, normalizedPath];
 636:     });
 637:   }, []); // Add empty dependency array
 638: 
 639:   // Select all non-excluded files
 640:   const selectAllFiles = useCallback(() => {
 641:     const filesToSelect = allFiles
 642:       .filter(file => !file.isBinary && !file.isSkipped && !file.excluded)
 643:       .map(file => file.path);
 644:     setSelectedFiles(filesToSelect); // Directly set, no need to merge if it's 'select all'
 645:   }, [allFiles]);
 646: 
 647:   // Deselect all files
 648:   const deselectAllFiles = useCallback(() => {
 649:     setSelectedFiles([]);
 650:   }, []);
 651: 
 652:   // Toggle folder selection
 653:   const toggleFolderSelection = useCallback((folderPath: string, shouldBeSelected: boolean) => {
 654:     if (!folderPath) return;
 655:     const normalizedFolderPath = normalizePath(folderPath);
 656: 
 657:     setSelectedFiles(prev => {
 658:       const newSelectionSet = new Set(prev);
 659:       allFiles.forEach(file => {
 660:         const normalizedFilePath = normalizePath(file.path);
 661:         // Check if file is within the target folder (or is the folder itself if files represent folders)
 662:         if (normalizedFilePath.startsWith(normalizedFolderPath + '/') || normalizedFilePath === normalizedFolderPath) {
 663:            // Only modify selection for non-binary, non-skipped, non-excluded files
 664:            if (!file.isBinary && !file.isSkipped && !file.excluded) {
 665:                 if (shouldBeSelected) {
 666:                     newSelectionSet.add(file.path);
 667:                 } else {
 668:                     newSelectionSet.delete(file.path);
 669:                 }
 670:            }
 671:         }
 672:       });
 673:       return Array.from(newSelectionSet);
 674:     });
 675:   }, [allFiles]); // Depends on allFiles
 676: 
 677:   // Handle sort change
 678:   const handleSortChange = useCallback((value: string | string[]) => {
 679:     if (typeof value === 'string') {
 680:       setSortOrder(value as SortOrder);
 681:       // applyFiltersAndSort will be triggered by the useEffect watching sortOrder
 682:     }
 683:   }, []); // Add empty dependency array
 684: 
 685:   // Handle search change
 686:   const handleSearchChange = useCallback((newSearch: string) => {
 687:     setSearchTerm(newSearch);
 688:      // applyFiltersAndSort will be triggered by the useEffect watching searchTerm
 689:   }, []); // Add empty dependency array
 690: 
 691:   // Calculate total tokens (Memoized)
 692:   const totalTokens = useMemo(() => { // Renamed to avoid conflict
 693:     const fileMap = new Map(allFiles.map(f => [f.path, f.tokenCount]));
 694:     return selectedFiles.reduce((total, path) => {
 695:       return total + (fileMap.get(path) || 0);
 696:     }, 0);
 697:   }, [selectedFiles, allFiles]);
 698: 
 699:   // Calculate total token count for selected files
 700:   const totalTokenCount = useMemo(() => {
 701:     // If no folder is selected, or file list/selection is empty, count is 0
 702:     if (!selectedFolder || !allFiles || allFiles.length === 0 || selectedFiles.length === 0) {
 703:       return 0;
 704:     }
 705:     // Create a set of normalized selected file paths for efficient lookup
 706:     const selectedFileSet = new Set(selectedFiles.map(normalizePath));
 707: 
 708:     // Sum token counts of files whose normalized path is in the selected set
 709:     return allFiles.reduce((sum, file) => {
 710:       if (selectedFileSet.has(normalizePath(file.path))) {
 711:         // Use tokenCount if it's a valid number, otherwise default to 0
 712:         return sum + (typeof file.tokenCount === 'number' ? file.tokenCount : 0);
 713:       }
 714:       return sum;
 715:     }, 0);
 716:   }, [selectedFiles, allFiles, selectedFolder]); // Recalculate when selection, file list, or folder changes
 717: 
 718:   // Calculate UNCOMPRESSED total token count for selected files (for initial display before processing)
 719:   const uncompressedTotalTokenCount = useMemo(() => {
 720:     if (!selectedFolder || !allFiles || allFiles.length === 0 || selectedFiles.length === 0) return 0;
 721:     const selectedFileSet = new Set(selectedFiles.map(normalizePath));
 722:     return allFiles.reduce((sum, file) => {
 723:       if (selectedFileSet.has(normalizePath(file.path))) {
 724:         // Use uncompressedTokenCount for this initial calculation
 725:         return sum + (typeof file.uncompressedTokenCount === 'number' ? file.uncompressedTokenCount : 0);
 726:       }
 727:       return sum;
 728:     }, 0);
 729:   }, [selectedFiles, allFiles, selectedFolder]);
 730: 
 731:   // Update displayed count whenever uncompressed count changes (or after compression)
 732:   useEffect(() => {
 733:     setDisplayedTokenCount(uncompressedTotalTokenCount);
 734:     // This will be updated again within getSelectedFilesContent if compression runs
 735:   }, [uncompressedTotalTokenCount]);
 736: 
 737:   // --- Moved reloadFolder definition earlier ---
 738:   const reloadFolder = useCallback(() => {
 739:     if (isElectron && selectedFolder) {
 740:       console.log(`Reloading folder: ${selectedFolder}`);
 741:       setProcessingStatus({ status: "processing", message: "Reloading files..." });
 742:       setAllFiles([]); // Clear current files
 743:       setDisplayedFiles([]);
 744:       // Optionally reset local patterns state if desired on manual reload
 745:       // setLocalPatterns({ patterns: '', excludedSystemPatterns: [] });
 746:       // Use specific method if available, or generic send
 747:       if (window.electron.requestFileList) {
 748:         window.electron.requestFileList({ path: selectedFolder, forceRefresh: true });
 749:       } else {
 750:         window.electron.send("reload-file-list", selectedFolder);
 751:       }
 752:     }
 753:   }, [isElectron, selectedFolder]); // Now defined before other callbacks
 754: 
 755:   // Helper to get language identifier for compression function
 756:   const getLanguageFromPath = (filePath: string): string | null => {
 757:     // Extract extension in a browser-safe way
 758:     const lastDotIndex = filePath.lastIndexOf('.');
 759:     const extension = lastDotIndex !== -1 ? filePath.slice(lastDotIndex + 1).toLowerCase() : '';
 760:     
 761:     switch (extension) {
 762:       case 'js':
 763:       case 'jsx':
 764:         return 'javascript';
 765:       case 'ts':
 766:       case 'tsx':
 767:         return 'typescript';
 768:       case 'py':
 769:         return 'python';
 770:       case 'css':
 771:         return 'css';
 772:       case 'html':
 773:       case 'htm':
 774:         return 'html';
 775:       // Add other mappings as needed
 776:       default:
 777:         return null; // Unsupported extension for compression
 778:     }
 779:   };
 780: 
 781:   // Function to dynamically compress files if needed
 782:   const applyDynamicCompression = useCallback(async (
 783:     filesToProcess: FileData[],
 784:     targetTokenLimit: number,
 785:     // Add flag for comment removal
 786:     removeCommentsFlag: boolean,
 787:     // Add flag for preserving docstrings
 788:     keepDocstringsFlag: boolean = true,
 789:     // Add new parameters
 790:     neverCompressPatterns: string[] = [],
 791:     minCompressTokenThreshold: number = 100,
 792:     // Add flag for removing empty lines
 793:     removeEmptyLinesFlag: boolean = false
 794:   ): Promise<{ processedFiles: FileData[], finalTokenCount: number }> => {
 795: 
 796:     if (!isElectron) {
 797:       console.warn("Compression skipped: Not running in Electron environment.");
 798:        const initialTokenCount = filesToProcess.reduce((sum, file) => sum + (file.uncompressedTokenCount || 0), 0);
 799:       return { processedFiles: filesToProcess, finalTokenCount: initialTokenCount };
 800:     }
 801: 
 802:     setProcessingStatus({ status: 'processing', message: 'Analyzing files...' });
 803: 
 804:     const mutableFiles: FileData[] = filesToProcess.map(f => ({
 805:         ...f,
 806:         uncompressedTokenCount: f.uncompressedTokenCount ?? f.tokenCount ?? 0,
 807:         isCompressed: false, // Reset to false - we'll determine this during processing
 808:         tokenCount: f.uncompressedTokenCount ?? f.tokenCount ?? 0, // Start with original token count
 809:         content: undefined // Start with undefined content, fetch as needed
 810:     }));
 811: 
 812:     // Calculate initial total token count for comparison
 813:     let currentTotalTokens = mutableFiles.reduce(
 814:       (sum, file) => sum + (file.tokenCount || 0), 
 815:       0
 816:     );
 817:     console.log(`Initial token count: ${currentTotalTokens}, Target: ${targetTokenLimit}`);
 818: 
 819:     // --- Step 1: Remove Comments (if enabled) --- PRE-COMPRESSION TOKEN COUNT
 820:     if (removeCommentsFlag) {
 821:       console.log("Attempting comment removal...");
 822:       setProcessingStatus({ status: 'processing', message: 'Removing comments...' });
 823:       let commentsRemovedCount = 0;
 824:       // Use Promise.all for potentially faster parallel processing
 825:       await Promise.all(mutableFiles.map(async (file) => {
 826:         const language = getLanguageFromFilename(file.name);
 827:         if (!language) return; // Skip unsupported
 828: 
 829:         try {
 830:            let currentContent = file.content;
 831:            // Fetch content if needed
 832:            if (currentContent === undefined) {
 833:              console.log(`Fetching content for comment removal: ${file.path}`);
 834:              const result = await window.electron.getFileContent(file.path);
 835:              
 836:              if (!result || !result.success) {
 837:                const error = result?.error || 'Unknown error';
 838:                console.error(`Failed to get content for ${file.path}: ${error}`);
 839:                file.content = `// Error fetching content: ${error}`;
 840:                return;
 841:              }
 842:              
 843:              currentContent = result.content;
 844:            }
 845: 
 846:            if (typeof currentContent !== 'string') {
 847:              console.warn(`Content for ${file.path} is not a string, skipping comment removal.`);
 848:              return;
 849:            }
 850: 
 851:            const contentWithoutComments = await removeComments(currentContent, language, keepDocstringsFlag);
 852: 
 853:            if (contentWithoutComments !== null && contentWithoutComments !== currentContent) {
 854:              commentsRemovedCount++;
 855:              // Recalculate token count *after* comment removal
 856:              const newTokenCount = await window.electron.countTokens(contentWithoutComments);
 857:              // *** IMPORTANT: Store content and updated token count NOW ***
 858:              file.content = contentWithoutComments; 
 859:              file.tokenCount = typeof newTokenCount === 'number' ? newTokenCount : (file.uncompressedTokenCount ?? 0);
 860:              console.log(`Comments removed from ${file.name}. New token count: ${file.tokenCount}`);
 861:            } else {
 862:               // If no comments removed, ensure token count is original uncompressed
 863:               file.tokenCount = file.uncompressedTokenCount ?? 0;
 864:               // If we've already loaded the content, preserve it
 865:               if (currentContent !== undefined) {
 866:                 file.content = currentContent;
 867:               }
 868:            }
 869:         } catch (error) {
 870:            console.error(`Error during comment removal for ${file.path}:`, error);
 871:            // Check if error is an instance of Error before accessing message
 872:            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
 873:            file.content = `// Error removing comments: ${errorMessage}`;
 874:         }
 875:       }));
 876: 
 877:       // Recalculate total token count after comment removal
 878:       currentTotalTokens = mutableFiles.reduce((sum, file) => sum + (file.tokenCount || 0), 0);
 879:       console.log(`Token count after comment removal: ${currentTotalTokens}`);
 880:     }
 881: 
 882:     // Check if we need compression - only compress if we exceed the target token limit
 883:     // This is the adaptive part - we'll only compress if needed
 884:     const needsBodyCompression = currentTotalTokens > targetTokenLimit;
 885:     
 886:     if (!needsBodyCompression) {
 887:       console.log("Token count is within limit, no body compression needed.");
 888:       setProcessingStatus({ status: 'idle', message: '' });
 889:       // Need to ensure content is fetched if not already present (e.g., comment removal ran but no body compression needed)
 890:       await Promise.all(mutableFiles.map(async (file) => {
 891:           if (file.content === undefined) {
 892:               try {
 893:                   console.log(`Fetching content (final pass): ${file.path}`);
 894:                   const result = await window.electron.getFileContent(file.path);
 895:                   
 896:                   if (!result || !result.success) {
 897:                     const error = result?.error || 'Unknown error';
 898:                     console.error(`Failed to get content for ${file.path}: ${error}`);
 899:                     file.content = `// Error fetching content: ${error}`;
 900:                   } else {
 901:                     file.content = result.content;
 902:                     // Use uncompressed count here as body compression didn't run
 903:                     file.tokenCount = file.uncompressedTokenCount ?? 0;
 904:                   }
 905:                   
 906:               } catch (e) { 
 907:                   console.error(`Error fetching content for ${file.path}:`, e);
 908:                   // Check if e is an instance of Error before accessing message
 909:                   const errorMessage = e instanceof Error ? e.message : 'Unknown error';
 910:                   file.content = `// Error fetching content: ${errorMessage}`; 
 911:                   file.tokenCount = 0; 
 912:               }
 913:           }
 914:       }));
 915:       return { processedFiles: mutableFiles, finalTokenCount: currentTotalTokens };
 916:     }
 917: 
 918:     // --- Body Compression Loop --- 
 919:     // Only execute this if we actually need compression (token count exceeds limit)
 920:     console.log("Token count exceeds limit, starting body compression...");
 921:     setProcessingStatus({ status: 'processing', message: 'Compressing function bodies...' });
 922:     
 923:     // Helper function to check if a file path matches any of the patterns
 924:     const matchesAnyPattern = (path: string, patterns: string[]): boolean => {
 925:       if (patterns.length === 0) return false;
 926:       
 927:       // Normalize the path to use forward slashes for consistent matching
 928:       const normalizedPath = path.replace(/\\/g, '/');
 929:       
 930:       // Get the filename for simpler patterns like *.py
 931:       const fileName = normalizedPath.split('/').pop() || '';
 932:       
 933:       return patterns.some(pattern => {
 934:         // Skip empty patterns
 935:         if (!pattern.trim()) return false;
 936:         
 937:         // Normalize the pattern too
 938:         const normalizedPattern = pattern.trim().replace(/\\/g, '/');
 939:         
 940:         // Simple glob matching for common patterns
 941:         // Convert glob pattern to regex
 942:         const regexPattern = normalizedPattern
 943:           .replace(/\./g, '\\.')   // Escape dots
 944:           .replace(/\*\*/g, '.*')  // ** becomes .* (match anything, including slashes)
 945:           .replace(/\*/g, '[^/]*') // * becomes [^/]* (match anything except slashes)
 946:           .replace(/\?/g, '[^/]')  // ? becomes [^/] (match single character, not slash)
 947:           .replace(/\[!\]/g, '[^]'); // [!] becomes [^]
 948:         
 949:         // For simple filename patterns (no slash), match against the filename only
 950:         if (!normalizedPattern.includes('/') && !normalizedPattern.includes('\\')) {
 951:           return new RegExp(`^${regexPattern}$`).test(fileName);
 952:         }
 953:         
 954:         // For full path patterns, match against the full path
 955:         return new RegExp(`^${regexPattern}$`).test(normalizedPath);
 956:       });
 957:     };
 958: 
 959:     // Filter files based on compression rules
 960:     const filesToCompress = [...mutableFiles]
 961:       .filter(file => {
 962:         // Skip already compressed files
 963:         if (file.isCompressed) return false;
 964:         
 965:         // Skip files with too few tokens
 966:         if ((file.tokenCount || 0) < minCompressTokenThreshold) {
 967:           console.log(`Skipping ${file.name}: below token threshold (${file.tokenCount} < ${minCompressTokenThreshold})`);
 968:           return false;
 969:         }
 970:         
 971:         // Skip files matching any of the never compress patterns
 972:         if (matchesAnyPattern(file.path, neverCompressPatterns)) {
 973:           console.log(`Skipping ${file.name}: matches never compress pattern`);
 974:           return false;
 975:         }
 976:         
 977:         return true;
 978:       })
 979:       .sort((a, b) => (b.tokenCount || 0) - (a.tokenCount || 0));
 980:     
 981:     let filesCompressedCount = 0;
 982:     
 983:     for (const fileToCompress of filesToCompress) {
 984:       if (currentTotalTokens <= targetTokenLimit) {
 985:         console.log("Target token limit reached, stopping compression.");
 986:         break;
 987:       }
 988:       
 989:       setProcessingStatus({ 
 990:         status: 'processing', 
 991:         message: `Compressing: ${fileToCompress.name} (${filesCompressedCount + 1}/${filesToCompress.length})` 
 992:       });
 993:       
 994:       const language = getLanguageFromFilename(fileToCompress.name);
 995:       if (!language) {
 996:         console.log(`Skipping body compression for unsupported file type: ${fileToCompress.name}`);
 997:         fileToCompress.isCompressed = true; // Mark as processed even if unsupported
 998:         continue;
 999:       }
1000:       
1001:       try {
1002:         let contentToCompress = fileToCompress.content;
1003:         // Fetch content ONLY if it wasn't fetched during comment removal
1004:         if (contentToCompress === undefined) {
1005:           console.log(`Fetching content for body compression: ${fileToCompress.path}`);
1006:           const result = await window.electron.getFileContent(fileToCompress.path);
1007:           
1008:           if (!result || !result.success) {
1009:             const error = result?.error || 'Unknown error';
1010:             console.error(`Failed to get content for ${fileToCompress.path}: ${error}`);
1011:             fileToCompress.content = `// Error fetching content: ${error}`;
1012:             fileToCompress.isCompressed = true; // Mark as processed
1013:             continue;
1014:           }
1015:           
1016:           contentToCompress = result.content;
1017:         }
1018:         
1019:         if (typeof contentToCompress !== 'string') {
1020:           console.warn(`Could not get valid content for ${fileToCompress.path}, skipping body compression.`);
1021:           fileToCompress.isCompressed = true; // Mark as processed
1022:           continue;
1023:         }
1024:         
1025:         const compressedSource = await compressCode(contentToCompress, language);
1026:         
1027:         if (compressedSource !== null && compressedSource !== contentToCompress) {
1028:           console.log(`Recalculating tokens for body-compressed ${fileToCompress.name}`);
1029:           const newCompressedTokenCount = await window.electron.countTokens(compressedSource);
1030:           
1031:           if (typeof newCompressedTokenCount === 'number') {
1032:             const reduction = (fileToCompress.tokenCount || 0) - newCompressedTokenCount;
1033:             console.log(`Body-compressed ${fileToCompress.name}. Token reduction: ${reduction}`);
1034:             fileToCompress.content = compressedSource;
1035:             fileToCompress.tokenCount = newCompressedTokenCount;
1036:             fileToCompress.isCompressed = true;
1037:             filesCompressedCount++;
1038:             
1039:             // Recalculate total immediately to check if we've reached target
1040:             currentTotalTokens = mutableFiles.reduce((sum, file) => sum + (file.tokenCount || 0), 0);
1041:             // Update displayed token count in real-time
1042:             setDisplayedTokenCount(currentTotalTokens);
1043:           } else {
1044:             console.warn(`Failed to recalculate tokens for body-compressed ${fileToCompress.name}`);
1045:           }
1046:         } else {
1047:           console.log(`Body compression skipped or ineffective for ${fileToCompress.name}`);
1048:         }
1049:         
1050:         fileToCompress.isCompressed = true; // Mark as processed even if ineffective
1051:         
1052:       } catch (error) {
1053:         console.error(`Error during body compression for ${fileToCompress.path}:`, error);
1054:         // Check if error is an instance of Error before accessing message
1055:         const errorMessage = error instanceof Error ? error.message : 'Unknown error';
1056:         fileToCompress.content = `// Error compressing code: ${errorMessage}`;
1057:         fileToCompress.isCompressed = true; // Mark as processed
1058:       }
1059:     }
1060: 
1061:     console.log(`Compression complete. Final token count: ${currentTotalTokens}`);
1062:     console.log(`Compressed ${filesCompressedCount} files.`);
1063:     setProcessingStatus({ 
1064:       status: 'complete', 
1065:       message: `Compression finished. ${filesCompressedCount} files compressed.` 
1066:     });
1067:     setTimeout(() => setProcessingStatus({ status: 'idle', message: '' }), 2000);
1068: 
1069:     // --- Final Step: Remove Empty Lines if enabled ---
1070:     if (removeEmptyLinesFlag) {
1071:       console.log("Removing empty lines from files...");
1072:       let emptyLinesRemovedCount = 0;
1073:       
1074:       // Process each file to remove empty lines
1075:       for (const file of mutableFiles) {
1076:         if (file.content !== undefined && typeof file.content === 'string') {
1077:           // Regex to match empty lines or lines with only whitespace
1078:           const originalContent = file.content;
1079:           file.content = file.content.replace(/^\s*$(?:\r\n?|\n)/gm, '');
1080:           
1081:           if (file.content !== originalContent) {
1082:             emptyLinesRemovedCount++;
1083:             console.log(`Removed empty lines from ${file.name}`);
1084:           }
1085:         }
1086:       }
1087:       
1088:       console.log(`Empty lines removed from ${emptyLinesRemovedCount} files.`);
1089:     }
1090: 
1091:     // Final update of the token count
1092:     currentTotalTokens = mutableFiles.reduce((sum, file) => sum + (file.tokenCount || 0), 0);
1093:     
1094:     return { processedFiles: mutableFiles, finalTokenCount: currentTotalTokens };
1095:   }, [
1096:     isElectron,
1097:     setProcessingStatus,
1098:     setDisplayedTokenCount,
1099:   ]);
1100: 
1101:   // Get selected files content and apply formatting/compression
1102:   const getSelectedFilesContent = useCallback(async (): Promise<string> => {
1103:     if (selectedFiles.length === 0) {
1104:        setDisplayedTokenCount(0); // Reset displayed count
1105:       return "No files selected.";
1106:     }
1107: 
1108:     setProcessingStatus({ status: 'processing', message: `Preparing ${selectedFiles.length} files...` });
1109: 
1110:     try {
1111:       const selectedFileSet = new Set(selectedFiles.map(normalizePath));
1112:       const filesToProcess: FileData[] = allFiles.filter(file =>
1113:         selectedFileSet.has(normalizePath(file.path)) && !file.isBinary && !file.isSkipped
1114:       ).map(f => ({ // Ensure we map to the full FileData structure if allFiles is Omit<..., 'content'>
1115:           ...f,
1116:           content: undefined, // Start with undefined content
1117:           isCompressed: false, // Reset compression state
1118:           tokenCount: f.tokenCount ?? 0,
1119:           uncompressedTokenCount: f.uncompressedTokenCount ?? f.tokenCount ?? 0
1120:       }));
1121: 
1122:       let finalTokenCount = filesToProcess.reduce((sum, file) => sum + (file.tokenCount || 0), 0);
1123:       let processedFilesForOutput: FileData[] = filesToProcess; // Start with the initial selection, now typed as FileData[]
1124: 
1125:       // --- Apply Comment Removal & Compression if Enabled --- //
1126:       if (isCompressionEnabled || isCommentRemovalEnabled) {
1127:          const targetLimit = selectedContextLength ? Math.floor(selectedContextLength * 0.95) : Infinity;
1128: 
1129:          // Pass all parameters to the processing function
1130:          const processingResult = await applyDynamicCompression(
1131:             filesToProcess,
1132:             targetLimit,
1133:             isCommentRemovalEnabled, // Pass comment removal flag
1134:             keepDocstrings, // Pass keepDocstrings flag
1135:             neverCompressPatterns, // Pass the never compress patterns (array)
1136:             minCompressTokenThreshold, // Pass the min tokens threshold
1137:             removeEmptyLines // Pass the removeEmptyLines flag
1138:           );
1139: 
1140:          processedFilesForOutput = processingResult.processedFiles;
1141:          finalTokenCount = processingResult.finalTokenCount;
1142: 
1143:          // Update the displayed token count immediately
1144:          setDisplayedTokenCount(finalTokenCount);
1145:       } else {
1146:          // If processing is disabled, calculate and display the uncompressed total
1147:          finalTokenCount = filesToProcess.reduce((sum, file) => sum + (file.uncompressedTokenCount || 0), 0);
1148:          setDisplayedTokenCount(finalTokenCount);
1149:          // Fetch content if processing was skipped
1150:          await Promise.all(processedFilesForOutput.map(async (file) => {
1151:              if (file.content === undefined) {
1152:                  try {
1153:                      console.log(`Fetching content (no compression): ${file.path}`);
1154:                      const result = await window.electron.getFileContent(file.path);
1155:                      
1156:                      if (!result || !result.success) {
1157:                          const error = result?.error || 'Unknown error';
1158:                          console.error(`Failed to get content for ${file.path}: ${error}`);
1159:                          file.content = `// Error fetching content: ${error}`;
1160:                      } else {
1161:                          file.content = result.content;
1162:                      }
1163:                  } catch (e) { 
1164:                      console.error(`Error fetching content for ${file.path}:`, e);
1165:                      // Check if e is an instance of Error before accessing message
1166:                      const errorMessage = e instanceof Error ? e.message : 'Unknown error';
1167:                      file.content = `// Error fetching content: ${errorMessage}`; 
1168:                  }
1169:              }
1170:          }));
1171:       }
1172: 
1173:       // --- Sort the richer FileData array BEFORE extracting content --- //
1174:       const sortedProcessedFiles = [...processedFilesForOutput].sort((a, b) => {
1175:           const [sortKey, sortDir] = sortOrder.split("-");
1176:           let comparison = 0;
1177:           // Use properties directly from FileData
1178:           const aTokens = a.tokenCount ?? 0;
1179:           const bTokens = b.tokenCount ?? 0;
1180:           const aDate = a.lastModified ?? 0;
1181:           const bDate = b.lastModified ?? 0;
1182: 
1183:           switch (sortKey) {
1184:             case "name": comparison = a.name.localeCompare(b.name); break;
1185:             case "tokens": comparison = aTokens - bTokens; break;
1186:             case "date": comparison = Number(aDate) - Number(bDate); break;
1187:             default: comparison = a.name.localeCompare(b.name);
1188:           }
1189:           return sortDir === "ascending" ? comparison : -comparison;
1190:       });
1191: 
1192:       // --- Now create the simple FileContent array for formatters --- //
1193:       const fileContents: FileContent[] = sortedProcessedFiles.map(file => ({
1194:           path: file.path,
1195:           content: file.content ?? '// Content unavailable',
1196:           // No isCompressed, name, lastModified here as FileContent doesn't expect them
1197:       }));
1198: 
1199:        // Generate file tree string if needed
1200:        let fileTreeString = "";
1201:        if (selectedFolder && fileTreeMode !== 'none') {
1202:          // Corrected call to generateAsciiFileTree with 3 arguments
1203:          // Pass only the path property from sortedProcessedFiles
1204:          const pathsForTree = sortedProcessedFiles.map(f => ({ path: f.path }));
1205:          fileTreeString = generateAsciiFileTree(pathsForTree, selectedFolder, fileTreeMode);
1206:        }
1207: 
1208:       // Format the output based on the selected format
1209:       let formattedOutput = "";
1210:       // Corrected calls to formatters with 5 arguments
1211:       switch (outputFormat) {
1212:         case 'xml': formattedOutput = formatAsXML(fileContents, selectedFolder, fileTreeMode, fileTreeString, userInstructions); break;
1213:         case 'markdown': formattedOutput = formatAsMarkdown(fileContents, selectedFolder, fileTreeMode, fileTreeString, userInstructions); break;
1214:         case 'plain': default: formattedOutput = formatAsPlain(fileContents, selectedFolder, fileTreeMode, fileTreeString, userInstructions); break;
1215:       }
1216: 
1217:       setProcessingStatus({ status: 'complete', message: 'Output generated successfully!' });
1218:       setTimeout(() => setProcessingStatus({ status: 'idle', message: '' }), 2000);
1219: 
1220:       return formattedOutput;
1221: 
1222:     } catch (error: unknown) {
1223:       const errorMessage = error instanceof Error ? error.message : 'Unknown error';
1224:       console.error('Error generating output:', error);
1225:       setProcessingStatus({ status: 'error', message: `Error: ${errorMessage}` });
1226:       return `// Error generating output: ${errorMessage}`;
1227:     }
1228:   }, [
1229:     selectedFiles,
1230:     allFiles,
1231:     isCompressionEnabled,
1232:     isCommentRemovalEnabled,
1233:     keepDocstrings,
1234:     selectedContextLength,
1235:     applyDynamicCompression,
1236:     sortOrder,
1237:     outputFormat,
1238:     selectedFolder,
1239:     fileTreeMode,
1240:     userInstructions,
1241:     setProcessingStatus,
1242:     setDisplayedTokenCount,
1243:     neverCompressPatterns,
1244:     minCompressTokenThreshold,
1245:     removeEmptyLines
1246:   ]);
1247: 
1248:   // Sort options
1249:   const sortOptions = useMemo(() => [
1250:     { value: "name-ascending", label: "Name (A-Z)" },
1251:     { value: "name-descending", label: "Name (Z-A)" },
1252:     { value: "tokens-ascending", label: "Tokens (Asc)" },
1253:     { value: "tokens-descending", label: "Tokens (Desc)" },
1254:     { value: "date-ascending", label: "Date (Oldest)" },
1255:     { value: "date-descending", label: "Date (Newest)" }
1256:   ], []);
1257: 
1258:   // Handle expand/collapse state changes
1259:   const toggleExpanded = useCallback((nodeId: string) => {
1260:     setExpandedNodes(prev => {
1261:       const newState = new Map(prev);
1262:       newState.set(nodeId, !prev.get(nodeId)); // Simplified toggle
1263:       // Persisted via useEffect watching expandedNodes
1264:       return newState;
1265:     });
1266:   }, []); // Add empty dependency array
1267: 
1268:   // --- Ignore Pattern Functions ---
1269: 
1270:   // Load patterns (global or local)
1271:   const loadIgnorePatterns = useCallback(async (folderPath: string, isGlobal: boolean = false): Promise<void> => {
1272:     if (!isElectron) return;
1273:     console.log(`Requesting load for ${isGlobal ? 'global' : 'local'} patterns${!isGlobal ? ` for ${folderPath}` : ''}`);
1274:     try {
1275:         // Invoke expects the handler to exist. The result is handled by the 'ignore-patterns-loaded' listener.
1276:         await window.electron.loadIgnorePatterns({ folderPath, isGlobal });
1277:     } catch (error: unknown) {
1278:         const errorMessage = error instanceof Error ? error.message : 'Unknown error';
1279:         console.error(`Error invoking load-ignore-patterns (${isGlobal ? 'global' : 'local'}): ${errorMessage}`);
1280:         // Set default state on error
1281:         if (isGlobal) {
1282:             setGlobalPatternsState({ patterns: '', excludedSystemPatterns: [] });
1283:             setSystemIgnorePatterns(DEFAULT_SYSTEM_PATTERNS);
1284:         } else if (folderPath === selectedFolder) {
1285:             setLocalPatterns({ patterns: '', excludedSystemPatterns: [] });
1286:         }
1287:     }
1288: }, [isElectron, selectedFolder]); // Dependencies: isElectron, selectedFolder
1289: 
1290:   // Save patterns (global or local) - Now just calls IPC
1291:   const saveIgnorePatterns = useCallback(async (patterns: string, isGlobal: boolean, folderPath?: string): Promise<void> => {
1292:     if (!isElectron) return;
1293:     const targetPath = folderPath || selectedFolder; // Use provided path or current folder for local
1294:     if (!isGlobal && !targetPath) {
1295:       console.error("Cannot save local patterns without a folder path.");
1296:       setProcessingStatus({ status: "error", message: "No folder selected for local patterns." });
1297:       return;
1298:     }
1299: 
1300:     setProcessingStatus({ status: "processing", message: `Saving ${isGlobal ? "global" : "local"} patterns...` });
1301: 
1302:     try {
1303:       // The string passed (`patterns`) should already include `# DISABLED:` comments
1304:       // generated by IgnorePatterns.tsx's handleSaveGlobalPatterns
1305:       const result = await window.electron.saveIgnorePatterns({
1306:         patterns,
1307:         isGlobal,
1308:         folderPath: targetPath ?? undefined
1309:       });
1310: 
1311:       if (result.success) {
1312:         console.log(`IPC: Save ${isGlobal ? 'global' : 'local'} patterns successful.`);
1313:         setProcessingStatus({ status: "complete", message: "Patterns saved." });
1314: 
1315:         // --- Update State --- 
1316:         if (isGlobal) {
1317:           // Assuming handleSaveGlobalPatterns in IgnorePatterns.tsx formats
1318:           // the string with user patterns and # DISABLED lines.
1319:           // We need to parse it back here if we want to store excluded separately.
1320:           // Or, simplify App.tsx state to just store the raw string.
1321:           // Let's parse it back for consistency:
1322:           const { excludedPatterns, userPatterns } = parseIgnorePatternsContent(patterns);
1323:           setGlobalPatternsState({ patterns: userPatterns, excludedSystemPatterns: excludedPatterns });
1324:         } else {
1325:           // For local patterns, the raw saved string is usually fine.
1326:           setLocalPatterns(prev => ({
1327:              ...prev, // Keep excludedSystemPatterns if it were relevant for local (it's not currently)
1328:              patterns: patterns // Update with the newly saved content
1329:            }));
1330:         }
1331: 
1332:         // Immediately update the selected files to exclude any newly excluded files
1333:         // This ensures UI is updated before the folder reload completes
1334:         const newSelectedFiles = selectedFiles.filter(filePath => {
1335:           // Create a temporary ignore for checking
1336:           const tempIgnore = ignore().add(patterns.split('\n').filter(line => line.trim() && !line.startsWith('#')));
1337:           return !tempIgnore.ignores(filePath);
1338:         });
1339:         
1340:         // Only update if there's a change to avoid unnecessary re-renders
1341:         if (newSelectedFiles.length !== selectedFiles.length) {
1342:           console.log(`Immediately filtered out ${selectedFiles.length - newSelectedFiles.length} newly excluded files from selection`);
1343:           setSelectedFiles(newSelectedFiles);
1344:           
1345:           // Also update displayed files to reflect the changes
1346:           const updatedDisplayedFiles = displayedFiles.filter(file => 
1347:             newSelectedFiles.includes(file.path)
1348:           );
1349:           setDisplayedFiles(updatedDisplayedFiles);
1350:         }
1351: 
1352:         // Reload the folder data to apply new patterns
1353:         // Add a small delay to ensure file system changes are registered
1354:         setTimeout(() => {
1355:           reloadFolder();
1356:           
1357:           // After reloading, update selected files again to ensure consistency
1358:           setTimeout(() => {
1359:             // Filter out files that should be excluded based on new patterns
1360:             const newSelectedFiles = selectedFiles.filter(filePath => {
1361:               // Find the file in allFiles to check if it's excluded
1362:               const file = allFiles.find(f => f.path === filePath);
1363:               return file && !file.excludedByDefault;
1364:             });
1365:             
1366:             // Only update if there's a change to avoid unnecessary re-renders
1367:             if (newSelectedFiles.length !== selectedFiles.length) {
1368:               console.log(`Filtered out ${selectedFiles.length - newSelectedFiles.length} newly excluded files from selection after reload`);
1369:               setSelectedFiles(newSelectedFiles);
1370:             }
1371:           }, 500); // Wait a bit after reload to ensure allFiles is updated
1372:         }, 300);
1373: 
1374:       } else {
1375:         console.error(`IPC: Save ${isGlobal ? 'global' : 'local'} patterns failed:`, result.error);
1376:         setProcessingStatus({ status: "error", message: `Save failed: ${result.error}` });
1377:       }
1378:     } catch (error: unknown) {
1379:       const errorMessage = error instanceof Error ? error.message : 'Unknown error';
1380:       console.error("Error invoking save-ignore-patterns:", error);
1381:       setProcessingStatus({ status: "error", message: `Save failed: ${errorMessage}` });
1382:     }
1383:   }, [isElectron, selectedFolder, reloadFolder, selectedFiles, allFiles, setSelectedFiles, displayedFiles, setDisplayedFiles]);
1384: 
1385:   // Reset patterns (global or local)
1386:   const resetIgnorePatterns = useCallback(async (isGlobal: boolean, folderPath?: string): Promise<void> => {
1387:     if (!isElectron) return;
1388:     const targetPath = folderPath || selectedFolder;
1389:     if (!isGlobal && !targetPath) {
1390:       console.error("Cannot reset local patterns without a folder path");
1391:       setProcessingStatus({ status: "error", message: "No folder selected for local patterns." });
1392:       return;
1393:     }
1394: 
1395:     setProcessingStatus({ status: "processing", message: `Resetting ${isGlobal ? "global" : "local"} patterns...` });
1396: 
1397:     try {
1398:       const result = await window.electron.resetIgnorePatterns({
1399:         folderPath: targetPath || undefined,
1400:         isGlobal
1401:       });
1402: 
1403:       if (result.success) {
1404:         console.log(`IPC: Reset ${isGlobal ? 'global' : 'local'} patterns successful`);
1405:         setProcessingStatus({ status: "complete", message: "Patterns reset." });
1406: 
1407:         // Update state with the default values returned
1408:         if (isGlobal) {
1409:           setGlobalPatternsState({
1410:             patterns: result.patterns || '',
1411:             excludedSystemPatterns: []
1412:           });
1413:         } else {
1414:           setLocalPatterns({
1415:             patterns: result.patterns || '',
1416:             excludedSystemPatterns: []
1417:           });
1418:         }
1419: 
1420:         // Immediately update selected files based on default patterns
1421:         if (result.patterns) {
1422:           const defaultPatterns = result.patterns;
1423:           const newSelectedFiles = selectedFiles.filter(filePath => {
1424:             // Create a temporary ignore for checking
1425:             const tempIgnore = ignore().add(defaultPatterns.split('\n').filter(line => line.trim() && !line.startsWith('#')));
1426:             return !tempIgnore.ignores(filePath);
1427:           });
1428:           
1429:           // Only update if there's a change to avoid unnecessary re-renders
1430:           if (newSelectedFiles.length !== selectedFiles.length) {
1431:             console.log(`Immediately filtered out ${selectedFiles.length - newSelectedFiles.length} newly excluded files from selection after reset`);
1432:             setSelectedFiles(newSelectedFiles);
1433:             
1434:             // Also update displayed files to reflect the changes
1435:             const updatedDisplayedFiles = displayedFiles.filter(file => 
1436:               newSelectedFiles.includes(file.path)
1437:             );
1438:             setDisplayedFiles(updatedDisplayedFiles);
1439:           }
1440:         }
1441: 
1442:         // Reload the folder data to apply new patterns
1443:         setTimeout(() => {
1444:           reloadFolder();
1445:           
1446:           // After reloading, update selected files again to ensure consistency
1447:           setTimeout(() => {
1448:             // Filter out files that should be excluded based on new patterns
1449:             const newSelectedFiles = selectedFiles.filter(filePath => {
1450:               // Find the file in allFiles to check if it's excluded
1451:               const file = allFiles.find(f => f.path === filePath);
1452:               return file && !file.excludedByDefault;
1453:             });
1454:             
1455:             // Only update if there's a change to avoid unnecessary re-renders
1456:             if (newSelectedFiles.length !== selectedFiles.length) {
1457:               console.log(`Filtered out ${selectedFiles.length - newSelectedFiles.length} newly excluded files from selection after reload`);
1458:               setSelectedFiles(newSelectedFiles);
1459:             }
1460:           }, 500); // Wait a bit after reload to ensure allFiles is updated
1461:         }, 300);
1462:       } else {
1463:         console.error(`IPC: Reset ${isGlobal ? 'global' : 'local'} patterns failed:`, result.error);
1464:         setProcessingStatus({ status: "error", message: `Reset failed: ${result.error}` });
1465:       }
1466:     } catch (error: unknown) {
1467:       const errorMessage = error instanceof Error ? error.message : 'Unknown error';
1468:       console.error("Error invoking reset-ignore-patterns:", error);
1469:       setProcessingStatus({ status: "error", message: `Reset failed: ${errorMessage}` });
1470:     }
1471:   }, [isElectron, selectedFolder, reloadFolder, selectedFiles, allFiles, setSelectedFiles, displayedFiles, setDisplayedFiles]);
1472: 
1473:   // Clear local ignore patterns (no global counterpart)
1474:   const clearLocalIgnorePatterns = useCallback(async (folderPath: string): Promise<void> => {
1475:     if (!isElectron) return;
1476:     if (!folderPath) {
1477:       console.error("Cannot clear local patterns without a folder path");
1478:       setProcessingStatus({ status: "error", message: "No folder selected for local patterns." });
1479:       return;
1480:     }
1481: 
1482:     setProcessingStatus({ status: "processing", message: "Clearing local patterns..." });
1483: 
1484:     try {
1485:       const result = await window.electron.clearLocalIgnorePatterns({
1486:         folderPath
1487:       });
1488: 
1489:       if (result.success) {
1490:         console.log("IPC: Clear local patterns successful");
1491:         setProcessingStatus({ status: "complete", message: "Local patterns cleared." });
1492: 
1493:         // Update local patterns state (empty string, no exclusions)
1494:         setLocalPatterns({
1495:           patterns: '',
1496:           excludedSystemPatterns: []
1497:         });
1498: 
1499:         // Since we're clearing patterns, more files might now be included
1500:         // We don't need to filter the selected files immediately since we're removing restrictions
1501:         // But we should update the displayed files to be consistent with the allFiles list after reload
1502:         
1503:         // Reload folder data to apply changes
1504:         setTimeout(() => {
1505:           reloadFolder();
1506:           
1507:           // After reloading, update selected files to exclude any newly excluded files
1508:           setTimeout(() => {
1509:             // Filter out files that should be excluded based on new patterns
1510:             const newSelectedFiles = selectedFiles.filter(filePath => {
1511:               // Find the file in allFiles to check if it's excluded
1512:               const file = allFiles.find(f => f.path === filePath);
1513:               return file && !file.excludedByDefault;
1514:             });
1515:             
1516:             // Only update if there's a change to avoid unnecessary re-renders
1517:             if (newSelectedFiles.length !== selectedFiles.length) {
1518:               console.log(`Filtered out ${selectedFiles.length - newSelectedFiles.length} newly excluded files from selection after reload`);
1519:               setSelectedFiles(newSelectedFiles);
1520:             }
1521:           }, 500); // Wait a bit after reload to ensure allFiles is updated
1522:         }, 300);
1523:       } else {
1524:         console.error("IPC: Clear local patterns failed:", result.error);
1525:         setProcessingStatus({ status: "error", message: `Clear failed: ${result.error}` });
1526:       }
1527:     } catch (error: unknown) {
1528:       const errorMessage = error instanceof Error ? error.message : 'Unknown error';
1529:       console.error("Error invoking clear-local-ignore-patterns:", error);
1530:       setProcessingStatus({ status: "error", message: `Clear failed: ${errorMessage}` });
1531:     }
1532:   }, [isElectron, reloadFolder, selectedFiles, allFiles, setSelectedFiles]);
1533: 
1534: 
1535:   // --- Dialog State & Handlers ---
1536:   const [showClearSelectionDialog, setShowClearSelectionDialog] = useState(false);
1537:   const [showRemoveAllFoldersDialog, setShowRemoveAllFoldersDialog] = useState(false);
1538:   const [showResetPatternsDialog, setShowResetPatternsDialog] = useState(false);
1539:   const [resetPatternsContext, setResetPatternsContext] = useState<{isGlobal: boolean; folderPath: string | null}>({isGlobal: false, folderPath: null});
1540: 
1541:   const handleClearSelectionClick = useCallback(() => setShowClearSelectionDialog(true), []);
1542:   const clearSelection = useCallback(() => { setSelectedFiles([]); setShowClearSelectionDialog(false); }, []);
1543:   const handleRemoveAllFoldersClick = useCallback(() => setShowRemoveAllFoldersDialog(true), []);
1544:   const removeAllFolders = useCallback(() => {
1545:     setSelectedFolder(null); setAllFiles([]); setSelectedFiles([]); setDisplayedFiles([]);
1546:     setLocalPatterns({ patterns: '', excludedSystemPatterns: [] }); // Reset local patterns
1547:     localStorage.removeItem(STORAGE_KEYS.SELECTED_FOLDER);
1548:     localStorage.removeItem(STORAGE_KEYS.SELECTED_FILES);
1549:     localStorage.removeItem(STORAGE_KEYS.EXPANDED_NODES); // Also clear expanded nodes
1550:     setExpandedNodes(new Map()); // Reset map in state
1551:     sessionStorage.removeItem("hasLoadedInitialData");
1552:     setShowRemoveAllFoldersDialog(false);
1553:   }, []);
1554: 
1555:   const confirmResetPatterns = useCallback(() => {
1556:     if (resetPatternsContext) {
1557:       resetIgnorePatterns(resetPatternsContext.isGlobal, resetPatternsContext.folderPath || undefined);
1558:     }
1559:     setShowResetPatternsDialog(false);
1560:     setResetPatternsContext({isGlobal: false, folderPath: null});
1561:   }, [resetPatternsContext, resetIgnorePatterns]);
1562: 
1563:   // --- Helper Functions ---
1564:   const truncatePath = (path: string | null): string => {
1565:     if (!path) return "No folder selected";
1566:     const parts = path.split(/[/\\]/); // Handle both slash types
1567:     if (parts.length <= 3) return path;
1568:     const lastParts = parts.filter(p => p).slice(-2);
1569:     return `.../${lastParts.join('/')}`;
1570:   };
1571: 
1572:   // Callback for IgnorePatterns component to update global excluded patterns
1573:   const handleExcludedSystemPatternsChange = useCallback((newExcluded: string[]) => {
1574:     setGlobalPatternsState((prev: IgnorePatternsState) => ({
1575:       ...prev,
1576:       excludedSystemPatterns: newExcluded
1577:     }));
1578:   }, []);
1579: 
1580:   // Update processing status handlers to include setTimeout for complete status
1581:   useEffect(() => {
1582:     // Handle auto-dismissing 'complete' status messages
1583:     if (processingStatus.status === 'complete') {
1584:       const timer = setTimeout(() => {
1585:         setProcessingStatus({ status: 'idle', message: '' });
1586:       }, 5000); // Use 5000ms to match StatusAlert default
1587:       
1588:       return () => clearTimeout(timer);
1589:     }
1590:   }, [processingStatus.status, processingStatus.message]);
1591: 
1592:   // --- Handler for Model Selection ---
1593:   const handleModelChange = useCallback((modelId: string | null) => {
1594:     console.log(`Model selected: ${modelId}`);
1595:     
1596:     // Find the corresponding model info and update context length
1597:     if (modelId && availableModels) {
1598:       const selectedModel = availableModels.find(model => model.id === modelId);
1599:       if (selectedModel) {
1600:         // Update states with the valid model
1601:         setSelectedModelId(modelId);
1602:         setSelectedContextLength(selectedModel.context_length);
1603:         console.log(`Set context length: ${selectedModel.context_length}`);
1604:         
1605:         // Persist to localStorage
1606:         localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL_ID, modelId);
1607:         console.log(`Persisted modelId ${modelId} to localStorage`);
1608:       } else {
1609:         console.warn(`Selected model ID ${modelId} not found in available models.`);
1610:         
1611:         // Try to recover with first available model
1612:         if (availableModels.length > 0) {
1613:           const firstModel = availableModels[0];
1614:           setSelectedModelId(firstModel.id);
1615:           setSelectedContextLength(firstModel.context_length);
1616:           localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL_ID, firstModel.id);
1617:           console.log(`Recovered with model ${firstModel.id}, context length: ${firstModel.context_length}`);
1618:         } else {
1619:           // No models available - use sensible defaults
1620:           setSelectedModelId(null);
1621:           setSelectedContextLength(128000); // A safe default
1622:           localStorage.removeItem(STORAGE_KEYS.SELECTED_MODEL_ID);
1623:           console.warn('No models available for recovery - using defaults');
1624:         }
1625:       }
1626:     } else {
1627:       // Handle null selection (should be rare in UI)
1628:       setSelectedModelId(null);
1629:       setSelectedContextLength(null);
1630:       localStorage.removeItem(STORAGE_KEYS.SELECTED_MODEL_ID);
1631:       console.log('Cleared model selection');
1632:     }
1633:   }, [availableModels]); // Add availableModels dependency
1634: 
1635:   // Handler to force refresh of models list
1636:   const handleRefreshModels = useCallback(async () => {
1637:     if (!isElectron) return;
1638:     
1639:     console.log("Manually refreshing models list...");
1640:     setProcessingStatus({ status: "processing", message: "Refreshing models..." });
1641:     setIsLoadingModels(true);
1642:     
1643:     try {
1644:       // Call fetchModels with forceRefresh=true to skip cache
1645:       const fetchedModels = await fetchModels(true);
1646:       const modelsToUse = (fetchedModels as ModelInfo[] | null) || [];
1647:       
1648:       // If still no models, use fallbacks
1649:       const finalModels = modelsToUse.length > 0 
1650:         ? modelsToUse 
1651:         : [
1652:             { id: "openai/gpt-4o", name: "GPT-4o (Fallback)", context_length: 128000 },
1653:             { id: "anthropic/claude-3-5-sonnet-20240620", name: "Claude 3.5 Sonnet (Fallback)", context_length: 200000 }
1654:           ];
1655:       
1656:       // Update available models state
1657:       setAvailableModels(finalModels);
1658:       
1659:       // Update selected model if needed
1660:       if (selectedModelId) {
1661:         const selectedModel = finalModels.find(m => m.id === selectedModelId);
1662:         if (selectedModel) {
1663:           // Current model still exists, update its context length
1664:           setSelectedContextLength(selectedModel.context_length);
1665:           console.log(`Updated context length for ${selectedModelId}: ${selectedModel.context_length}`);
1666:         } else if (finalModels.length > 0) {
1667:           // Selected model no longer exists, switch to first available
1668:           const firstModel = finalModels[0];
1669:           setSelectedModelId(firstModel.id);
1670:           setSelectedContextLength(firstModel.context_length);
1671:           localStorage.setItem(STORAGE_KEYS.SELECTED_MODEL_ID, firstModel.id);
1672:           console.log(`Selected model no longer available. Switched to: ${firstModel.id}`);
1673:         }
1674:       }
1675:       
1676:       setProcessingStatus({ status: "complete", message: `Refreshed ${finalModels.length} models` });
1677:       setTimeout(() => setProcessingStatus({ status: "idle", message: "" }), 2000);
1678:     } catch (error) {
1679:       console.error("Error refreshing models:", error);
1680:       setProcessingStatus({ 
1681:         status: "error", 
1682:         message: `Failed to refresh models: ${error instanceof Error ? error.message : 'Unknown error'}`
1683:       });
1684:     } finally {
1685:       setIsLoadingModels(false);
1686:       // Make sure initialModelLoadComplete stays true (just in case)
1687:       setInitialModelLoadComplete(true);
1688:     }
1689:   }, [isElectron, selectedModelId]);
1690: 
1691:   // --- Render ---
1692:   return (
1693:     <ThemeProvider>
1694:       <div className={styles.appContainer}>
1695:         <header className={styles.appHeader}>
1696:           <h1>ContextCraft</h1>
1697:           <div className={styles.headerActions}>
1698:             {/* <a href="#" className={styles.headerLink}>Guide</a>
1699:             <div className={styles.headerSeparator}></div> */}
1700:             <ThemeToggle />
1701:             <div className={styles.headerSeparator}></div>
1702:             <a href="https://github.com/flight505/ContextCraft" target="_blank" rel="noopener noreferrer" className={styles.githubButton}>
1703:               <Github size={16} />
1704:             </a>
1705:           </div>
1706:         </header>
1707: 
1708:         {processingStatus.status !== 'idle' && (
1709:           <StatusAlert
1710:             status={processingStatus.status}
1711:             message={processingStatus.message}
1712:             onClose={() => setProcessingStatus({ status: 'idle', message: '' })}
1713:           />
1714:         )}
1715: 
1716:         <div className={styles.mainContainer}>
1717:           <Sidebar
1718:             selectedFolder={selectedFolder}
1719:             openFolder={openFolder}
1720:             allFiles={allFiles}
1721:             selectedFiles={selectedFiles}
1722:             toggleFileSelection={toggleFileSelection}
1723:             toggleFolderSelection={toggleFolderSelection}
1724:             searchTerm={searchTerm}
1725:             onSearchChange={handleSearchChange}
1726:             selectAllFiles={selectAllFiles}
1727:             deselectAllFiles={deselectAllFiles}
1728:             expandedNodes={expandedNodes}
1729:             toggleExpanded={toggleExpanded}
1730:             reloadFolder={reloadFolder}
1731:             clearSelection={clearSelection}
1732:             removeAllFolders={removeAllFolders}
1733:             loadIgnorePatterns={loadIgnorePatterns}
1734:             saveIgnorePatterns={saveIgnorePatterns}
1735:             resetIgnorePatterns={resetIgnorePatterns}
1736:             systemIgnorePatterns={systemIgnorePatterns}
1737:             clearIgnorePatterns={clearLocalIgnorePatterns}
1738:             onClearSelectionClick={handleClearSelectionClick}
1739:             onRemoveAllFoldersClick={handleRemoveAllFoldersClick}
1740:             fileTreeSortOrder={fileTreeSortOrder}
1741:             onSortOrderChange={setFileTreeSortOrder}
1742:             globalPatternsState={globalPatternsState}
1743:             localPatternsState={localIgnorePatterns}
1744:             onExcludedSystemPatternsChange={handleExcludedSystemPatternsChange}
1745:             setIgnorePatterns={() => {}}
1746:             _availableModels={availableModels}
1747:             _selectedModelId={selectedModelId}
1748:             _onModelChange={handleModelChange}
1749:           />
1750: 
1751:           {selectedFolder ? (
1752:             <div className={styles.contentArea}>
1753:               <div className={styles.contentHeader}>
1754:                 <div className={styles.folderPathDisplay} title={selectedFolder}>
1755:                   <span className={styles.pathLabel}>{'>_'}</span> {truncatePath(selectedFolder)}
1756:                 </div>
1757:                 <div className={styles.headerSeparator} />
1758:                 <div className={styles.contentActions}>
1759:                   <Dropdown
1760:                     options={sortOptions}
1761:                     value={sortOrder}
1762:                     onChange={handleSortChange}
1763:                     trigger={
1764:                       <Button variant="secondary" size="sm" startIcon={getSortIcon(sortOrder)}> Sort </Button>
1765:                     }
1766:                   />
1767:                 </div>
1768:                 <div className={styles.headerSeparator} />
1769:                 <div className={styles.fileStats}>
1770:                   <span>{selectedFiles.length}</span> files selected (<span>{displayedTokenCount.toLocaleString()}</span> tokens)
1771:                 </div>
1772:               </div>
1773:               <FileList
1774:                 files={displayedFiles} // Pass metadata only
1775:                 selectedFiles={selectedFiles}
1776:                 toggleFileSelection={toggleFileSelection}
1777:               />
1778: 
1779:               {showUserInstructions && (
1780:                 <div className={styles.userInstructionsContainer}>
1781:                   <UserInstructionsWithTemplates
1782:                     instructions={userInstructions}
1783:                     setInstructions={setUserInstructions}
1784:                   />
1785:                 </div>
1786:               )}
1787: 
1788:               <ControlContainer
1789:                 fileTreeMode={fileTreeMode}
1790:                 setFileTreeMode={setFileTreeMode}
1791:                 showUserInstructions={showUserInstructions}
1792:                 setShowUserInstructions={setShowUserInstructions}
1793:                 getSelectedFilesContent={getSelectedFilesContent} // Now async
1794:                 selectedFilesCount={selectedFiles.length}
1795:                 outputFormat={outputFormat}
1796:                 setOutputFormat={setOutputFormat}
1797:                 availableModels={availableModels}
1798:                 selectedModelId={selectedModelId}
1799:                 onModelChange={handleModelChange}
1800:                 isElectron={isElectron}
1801:                 processingStatus={processingStatus.status}
1802:                 onGenerateOutput={() => {}} // Assuming generateOutput uses selected model
1803:                 totalTokenCount={displayedTokenCount}
1804:                 selectedContextLength={selectedContextLength}
1805:                 isCompressionEnabled={isCompressionEnabled}
1806:                 setIsCompressionEnabled={setIsCompressionEnabled}
1807:                 isCommentRemovalEnabled={isCommentRemovalEnabled}
1808:                 setIsCommentRemovalEnabled={setIsCommentRemovalEnabled}
1809:                 onRefreshModels={handleRefreshModels}
1810:                 // Pass new props for enhanced compression controls
1811:                 keepDocstrings={keepDocstrings}
1812:                 setKeepDocstrings={setKeepDocstrings}
1813:                 removeEmptyLines={removeEmptyLines}
1814:                 setRemoveEmptyLines={setRemoveEmptyLines}
1815:                 neverCompressPatterns={neverCompressPatterns}
1816:                 neverCompressPatternsRaw={neverCompressPatternsRaw}
1817:                 setNeverCompressPatternsRaw={setNeverCompressPatternsRaw}
1818:                 minCompressTokenThreshold={minCompressTokenThreshold}
1819:                 setMinCompressTokenThreshold={setMinCompressTokenThreshold}
1820:               />
1821:             </div>
1822:           ) : (
1823:             <div className={styles.contentArea}>
1824:               <div className={styles.emptyStateContent}>
1825:                 <h2>Welcome to ContextCraft</h2>
1826:                 <p>Select a folder to get started.</p>
1827:                 <Button variant="primary" onClick={openFolder} className="mt-4"> Select Project Folder </Button>
1828:               </div>
1829:             </div>
1830:           )}
1831:         </div>
1832: 
1833:         {/* Confirmation Dialogs */}
1834:         <ConfirmationDialog isOpen={showClearSelectionDialog} onClose={() => setShowClearSelectionDialog(false)} onConfirm={clearSelection} title="Clear Selection" description="Clear all selected files?" confirmLabel="Clear" variant="destructive" />
1835:         <ConfirmationDialog isOpen={showRemoveAllFoldersDialog} onClose={() => setShowRemoveAllFoldersDialog(false)} onConfirm={removeAllFolders} title="Remove All Folders" description="Remove all folders and reset the application?" confirmLabel="Remove All" variant="destructive" />
1836:         <ConfirmationDialog isOpen={showResetPatternsDialog} onClose={() => setShowResetPatternsDialog(false)} onConfirm={confirmResetPatterns} title={`Reset ${resetPatternsContext?.isGlobal ? 'Global' : 'Local'} Ignore Patterns`} description="Reset patterns to their default values?" confirmLabel="Reset" variant="destructive" />
1837:       </div>
1838:     </ThemeProvider>
1839:   );
1840: };
1841: 
1842: export default App;
````
