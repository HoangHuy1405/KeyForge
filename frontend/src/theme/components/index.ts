import { Components, Theme, PaletteMode } from '@mui/material/styles';
import { DesignTokens } from '../palette';
import { getButtonOverrides } from './buttons';
import { getInputOverrides } from './inputs';
import { getSurfaceOverrides } from './surfaces';
import { getFeedbackOverrides } from './feedback';
import { getDataDisplayOverrides } from './dataDisplay';
import { getNavigationOverrides } from './navigation';

// ============================================================================
// Merge all component overrides
// ============================================================================

export const getComponentOverrides = (
  tokens: DesignTokens,
  mode: PaletteMode
): Components<Theme> => ({
  ...getSurfaceOverrides(tokens),
  ...getButtonOverrides(tokens),
  ...getInputOverrides(tokens),
  ...getFeedbackOverrides(tokens, mode),
  ...getDataDisplayOverrides(tokens),
  ...getNavigationOverrides(tokens),
});

export {
  getButtonOverrides,
  getInputOverrides,
  getSurfaceOverrides,
  getFeedbackOverrides,
  getDataDisplayOverrides,
  getNavigationOverrides,
};
