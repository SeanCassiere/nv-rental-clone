import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_auth/(agreements)/agreements/$agreementId/_details"
)();
