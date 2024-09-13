/// <reference path="../.astro/types.d.ts" />

import type { Role } from "./util/role";

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    role: Role;
    welcomeTitle: () => string;
    serverErrors?: string[];
  }
}
