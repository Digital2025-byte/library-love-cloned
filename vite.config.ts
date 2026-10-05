// @lovable.dev/vite-tanstack-config already includes: TanStack devtools (dev-only),
// tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro, VITE_* env injection,
// the "@" path alias, React/TanStack dedupe, and error logger plugins.
// Do NOT re-add those here or the build breaks with duplicate plugins.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR
    // error wrapper). nitro/vite builds from this.
    server: { entry: "server" },
  },
  // Top-level `nitro` options are spread into Nitro's config by the Lovable
  // wrapper (whose default preset is cloudflare-module).
  //  - preset "node-server" → a standalone Node server (.output/server/index.mjs)
  //    for the Hostinger VPS.
  //  - inlineDynamicImports keeps the server in a single chunk. Without it,
  //    code-splitting puts the CommonJS-interop helper (__commonJSMin, used to
  //    wrap React) in a different chunk than the router chunk that calls it at
  //    load time, throwing "__commonJSMin is not a function" at runtime.
  nitro: {
    preset: "node-server",
    // @ts-expect-error — the wrapper's `nitro` type only declares preset/output/
    // cloudflare, but it spreads every key into Nitro, so this works at runtime.
    inlineDynamicImports: true,
  },
  vite: {
    // flychamadmin occupies 8080. Docs and VITE_CMS2_API_BASE_URL use 3000.
    server: {
      port: 3000,
      strictPort: true,
    },
  },
});
