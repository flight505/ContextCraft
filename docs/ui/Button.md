# Button Component

The Button component is a versatile, customizable button for user interactions. It supports multiple visual variants, sizes, and can include icons.

## Import

```tsx
import { Button } from '../components/ui';
```

## Basic Usage

```tsx
<Button>Click me</Button>
```

## Variants

The Button component supports multiple visual variants through the `variant` prop:

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="round">Round</Button>
<Button variant="icon">Icon</Button>
<Button variant="pill">Pill</Button>
```

- **primary**: Default style with filled background and high contrast
- **secondary**: Outlined style with transparent background
- **ghost**: Minimal style that only shows on hover/interaction
- **destructive**: Indicates a potentially dangerous action (red color)
- **round**: Pill-shaped with enhanced primary styling
- **icon**: Specialized for icon-only buttons with transparent background
- **pill**: Compact tag/badge-like appearance with high contrast

## Sizes

Three sizes are available via the `size` prop:

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button> {/* Default */}
<Button size="lg">Large</Button>
```

## Icons

You can add icons before and/or after the button text:

```tsx
import { ArrowRight, Download } from 'lucide-react';

<Button startIcon={<Download />}>Download</Button>
<Button endIcon={<ArrowRight />}>Next</Button>
<Button startIcon={<Download />} endIcon={<ArrowRight />}>Download and Continue</Button>
```

## Icon-Only Button

For buttons with only an icon (no text):

```tsx
<Button iconOnly startIcon={<Download />} />
```

The `iconOnly` prop ensures the button has equal width and height.

## Pill Shape

Make any button fully rounded with the `pill` prop:

```tsx
<Button pill>Rounded Button</Button>
```

Note: This is different from the "pill" variant, which has specific styling in addition to the pill shape.

## Customization

Apply custom classes with the `className` prop:

```tsx
<Button className="my-custom-class">Custom Button</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'destructive' \| 'round' \| 'icon' \| 'pill'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `startIcon` | `React.ReactNode` | `undefined` | Icon to display before text |
| `endIcon` | `React.ReactNode` | `undefined` | Icon to display after text |
| `iconOnly` | `boolean` | `false` | If true, button will have equal width and height |
| `pill` | `boolean` | `false` | If true, button will have fully rounded corners |
| `children` | `React.ReactNode` | `undefined` | Button content |
| `...props` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | - | All standard button attributes |

## Examples

### Primary Button with Icon

```tsx
import { Button } from '../components/ui';
import { Save } from 'lucide-react';

<Button 
  variant="primary"
  startIcon={<Save />}
  onClick={() => console.log('Saving...')}
>
  Save
</Button>
```

### Destructive Action

```tsx
import { Button } from '../components/ui';
import { Trash2 } from 'lucide-react';

<Button 
  variant="destructive"
  startIcon={<Trash2 />}
  onClick={() => confirm('Are you sure you want to delete this item?')}
>
  Delete
</Button>
```

### Icon-Only Round Button

```tsx
import { Button } from '../components/ui';
import { Plus } from 'lucide-react';

<Button 
  variant="round"
  iconOnly
  startIcon={<Plus />}
  aria-label="Add new item"
/>
``` 