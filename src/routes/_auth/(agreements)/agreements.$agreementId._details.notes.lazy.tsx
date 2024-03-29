import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";

import ModuleNotesTabContent from "@/components/primary-module/tabs/notes-content";

import { Container } from "@/routes/-components/container";

export const Route = createLazyFileRoute(
  "/_auth/(agreements)/agreements/$agreementId/_details/notes"
)({
  component: Component,
});

function Component() {
  const authParams = Route.useRouteContext({ select: (s) => s.authParams });
  const { agreementId } = Route.useParams();

  return (
    <Container as="div">
      <div className="mb-6 px-2 sm:px-4">
        <ModuleNotesTabContent
          module="agreements"
          referenceId={agreementId}
          clientId={authParams.clientId}
          userId={authParams.userId}
        />
      </div>
    </Container>
  );
}
