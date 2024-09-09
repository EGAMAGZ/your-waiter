/// <reference path="../.astro/types.d.ts" />
interface ImportMetaEnv {
  readonly SUPABASE_URL: string
  readonly SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace App {
  interface Locals {
    user: {
      role: string;
    },
    welcomeTitle: () => string;
  }
}