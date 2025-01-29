import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { CustomerSummary } from "@/routes/_auth/-modules/summary/customer";
import { Container } from "@/routes/-components/container";

import { sortObjectKeys } from "@/lib/utils";

export const Route = createFileRoute(
  "/_auth/(customers)/customers/$customerId/_details/summary"
)({
  component: Component,
});

function Component() {
  const viewCustomerOptions = Route.useRouteContext({
    select: (s) => s.viewCustomerOptions,
  });
  const viewCustomerSummaryOptions = Route.useRouteContext({
    select: (s) => s.viewCustomerSummaryOptions,
  });

  const customerData = useSuspenseQuery(viewCustomerOptions);
  const customerSummary = useSuspenseQuery(viewCustomerSummaryOptions);

  const summaryData =
    customerSummary.data?.status === 200
      ? customerSummary.data?.body
      : undefined;

  return (
    <Container as="div">
      <div className="mb-6 grid max-w-full grid-cols-1 gap-4 px-2 focus:ring-0 sm:px-4 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-8">
          <div className="bg-card max-h-[500px] overflow-x-scroll p-4">
            <h2>Customer data</h2>
            <code className="text-xs">
              <pre>
                {JSON.stringify(sortObjectKeys(customerData.data), null, 2)}
              </pre>
            </code>
          </div>
        </div>
        {/*  */}
        <div className="flex flex-col gap-4 lg:col-span-4">
          <CustomerSummary summaryData={summaryData} />
        </div>
      </div>
    </Container>
  );
}
