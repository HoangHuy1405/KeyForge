import { createTheme, PaletteMode, Theme } from '@mui/material/styles';
import { getDesignTokens } from './palette';
import { typography } from './typography';
import { getComponentOverrides } from './components';

// ============================================================================
// Theme Factory
// ============================================================================

export const createAppTheme = (mode: PaletteMode): Theme => {
  const tokens = getDesignTokens(mode);

  return createTheme({
    ...tokens,
    cssVariables: {
      colorSchemeSelector: 'data-color-scheme',
    },
    typography,
    shape: {
      borderRadius: 8,
    },
    components: getComponentOverrides(tokens, mode),
  });
};

// ============================================================================
// Exports
// ============================================================================

// Default export for backwards compatibility
const theme = createAppTheme('light');
export default theme;

// Re-exports from submodules
export { getDesignTokens, lightPalette, darkPalette } from './palette';
export { typography } from './typography';
export {
  getComponentOverrides,
  getButtonOverrides,
  getInputOverrides,
  getSurfaceOverrides,
  getFeedbackOverrides,
  getDataDisplayOverrides,
  getNavigationOverrides,
} from './components';

