import { createFileRoute } from "@tanstack/react-router";

import { fetchCustomerNotesByIdOptions } from "@/lib/query/customer";

import ModuleNotesTabContent from "@/routes/_auth/-modules/tabs/notes-content";
import { Container } from "@/routes/-components/container";

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
  component: Component,
});

function Component() {
  const authParams = Route.useRouteContext({ select: (s) => s.authParams });
  const { customerId } = Route.useParams();

  return (
    <Container as="div">
      <div className="mb-6 px-2 sm:px-4">
        <ModuleNotesTabContent
          module="customers"
          referenceId={customerId}
          clientId={authParams.clientId}
          userId={authParams.userId}
        />
      </div>
    </Container>
  );
}
