import { createLazyFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/settings-temp/application/")({
  component: () => <Navigate to="/settings-temp/application/users" replace />,
});
