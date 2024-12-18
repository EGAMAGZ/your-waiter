/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="preact" />
/// <reference types="@preact/signals-core" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    role: {
      id: number;
      name: string;
    }; // TODO: FIND A WAY TO USE THE TYPE FROM role.ts
    navigationOptions: {
      path: string;
      name: string;
    }[]; // TODO: FIND A WAY TO USE THE TYPE FROM role.ts
    worker: {
      id: number;
    };
    welcomeTitle: () => string;
    serverError?: string;
  }
}
