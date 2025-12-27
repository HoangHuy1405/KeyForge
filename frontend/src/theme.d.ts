import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    gradient: string;
    input_background: string;
    outline: string;
    surfaceMuted: string;
    surfaceRaised: string;
    footer: string;
  }

  interface PaletteOptions {
    gradient?: string;
    input_background?: string;
    outline?: string;
    surfaceMuted?: string;
    surfaceRaised?: string;
    footer?: string;
  }

  interface TypeBackground {
    default: string;
    paper: string;
    contrast: string;
  }
}

// Augment the Theme to include custom tokens
declare module '@mui/material/styles' {
  interface Theme {
    // Add any custom theme properties here if needed
  }
  interface ThemeOptions {
    // Add any custom theme options here if needed
  }
}

export {};
