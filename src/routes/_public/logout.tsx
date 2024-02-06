import { createFileRoute } from "@tanstack/react-router";

import { LoadingPlaceholder } from "@/components/loading-placeholder";

export const Route = createFileRoute("/_public/logout")({
  loader: async ({ context, preload, navigate }) => {
    if (preload) return;

    const { auth } = context;

    if (!auth.isAuthenticated) {
      await navigate({
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
  component: LoadingPlaceholder,
});
