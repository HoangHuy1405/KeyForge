import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    gradient: string;
  }
  interface PaletteOptions {
    gradient?: string;
  }
}
