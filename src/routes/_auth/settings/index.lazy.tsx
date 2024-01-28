import { createLazyFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/settings/")({
  component: () => <Navigate to="/settings/profile" replace />,
});
