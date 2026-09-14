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
      {
        // Must run before the `@` alias: on Windows, Tabs/Drawer/Button
        // collide with shadcn's tabs.tsx, drawer.tsx, and button.tsx.
        name: "cms-ui-case-aliases",
        enforce: "pre",
        resolveId(id: string) {
          const map: Record<string, string> = {
            "@/components/ui/Tabs": path.resolve(src, "components/ui/Tabs/index.jsx"),
            "@/components/ui/Drawer": path.resolve(src, "components/ui/Drawer/index.jsx"),
            "@/components/ui/Button": path.resolve(src, "components/ui/Button.jsx"),
          };
          return map[id] ?? null;
        },
      },
    ],
    resolve: {
      alias: [
        // Windows is case-insensitive: "@/components/ui/Tabs" would otherwise
        // resolve to shadcn's tabs.tsx instead of the CMS Tabs folder.
        {
          find: /^@\/components\/ui\/Tabs$/,
          replacement: path.resolve(src, "components/ui/Tabs/index.jsx"),
        },
        {
          find: /^@\/components\/ui\/Drawer$/,
          replacement: path.resolve(src, "components/ui/Drawer/index.jsx"),
        },
        {
          find: /^@\/components\/ui\/Button$/,
          replacement: path.resolve(src, "components/ui/Button.jsx"),
        },
        {
          find: "next/image",
          replacement: path.resolve(src, "lib/next-compat/image.jsx"),
        },
        {
          find: "next/link",
          replacement: path.resolve(src, "lib/next-compat/link.jsx"),
        },
        {
          find: "next/navigation",
          replacement: path.resolve(src, "lib/next-compat/navigation.js"),
        },
        {
          find: "next/dynamic",
          replacement: path.resolve(src, "lib/next-compat/dynamic.jsx"),
        },
        {
          find: "next/font/google",
          replacement: path.resolve(src, "lib/next-compat/font-google.js"),
        },
      ],
    },
  },
});
