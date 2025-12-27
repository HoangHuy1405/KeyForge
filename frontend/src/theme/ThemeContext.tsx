import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, PaletteMode } from '@mui/material';
import { createAppTheme } from './index';

// ============================================================================
// Types
// ============================================================================

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
  setMode: (mode: PaletteMode) => void;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: PaletteMode;
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'bazaar-color-mode';

// ============================================================================
// Context
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// Hook
// ============================================================================

export const useColorMode = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useColorMode must be used within a ThemeProvider');
  }
  return context;
};

// ============================================================================
// Provider
// ============================================================================

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultMode = 'light' 
}) => {
  // Initialize from localStorage or default
  const [mode, setModeState] = useState<PaletteMode>(() => {
    if (typeof window === 'undefined') return defaultMode;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return defaultMode;
  });

  // Update localStorage when mode changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    // Update document attribute for CSS selectors
    document.documentElement.setAttribute('data-color-scheme', mode);
  }, [mode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      // Only update if user hasn't explicitly set a preference
      if (!stored) {
        setModeState(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleColorMode = () => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setMode = (newMode: PaletteMode) => {
    setModeState(newMode);
  };

  // Memoize theme to prevent unnecessary recreations
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const contextValue = useMemo(
    () => ({
      mode,
      toggleColorMode,
      setMode,
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
