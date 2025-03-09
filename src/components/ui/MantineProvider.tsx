'use client';

import React, { ReactNode } from 'react';
import { MantineProvider as BaseMantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';

interface MantineProviderProps {
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
 * Mantine Provider Component
 * 
 * This component is loaded dynamically with SSR disabled to avoid hydration mismatches.
 */
export function MantineProvider({ children }: MantineProviderProps) {
  return (
    <BaseMantineProvider theme={theme} defaultColorScheme="light">
      {children}
    </BaseMantineProvider>
  );
} 