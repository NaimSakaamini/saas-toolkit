'use client';

import React, { ReactNode } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

interface ClientThemeProviderProps {
  children: ReactNode;
}

/**
 * Custom theme configuration
 */
const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
  },
});

/**
 * Client-side Theme Provider Component
 * 
 * Provides Mantine theme to all child components.
 * This component only runs on the client side to avoid hydration mismatches.
 */
export function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
} 