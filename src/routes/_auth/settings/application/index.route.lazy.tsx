import { createLazyFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/settings/application/")({
  component: () => <Navigate to="/settings/application/users" replace />,
});