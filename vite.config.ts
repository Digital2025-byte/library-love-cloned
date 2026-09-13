// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import path from "path";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { transformWithOxc } from "vite";

const src = path.resolve(import.meta.dirname, "src");

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      {
        name: "js-as-jsx",
        enforce: "pre",
        async transform(code: string, id: string) {
          if (id.includes("node_modules") || !id.endsWith(".js")) {
            return null;
          }

          return transformWithOxc(code, id, {
            lang: "jsx",
            jsx: { runtime: "automatic" },
          });
        },
      },
    ],
    resolve: {
      alias: {
        "next/image": path.resolve(src, "lib/next-compat/image.jsx"),
        "next/link": path.resolve(src, "lib/next-compat/link.jsx"),
        "next/navigation": path.resolve(src, "lib/next-compat/navigation.js"),
        "next/dynamic": path.resolve(src, "lib/next-compat/dynamic.jsx"),
        "next/font/google": path.resolve(src, "lib/next-compat/font-google.js"),
      },
    },
  },
});
