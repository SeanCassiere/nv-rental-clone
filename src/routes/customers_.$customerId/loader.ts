import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/customers/$customerId")(async ({
  context,
}) => {
  const { queryClient, viewCustomerSummaryOptions, viewCustomerOptions } =
    context;

  if (!context.auth.isAuthenticated) return;

  const promises = [];

  // get summary
  promises.push(queryClient.ensureQueryData(viewCustomerSummaryOptions));

  // get customer
  promises.push(queryClient.ensureQueryData(viewCustomerOptions));

  await Promise.all(promises);

  return;
});
