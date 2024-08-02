import { createFileRoute, redirect } from "@tanstack/react-router";

import { Container } from "@/routes/-components/container";
import { LoadingPlaceholder } from "@/routes/-components/loading-placeholder";

export const Route = createFileRoute("/_public/logout")({
  loader: async ({ context, preload }) => {
    if (preload) return;

    const { auth } = context;

    if (!auth.isAuthenticated) {
      throw redirect({
        to: "/logged-out",
      });
    }

    if (typeof window !== "undefined") {
      const localStorageKeyPrefix = `app-runtime:`;
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith(localStorageKeyPrefix))
        .forEach((key) => window.localStorage.removeItem(key));
    }

    await auth.removeUser();
    await auth.signoutRedirect();

    return;
  },
  component: function PageComponent() {
    return (
      <Container>
        <LoadingPlaceholder />
      </Container>
    );
  },
});
