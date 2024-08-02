import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

import { fetchAgreementNotesByIdOptions } from "@/lib/query/agreement";

import ModuleNotesTabContent from "@/routes/_auth/-modules/tabs/notes-content";
import { Container } from "@/routes/-components/container";

export const Route = createFileRoute(
  "/_auth/(agreements)/agreements/$agreementId/_details/notes"
)({
  beforeLoad: ({ context: { authParams: auth }, params: { agreementId } }) => {
    return {
      viewAgreementNotesOptions: fetchAgreementNotesByIdOptions({
        auth,
        agreementId,
      }),
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    await context.queryClient.ensureQueryData(
      context.viewAgreementNotesOptions
    );

    return;
  },
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
