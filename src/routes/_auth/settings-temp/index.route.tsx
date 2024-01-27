import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/settings-temp/")({
  component: () => <Navigate to="/settings-temp/profile" replace />,
});
