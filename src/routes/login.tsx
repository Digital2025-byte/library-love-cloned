import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error - JS page from the cloned app
import LoginPage from "@/app/auth/LoginPage";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — FlyCham CMS" },
      {
        name: "description",
        content: "Sign in to manage FlyCham CMS pages and components.",
      },
    ],
  }),
  component: LoginPage,
});
