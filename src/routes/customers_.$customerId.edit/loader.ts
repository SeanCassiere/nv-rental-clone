import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/customers/$customerId/edit")(async ({
  context,
}) => {
  const { queryClient, viewCustomerOptions } = context;

  if (!context.auth.isAuthenticated) return;

  const promises = [];

  promises.push(queryClient.ensureQueryData(viewCustomerOptions));

  await Promise.all(promises);

  return;
});
