import { createLazyFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/settings-temp/")({
  component: () => <Navigate to="/settings-temp/profile" replace />,
});
