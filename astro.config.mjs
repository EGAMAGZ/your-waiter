import { defineConfig } from 'astro/config';

import deno from "@astrojs/deno"
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  devToolbar: {
    enabled: false,
  },
  output: 'server',
  adapter: deno()
});
