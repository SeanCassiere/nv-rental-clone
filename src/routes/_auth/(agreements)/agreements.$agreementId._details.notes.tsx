import { createFileRoute } from "@tanstack/react-router";

import { fetchAgreementNotesByIdOptions } from "@/lib/query/agreement";

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
});
