import { FileRouteLoader } from "@tanstack/react-router";

export const loader = FileRouteLoader("/agreements/$agreementId/check-in")(
  async ({ context }) => {
    const { queryClient, viewAgreementOptions, viewAgreementSummaryOptions } =
      context;
    const promises = [];

    promises.push(queryClient.ensureQueryData(viewAgreementOptions));

    promises.push(queryClient.ensureQueryData(viewAgreementSummaryOptions));

    await Promise.all(promises);

    return;
  }
);
