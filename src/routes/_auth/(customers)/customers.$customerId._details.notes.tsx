import { createFileRoute } from "@tanstack/react-router";

import { fetchCustomerNotesByIdOptions } from "@/lib/query/customer";

export const Route = createFileRoute(
  "/_auth/(customers)/customers/$customerId/_details/notes"
)({
  beforeLoad: ({ context: { authParams: auth }, params: { customerId } }) => {
    return {
      viewCustomerNotesOptions: fetchCustomerNotesByIdOptions({
        auth,
        customerId,
      }),
    };
  },
  loader: async ({ context }) => {
    if (!context.auth.isAuthenticated) return;

    await context.queryClient.ensureQueryData(context.viewCustomerNotesOptions);

    return;
  },
});
