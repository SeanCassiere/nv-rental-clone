import { createLazyFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_auth/(settings)/settings/")({
  component: () => <Navigate to="/settings/profile" replace />,
});
