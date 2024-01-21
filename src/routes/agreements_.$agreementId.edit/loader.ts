import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/agreements/$agreementId/edit")(async ({
  context,
}) => {
  const { queryClient, viewAgreementOptions, viewAgreementSummaryOptions } =
    context;

  if (!context.auth.isAuthenticated) return;

  const promises = [];

  promises.push(queryClient.ensureQueryData(viewAgreementOptions));

  promises.push(queryClient.ensureQueryData(viewAgreementSummaryOptions));

  await Promise.all(promises);

  return;
});
