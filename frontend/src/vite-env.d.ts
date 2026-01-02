/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TINYMCE_API_KEY: string;
  readonly VITE_API_BASE_URL: string;
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
