/// <reference types="vite/client" />

// augment the global types Vite provides
declare global {
  interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string;
    // add more VITE_* vars here
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// make this file a module so global augmentation sticks
export {};
