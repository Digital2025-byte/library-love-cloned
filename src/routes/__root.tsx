import type { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

// Backend-only service: the CMS editing UI now lives in flychamadmin (cms2).
// This app exposes the public CMS API under /api/public/*. The root route is a
// minimal shell so TanStack Start has a valid document for any non-API request.
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FlyCham CMS API" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  // Required: API routes render as children here. Removing <Outlet /> breaks them.
  return <Outlet />;
}

function NotFoundComponent() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 640 }}>
      <h1>FlyCham CMS API</h1>
      <p>This is a backend service. Available public endpoints:</p>
      <ul>
        <li><code>GET /api/public/get-pages</code></li>
        <li><code>GET /api/public/get-page?slug=&lt;slug&gt;</code></li>
        <li><code>POST /api/public/create-component</code></li>
        <li><code>POST /api/public/update-component</code></li>
        <li><code>POST /api/public/delete-component</code></li>
      </ul>
    </main>
  );
}
