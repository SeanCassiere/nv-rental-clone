import { createLazyFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute(
  "/_auth/settings-temp/application-configuration/"
)({
  component: () => (
    <Navigate to="/settings-temp/application-configuration/users" replace />
  ),
});
