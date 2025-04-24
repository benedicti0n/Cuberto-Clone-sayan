import { Metadata } from 'next';
import "./globals.css";
import "./safari-compat.css";
import { FullScreenLoader } from '@/components/SkeletonLoaders';

export const metadata: Metadata = {
  title: "My Portfolio",
  description: "Professional portfolio website",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover"
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  // Check if dark mode is preferred
  const prefersDarkMode = typeof window !== 'undefined' && 
    window.matchMedia && 
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  return (
    <html lang="en">
      <body className="text-[#1d1d1f] overflow-x-hidden">
        <style>
          {`
            @media (prefers-color-scheme: dark) {
              :root {
                --background-color: #000000;
                --text-color: #ffffff;
              }
            }
          `}
        </style>
        <FullScreenLoader minDisplayTime={1800} isDark={prefersDarkMode}>
          {children}
        </FullScreenLoader>
      </body>
    </html>
  );
}
