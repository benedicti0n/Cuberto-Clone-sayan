# Skeleton Loaders

This directory contains skeleton loader components that create placeholder loading effects similar to YouTube, Instagram, and other major platforms. These components can be used to improve user experience by showing loading states while data is being fetched.

## Available Skeleton Loaders

- **Skeleton**: Base skeleton component that can be customized for different needs
- **CardSkeleton**: For card-based content like projects or articles
- **ProfileSkeleton**: For user profiles and bio sections
- **GridSkeleton**: For grids of cards or images
- **TextContentSkeleton**: For text-heavy sections like about or content areas
- **VideoSkeleton**: For video content placeholders
- **YouTubeSkeleton**: YouTube-style skeleton with header, categories and video grid
- **TableSkeleton**: For data tables
- **SkeletonWrapper**: Generic wrapper to conditionally display skeleton or content
- **FullScreenLoader**: Full-screen skeleton loading screen for initial app load
- **SectionLoader**: Component for skeleton loading specific sections of your app

## How to Use

### Basic Skeleton Component

```tsx
import { Skeleton } from '@/components/SkeletonLoaders';

<Skeleton 
  variant="rectangular" 
  animation="wave" 
  className="w-full h-40" 
/>
```

### Using with the useSkeletonLoader Hook

For the best experience, use the skeleton loaders with the `useSkeletonLoader` hook:

```tsx
import { useState, useEffect } from 'react';
import { useSkeletonLoader } from '@/lib/hooks';
import { CardSkeleton } from '@/components/SkeletonLoaders';

const YourComponent = () => {
  const { isLoading, data } = useSkeletonLoader(
    () => fetchYourData(),
    { minimumLoadTime: 1000 } // Show skeleton for at least 1 second
  );
  
  // Your fetch function
  const fetchYourData = async () => {
    try {
      const res = await axios.get('/your-api-endpoint');
      return res.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };
  
  return (
    <div>
      {isLoading ? (
        <CardSkeleton />
      ) : (
        // Your actual content here
        <div>Your content</div>
      )}
    </div>
  );
};
```

### Using SectionLoader for Easy Integration

The `SectionLoader` component makes it easy to implement skeleton loading for any section:

```tsx
import { SectionLoader } from '@/components';
import { GridSkeleton } from '@/components/SkeletonLoaders';

// In your component
<SectionLoader
  skeleton={<GridSkeleton columns={2} count={4} className="p-4" />}
  minLoadTime={1200}
>
  <YourComponent />
</SectionLoader>
```

### Full-Screen Initial Loading

To show a full-screen skeleton loader when your app first loads:

```tsx
// In your app's layout or main component
import { FullScreenLoader } from '@/components/SkeletonLoaders';

export default function RootLayout({ children }) {
  return (
    <FullScreenLoader minDisplayTime={1800}>
      {children}
    </FullScreenLoader>
  );
}
```

## Customization

All skeleton components accept a `className` prop for custom styling. You can also adjust other parameters like animation type, dimensions, and variant types. For example:

```tsx
// Different animation types
<Skeleton animation="pulse" />
<Skeleton animation="wave" />

// Different variants
<Skeleton variant="text" />
<Skeleton variant="circular" />
<Skeleton variant="rectangular" />
<Skeleton variant="image" />
```

## Demo

To see all skeleton components in action, you can check the implemented examples in these components:

- `PhotoGrid.tsx` - Grid skeleton loading
- `MovieSwiper.tsx` - Video skeleton loading
- `App.tsx` - Full-screen initial loading 