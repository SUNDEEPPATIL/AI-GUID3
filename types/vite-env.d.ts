interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_GEMINI_API_URL?: string;
  // add other VITE_* env variables you expect here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}