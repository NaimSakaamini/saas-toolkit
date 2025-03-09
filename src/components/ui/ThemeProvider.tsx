'use client';

import React, { ReactNode, useState, useEffect, createContext, useContext } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

// Create a context for theme management
interface ThemeContextType {
  colorScheme: 'light' | 'dark';
  toggleColorScheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colorScheme: 'light',
  toggleColorScheme: () => {},
});

// Hook to use theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme Provider Component
 * 
 * Provides Mantine theme to all child components with light/dark mode support.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Always initialize with 'light' for SSR to avoid hydration mismatch
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Custom theme configuration
  const theme = createTheme({
    primaryColor: 'blue',
    defaultRadius: 'md',
    fontFamily: 'Inter, sans-serif',
    headings: {
      fontFamily: 'Inter, sans-serif',
    },
  });

  // Toggle between light and dark mode
  const toggleColorScheme = () => {
    if (!mounted) return; // Don't toggle before mounting
    
    const newColorScheme = colorScheme === 'light' ? 'dark' : 'light';
    setColorScheme(newColorScheme);
    
    // Save to localStorage
    try {
      localStorage.setItem('mantine-color-scheme', newColorScheme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  };

  // Effect to load saved theme from localStorage
  useEffect(() => {
    setMounted(true);
    
    try {
      // Get saved theme from localStorage after component mounts
      const savedTheme = localStorage.getItem('mantine-color-scheme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setColorScheme(savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Check user's system preference
        setColorScheme('dark');
      }
    } catch (error) {
      console.error('Error reading theme from localStorage:', error);
    }
  }, []);

  // Create context value
  const contextValue = {
    colorScheme: mounted ? colorScheme : 'light',
    toggleColorScheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MantineProvider 
        theme={theme} 
        defaultColorScheme="light"
        forceColorScheme={mounted ? colorScheme : 'light'}
      >
        {children}
      </MantineProvider>
    </ThemeContext.Provider>
  );
} 